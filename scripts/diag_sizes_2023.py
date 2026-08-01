import os, sys
try:
    import fitz
except ImportError:
    sys.exit("pip install pymupdf")

base_dir = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
pdf_path = os.path.join(base_dir, "Examen MIR 2023", "Examen MIR 2023", "Examen MIR 2023 - Imagenes.pdf")

doc = fitz.open(pdf_path)
sizes = []

for page_idx in range(len(doc)):
    page = doc[page_idx]
    for img in page.get_images(full=True):
        xref = img[0]
        base_image = doc.extract_image(xref)
        sz = len(base_image["image"])
        sizes.append(sz)

sizes.sort(reverse=True)
print(f"Total imágenes en PDF: {len(sizes)}")
print("\nTop 50 más grandes (KB):")
for i, s in enumerate(sizes[:50]):
    print(f"  #{i+1}: {s/1024:.1f} KB")
