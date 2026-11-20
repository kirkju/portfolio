/**
 * Contenido del CV: es lo único que necesitas editar para actualizar el sitio.
 *
 * - Cada texto traducible es un objeto `{ es, en }`.
 * - El orden de los arreglos es el orden en que se muestran, salvo las publicaciones,
 *   que se ordenan solas por año (la más reciente primero; a igual año, el orden de aquí).
 * - Tras cambiar algo aquí, regenera los PDF con `npm run cv:pdf`.
 * - Busca "TODO" para ver los datos pendientes.
 */
import type { CV } from "./types";

export const cv: CV = {
  profile: {
    name: "Alejandro Vargas",
    initials: "AV",
    authorNames: ["Alejandro Vargas", "Alejandro Jose Vargas Erazo"],
    title: {
      es: "Ingeniero en Sistemas · .NET, React e IA aplicada",
      en: "Computer Systems Engineer · .NET, React & Applied AI",
    },
    tagline: {
      es: "Diseño y desarrollo aplicaciones web, APIs y soluciones con IA que resuelven necesidades reales de negocio, respaldado por investigación publicada en machine learning y LLMs.",
      en: "I design and build web applications, APIs, and AI-powered solutions that solve real business needs, backed by published research in machine learning and LLMs.",
    },
    location: { es: "San Pedro Sula, Honduras", en: "San Pedro Sula, Honduras" },
    email: "ku1504@hotmail.com",
    availableForWork: true,
    // Para mostrar tu foto, guarda un JPG cuadrado (mín. 400 × 400 px) en esta ruta.
    photo: "/images/profile.jpg",
    cvPdf: {
      es: "/cv/Alejandro-Vargas-CV.pdf",
      en: "/cv/Alejandro-Vargas-CV-EN.pdf",
    },
    social: {
      github: "https://github.com/kirkju",
      linkedin: "https://www.linkedin.com/in/alejandro-jose-vargas-erazo-2716341a1/",
    },
  },

  about: {
    es: [
      "Ingeniero en Sistemas Computacionales con más de 3 años de experiencia en desarrollo de software, enfocado en la construcción de aplicaciones web, APIs y soluciones basadas en datos e inteligencia artificial.",
      "Experiencia con .NET, React, Python, Rust y SQL, además de herramientas cloud y de desarrollo como Azure, Docker y Git. Orientado al diseño de soluciones escalables, mantenibles y centradas en resolver necesidades reales de negocio.",
    ],
    en: [
      "Computer Systems Engineer with more than 3 years of experience in software development, focused on building web applications, APIs, and solutions driven by data and artificial intelligence.",
      "Experienced with .NET, React, Python, Rust, and SQL, as well as cloud and development tools such as Azure, Docker, and Git. Focused on designing scalable, maintainable solutions centered on solving real business needs.",
    ],
  },

  experience: [
    {
      role: { es: "Programador", en: "Programmer" },
      company: "Avance Enterprise Solutions (AVNC)",
      start: "2025-12",
      // Trabajo confidencial: describirlo solo en términos genéricos, sin nombrar
      // al cliente, los productos ni sus sistemas internos.
      highlights: {
        es: [
          "Desarrollo, en equipo, una plataforma CRM full-stack en Rust (Actix-web) y PostgreSQL con interfaz HTML-first (HTMX).",
          "Construyo dashboards de pronóstico y de actividad sobre funciones de PostgreSQL, con exportación de reportes y pruebas automatizadas.",
          "Desarrollé un portal de pagos y facturas en React y TypeScript.",
        ],
        en: [
          "Develop, as part of a team, a full-stack CRM platform in Rust (Actix-web) and PostgreSQL with an HTML-first UI (HTMX).",
          "Build forecast and activity dashboards on PostgreSQL functions, with report exports and automated tests.",
          "Built a payments and invoicing portal in React and TypeScript.",
        ],
      },
      tags: ["Rust", "Actix-web", "PostgreSQL", "HTMX", "React", "TypeScript"],
    },
    {
      role: { es: "Desarrollador web y herramientas", en: "Web & Tools Developer" },
      company: "Ferrexpress",
      start: "2023-12",
      end: "2025-12",
      highlights: {
        es: [
          "Lideré un equipo de desarrollo en la creación de aplicaciones web con .NET y Blazor, implementando servicios de Azure.",
          "Implementé soluciones escalables y de alto rendimiento con ASP.NET Core, React y bases de datos SQL.",
        ],
        en: [
          "Led a development team building web applications with .NET and Blazor, implementing Azure services.",
          "Implemented scalable, high-performance solutions with ASP.NET Core, React, and SQL databases.",
        ],
      },
      tags: [".NET", "Blazor", "ASP.NET Core", "React", "SQL", "Azure"],
    },
  ],

  // Las imágenes de /public/projects son provisionales. Al reemplazarlas por
  // capturas reales, actualiza `image` y describe la captura en `imageAlt`
  // (un alt vacío indica que la imagen es decorativa).
  projects: [
    {
      // Proyecto confidencial: no nombrar al cliente, el producto ni sus sistemas internos.
      id: "crm-rust",
      title: { es: "Plataforma CRM Unificada en Rust", en: "Unified CRM Platform in Rust" },
      client: { es: "Cliente confidencial", en: "Confidential client" },
      year: 2025,
      ongoing: true,
      status: "production",
      image: "/projects/crm-rust.svg",
      imageAlt: { es: "", en: "" },
      context: {
        es: "Los datos de clientes, oportunidades, contratos y cotizaciones estaban repartidos en cuatro sistemas internos heredados.",
        en: "Customer, opportunity, contract, and quoting data was spread across four legacy internal systems.",
      },
      solution: {
        es: "Plataforma web en Rust (Actix-web) sobre PostgreSQL que unifica los datos de cuatro sistemas heredados en una sola experiencia de CRM, ventas y cotizaciones —empresas, contactos, oportunidades, propuestas y actividades—, con interfaz HTML-first (HTMX + Handlebars) y seguridad a nivel de fila.",
        en: "A Rust (Actix-web) web platform on PostgreSQL that unifies data from four legacy systems into a single CRM, sales, and quoting experience — companies, contacts, opportunities, proposals, and activities — with an HTML-first UI (HTMX + Handlebars) and row-level security.",
      },
      result: {
        es: "En producción y en desarrollo continuo: CRM, ventas y cotizaciones en una sola plataforma, con dashboards de pronóstico y de actividad y un registro de auditoría automático.",
        en: "In production and under active development: CRM, sales, and quoting in one platform, with forecast and activity dashboards and an automatic audit trail.",
      },
      features: {
        es: [
          "Empresas, contactos, oportunidades y propuestas",
          "Registro y seguimiento de actividades",
          "Dashboards de pronóstico y KPIs",
          "Acceso por roles con Row-Level Security",
          "Auditoría automática con triggers de PostgreSQL",
          "Exportación de reportes (XLSX, CSV, PDF)",
        ],
        en: [
          "Companies, contacts, opportunities, and proposals",
          "Activity logging and follow-ups",
          "Forecast and KPI dashboards",
          "Role-based access with row-level security",
          "Automatic audit trail via PostgreSQL triggers",
          "Report export (XLSX, CSV, PDF)",
        ],
      },
      stack: ["Rust", "Actix-web", "PostgreSQL", "SQLx", "HTMX", "Handlebars", "Docker", "OpenTelemetry"],
    },
    {
      // Proyecto confidencial: no nombrar el producto, la empresa, sus proveedores ni su infraestructura.
      id: "campanas-multicanal",
      title: {
        es: "Sistema de Campañas Multicanal con IA",
        en: "AI-Assisted Multichannel Campaign System",
      },
      client: { es: "Proyecto confidencial", en: "Confidential project" },
      year: 2026,
      status: "development",
      image: "/projects/campanas-multicanal.svg",
      imageAlt: { es: "", en: "" },
      context: {
        es: "Preparar una campaña multicanal tomaba días de trabajo manual —buscar empresas, encontrar contactos, verificar correos, quitar duplicados y adaptar formatos y mensajes—, y cada canal terminaba trabajando con una lista distinta.",
        en: "Putting together a multichannel campaign took days of manual work — finding companies and contacts, verifying emails, removing duplicates, and adapting formats and messages — and each channel ended up working from a different list.",
      },
      solution: {
        es: "Aplicación web que convierte un perfil de cliente ideal en campañas para cuatro canales —correo en frío, mensajes directos y anuncios en la red profesional, y anuncios en redes sociales— sobre una única audiencia: enriquece, verifica y segmenta los contactos, y usa un LLM (API de Claude) para redactar mensajes a medida, clasificar respuestas y proponer borradores. API en FastAPI sobre PostgreSQL con frontend en React; todo envío o lanzamiento lo confirma una persona.",
        en: "A web app that turns an ideal customer profile into campaigns for four channels — cold email, direct messages and ads on the professional network, and social media ads — built on a single audience: it enriches, verifies, and segments contacts, and uses an LLM (Claude API) to write tailored messages, classify replies, and draft responses. A FastAPI API on PostgreSQL with a React frontend; every send or launch is confirmed by a person.",
      },
      result: {
        es: "En desarrollo: los módulos de datos, audiencias, correo, respuestas y panel de métricas están construidos y probados en un entorno de demostración con Docker y datos sintéticos.",
        en: "In development: the data, audience, email, reply, and metrics-dashboard modules are built and tested in a Docker demo environment with synthetic data.",
      },
      features: {
        es: [
          "Perfil de cliente ideal y buyer personas versionados",
          "Enriquecimiento, verificación y deduplicación de contactos",
          "Una sola audiencia para cuatro canales",
          "Mensajes y borradores de respuesta con LLM",
          "Confirmación humana antes de enviar o lanzar",
          "Tope de gasto y registro de costos",
        ],
        en: [
          "Versioned ideal customer profile and buyer personas",
          "Contact enrichment, verification, and deduplication",
          "A single audience across four channels",
          "LLM-written messages and reply drafts",
          "Human confirmation before sending or launching",
          "Spending cap and cost logging",
        ],
      },
      stack: ["Python", "FastAPI", "PostgreSQL", "React", "TypeScript", "Claude API", "Docker", "Playwright"],
    },
    {
      id: "ferrexpress-ventas",
      title: { es: "Sitio Web de Ventas Ferrexpress", en: "Ferrexpress Sales Website" },
      client: { es: "Ferrexpress", en: "Ferrexpress" },
      year: 2024,
      status: "production",
      image: "/projects/ferrexpress-ventas.svg",
      imageAlt: { es: "", en: "" },
      context: {
        es: "Ferrexpress necesitaba un canal de ventas en línea que también integrara la gestión de productos y la atención al cliente.",
        en: "Ferrexpress needed an online sales channel that also brought together product management and customer service.",
      },
      solution: {
        es: "Plataforma web con catálogo interactivo, carrito de compras con pago en línea mediante Stripe y herramientas de seguimiento de pedidos y gestión administrativa, construida con Blazor y ASP.NET Core sobre SQL Server en Azure.",
        en: "A web platform with an interactive catalog, a shopping cart with online payments through Stripe, and order-tracking and back-office tools, built with Blazor and ASP.NET Core on SQL Server in Azure.",
      },
      result: {
        es: "En producción: ventas, catálogo, pedidos y administración funcionan en una sola plataforma.",
        en: "In production: sales, catalog, orders, and administration run on a single platform.",
      },
      features: {
        es: ["Catálogo interactivo", "Pago en línea", "Seguimiento de pedidos", "Gestión administrativa"],
        en: ["Interactive catalog", "Online payments", "Order tracking", "Back-office management"],
      },
      stack: ["Blazor", "ASP.NET Core", "SQL Server", "Azure", "Stripe API"],
    },
    {
      id: "asegure-nominas",
      title: { es: "Automatización de Nóminas ASEGURE", en: "ASEGURE Payroll Automation" },
      client: { es: "ASEGURE", en: "ASEGURE" },
      year: 2023,
      status: "production",
      image: "/projects/asegure-nominas.svg",
      imageAlt: { es: "", en: "" },
      context: {
        es: "La generación de nóminas de ASEGURE involucraba cálculos complejos y debía integrarse con los sistemas contables existentes.",
        en: "ASEGURE's payroll generation involved complex calculations and had to integrate with the existing accounting systems.",
      },
      solution: {
        es: "Herramientas en C# con procesamiento por lotes, cálculos automáticos y consultas SQL optimizadas, integradas con el ERP y con reportes en Power BI.",
        en: "C# tools with batch processing, automated calculations, and optimized SQL queries, integrated with the ERP and with Power BI reporting.",
      },
      result: {
        es: "En producción: automatizan la generación de nóminas y alimentan los reportes de BI.",
        en: "In production: they automate payroll generation and feed the BI reports.",
      },
      features: {
        es: ["Procesamiento batch", "Cálculos automáticos", "Integración con ERP", "Reportes BI"],
        en: ["Batch processing", "Automated calculations", "ERP integration", "BI reports"],
      },
      stack: ["C#", "SQL Server", "Entity Framework", "Azure SQL", "Power BI"],
    },
    {
      id: "ferrexpress-fletes",
      title: { es: "WebApp de Gestión de Fletes Ferrexpress", en: "Ferrexpress Freight Management Web App" },
      client: { es: "Ferrexpress", en: "Ferrexpress" },
      year: 2024,
      status: "production",
      image: "/projects/ferrexpress-fletes.svg",
      imageAlt: { es: "", en: "" },
      context: {
        es: "La operación logística de Ferrexpress requería coordinar rutas, conductores y vehículos, y dar seguimiento a cada entrega.",
        en: "Ferrexpress's logistics operation needed to coordinate routes, drivers, and vehicles, and to track every delivery.",
      },
      solution: {
        es: "Aplicación web para crear y controlar fletes, gestionar rutas y asignar conductores y vehículos, con seguimiento de entregas en tiempo real mediante SignalR y Google Maps.",
        en: "A web app to create and control freight orders, manage routes, and assign drivers and vehicles, with real-time delivery tracking through SignalR and Google Maps.",
      },
      result: {
        es: "En producción: centraliza la operación de fletes y genera informes de rendimiento y costos.",
        en: "In production: it centralizes freight operations and produces performance and cost reports.",
      },
      features: {
        es: ["Control y creación de fletes", "Gestión de rutas", "Seguimiento en tiempo real", "Reportes de rendimiento"],
        en: ["Freight creation and control", "Route management", "Real-time tracking", "Performance reports"],
      },
      stack: ["Blazor", "ASP.NET Core", "SQL Server", "Azure", "SignalR", "Google Maps API"],
    },
    {
      id: "ferrexpress-erp",
      title: { es: "ERP de Proyectos de Construcción Ferrexpress", en: "Ferrexpress Construction Projects ERP" },
      client: { es: "Ferrexpress", en: "Ferrexpress" },
      year: 2026,
      status: "delivered",
      image: "/projects/ferrexpress-erp.svg",
      imageAlt: { es: "", en: "" },
      context: {
        es: "Ferrexpress necesitaba controlar todas sus obras de construcción en un solo lugar: presupuestos, gastos, compras, avance y documentación.",
        en: "Ferrexpress needed to manage all of its construction projects in one place: budgets, expenses, purchasing, progress, and documentation.",
      },
      solution: {
        es: "ERP web en Blazor (.NET 10) con PostgreSQL: obras con flujo de estados y avance por etapas, presupuestos versionados, finanzas con aprobaciones y alertas de presupuesto, órdenes de compra con recepción parcial, bitácora de obra y documentos versionados, con acceso por roles.",
        en: "A Blazor (.NET 10) web ERP on PostgreSQL: projects with a status workflow and stage-based progress, versioned budgets, finances with approvals and budget alerts, purchase orders with partial receipts, a site log, and versioned documents, with role-based access.",
      },
      result: {
        es: "Entregado en 2026: el control de obras, presupuestos, compras y documentos queda en un solo sistema, con dashboard de indicadores y exportación a Excel.",
        en: "Delivered in 2026: project, budget, purchasing, and document control live in a single system, with a KPI dashboard and Excel exports.",
      },
      features: {
        es: [
          "Presupuestos versionados",
          "Alertas de presupuesto",
          "Órdenes de compra con recepción parcial",
          "Bitácora de obra con fotos",
          "Documentos versionados con hash SHA-256",
          "Dashboard de KPIs y exportación a Excel",
        ],
        en: [
          "Versioned budgets",
          "Budget alerts",
          "Purchase orders with partial receipts",
          "Site log with photos",
          "Versioned documents with SHA-256 hashes",
          "KPI dashboard and Excel export",
        ],
      },
      stack: ["Blazor", ".NET 10", "ASP.NET Core Identity", "PostgreSQL", "EF Core", "Azure Blob Storage"],
    },
    {
      id: "tranki",
      title: { es: "Tranki", en: "Tranki" },
      year: 2026,
      status: "production",
      image: "/projects/tranki.svg",
      imageAlt: { es: "", en: "" },
      context: {
        es: "Marketplace de paquetes médicos prepagados para el mercado de salud hondureño: quien compra elige paquetes para sí mismo o para su familia.",
        en: "A marketplace of prepaid medical packages for the Honduran healthcare market: buyers pick packages for themselves or their family.",
      },
      solution: {
        es: "Plataforma web bilingüe para explorar y comprar paquetes médicos prepagados: catálogo, carrito y checkout que registra un paciente por paquete, precios calculados en el servidor (descuentos por paquete o por edad), pago con tarjeta integrado con Cybersource y 3-D Secure, y un panel administrativo que gestiona paquetes, pedidos y usuarios por roles.",
        en: "A bilingual web platform for browsing and buying prepaid medical packages: catalog, cart, and a checkout that registers one patient per package, server-side pricing (package or age-based discounts), card payments integrated with Cybersource and 3-D Secure, and an admin panel that manages packages, orders, and users by role.",
      },
      result: {
        es: "En producción en tranki.care, desplegada con Docker Compose (Caddy, API y PostgreSQL).",
        en: "In production at tranki.care, deployed with Docker Compose (Caddy, API, and PostgreSQL).",
      },
      features: {
        es: [
          "Catálogo y checkout con un paciente por paquete",
          "Precios calculados en el servidor",
          "Pago con tarjeta (Cybersource, 3-D Secure)",
          "Pedidos con estados e historial",
          "Panel administrativo con roles",
          "Correos transaccionales",
        ],
        en: [
          "Catalog and checkout with one patient per package",
          "Server-side pricing",
          "Card payments (Cybersource, 3-D Secure)",
          "Orders with status history",
          "Role-based admin panel",
          "Transactional emails",
        ],
      },
      stack: ["React", "Vite", "Tailwind CSS", "Node.js", "Express", "PostgreSQL", "JWT", "Cybersource", "Docker"],
      url: "https://tranki.care",
    },
    {
      // Proyecto bajo NDA: no nombrar al cliente ni detalles internos sin su autorización.
      id: "campo-eudr",
      title: {
        es: "App de Levantamiento de Datos de Campo para EUDR",
        en: "Offline-First Field Data App for EUDR",
      },
      client: {
        es: "Cliente del sector café (confidencial)",
        en: "Coffee-sector client (confidential)",
      },
      year: 2026,
      status: "pilot",
      image: "/projects/campo-eudr.svg",
      imageAlt: { es: "", en: "" },
      context: {
        es: "El reglamento europeo contra la deforestación (EUDR) exige demostrar que el café no proviene de tierras deforestadas después de 2020, y los datos de cada finca se levantan en zonas rurales con señal intermitente.",
        en: "The EU Deforestation Regulation (EUDR) requires proof that coffee does not come from land deforested after 2020, and each farm's data is collected in rural areas with unreliable signal.",
      },
      solution: {
        es: "App móvil en Flutter que funciona sin conexión —encuesta con lógica condicional, perímetro de la parcela recorrido con GPS y registro de consentimientos— con almacenamiento cifrado y una cola que sincroniza con un backend FastAPI/PostgreSQL sin duplicar registros.",
        en: "An offline-first Flutter mobile app — conditional survey, GPS-walked plot boundary, and consent capture — with encrypted storage and a queue that syncs to a FastAPI/PostgreSQL backend without duplicating records.",
      },
      result: {
        es: "En piloto de campo, con una bitácora de auditoría a prueba de manipulaciones, encadenada por hash SHA-256 en el servidor.",
        en: "In a field pilot, with a tamper-evident audit log hash-chained with SHA-256 on the server.",
      },
      features: {
        es: [
          "Encuestas con lógica condicional",
          "Perímetro de parcela por GPS",
          "Cifrado en el dispositivo",
          "Sincronización offline sin duplicados",
          "Bitácora de auditoría encadenada por hash",
        ],
        en: [
          "Conditional survey logic",
          "GPS plot boundary",
          "On-device encryption",
          "Duplicate-free offline sync",
          "Hash-chained audit log",
        ],
      },
      stack: ["Flutter", "Dart", "Hive", "Python", "FastAPI", "PostgreSQL"],
    },
  ],

  // Títulos, autores, resúmenes y palabras clave tomados de las páginas oficiales
  // (Springer / IEEE Xplore). Los resúmenes en español son traducciones del original.
  publications: [
    {
      id: "dengue-deeponets",
      title: "Spatio-Temporal DeepONets with Graph Neural Networks for Probabilistic Dengue Forecasting in Honduras",
      year: 2026,
      location: { es: "Maastricht, Países Bajos", en: "Maastricht, Netherlands" },
      venue: "IJCNN 2026 (IEEE WCCI)",
      venueFull: "2026 International Joint Conference on Neural Networks (IJCNN)",
      publisher: "IEEE",
      status: "published",
      authors: ["Alejandro Jose Vargas Erazo", "Jason David Torres Banegas", "Luis Loo"],
      doi: "10.1109/IJCNN69854.2026.11729621",
      abstract: {
        es: "Planteamos el pronóstico del dengue como un problema de aprendizaje de operadores que transforma historiales climático-epidemiológicos de varias semanas en pronósticos probabilísticos de incidencia. Proponemos una Deep Operator Network espacio-temporal potenciada con Graph Neural Networks (DeepONet-GNN) que se condiciona en el contexto geográfico, la escala poblacional, el horizonte de pronóstico y la fase estacional. Evaluado en 20 regiones sanitarias de Honduras (mayo de 2022 – abril de 2024), el modelo alcanza una alta precisión temporal (MAE = 113 casos, una mejora del 23.6 % sobre XGBoost) con una incertidumbre bien calibrada (cobertura del 82.9 % para un nivel nominal del 80 %, CRPS = 101.5). La validación cruzada dejando una región fuera demuestra capacidad de generalización espacial (correlación media de 0.76) e identifica los retos que plantean las regiones atípicas de alta incidencia. Un sistema de alerta temprana basado en probabilidades de excedencia alcanza una sensibilidad del 97.9 % y una especificidad del 97.4 % en la detección de brotes. Los resultados establecen el aprendizaje de operadores con codificación espacial basada en grafos como un marco eficaz para el pronóstico epidemiológico impulsado por el clima con cuantificación calibrada de la incertidumbre.",
        en: "We formulate dengue forecasting as an operator learning problem mapping multi-week climate–epidemiological histories to probabilistic incidence forecasts. We propose a spatio-temporal Deep Operator Network enhanced with Graph Neural Networks (DeepONet-GNN) that conditions on geographic context, population scale, lead time, and seasonal phase. Evaluated across 20 sanitary regions in Honduras (May 2022–April 2024), the model achieves strong temporal accuracy (MAE = 113 cases, 23.6% improvement over XGBoost) with well-calibrated uncertainty (82.9% coverage at 80% nominal level, CRPS = 101.5). Leave-one-region-out cross-validation demonstrates spatial generalization capacity (mean correlation 0.76) while identifying challenges for high-incidence outlier regions. An exceedance-probability early warning system achieves 97.9% sensitivity and 97.4% specificity for outbreak detection. The results establish operator learning with graph-based spatial encoding as an effective framework for climate-driven epidemiological forecasting with calibrated uncertainty quantification.",
      },
      // TODO: palabras clave del autor (IEEE Xplore no las expone por API; copiarlas de la página del artículo).
    },
    {
      id: "depression-audio-agents",
      title:
        "Intelligent Agents for Mental Health: Depression Detection Through ML and LLM Model Fusion in Audio Data",
      year: 2026,
      location: { es: "Roatán, Islas de la Bahía, Honduras", en: "Roatán, Bay Islands, Honduras" },
      venue: "ICITS 2026",
      venueFull: "Information Technology & Systems: ICITS 2026, Volume 3",
      publisher: "Springer · LNNS 1967",
      status: "published",
      authors: ["Alejandro Vargas", "Jason Torres", "Luis Loo"],
      doi: "10.1007/978-3-032-27541-7_26",
      abstract: {
        es: "Presentamos un agente de investigación de extremo a extremo para el cribado del riesgo depresivo a partir de grabaciones breves de voz, que fusiona modelos acústicos de machine learning (ML) calibrados con un estimador semántico de riesgo basado en un modelo de lenguaje grande (LLM). Con voz del corpus DAIC-WOZ y particiones estrictamente disjuntas por hablante, el pipeline realiza reducción de ruido y detección de actividad de voz, extrae descriptores prosódicos y espectrales, y obtiene señales lingüísticas de las transcripciones mediante Whisper ASR y spaCy. Se entrenan varios clasificadores acústicos probabilísticos con manejo del desbalance de clases y calibración de probabilidades, mientras que un LLM ajustado por instrucciones genera, a partir de cada transcripción, una puntuación de riesgo probabilística complementaria y una justificación concisa. Un esquema de fusión tardía que considera la confianza pondera de forma adaptativa las salidas del ML y del LLM según la riqueza de la transcripción y la duración de la voz, y el agente produce informes estructurados, orientados a la explicación, que exponen los factores acústicos y lingüísticos más relevantes junto con una advertencia clara de que no constituyen un diagnóstico. En el conjunto de evaluación combinado (n = 40), el sistema fusionado alcanza AUC = 0.76, F1 = 0.84, precisión = 0.89 y exhaustividad (recall) = 0.80, superando a las mejores líneas base de una sola modalidad. Estos hallazgos indican que una fusión ML–LLM transparente sobre la voz puede apoyar un cribado temprano y escalable del riesgo de depresión en flujos de trabajo con supervisión humana; a la vez, reconocemos explícitamente las restricciones de privacidad, el posible sesgo y la necesidad de estudios más amplios, longitudinales y demográficamente diversos antes de cualquier uso clínico o en políticas públicas.",
        en: "We present an end-to-end research agent for screening depressive risk from short speech recordings by fusing calibrated acoustic machine learning (ML) models with a large language model (LLM)-based semantic risk estimator. Using speech from the DAIC-WOZ corpus with strictly speaker-disjoint splits, the pipeline performs noise reduction and voice-activity detection; extracts prosodic and spectral descriptors; and derives transcript-based linguistic cues via Whisper ASR and spaCy. Multiple probabilistic acoustic classifiers are trained with class-imbalance handling and probability calibration, while an instruction-tuned LLM generates a complementary probabilistic risk score and concise rationale from each transcript. A confidence-aware late-fusion scheme adaptively weights ML and LLM outputs as a function of transcript richness and voiced duration, and the agent produces structured, explanation-oriented reports that expose salient acoustic and linguistic drivers together with a clear non-diagnostic disclaimer. On the pooled held-out set (n = 40), the fused system achieves AUC = 0.76, F1 = 0.84, precision = 0.89, and recall = 0.80, outperforming the best single-modality baselines. These findings indicate that transparent ML–LLM fusion on speech can support early, scalable depression risk screening within human-in-the-loop workflows, while we explicitly acknowledge privacy constraints, potential bias, and the need for larger, longitudinal, and demographically diverse studies before any clinical or policy deployment.",
      },
      keywords: {
        es: ["Análisis del habla", "Cribado de depresión", "ML de audio", "Whisper ASR", "FLAN-T5", "Fusión de modelos", "Informática en salud mental", "IA agéntica"],
        en: ["Speech analysis", "Depression screening", "Audio ML", "Whisper ASR", "FLAN-T5", "Model fusion", "Mental health informatics", "Agent AI"],
      },
    },
    {
      id: "garbage-routes-rag",
      title: "Intelligent Optimization of Garbage Collection Routes through RAG Architecture in San Pedro Sula (Smart City)",
      year: 2025,
      location: { es: "Ciudad de México, México", en: "Mexico City, Mexico" },
      venue: "IEEE LA-CCI 2025",
      venueFull: "2025 IEEE Latin American Conference on Computational Intelligence (LA-CCI)",
      publisher: "IEEE",
      status: "published",
      authors: ["Alejandro Jose Vargas Erazo", "Armando Jose Meza Diaz", "Edwin Josuse Sarabia Sanabria", "Luis Aguilar Loo"],
      doi: "10.1109/LA-CCI66231.2025.11270447",
      abstract: {
        es: "Esta investigación propone una solución innovadora basada en machine learning que utiliza una arquitectura de Generación Aumentada por Recuperación (RAG), claramente dividida en dos etapas: modelado predictivo y optimización heurística. Primero, los modelos predictivos (Extreme Gradient Boosting y Prophet para el pronóstico de la demanda; Gradient Boosting y Random Forest para los tiempos de servicio y de traslado) estiman con precisión la demanda futura y los tiempos operativos. Después, un algoritmo de Búsqueda Adaptativa en Vecindarios Grandes (ALNS) optimiza las rutas de recolección de basura, integrando las salidas predictivas para minimizar distancias, tiempos de traslado y costos operativos. Los resultados demuestran mejoras significativas en la eficiencia de las rutas, reducciones de los costos operativos y beneficios para una gestión urbana sostenible en ciudades inteligentes.",
        en: "This research proposes an innovative machine learning-based solution using a Retrieval-Augmented Generation (RAG) architecture, clearly divided into two stages: predictive modeling and heuristic optimization. First, predictive models (Extreme Gradient Boosting and Prophet for demand forecasting, Gradient Boosting and Random Forest for service and travel times) accurately estimate future demand and operational timings. Second, an Adaptive Large Neighborhood Search (ALNS) algorithm optimizes garbage collection routes, integrating predictive outputs to minimize distances, travel times, and operational costs. Results demonstrate significant route efficiency improvements, operational cost reductions, and sustainable urban management benefits for smart cities.",
      },
      keywords: {
        es: ["Optimización de rutas", "Gestión de residuos", "Ciudad inteligente", "Machine learning", "Arquitectura RAG", "San Pedro Sula", "ALNS", "XGBoost", "Pronóstico de demanda", "Inteligencia artificial"],
        en: ["Route optimization", "Waste management", "Smart city", "Machine learning", "RAG architecture", "San Pedro Sula", "ALNS", "XGBoost", "Demand forecasting", "Artificial intelligence"],
      },
    },
    {
      id: "adhd-early-prediction",
      title:
        "Early Prediction of ADHD Using Machine Learning Techniques in Educational Contexts with Limited Resources: Case of San Pedro Sula, Honduras",
      year: 2025,
      location: { es: "Lisboa, Portugal", en: "Lisbon, Portugal" },
      venue: "CISTI 2025",
      venueFull: "Proceedings of 20th Iberian Conference on Information Systems and Technologies (CISTI 2025): Volume 2",
      publisher: "Springer · LNNS 1717",
      status: "published",
      authors: ["Alejandro Vargas", "Leonardo Romero", "Luis Loo"],
      doi: "10.1007/978-3-032-10721-3_14",
      abstract: {
        es: "La detección temprana del Trastorno por Déficit de Atención e Hiperactividad (TDAH) es fundamental para una intervención eficaz; sin embargo, los métodos de diagnóstico actuales suelen requerir mucho tiempo y recursos. Este estudio explora la aplicación de técnicas de machine learning para predecir el TDAH en 81 estudiantes de San Pedro Sula, Honduras, a partir de un conjunto de datos con 38 variables que abarcan información demográfica, clínica y conductual. Se evaluaron múltiples clasificadores, entre ellos Regresión Logística, Regresión Logística Modificada, Random Forest, Máquinas de Vectores de Soporte, Naive Bayes, Naive Bayes ajustado por F1 y un clasificador de votación por ensamble. Además, se desarrolló un modelo Naive Bayes con características seleccionadas, identificadas mediante un Random Forest previamente optimizado. Entre los modelos, el Naive Bayes con características seleccionadas obtuvo el desempeño más equilibrado, con una exactitud de 0.74, una sensibilidad de 0.87, una especificidad de 0.46 y un AUC de 0.77. Estos resultados subrayan la importancia de una selección de características dirigida en conjuntos de datos pequeños y de alta dimensionalidad, y demuestran que un clasificador probabilístico sencillo puede emplearse eficazmente para la detección temprana del TDAH en entornos con recursos limitados. El trabajo futuro se centrará en refinar la ingeniería de características y la calibración de umbrales para mejorar aún más el desempeño y la capacidad de generalización del modelo.",
        en: "Early detection of Attention Deficit Hyperactivity Disorder (ADHD) is critical for effective intervention, yet current diagnostic methods are often time-consuming and resource-intensive. This study explores the application of machine learning techniques to predict ADHD among 81 students from San Pedro Sula, Honduras, using a dataset with 38 variables that encompass demographic, clinical, and behavioral information. Multiple classifiers were evaluated, including Logistic Regression, Modified Logistic Regression, Random Forest, Support Vector Machine, Naive Bayes, F1 Tuned Naive Bayes, and an Ensemble Voting Classifier. In addition, a Naive Bayes model with selected features—identified through a pre-optimized Random Forest—was developed. Among the models, the NB with Selected Features model achieved the best balanced performance, with an accuracy of 0.74, a sensitivity of 0.87, a specificity of 0.46, and an AUC of 0.77. These results underscore the importance of targeted feature selection in small, high-dimensional datasets, and demonstrate that a simple probabilistic classifier can be effectively employed for early ADHD detection in resource-constrained environments. Future work will focus on refining feature engineering and threshold calibration to further enhance model performance and generalizability.",
      },
      keywords: {
        es: ["TDAH", "Detección temprana", "Machine learning", "Naive Bayes", "Selección de características", "Datos educativos", "Análisis de encuestas", "Predicción diagnóstica", "Honduras", "Métodos de ensamble"],
        en: ["ADHD", "Early detection", "Machine learning", "Naive Bayes", "Feature selection", "Educational data", "Survey analysis", "Diagnostic prediction", "Honduras", "Ensemble methods"],
      },
    },
    {
      id: "radicalization-agentic",
      title:
        "Agentic Detection of Progressive Radicalization in User Posting Trajectories: A Hybrid LLM and Rule-Based Approach",
      year: 2026,
      location: { es: "Lima, Perú", en: "Lima, Peru" },
      status: "pending",
      // TODO: conferencia (venue/venueFull/publisher), autores, resumen, palabras clave y DOI cuando se publique.
    },
  ],

  researchAreas: [
    { es: "Ingeniería de software", en: "Software Engineering" },
    { es: "Machine learning", en: "Machine Learning" },
    { es: "Ciencia de datos", en: "Data Science" },
    { es: "Arquitectura de sistemas", en: "System Architecture" },
    { es: "Computación en la nube", en: "Cloud Computing" },
    { es: "Desarrollo web", en: "Web Development" },
  ],

  skills: [
    {
      id: "languages",
      title: { es: "Lenguajes y frameworks", en: "Languages & Frameworks" },
      items: ["C#", ".NET", "ASP.NET Core", "Blazor", "Rust", "React", "Next.js", "React Native", "JavaScript", "TypeScript", "Python", "Flutter"],
    },
    {
      id: "ai",
      title: { es: "Inteligencia artificial", en: "Artificial Intelligence" },
      items: ["Machine Learning", "LLMs", "RAG", { es: "Agentes", en: "Agents" }],
    },
    {
      id: "databases",
      title: { es: "Bases de datos", en: "Databases" },
      items: ["SQL Server", "PostgreSQL", "Azure SQL", "Firebase", "Entity Framework Core"],
    },
    {
      id: "cloud",
      title: { es: "Cloud y DevOps", en: "Cloud & DevOps" },
      items: ["Azure", "Docker", "Git", "GitHub", "CI/CD"],
    },
    {
      id: "architecture",
      title: { es: "Arquitectura y metodologías", en: "Architecture & Methodologies" },
      items: [{ es: "APIs REST", en: "REST APIs" }, { es: "POO", en: "OOP" }, "SOLID", "Scrum"],
    },
  ],

  education: [
    {
      degree: { es: "Ingeniería en Sistemas Computacionales", en: "Computer Systems Engineering" },
      institution: "Universidad Jesús de Nazareth",
      period: "2025",
    },
    {
      degree: { es: "Bachillerato en Ciencias y Humanidades", en: "High School Diploma in Sciences and Humanities" },
      institution: "Angels Bilingual School",
      period: "2019–2021",
    },
  ],

  certifications: [
    {
      title: {
        es: "Curso Internacional de Seguridad de la Información, Ciberseguridad y Protección de la Privacidad",
        en: "International Course on Information Security, Cybersecurity and Privacy Protection",
      },
      detail: {
        es: "Interpretación de la norma ISO/IEC 27001:2022",
        en: "Interpretation of the ISO/IEC 27001:2022 standard",
      },
      year: 2024,
    },
  ],

  languages: [
    { name: { es: "Español", en: "Spanish" }, level: { es: "Nativo", en: "Native" } },
    { name: { es: "Inglés", en: "English" }, level: { es: "Conversacional", en: "Conversational" } },
  ],

  references: {
    es: "Referencias disponibles a solicitud",
    en: "References available upon request",
  },
};
