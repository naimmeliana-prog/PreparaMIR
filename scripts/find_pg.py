import os
paths = [
    r"C:\Program Files\PostgreSQL",
    r"C:\Program Files (x86)\PostgreSQL",
]
for p in paths:
    if os.path.exists(p):
        print(f"Encontrado: {p}")
        print("Contenido:", os.listdir(p))
    else:
        print(f"No existe: {p}")
