import os
import json
import glob

base_dir = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
json_path = os.path.join(base_dir, "src", "lib", "data", "mir_2025.json")

print("=== DIAGNÓSTICO DE COINCIDENCIA DE IMÁGENES ===")

if os.path.exists(json_path):
    with open(json_path, "r", encoding="utf-8") as f:
        questions = json.load(f)
        
    print(f"Total preguntas en JSON 2025: {len(questions)}")
    for q in questions[:10]:
        q_num = q.get("localNumber")
        stem = q.get("stem", "")
        img_path = os.path.join(base_dir, "public", "images", "exams", "2025", f"pregunta_{q_num}.png")
        exists = os.path.exists(img_path)
        
        print(f"Pregunta {q_num}:")
        print(f"  Enunciado (inicio): {stem[:120]}...")
        print(f"  Archivo imagen: public/images/exams/2025/pregunta_{q_num}.png -> Existe: {exists}")
        print("-" * 50)
else:
    print("No se encontró mir_2025.json")
