import os
import pypdf

base_dir = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
pdf_path = os.path.join(base_dir, "Examen MIR 2025", "Examen MIR 2025 - Imagenes.pdf")

if not os.path.exists(pdf_path):
    print(f"No existe: {pdf_path}")
else:
    reader = pypdf.PdfReader(pdf_path)
    print(f"Total páginas en PDF de Imágenes 2025: {len(reader.pages)}")
    
    for i, page in enumerate(reader.pages):
        text = (page.extract_text() or "").strip()
        first_line = text.split("\n")[0] if text else "SIN TEXTO"
        images = page.images
        print(f"Pág. {i+1}: TextHead='{first_line[:60]}' | Num imágs: {len(images)}")
        for img_idx, img in enumerate(images):
            size_kb = len(img.data) / 1024
            name = getattr(img, 'name', 'unnamed')
            print(f"   -> Img #{img_idx}: Nombre={name}, Size={size_kb:.1f} KB")
