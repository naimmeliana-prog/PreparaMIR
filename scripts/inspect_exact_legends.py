import os
import re
import glob
import pypdf

base_dir = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
search_path = os.path.join(base_dir, "Examen MIR *")
exam_folders = glob.glob(search_path)

print("=== DEPURACIÓN EXHAUSTIVA DE LEYENDAS (TODOS LOS AÑOS) ===")

for folder in sorted(exam_folders):
    year_match = re.search(r"\d{4}", os.path.basename(folder))
    if not year_match: continue
    year = year_match.group(0)
    
    pdf_img_files = glob.glob(os.path.join(folder, "**", "*Imagenes*.pdf"), recursive=True)
    if not pdf_img_files: continue
    
    pdf_path = pdf_img_files[0]
    reader = pypdf.PdfReader(pdf_path)
    print(f"\n==========================================")
    print(f"  MIR {year} ({len(reader.pages)} págs)")
    print(f"==========================================")
    
    for page_idx in range(len(reader.pages)):
        page = reader.pages[page_idx]
        text = page.extract_text() or ""
        large_imgs = [img for img in page.images if len(img.data) >= 20000]
        lines = [l.strip() for l in text.split("\n") if l.strip()]
        
        # Buscar números aislados o con palabra Imagen
        num_lines = []
        for l in lines:
            m = re.search(r"(?:imagen|imágenes|pregunta)?\s*(?:nº|n\.º|no)?\s*\b([1-9]|1[0-9]|2[0-5])\b", l, re.IGNORECASE)
            if m:
                num_lines.append(f"{l} -> {m.group(1)}")
                
        print(f"  Pág {page_idx+1} ({len(large_imgs)} JPGs >20KB) | Lineas con números: {num_lines}")
