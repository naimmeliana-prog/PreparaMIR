export interface ExamImageRef {
  url: string;
  alt: string;
  caption: string;
}

export interface ExamQuestion {
  id: string;
  category: string;
  stem: string;
  image?: ExamImageRef;
  options: string[];
  correctIndex: number;
  explanation: string;
  refYear?: string;
}

export interface ExamMeta {
  year: string;
  date: string;
  plazas: string;
  note: string;
  topSpecialties: { name: string; pct: string }[];
}

export interface LocalExamQuestion extends ExamQuestion {
  localNumber: number;
  originId: string;
}

<<<<<<< HEAD
import mir2025 from "./data/mir_2025.json";
import mir2024 from "./data/mir_2024.json";
import mir2023 from "./data/mir_2023.json";
import mir2022 from "./data/mir_2022.json";
import mir2021 from "./data/mir_2021.json";

const REAL_EXAMS: Record<string, any[]> = {
  "2025": mir2025,
  "2024": mir2024,
  "2023": mir2023,
  "2022": mir2022,
  "2021": mir2021,
};

=======
>>>>>>> 1256ef975a9f2d43e80bb7b5543bd3902a7f17c8
export const EXAM_SOURCE = {
  name: "Ministerio de Sanidad",
  label: "Convocatorias y documentación FSE — Ministerio de Sanidad",
  url: "https://fse.mscbs.gob.es/fseweb/view/index.xhtml",
};

export const EXAM_FORMAT = {
  totalQuestions: 210,
  evaluable: 200,
  reserva: 10,
  options: 4,
  hours: 5,
  imageQuestions: 25,
  scoring: "Cada acierto suma +1 punto · cada fallo resta −0,33 · las preguntas en blanco no puntúan.",
  weight: "Nota final = 90% examen + 10% expediente académico.",
};

export const EXAM_CATEGORIES = [
  "Cardiología",
  "Neumología",
  "Aparato digestivo",
  "Endocrinología",
  "Nefrología",
  "Hematología",
  "Neurología",
  "Infecciosas",
  "Reumatología",
  "Dermatología",
  "Pediatría",
  "Ginecología y Obstetricia",
  "Cirugía General",
  "Traumatología",
  "Urología",
  "Oftalmología",
  "Otorrinolaringología",
  "Psiquiatría",
  "Medicina Familiar",
  "Bioestadística y Salud Pública",
  "Farmacología",
  "Inmunología",
  "Medicina Intensiva",
  "Oncología",
] as const;

export const examList: ExamMeta[] = [
  {
    year: "2025",
    date: "25 enero 2025",
    plazas: "9.007",
    note: "Convocatoria 2024/2025; incremento del 2,9% y nuevo máximo para Medicina.",
    topSpecialties: [
      { name: "Medicina Familiar", pct: "~18%" },
      { name: "Pediatría", pct: "~10%" },
      { name: "Cardiología", pct: "~8%" },
      { name: "Ginecología", pct: "~7%" },
      { name: "Cirugía General", pct: "~6%" },
    ],
  },
  {
    year: "2024",
    date: "27 enero 2024",
    plazas: "8.772",
    note: "Récord histórico de plazas convocadas.",
    topSpecialties: [
      { name: "Medicina Familiar", pct: "~18%" },
      { name: "Pediatría", pct: "~10%" },
      { name: "Cardiología", pct: "~8%" },
      { name: "Ginecología", pct: "~7%" },
      { name: "Cirugía General", pct: "~6%" },
    ],
  },
  {
    year: "2023",
    date: "28 enero 2023",
    plazas: "8.162",
    note: "5 versiones del cuadernillo.",
    topSpecialties: [
      { name: "Medicina Familiar", pct: "~18%" },
      { name: "Pediatría", pct: "~10%" },
      { name: "Neumología", pct: "~7%" },
      { name: "Ginecología", pct: "~7%" },
      { name: "Aparato digestivo", pct: "~6%" },
    ],
  },
  {
    year: "2022",
    date: "29 enero 2022",
    plazas: "7.954",
    note: "200 preguntas + 10 de reserva.",
    topSpecialties: [
      { name: "Medicina Familiar", pct: "~17%" },
      { name: "Pediatría", pct: "~10%" },
      { name: "Cardiología", pct: "~8%" },
      { name: "Ginecología", pct: "~7%" },
      { name: "Neurología", pct: "~6%" },
    ],
  },
  {
    year: "2021",
    date: "27 marzo 2021",
    plazas: "7.547",
    note: "Convocatoria excepcional retrasada por la pandemia.",
    topSpecialties: [
      { name: "Medicina Familiar", pct: "~17%" },
      { name: "Pediatría", pct: "~10%" },
      { name: "Infecciosas", pct: "~9%" },
      { name: "Neumología", pct: "~8%" },
      { name: "Cardiología", pct: "~7%" },
    ],
  },
];

export const examQuestions: ExamQuestion[] = [
  {
    id: "ex-1",
    category: "Cardiología",
    refYear: "2024",
    stem: "Observe el trazado de la imagen. Se aprecia un ritmo irregularmente irregular, sin ondas P reconocibles y con actividad fibrilatoria de la línea base. ¿Cuál es el diagnóstico?",
    image: {
      url: "https://images.pexels.com/photos/415779/pexels-photo-415779.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      alt: "Trazado electrocardiográfico sobre papel milimetrado",
      caption: "Imagen asociada (ejemplo): trazado electrocardiográfico.",
    },
    options: ["Taquicardia ventricular", "Fibrilación auricular", "Bloqueo AV completo", "Aleteo auricular"],
    correctIndex: 1,
    explanation: "La ausencia de ondas P y un ritmo irregularmente irregular definen la fibrilación auricular.",
  },
  { id: "ex-2", category: "Cardiología", refYear: "2023", stem: "Varón de 58 años con dolor torácico opresivo de 40 minutos. El ECG muestra elevación del ST en DII, DIII y aVF. ¿Cuál es la medida que más reduce la mortalidad?", options: ["Nitroglicerina sublingual", "Angioplastia primaria (ICP)", "Betabloqueante oral", "Morfina intravenosa"], correctIndex: 1, explanation: "En el IAMCEST, la ICP primaria es la intervención con mayor impacto en la mortalidad." },
  { id: "ex-3", category: "Cardiología", refYear: "2022", stem: "En la insuficiencia cardíaca con fracción de eyección reducida, ¿qué fármaco NO ha demostrado reducir la mortalidad?", options: ["Betabloqueante", "Digoxina", "ARNI", "iSGLT2"], correctIndex: 1, explanation: "La digoxina mejora síntomas, no mortalidad." },
  { id: "ex-4", category: "Cardiología", refYear: "2021", stem: "Mujer de 75 años con fibrilación auricular, CHA₂DS₂-VASc de 4 y sin contraindicaciones. ¿Qué hacer para prevenir ictus?", options: ["Nada", "AAS", "Anticoagulación con DOAC", "Cardioversión"], correctIndex: 2, explanation: "Con CHA₂DS₂-VASc alto, la prevención adecuada es anticoagulación." },
  {
    id: "ex-5",
    category: "Neumología",
    refYear: "2024",
    stem: "Varón de 68 años, fumador, con fiebre, tos productiva y dolor pleurítico. En la radiografía de tórax de la imagen se observa un infiltrado de consolidación. ¿Cuál es el agente causal más frecuente?",
    image: { url: "https://images.pexels.com/photos/6202748/pexels-photo-6202748.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", alt: "Radiografía de tórax", caption: "Imagen asociada (ejemplo): radiografía de tórax con consolidación." },
    options: ["Mycoplasma pneumoniae", "Streptococcus pneumoniae", "Legionella pneumophila", "Haemophilus influenzae"],
    correctIndex: 1,
    explanation: "Streptococcus pneumoniae es el agente más frecuente de la NAC.",
  },
  { id: "ex-6", category: "Neumología", refYear: "2022", stem: "El diagnóstico de EPOC se confirma cuando, tras broncodilatador, la relación FEV₁/FVC es:", options: ["< 0,70", "< 0,60", "< 0,80", "Normal con FEV₁ bajo"], correctIndex: 0, explanation: "EPOC = FEV₁/FVC < 0,70 postbroncodilatador." },
  { id: "ex-7", category: "Neumología", refYear: "2023", stem: "Un Dímero-D normal en un paciente con baja probabilidad clínica de TEP:", options: ["Requiere angio-TAC", "Descarta razonablemente el TEP", "Indica trombólisis", "Confirma la enfermedad"], correctIndex: 1, explanation: "En baja probabilidad clínica, Dímero-D negativo descarta TEP." },
  { id: "ex-8", category: "Neumología", refYear: "2020", stem: "Según CURB-65, ¿a partir de qué puntuación suele indicarse ingreso hospitalario?", options: ["0", "1", "≥2", "Solo si fiebre"], correctIndex: 2, explanation: "CURB-65 ≥2 suele indicar ingreso." },
  { id: "ex-9", category: "Aparato digestivo", refYear: "2024", stem: "Varón cirrótico con ascitis y 400 PMN/mm³ en líquido ascítico. ¿Diagnóstico y tratamiento?", options: ["Tuberculosis", "Peritonitis bacteriana espontánea; cefalosporina de 3ª", "Quilotórax", "Solo dieta"], correctIndex: 1, explanation: ">250 PMN/mm³ define PBE; se trata con cefalosporina de 3ª." },
  { id: "ex-10", category: "Aparato digestivo", refYear: "2021", stem: "En la pancreatitis aguda, ¿qué enzima es más específica?", options: ["Amilasa", "Lipasa", "Transaminasas", "Fosfatasa alcalina"], correctIndex: 1, explanation: "La lipasa es más específica que la amilasa." },
  { id: "ex-11", category: "Aparato digestivo", refYear: "2023", stem: "¿Qué rasgo es característico de Crohn frente a colitis ulcerosa?", options: ["Afectación continua desde recto", "Solo mucosa", "Afectación transmural y saltante", "Ausencia de granulomas"], correctIndex: 2, explanation: "Crohn es transmural y de patrón saltante." },
  { id: "ex-12", category: "Endocrinología", refYear: "2024", stem: "DM2 reciente con IMC 31. Fármaco de primera línea:", options: ["Insulina", "Glibenclamida", "Metformina", "Pioglitazona"], correctIndex: 2, explanation: "Metformina es el tratamiento inicial habitual en DM2." },
  { id: "ex-13", category: "Endocrinología", refYear: "2022", stem: "Astenia, frío, bradicardia, estreñimiento. Patrón analítico más probable:", options: ["TSH alta y T4 baja", "TSH baja y T4 alta", "TSH normal", "T3 aislada alta"], correctIndex: 0, explanation: "Cuadro típico de hipotiroidismo primario." },
  { id: "ex-14", category: "Endocrinología", refYear: "2020", stem: "Prueba de cribado útil para hipercortisolismo endógeno:", options: ["Cortisol basal aislado", "Supresión con 1 mg de dexametasona", "TSH", "Aldosterona"], correctIndex: 1, explanation: "La supresión con dexametasona de 1 mg es prueba estándar de cribado." },
  { id: "ex-15", category: "Nefrología", refYear: "2023", stem: "Primera prueba de imagen para descartar obstrucción en LRA:", options: ["TAC con contraste", "Ecografía renal", "Urografía", "RM"], correctIndex: 1, explanation: "La ecografía renal es la prueba inicial." },
  { id: "ex-16", category: "Nefrología", refYear: "2021", stem: "Complicación más inmediatamente letal de la lesión renal aguda:", options: ["Anemia", "Hiperpotasemia", "Hipocalcemia", "Hiperfosfatemia"], correctIndex: 1, explanation: "La hiperpotasemia puede causar arritmias mortales." },
  { id: "ex-17", category: "Hematología", refYear: "2024", stem: "Varón de 60 años con anemia microcítica y ferritina baja. ¿Qué estudio es prioritario?", options: ["Tiroides", "Estudio digestivo para descartar neoplasia", "Electroforesis Hb", "Vitamina B12"], correctIndex: 1, explanation: "La ferropenia en adultos obliga a descartar sangrado digestivo y neoplasia." },
  { id: "ex-18", category: "Hematología", refYear: "2022", stem: "La anemia de enfermedad crónica suele presentar:", options: ["Ferritina baja y TIBC alta", "Ferritina normal/alta y TIBC baja", "VCM >100", "Reticulocitos elevados"], correctIndex: 1, explanation: "Ese perfil analítico es típico de anemia inflamatoria." },
  { id: "ex-19", category: "Neurología", refYear: "2024", stem: "Ventana máxima de trombólisis IV en ictus isquémico:", options: ["1 h", "3 h", "4,5 h", "24 h"], correctIndex: 2, explanation: "La trombólisis IV se administra hasta 4,5 horas en seleccionados." },
  { id: "ex-20", category: "Neurología", refYear: "2022", stem: "Afasia de Broca con hemiparesia derecha localiza en:", options: ["ACA izquierda", "ACM izquierda", "ACP derecha", "Basilar"], correctIndex: 1, explanation: "La arteria cerebral media izquierda irriga el área de Broca." },
  { id: "ex-21", category: "Infecciosas", refYear: "2023", stem: "Vasopresor de elección en shock séptico:", options: ["Dopamina", "Noradrenalina", "Adrenalina", "Fenilefrina"], correctIndex: 1, explanation: "La noradrenalina es el primer vasopresor recomendado." },
  { id: "ex-22", category: "Infecciosas", refYear: "2021", stem: "LCR típico en meningitis bacteriana aguda:", options: ["Glucosa normal y linfocitos", "Glucorraquia baja y neutrófilos", "Proteínas bajas", "Glucosa alta"], correctIndex: 1, explanation: "Patrón clásico: glucosa baja, proteínas altas y neutrofilia." },
  { id: "ex-23", category: "Infecciosas", refYear: "2020", stem: "Endocarditis en usuario de drogas IV: germen más probable:", options: ["Viridans", "Staphylococcus aureus", "Candida", "Enterococo"], correctIndex: 1, explanation: "S. aureus es el patógeno típico." },
  {
    id: "ex-24",
    category: "Dermatología",
    refYear: "2024",
    stem: "Lesión pigmentada asimétrica, bordes irregulares y coloración heterogénea. ¿Sospecha principal?",
    image: { url: "https://images.pexels.com/photos/4046561/pexels-photo-4046561.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", alt: "Lesión pigmentada cutánea", caption: "Imagen asociada (ejemplo): lesión pigmentada cutánea." },
    options: ["Hemangioma", "Melanoma maligno", "Queratosis seborreica", "Nevus benigno"], correctIndex: 1, explanation: "Regla ABCDE compatible con melanoma.",
  },
  { id: "ex-25", category: "Dermatología", refYear: "2022", stem: "En LES, ¿qué autoanticuerpo es el más sensible para cribado?", options: ["Anti-Sm", "Anti-DNA nativo", "ANA", "FR"], correctIndex: 2, explanation: "Los ANA son muy sensibles para cribado de LES." },
  { id: "ex-26", category: "Pediatría", refYear: "2024", stem: "Ictericia en las primeras 24 horas de vida. Causa más frecuente:", image: { url: "https://images.pexels.com/photos/14751439/pexels-photo-14751439.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", alt: "Exploración de recién nacido", caption: "Imagen asociada (ejemplo): exploración neonatal." }, options: ["Ictericia fisiológica", "Enfermedad hemolítica por Rh/ABO", "Leche materna", "Crigler-Najjar"], correctIndex: 1, explanation: "La ictericia en primeras 24 h es patológica; lo más frecuente es hemólisis por incompatibilidad." },
  { id: "ex-27", category: "Pediatría", refYear: "2023", stem: "Lactante de 6 meses con otitis media aguda y abombamiento timpánico. Tratamiento de elección:", options: ["Observación", "Amoxicilina oral", "Azitromicina", "Ciprofloxacino"], correctIndex: 1, explanation: "En <2 años con OMA clara, la amoxicilina es el tratamiento de elección." },
  { id: "ex-28", category: "Pediatría", refYear: "2022", stem: "Niño de 3 años con tos perruna y estridor nocturno tras catarro. Diagnóstico:", options: ["Epiglotitis", "Croup", "Cuerpo extraño", "Asma"], correctIndex: 1, explanation: "Tos perruna + estridor + contexto catarral = croup." },
  { id: "ex-29", category: "Pediatría", refYear: "2021", stem: "Bronquiolitis aguda del lactante: tratamiento rutinario más correcto:", options: ["Antibióticos", "Soporte: oxígeno e hidratación", "Corticoides IV", "Broncodilatadores obligados"], correctIndex: 1, explanation: "La bronquiolitis se trata fundamentalmente con medidas de soporte." },
  { id: "ex-30", category: "Ginecología y Obstetricia", refYear: "2024", stem: "Gestante de 35 semanas con TA 160/100, cefalea y proteinuria 3+. Actitud urgente:", options: ["Control en 48 h", "Sulfato de magnesio + finalizar gestación", "Reposo domiciliario", "Diuréticos"], correctIndex: 1, explanation: "Preeclampsia grave: sulfato de magnesio y finalización de la gestación." },
  { id: "ex-31", category: "Ginecología y Obstetricia", refYear: "2023", stem: "Amenorrea de 7 semanas, dolor en FID y sangrado escaso. ¿Qué hay que descartar con urgencia?", options: ["Apendicitis", "Embarazo ectópico", "EIP", "Torsión"], correctIndex: 1, explanation: "Ectópico hasta demostrar lo contrario." },
  { id: "ex-32", category: "Ginecología y Obstetricia", refYear: "2022", stem: "Cribado de cáncer de cérvix recomendado:", options: ["Citología anual", "Citología cada 3 años / HPV cada 5 según edad", "Eco transvaginal", "CA-125"], correctIndex: 1, explanation: "Ese es el esquema general de cribado." },
  { id: "ex-33", category: "Cirugía General", refYear: "2024", stem: "Dolor abdominal, distensión, ausencia de heces y niveles hidroaéreos. Diagnóstico más probable:", options: ["Perforación", "Obstrucción intestinal", "Apendicitis", "Pancreatitis"], correctIndex: 1, explanation: "Los niveles hidroaéreos y la clínica orientan a obstrucción intestinal." },
  { id: "ex-34", category: "Cirugía General", refYear: "2022", stem: "Dolor en FID, fiebre, defensa y Blumberg positivo. Diagnóstico:", options: ["Diverticulitis", "Apendicitis aguda", "Crohn", "Torsión ovárica"], correctIndex: 1, explanation: "Cuadro clásico de apendicitis aguda." },
  { id: "ex-35", category: "Cirugía General", refYear: "2020", stem: "Hernia que desciende al escroto y sigue el conducto inguinal:", options: ["Directa", "Indirecta", "Femoral", "Umbilical"], correctIndex: 1, explanation: "La hernia inguinal indirecta es la que puede descender al escroto." },
  { id: "ex-36", category: "Traumatología", refYear: "2023", stem: "Anciana con fractura subcapital de fémur. Tratamiento más habitual:", options: ["Tracción", "Artroplastia", "Tornillos canulados", "Reposo"], correctIndex: 1, explanation: "En ancianos, la artroplastia es una opción muy frecuente." },
  { id: "ex-37", category: "Traumatología", refYear: "2021", stem: "Lesión ligamentosa de tobillo: maniobra radiológica útil clásicamente:", options: ["Rx simple", "Rx bajo estrés en inversión", "TAC", "Gammagrafía"], correctIndex: 1, explanation: "La radiografía bajo estrés se ha usado para valorar incompetencia ligamentaria." },
  { id: "ex-38", category: "Urología", refYear: "2024", stem: "Hematuria macroscópica indolora en fumador. Primero hay que descartar:", options: ["ITU", "Cáncer de vejiga", "HBP", "Litiasis"], correctIndex: 1, explanation: "La hematuria indolora del fumador obliga a descartar neoplasia vesical." },
  { id: "ex-39", category: "Urología", refYear: "2022", stem: "Varón con nicturia, chorro débil y próstata grande no dolorosa. Diagnóstico más probable:", options: ["Cáncer de próstata", "HBP", "Prostatitis aguda", "Estenosis uretral"], correctIndex: 1, explanation: "Cuadro típico de hiperplasia benigna de próstata." },
  { id: "ex-40", category: "Oftalmología", refYear: "2024", stem: "Paciente diabético con microaneurismas y exudados duros en el fondo de ojo. Diagnóstico:", image: { url: "https://images.pexels.com/photos/5765827/pexels-photo-5765827.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", alt: "Exploración oftalmológica", caption: "Imagen asociada (ejemplo): exploración oftalmológica." }, options: ["Retinopatía diabética no proliferativa", "Proliferativa", "DMAE", "Desprendimiento"], correctIndex: 0, explanation: "Microaneurismas y exudados duros son hallazgos típicos de la forma no proliferativa." },
  { id: "ex-41", category: "Oftalmología", refYear: "2022", stem: "Dolor ocular intenso, ojo rojo y midriasis media. Diagnóstico urgente:", options: ["Conjuntivitis", "Glaucoma agudo de ángulo cerrado", "Uveítis", "Queratitis"], correctIndex: 1, explanation: "Es una urgencia oftalmológica típica." },
  { id: "ex-42", category: "Otorrinolaringología", refYear: "2023", stem: "Otalgia, fiebre y otorrea súbita con alivio del dolor en un niño. Diagnóstico más probable:", options: ["Otitis externa", "OMA perforada", "Otitis serosa", "Cuerpo extraño"], correctIndex: 1, explanation: "La perforación timpánica en OMA puede aliviar el dolor al drenar." },
  { id: "ex-43", category: "Psiquiatría", refYear: "2024", stem: "Alucinaciones auditivas, delirios y aplanamiento afectivo de 6 meses. Diagnóstico más probable:", options: ["Trastorno bipolar", "Esquizofrenia", "Esquizoafectivo", "Depresión psicótica"], correctIndex: 1, explanation: "La duración y la combinación de síntomas orientan a esquizofrenia." },
  { id: "ex-44", category: "Psiquiatría", refYear: "2022", stem: "Fármaco de primera línea en trastorno de pánico:", options: ["BZD sola", "ISRS + BZD breve", "Antipsicótico", "Litio"], correctIndex: 1, explanation: "Los ISRS son base del tratamiento; puede usarse benzodiacepina al inicio." },
  { id: "ex-45", category: "Medicina Familiar", refYear: "2024", stem: "Causa más frecuente de HTA secundaria:", options: ["Estenosis renal", "Aldosteronismo primario", "Feocromocitoma", "Cushing"], correctIndex: 1, explanation: "El aldosteronismo primario es la causa secundaria más frecuente." },
  { id: "ex-46", category: "Medicina Familiar", refYear: "2022", stem: "Lumbalgia mecánica sin signos de alarma de 4 semanas. Conducta adecuada:", options: ["RM urgente", "Analgesia, ejercicio y reevaluación", "Rx inmediata", "Cirugía"], correctIndex: 1, explanation: "Sin banderas rojas, no se precisa imagen inicial." },
  { id: "ex-47", category: "Bioestadística y Salud Pública", refYear: "2024", stem: "La sensibilidad de una prueba diagnóstica se define como:", options: ["Probabilidad de prueba positiva en un enfermo", "Probabilidad de estar enfermo si positiva", "Probabilidad de estar sano si negativa", "Proporción de enfermos clasificados como sanos"], correctIndex: 0, explanation: "Sensibilidad = VP / (VP + FN)." },
  { id: "ex-48", category: "Bioestadística y Salud Pública", refYear: "2023", stem: "En un estudio de casos y controles se usa como medida de asociación:", options: ["RR", "OR", "Riesgo atribuible", "Diferencia de medias"], correctIndex: 1, explanation: "La OR es la medida clásica de asociación en casos-controles." },
  { id: "ex-49", category: "Bioestadística y Salud Pública", refYear: "2022", stem: "Un IC 95% para una diferencia de medias que incluye 0 significa que:", options: ["Es significativo", "No se rechaza hipótesis nula", "Es clínicamente relevante", "Muestra insuficiente seguro"], correctIndex: 1, explanation: "Si incluye el valor nulo, no hay significación estadística al 5%." },
  { id: "ex-50", category: "Farmacología", refYear: "2024", stem: "¿Qué fármaco está contraindicado en el embarazo por teratogenicidad?", options: ["Paracetamol", "Warfarina", "HBPM", "Amoxicilina"], correctIndex: 1, explanation: "La warfarina es teratógena; en embarazo se prefieren heparinas." },
  { id: "ex-51", category: "Farmacología", refYear: "2022", stem: "La agranulocitosis por clozapina es una reacción adversa tipo:", options: ["A", "B", "C", "D"], correctIndex: 1, explanation: "Es una reacción tipo B: idiosincrásica y no predecible." },
  { id: "ex-52", category: "Inmunología", refYear: "2023", stem: "En anafilaxia, mediador principal responsable de broncoespasmo y vasodilatación:", options: ["C3a", "Histamina", "LTB4", "PGE2"], correctIndex: 1, explanation: "La histamina es un mediador principal de la anafilaxia." },
  { id: "ex-53", category: "Medicina Intensiva", refYear: "2024", stem: "En fibrilación ventricular, la secuencia correcta incluye:", options: ["Compresiones → adrenalina → choque", "Compresiones → choque → adrenalina", "Choque → compresiones → adrenalina tras 2.º choque", "Adrenalina → choque → compresiones"], correctIndex: 2, explanation: "En FV se desfibrila precozmente y se continúa RCP con algoritmos de ALS." },
  { id: "ex-54", category: "Oncología", refYear: "2023", stem: "Masa mamaria RE+, HER2−, sin ganglios. Tratamiento adyuvante sistémico típico:", options: ["Quimioterapia sola", "Hormonoterapia", "Trastuzumab", "Radioterapia sola"], correctIndex: 1, explanation: "En tumores hormonodependientes, la hormonoterapia es pilar terapéutico." },
  { id: "ex-55", category: "Reumatología", refYear: "2022", stem: "Rigidez matutina >1 hora, sinovitis simétrica de manos y FR positivo. Diagnóstico:", options: ["Artrosis", "Artritis reumatoide", "LES", "Artritis psoriásica"], correctIndex: 1, explanation: "Cuadro clásico de artritis reumatoide." },
  { id: "ex-56", category: "Aparato digestivo", refYear: "2024", stem: "Ecografía abdominal con pared vesicular engrosada, cálculos y líquido pericolecístico. Diagnóstico:", image: { url: "https://images.pexels.com/photos/7108424/pexels-photo-7108424.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", alt: "Ecografía abdominal", caption: "Imagen asociada (ejemplo): ecografía abdominal." }, options: ["Colecistitis aguda", "Colangitis", "Pancreatitis", "Colecistitis crónica"], correctIndex: 0, explanation: "Hallazgos compatibles con colecistitis aguda litiásica." },
  { id: "ex-57", category: "Inmunología", refYear: "2023", stem: "Depósitos granulares de inmunocomplejos en glomérulo en paciente con LES. Nefropatía más probable:", image: { url: "https://images.pexels.com/photos/36816507/pexels-photo-36816507.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", alt: "Histología microscópica", caption: "Imagen asociada (ejemplo): histología microscópica." }, options: ["Membranosa", "Nefropatía lúpica difusa clase IV", "Nefropatía IgA", "Nefropatía diabética"], correctIndex: 1, explanation: "La forma proliferativa difusa es la más grave y muy preguntada." },
  { id: "ex-58", category: "Ginecología y Obstetricia", refYear: "2021", stem: "Metrorragia posmenopáusica. Prueba diagnóstica de elección:", options: ["Ecografía transvaginal y biopsia endometrial", "Citología cervical", "CA-125", "Histeroscopia sin biopsia"], correctIndex: 0, explanation: "Hay que descartar cáncer de endometrio con eco y biopsia." },
  { id: "ex-59", category: "Cirugía General", refYear: "2023", stem: "Dolor abdominal en tabla y aire subdiafragmático. Diagnóstico y actitud:", options: ["Pancreatitis", "Perforación de víscera hueca; cirugía urgente", "Obstrucción; tratamiento médico", "Isquemia mesentérica; anticoagulación"], correctIndex: 1, explanation: "Neumoperitoneo + abdomen en tabla = perforación y cirugía urgente." },
  { id: "ex-60", category: "Bioestadística y Salud Pública", refYear: "2021", stem: "El tratamiento reduce el riesgo del 20% al 10%. ¿Cuál es el NNT?", options: ["5", "10", "20", "2"], correctIndex: 1, explanation: "RAR 10%; NNT = 1/0,10 = 10." },
];

function stableRotate<T>(arr: T[], shift: number) {
  const list = [...arr];
  const n = list.length;
  return list.map((_, i) => list[(i + shift) % n]);
}

export function buildLocalExam(year: string): LocalExamQuestion[] {
<<<<<<< HEAD
  // Check if we have the real official exam loaded in JSON
  const realQuestions = REAL_EXAMS[year] || [];
  if (realQuestions.length > 0) {
    return realQuestions.map((q) => {
      const isImageQuestion = q.localNumber <= EXAM_FORMAT.imageQuestions; // first 25 questions
      const imageRef = isImageQuestion ? {
        url: `/images/exams/${year}/pregunta_${q.localNumber}.png?v=5`,
        alt: `Imagen oficial del examen MIR ${year}, pregunta ${q.localNumber}`,
        caption: `Imagen asociada a la pregunta ${q.localNumber} de la convocatoria ${year}.`
      } : undefined;

      return {
        ...q,
        id: `${year}-real-${q.localNumber}`,
        originId: q.id,
        refYear: year,
        image: imageRef,
      };
    });
  }

  // Fallback to rotated mock questions if JSON is empty/not extracted yet
=======
>>>>>>> 1256ef975a9f2d43e80bb7b5543bd3902a7f17c8
  const base = examQuestions.filter((q) => !q.refYear || q.refYear === year);
  const pool = base.length > 0 ? base : examQuestions;
  const yearShift = Number(year) % Math.max(1, pool.length);
  const rotated = stableRotate(pool, yearShift);
  const result: LocalExamQuestion[] = [];
<<<<<<< HEAD
  
  for (let i = 0; i < EXAM_FORMAT.totalQuestions; i += 1) {
    const q = rotated[i % rotated.length];
    const isImageQuestion = i < EXAM_FORMAT.imageQuestions; // first 25 questions
    
    // Assign local image paths extracted from the official PDF if within the first 25 questions
    const imageRef = isImageQuestion ? {
      url: `/images/exams/${year}/pregunta_${i + 1}.png`,
      alt: `Imagen oficial del examen MIR ${year}, pregunta ${i + 1}`,
      caption: `Imagen asociada a la pregunta ${i + 1} de la convocatoria ${year}.`
    } : q.image;

=======
  for (let i = 0; i < EXAM_FORMAT.totalQuestions; i += 1) {
    const q = rotated[i % rotated.length];
>>>>>>> 1256ef975a9f2d43e80bb7b5543bd3902a7f17c8
    result.push({
      ...q,
      id: `${year}-${q.id}-${i + 1}`,
      originId: q.id,
      localNumber: i + 1,
      refYear: year,
<<<<<<< HEAD
      image: imageRef,
=======
>>>>>>> 1256ef975a9f2d43e80bb7b5543bd3902a7f17c8
    });
  }
  return result;
}

export const recentYears = examList.map((e) => e.year);
