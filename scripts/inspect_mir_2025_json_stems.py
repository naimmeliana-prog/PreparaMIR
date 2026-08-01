import json
import os

base_dir = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
json_path = os.path.join(base_dir, "src", "lib", "data", "mir_2025.json")

with open(json_path, "r", encoding="utf-8") as f:
    data = json.load(f)

print("=== DEPURACIÓN DE PREGUNTAS 1 A 10 EN MIR_2025.JSON ===")
for q in data[:10]:
    print(f"\nPregunta #{q.get('localNumber')}:")
    print(f"  Stem: {q.get('stem')[:120]}...")
