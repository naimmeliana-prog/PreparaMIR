"""Muestra qué preguntas han quedado marcadas como anuladas en 2022"""
import os, sys, re, json

try:
    import pdfplumber
except ImportError:
    sys.exit("pip install pdfplumber")

base_dir = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))


def parse_answers_from_text(text):
    answers = {}
    for line in text.split('\n'):
        tokens = []
        for m in re.findall(r'\b(\d+)\b', line):
            n = int(m)
            if 1 <= n <= 210:
                tokens.append(n)
        if len(tokens) < 2:
            continue
        i = 0
        while i < len(tokens):
            q = tokens[i]
            if q in answers:
                i += 1
                continue
            if i + 1 < len(tokens):
                nxt = tokens[i + 1]
                if 1 <= nxt <= 4:
                    after_ok = (i + 2 >= len(tokens)) or (tokens[i + 2] > q)
                    if after_ok:
                        answers[q] = nxt
                        i += 2
                        continue
            answers[q] = None
            i += 1
    return answers


year = "2022"
pdf_path = os.path.join(base_dir, f"Examen MIR {year}", f"Examen MIR {year}", f"Respuestas_{year}.pdf")

full_text = ""
with pdfplumber.open(pdf_path) as pdf:
    for page in pdf.pages:
        t = page.extract_text()
        if t:
            full_text += t + "\n"

answers = parse_answers_from_text(full_text)
annulled = sorted([q for q, a in answers.items() if a is None])
print(f"Preguntas anuladas en {year}: {annulled}")

# Mostrar contexto de texto alrededor de cada anulada para depuración
for q in annulled:
    # Buscar la línea que contiene ese número
    for line in full_text.split('\n'):
        nums = re.findall(r'\b\d+\b', line)
        if str(q) in nums:
            print(f"  Q{q}: línea → '{line.strip()}'")
            break
