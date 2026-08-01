"""
Genera explicaciones estructuradas para las preguntas del MIR utilizando
ya sea Google AI Studio (Gemini API) o OpenRouter.
Si se detecta GEMINI_API_KEY, se usará Gemini directamente con un límite de 1500 peticiones diarias gratuitas.
"""
import os, sys, json, urllib.request, urllib.parse, time

# 1. Cargar claves de .env.local
base_dir = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
env_path = os.path.join(base_dir, ".env.local")
openrouter_key = None
gemini_key = None

if os.path.exists(env_path):
    with open(env_path, "r", encoding="utf-8") as f:
        for line in f:
            if line.startswith("OPENROUTER_API_KEY="):
                openrouter_key = line.split("=", 1)[1].strip()
            elif line.startswith("GEMINI_API_KEY="):
                gemini_key = line.split("=", 1)[1].strip()

# Si no están en .env.local, leer de las variables de entorno del sistema (para GitHub Actions)
if not openrouter_key:
    openrouter_key = os.environ.get("OPENROUTER_API_KEY")
if not gemini_key:
    gemini_key = os.environ.get("GEMINI_API_KEY")

# Prioridad: usar Gemini API directa si está disponible por su límite de 1500/día
api_mode = None
if gemini_key:
    api_mode = "gemini"
    print("✨ Clave de Google AI Studio (Gemini) detectada. Límite diario: 1500 peticiones gratuitas.")
elif openrouter_key:
    api_mode = "openrouter"
    print("🌐 Clave de OpenRouter detectada. Límite diario: 50 peticiones gratuitas.")
else:
    sys.exit("❌ Error: No se encontró ni GEMINI_API_KEY ni OPENROUTER_API_KEY en .env.local.")


def call_gemini(prompt: str) -> str:
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={gemini_key}"
    headers = {"Content-Type": "application/json"}
    
    # Payload para la API nativa de Google Gemini
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
        if hasattr(e, 'read'):
            print(e.read().decode("utf-8"))
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
        if hasattr(e, 'read'):
            print(e.read().decode("utf-8"))
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
            
        # Comprobar si hay letras sueltas al principio del enunciado
        words = [x for x in q["stem"].split() if len(x) > 0]
        has_letter_gaps = any(len(x) == 1 for x in words[:15])
        has_broken_spaces = "  " in q["stem"] or any("  " in opt for opt in q["options"]) or has_letter_gaps
        is_generic = q["explanation"].startswith("Pregunta oficial número")
        
        # Si ya está limpia y tiene justificación real, la saltamos
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
        # Seleccionar API según el modo activo
        res_json_str = call_gemini(prompt) if api_mode == "gemini" else call_openrouter(prompt)
        
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
                
                # Pequeña pausa en modo Gemini para respetar el límite de 15 peticiones por minuto
                if api_mode == "gemini":
                    time.sleep(4) # 4 segundos asegura max 15 req/min
            except Exception as e:
                print(f"  ⚠️ Error procesando respuesta JSON de la IA: {e}")
        else:
            print("  ⚠️ No se pudo obtener respuesta de la API.")
            
    print(f"📊 MIR {year} finalizado. Se actualizaron {modified} preguntas.")
    return modified

if __name__ == "__main__":
    y = sys.argv[1] if len(sys.argv) > 1 else "auto"
    # Límite por defecto: 45 si es OpenRouter, 210 (año completo) si es Gemini
    default_limit = 210 if api_mode == "gemini" else 45
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
