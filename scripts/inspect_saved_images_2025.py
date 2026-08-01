import os
from PIL import Image

base_dir = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
img_dir = os.path.join(base_dir, "public", "images", "exams", "2025")

print("=== ARCHIVOS DE IMAGEN DE 2025 EN DISCO ===")
if os.path.exists(img_dir):
    files = sorted(os.listdir(img_dir))
    for f in files:
        full_p = os.path.join(img_dir, f)
        size_kb = os.path.getsize(full_p) / 1024
        try:
            with Image.open(full_p) as img:
                w, h = img.size
                format_name = img.format
                print(f"  {f}: {w}x{h} px | {size_kb:.1f} KB | Formato: {format_name}")
        except Exception as e:
            print(f"  {f}: Error leyendo con PIL ({e})")
else:
    print(f"No existe el directorio: {img_dir}")
