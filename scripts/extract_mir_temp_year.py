"""
Extractor genérico de imágenes MIR para cualquier año.
Uso: python scripts/extract_mir_temp_year.py 2023
"""
import os, sys, glob, io, argparse

try:
    import fitz
except ImportError:
    sys.exit("Ejecuta: pip install pymupdf")

try:
    from PIL import Image
except ImportError:
    sys.exit("Ejecuta: pip install Pillow")

parser = argparse.ArgumentParser()
parser.add_argument("year", help="Año del examen (ej: 2023)")
args = parser.parse_args()
year = args.year

base_dir = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
exam_dir = os.path.join(base_dir, f"Examen MIR {year}", f"Examen MIR {year}")
out_dir  = os.path.join(base_dir, "public", "images", "exams", year)

# Buscar el PDF de imágenes
pdf_candidates = [
    os.path.join(exam_dir, f"Examen MIR {year} - Imagenes.pdf"),
    os.path.join(exam_dir, f"Examen MIR {year} Imagenes.pdf"),
    os.path.join(exam_dir, f"MIR {year} - Imagenes.pdf"),
]
pdf_path = next((p for p in pdf_candidates if os.path.exists(p)), None)

if not pdf_path:
    # Buscar automáticamente cualquier PDF con "Imagen" en el nombre
    for f in os.listdir(exam_dir):
        if "magen" in f and f.endswith(".pdf"):
            pdf_path = os.path.join(exam_dir, f)
            break

if not pdf_path:
    sys.exit(f"No se encontró el PDF de imágenes en: {exam_dir}\nArchivos disponibles: {os.listdir(exam_dir)}")

print(f"PDF encontrado: {pdf_path}")
os.makedirs(out_dir, exist_ok=True)

# Limpiar temporales anteriores
removed = 0
for f in glob.glob(os.path.join(out_dir, "temp_img_*.png")):
    os.remove(f)
    removed += 1
if removed:
    print(f"Limpiados {removed} archivos temporales anteriores.")

# Obtener tamaños para encontrar umbral automático
doc = fitz.open(pdf_path)
all_sizes = []
for page_idx in range(len(doc)):
    for img in doc[page_idx].get_images(full=True):
        xref = img[0]
        base_image = doc.extract_image(xref)
        all_sizes.append(len(base_image["image"]))

all_sizes.sort(reverse=True)

# Umbral: buscar el primer salto significativo (> 2 KB) de abajo hacia arriba para evitar logos
threshold = 10000  # fallback
if len(all_sizes) > 30:
    for i in range(45, 10, -1):
        if i >= len(all_sizes) - 1:
            continue
        gap = all_sizes[i] - all_sizes[i + 1]
        if gap > 2048:  # Salto de más de 2 KB
            threshold = (all_sizes[i] + all_sizes[i + 1]) // 2
            break

print(f"Umbral de tamaño automático: {threshold/1024:.1f} KB")

# Extraer imágenes por encima del umbral
doc2 = fitz.open(pdf_path)
extracted = 0

for page_idx in range(len(doc2)):
    page = doc2[page_idx]
    for img in page.get_images(full=True):
        xref = img[0]
        base_image = doc2.extract_image(xref)
        image_bytes = base_image["image"]
        if len(image_bytes) < threshold:
            continue

        extracted += 1
        out_path = os.path.join(out_dir, f"temp_img_{extracted}.png")

        try:
            pil_img = Image.open(io.BytesIO(image_bytes))
            pil_img.save(out_path, format="PNG")
        except Exception:
            with open(out_path, "wb") as f:
                f.write(image_bytes)

        print(f"  [OK] temp_img_{extracted}.png ({len(image_bytes)/1024:.1f} KB)")

print(f"\nExtracción MIR {year} completada: {extracted} imágenes.")
print(f"Ahora abre: http://localhost:3000/admin/map-images?year={year}")
