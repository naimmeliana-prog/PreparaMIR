import os, glob, sys
import tkinter as tk
from tkinter import messagebox
from PIL import Image, ImageTk

base_dir = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
out_dir = os.path.join(base_dir, "public", "images", "exams", "2025")
temp_files = sorted(glob.glob(os.path.join(out_dir, "temp_img_*.png")))

if not temp_files:
    sys.exit("No hay temp_img_*.png para procesar. Ejecuta python scripts/extract_mir_temp.py primero.")

current_idx = 0

def show_next():
    global current_idx
    if current_idx >= len(temp_files):
        messagebox.showinfo("Fin", "¡Todas las imágenes mapeadas correctamente!")
        root.destroy()
        return

    fpath = temp_files[current_idx]
    
    img = Image.open(fpath)
    img.thumbnail((800, 800))
    photo = ImageTk.PhotoImage(img)
    
    lbl_img.config(image=photo)
    lbl_img.image = photo
    
    lbl_info.config(text=f"Imagen {current_idx+1} de {len(temp_files)}\nEscribe el número de la pregunta y pulsa ENTER (ej. 1, 2, 25)")
    entry.delete(0, tk.END)
    entry.focus()

def on_enter(event):
    global current_idx
    val = entry.get().strip().lower()
    if not val: return
    
    # Rename file
    old_path = temp_files[current_idx]
    new_name = f"pregunta_{val}.png"
    new_path = os.path.join(out_dir, new_name)
    
    try:
        os.replace(old_path, new_path)
    except Exception as e:
        messagebox.showerror("Error", f"No se pudo renombrar: {e}")
        return
        
    current_idx += 1
    show_next()

root = tk.Tk()
root.title("Mapeador Rápido de Imágenes MIR 2025")
root.geometry("900x900")

lbl_img = tk.Label(root)
lbl_img.pack(pady=10, expand=True)

lbl_info = tk.Label(root, font=("Arial", 14, "bold"))
lbl_info.pack(pady=5)

entry = tk.Entry(root, font=("Arial", 24), justify='center', width=10)
entry.pack(pady=10)
entry.bind("<Return>", on_enter)

show_next()
root.mainloop()
