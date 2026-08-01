import os
import re
import pypdf

base_dir = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
pdf_path = os.path.join(base_dir, "Examen MIR 2025", "Examen MIR 2025 - Imagenes.pdf")

reader = pypdf.PdfReader(pdf_path)
print("=== PARSER DIRECTO DE STREAM DE COORDENADAS DE IMÁGENES ===")

for page_idx in range(2, len(reader.pages)):
    page = reader.pages[page_idx]
    contents = page.get_contents()
    raw_data = ""
    if contents:
        if isinstance(contents, list):
            for c in contents:
                raw_data += c.get_data().decode('latin-1', errors='ignore') + "\n"
        else:
            raw_data = contents.get_data().decode('latin-1', errors='ignore')
            
    # Buscar patrones cm y Do: [numbers] cm [text] /XObject Do
    # Ejemplo: 1 0 0 1 54.3 420 cm /O0 Do  o  250 0 0 200 54.3 420 cm /O0 Do
    matches = re.findall(r"([\d\.\s\-]+)\s+cm\s*(?:/[A-Za-z0-9_]+\s+)*(/([A-Za-z0-9_]+))\s+Do", raw_data)
    
    large_image_names = {img.name: len(img.data) for img in page.images if len(img.data) >= 20000}
    
    print(f"\nPág. {page_idx + 1}: (Imágenes grandes en pág: {list(large_image_names.keys())})")
    
    parsed_pos = []
    for cm_str, full_tag, img_name in matches:
        if img_name in large_image_names:
            nums = [float(n) for n in cm_str.strip().split() if re.match(r"^-?\d+(\.\d+)?$", n)]
            if len(nums) >= 6:
                x = nums[4]
                y = nums[5]
                parsed_pos.append((img_name, x, y))
                
    # Ordenar por X (columna izquierda vs derecha)
    sorted_by_x = sorted(parsed_pos, key=lambda item: item[1])
    for img_name, x, y in sorted_by_x:
        size_kb = large_image_names[img_name] / 1024
        col = "IZQUIERDA" if x < 300 else "DERECHA"
        print(f"  Img '{img_name}' ({size_kb:.1f} KB): pos x={x:.1f}, y={y:.1f} -> Columna {col}")
