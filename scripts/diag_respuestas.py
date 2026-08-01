"""
Lee los PDFs de respuestas de 2021 y 2022 y muestra el texto extraído
para entender el formato antes de parsear.
"""
import os, sys
try:
    import pdfplumber
except ImportError:
    sys.exit("pip install pdfplumber")

base_dir = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))

for year in ["2021", "2022"]:
    pdf_path = os.path.join(base_dir, f"Examen MIR {year}", f"Examen MIR {year}", f"Respuestas_{year}.pdf")
    print(f"\n{'='*60}")
    print(f"  RESPUESTAS {year}: {pdf_path}")
    print(f"{'='*60}")
    if not os.path.exists(pdf_path):
        print("  ❌ No encontrado")
        continue
    with pdfplumber.open(pdf_path) as pdf:
        for i, page in enumerate(pdf.pages[:3]):  # Solo primeras 3 páginas
            print(f"\n--- Página {i+1} ---")
            text = page.extract_text()
            if text:
                print(text[:2000])
            else:
                print("  (sin texto)")
