import os
import pypdf

base_dir = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
pdf_path = os.path.join(base_dir, "Examen MIR 2025", "Examen MIR 2025 - Imagenes.pdf")

reader = pypdf.PdfReader(pdf_path)
print("=== CONTENIDO DE TEXTO DETALLADO DE CADA PÁGINA ===")

for page_idx in range(2, len(reader.pages)):
    page = reader.pages[page_idx]
    print(f"\n==================== PÁGINA {page_idx + 1} ====================")
    
    def visitor_text(text, cm, tm, font_dict, font_size):
        clean = text.strip()
        if clean:
            x, y = cm[4], cm[5]
            print(f"  Texto: {repr(clean):35} | Pos (x={x:.1f}, y={y:.1f})")
            
    page.extract_text(visitor_text=visitor_text)
    
    imgs = [img for img in page.images if len(img.data) >= 20000]
    print(f"  --> Total imágenes >20KB en página: {len(imgs)}")
    for idx, img in enumerate(imgs):
        print(f"      Img #{idx}: {img.name} ({len(img.data)/1024:.1f} KB)")
