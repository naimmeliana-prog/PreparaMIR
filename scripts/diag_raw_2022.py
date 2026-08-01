"""Muestra el texto raw alrededor de preguntas 15, 40, 128, 138 en el PDF de 2022"""
import os, sys, re

try:
    import pdfplumber
except ImportError:
    sys.exit("pip install pdfplumber")

base_dir = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
pdf_path = os.path.join(base_dir, "Examen MIR 2022", "Examen MIR 2022", "Respuestas_2022.pdf")

targets = {15, 40, 128, 138}
full_text = ""
with pdfplumber.open(pdf_path) as pdf:
    for page in pdf.pages:
        t = page.extract_text()
        if t:
            full_text += t + "\n"

lines = full_text.split('\n')
for i, line in enumerate(lines):
    nums = set(int(m) for m in re.findall(r'\b(\d+)\b', line) if 1 <= int(m) <= 210)
    if nums & targets:
        # Mostrar 2 líneas de contexto
        start = max(0, i-1)
        end = min(len(lines), i+2)
        print(f"\n--- Líneas {start+1}-{end} ---")
        for j in range(start, end):
            marker = ">>>" if j == i else "   "
            print(f"{marker} [{j+1}]: '{lines[j]}'")
