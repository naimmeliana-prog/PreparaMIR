import os, glob

base_dir = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
out_dir = os.path.join(base_dir, "public", "images", "exams", "2025")

print("Imágenes actuales:")
for f in sorted(glob.glob(os.path.join(out_dir, "pregunta_*.png"))):
    size = os.path.getsize(f)
    print(f"{os.path.basename(f)} - {size} bytes")

print("\nImágenes temporales:")
for f in sorted(glob.glob(os.path.join(out_dir, "temp_img_*.png"))):
    size = os.path.getsize(f)
    print(f"{os.path.basename(f)} - {size} bytes")
