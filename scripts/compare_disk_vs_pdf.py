import os
import hashlib
import pypdf

base_dir = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
pdf_path = os.path.join(base_dir, "Examen MIR 2025", "Examen MIR 2025 - Imagenes.pdf")
img_dir = os.path.join(base_dir, "public", "images", "exams", "2025")

reader = pypdf.PdfReader(pdf_path)

def md5(data): return hashlib.md5(data).hexdigest()[:8]

print("=== COMPARACIÓN: DISCO vs PDF (Preguntas 1-5) ===\n")

# Lo que TENEMOS en disco
print("--- DISCO ---")
for q in range(1, 6):
    p = os.path.join(img_dir, f"pregunta_{q}.png")
    if os.path.exists(p):
        data = open(p, "rb").read()
        print(f"  pregunta_{q}.png: {len(data)/1024:.1f} KB | hash={md5(data)}")
    else:
        print(f"  pregunta_{q}.png: NO EXISTE")

print()

# Lo que HAY en el PDF página a página
print("--- PDF (Imgs >20KB) ---")
for page_idx in range(2, 11):
    imgs = [img for img in reader.pages[page_idx].images if len(img.data) >= 20000]
    for i_idx, img in enumerate(imgs):
        print(f"  Pág {page_idx+1} Img#{i_idx}: {len(img.data)/1024:.1f} KB | hash={md5(img.data)}")
