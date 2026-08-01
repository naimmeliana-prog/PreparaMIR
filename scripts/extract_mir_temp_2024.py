import os, sys, glob
try:
    import fitz
except ImportError:
    sys.exit("pip install pymupdf")

base_dir = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
pdf_path = os.path.join(base_dir, "Examen MIR 2024", "Examen MIR 2024", "Examen MIR 2024 - Imagenes.pdf")
out_dir = os.path.join(base_dir, "public", "images", "exams", "2024")

if not os.path.exists(pdf_path):
    sys.exit(f"No se encuentra: {pdf_path}")

os.makedirs(out_dir, exist_ok=True)

# Limpiar temporales anteriores
for f in glob.glob(os.path.join(out_dir, "temp_img_*.png")):
    os.remove(f)

doc = fitz.open(pdf_path)
extracted = 0

for page_idx in range(len(doc)):
    page = doc[page_idx]
    image_list = page.get_images(full=True)
    
    if not image_list:
        continue
        
    for img_idx, img in enumerate(image_list):
        xref = img[0]
        base_image = doc.extract_image(xref)
        image_bytes = base_image["image"]
        image_ext = base_image["ext"]
        
        # Las imágenes médicas pesan más de 10 KB; el resto son logos repetidos de 5.5 KB
        if len(image_bytes) < 10000:
            continue
            
        extracted += 1
        out_name = f"temp_img_{extracted}.png"
        out_path = os.path.join(out_dir, out_name)
        
        # Convertir a PNG válido con PIL (el formato original puede ser JPEG)
        try:
            from PIL import Image
            import io
            pil_img = Image.open(io.BytesIO(image_bytes))
            pil_img.save(out_path, format="PNG")
        except Exception:
            # Si PIL falla, guardar raw igual
            with open(out_path, "wb") as f:
                f.write(image_bytes)
            
        print(f"  [OK] Guardada {out_name} ({len(image_bytes)/1024:.1f} KB)")

print(f"\nExtracción temporal MIR 2024 completada: {extracted} imágenes encontradas.")
print("Ahora ejecuta: python scripts/map_gui_2024.py")
