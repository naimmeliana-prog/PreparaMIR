import os
import base64
import pypdf

base_dir = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
pdf_path = os.path.join(base_dir, "Examen MIR 2025", "Examen MIR 2025 - Imagenes.pdf")
out_html = os.path.join(base_dir, "scratch", "verificacion_numerada.html")

reader = pypdf.PdfReader(pdf_path)

# Current mapping: pregunta -> (page_idx, img_idx)
current_map = {
    1: (2, 0), 2: (3, 0), 3: (4, 0), 4: (5, 0), 5: (6, 0),
    6: (7, 0), 7: (8, 0), 8: (9, 0), 9: (9, 1), 10: (8, 1),
    11: (7, 1), 12: (6, 1), 13: (5, 1), 14: (4, 1), 15: (3, 1),
    16: (2, 1), 17: (6, 2), 18: (7, 2), 19: (8, 2), 20: (8, 3),
    21: (7, 3), 22: (6, 3), 23: (9, 2), 24: (9, 3), 25: (5, 2),
}
# Invert: (page_idx, img_idx) -> pregunta
inv_map = {v: k for k, v in current_map.items()}

rows = []
n = 1
for page_idx in range(2, len(reader.pages)):
    imgs = [img for img in reader.pages[page_idx].images if len(img.data) >= 20000]
    for i_idx, img in enumerate(imgs):
        b64 = base64.b64encode(img.data).decode()
        ext = "jpeg" if img.data[:3] == b'\xff\xd8\xff' else "png"
        current_q = inv_map.get((page_idx, i_idx), "?")
        rows.append((n, page_idx + 1, i_idx, len(img.data) / 1024, b64, ext, current_q))
        n += 1

html = """<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8">
<title>Verificación Numerada MIR 2025</title>
<style>
body{font-family:system-ui;background:#111;color:#eee;margin:0;padding:20px}
h1{color:#4ecca3}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:14px}
.card{background:#1e1e1e;border-radius:10px;overflow:hidden;border:2px solid #333}
.card img{width:100%;display:block;max-height:200px;object-fit:contain;background:#000}
.info{padding:8px 10px;font-size:12px}
.num{font-size:24px;font-weight:900;color:#ffd700;margin-bottom:4px}
.q{color:#4ecca3;font-weight:bold}
.loc{color:#888;font-size:11px}
</style>
</head>
<body>
<h1>🖼️ Imágenes MIR 2025 — Con numeración secuencial</h1>
<p>Dime el <b style="color:#ffd700">número amarillo</b> de la imagen que pertenece a la Pregunta 2, 3, 4, 5...</p>
<div class="grid">
"""

for seq, page_num, i_idx, sz_kb, b64, ext, current_q in rows:
    html += f"""
<div class="card">
  <img src="data:image/{ext};base64,{b64}" alt="Img {seq}">
  <div class="info">
    <div class="num">#{seq}</div>
    <div class="q">Actualmente → Pregunta {current_q}</div>
    <div class="loc">Pág {page_num}, Img#{i_idx} | {sz_kb:.1f} KB</div>
  </div>
</div>"""

html += """
</div>
</body>
</html>"""

with open(out_html, "w", encoding="utf-8") as f:
    f.write(html)

print(f"HTML generado: {out_html}")
