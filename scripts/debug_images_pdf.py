import os
import re
import pypdf

base_dir = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
pdf_path = os.path.join(base_dir, "Examen MIR 2025", "Examen MIR 2025 - Imagenes.pdf")

print(f"Abriendo: {pdf_path}")
reader = pypdf.PdfReader(pdf_path)

for page_idx, page in enumerate(reader.pages):
    text = page.extract_text() or ""
    large_imgs = [img for img in page.images if len(img.data) >= 20000]
    
    # Buscar IMAGEN N en texto
    matches = re.findall(r"(?:imagen|imágenes)\s*(?:nº|n\.º|no)?\s*(\d+)", text, re.IGNORECASE)
    
    print(f"\n--- PAGINA {page_idx + 1} ---")
    print(f"Imágenes >20KB: {len(large_imgs)}")
    print(f"Etiquetas 'IMAGEN N' encontradas en texto: {matches}")
    print("Texto en la página:")
    print(repr(text[:300]))
