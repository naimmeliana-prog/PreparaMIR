"""
Diagnóstico definitivo: muestra exactamente las coordenadas x0 de cada imagen
y de cada etiqueta de texto en las páginas 3 y 4 del cuadernillo 2025.
"""
import os, sys
try:
    import pdfplumber
except ImportError:
    sys.exit("pip install pdfplumber")

base_dir = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
pdf_path = os.path.join(base_dir, "Examen MIR 2025", "Examen MIR 2025 - Imagenes.pdf")

with pdfplumber.open(pdf_path) as pdf:
    for page_idx in range(2, 6):   # Páginas 3, 4, 5, 6 del PDF
        page = pdf.pages[page_idx]
        print(f"\n========== PÁGINA {page_idx+1} (índice {page_idx}) ==========")

        # Todas las palabras con coordenadas
        words = page.extract_words(extra_attrs=["x0", "top", "x1", "bottom"])
        print("  TEXTO:")
        for w in words:
            print(f"    '{w['text']:20s}' x0={w['x0']:.1f}, top={w['top']:.1f}")

        # Todas las imágenes con coordenadas
        print("  IMÁGENES:")
        for i, im in enumerate(page.images):
            print(f"    Img #{i}: name={im.get('name','?'):12s} "
                  f"x0={im['x0']:.1f} y0={im['y0']:.1f} "
                  f"x1={im['x1']:.1f} y1={im['y1']:.1f} "
                  f"w={im['width']:.0f} h={im['height']:.0f}")
