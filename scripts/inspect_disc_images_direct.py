import os
import hashlib
from PIL import Image

base_dir = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
img_dir = os.path.join(base_dir, "public", "images", "exams", "2025")

print("=== VERIFICACIÓN DIRECTA DE ARCHIVOS DE IMAGEN 2025 EN DISCO ===")
if os.path.exists(img_dir):
    for i in range(1, 11):
        filename = f"pregunta_{i}.png"
        filepath = os.path.join(img_dir, filename)
        if os.path.exists(filepath):
            size_kb = os.path.getsize(filepath) / 1024
            with open(filepath, "rb") as f:
                md5 = hashlib.md5(f.read()).hexdigest()[:8]
            try:
                with Image.open(filepath) as img:
                    print(f"  {filename}: {img.width}x{img.height}px | {size_kb:.1f} KB | Hash: {md5}")
            except Exception as e:
                print(f"  {filename}: {size_kb:.1f} KB | Hash: {md5} (Error PIL: {e})")
        else:
            print(f"  {filename}: NO EXISTE")
else:
    print(f"Directorio no existe: {img_dir}")
