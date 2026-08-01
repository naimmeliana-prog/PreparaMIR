"""
Genera explicaciones estructuradas para las preguntas del MIR utilizando
un pipeline robusto multimodelo con fallback automático: Groq, Gemini y OpenRouter.
Si uno falla o agota su cuota de tokens/peticiones, pasa automáticamente al siguiente.
"""
import os, sys, json, urllib.request, urllib.parse, time

# 1. Cargar claves de .env.local y variables de entorno de GitHub
base_dir = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
env_path = os.path.join(base_dir, ".env.local")
openrouter_key = None
gemini_key = None
groq_key = None
nvidia_key = None

if os.path.exists(env_path):
    with open(env_path, "r", encoding="utf-8") as f:
        for line in f:
            if line.startswith("OPENROUTER_API_KEY="):
                openrouter_key = line.split("=", 1)[1].strip()
            elif line.startswith("GEMINI_API_KEY="):
                gemini_key = line.split("=", 1)[1].strip()
            elif line.startswith("GROQ_API_KEY="):
                groq_key = line.split("=", 1)[1].strip()
            elif line.startswith("NVIDIA_API_KEY="):
                nvidia_key = line.split("=", 1)[1].strip()

# En GitHub Actions, si no se encuentran en .env.local, leer del entorno del sistema
if not openrouter_key:
    openrouter_key = os.environ.get("OPENROUTER_API_KEY")
if not gemini_key:
    gemini_key = os.environ.get("GEMINI_API_KEY")
if not groq_key:
    groq_key = os.environ.get("GROQ_API_KEY")
if not nvidia_key:
    nvidia_key = os.environ.get("NVIDIA_API_KEY")


def call_nvidia(prompt: str) -> str:
    if not nvidia_key:
        return None
    url = "https://integrate.api.nvidia.com/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {nvidia_key}",
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    data = {
        "model": "meta/llama-3.1-8b-instruct",
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
        err_msg = ""
        if hasattr(e, 'read'):
            try:
                err_msg = e.read().decode("utf-8")
            except:
                pass
        print(f"    ⚠️ NVIDIA falló: {e} | Detalle: {err_msg[:200]}")
    return None


def call_groq(prompt: str) -> str:
    if not groq_key:
        return None
    url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {groq_key}",
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    # Intentamos primero con Llama 8B por su límite TPM más alto
    data = {
        "model": "llama-3.1-8b-instant",
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
        err_msg = ""
        if hasattr(e, 'read'):
            try:
                err_msg = e.read().decode("utf-8")
            except:
                pass
        print(f"    ⚠️ Groq 8B falló: {e} | Detalle: {err_msg[:200]}")
        
        # Fallback alternativo al modelo pesado de 70B
        try:
            data["model"] = "llama-3.3-70b-versatile"
            req2 = urllib.request.Request(url, data=json.dumps(data).encode("utf-8"), headers=headers)
            with urllib.request.urlopen(req2) as response2:
                res_data2 = json.loads(response2.read().decode("utf-8"))
                return res_data2["choices"][0]["message"]["content"]
        except Exception as e2:
            err_msg2 = ""
            if hasattr(e2, 'read'):
                try:
                    err_msg2 = e2.read().decode("utf-8")
                except:
                    pass
            print(f"    ⚠️ Groq 70B falló: {e2} | Detalle: {err_msg2[:200]}")
            
    return None


def call_gemini(prompt: str) -> str:
    if not gemini_key:
        return None
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={gemini_key}"
    headers = {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
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
        err_msg = ""
        if hasattr(e, 'read'):
            try:
                err_msg = e.read().decode("utf-8")
            except:
                pass
        print(f"    ⚠️ Gemini falló: {e} | Detalle: {err_msg[:200]}")
    return None


def call_openrouter(prompt: str) -> str:
    if not openrouter_key:
        return None
    url = "https://openrouter.ai/api/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {openrouter_key}",
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "MIR Preparador",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
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
        err_msg = ""
        if hasattr(e, 'read'):
            try:
                err_msg = e.read().decode("utf-8")
            except:
                pass
        print(f"    ⚠️ OpenRouter falló: {e} | Detalle: {err_msg[:200]}")
    return None


def call_any_api(prompt: str) -> str:
    # 1. Intentar con Groq
    if groq_key:
        res = call_groq(prompt)
        if res:
            time.sleep(12)
            return res
            
    # 2. Fallback a NVIDIA API (Excelente alternativa gratuita en la nube)
    if nvidia_key:
        print("    -> Fallback: Intentando con NVIDIA API...")
        res = call_nvidia(prompt)
        if res:
            time.sleep(5)
            return res
            
    # 3. Fallback a Gemini
    if gemini_key:
        print("    -> Fallback: Intentando con Gemini...")
        res = call_gemini(prompt)
        if res:
            time.sleep(4)
            return res
            
    # 4. Fallback a OpenRouter
    if openrouter_key:
        print("    -> Fallback: Intentando con OpenRouter...")
        res = call_openrouter(prompt)
        if res:
            time.sleep(2)
            return res
            
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
            
        is_generic = q["explanation"].startswith("Pregunta oficial número")
        
        # Si la explicación ya ha sido generada (ya no es genérica), la saltamos
        if not is_generic:
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
        res_json_str = call_any_api(prompt)
        
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
            except Exception as e:
                print(f"  ⚠️ Error procesando respuesta JSON de la IA: {e}")
        else:
            print("  ❌ Ninguna de las APIs pudo procesar esta pregunta. Pausando 30 segundos por rate limits...")
            time.sleep(30)
            
    print(f"📊 MIR {year} finalizado. Se actualizaron {modified} preguntas.")
    return modified

if __name__ == "__main__":
    y = sys.argv[1] if len(sys.argv) > 1 else "auto"
    lim = int(sys.argv[2]) if len(sys.argv) > 2 else 1050
    
    letras = ["A", "B", "C", "D"]
    
    if y == "auto":
        print(f"🤖 Ejecución automática multimodelo: buscando hasta {lim} preguntas pendientes entre todos los años...")
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
