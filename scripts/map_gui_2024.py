import os, glob, sys
import tkinter as tk
from tkinter import messagebox
from PIL import Image, ImageTk

base_dir = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
out_dir = os.path.join(base_dir, "public", "images", "exams", "2024")
temp_files = sorted(glob.glob(os.path.join(out_dir, "temp_img_*.png")))

if not temp_files:
    sys.exit("No hay temp_img_*.png. Ejecuta: python scripts/extract_mir_temp_2024.py")

current_idx = 0
used_numbers = set()
needed = set(range(1, 26))

# ─── Ventana principal con tamaño fijo ───────────────────────────────────────
root = tk.Tk()
root.title("Mapeador MIR 2024")
root.resizable(False, False)

W, H = 900, 700          # tamaño fijo de ventana
IMG_H = 430              # altura reservada para la imagen
CTRL_H = H - IMG_H      # el resto, para controles

root.geometry(f"{W}x{H}")

# ─── Canvas para la imagen (tamaño fijo) ─────────────────────────────────────
canvas = tk.Canvas(root, width=W, height=IMG_H, bg="#1a1a2e")
canvas.place(x=0, y=0)

# ─── Panel de controles SIEMPRE visible abajo ────────────────────────────────
frame_ctrl = tk.Frame(root, bg="#f5f5f5", width=W, height=CTRL_H)
frame_ctrl.place(x=0, y=IMG_H)
frame_ctrl.pack_propagate(False)

lbl_info = tk.Label(frame_ctrl, text="", font=("Arial", 11, "bold"),
                    bg="#f5f5f5", justify="center")
lbl_info.pack(pady=(8, 2))

lbl_remaining = tk.Label(frame_ctrl, text="", font=("Arial", 10),
                         fg="#1565C0", bg="#f5f5f5")
lbl_remaining.pack()

entry = tk.Entry(frame_ctrl, font=("Arial", 26), justify="center", width=6,
                 relief="solid", bd=2)
entry.pack(pady=6)
entry.bind("<Return>", lambda e: on_enter())

lbl_hint = tk.Label(frame_ctrl, text="Escribe el número dentro de la foto y pulsa Enter  |  'skip' para saltarla",
                    font=("Arial", 9), fg="#555", bg="#f5f5f5")
lbl_hint.pack()

# ─── Funciones ───────────────────────────────────────────────────────────────
def render_image(fpath):
    img = Image.open(fpath)
    # Escalar manteniendo proporción para caber en el canvas
    img.thumbnail((W - 20, IMG_H - 20), Image.LANCZOS)
    photo = ImageTk.PhotoImage(img)
    canvas.delete("all")
    canvas.image = photo  # evitar GC
    # Centrar en canvas
    cx, cy = W // 2, IMG_H // 2
    canvas.create_image(cx, cy, anchor="center", image=photo)

def update_remaining():
    rem = sorted(needed - used_numbers)
    lbl_remaining.config(text=f"Faltan: {rem}" if rem else "✅ ¡Todos mapeados (1-25)!")

def show_next():
    if current_idx >= len(temp_files):
        messagebox.showinfo("Fin", "¡Proceso completado!")
        root.destroy()
        return
    render_image(temp_files[current_idx])
    lbl_info.config(text=f"Archivo {current_idx + 1} de {len(temp_files)}")
    entry.delete(0, tk.END)
    entry.focus()
    update_remaining()

def on_enter():
    global current_idx
    val = entry.get().strip().lower()
    if not val:
        return

    if val == "skip":
        current_idx += 1
        show_next()
        return

    try:
        num = int(val)
    except ValueError:
        messagebox.showwarning("Error", f"'{val}' no es válido. Escribe un número o 'skip'.")
        return

    if num in used_numbers:
        if not messagebox.askyesno("¡Duplicado!",
                                   f"¡El número {num} ya fue usado! ¿Sobreescribir?"):
            entry.delete(0, tk.END)
            entry.focus()
            return

    old_path = temp_files[current_idx]
    new_path = os.path.join(out_dir, f"pregunta_{num}.png")
    try:
        os.replace(old_path, new_path)
    except Exception as ex:
        messagebox.showerror("Error", str(ex))
        return

    used_numbers.add(num)
    current_idx += 1
    show_next()

show_next()
root.mainloop()
