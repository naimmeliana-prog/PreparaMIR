import os
import re
import glob
import pypdf

base_dir = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
search_path = os.path.join(base_dir, "Examen MIR *")
exam_folders = glob.glob(search_path)

print("=== INSPECCIÓN COMPLETA DE TODOS LOS EXÁMENES (2021-2025) ===")

for folder in sorted(exam_folders):
    year_match = re.search(r"\d{4}", os.path.basename(folder))
    if not year_match: continue
    year = year_match.group(0)
    
    pdf_img_files = glob.glob(os.path.join(folder, "**", "*Imagenes*.pdf"), recursive=True)
    if not pdf_img_files: continue
    
    pdf_path = pdf_img_files[0]
    reader = pypdf.PdfReader(pdf_path)
    print(f"\n>>> EXAMEN MIR {year} (PDF de Imágenes: {len(reader.pages)} págs) <<<")
    
    for page_idx, page in enumerate(reader.pages):
        text = (page.extract_text() or "").strip()
        large_imgs = [img for img in page.images if len(img.data) >= 20000]
        if not large_imgs: continue
        
        lines = [l.strip() for l in text.split("\n") if l.strip()]
        print(f"  Pág {page_idx+1} ({len(large_imgs)} JPGs >20KB): {lines[:4]}")
