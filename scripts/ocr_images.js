// Script para leer los números de las imágenes usando tesseract.js
const fs = require('fs');
const path = require('path');
const { createWorker } = require('tesseract.js');

async function processImages() {
    const imagesDir = path.join(__dirname, '..', 'public', 'images', 'exams', '2025');
    
    // Check if dir exists
    if (!fs.existsSync(imagesDir)) {
        console.error("Directorio no encontrado:", imagesDir);
        return;
    }

    const files = fs.readdirSync(imagesDir).filter(f => f.startsWith('temp_img_') && f.endsWith('.png'));
    if (files.length === 0) {
        console.log("No hay imágenes temporales para procesar.");
        return;
    }

    console.log(`Iniciando OCR en ${files.length} imágenes usando tesseract.js...`);
    const worker = await createWorker('spa');

    let successCount = 0;

    for (const file of files) {
        const filePath = path.join(imagesDir, file);
        try {
            const { data: { text } } = await worker.recognize(filePath);
            
            // Buscar "Imagen N" o solo un número
            const match = text.match(/[Ii]magen\s+(\d+)\s*([ab]?)/i) || text.match(/\b(\d{1,2})\b/);
            
            if (match) {
                const num = match[1];
                const suf = match[2] ? match[2].toLowerCase() : '';
                const newName = `pregunta_${num}${suf}.png`;
                const newPath = path.join(imagesDir, newName);
                
                fs.renameSync(filePath, newPath);
                console.log(`[OK] ${file} -> ${newName} (Detectado: ${text.trim().replace(/\n/g, ' ')})`);
                successCount++;
            } else {
                console.log(`[??] ${file} -> No se pudo detectar número. Texto: ${text.trim().replace(/\n/g, ' ')}`);
            }
        } catch (err) {
            console.error(`Error procesando ${file}:`, err.message);
        }
    }

    await worker.terminate();
    console.log(`OCR finalizado. ${successCount}/${files.length} procesadas con éxito.`);
}

processImages();
