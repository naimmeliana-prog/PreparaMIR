"""
Extractor DEFINITIVO con OCR:
Lee el texto "Imagen N" impreso dentro de cada imagen médica del PDF
y la guarda como pregunta_N.png — sin suposiciones.
"""
import os, re, sys, io, glob

try:
    import pypdf
except ImportError:
    sys.exit("Falta pypdf. pip install pypdf")

try:
    from PIL import Image
except ImportError:
    os.system("pip install Pillow")
    from PIL import Image

# Intentar pytesseract
try:
    import pytesseract
    # Ajustar ruta de Tesseract en Windows si es necesario
    possible_paths = [
        r"C:\Program Files\Tesseract-OCR\tesseract.exe",
        r"C:\Program Files (x86)\Tesseract-OCR\tesseract.exe",
        r"C:\Users\USUARIO\AppData\Local\Programs\Tesseract-OCR\tesseract.exe",
    ]
    for p in possible_paths:
        if os.path.exists(p):
            pytesseract.pytesseract.tesseract_cmd = p
            break
    HAS_OCR = True
    print("✓ pytesseract disponible")
except ImportError:
    HAS_OCR = False
    print("✗ pytesseract no disponible. Instalando...")
    os.system("pip install pytesseract")
    try:
        import pytesseract
        HAS_OCR = True
    except:
        HAS_OCR = False

base_dir = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))

def ocr_image_number(img_data):
    """Lee el número N de 'Imagen N' o 'IMAGEN N' impreso en la imagen."""
    try:
        img = Image.open(io.BytesIO(img_data))
        # Recortar solo la esquina superior (donde está el texto "Imagen N")
        w, h = img.size
        # Crop top 25% of the image, full width
        top_strip = img.crop((0, 0, w, int(h * 0.25)))
        # Escalar para mejor OCR
        scale = 3
        top_strip = top_strip.resize((top_strip.width * scale, top_strip.height * scale), Image.LANCZOS)
        # Convertir a escala de grises e invertir si el texto es blanco sobre negro
        gray = top_strip.convert("L")
        # Detectar si el fondo es oscuro (texto blanco)
        pixels = list(gray.getdata())
        avg = sum(pixels) / len(pixels)
        if avg < 128:
            # Fondo oscuro → invertir
            from PIL import ImageOps
            gray = ImageOps.invert(gray)
        text = pytesseract.image_to_string(gray, config="--psm 6")
        # Buscar "Imagen N" o variantes
        m = re.search(r"[Ii]magen\s+(\d+)\s*([ab]?)", text, re.IGNORECASE)
        if m:
            num = int(m.group(1))
            suf = m.group(2).lower()
            return num, suf
        # Buscar solo número en el strip
        m2 = re.search(r"\b(\d{1,2})\b", text)
        if m2:
            return int(m2.group(1)), ""
    except Exception as e:
        pass
    return None, None


def extract_year_images(pdf_path, out_dir, year):
    os.makedirs(out_dir, exist_ok=True)
    reader = pypdf.PdfReader(pdf_path)
    saved = 0
    failed = []

    print(f"\n{'='*55}")
    print(f"  MIR {year} — Extracción por OCR (texto 'Imagen N')")
    print(f"{'='*55}")

    for page_idx in range(2, len(reader.pages)):
        page = reader.pages[page_idx]
        imgs = [img for img in page.images if len(img.data) >= 20000]
        if not imgs:
            continue

        for img in imgs:
            if HAS_OCR:
                num, suf = ocr_image_number(img.data)
            else:
                num, suf = None, ""

            if num is not None and 1 <= num <= 25:
                fname = f"pregunta_{num}{suf}.png" if suf else f"pregunta_{num}.png"
                out_path = os.path.join(out_dir, fname)
                with open(out_path, "wb") as f:
                    f.write(img.data)
                print(f"  [OK] Pág {page_idx+1}: OCR→'Imagen {num}{suf}' → {fname} ({len(img.data)/1024:.1f} KB)")
                saved += 1
            else:
                print(f"  [??] Pág {page_idx+1}: OCR falló ({len(img.data)/1024:.1f} KB) — guardando como debug")
                failed.append((page_idx, img.data))

    # Mostrar resumen
    print(f"\n✓ Guardadas: {saved}")
    if failed:
        print(f"✗ Sin OCR: {len(failed)} imágenes — necesita revisión manual")
    return saved


def main():
    base_dir_g = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
    for folder in glob.glob(os.path.join(base_dir_g, "Examen MIR *")):
        m = re.search(r"\d{4}", os.path.basename(folder))
        if not m:
            continue
        year = m.group(0)
        for f in glob.glob(os.path.join(folder, "**", "*Imagenes*.pdf"), recursive=True):
            out_dir = os.path.join(base_dir_g, "public", "images", "exams", year)
            extract_year_images(f, out_dir, year)


if __name__ == "__main__":
    if not HAS_OCR:
        print("\n⚠️  Tesseract no instalado en el sistema.")
        print("   Descárgalo de: https://github.com/UB-Mannheim/tesseract/wiki")
        print("   O instala: choco install tesseract (si tienes Chocolatey)")
        sys.exit(1)
    main()
