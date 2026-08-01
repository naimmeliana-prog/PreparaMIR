import os
import pypdf

base_dir = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
pdf_path = os.path.join(base_dir, "Examen MIR 2025", "Examen MIR 2025 - Imagenes.pdf")

reader = pypdf.PdfReader(pdf_path)
print("=== TODAS LAS IMÁGENES EMBEBIDAS EN 2025 PAGINA A PAGINA ===")

for page_idx in range(2, len(reader.pages)):
    imgs = [img for img in reader.pages[page_idx].images if len(img.data) >= 20000]
    text = (reader.pages[page_idx].extract_text() or "").strip().replace("\n", " | ")
    print(f"\nPágina {page_idx + 1} (Texto: '{text}'): Total imágenes >20KB = {len(imgs)}")
    for idx, img in enumerate(imgs):
        sz_kb = len(img.data) / 1024
        print(f"  - Img #{idx}: {img.name} | {sz_kb:.1f} KB")
