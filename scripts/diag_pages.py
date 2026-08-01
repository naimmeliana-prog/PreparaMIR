import os, sys
try:
    import pdfplumber
except ImportError:
    sys.exit("pip install pdfplumber")

base_dir = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
pdf_path = os.path.join(base_dir, "Examen MIR 2025", "Examen MIR 2025 - Imagenes.pdf")
out_file = os.path.join(base_dir, "diag_out.txt")

with open(out_file, "w", encoding="utf-8") as f:
    with pdfplumber.open(pdf_path) as pdf:
        for page_idx in range(2, min(12, len(pdf.pages))):
            page = pdf.pages[page_idx]
            f.write(f"\n===== PÁGINA {page_idx+1} =====\n")

            words = page.extract_words(extra_attrs=["x0", "top"])
            f.write("  TEXTO:\n")
            for w in words:
                f.write(f"    '{w['text']:10s}' x0={w['x0']:.0f} top={w['top']:.0f}\n")

            f.write("  IMÁGENES (ordenadas por x0,y0):\n")
            imgs = sorted([im for im in page.images if im.get("width",0)>80],
                          key=lambda im: (im["x0"], im["y0"]))
            for i, im in enumerate(imgs):
                f.write(f"    #{i}: name={im.get('name','?'):8s} "
                      f"x0={im['x0']:.0f} y0={im['y0']:.0f} y1={im['y1']:.0f} "
                      f"w={im['width']:.0f} h={im['height']:.0f}\n")
