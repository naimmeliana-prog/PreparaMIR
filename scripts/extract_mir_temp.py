import os, glob, re, sys

try:
    import pypdf
except ImportError:
    sys.exit("Falta pypdf")

def main():
    base_dir = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
    pdf_path = os.path.join(base_dir, "Examen MIR 2025", "Examen MIR 2025 - Imagenes.pdf")
    out_dir = os.path.join(base_dir, "public", "images", "exams", "2025")
    
    os.makedirs(out_dir, exist_ok=True)
    
    # Limpiar temp imgs anteriores si existen
    for f in glob.glob(os.path.join(out_dir, "temp_img_*.png")):
        os.remove(f)

    reader = pypdf.PdfReader(pdf_path)
    img_counter = 1

    print("Extrayendo imágenes a temp_img_X.png...")
    for page_idx in range(2, len(reader.pages)):
        page = reader.pages[page_idx]
        imgs = [img for img in page.images if len(img.data) >= 20000]
        
        for img in imgs:
            fname = f"temp_img_{img_counter}.png"
            out_path = os.path.join(out_dir, fname)
            with open(out_path, "wb") as f:
                f.write(img.data)
            print(f"  [OK] Guardada {fname} ({len(img.data)/1024:.1f} KB)")
            img_counter += 1

if __name__ == "__main__":
    main()
