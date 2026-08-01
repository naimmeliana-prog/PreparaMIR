"""
Parsea los PDFs de respuestas oficiales MIR 2021 y 2022
y actualiza los correctIndex en los JSON correspondientes.
Formato: columnas "V R" donde R es 1-4 (1=A,2=B,3=C,4=D → correctIndex 0-3)
Preguntas anuladas no tienen respuesta (correctIndex = -1).
"""
import os, sys, re, json

try:
    import pdfplumber
except ImportError:
    sys.exit("pip install pdfplumber")

base_dir = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))

def parse_answers_from_text(text: str) -> dict[int, int | None]:
    """
    Devuelve {num_pregunta: respuesta_correcta_1indexed | None(anulada)}
    Procesa línea a línea para evitar ambigüedad entre Q1-4 y respuestas 1-4.
    """
    answers: dict[int, int | None] = {}

    for line in text.split('\n'):
        # Extraer solo tokens numéricos de esta línea (1..210)
        tokens = []
        for m in re.findall(r'\b(\d+)\b', line):
            n = int(m)
            if 1 <= n <= 210:
                tokens.append(n)

        if len(tokens) < 2:
            continue  # línea sin parejas

        i = 0
        while i < len(tokens):
            q = tokens[i]
            if q in answers:  # ya procesado (duplicado en otra sección del PDF)
                i += 1
                continue

            if i + 1 < len(tokens):
                nxt = tokens[i + 1]
                if 1 <= nxt <= 4:
                    # nxt es respuesta si el token tras él es mayor que q (o no existe)
                    after_ok = (i + 2 >= len(tokens)) or (tokens[i + 2] > q)
                    if after_ok:
                        answers[q] = nxt
                        i += 2
                        continue

            # Sin respuesta válida → anulada
            answers[q] = None
            i += 1

    return answers


def update_json(year: str, answers: dict[int, int | None]):
    json_path = os.path.join(base_dir, "src", "lib", "data", f"mir_{year}.json")
    if not os.path.exists(json_path):
        print(f"  ❌ No encontrado: {json_path}")
        return

    with open(json_path, encoding="utf-8") as f:
        questions = json.load(f)

    updated = 0
    for q in questions:
        local_num = q.get("localNumber")
        if local_num is None:
            continue
        if local_num in answers:
            ans = answers[local_num]
            if ans is None:
                new_idx = -1  # anulada
            else:
                new_idx = ans - 1  # 1-indexed → 0-indexed
            if q.get("correctIndex") != new_idx:
                q["correctIndex"] = new_idx
                updated += 1

    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(questions, f, ensure_ascii=False, indent=2)

    print(f"  ✅ {year}: {updated} respuestas actualizadas → {json_path}")


for year in ["2021", "2022"]:
    exam_subdir = os.path.join(base_dir, f"Examen MIR {year}", f"Examen MIR {year}")
    pdf_path = os.path.join(exam_subdir, f"Respuestas_{year}.pdf")

    print(f"\n{'='*55}")
    print(f"  Procesando MIR {year}...")

    if not os.path.exists(pdf_path):
        print(f"  ❌ PDF no encontrado: {pdf_path}")
        continue

    full_text = ""
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            t = page.extract_text()
            if t:
                full_text += t + "\n"

    answers = parse_answers_from_text(full_text)
    found = len([v for v in answers.values() if v is not None])
    annulled = len([v for v in answers.values() if v is None])
    print(f"  Preguntas leídas: {len(answers)} ({found} con respuesta, {annulled} anuladas)")

    if len(answers) < 180:
        print(f"  ⚠️  Demasiado pocas preguntas leídas, revisando...")
    else:
        update_json(year, answers)

print("\n¡Listo! Recarga la web para ver los cambios.")
