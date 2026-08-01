from PIL import Image, ImageDraw, ImageFont
import os

base_dir = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
img_path = os.path.join(base_dir, "public", "images", "exams", "2025", "pregunta_11.png")

if os.path.exists(img_path):
    img = Image.open(img_path)
    draw = ImageDraw.Draw(img)
    
    # Dibujar un gran rectángulo blanco para tapar mi parche anterior y el texto "Imagen 12"
    # [x0, y0, x1, y1]
    draw.rectangle([0, 0, 450, 150], fill="white")
    
    try:
        font = ImageFont.truetype("arial.ttf", 35)
    except:
        font = ImageFont.load_default()
        
    # Escribir "Imagen 11" en negro, justo donde estaba el otro
    draw.text((180, 80), "Imagen 11", fill="black", font=font)
    
    img.save(img_path)
    print("Imagen corregida con éxito.")
else:
    print("No se encontró pregunta_11.png")
