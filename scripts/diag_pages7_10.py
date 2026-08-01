import os, sys
try:
    import pdfplumber
except ImportError:
    sys.exit("pip install pdfplumber")

base_dir = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
pdf_path = os.path.join(base_dir, "Examen MIR 2025", "Examen MIR 2025 - Imagenes.pdf")

with pdfplumber.open(pdf_path) as pdf:
    for page_idx in range(6, 10):   # Páginas 7, 8, 9, 10
        page = pdf.pages[page_idx]
        print(f"\n===== PÁGINA {page_idx+1} =====")

        words = page.extract_words(extra_attrs=["x0", "top"])
        print("  TEXTO:")
        for w in words:
            print(f"    '{w['text']:10s}' x0={w['x0']:.0f} top={w['top']:.0f}")

        print("  IMÁGENES (ordenadas por x0,y0):")
        imgs = sorted([im for im in page.images if im.get("width",0)>80],
                      key=lambda im: (im["x0"], im["y0"]))
        for i, im in enumerate(imgs):
            print(f"    #{i}: name={im.get('name','?'):8s} "
                  f"x0={im['x0']:.0f} y0={im['y0']:.0f} y1={im['y1']:.0f} "
                  f"w={im['width']:.0f} h={im['height']:.0f}")
