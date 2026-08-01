import os
import json

base_dir = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
json_path = os.path.join(base_dir, "src", "lib", "data", "mir_2025.json")

print("=== DEPURACIÓN DE PREGUNTAS Y SU ENUNCIADO EN MIR_2025.JSON ===")
if os.path.exists(json_path):
    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    print(f"Total preguntas en JSON 2025: {len(data)}")
    for q in data[:6]:
        print(f"\nPregunta #{q.get('localNumber')}:")
        print(f"  Category: {q.get('category')}")
        print(f"  Stem: {repr(q.get('stem'))}")
        print(f"  Options: {q.get('options')}")
else:
    print(f"No existe: {json_path}")
