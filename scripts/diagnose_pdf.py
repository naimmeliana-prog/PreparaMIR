import os
import pypdf

# Script de diagnóstico para ver el formato del texto extraído del PDF
base_dir = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
pdf_path = os.path.join(base_dir, "Examen MIR 2025", "Examen MIR 2025.pdf")
output_txt = os.path.join(base_dir, "diagnostic.txt")

try:
    reader = pypdf.PdfReader(pdf_path)
    print(f"Número de páginas: {len(reader.pages)}")
    text_sample = ""
    for i in range(min(5, len(reader.pages))):
        text_sample += f"--- PAGINA {i+1} ---\n"
        text_sample += reader.pages[i].extract_text() or ""
        text_sample += "\n"
        
    with open(output_txt, "w", encoding="utf-8") as f:
        f.write(text_sample[:10000]) # primeros 10k caracteres
    print(f"Diagnóstico guardado en: {output_txt}")
except Exception as e:
    print(f"Error: {e}")
