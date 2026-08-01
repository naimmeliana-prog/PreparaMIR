import os
import re
import pypdf

base_dir = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
pdf_path = os.path.join(base_dir, "Examen MIR 2025", "Examen MIR 2025 - Imagenes.pdf")

reader = pypdf.PdfReader(pdf_path)
print("=== TEXTO COMPLETO LÍNEA A LÍNEA DE CADA PÁGINA DE IMÁGENES (2025) ===")

for i, page in enumerate(reader.pages):
    text = page.extract_text() or ""
    lines = [l.strip() for l in text.split("\n") if l.strip()]
    print(f"\n--- PAGINA {i+1} ---")
    for idx, line in enumerate(lines):
        print(f"  Línea {idx+1}: {repr(line)}")
