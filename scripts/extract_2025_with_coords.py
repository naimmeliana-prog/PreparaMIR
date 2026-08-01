"""
Usa pdfplumber para obtener coordenadas exactas de imágenes y texto,
luego construye el mapeo correcto pregunta -> imagen automáticamente.
"""
import os
import sys
import re
import glob

try:
    import pdfplumber
except ImportError:
    print("Instalando pdfplumber...")
    os.system("pip install pdfplumber")
    import pdfplumber

try:
    import pypdf
except ImportError:
    sys.exit("pypdf no instalado")

base_dir = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
pdf_path = os.path.join(base_dir, "Examen MIR 2025", "Examen MIR 2025 - Imagenes.pdf")
out_dir = os.path.join(base_dir, "public", "images", "exams", "2025")
os.makedirs(out_dir, exist_ok=True)

# Mapa imagen_numero -> pregunta_numero
# (En el MIR 2025, IMAGEN N corresponde a Pregunta N para preguntas 1-25)
# Confirmado por los stems: Q1 dice "(IMAGEN 1)", Q2 dice "(IMAGEN 2)", etc.

print("=== EXTRACCIÓN CON COORDENADAS EXACTAS (pdfplumber) ===\n")

# Primero, con pdfplumber sacamos qué imagen_number y qué bbox tiene cada imagen
reader_pypdf = pypdf.PdfReader(pdf_path)

with pdfplumber.open(pdf_path) as pdf:
    # Dict: (page_idx_0based, img_number) -> bbox x0
    img_label_positions = {}  # img_number -> (page_idx, x0_of_label)
    
    for page_idx in range(2, len(pdf.pages)):
        page = pdf.pages[page_idx]
        words = page.extract_words()
        
        # Buscar palabras que sean números (1-25) o "Imagen N"
        labels = []
        i = 0
        while i < len(words):
            w = words[i]
            # Check for "Imagen" followed by number
            if w['text'].lower() == 'imagen' and i + 1 < len(words):
                try:
                    n = int(words[i+1]['text'])
                    if 1 <= n <= 25:
                        labels.append((n, float(w['x0'])))
                    i += 2
                    continue
                except:
                    pass
            # Check for standalone number
            try:
                n = int(w['text'])
                if 1 <= n <= 25:
                    labels.append((n, float(w['x0'])))
            except:
                pass
            i += 1
        
        # Deduplicate by number, keep leftmost x0
        seen = {}
        for (n, x0) in labels:
            if n not in seen or x0 < seen[n]:
                seen[n] = x0
        
        if seen:
            print(f"Pág {page_idx + 1}: Etiquetas encontradas: {dict(sorted(seen.items()))}")
            for n, x0 in seen.items():
                img_label_positions[n] = (page_idx, x0)

print()

# Ahora con pypdf extraemos las imágenes y sus xref positions
# Usamos el orden de extracción de pypdf y las coordenadas de pdfplumber para ordenarlas
with pdfplumber.open(pdf_path) as pdf:
    saved = 0
    
    for page_idx in range(2, len(pdf.pages)):
        page_plumber = pdf.pages[page_idx]
        page_pypdf = reader_pypdf.pages[page_idx]
        
        # Obtener imágenes de pdfplumber con sus coordenadas
        plumber_imgs = page_plumber.images
        plumber_imgs_large = [im for im in plumber_imgs if im['width'] > 50 and im['height'] > 50]
        # Sort by x0 (left to right)
        plumber_imgs_sorted = sorted(plumber_imgs_large, key=lambda im: im['x0'])
        
        # Obtener datos de imágenes con pypdf (mismo orden de extracción)
        pypdf_imgs = [img for img in page_pypdf.images if len(img.data) >= 20000]
        
        # Encontrar las etiquetas de imagen en esta página y sus posiciones
        page_labels = {n: x0 for n, (pidx, x0) in img_label_positions.items() if pidx == page_idx}
        
        if not page_labels or not pypdf_imgs:
            continue
        
        print(f"Pág {page_idx + 1}: {len(pypdf_imgs)} imágenes pypdf | {len(plumber_imgs_sorted)} imgs plumber | Labels: {list(page_labels.keys())}")
        
        # Si hay el mismo número de imágenes que labels, emparejar por posición x
        if len(plumber_imgs_sorted) == len(page_labels):
            sorted_labels = sorted(page_labels.items(), key=lambda x: x[1])  # sort by x0
            for (img_num, lx0), plumb_img in zip(sorted_labels, plumber_imgs_sorted):
                # Find the matching pypdf image by size approximation
                target_area = plumb_img['width'] * plumb_img['height']
                print(f"  IMAGEN {img_num} (x0={lx0:.0f}) -> plumber img area={target_area:.0f}")
        
        # Fallback: match by x0 of pdfplumber images and text labels by proximity
        # Sort both by x0 and pair them
        if len(pypdf_imgs) >= len(page_labels):
            sorted_labels = sorted(page_labels.items(), key=lambda x: x[1])
            
            # We need to know which pypdf index corresponds to which plumber position
            # Use the index in plumber_imgs_sorted to find corresponding pypdf index
            # (assuming same order from pypdf)
            for label_rank, (img_num, _) in enumerate(sorted_labels):
                if label_rank < len(pypdf_imgs):
                    img_data = pypdf_imgs[label_rank].data
                    out_path = os.path.join(out_dir, f"pregunta_{img_num}.png")
                    with open(out_path, "wb") as f:
                        f.write(img_data)
                    print(f"  [2025] IMAGEN {img_num} -> pregunta_{img_num}.png ({len(img_data)/1024:.1f} KB)")
                    saved += 1

print(f"\nTotal guardadas: {saved}")
