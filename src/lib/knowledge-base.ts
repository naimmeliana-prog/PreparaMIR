// Knowledge base for the MIR (Médico Interno Residente) tutor.
// Content is authored in Spanish, aligned with high-yield topics for the exam.
// This is reference/educational material curated for revision purposes.

export interface QuizQuestion {
  id: string;
  category: string;
  stem: string;
  options: string[]; // A, B, C, D
  correctIndex: number;
  explanation: string;
}

export interface Topic {
  id: string;
  title: string;
  category: string;
  keywords: string[]; // used by the tutor to match user intent
  summary: string;
  keyPoints: string[];
  highYield: string[];
  practiceQuestion?: QuizQuestion;
}

export const topics: Topic[] = [
  {
    id: "iam-cest",
    title: "Infarto agudo de miocardio con elevación del ST (IAMCEST)",
    category: "Cardiología",
    keywords: [
      "iam",
      "infarto",
      "scacst",
      "iamcest",
      "stem",
      "st",
      "coronario",
      "dolor torácico",
      "angina",
      "troponina",
    ],
    summary:
      "Necrosis miocárdica por oclusión trombótica de una arteria coronaria. Se diagnostica por la tríada: dolor torácico isquémico, cambios del ST en el ECG y elevación de biomarcadores (troponina). El pilar del tratamiento es la reperfusión precoz.",
    keyPoints: [
      "Clínica: dolor torácico opresivo retroesternal >20 min, irradiado a miembro superior izquierdo o mandíbula, con diaforesis y sensación de muerte inminente.",
      "ECG: elevación del ST en al menos 2 derivaciones contiguas. IAMCEST = criterio para reperfución inmediata. La onda Q patológica aparece en horas-días.",
      "Biomarcadores: troponina I/T (se eleva a las 3-4 h, pico hacia las 24 h). La mioglobina es la más precoz pero inespecífica.",
      "Tratamiento: oxígeno si SpO₂ <90%, AAS + inhibidor P2Y12 (clopidogrel/ticagrelor), anticoagulación, betabloqueante, IECA/ARA-II, estatina de alta intensidad.",
      "Reperfusión: ICP (angioplastia) primaria preferente; si no disponible en <120 min, fibrinólisis.",
    ],
    highYield: [
      "ICP primaria: objetivo puerta-globo <90 min en centro con hemodinamia.",
      "Complicaciones mecánicas (días 3-5): rotura del tabique interventricular, insuficiencia mitral por disfunción papilar, rotura de pared libre.",
      "Derivaciones inferiores (DII, DIII, aVF) → arteria coronaria derecha; anteriores (V1-V4) → descendente anterior.",
    ],
  },
  {
    id: "ic",
    title: "Insuficiencia cardíaca (IC)",
    category: "Cardiología",
    keywords: [
      "insuficiencia cardiaca",
      "insuficiencia cardíaca",
      "ic",
      "falla cardiaca",
      "edema",
      "disnea",
      "fevi",
      "peptidos natriureticos",
      "bnp",
    ],
    summary:
      "Síndrome en el que el corazón no logra bombear sangre suficiente para satisfacer las demandas metabólicas. Se clasifica por la fracción de eyección del VI (FEVI): IC con FEVI reducida (<40%), preservada (≥50%) o ligeramente reducida.",
    keyPoints: [
      "Síntomas: disnea de esfuerzo, ortopnea, disnea paroxística nocturna, fatiga, edemas maleolares.",
      "Clasificación NYHA: I (asintomático) a IV (síntomas en reposo).",
      "Pruebas: ECG, radiografía de tórax (cardiomegalia, redistribución), ecocardiografía (gold standard para FEVI), péptidos natriuréticos (BNP/NT-proBNP).",
      "Tratamiento IC-FEr: 4 pilares → betabloqueante + IECA/ARA-II/ARNI + antagonista mineralcorticoideo + iSGLT2. Añadir diurético de asa para congestión.",
      "Mejoran pronóstico (reducen mortalidad): betabloqueante, IECA/ARNI, ARM (espironolactona), iSGLT2 (dapagliflozina/empagliflozina).",
    ],
    highYield: [
      "Los iSGLT2 mejoran el pronóstico tanto en IC-FEr como en IC-FEp.",
      "La digoxina mejora síntomas pero no la mortalidad.",
      "El NT-proBNP <300 pg/mL hace poco probable la IC aguda.",
    ],
  },
  {
    id: "fa",
    title: "Fibrilación auricular (FA)",
    category: "Cardiología",
    keywords: ["fibrilacion auricular", "fibrilación auricular", "fa", "arritmia", "pulso irregular"],
    summary:
      "Arritmia supraventricular por actividad desorganizada de las aurículas; ECG con ondas P ausentes, actividad fibrilatoria y ritmo irregularmente irregular. Aumenta el riesgo de ictus y de insuficiencia cardíaca.",
    keyPoints: [
      "ECG: ausencia de ondas P, líneas onduladas (ondas f) y RR irregularmente irregular.",
      "Manejo: control de frecuencia (betabloqueante/calcioantagonista no dihidropiridínico) y/o control del ritmo (antiarrítmicos, ablación).",
      "Anticoagulación según CHA₂DS₂-VASc (≥2 en varones o ≥3 en mujeres suele indicar anticoagulación).",
      "FA de >48 h o duración desconocida: requerir anticoagulación/TEC antes de cardioversión para evitar ictus embólico.",
    ],
    highYield: [
      "Cardioversión eléctrica inmediata si hay inestabilidad hemodinámica.",
      "HAS-BLED valora el riesgo hemorrágico al anticoagular.",
      "La ablación con aislamiento de venas pulmonares es eficaz en FA paroxística.",
    ],
  },
  {
    id: "hta",
    title: "Hipertensión arterial (HTA)",
    category: "Cardiología",
    keywords: ["hipertensión", "hta", "tension alta", "presión arterial", "presión alta"],
    summary:
      "Elevación persistente de la presión arterial (≥140/90 mmHg en consulta, según criterios clásicos; las guías europeas recientes usan ≥140/90 en consulta y ≥135/85 en AMPA). Es el principal factor de riesgo cardiovascular modificable.",
    keyPoints: [
      "Diagnóstico: ≥140/90 mmHg en consulta en al menos 2 ocasiones, o ≥135/85 por automedición, o MAPA ≥135/85 diurna.",
      "Estilo de vida: dieta DASH, restrictiva en sal (<5 g/día), pérdida de peso, ejercicio,限制 alcohol.",
      "Fármacos de primera línea: IECA/ARA-II, calcioantagonistas (dihidropiridínicos) y diuréticos tiazídicos. Combinar si no se controla.",
      "Descartar hipertensión secundaria si de inicio joven/resistente: aldosteronismo primario, estenosis de renal, feocromocitoma, apnea del sueño.",
    ],
    highYield: [
      "El aldosteronismo primario es la causa más frecuente de HTA secundaria.",
      "Asociar IECA + diurético tiazídico tiene efecto sinérgico.",
      "La HTA acelerada/maligna con retinopatía o encefalopatía es una urgencia/emergencia hipertensiva.",
    ],
  },
  {
    id: "epoc",
    title: "EPOC (Enfermedad pulmonar obstructiva crónica)",
    category: "Neumología",
    keywords: ["epoc", "bronquitis cronica", "enfisema", "disnea", "espirometria", "fev1"],
    summary:
      "Enfermedad prevenible y tratable caracterizada por limitación persistente al flujo aéreo, generalmente progresiva, asociada a una respuesta inflamatoria pulmonar anormal, sobre todo por el tabaco.",
    keyPoints: [
      "Diagnóstico: espirometría con relación FEV₁/FVC <0,70 tras broncodilatador.",
      "Clínica: disnea progresiva, tos crónica, expectoración, historia de tabaquismo.",
      "Tratamiento: abandono del tabaco (lo único que frena la progresión), LAMA o LABA, y combinaciones; IEC si exacerbaciones frecuentes.",
      "Exacerbación: broncodilatadores, corticoide sistémico (prednisona 5 días), antibioterapia si criterios (Anthonisen ≥2: aumento de disnea, volumen/esputo, purulencia).",
      "Oxigenoterapia domiciliaria si hipoxemia grave (PaO₂ ≤55 mmHg o ≤59 con signos de cor pulmonale): mejora la supervivencia.",
    ],
    highYield: [
      "La rehabilitación respiratoria mejora disnea y calidad de vida.",
      "El VSG (volúmenes pulmonares) está aumentado (hiperinsuflación).",
      "Vacunación antigripal y antineumocócica recomendadas.",
    ],
  },
  {
    id: "asma",
    title: "Asma bronquial",
    category: "Neumología",
    keywords: ["asma", "sibilancias", "broncoespasmo", "broncodilatador", "hyperreactividad"],
    summary:
      "Enfermedad inflamatoria crónica de la vía aérea con hiperreactividad bronquial que produce episodios recurrentes de sibilancias, disnea, opresión torácica y tos, sobre todo nocturna o tras desencadenantes.",
    keyPoints: [
      "Diagnóstico: espirometría con obstrucción reversible (↑FEV₁ ≥12% y 200 mL tras broncodilatador) o provocación bronquial positiva.",
      "Tratamiento escalonado (GINA): paso 1 agonista β2 de corta acción a demanda; pasos superiores añaden corticoide inhalado (CI), y CI/LABA.",
      "Crisis asmática: oxígeno, β2 agonista inhalado de acción corta (salbutamol) repetido, corticoide sistémico; considerar sulfato de magnesio/bromuro de ipratropio si grave.",
      "Marcadores: eosinofilia en esputo/sangre y óxido nítrico exhalado (FeNO) elevados sugieren asma T2.",
    ],
    highYield: [
      "La medicación de rescate en GINA actual es CI-formoterol a demanda (no SABA solo).",
      "Crisis con riesgo vital: silencio auscultatorio (fatiga muscular), normocapnia/hipercapnia (cansancio ventilatorio).",
      "Antileucotrienos útiles en asma por ejercicio o alérgica.",
    ],
  },
  {
    id: "tep",
    title: "Tromboembolismo pulmonar (TEP)",
    category: "Neumología",
    keywords: ["tromboembolismo", "tep", "embolia pulmonar", "trombosis", "d-dimero", "dimerod"],
    summary:
      "Obstrucción de la arteria pulmonar por un trombo (generalmente venoso desde las piernas). Cuadro variable desde disnea súbita hasta shock e inestabilidad hemodinámica.",
    keyPoints: [
      "Clínica: disnea súbita, dolor pleurítico, taquicardia, taquipnea, hemoptisis; signos de TVP.",
      "Estratificación: Wells/escala Ginebra + Dímero-D. Dímero-D normal lo descarta si probabilidad baja/intermedia.",
      "Confirma con angio-TAC torácica. Ecocardiografía si inestable (disfunción ventricular derecha).",
      "Tratamiento: anticoagulación (heparina/DOAC). Trombólisis si TEP de alto riesgo (inestable).",
      "Factores de riesgo Virchow: estasis, hipercoagulabilidad, daño endotelial.",
    ],
    highYield: [
      "El Dímero-D tiene alta sensibilidad pero baja especificidad (aumenta también en inflamación, embarazo, cáncer).",
      "La tríada de Virchow explica la formación de trombo.",
      "Filtro de vena cava si contraindicación de anticoagulación o recurrencia a pesar de ella.",
    ],
  },
  {
    id: "neumonia",
    title: "Neumonía adquirida en la comunidad (NAC)",
    category: "Neumología",
    keywords: ["neumonia", "neumonía", "consolidacion", "fiebre", "tos", "streptococcus pneumoniae"],
    summary:
      "Infección aguda del parénquima pulmonar adquirida fuera del hospital. El agente más frecuente es Streptococcus pneumoniae. Estratifica la gravedad para decidir el nivel asistencial.",
    keyPoints: [
      "Clínica: fiebre, tos productiva, dolor pleurítico, disnea; en ancianos puede haber confusión sin fiebre.",
      "Radiografía de tórax: infiltrado/consolidación (imprescindible para el diagnóstico).",
      "Estratificación: CURB-65 (Confusión, Urea, FR, TA, ≥65 años) o PSI para decidir ambulatorio vs ingreso.",
      "Tratamiento ambulatorio sin factores: amoxicilina. Con factores: amoxicilina/clavulánico ± macrólido. Ingreso: ceftriaxona + macrólido.",
    ],
    highYield: [
      "CURB-65 ≥2 suele indicar ingreso hospitalario.",
      "Atípicas (Mycoplasma, Legionella, Chlamydia): tos seca, cefalea, afectación extrapulmonar; macrólido/doxiciclina.",
      "Derrame pleural paraneumónico: toracocentesis diagnóstica si alcanza tamaño.",
    ],
  },
  {
    id: "cirrosis",
    title: "Cirrosis hepática",
    category: "Aparato digestivo",
    keywords: ["cirrosis", "hepatopatia", "ascitis", "varices", "hipertension portal"],
    summary:
      "Enfermedad crónica del hígado en estadio final, caracterizada por fibrosis extensa y nódulos de regeneración que distorsionan la arquitectura hepática, produciendo hipertensión portal e insuficiencia hepatocelular.",
    keyPoints: [
      "Causas: virus de la hepatitis (B, C), alcohol, esteatohepatitis no alcohólica, autoinmune, hemocromatosis.",
      "Complicaciones de hipertensión portal: ascitis, varices esofágicas, encefalopatía hepática, hipersplenismo.",
      "Ascitis: restricción de sodio, diuréticos (espironolactona + furosemida); paracentesis evacuadora con albúmina si tensa.",
      "Encefalopatía hepática: tratada con lactulosa y rifaximina (reducen amonioma bacteriano).",
    ],
    highYield: [
      "Peritonitis bacteriana espontánea: ascitis con >250 PMN/mm³ → cefalosporina de 3ª generación.",
      "El Child-Pugh y el MELD estratifican gravedad y prioridad de trasplante.",
      "Hemorragia por varices: terlipresina + endoscopia con ligadura, profilaxis antibiótica.",
    ],
  },
  {
    id: "pancreatitis",
    title: "Pancreatitis aguda",
    category: "Aparato digestivo",
    keywords: ["pancreatitis", "lipasa", "amylasa", "dolor epigastrico", "litiasis biliar"],
    summary:
      "Proceso inflamatorio agudo del páncreas. Las dos causas más frecuentes son la litiasis biliar y el alcohol. El diagnóstico combina clínica y elevación de enzimas pancreáticas.",
    keyPoints: [
      "Clínica: dolor epigástrico intenso irradiado en banda, náuseas y vómitos.",
      "Diagnóstico: lipasa (más específica) y amilasa 3 veces el límite superior; TAC si diagnóstico dudoso o para valorar gravedad.",
      "Causas: litiasis biliar (mujer, multípara) y alcohol; también hipertrigliceridemia, hipercalcemia, fármacos.",
      "Tratamiento: sueroterapia agresiva, analgesia, antieméticos; nutrición oral precoz si leve. Antibióticos solo si infección demostrada.",
      "Estratificación: escalas Ranson, APACHE II o BISAP para predecir gravedad.",
    ],
    highYield: [
      "La lipasa es más específica y dura más tiempo elevada que la amilasa.",
      "El signo de Grey-Turner (flanco) y Cullen (periumbilical) indican pancreatitis hemorrágica/necrosante.",
      "No usar antibióticos profilácticos de rutina; sí si necrosis infectada.",
    ],
  },
  {
    id: "eii",
    title: "Enfermedad inflamatoria intestinal (EII)",
    category: "Aparato digestivo",
    keywords: ["eii", "crohn", "colitis ulcerosa", "enfermedad de crohn", "diarrea", "rectorragia"],
    summary:
      "Grupo de enfermedades crónicas inflamatorias del intestino: enfermedad de Crohn (afecta cualquier tramo, transmural, saltante) y colitis ulcerosa (recto y colon continuo, mucosa/submucosa).",
    keyPoints: [
      "Crohn: dolor abdominal, diarrea, pérdida de peso, fístulas/estenosis, aftas; granulomas no caseificantes.",
      "Colitis ulcerosa: diarrea con sangre y moco, tenesmo; afectación contínua desde el recto.",
      "Diagnóstico: colonoscopia con biopsias, calprotectina fecal, analítica (anemia, PCR).",
      "Tratamiento: 5-ASA (mesalazina), corticoides en brotes, inmunosupresores (azatioprina) y biológicos (anti-TNF) en formas graves.",
    ],
    highYield: [
      "El Crohn predispone a estenosis y fístulas (perianales); la colitis ulcerosa, al cáncer colorrectal tras años de evolución.",
      "La colitis ulcerosa aumenta el riesgo de colangitis esclerosante primaria.",
      "El tabaquismo empeora el Crohn pero parece protector en la colitis ulcerosa.",
    ],
  },
  {
    id: "diabetes",
    title: "Diabetes mellitus",
    category: "Endocrinología",
    keywords: ["diabetes", "glucosa", "hemoglobina glicosilada", "hba1c", "insulina", "tipo 2"],
    summary:
      "Grupo de alteraciones metabólicas caracterizadas por hiperglucemia crónica por defecto de secreción/acción de la insulina. La tipo 1 es autoinmune (déficit absoluto de insulina); la tipo 2, por resistencia a la insulina.",
    keyPoints: [
      "Diagnóstico: glucemia basal ≥126 mg/dL (en 2 ocasiones), glucemia ≥200 con síntomas, o HbA1c ≥6,5%.",
      "Tipo 1: debut juvenil, cetosis, necesita insulina de por vida; asociada a otros procesos autoinmunes.",
      "Tipo 2: sobrepeso, historia familiar, onset en adulto; tratamiento escalonado: estilo de vida → metformina → otros hipoglucemiantes/insulina.",
      "Control: HbA1c objetivo general <7%. Cribado de retinopatía, nefropatía (microalbuminuria) y neuropatía.",
    ],
    highYield: [
      "La cetoacidosis diabética: hiperglucemia, cetonemia y acidosis metabólica; tratamiento con suero, insulina IV y potasio.",
      "La metformina es de primera línea en tipo 2; los iSGLT2 y análogos GLP-1 protegen corazón y riñón.",
      "El estado hiperglucémico hiperosmolar se da en tipo 2 con hiperglucemia extrema sin cetosis significativa.",
    ],
  },
  {
    id: "tiroides",
    title: "Patología tiroidea (hipo/hipertiroidismo)",
    category: "Endocrinología",
    keywords: ["tiroides", "hipotiroidismo", "hipertiroidismo", "hashimoto", "graves", "tsh", "t4"],
    summary:
      "La TSH regula el eje tiroideo. El hipotiroidismo muestra TSH alta con T4 baja; el hipertiroidismo, TSH suprimida con T4/T3 altas. La causa más frecuente de cada uno es autoinmune.",
    keyPoints: [
      "Hipotiroidismo: la causa más frecuente es la tiroiditis de Hashimoto (anticuerpos anti-TPO). Síntomas: astenia, frío, estreñimiento, bradicardia, piel seca.",
      "Hipertiroidismo: la enfermedad de Graves (anticuerpos anti-receptor de TSH) es la causa más común. Síntomas: taquicardia, temblor, pérdida de peso, calor, exoftalmos (Graves).",
      "Tratamiento hipotiroidismo: levotiroxina.",
      "Tratamiento hipertiroidismo: tionamidas (metimazol), betabloqueante, radioyodo o tiroidectomía.",
    ],
    highYield: [
      "La TSH es el mejor marcador de cribado de función tiroidea.",
      "En el embarazo, el hipotiroidismo se trata de forma activa por el impacto en el desarrollo fetal.",
      "La crisis tirotóxica es una urgencia vital (fiebre, taquicardia, alteración del nivel de conciencia).",
    ],
  },
  {
    id: "cushing",
    title: "Síndrome de Cushing",
    category: "Endocrinología",
    keywords: ["cushing", "cortisol", "hipercortisolismo", "suprarrenal", "dexametasona"],
    summary:
      "Conjunto de signos derivados del exceso de glucocorticoides (endógeno o exógeno). La causa más frecuente es el exógeno (corticoides); entre las endógenas, el adenoma hipofisario (enfermedad de Cushing).",
    keyPoints: [
      "Clínica: obesidad centrípeta, facies de luna llena, joroba de búfalo, estrías violáceas, hipertensión, diabetes, miopatía proximal, fragilidad cutánea.",
      "Cribado: cortisol libre urinario, cortisol salival nocturno y test de supresión con dexametasona 1 mg.",
      "Una vez confirmado el hipercortisolismo, la ACTH diferencia origen dependiente (↑ACTH, hipófisis/ectópico) o independiente (↓ACTH, suprarrenal).",
      "Enfermedad de Cushing: ACTH alta + supresión con dexametasona alta dosis; adenoma hipofisario en RM.",
    ],
    highYield: [
      "El cortisol salval nocturno es muy útil por reflejar el pico fisiológico alterado.",
      "El síndrome de Cushing ectópico (ACTH de tumor) suele cursar con hipopotasemia e hiperpigmentación.",
      "La causa más frecuente de hipercortisolismo global es la iatrogénica por corticoides exógenos.",
    ],
  },
  {
    id: "anemia-ferropenica",
    title: "Anemia ferropénica",
    category: "Hematología",
    keywords: ["anemia", "ferropenia", "hierro", "ferritina", "microcitica", "hemoglobina"],
    summary:
      "Anemia microcítica hipocrómica por déficit de hierro. La causa más frecuente en adultos es la pérdida crónica (sangre), por lo que siempre obliga a investigar su origen, especialmente digestivo en varones y posmenopáusicas.",
    keyPoints: [
      "Analítica: hemoglobina baja, VCM <80 fL, ferritina baja (<30 µg/L), saturación de transferrina baja, TIBC alta.",
      "Causas: pérdidas digestivas (neoplasia, úlcera, angiodisplasia), menstruación, embarazo, malabsorción (celiaquía).",
      "Tratamiento: sulfato ferroso oral; investigar y tratar la causa subyacente.",
      "Cribado de sangrado oculto en heces y estudio digestivo en adultos sin causa clara.",
    ],
    highYield: [
      "En toda anemia ferropénica del adulto hay que descartar neoplasia colorrectal.",
      "La talasemia (otra microcitosis) se diferencia por ferritina normal/alta y electroforesis de Hb.",
      "La respuesta reticulocitaria al hierro aparece en 7-10 días.",
    ],
  },
  {
    id: "ictus",
    title: "Ictus isquémico agudo",
    category: "Neurología",
    keywords: ["ictus", "accidente cerebrovascular", "acv", "ave", "trombolisis", "fast", "nihss"],
    summary:
      "Déficit neurológico focal de inicio súbito por isquemia cerebral. Es una urgencia tiempo-dependiente: el tratamiento de reperfusión (trombólisis/trombectomía) tiene una ventana terapéutica estrecha.",
    keyPoints: [
      "Clínica: inicio súbito de déficit focal (hemiparesia, afasia, hemianopsia, alteración sensitiva). Regla FAST (Face, Arm, Speech, Time).",
      "Neuroimagen: TAC craneal urgente para descartar hemorragia; puede ser normal en fase hiperaguda.",
      "Trombólisis IV (alteplasa) hasta 4,5 h desde el inicio si no hay contraindicaciones.",
      "Trombectomía mecánica en oclusiones de gran vaso hasta 6-24 h según imagen (penumbra salvageable).",
      "Manejo: unidades de ictus, control de TA/glucemia, antiagregción precoz, prevención secundaria.",
    ],
    highYield: [
      "La trombólisis está contraindicada si hay hemorragia en la TAC o tiempo >4,5 h.",
      "La afasia sugiere afectación del territorio de la arteria cerebral media izquierda.",
      "La FA es la causa más frecuente de ictus cardioembólico (requiere anticoagulación).",
    ],
  },
  {
    id: "sepsis",
    title: "Sepsis y shock séptico",
    category: "Infecciosas",
    keywords: ["sepsis", "septica", "shock séptico", "lactato", "sofa", "infeccion"],
    summary:
      "La sepsis es una disfunción orgánica amenazante para la vida causada por una respuesta desregulada a la infección. El shock séptico añade hipotensión persistente que requiere vasopresores a pesar de una adecuada reposición de líquidos.",
    keyPoints: [
      "Diagnóstico: sospecha de infección + disfunción orgática (ΔSOFA ≥2).",
      "Paquetes (bundles): hemocultivos, lactato, antibiótico precoz y sueroterapia guiada en la primera hora.",
      "Reposición inicial con cristaloides 30 mL/kg; valorar respuesta con lactato y perfusión.",
      "Vasopresor de elección: noradrenalina; añadir vasopresina si precisa.",
      "Fuente del foco: control precoz (drenaje, retirada de catéter).",
    ],
    highYield: [
      "El lactato elevado y su aclaramiento son marcadores de hipoperfusión y pronóstico.",
      "La hora-1 de la sepsis (Surviving Sepsis) prioriza el antibiótico y el soporte hemodinámico precoces.",
      "Corticoide (hidrocortisona) si shock séptico refractario a vasopresores.",
    ],
  },
  {
    id: "ira",
    title: "Lesión renal aguda (LRA)",
    category: "Nefrología",
    keywords: ["lesion renal aguda", "ira", "insuficiencia renal aguda", "creatinina", "oliguria", "fra"],
    summary:
      "Deterioro brusco de la función renal (horas a días) con acumulación de productos de desecho y alteración del balance hidroelectrolítico. Se clasifica en prerrenal, renal (intrínseca) y posrenal.",
    keyPoints: [
      "Definición (KDIGO): ↑ creatinina ≥0,3 mg/dL en 48 h, ≥1,5 veces basal, o diuresis <0,5 mL/kg/h durante 6 h.",
      "Prerrenal (más frecuente): hipoperfusión (deshidratación, insuficiencia cardíaca, sepsis). FNa <1%, sedimento normal.",
      "Intrínseca: necrosis tubular aguda (la NTA es la más frecuente), glomerulonefritis, nefritis intersticial.",
      "Posrenal: obstrucción de la vía urinaria; valorar con ecografía.",
      "Tratamiento: tratar la causa, equilibrar fluidos, evitar nefrotóxicos, corregir hiperpotasemia. Diálisis si indicaciones (K+, acidosis, sobrecarga, uremia).",
    ],
    highYield: [
      "El índice FENA y la osmolaridad urinaria ayudan a distinguir prerrenal de NTA.",
      "La hiperpotasemia es la complicación que pone en riesgo la vida de forma inmediata.",
      "Ecografía renal: primera prueba para descartar causa obstructiva (posrenal).",
    ],
  },
  {
    id: "endocarditis",
    title: "Endocarditis infecciosa",
    category: "Infecciosas",
    keywords: ["endocarditis", "vegetaciones", "hemocultivos", "valvula", "duke", "streptococcus viridans"],
    summary:
      "Infección del endocardio, generalmente de las válvulas cardíacas, que produce vegetaciones. Se diagnostica con criterios modificados de Duke y requiere tratamiento prolongado por vía intravenosa.",
    keyPoints: [
      "Clínica: fiebre prolongada, soplo cardíaco nuevo, manifestaciones periféricas (nódulos de Osler, manchas de Janeway, hemorragias en astilla).",
      "Diagnóstico: hemocultivos (siempre positivos salvo gérmenes atípicos) y ecocardiografía (vegetaciones).",
      "Criterios de Duke: principales (hemocultivos típicos, afectación ecocardiográfica) y menores.",
      "Tratamiento: antibiótico IV prolongado (4-6 semanas) dirigido al germen; cirugía en casos seleccionados.",
    ],
    highYield: [
      "Staphylococcus aureus es típico en válvulas nativas y uso de drogas por vía parenteral.",
      "Streptococcus del grupo viridans se asocia a endocarditis subaguda sobre válvula previamente dañada.",
      "Indicación quirúrgica: insuficiencia cardíaca, absceso, embolias recurrentes o germen resistente.",
    ],
  },
  {
    id: "les",
    title: "Lupus eritematoso sistémico (LES)",
    category: "Reumatología",
    keywords: ["lupus", "les", "ana", "antinucleares", "autoinmune", "mariposa"],
    summary:
      "Enfermedad autoinmune multisistémica por autoanticuerpos dirigidos contra antígenos nucleares (formación de inmunocomplejos). Afecta con preferencia a mujeres en edad fértil.",
    keyPoints: [
      "Clínica: eritema malar (en alas de mariposa), fotosensibilidad, artritis, nefritis, serositis, alteraciones hematológicas y neurológicas.",
      "Autoanticuerpos: ANA (sensible, cribado), anti-DNA nativo (específico, se correlaciona con nefritis), anti-Sm (específico).",
      "Nefropatía lúpica: proteinuria, hematuria; la biopsia renal clasifica el tipo y guía el tratamiento.",
      "Tratamiento: hidroxicloroquina de base, corticoides en brotes, inmunosupresores (micofenolato, ciclofosfamida) según afectación.",
    ],
    highYield: [
      "Los anticuerpos anti-fosfolípidos se asocian a trombosis y abortos de repetición (síndrome antifosfolípido).",
      "El rash malar respeta los surcos nasogenianos.",
      "La hidroxicloroquina mejora el pronóstico y reduce los brotes.",
    ],
  },
  {
    id: "meningitis",
    title: "Meningitis bacteriana aguda",
    category: "Infecciosas",
    keywords: ["meningitis", "rigidez de nuca", "puncion lumbar", "lcr", "petequias", "meningococo"],
    summary:
      "Inflamación infecciosa de las meninges de origen bacteriano. Es una urgencia: la sospecha obliga a iniciar empíricamente antibioterapia intravenosa sin demora, a menudo antes de las pruebas.",
    keyPoints: [
      "Tríada clásica: fiebre, cefalea y rigidez de nuca (alteración de la conciencia en casos avanzados).",
      "Líquido cefalorraquídeo (punción lumbar): turbio, presión elevada, pleocitosis a predominio de neutrófilos, glucorraquia baja, proteinorraquia alta.",
      "Gérmenes por edad: recién nacido (E. coli, estreptococo grupo B); niños (neumococo, meningococo); adultos (neumococo, meningococo).",
      "Tratamiento empírico precoz: cefalosporina de 3ª generación (ceftriaxona) ± vancomicina; corticoide antes o con el primer antibiótico.",
    ],
    highYield: [
      "Petréquias/purpura con shock sugieren meningococcemia (sepsis por meningococo).",
      "Si signos de focalidad/hipertensión intracraneal, hacer TAC antes de la punción lumbar.",
      "La dexametasona antes del antibiótico reduce secuelas en meningitis neumocócica.",
    ],
  },
];

export const allQuestions: QuizQuestion[] = [
  {
    id: "q-iam-1",
    category: "Cardiología",
    stem: "Un varón de 58 años presenta dolor torácico opresivo de 40 minutos de evolución. El ECG muestra elevación del ST en DII, DIII y aVF. ¿Cuál es la medida que más reduce la mortalidad?",
    options: [
      "Nitroglicerina sublingual",
      "Angioplastia primaria (ICP)",
      "Betabloqueante oral",
      "Morfina intravenosa",
    ],
    correctIndex: 1,
    explanation:
      "En el IAMCEST, la reperfusión precoz mediante angioplastia primaria (ICP) es la intervención con mayor impacto en la mortalidad. El resto son medidas de soporte/analgesia.",
  },
  {
    id: "q-iam-2",
    category: "Cardiología",
    stem: "Las elevaciones del ST en DII, DIII y aVF corresponden a una localización:",
    options: ["Anterior", "Lateral", "Inferior", "Septal"],
    correctIndex: 2,
    explanation:
      "DII, DIII y aVF son las derivaciones inferiores; su elevación del ST indica un infarto de pared inferior, generalmente por afectación de la coronaria derecha.",
  },
  {
    id: "q-ic-1",
    category: "Cardiología",
    stem: "En la insuficiencia cardíaca con fracción de eyección reducida, ¿qué fármaco NO ha demostrado reducir la mortalidad?",
    options: [
      "Betabloqueante",
      "Digoxina",
      "ARNI (sacubitrilo/valsartán)",
      "iSGLT2 (dapagliflozina)",
    ],
    correctIndex: 1,
    explanation:
      "La digoxina mejora los síntomas y reduce ingresos, pero no reduce la mortalidad. Betabloqueantes, ARNI, ARM (espironolactona) e iSGLT2 sí mejoran el pronóstico.",
  },
  {
    id: "q-fa-1",
    category: "Cardiología",
    stem: "Mujer de 75 años con fibrilación auricular, CHA₂DS₂-VASc de 4 y sin contraindicaciones. ¿La actitud más adecuada respecto a la prevención del ictus es?",
    options: [
      "No precisa tratamiento antitrombótico",
      "Antiagregación con AAS",
      "Anticoagulación (p. ej., con un DOAC)",
      "Cardioversión eléctrica programada",
    ],
    correctIndex: 2,
    explanation:
      "Un CHA₂DS₂-VASc ≥2 (mujer ≥3) en FA indica alto riesgo embólico y, sin contraindicaciones, anticoagulación (DOAC o antagonista de vitamina K).",
  },
  {
    id: "q-hta-1",
    category: "Cardiología",
    stem: "¿Cuál es la causa más frecuente de hipertensión arterial secundaria?",
    options: [
      "Estenosis de arteria renal",
      "Feocromocitoma",
      "Aldosteronismo primario",
      "Síndrome de Cushing",
    ],
    correctIndex: 2,
    explanation:
      "El aldosteronismo primario (síndrome de Conn) es la causa más frecuente de HTA secundaria, por producción autónoma de aldosterona con hipopotasemia y renina suprimida.",
  },
  {
    id: "q-epoc-1",
    category: "Neumología",
    stem: "El diagnóstico de EPOC se confirma cuando, tras broncodilatador, la relación FEV₁/FVC es:",
    options: ["< 0,70", "< 0,60", "< 0,80", "Normal con FEV₁ bajo"],
    correctIndex: 0,
    explanation:
      "La EPOC se define espirométricamente por una limitación persistente al flujo aéreo: FEV₁/FVC < 0,70 tras broncodilatador. La gravedad se gradúa según el FEV₁.",
  },
  {
    id: "q-epoc-2",
    category: "Neumología",
    stem: "En una exacerbación de EPOC, la oxigenoterapia domiciliaria crónica mejora la supervivencia cuando:",
    options: [
      "PaO₂ ≤ 55 mmHg (o ≤59 con signos de cor pulmonale)",
      "Siempre que haya disnea",
      "Con cualquier saturación < 94%",
      "Solo durante el ejercicio",
    ],
    correctIndex: 0,
    explanation:
      "La oxigenoterapia domiciliaria continua mejora la supervivencia en EPOC con hipoxemia grave: PaO₂ ≤55 mmHg, o ≤59 con cor pulmonale o poliglobulia.",
  },
  {
    id: "q-asma-1",
    category: "Neumología",
    stem: "En la espirometría, el asma bronquial se caracteriza por una obstrucción:",
    options: [
      "Fija e irreversible",
      "Reversible tras broncodilatador (↑FEV₁ ≥12% y 200 mL)",
      "Con FEV₁/FVC normal siempre",
      "Con aumento de la capacidad vital",
    ],
    correctIndex: 1,
    explanation:
      "El asma cursa con obstrucción reversible: incremento del FEV₁ ≥12% y 200 mL tras broncodilatador. Esto la diferencia de la EPOC, que es fija.",
  },
  {
    id: "q-tep-1",
    category: "Neumología",
    stem: "Un Dímero-D normal en un paciente con baja probabilidad clínica de TEP:",
    options: [
      "Requiere igualmente angio-TAC",
      "Descarta razonablemente el TEP",
      "Indica trombólisis",
      "Confirma enfermedad tromboembólica",
    ],
    correctIndex: 1,
    explanation:
      "El Dímero-D tiene alta sensibilidad: en baja/intermedia probabilidad clínica, un valor normal permite descartar el TEP sin más pruebas.",
  },
  {
    id: "q-neumonia-1",
    category: "Neumología",
    stem: "Según el score CURB-65, ¿a partir de qué puntuación suele indicarse el ingreso hospitalario en una neumonía?",
    options: ["0", "1", "≥ 2", "Solo si hay fiebre"],
    correctIndex: 2,
    explanation:
      "CURB-65 ≥2 suele indicar ingreso hospitalario; ≥3 valora UCI. Los criterios son Confusión, Urea elevada, Frecuencia respiratoria, Tensión arterial y Edad ≥65.",
  },
  {
    id: "q-neumonia-2",
    category: "Neumología",
    stem: "El agente causal más frecuente de neumonía adquirida en la comunidad es:",
    options: [
      "Mycoplasma pneumoniae",
      "Legionella pneumophila",
      "Streptococcus pneumoniae (neumococo)",
      "Pseudomonas aeruginosa",
    ],
    correctIndex: 2,
    explanation:
      "Streptococcus pneumoniae es el patógeno más frecuente en la NAC. Los demás son atípicos o nosocomiales (Pseudomonas).",
  },
  {
    id: "q-cirrosis-1",
    category: "Aparato digestivo",
    stem: "En una ascitis cirrótica con >250 PMN/mm³, el diagnóstico y tratamiento son:",
    options: [
      "Cirrosis compensada; solo dieta",
      "Peritonitis bacteriana espontánea; cefalosporina de 3ª generación",
      "Tuberculosis peritoneal; triple terapia",
      "Quilotórax; toracocentesis",
    ],
    correctIndex: 1,
    explanation:
      "Ascitis con >250 neutrófilos/mm³ define peritonitis bacteriana espontánea; se trata con cefalosporina de 3ª generación (p. ej., cefotaxima) y se valora profilaxis.",
  },
  {
    id: "q-pancreatitis-1",
    category: "Aparato digestivo",
    stem: "En la pancreatitis aguda, ¿qué enzima es más específica para el diagnóstico?",
    options: ["Amilasa", "Lipasa", "Transaminasas", "Fosfatasa alcalina"],
    correctIndex: 1,
    explanation:
      "La lipasa es más específica que la amilasa y permanece elevada más tiempo, por lo que es la enzima de elección para el diagnóstico de pancreatitis aguda.",
  },
  {
    id: "q-eii-1",
    category: "Aparato digestivo",
    stem: "¿Qué rasgo es característico de la enfermedad de Crohn frente a la colitis ulcerosa?",
    options: [
      "Afectación contínua desde el recto",
      "Afectación limitada a mucosa/submucosa",
      "Afectación transmural y saltante, con posible afectación perianal",
      "Ausencia de granulomas",
    ],
    correctIndex: 2,
    explanation:
      "El Crohn es transmural y de patrón saltante, puede afectar cualquier trasto del tubo digestivo y cursar con fístulas y enfermedad perianal; puede presentar granulomas.",
  },
  {
    id: "q-diabetes-1",
    category: "Endocrinología",
    stem: "¿Cuál es el fármaco de primera línea en la diabetes mellitus tipo 2?",
    options: ["Insulina glargina", "Metformina", "Glibenclamida", "Pioglitazona"],
    correctIndex: 1,
    explanation:
      "La metformina es el hipoglucemiante de primera línea en la DM2 (si no está contraindicada), con beneficio cardiovascular/nefroprotector y bajo riesgo de hipoglucemia.",
  },
  {
    id: "q-diabetes-2",
    category: "Endocrinología",
    stem: "En la cetoacidosis diabética, el tratamiento inicial incluye:",
    options: [
      "Fluidos (suero salino), insulina IV y reposición de potasio",
      "Solo insulina subcutánea",
      "Bicarbonato de primera intención",
      "Diuréticos de asa",
    ],
    correctIndex: 0,
    explanation:
      "La CAD se trata con hidratación abundante (suero salino), perfusión de insulina y reposición de potasio (que cae al iniciar la insulina), corrigiendo la causa desencadenante.",
  },
  {
    id: "q-tiroides-1",
    category: "Endocrinología",
    stem: "Un paciente con astenia, intolerancia al frío, bradicardia y estreñimiento presenta, lo más probablemente:",
    options: [
      "TSH alta y T4 libre baja (hipotiroidismo)",
      "TSH suprimida y T4 alta (hipertiroidismo)",
      "TSH y T4 normales",
      "Solo T3 elevada",
    ],
    correctIndex: 0,
    explanation:
      "El cuadro descrito es de hipotiroidismo: TSH elevada con T4 libre baja. La causa más frecuente es la tiroiditis de Hashimoto.",
  },
  {
    id: "q-cushing-1",
    category: "Endocrinología",
    stem: "El test de cribado más útil para confirmar hipercortisolismo endógeno es:",
    options: [
      "Cortisol basal matutino aislado",
      "Test de supresión con 1 mg de dexametasona nocturna",
      "TSH",
      "Aldosterona en bipedestación",
    ],
    correctIndex: 1,
    explanation:
      "El test de supresión con 1 mg de dexametasona nocturna es una prueba de cribado de elección; el cortisol salival nocturno y el cortisol libre urinario son alternativas.",
  },
  {
    id: "q-anemia-1",
    category: "Hematología",
    stem: "Una mujer posmenopáusica con anemia microcítica y ferritina baja obliga a investigar, entre otras, causa:",
    options: [
      "Tiroidea",
      "Digestiva (descartar neoplasia, p. ej. colorrectal)",
      "Renal",
      "Hepática exclusivamente",
    ],
    correctIndex: 1,
    explanation:
      "La anemia ferropénica en adultos (varón o mujer posmenopáusica) exige descartar pérdida digestiva, incluida la neoplasia colorrectal, mediante estudio endoscópico.",
  },
  {
    id: "q-ictus-1",
    category: "Neurología",
    stem: "La ventana terapéutica para la trombólisis IV (alteplasa) en el ictus isquémico es de, como máximo:",
    options: ["1 hora", "3 horas", "4,5 horas", "24 horas"],
    correctIndex: 2,
    explanation:
      "La trombólisis IV se puede administrar hasta 4,5 horas desde el inicio de los síntomas si no hay contraindicaciones. La trombectomía se extiende según imagen.",
  },
  {
    id: "q-sepsis-1",
    category: "Infecciosas",
    stem: "En la reanimación de la sepsis según los bundles, el vasopresor de primera elección es:",
    options: ["Dopamina", "Noradrenalina", "Adrenalina", "Fenilefrina en bolo"],
    correctIndex: 1,
    explanation:
      "La noradrenalina es el vasopresor de elección en el shock séptico; se puede añadir vasopresina si no se alcanza la tensión objetivo.",
  },
  {
    id: "q-ira-1",
    category: "Nefrología",
    stem: "Ante una lesión renal aguda, la primera prueba de imagen para descartar causa obstructiva es:",
    options: [
      "TAC abdominal con contraste",
      "Ecografía renal y de vías",
      "Urografía intravenosa",
      "Resonancia pélvica",
    ],
    correctIndex: 1,
    explanation:
      "La ecografía renal es la prueba inicial para descartar causa posrenal (obstrucción/dilatación) en una lesión renal aguda, ya que es rápida y sin contraste nefrotóxico.",
  },
  {
    id: "q-endocarditis-1",
    category: "Infecciosas",
    stem: "En un usuario de drogas por vía parenteral con fiebre y soplo nuevo, el germen más probable de endocarditis es:",
    options: [
      "Streptococcus del grupo viridans",
      "Staphylococcus aureus",
      "Candida albicans",
      "Enterococo",
    ],
    correctIndex: 1,
    explanation:
      "Staphylococcus aureus es el germen típico en endocarditis de usuarios de drogas por vía parenteral, a menudo sobre válvula tricúspide.",
  },
  {
    id: "q-les-1",
    category: "Reumatología",
    stem: "¿Qué autoanticuerpo es muy sensible (cribado) en el lupus eritematoso sistémico?",
    options: ["Anti-Sm", "Anti-DNA nativo", "ANA (anticuerpos antinucleares)", "Factor reumatoide"],
    correctIndex: 2,
    explanation:
      "Los ANA son muy sensibles y se usan para el cribado; los anti-DNA nativo y anti-Sm son más específicos de LES.",
  },
  {
    id: "q-meningitis-1",
    category: "Infecciosas",
    stem: "En el LCR de una meningitis bacteriana aguda se observa típicamente:",
    options: [
      "Glucosa normal y predominio linfocitario",
      "Glucorraquia baja y pleocitosis a predominio de neutrófilos",
      "Aspecto cristalino con proteínas bajas",
      "Solo aumento de glucosa",
    ],
    correctIndex: 1,
    explanation:
      "La meningitis bacteriana cursa con LCR turbio, glucorraquia baja, proteinorraquia alta y predominio de neutrófilos. La vírica suele tener glucosa normal y predominio linfocitario.",
  },
];

// ── New topics added for expanded coverage ──────────────────────────────
const _extraTopics: Topic[] = [
  {
    id: "preeclampsia",
    title: "Preeclampsia",
    category: "Ginecología y Obstetricia",
    keywords: ["preeclampsia", "eclampsia", "gestacion", "embarazo", "proteinuria", "hipertension gestacional", "sulfato de magnesio"],
    summary:
      "Trastorno hipertensivo del embarazo que aparece tras la semana 20, definido por hipertensión arterial de nueva aparición asociada a proteinuria o disfunción orgánica. La forma grave requiere ingreso y finalización de la gestación.",
    keyPoints: [
      "Criterios: TA ≥140/90 tras la semana 20 + proteinuria ≥300 mg/24 h o disfunción orgánica.",
      "Preeclampsia grave: TA ≥160/110, proteinuria >5 g/24 h, o datos de daño orgánico (HELLP, renal, cerebral).",
      "Tratamiento grave: sulfato de magnesio (prevención de eclampsia) + antihipertensivo + finalización de la gestación.",
      "Síndrome HELLP: hemólisis, enzimas hepáticas elevadas, plaquetopenia. Urgencia obstétrica.",
    ],
    highYield: [
      "El sulfato de magnesio es el fármaco de elección para la prevención y el tratamiento de la eclampsia.",
      "La única curación definitiva es la finalización del embarazo.",
      "El ácido acetilsalicílico en dosis bajas reduce el riesgo de preeclampsia en gestantes de alto riesgo.",
    ],
  },
  {
    id: "ectopico",
    title: "Embarazo ectópico",
    category: "Ginecología y Obstetricia",
    keywords: ["ectopico", "embarazo ectopico", "trompa", "hemoperitoneo", "beta-hcg", "beta hcg"],
    summary:
      "Implantación del embrión fuera de la cavidad uterina (más del 95% en la trompa de Falopio). Es una urgencia ginecológica que puede causar hemorragia intraperitoneal masiva si se rompe.",
    keyPoints: [
      "Tríada: amenorrea + dolor abdominal + sangrado vaginal en edad fértil.",
      "Diagnóstico: β-hCG cuantitativa + ecografía transvaginal (saco gestacional extrauterino o líquido libre).",
      "Si β-hCG >1.500 sin saco intrauterino → sospecha de ectópico.",
      "Tratamiento: metotrexato (si estable, sin rotura, β-hCG baja) o cirugía (laparoscopia/salpingostomía).",
    ],
    highYield: [
      "La localización más frecuente es la porción ampular de la trompa.",
      "El shock hipovolémico por rotura de embarazo ectópico es una urgencia vital.",
      "Ante cualquier mujer en edad fértil con dolor abdominal, hay que descartar embarazo (β-hCG).",
    ],
  },
  {
    id: "ictericia-neonatal",
    title: "Ictericia neonatal",
    category: "Pediatría",
    keywords: ["ictericia", "neonatal", "recien nacido", "hiperbilirrubinemia", "kernicterus", "fototerapia"],
    summary:
      "Hiperbilirrubinemia del recién nacido, frecuente en los primeros días. La ictericia fisiológica aparece tras las 24 h y se resuelve en 1-2 semanas. La ictericia en las primeras 24 h es siempre patológica.",
    keyPoints: [
      "Ictericia en las primeras 24 h: siempre patológica. Descartar isoinmunización Rh/ABO, infección, hemólisis.",
      "Ictericia fisiológica: aparece tras las 24 h, en RN a término, sin factores de riesgo.",
      "Complicación temida: kernicterus (encefalopatía bilirrubínica) por depósito de bilirrubina indirecta en ganglios basales.",
      "Tratamiento: fototerapia según nomograma de Bhutani; exsanguinotransfusión si cifras críticas.",
    ],
    highYield: [
      "La ictericia por leche materna es un diagnóstico de exclusión; aparece tras la 1.ª semana y es benigna.",
      "El factor Rh es la causa más frecuente de enfermedad hemolítica neonatal cuando no hay profilaxis.",
      "La hiperbilirrubinemia indirecta cruza la barrera hematoencefálica; la directa no.",
    ],
  },
  {
    id: "bronquiolitis",
    title: "Bronquiolitis aguda",
    category: "Pediatría",
    keywords: ["bronquiolitis", "vrs", "virus respiratorio sincitial", "sibilancias", "lactante", "nebulizacion"],
    summary:
      "Infección viral aguda de las vías aéreas inferiores en lactantes (<2 años), causada sobre todo por el virus respiratorio sincitial (VRS). Cursar con tos, sibilancias, taquipnea y dificultad respiratoria.",
    keyPoints: [
      "Agente más frecuente: VRS. Otros: metapneumovirus, rinovirus, adenovirus.",
      "Clínica: rinorrea, tos, sibilancias, taquipnea, tiraje; puede haber apnea en <2 meses.",
      "Diagnóstico: clínico. La radiografía no es necesaria de rutina.",
      "Tratamiento: de soporte (oxígeno, hidratación). No se recomiendan broncodilatadores, corticoides ni antibióticos de rutina.",
    ],
    highYield: [
      "La profilaxis con palivizumab está indicada en lactantes de alto riesgo (prematuros <35 semanas, cardiopatías).",
      "El VRS es la causa más frecuente de hospitalización respiratoria en lactantes.",
      "La hipoxemia es el criterio principal de ingreso.",
    ],
  },
  {
    id: "esquizofrenia",
    title: "Esquizofrenia",
    category: "Psiquiatría",
    keywords: ["esquizofrenia", "psicosis", "alucinaciones", "delirios", "aplanamiento", "antipsicotico"],
    summary:
      "Trastorno psicótico crónico caracterizado por síntomas positivos (alucinaciones, delirios, desorganización) y negativos (aplanamiento afectivo, abulia, alogia) con una duración superior a 6 meses.",
    keyPoints: [
      "Criterios: al menos 2 de los siguientes durante ≥6 meses: delirios, alucinaciones, desorganización, síntomas negativos, deterioro funcional.",
      "Síntomas positivos: responden mejor a los antipsicóticos. Negativos: más resistentes al tratamiento.",
      "Tratamiento: antipsicóticos (típicos o atípicos). Los atípicos (risperidona, olanzapina) tienen menos efectos extrapiramidales.",
      "Efectos adversos: síndrome metabólico (atípicos), extrapiramidales (típicos), hiperprolactinemia, acatisia.",
    ],
    highYield: [
      "La edad de inicio típica es 18-25 años en varones y 25-35 en mujeres.",
      "El riesgo de suicidio es del 10% a lo largo de la vida.",
      "Los antipsicóticos atípicos son de primera línea por su perfil de efectos adversos más favorable.",
    ],
  },
  {
    id: "apendicitis",
    title: "Apendicitis aguda",
    category: "Cirugía General",
    keywords: ["apendicitis", "apendice", "fiebre", "dolor fii", "blumberg", "mcburney"],
    summary:
      "Inflamación aguda del apéndice vermiforme. Es la causa más frecuente de abdomen agudo quirúrgico. El diagnóstico es fundamentalmente clínico y el tratamiento es la apendicectomía.",
    keyPoints: [
      "Clínica típica: dolor periumbilical que migra a fosa ilíaca derecha + fiebre + defensa + signo de Blumberg + leucocitosis.",
      "Punto de McBurney: tercio externo de la línea umbilicospinosa; dolor a la palpación.",
      "Pruebas: analítica (leucocitosis con neutrofilia), ecografía (niños/mujeres) o TAC (adultos).",
      "Tratamiento: apendicectomía (laparoscópica o abierta) + antibiótico.",
    ],
    highYield: [
      "En niños y gestantes la clínica puede ser atípica (apéndice desplazado).",
      "La perforación provoca peritonitis generalizada con mayor morbilidad.",
      "El signo de Rovsing (dolor en FID al palpar FII) es positivo en apendicitis.",
    ],
  },
  {
    id: "necrosis-metastatica-higado",
    title: "Necrosis metastática del hígado",
    category: "Aparato digestivo",
    keywords: [
      "necrosis metastatica",
      "necrosis hepatica",
      "metastasis",
      "higado",
      "metástasis hepáticas",
      "hígado"
    ],
    summary:
      "La necrosis tumoral central es común en las metástasis hepáticas de rápido crecimiento, especialmente de adenocarcinomas (colorrectal, mama o pulmón). Se produce cuando la masa tumoral sobrepasa su aporte sanguíneo arterial.",
    keyPoints: [
      "El hígado es el segundo órgano más frecuentemente afectado por metástasis metastáticas tras los ganglios linfáticos.",
      "Clínica: Dolor sordo en hipocondrio derecho, hepatomegalia nodular, ictericia obstructiva y síndrome constitucional.",
      "Diagnóstico: Marcadores elevados (Fosfatasa alcalina, GGT, transaminasas). Ecografía, TAC o RM demuestran lesiones focales múltiples con centro necrótico/hipodenso.",
    ],
    highYield: [
      "La necrosis central o licuefacción dentro de una lesión hepática sólida es altamente sugestiva de metástasis maligna.",
      "El patrón ecográfico clásico de 'ojo de buey' o 'diana' es característico de las metástasis de adenocarcinoma colorrectal.",
      "La resección quirúrgica (metastasectomía) mejora drásticamente la supervivencia en pacientes con metástasis hepáticas colorrectales limitadas (oligometastásicas).",
    ],
  },
];

// Merge extra topics into the main topics array
topics.push(..._extraTopics);

export const categories: string[] = Array.from(
  new Set([...topics.map((t) => t.category), ...allQuestions.map((q) => q.category)])
).sort();

// Suggested starter prompts shown in an empty conversation.
export const suggestedPrompts: string[] = [
  "Explícame el manejo del IAMCEST",
  "Ponme una pregunta de Cardiología",
  "¿Cómo se diagnostica la EPOC?",
  "Hazme un test de 5 preguntas aleatorias",
  "Diferencias entre Crohn y colitis ulcerosa",
  "¿Qué es la preeclampsia?",
  "Pregúntame sobre Pediatría",
];
