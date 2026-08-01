import os
import glob

base_dir = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
print(f"Buscando PDFs en: {base_dir}")

pdfs = glob.glob(os.path.join(base_dir, "**", "*.pdf"), recursive=True)
for p in pdfs:
    rel_path = os.path.relpath(p, base_dir)
    print(f"  - {rel_path}")
