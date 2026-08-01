import os
import pypdf

base_dir = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
pdf_path = os.path.join(base_dir, "Examen MIR 2025", "Examen MIR 2025 - Imagenes.pdf")

reader = pypdf.PdfReader(pdf_path)
print("=== POSICIONES X,Y EXACTAS DE CADA IMAGEN (2025) ===")

for page_idx, page in enumerate(reader.pages):
    if page_idx < 2: continue # saltar portadas
    
    img_positions = []
    
    def visitor_op(op, args, cm, tm, tag_stack):
        if op == "Do":
            # args[0] es el nombre del XObject (ej. '/X19')
            img_name = str(args[0])
            x = cm[4]
            y = cm[5]
            img_positions.append((img_name, x, y))
            
    page.visitor_transforms(visitor_op)
    
    # Filtrar solo imágenes que coincidan con las imágenes reales (>20KB)
    large_image_names = set()
    for img in page.images:
        if len(img.data) >= 20000:
            large_image_names.add("/" + img.name)
            
    filtered = [p for p in img_positions if p[0] in large_image_names]
    # Ordenar de izquierda a derecha (x) y luego de arriba a abajo (-y)
    filtered_sorted = sorted(filtered, key=lambda item: (item[1], -item[2]))
    
    print(f"\nPág. {page_idx + 1}:")
    for img_name, x, y in filtered_sorted:
        col = "IZQUIERDA" if x < 300 else "DERECHA"
        print(f"  Img '{img_name}': pos x={x:.1f}, y={y:.1f} -> Columna {col}")
