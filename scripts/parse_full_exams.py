import os
import sys
import re
import json
import glob

try:
    import pypdf
except ImportError:
    print("Error: La biblioteca 'pypdf' no está instalada.")
    print("Por favor, instálala ejecutando: pip install pypdf")
    sys.exit(1)

def parse_answers_pdf(pdf_path):
    """
    Intenta extraer las respuestas correctas de la plantilla oficial.
    Busca patrones de número de pregunta y respuesta (p.ej., '1.- 3' o '1 3').
    Devuelve un diccionario { numero_pregunta: indice_correcto (0-3) }.
    """
    answers = {}
    if not os.path.exists(pdf_path):
        print(f"  Plantilla de respuestas no encontrada en: {pdf_path}")
        return answers
        
    try:
        reader = pypdf.PdfReader(pdf_path)
        full_text = ""
        for page in reader.pages:
            full_text += page.extract_text() or ""
            
        # Buscar patrones del tipo "Pregunta Respuesta"
        # Ejemplos comunes: "1 2" (pregunta 1, respuesta 2), "105.- 4", "7. 1"
        # Buscamos números del 1 al 210 seguidos de una respuesta del 1 al 4
        pairs = re.findall(r"\b(\d{1,3})\s*[\.\-]*\s*([1-4])\b", full_text)
        for q_str, ans_str in pairs:
            q_num = int(q_str)
            ans_val = int(ans_str) - 1 # Convertir a índice 0-3
            if 1 <= q_num <= 210:
                answers[q_num] = ans_val
                
        print(f"  -> Respuestas mapeadas: {len(answers)} de la plantilla.")
    except Exception as e:
        print(f"  Error parseando respuestas: {e}")
    return answers

def parse_questions_pdf(pdf_path, answers_map):
    """
    Extrae secuencialmente las 210 preguntas oficiales y sus 4 opciones.
    Garantiza que no haya saltos de página ni de límites de pregunta erróneos
    al avanzar la búsqueda después de la última opción de la pregunta anterior.
    """
    questions = []
    if not os.path.exists(pdf_path):
        print(f"  Examen PDF no encontrado en: {pdf_path}")
        return questions

    try:
        reader = pypdf.PdfReader(pdf_path)
        full_text = ""
        for page_idx, page in enumerate(reader.pages):
            page_text = page.extract_text() or ""
            # Saltar la página si contiene palabras clave exclusivas de las instrucciones de la portada
            if page_idx < 3 and any(k in page_text for k in ["ADVERTENCIA IMPORTANTE", "ANTES DE COMENZAR", "CUADERNO DE EXAMEN", "Hoja de Respuestas"]):
                print(f"  -> Omitiendo página {page_idx + 1} (detectada como portada/instrucciones).")
                continue
            full_text += page_text + "\n"

        current_pos = 0
        
        for q_num in range(1, 211):
            # Buscar el inicio de la pregunta q_num a partir de current_pos
            pattern = rf"\n\s*{q_num}\s*\.\s+"
            header_len = 0
            
            if q_num == 1:
                # Caso especial para la primera pregunta
                match = re.search(pattern, full_text[current_pos:])
                if match:
                    start_idx = current_pos + match.start()
                    header_len = len(match.group(0))
                else:
                    match_start = re.search(r"^\s*1\s*\.\s+", full_text)
                    if match_start:
                        start_idx = match_start.start()
                        header_len = len(match_start.group(0))
                    else:
                        start_idx = 0
                        header_len = 3
            else:
                match = re.search(pattern, full_text[current_pos:])
                if match:
                    start_idx = current_pos + match.start()
                    header_len = len(match.group(0))
                else:
                    # Intento alternativo por límites flojos de palabra
                    match_loose = re.search(rf"\b{q_num}\s*\.\s+", full_text[current_pos:])
                    if match_loose:
                        start_idx = current_pos + match_loose.start()
                        header_len = len(match_loose.group(0))
                    else:
                        print(f"  [!] No se pudo localizar la pregunta {q_num} en el texto.")
                        continue

            # Buscar las 4 opciones a partir de justo DESPUÉS del encabezado de la pregunta
            opt_matches = []
            opt_search_pos = start_idx + header_len
            
            # Opción 1
            match_opt1 = re.search(r"\n\s*1\s*\.\s+", full_text[opt_search_pos:])
            if not match_opt1:
                match_opt1 = re.search(r"\b1\s*\.\s+", full_text[opt_search_pos:])
            if not match_opt1:
                continue
            pos1 = opt_search_pos + match_opt1.start()
            len1 = len(match_opt1.group(0))
            opt_matches.append((1, pos1, pos1 + len1))
            opt_search_pos = pos1 + len1

            # Opción 2
            match_opt2 = re.search(r"\n\s*2\s*\.\s+", full_text[opt_search_pos:])
            if not match_opt2:
                match_opt2 = re.search(r"\b2\s*\.\s+", full_text[opt_search_pos:])
            if not match_opt2:
                continue
            pos2 = opt_search_pos + match_opt2.start()
            len2 = len(match_opt2.group(0))
            opt_matches.append((2, pos2, pos2 + len2))
            opt_search_pos = pos2 + len2

            # Opción 3
            match_opt3 = re.search(r"\n\s*3\s*\.\s+", full_text[opt_search_pos:])
            if not match_opt3:
                match_opt3 = re.search(r"\b3\s*\.\s+", full_text[opt_search_pos:])
            if not match_opt3:
                continue
            pos3 = opt_search_pos + match_opt3.start()
            len3 = len(match_opt3.group(0))
            opt_matches.append((3, pos3, pos3 + len3))
            opt_search_pos = pos3 + len3

            # Opción 4
            match_opt4 = re.search(r"\n\s*4\s*\.\s+", full_text[opt_search_pos:])
            if not match_opt4:
                match_opt4 = re.search(r"\b4\s*\.\s+", full_text[opt_search_pos:])
            if not match_opt4:
                continue
            pos4 = opt_search_pos + match_opt4.start()
            len4 = len(match_opt4.group(0))
            opt_matches.append((4, pos4, pos4 + len4))
            
            # El fin del bloque de la pregunta (y el final de la opción 4)
            # se delimita buscando el inicio de la siguiente pregunta en el texto restante.
            next_q_pattern = rf"\n\s*{q_num+1}\s*\.\s+"
            match_next = re.search(next_q_pattern, full_text[pos4 + len4:])
            if match_next:
                end_of_opt4 = pos4 + len4 + match_next.start()
            else:
                match_next_loose = re.search(rf"\b{q_num+1}\s*\.\s+", full_text[pos4 + len4:])
                if match_next_loose:
                    end_of_opt4 = pos4 + len4 + match_next_loose.start()
                else:
                    end_of_opt4 = pos4 + len4 + 1800 # límite de seguridad

            # Extraemos los textos de la pregunta y sus opciones
            stem = full_text[start_idx:pos1].strip()
            stem = re.sub(rf"^\s*{q_num}\s*[\.\-]\s+", "", stem)
            
            opt1 = full_text[pos1 + len1:pos2].strip()
            opt2 = full_text[pos2 + len2:pos3].strip()
            opt3 = full_text[pos3 + len3:pos4].strip()
            opt4 = full_text[pos4 + len4:end_of_opt4].strip()

            # Limpiar las opciones de posibles marcas de pie de página que aparezcan al final de la opción 4
            opt4 = re.sub(r"\n\s*--- PAGINA \d+ ---.*$", "", opt4, flags=re.DOTALL)
            opt4 = re.sub(r"\n\s*MEDICINA \d+.*$", "", opt4, flags=re.IGNORECASE)
            opt4 = opt4.strip()

            # Normalizar múltiples espacios a espacios simples
            stem = re.sub(r"\s+", " ", stem)
            options = [
                re.sub(r"\s+", " ", opt1),
                re.sub(r"\s+", " ", opt2),
                re.sub(r"\s+", " ", opt3),
                re.sub(r"\s+", " ", opt4)
            ]
            
            correct_idx = answers_map.get(q_num, 0)
            
            # Clasificar por especialidad
            category = "General"
            lowered_stem = stem.lower()
            if any(x in lowered_stem for x in ["corazón", "cardio", "ecg", "infarto", "auricular", "vascular"]):
                category = "Cardiología"
            elif any(x in lowered_stem for x in ["pulmón", "neumo", "asma", "epoc", "pleural", "respiratorio"]):
                category = "Neumología"
            elif any(x in lowered_stem for x in ["hepático", "cirrosis", "digestivo", "vesícula", "gástrico", "esófago"]):
                category = "Aparato digestivo"
            elif any(x in lowered_stem for x in ["renal", "nefro", "glomérulo", "riñón", "orina"]):
                category = "Nefrología"
            elif any(x in lowered_stem for x in ["ictus", "neuro", "parálisis", "cerebral", "meningitis"]):
                category = "Neurología"
            elif any(x in lowered_stem for x in ["psiquiat", "esquizofren", "depresión", "ansiedad", "delirio"]):
                category = "Psiquiatría"
            elif any(x in lowered_stem for x in ["pediatr", "lactante", "niño", "infantil", "vacunación"]):
                category = "Pediatría"
            elif any(x in lowered_stem for x in ["gestante", "embarazo", "útero", "parto", "ginecología", "obstetricia"]):
                category = "Ginecología y Obstetricia"
            elif any(x in lowered_stem for x in ["infecc", "sepsis", "bacteriana", "virus", "antibiótico"]):
                category = "Infecciosas"
            elif any(x in lowered_stem for x in ["artritis", "reuma", "lupus", "artrosis", "articular"]):
                category = "Reumatología"
            elif any(x in lowered_stem for x in ["fractura", "trauma", "fémur", "hueso", "lesión"]):
                category = "Traumatología"
            elif any(x in lowered_stem for x in ["próstata", "urología", "renal", "vejiga"]):
                category = "Urología"

            questions.append({
                "id": f"q-{q_num}",
                "localNumber": q_num,
                "category": category,
                "stem": stem,
                "options": options,
                "correctIndex": correct_idx,
                "explanation": f"Pregunta oficial número {q_num} del examen MIR de la convocatoria FSE."
            })
            
            # Avanzamos current_pos al final de la opción 4 de esta pregunta
            # para buscar la siguiente a partir de aquí.
            current_pos = pos4 + len4

        print(f"  -> Preguntas parseadas con éxito: {len(questions)} del PDF.")
    except Exception as e:
        print(f"  Error parseando preguntas: {e}")
        
    return sorted(questions, key=lambda x: x["localNumber"])

def main():
    print("====================================================")
    print("  Parser Completo de Preguntas y Respuestas MIR     ")
    print("====================================================")
    
    base_dir = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
    output_data_dir = os.path.join(base_dir, "src", "lib", "data")
    if not os.path.exists(output_data_dir):
        os.makedirs(output_data_dir)
        
    search_path = os.path.join(base_dir, "Examen MIR *")
    exam_folders = glob.glob(search_path)
    
    for folder in exam_folders:
        folder_name = os.path.basename(folder)
        year_match = re.search(r"\d{4}", folder_name)
        if not year_match:
            continue
        year = year_match.group(0)
        print(f"\nProcesando convocatoria MIR {year}...")
        
        # Buscar el archivo de examen
        pdf_exam_pattern = os.path.join(folder, "**", f"Examen MIR {year}.pdf")
        pdf_exam_files = glob.glob(pdf_exam_pattern, recursive=True)
        if not pdf_exam_files:
            # Fallback por si tiene espacios o guiones
            pdf_exam_pattern = os.path.join(folder, "**", f"Examen MIR*{year}*.pdf")
            pdf_exam_files = glob.glob(pdf_exam_pattern, recursive=True)
            
        # Buscar el archivo de respuestas
        pdf_ans_pattern = os.path.join(folder, "**", f"*Respuestas.pdf")
        pdf_ans_files = glob.glob(pdf_ans_pattern, recursive=True)
        if not pdf_ans_files:
            pdf_ans_pattern = os.path.join(folder, "**", f"*Respuestas*.pdf")
            pdf_ans_files = glob.glob(pdf_ans_pattern, recursive=True)

        if pdf_exam_files:
            exam_pdf = pdf_exam_files[0]
            ans_pdf = pdf_ans_files[0] if pdf_ans_files else ""
            
            # 1. Parsear soluciones
            answers_map = {}
            if ans_pdf:
                answers_map = parse_answers_pdf(ans_pdf)
                
            # 2. Parsear preguntas
            questions = parse_questions_pdf(exam_pdf, answers_map)
            
            # Guardar JSON
            if questions:
                output_json_path = os.path.join(output_data_dir, f"mir_{year}.json")
                with open(output_json_path, "w", encoding="utf-8") as f:
                    json.dump(questions, f, ensure_ascii=False, indent=2)
                print(f"  [OK] Guardado JSON de examen en: src/lib/data/mir_{year}.json")
                
    print("\n¡Proceso finalizado!")

if __name__ == "__main__":
    main()
