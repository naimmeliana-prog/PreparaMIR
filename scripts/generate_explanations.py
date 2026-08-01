"""
Genera explicaciones estructuradas para las preguntas del MIR utilizando
Google AI Studio (Gemini), Groq (Llama), o OpenRouter.
Si se detecta GROQ_API_KEY, se usará Groq con un límite de 14,400 peticiones diarias gratuitas.
"""
import os, sys, json, urllib.request, urllib.parse, time

# 1. Cargar claves de .env.local
base_dir = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
env_path = os.path.join(base_dir, ".env.local")
openrouter_key = None
gemini_key = None
groq_key = None

if os.path.exists(env_path):
    with open(env_path, "r", encoding="utf-8") as f:
        for line in f:
            if line.startswith("OPENROUTER_API_KEY="):
                openrouter_key = line.split("=", 1)[1].strip()
            elif line.startswith("GEMINI_API_KEY="):
                gemini_key = line.split("=", 1)[1].strip()
            elif line.startswith("GROQ_API_KEY="):
                groq_key = line.split("=", 1)[1].strip()

# Prioridad de APIs:
# 1. Groq (gratis, 14,400 req/día, funciona en España sin geobloqueo)
# 2. Gemini (1500 req/día, requiere saltarse geobloqueo en local)
# 3. OpenRouter (capa gratuita de 50 req/día)
api_mode = None
if groq_key:
    api_mode = "groq"
    print("⚡ Clave de Groq (Llama) detectada. Límite: 14,400 peticiones gratuitas al día.")
elif gemini_key:
    api_mode = "gemini"
    print("✨ Clave de Google AI Studio (Gemini) detectada. Límite diario: 1500 peticiones.")
elif openrouter_key:
    api_mode = "openrouter"
    print("🌐 Clave de OpenRouter detectada. Límite diario: 50 peticiones.")
else:
    sys.exit("❌ Error: No se encontró GROQ_API_KEY, GEMINI_API_KEY ni OPENROUTER_API_KEY en .env.local.")


def call_groq(prompt: str) -> str:
    url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {groq_key}",
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    data = {
        "model": "llama-3.3-70b-versatile", # Modelo gratuito principal activo en Groq
        "messages": [{"role": "user", "content": prompt}],
        "response_format": {"type": "json_object"},
        "temperature": 0.7
    }
    
    req = urllib.request.Request(url, data=json.dumps(data).encode("utf-8"), headers=headers)
    try:
        with urllib.request.urlopen(req) as response:
            res_data = json.loads(response.read().decode("utf-8"))
            return res_data["choices"][0]["message"]["content"]
    except Exception as e:
        print(f"  ❌ Error en Groq API: {e}")
        if hasattr(e, 'read'):
            print(e.read().decode("utf-8"))
        # Si falla, reintentar con el modelo ligero de fallback activo (llama-3.1-8b-instant)
        try:
            data["model"] = "llama-3.1-8b-instant"
            req2 = urllib.request.Request(url, data=json.dumps(data).encode("utf-8"), headers=headers)
            with urllib.request.urlopen(req2) as response2:
                res_data2 = json.loads(response2.read().decode("utf-8"))
                return res_data2["choices"][0]["message"]["content"]
        except Exception as e2:
            print(f"  ❌ Reintento con Llama 8B fallido: {e2}")
            if hasattr(e2, 'read'):
                print(e2.read().decode("utf-8"))
        return None


def call_gemini(prompt: str) -> str:
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={gemini_key}"
    headers = {"Content-Type": "application/json"}
    data = {
        "contents": [{
            "parts": [{"text": prompt}]
        }],
        "generationConfig": {
            "responseMimeType": "application/json"
        }
    }
    req = urllib.request.Request(url, data=json.dumps(data).encode("utf-8"), headers=headers)
    try:
        with urllib.request.urlopen(req) as response:
            res_data = json.loads(response.read().decode("utf-8"))
            return res_data["candidates"][0]["content"]["parts"][0]["text"]
    except Exception as e:
        print(f"  ❌ Error en Gemini API: {e}")
        return None


def call_openrouter(prompt: str) -> str:
    url = "https://openrouter.ai/api/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {openrouter_key}",
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "MIR Preparador"
    }
    data = {
        "model": "openrouter/free",
        "messages": [{"role": "user", "content": prompt}],
        "response_format": {"type": "json_object"},
        "max_tokens": 2000
    }
    req = urllib.request.Request(url, data=json.dumps(data).encode("utf-8"), headers=headers)
    try:
        with urllib.request.urlopen(req) as response:
            res_data = json.loads(response.read().decode("utf-8"))
            return res_data["choices"][0]["message"]["content"]
    except Exception as e:
        print(f"  ❌ Error en OpenRouter API: {e}")
        return None


def process_questions(year: str, limit: int = 210) -> int:
    json_path = os.path.join(base_dir, "src", "lib", "data", f"mir_{year}.json")
    if not os.path.exists(json_path):
        print(f"❌ No se encontró {json_path}")
        return 0
        
    with open(json_path, "r", encoding="utf-8") as f:
        questions = json.load(f)

    print(f"\n🚀 Analizando MIR {year}...")
    
    modified = 0
    for idx, q in enumerate(questions):
        if modified >= limit:
            break
            
        words = [x for x in q["stem"].split() if len(x) > 0]
        has_letter_gaps = any(len(x) == 1 for x in words[:15])
        has_broken_spaces = "  " in q["stem"] or any("  " in opt for opt in q["options"]) or has_letter_gaps
        is_generic = q["explanation"].startswith("Pregunta oficial número")
        
        if not is_generic and not has_broken_spaces:
            continue
            
        print(f"  [{modified+1}/{limit}] Procesando Pregunta {q['localNumber']} en MIR {year}...")
        
        letra_correcta = letras[q['correctIndex']]
        
        prompt = f"""
Eres un tutor experto en la preparación del examen médico MIR.
Analiza la siguiente pregunta del examen MIR:

ENUNCIADO ORIGINAL:
{q['stem']}

OPCIONES:
{json.dumps(q['options'], ensure_ascii=False)}

OPCIÓN CORRECTA (Letra A-D):
{letra_correcta}

TAREAS:
1. Corrige cualquier palabra entrecortada o letras separadas por espacios tanto en el ENUNCIADO como en las OPCIONES para que se lea en español fluido y correcto (ej: "d e  g r a n d e s" -> "de grandes", "e s f u e r z o s" -> "esfuerzos").
2. Genera una explicación estructurada en español usando Markdown. Debes justificar cada una de las opciones (A, B, C y D) de forma individual.
   IMPORTANTE: Estructura la explicación exactamente de esta forma, utilizando viñetas y círculos de colores:
   - **🟢 Opción {letra_correcta} (Correcta):** [Explicación detallada de por qué esta opción es la correcta clínicamente]
   - Para las otras tres opciones incorrectas, usa el formato: **🔴 Opción X (Incorrecta):** [Explicación detallada de por qué esta opción no es la adecuada en este caso]
   - Escribe un párrafo final corto a modo de conclusión o "perla MIR" para memorizar el concepto clave.

Devuelve EXCLUSIVAMENTE un objeto JSON válido con este formato exacto:
{{
  "cleaned_stem": "Enunciado limpio y sin espacios rotos",
  "cleaned_options": ["Opción A limpia", "Opción B limpia", "Opción C limpia", "Opción D limpia"],
  "explanation": "Texto de la explicación estructurado con las viñetas de 🟢 y 🔴 y la perla MIR."
}}
"""
        # Seleccionar API activa
        if api_mode == "groq":
            res_json_str = call_groq(prompt)
        elif api_mode == "gemini":
            res_json_str = call_gemini(prompt)
        else:
            res_json_str = call_openrouter(prompt)
        
        if res_json_str:
            try:
                res_data = json.loads(res_json_str)
                q["stem"] = res_data["cleaned_stem"]
                q["options"] = res_data["cleaned_options"]
                q["explanation"] = res_data["explanation"]
                modified += 1
                
                # Guardar progreso cada pregunta
                with open(json_path, "w", encoding="utf-8") as f:
                    json.dump(questions, f, ensure_ascii=False, indent=2)
                
                # Pausa para evitar límites por minuto
                if api_mode == "gemini":
                    time.sleep(4)
                elif api_mode == "groq":
                    time.sleep(2) # Pausa corta para no saturar
            except Exception as e:
                print(f"  ⚠️ Error procesando respuesta JSON de la IA: {e}")
        else:
            print("  ⚠️ No se pudo obtener respuesta de la API.")
            
    print(f"📊 MIR {year} finalizado. Se actualizaron {modified} preguntas.")
    return modified

if __name__ == "__main__":
    y = sys.argv[1] if len(sys.argv) > 1 else "auto"
    # Límite por defecto según la API activa
    default_limit = 210 if api_mode in ["gemini", "groq"] else 45
    lim = int(sys.argv[2]) if len(sys.argv) > 2 else default_limit
    
    letras = ["A", "B", "C", "D"]
    
    if y == "auto":
        print(f"🤖 Ejecución automática: buscando hasta {lim} preguntas pendientes entre todos los años...")
        total_procesadas = 0
        for year in ["2025", "2024", "2023", "2022", "2021"]:
            if total_procesadas >= lim:
                break
            restantes = lim - total_procesadas
            procesadas = process_questions(year, restantes)
            total_procesadas += procesadas
        print(f"\n✅ Proceso automático terminado. Total actualizado hoy: {total_procesadas} preguntas.")
    else:
        process_questions(y, lim)
