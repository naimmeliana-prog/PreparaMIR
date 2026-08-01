import json, os
base_dir = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
j_path = os.path.join(base_dir, "src", "lib", "data", "mir_2025.json")
out_path = os.path.join(base_dir, "scripts", "check_q11_q12.py")
code = f"""
import json
with open(r'{j_path}', encoding='utf-8') as f:
    d = json.load(f)
    print("Q11:", d[10].get('stem', ''))
    print("Q12:", d[11].get('stem', ''))
"""
with open(out_path, "w", encoding="utf-8") as f:
    f.write(code)
import subprocess
try:
    res = subprocess.check_output(["python", out_path], text=True, encoding='utf-8')
    with open(os.path.join(base_dir, "scripts", "out_q11.txt"), "w", encoding="utf-8") as f:
        f.write(res)
except Exception as e:
    pass
