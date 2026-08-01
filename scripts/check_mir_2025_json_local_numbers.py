import json
import os

base_dir = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
json_path = os.path.join(base_dir, "src", "lib", "data", "mir_2025.json")

with open(json_path, "r", encoding="utf-8") as f:
    data = json.load(f)

print(f"Total preguntas en mir_2025.json: {len(data)}")
print("=== PRIMERAS 10 PREGUNTAS EN JSON DE 2025 ===")
for idx, q in enumerate(data[:10]):
    print(f"Index [{idx}]: id='{q.get('id')}', localNumber={q.get('localNumber')}")
    print(f"  Stem: '{q.get('stem')[:80]}...'")
