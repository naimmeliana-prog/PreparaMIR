import sys

packages = ["pypdf", "fitz", "pdf2image", "PIL", "cv2"]
print("=== VERIFICACIÓN DE PAQUETES DE PYTHON ===")
for p in packages:
    try:
        __import__(p)
        print(f"  - {p}: INSTALADO [OK]")
    except ImportError:
        print(f"  - {p}: NO instalado")
