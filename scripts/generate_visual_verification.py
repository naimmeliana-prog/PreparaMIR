import os
import base64
import pypdf

base_dir = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
pdf_path = os.path.join(base_dir, "Examen MIR 2025", "Examen MIR 2025 - Imagenes.pdf")
out_html = os.path.join(base_dir, "scratch", "verificacion_imagenes_2025.html")
os.makedirs(os.path.join(base_dir, "scratch"), exist_ok=True)

reader = pypdf.PdfReader(pdf_path)

rows = []
for page_idx in range(2, len(reader.pages)):
    imgs = [img for img in reader.pages[page_idx].images if len(img.data) >= 20000]
    for i_idx, img in enumerate(imgs):
        b64 = base64.b64encode(img.data).decode()
        ext = "jpeg" if img.data[:3] == b'\xff\xd8\xff' else "png"
        rows.append((page_idx + 1, i_idx, len(img.data) / 1024, b64, ext))

html = """<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8">
<title>Verificación de Imágenes MIR 2025</title>
<style>
body{font-family:system-ui;background:#111;color:#eee;margin:0;padding:20px}
h1{color:#4ecca3}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px}
.card{background:#1e1e1e;border-radius:12px;overflow:hidden;border:2px solid #333}
.card img{width:100%;display:block;max-height:220px;object-fit:contain;background:#000}
.info{padding:10px;font-size:13px}
.info b{color:#4ecca3}
</style>
</head>
<body>
<h1>🖼️ Imágenes MIR 2025 — Verificación Visual</h1>
<p>Cada tarjeta muestra la imagen real extraída del PDF con su ubicación física.</p>
<div class="grid">
"""

for page_num, i_idx, sz_kb, b64, ext in rows:
    html += f"""
<div class="card">
  <img src="data:image/{ext};base64,{b64}" alt="Pág {page_num} Img#{i_idx}">
  <div class="info">
    <b>Página {page_num} — Imagen #{i_idx}</b><br>
    Tamaño: {sz_kb:.1f} KB<br>
    <span style="font-size:11px;color:#999">Código mapeo: ({page_num - 1}, {i_idx})</span>
  </div>
</div>"""

html += """
</div>
</body>
</html>"""

with open(out_html, "w", encoding="utf-8") as f:
    f.write(html)

print(f"HTML generado en: {out_html}")
print("Ábrelo en tu navegador para ver todas las imágenes del PDF.")
