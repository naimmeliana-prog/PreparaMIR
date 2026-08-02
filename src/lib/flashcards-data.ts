// Apartado "Flashcards": cartas de repaso de alta rentabilidad, organizadas por mazo.
// El progreso (conocida/desconocida) se guarda localmente en el navegador.

export interface Flashcard {
  id: string;
  deck: string;
  front: string;
  back: string;
}

export const flashcardDecks: { name: string; icon: string; color: string }[] = [
  { name: "Cardiología", icon: "❤️", color: "from-rose-500 to-red-500" },
  { name: "Neumología", icon: "🫁", color: "from-sky-500 to-cyan-500" },
  { name: "Aparato digestivo", icon: "🫘", color: "from-amber-500 to-orange-500" },
  { name: "Endocrinología", icon: "🦋", color: "from-violet-500 to-purple-500" },
  { name: "Infecciosas", icon: "🦠", color: "from-emerald-500 to-teal-500" },
  { name: "Neurología", icon: "🧠", color: "from-indigo-500 to-blue-500" },
  { name: "Pediatría", icon: "👶", color: "from-pink-500 to-rose-400" },
  { name: "Ginecología y Obstetricia", icon: "🤰", color: "from-fuchsia-500 to-pink-500" },
  { name: "Cirugía General", icon: "🔪", color: "from-slate-600 to-slate-800" },
  { name: "Bioestadística y SPF", icon: "📐", color: "from-lime-500 to-green-500" },
  { name: "Farmacología", icon: "💊", color: "from-cyan-500 to-teal-500" },
  { name: "Oftalmología", icon: "👁️", color: "from-yellow-500 to-amber-500" },
];

export const flashcards: Flashcard[] = [
  // ─── CARDIOLOGÍA ───────────────────────────────────────────────────────
  { id: "fc-c1", deck: "Cardiología", front: "¿ECG del IAMCEST?", back: "Elevación del ST en ≥2 derivaciones contiguas. Tratamiento: reperfusión precoz (ICP primaria)." },
  { id: "fc-c2", deck: "Cardiología", front: "Pilares que reducen mortalidad en IC-FEr", back: "Betabloqueante + IECA/ARNI + antagonista mineralcorticoideo + iSGLT2." },
  { id: "fc-c3", deck: "Cardiología", front: "FA: ¿cuándo anticoagular?", back: "Si CHA₂DS₂-VASc ≥2 (varón) o ≥3 (mujer), sin contraindicación." },
  { id: "fc-c4", deck: "Cardiología", front: "Causa más frecuente de HTA secundaria", back: "Aldosteronismo primario (síndrome de Conn)." },
  { id: "fc-c5", deck: "Cardiología", front: "Fármaco que NO reduce mortalidad en IC", back: "Digoxina (mejora síntomas, no mortalidad)." },
  { id: "fc-c6", deck: "Cardiología", front: "IAM inferior: derivaciones y arteria", back: "DII, DIII, aVF → arteria coronaria derecha." },
  { id: "fc-c7", deck: "Cardiología", front: "Complicaciones mecánicas del IAM (días 3-5)", back: "Rotura del tabique interventricular, insuficiencia mitral por disfunción papilar, rotura de pared libre." },

  // ─── NEUMOLOGÍA ────────────────────────────────────────────────────────
  { id: "fc-n1", deck: "Neumología", front: "Criterio espirométrico de EPOC", back: "FEV₁/FVC < 0,70 tras broncodilatador." },
  { id: "fc-n2", deck: "Neumología", front: "Obstrucción reversible del asma", back: "↑FEV₁ ≥12% y 200 mL tras broncodilatador." },
  { id: "fc-n3", deck: "Neumología", front: "Dímero-D normal + baja probabilidad de TEP", back: "Descarta el TEP (alta sensibilidad)." },
  { id: "fc-n4", deck: "Neumología", front: "Germen más frecuente de NAC", back: "Streptococcus pneumoniae (neumococo)." },
  { id: "fc-n5", deck: "Neumología", front: "O₂ domiciliario en EPOC: umbral", back: "PaO₂ ≤55 mmHg (o ≤59 con cor pulmonale) → mejora supervivencia." },
  { id: "fc-n6", deck: "Neumología", front: "Antibiótico en exacerbación de EPOC", back: "Si criterios de Anthonisen ≥2: amoxicilina/clavulánico." },

  // ─── APARATO DIGESTIVO ─────────────────────────────────────────────────
  { id: "fc-d1", deck: "Aparato digestivo", front: "Ascitis >250 PMN/mm³", back: "Peritonitis bacteriana espontánea → cefalosporina 3ª gen." },
  { id: "fc-d2", deck: "Aparato digestivo", front: "Enzima más específica de pancreatitis", back: "Lipasa (más que la amilasa)." },
  { id: "fc-d3", deck: "Aparato digestivo", front: "Crohn vs. colitis ulcerosa", back: "Crohn: transmural, saltante, granulomas. C. ulcerosa: continuo desde recto, mucosa/submucosa." },
  { id: "fc-d4", deck: "Aparato digestivo", front: "Encefalopatía hepática: tratamiento", back: "Lactulosa ± rifaximina (reducen amoniaco)." },
  { id: "fc-d5", deck: "Aparato digestivo", front: "Hemorragia por varices", back: "Terlipresina + endoscopia con ligadura + profilaxis antibiótica." },
  { id: "fc-d6", deck: "Aparato digestivo", front: "Signo de Grey-Turner y Cullen", back: "Grey-Turner (flanco) y Cullen (periumbilical) → pancreatitis necrosante/hemorrágica." },

  // ─── ENDOCRINOLOGÍA ────────────────────────────────────────────────────
  { id: "fc-e1", deck: "Endocrinología", front: "Fármaco de 1ª línea en DM2", back: "Metformina (salvo contraindicación)." },
  { id: "fc-e2", deck: "Endocrinología", front: "Hipotiroidismo: patrón analítico", back: "TSH ↑ y T4 libre ↓ (causa habitual: Hashimoto)." },
  { id: "fc-e3", deck: "Endocrinología", front: "Cribado de hipercortisolismo", back: "Test de supresión con 1 mg de dexametasona / cortisol salival nocturno." },
  { id: "fc-e4", deck: "Endocrinología", front: "Cetoacidosis diabética: pilar terapéutico", back: "Fluidos + insulina IV + reposición de potasio." },
  { id: "fc-e5", deck: "Endocrinología", front: "Marcador de función tiroidea", back: "La TSH (mejor cribado del eje)." },
  { id: "fc-e6", deck: "Endocrinología", front: "Cushing: causa más frecuente global", back: "Iatrogénica (corticoides exógenos)." },
  { id: "fc-e7", deck: "Endocrinología", front: "iSGLT2 y análogos GLP-1 en DM2", back: "Protegen corazón y riñón; indicados en DM2 con enfermedad cardiovascular o renal." },

  // ─── INFECCIOSAS ───────────────────────────────────────────────────────
  { id: "fc-i1", deck: "Infecciosas", front: "Vasopresor de elección en shock séptico", back: "Noradrenalina." },
  { id: "fc-i2", deck: "Infecciosas", front: "Germen típico en adicto a drogas IV", back: "Staphylococcus aureus (a menudo válvula tricúspide)." },
  { id: "fc-i3", deck: "Infecciosas", front: "LCR de meningitis bacteriana", back: "Turbio, glucosa ↓, proteínas ↑, neutrófilos predominantes." },
  { id: "fc-i4", deck: "Infecciosas", front: "Antibiótico + corticoide en meningitis", back: "Cefalosporina 3ª gen + dexametasona (antes/con la 1ª dosis)." },
  { id: "fc-i5", deck: "Infecciosas", front: "Criterio de sepsis (definición)", back: "Sospecha de infección + disfunción orgánica (ΔSOFA ≥2)." },
  { id: "fc-i6", deck: "Infecciosas", front: "Petréquias + shock en joven", back: "Meningococcemia → cefotaxima/ceftriaxona urgente." },

  // ─── NEUROLOGÍA ────────────────────────────────────────────────────────
  { id: "fc-ne1", deck: "Neurología", front: "Ventana de trombólisis IV en ictus", back: "Hasta 4,5 h desde el inicio (sin contraindicaciones)." },
  { id: "fc-ne2", deck: "Neurología", front: "Afasia: territorio afectado", back: "Arteria cerebral media izquierda." },
  { id: "fc-ne3", deck: "Neurología", front: "Ictus cardioembólico: causa más frecuente", back: "Fibrilación auricular → anticoagulación." },
  { id: "fc-ne4", deck: "Neurología", front: "Regla FAST", back: "Face (cara), Arm (brazo), Speech (habla), Time (tiempo)." },
  { id: "fc-ne5", deck: "Neurología", front: "Primera prueba ante ictus agudo", back: "TAC craneal sin contraste (descarta hemorragia)." },

  // ─── PEDIATRÍA ─────────────────────────────────────────────────────────
  { id: "fc-p1", deck: "Pediatría", front: "Ictericia en las primeras 24 h de vida", back: "Siempre patológica. Causa más frecuente: enfermedad hemolítica por isoinmunización Rh/ABO." },
  { id: "fc-p2", deck: "Pediatría", front: "Otitis media aguda en <2 años: tratamiento", back: "Amoxicilina a dosis altas. La observación sin antibiótico se reserva para >2 años sin criterios de severidad." },
  { id: "fc-p3", deck: "Pediatría", front: "Croup (laringotraqueobronquitis)", back: "Tos perruna, estridor inspiratorio, inicio nocturno tras catarro. Tratamiento: dexametasona oral + adrenalina nebulizada si grave." },
  { id: "fc-p4", deck: "Pediatría", front: "Fiebre + exantema en niño: ¿qué hay que descartar?", back: "Enfermedad de Kawasaki (fiebre >5 días, exantema polimórfico, conjuntivitis, adenopatías, cambios en manos/pies). Riesgo de aneurismas coronarios." },
  { id: "fc-p5", deck: "Pediatría", front: "Bronquiolitis: agente causal más frecuente", back: "Virus respiratorio sincitial (VRS). Tratamiento: soporte (oxígeno, hidratación); palivizumab en profilaxis de alto riesgo." },
  { id: "fc-p6", deck: "Pediatría", front: "Púrpura fulminans en niño", back: "Meningococcemia → cefotaxima/ceftriaxona urgente + estabilización hemodinámica." },

  // ─── GINECOLOGÍA Y OBSTETRICIA ─────────────────────────────────────────
  { id: "fc-g1", deck: "Ginecología y Obstetricia", front: "Preeclampsia grave: actitud urgente", back: "Sulfato de magnesio (prevención de eclampsia) + finalización de la gestación." },
  { id: "fc-g2", deck: "Ginecología y Obstetricia", front: "Tríada que obliga a descartar embarazo ectópico", back: "Amenorrea + dolor abdominal + sangrado vaginal en edad fértil." },
  { id: "fc-g3", deck: "Ginecología y Obstetricia", front: "Cribado de cáncer de cérvix", back: "Citología cada 3 años (25-65 años). A partir de 30: test de HPV cada 5 años." },
  { id: "fc-g4", deck: "Ginecología y Obstetricia", front: "Metrorragia posmenopáusica: prueba de elección", back: "Ecografía transvaginal (grosor endometrial) + biopsia endometrial. Descartar cáncer de endometrio." },
  { id: "fc-g5", deck: "Ginecología y Obstetricia", front: "Anticoagulación en el embarazo", back: "HBPM (no ACO: warfarina es teratogénica, labio leporino)." },
  { id: "fc-g6", deck: "Ginecología y Obstetricia", front: "Hipertiroidismo en gestante: fármaco por trimestre", back: "1.º trimestre: propiltiouracilo. 2.º-3.º: metimazol." },

  // ─── CIRUGÍA GENERAL ───────────────────────────────────────────────────
  { id: "fc-cg1", deck: "Cirugía General", front: "Apendicitis aguda: cuadro típico", back: "Dolor periumbilical → migra a FID + fiebre + defensa + signo de Blumberg + leucocitosis." },
  { id: "fc-cg2", deck: "Cirugía General", front: "Aire subdiafragmático en Rx", back: "Perforación de viscera hueca → cirugía urgente." },
  { id: "fc-cg3", deck: "Cirugía General", front: "Niveles hidroaéreos en Rx de abdomen", back: "Obstrucción intestinal." },
  { id: "fc-cg4", deck: "Cirugía General", front: "Hernia inguinal indirecta vs. directa", back: "Indirecta: congénita, conducto inguinal, desciende al escroto. Directa: adquirida, pared posterior, Hesselbach." },
  { id: "fc-cg5", deck: "Cirugía General", front: "Fractura subcapital de fémur en anciano", back: "Artroplastia (prótesis). La osteosíntesis tiene alto riesgo de necrosis avascular." },

  // ─── BIOESTADÍSTICA Y SPF ──────────────────────────────────────────────
  { id: "fc-b1", deck: "Bioestadística y SPF", front: "Sensibilidad", back: "Probabilidad de prueba positiva en un enfermo. VP/(VP+FN). Ideal para cribado (SnNout)." },
  { id: "fc-b2", deck: "Bioestadística y SPF", front: "Especificidad", back: "Probabilidad de prueba negativa en un sano. VN/(VN+FP). Ideal para confirmar (SpPin)." },
  { id: "fc-b3", deck: "Bioestadística y SPF", front: "NNT = ?", back: "1/RAR. Número necesario a tratar para evitar un evento." },
  { id: "fc-b4", deck: "Bioestadística y SPF", front: "Medida de asociación en casos-controles", back: "Odds ratio (OR). No se puede calcular RR en este diseño." },
  { id: "fc-b5", deck: "Bioestadística y SPF", front: "IC del 95% incluye el 1 (o 0 para diferencias)", back: "No significativo: no se puede rechazar la hipótesis nula." },
  { id: "fc-b6", deck: "Bioestadística y SPF", front: "Criterios de Wilson-Jungner (cribado)", back: "Enfermedad importante + fase presintomática + tratamiento precoz eficaz + prueba válida, segura y aceptable + coste-efectiva." },

  // ─── FARMACOLOGÍA ──────────────────────────────────────────────────────
  { id: "fc-f1", deck: "Farmacología", front: "Warfarina en el embarazo", back: "Contraindicada (teratogénica: labio leporino). Usar HBPM." },
  { id: "fc-f2", deck: "Farmacología", front: "IECA/ARA-II: contraindicaciones", back: "Embarazo y estenosis bilateral de arteria renal." },
  { id: "fc-f3", deck: "Farmacología", front: "Estatinas + fibratos: riesgo", back: "Miopatía y rabdomiólisis. Monitorizar CK." },
  { id: "fc-f4", deck: "Farmacología", front: "Aminoglucósidos + diuréticos de asa", back: "Sinergia de ototoxicidad y nefrotoxicidad. Vigilar." },
  { id: "fc-f5", deck: "Farmacología", front: "Agranulocitosis por clozapina: tipo de reacción", back: "Tipo B (idiosincrásica, no dosis-dependiente). Monitorización hematológica obligatoria." },

  // ─── OFTALMOLOGÍA ──────────────────────────────────────────────────────
  { id: "fc-o1", deck: "Oftalmología", front: "Glaucoma agudo de ángulo cerrado", back: "Dolor ocular intenso + ojo rojo + midriasis + hipertensión ocular. Urgencia oftalmológica." },
  { id: "fc-o2", deck: "Oftalmología", front: "Retinopatía diabética no proliferativa", back: "Microaneurismas, hemorragias, exudados duros. La proliferativa se define por neovascularización." },
  { id: "fc-o3", deck: "Oftalmología", front: "Cribado de retinopatía diabética", back: "Fondo de ojo anual desde el diagnóstico de DM2; desde los 5 años en DM1." },
  { id: "fc-o4", deck: "Oftalmología", front: "Desprendimiento de retina", back: "Moscas volantes (miodesopsias) + fotopsias (destellos) + «sombra de cortina». No duele." },

  // ─── NEUROLOGÍA ────────────────────────────────────────────────────────
  { id: "fc-neu1", deck: "Neurología", front: "Ictus isquémico agudo: ventana de fibrinólisis", back: "< 4,5 horas desde el inicio de los síntomas (rtPA iv). Trombectomía mecánica hasta 24h si hay mismatch." },
  { id: "fc-neu2", deck: "Neurología", front: "Cefalea en racimos (Cluster)", back: "Varón + dolor periocular estrictamente unilateral intenso + rinorrea + epífora + Horner. Tto: O₂ 100% + Sumatriptán sc." },
  { id: "fc-neu3", deck: "Neurología", front: "Tratamiento de elección en ELA", back: "Riluzol (retarda progresión y necesidad de traqueostomía)." },

  // ─── INFECCIOSAS ───────────────────────────────────────────────────────
  { id: "fc-inf1", deck: "Infecciosas", front: "Endocarditis bacteriana en ADVP", back: "Válvula tricúspide (derecha) por Staphylococcus aureus." },
  { id: "fc-inf2", deck: "Infecciosas", front: "VIH: Profilaxis de Pneumocystis jirovecii", back: "Cotrimoxazol (TMP-SMX) cuando los CD4 < 200/mm³." },

  // ─── REUMATOLOGÍA ──────────────────────────────────────────────────────
  { id: "fc-reu1", deck: "Reumatología", front: "Artritis por Gota vs Pseudogota", back: "Gota: Cristales de urato monosódico en forma de aguja con birrefringencia negativa. Pseudogota: Cristales de pirofosfato cálcico con birrefringencia positiva." },
  { id: "fc-reu2", deck: "Reumatología", front: "Anticuerpo más específico de Artritis Reumatoide", back: "Anti-CCP (anti-péptido citrulinado cíclico). Especificidad >95%." },

  // ─── NEFROLOGÍA ────────────────────────────────────────────────────────
  { id: "fc-nef1", deck: "Nefrología", front: "Tríada del Síndrome Nefrótico", back: "Proteinuria >3,5 g/24h + Hipoalbuminemia (<3 g/dL) + Edemas perféricos ± Hiperlipidemia." },
  { id: "fc-nef2", deck: "Nefrología", front: "Nfritis por IgA (Enfermedad de Berger)", back: "Hematuria macroscópica recurrente co coincidiendo con infección respiratoria alta (sin latencia)." },

  // ─── HEMATOLOGÍA ───────────────────────────────────────────────────────
  { id: "fc-hem1", deck: "Hematología", front: "Mieloma Múltiple: Criterios CRAB", back: "C (Calcio alto), R (Renal / Insuficiencia), A (Anemia), B (Bone / Lesiones líticas)." },
  { id: "fc-hem2", deck: "Hematología", front: "Leucemia Mieloide Crónica (LMC)", back: "Translocación t(9;22) → Cromosoma Filadelfia (BCR-ABL1). Tratamiento: Imatinib (ITK)." },
];
