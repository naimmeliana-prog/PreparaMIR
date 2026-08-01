import os
from PIL import Image

base_dir = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))

for year in ["2021", "2022", "2023", "2024", "2025"]:
    img_dir = os.path.join(base_dir, "public", "images", "exams", year)
    if os.path.exists(img_dir):
        files = [f for f in os.listdir(img_dir) if f.endswith(".png")]
        print(f"\nExamen {year}: {len(files)} imágenes guardadas en disco en public/images/exams/{year}/")
        for f in sorted(files)[:5]:
            p = os.path.join(img_dir, f)
            sz = os.path.getsize(p) / 1024
            try:
                with Image.open(p) as im:
                    print(f"  - {f}: {im.width}x{im.height} px ({sz:.1f} KB)")
            except Exception as e:
                print(f"  - {f}: {sz:.1f} KB (Error PIL: {e})")
    else:
        print(f"\nExamen {year}: NO existe el directorio de imágenes")
