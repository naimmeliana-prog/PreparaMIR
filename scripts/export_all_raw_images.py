import os
import pypdf
from PIL import Image

base_dir = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
pdf_path = os.path.join(base_dir, "Examen MIR 2025", "Examen MIR 2025 - Imagenes.pdf")
out_dir = os.path.join(base_dir, "scratch", "raw_images_2025")
os.makedirs(out_dir, exist_ok=True)

reader = pypdf.PdfReader(pdf_path)
print(f"Exportando todas las imágenes brutas de 2025 a: {out_dir}")

count = 0
for page_idx, page in enumerate(reader.pages):
    imgs = [img for img in page.images if len(img.data) >= 20000]
    for img_idx, img in enumerate(imgs):
        filename = f"p{page_idx+1}_img{img_idx+1}_{len(img.data)//1024}kb.png"
        file_path = os.path.join(out_dir, filename)
        with open(file_path, "wb") as f:
            f.write(img.data)
        count += 1
        print(f"  Pág {page_idx+1} Img #{img_idx+1} ({len(img.data)//1024} KB) -> {filename}")

print(f"Total imágenes exportadas: {count}")
