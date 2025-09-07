import { useEffect, useRef, useCallback, useLayoutEffect } from "react";

/* =========================
   CONSTANTES
   ========================= */

// Logo principal (un solo asset; en oscuro lo vuelvo blanco con CSS filter)
export const LOGO_URL = "/assets/nufi.png";

// Títulos de secciones
export const SECTION_TITLES = {
    heroTitle: "Backend & Machine Learning",
    projects: "Proyectos",
    tools: "Stack",
    about: "Sobre mí",
    experience: "Experiencia profesional en empresas como:",
    contact: "Contacto",
};

// Herramientas agrupadas
export const TOOLS_GROUPS = [
    {
        title: "Backend",
        items: [
            { name: "Python", icon: "devicon-python-plain" },
            { name: "FastAPI", icon: "devicon-fastapi-plain" },
            { name: "Go (Gin)", icon: "devicon-go-original-wordmark" },
            { name: "Java)", icon: "devicon-java-plain" },
            { name: "Spring Boot", icon: "devicon-spring-plain" },
            { name: "REST APIs", icon: "https://img.icons8.com/ios/50/api-settings.png" },
            { name: "Swagger", icon: "devicon-swagger-plain" },
            { name: "OpenAPI", icon: "devicon-openapi-plain" },
            { name: "Microservicios", icon: "https://img.icons8.com/external-soft-fill-juicy-fish/60/external-microservice-microservices-soft-fill-soft-fill-juicy-fish.png" },
        ],
    },
    {
        title: "Bases de Datos",
        items: [
            { name: "MySQL", icon: "devicon-mysql-original" },
            { name: "PostgreSQL", icon: "devicon-postgresql-plain" },
            { name: "MongoDB", icon: "devicon-mongodb-plain" },
            { name: "Cassandra", icon: "devicon-cassandra-plain" },
            { name: "Redis", icon: "devicon-redis-plain" },
            { name: "Neo4j", icon: "devicon-neo4j-plain" },
            { name: "BigQuery", icon: "https://cdn.simpleicons.org/googlebigquery#669DF6" },
            { name: "Amazon Redshift", icon: '<svg viewBox="0 0 1024 1024" class="icon" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M702.537143 218.477714c31.085714-10.825143 55.003429-23.113143 69.924571-35.328 10.24-8.338286 13.458286-13.824 13.458286-16.018285s-3.218286-7.68-13.458286-16.091429c-14.921143-12.141714-38.765714-24.429714-69.924571-35.254857C634.368 92.16 540.013714 78.336 438.857143 78.336s-195.510857 13.897143-263.68 37.449143c-31.085714 10.825143-55.003429 23.113143-69.924572 35.328-10.24 8.338286-13.458286 13.750857-13.458285 16.018286 0 2.194286 3.218286 7.68 13.458285 16.091428 14.921143 12.141714 38.765714 24.429714 69.924572 35.254857 68.169143 23.625143 162.523429 37.449143 263.68 37.449143s195.510857-13.897143 263.68-37.449143zM69.485714 464.749714v128.804572c37.961143 40.009143 140.068571 88.722286 264.777143 103.277714 182.857143 21.284571 355.986286-18.651429 473.526857-98.304l0.438857-131.657143C683.008 540.525714 506.733714 571.465143 328.484571 550.619429c-110.372571-12.8-204.361143-46.08-259.072-85.869715z m0-80.457143c38.034286 39.936 140.068571 88.649143 264.777143 103.131429 183.222857 21.357714 356.717714-18.724571 474.258286-98.742857l0.512-145.993143C734.208 286.573714 596.48 315.977143 438.857143 315.977143c-156.964571 0-294.253714-29.257143-369.152-72.777143A132116.333714 132116.333714 0 0 0 69.485714 384.219429z m0.146286 289.865143l0.292571 108.105143-1.097142-7.460571c22.381714 74.020571 165.302857 133.485714 378.148571 133.485714 115.931429 0 206.774857-17.554286 276.626286-52.077714 19.602286-9.728 34.523429-17.92 49.152-28.598857 9.728-7.094857 16.091429-11.410286 26.550857-20.626286 10.825143-9.581714 27.501714-7.241143 37.156571 3.657143 9.581714 10.752 10.825143 28.306286 0 37.961143-11.702857 10.24-17.188571 14.848-28.598857 23.186285-17.042286 12.434286-36.425143 25.380571-58.806857 36.498286-77.092571 38.107429-155.648 60.854857-302.08 60.854857-243.931429 0-405.211429-77.165714-436.077714-179.2l-1.097143-3.657143v-3.803428L9.362286 628.077714a116682.532571 116682.532571 0 0 1 0.365714-455.68 52.662857 52.662857 0 0 1-0.292571-5.266285C9.508571 84.918857 201.728 18.285714 438.857143 18.285714c237.129143 0 429.348571 66.633143 429.348571 148.845715a53.028571 53.028571 0 0 1-0.804571 9.581714 23.405714 23.405714 0 0 1 1.024 7.094857l-1.682286 520.411429c-0.073143 14.482286-13.385143 26.185143-29.769143 26.112-16.384 0-29.622857-11.776-29.549714-26.331429v-27.355429c-125.074286 73.216-301.056 104.082286-478.939429 83.382858-110.226286-12.873143-204.214857-46.08-258.925714-85.869715z m668.525714-290.962285a25.746286 25.746286 0 0 1-25.965714-25.453715c0-14.043429 11.702857-25.380571 26.038857-25.380571 14.336 0 26.038857 11.337143 26.038857 25.380571 0 14.116571-11.702857 25.453714-26.038857 25.453715z m0 209.408a25.746286 25.746286 0 0 1-25.965714-25.453715c0-14.043429 11.702857-25.453714 26.038857-25.453714 14.336 0 26.038857 11.410286 26.038857 25.453714 0 14.043429-11.702857 25.453714-26.038857 25.453715z m0 212.114285a25.746286 25.746286 0 0 1-25.965714-25.526857c0-14.043429 11.702857-25.453714 26.038857-25.453714 14.336 0 26.038857 11.410286 26.038857 25.453714 0 14.043429-11.702857 25.453714-26.038857 25.453714z" fill="#000000"></path></g></svg>' },
            { name: "Amazon S3", icon: '<svg fill="#000000" viewBox="0 -1.44 122.88 122.88" id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><title>bucket</title><path d="M122.55,19.33v.11a2.71,2.71,0,0,1-.11.58l-20.57,85.73,0,.1h0c-4.06,14.9-14.2,14.47-25.41,14-9.76-.44-20-.25-29.82-.1C31,120,24.36,120.09,19.3,98.9h0L19,97.83a30.93,30.93,0,0,1-6.44-5C1.71,82-3.85,51.81,3,17.25c0-5.94,7.76-10.66,20.3-13.49C33.58,1.44,47.6,0,63,0s29.36,1.44,39.63,3.76c12.54,2.83,20.3,7.56,20.3,13.49a6.7,6.7,0,0,1-.33,2.08ZM9.37,16.41l.11.63a.36.36,0,0,0-.23.09s0,.08,0,.12C9.24,24,33.29,29.4,63,29.4s53.7-5.44,53.7-12.15S92.61,5.1,63,5.1c-28.42,0-51.68,5-53.58,11.31Zm1,9.88L24.13,93.87a26.85,26.85,0,0,0,9.17,2.25C39.65,96.56,49.56,95,56,91.78A54,54,0,0,0,84.9,50a8.28,8.28,0,0,1-4.67-7.45c0-9.12,16.58-9.09,16.58,0a8.31,8.31,0,0,1-6.06,8A60,60,0,0,1,58.62,97c-7.37,3.68-18.33,5.46-25.71,4.94a33.39,33.39,0,0,1-7.13-1.26c3.57,13.44,9.71,13.38,20.73,13.18,9.94-.17,20.24-.34,30.16.09,8.75.39,16.67.72,19.49-9.65h0L114.8,26.65a54.81,54.81,0,0,1-12.22,4.09C92.31,33.07,78.29,34.5,63,34.5s-29.37-1.43-39.63-3.76A52.48,52.48,0,0,1,10.4,26.29ZM17,89,6.38,40.32c-2.23,22.82,2.4,40.5,10.35,48.42A2.77,2.77,0,0,0,17,89Z"></path></g></svg>' }],
    },
    {
        title: "Data Science & ML",
        items: [
            { name: "TensorFlow", icon: "devicon-tensorflow-original" },
            { name: "PyTorch", icon: "devicon-pytorch-original" },
            { name: "Scikit-learn", icon: "devicon-scikitlearn-plain" },
            { name: "Pandas", icon: "devicon-pandas-plain" },
            { name: "NumPy", icon: "devicon-numpy-plain" },
            { name: "Spark", icon: "devicon-apachespark-original" },
            { name: "Airflow", icon: "devicon-apacheairflow-plain" },
            { name: "MLflow", icon: "https://cdn.simpleicons.org/mlflow#0194E2" },
            { name: "SageMaker", icon: '<svg fill="#000000" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M445.055,123.568c-12.595-12.22-28.416-20.261-45.608-23.364c-3.867-24.924-15.987-47.865-34.975-65.742 C341.899,13.212,312.105,1.51,280.579,1.51c-37.307,0-71.871,16.418-94.583,44.429c-4.189-0.578-8.428-0.868-12.686-0.868 c-21.31,0-41.948,7.379-58.114,20.779c-13.722,11.375-23.519,26.457-28.178,43.154c-27.943,14.677-45.551,42.928-45.551,74.212 c0,36.188,23.64,67.124,56.751,79.123v35.861h33.391v-30.526h11.381c-0.02,0.599-0.042,1.198-0.042,1.8 c0,21.835,13.308,40.617,32.237,48.669c0.89,13.561,7.341,25.622,17.091,33.928v22.896h33.391v-11.285 c11.592-0.42,22.161-4.897,30.333-12.056c8.172,7.159,18.74,11.637,30.333,12.056v11.285h33.391v-22.896 c9.75-8.306,16.2-20.367,17.091-33.928c18.93-8.052,32.237-26.834,32.237-48.669c0-0.602-0.022-1.201-0.042-1.8h11.382v30.525 h33.391v-35.86c33.112-11.998,56.751-42.933,56.751-79.123C470.532,160.693,461.484,139.509,445.055,123.568z M239.304,314.913 c0,8.504-6.919,15.422-15.422,15.422c-6.527,0-12.107-4.081-14.355-9.821c9.716-2.618,18.6-7.979,25.469-15.564l-24.75-22.416 c-3.741,4.132-8.869,6.407-14.436,6.407c-10.736,0-19.469-8.734-19.469-19.469c0-0.117,0.014-0.233,0.017-0.349 c6.026,2.394,12.585,3.725,19.453,3.725v-33.391c-10.736,0-19.469-8.734-19.469-19.469c0-6.647,3.405-12.582,8.583-16.105 c5.473,7.279,12.966,13.059,21.817,16.38l11.728-31.264c-5.987-2.246-10.008-8.053-10.008-14.45 c0-8.505,6.92-15.423,15.423-15.423s15.421,6.92,15.421,15.424V314.913z M316.192,288.942c-5.567,0-10.694-2.275-14.436-6.407 l-24.75,22.416c6.869,7.583,15.753,12.946,25.469,15.564c-2.248,5.74-7.828,9.821-14.355,9.821 c-8.506-0.001-15.424-6.92-15.424-15.423V174.549c0-8.505,6.919-15.423,15.422-15.423c8.504,0,15.423,6.919,15.423,15.423 c0,6.398-4.021,12.205-10.008,14.45l11.728,31.264c8.851-3.32,16.344-9.1,21.817-16.38c5.178,3.523,8.583,9.458,8.583,16.105 c0,10.735-8.734,19.469-19.469,19.469v33.391c6.869,0,13.428-1.331,19.454-3.725c0.002,0.117,0.017,0.232,0.017,0.349 C335.662,280.208,326.928,288.942,316.192,288.942z M383.292,234.282h-16.219c1.28-4.55,1.98-9.341,1.98-14.294 c0-21.634-13.254-40.546-32.236-48.652c-1.662-25.423-22.862-45.601-48.698-45.601c-12.291,0-23.528,4.577-32.118,12.102 c-8.592-7.525-19.827-12.102-32.118-12.102c-25.836,0-47.036,20.178-48.698,45.601c-18.982,8.106-32.236,27.018-32.236,48.652 c0,4.954,0.7,9.744,1.98,14.294h-16.217c-29.695,0-53.853-22.908-53.853-51.065c0-20.558,12.906-39.026,32.878-47.048l8.737-3.509 l1.517-9.293c4.182-25.6,27.963-44.905,55.319-44.905c5.258,0,10.457,0.689,15.452,2.046l11.647,3.165l6.657-10.066 c16.028-24.237,43.51-38.705,73.513-38.705c22.985,0,44.65,8.479,61.005,23.874c16.15,15.204,25.31,35.469,25.793,57.062 l0.361,16.154l16.157,0.168c29.361,0.305,53.247,23.21,53.247,51.058C437.142,211.374,412.986,234.282,383.292,234.282z"></path> </g> </g> <g> <g> <path d="M98.218,331.592v16.696H83.404c-6.552-15.653-22.026-26.68-40.028-26.68C19.458,321.608,0,341.066,0,364.983 c0,23.917,19.457,43.375,43.375,43.375c18.003,0,33.476-11.027,40.028-26.68h48.206v-50.087H98.218z M43.375,374.966 c-5.505,0-9.984-4.479-9.984-9.984s4.478-9.984,9.984-9.984s9.984,4.479,9.984,9.984S48.88,374.966,43.375,374.966z"></path> </g> </g> <g> <g> <path d="M468.625,321.608c-18.003,0-33.476,11.027-40.028,26.68h-14.815v-16.696H380.39v50.087h48.206 c6.552,15.653,22.026,26.68,40.028,26.68c23.917,0,43.375-19.458,43.375-43.375C512,341.066,492.543,321.608,468.625,321.608z M468.625,374.966c-5.505,0-9.984-4.479-9.984-9.984s4.478-9.984,9.984-9.984s9.984,4.479,9.984,9.984 S474.131,374.966,468.625,374.966z"></path> </g> </g> <g> <g> <path d="M225.667,427.086v-18.729h-33.391v18.729c-15.653,6.554-26.68,22.026-26.68,40.028c0,23.917,19.457,43.375,43.375,43.375 c23.918,0,43.375-19.458,43.375-43.375C252.347,449.112,241.32,433.64,225.667,427.086z M208.972,477.1 c-5.505,0-9.984-4.479-9.984-9.984s4.478-9.984,9.984-9.984s9.984,4.479,9.984,9.984C218.956,472.621,214.477,477.1,208.972,477.1 z"></path> </g> </g> <g> <g> <path d="M319.724,427.086v-18.729h-33.391v18.729c-15.653,6.554-26.68,22.026-26.68,40.028c0,23.917,19.457,43.375,43.375,43.375 c23.918,0,43.375-19.458,43.375-43.375C346.404,449.112,335.377,433.64,319.724,427.086z M303.028,477.1 c-5.505,0-9.984-4.479-9.984-9.984s4.478-9.984,9.984-9.984s9.984,4.479,9.984,9.984C313.012,472.621,308.533,477.1,303.028,477.1 z"></path> </g> </g> </g></svg>' },
            { name: "Snowflake", icon: "https://cdn.simpleicons.org/snowflake#29B5E8" },
            { name: "Databricks", icon: "https://cdn.simpleicons.org/databricks#FF3621" },
            { name: "LLMs", icon: "https://cdn.simpleicons.org/ollama#000000" },
        ],
    },
    {
        title: "Cloud, DevOps & Infra",
        items: [
            { name: "AWS", icon: "devicon-amazonwebservices-plain-wordmark" },
            { name: "GCP", icon: "devicon-googlecloud-plain" },
            { name: "Docker", icon: "devicon-docker-plain" },
            { name: "Kubernetes", icon: "devicon-kubernetes-plain" },
            { name: "GitHub Actions", icon: "devicon-githubactions-plain" },
            { name: "Jenkins", icon: "devicon-jenkins-plain" },
            { name: "CircleCI", icon: "devicon-circleci-plain" },
            { name: "Terraform", icon: "devicon-terraform-plain" },
            { name: "Kafka", icon: "devicon-apachekafka-original" },
            { name: "RabbitMQ", icon: "devicon-rabbitmq-original" },
            { name: "Prometheus", icon: "devicon-prometheus-original" },
            { name: "Grafana", icon: "devicon-grafana-plain" },
        ],
    },
];

// Proyectos (placeholder) — con KPIs
export const PROJECTS = [
    {
        id: "p_aml_network",
        title: "Red transaccional para detección de lavado de activos",
        summary:
            "Sistema que construye una red entre usuarios y transacciones financieras, identifica patrones en los movimientos y calcula un porcentaje de probabilidad de lavado de activos para cada usuario, facilitando la priorización de casos en investigaciones.",
        tags: ["Python", "Spark", "ETL", "Grafos"],
        kpis: [
            { label: "Volumen procesado", value: "+400M registros", delta: "good" },
            { label: "Tiempo de ejecución local", value: "≈ 1 h", delta: "good" },
            { label: "Aumento de procesamiento", value: "×440", delta: "good" }
        ]
    },
    {
        id: "p_uiaf_ros",
        title: "Automatización de cargue de reportes UIAF",
        summary:
            "Sistema que automatiza la preparación y envío de Reportes de Operación Sospechosa (ROS) a la UIAF: ingesta de datos, validación de reglas, generación de lotes y carga automática con trazabilidad y control de errores.",
        tags: ["Python", "Airflow", "Selenium", "Pandas"],
        kpis: [
            { label: "Ahorro operativo (h/año)", value: "11 000", delta: "good" },
            { label: "Errores humanos", value: "−95%", delta: "good" },
            { label: "Tiempo por reporte", value: "−90%", delta: "good" }
        ]
    },
    {
        id: "p_cloud_optim",
        title: "Optimización de arquitectura en producción",
        summary:
            "Mantenimiento y optimización de un backend en GCP con más de 37 microservicios y un volumen superior a 10M de operaciones diarias, orientado a mejorar la disponibilidad del sistema y reducir costos de infraestructura.",
        tags: ["GCP", "Kubernetes", "Pub/Sub", "Compute Engine"],
        kpis: [
            { label: "Disponibilidad", value: "99.99%", delta: "good" },
            { label: "Costos nube", value: "−90%", delta: "good" },
            { label: "Uso de memoria", value: "−22%", delta: "good" },
            { label: "Tamaño de arquitectura", value: "−62%", delta: "good" }
        ]
    },
    {
        id: "p_vecibot",
        title: "Backend para conjunto residencial (Vecibot)",
        summary:
            "Sistema de gestión y notificaciones para conjuntos residenciales, integrado con WhatsApp para automatizar tickets, avisos y comunicaciones en múltiples torres.",
        tags: ["Django", "Twilio", "WhatsApp API", "PostgreSQL"],
        kpis: [
            { label: "Cobertura", value: "10+ torres", delta: "good" },
            { label: "Tickets automatizados", value: "70%", delta: "good" }
        ]
    },
    {
        id: "p_receipts_ocr",
        title: "Clasificación de recibos escaneados",
        summary:
            "Pipeline de procesamiento de documentos que clasifica automáticamente recibos escaneados mediante OCR y un modelo de red neuronal, facilitando la digitalización contable.",
        tags: ["Python", "Keras", "Tesseract", "MLOps"],
        kpis: [
            { label: "Exactitud", value: "98.3%", delta: "good" },
            { label: "Velocidad de procesamiento", value: "×28 más rápido", delta: "good" }
        ]
    },
    {
        id: "p_transport_scraper",
        title: "Scraper de precios logísticos internacionales",
        summary:
            "Backend que extrae y normaliza tarifas logísticas de contenedores y envíos internacionales a partir de múltiples fuentes, facilitando la comparación de precios en diferentes rutas y países.",
        tags: ["Python", "Scraping", "ETL"],
        kpis: [
            { label: "Cobertura", value: "+55 países", delta: "good" },
            { label: "Velocidad de cotización", value: "×180 más rápido", delta: "good" },
            { label: "Reducción de costos", value: "−40%", delta: "good" }
        ]
    }
];

// Logos experiencia
const EXPERIENCE_LOGOS = [
    { id: "scotiabank", alt: "Scotiabank Colpatria", src: "/assets/scotia.png" },
    { id: "nufi", alt: "Nufi", src: "/assets/nufi.png" },
    { id: "meli", alt: "Mercado Libre", src: "/assets/meli.webp" },
    { id: "coordi", alt: "Cooordinadora", src: "/assets/coordi.png" },
];

/* =========================
   HOOKS
   ========================= */

function useReveal() {
    useEffect(() => {
        document.body.classList.add("js");
        const items = Array.from(document.querySelectorAll("[data-reveal]"));
        if (!("IntersectionObserver" in window)) {
            items.forEach((el) => el.classList.add("is-visible"));
            return;
        }
        const io = new IntersectionObserver(
            (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("is-visible")),
            { threshold: 0.12 }
        );
        items.forEach((el) => io.observe(el));
        return () => io.disconnect();
    }, []);
}

/* =========================
   COMPONENTES
   ========================= */

function ProjectCard({ p }) {
    return (
        <article className="project-card3" data-reveal>
            <div className="project-body3">
                <h3 className="text-strong">{p.title}</h3>
                <p className="proj-summary text-secondary">{p.summary}</p>
                <ul className="tags">
                    {p.tags.map((t) => (
                        <li key={t} className="tag">{t}</li>
                    ))}
                </ul>
                {p.kpis?.length > 0 && (
                    <>
                        {p.kpis.length <= 4 ? (
                            <ul className="kpi-list kpi-list--grid">
                                {p.kpis.map((k, i) => (
                                    <li className="kpi" key={i}>
                                        <span className="kpi-label">{k.label}</span>
                                        <span className="kpi-value">{k.value}</span>
                                        <span className={`kpi-delta ${k.delta ?? "neutral"}`}>
                                            {k.delta === "good" ? "↑" : k.delta === "bad" ? "↓" : "•"}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <ul className="kpi-list kpi-list--extra">
                                {p.kpis.map((k, i) => (
                                    <li className="kpi kpi--row" key={i}>
                                        <span className="kpi-label">{k.label}</span>
                                        <span className="kpi-value">{k.value}</span>
                                        <span className={`kpi-delta ${k.delta ?? "neutral"}`}>
                                            {k.delta === "good" ? "↑" : k.delta === "bad" ? "↓" : "•"}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </>
                )}
            </div>
        </article>
    );
}

function ProjectsCarousel() {
    const repeated = Array.from({ length: 7 }, () => PROJECTS).flat();
    const railRef = useRef(null);
    const cardWRef = useRef(0);
    const busyRef = useRef(false);
    const queueRef = useRef(0);

    const startIndex = PROJECTS.length * 4;

    // Util: medir ancho efectivo de una tarjeta + gap
    const measureCardWidth = useCallback(() => {
        const rail = railRef.current;
        if (!rail || !rail.children.length) return 0;

        const first = rail.children[0];
        const second = rail.children[1];

        // Si hay al menos 2, medimos distancia entre centros para incluir gap real (subpíxeles)
        if (second) {
            const r1 = first.getBoundingClientRect();
            const r2 = second.getBoundingClientRect();
            const center1 = r1.left + r1.width / 2;
            const center2 = r2.left + r2.width / 2;
            const delta = Math.abs(center2 - center1);
            return delta; // ancho tarjeta + gap exacto
        }

        // Fallback: 1 sola tarjeta visible
        const styles = getComputedStyle(rail);
        const gap = parseFloat(styles.gap || '0') || 0;
        const w = first.getBoundingClientRect().width + gap;
        return w;
    }, []);

    useLayoutEffect(() => {
        const rail = railRef.current;
        if (!rail) return;

        cardWRef.current = measureCardWidth();

        // Centrar inicio
        const child = rail.children[startIndex];
        if (child) {
            const target = child.offsetLeft + child.offsetWidth / 2 - rail.clientWidth / 2;
            rail.scrollLeft = Math.max(0, Math.min(target, rail.scrollWidth - rail.clientWidth));
        }

        // Re-medimos si cambia el layout (resize / fuentes / etc.)
        const ro = new ResizeObserver(() => {
            cardWRef.current = measureCardWidth();
        });
        ro.observe(rail);
        return () => ro.disconnect();
    }, [startIndex, measureCardWidth]);

    // Animación suave controlada (sin scrollend)
    const animateTo = (to, { duration = 360 } = {}) =>
        new Promise((resolve) => {
            const rail = railRef.current;
            if (!rail) return resolve();

            const from = rail.scrollLeft;
            const dist = to - from;
            if (Math.abs(dist) < 0.5) {
                rail.scrollLeft = to;
                return resolve();
            }

            busyRef.current = true;
            const t0 = performance.now();

            const ease = (t) => 1 - Math.pow(1 - t, 3); // easeOutCubic

            const step = (now) => {
                const p = Math.min(1, (now - t0) / duration);
                rail.scrollLeft = from + dist * ease(p);
                if (p < 1) {
                    requestAnimationFrame(step);
                } else {
                    busyRef.current = false;
                    resolve();
                }
            };
            requestAnimationFrame(step);
        });

    const snapToIndex = (idx) => {
        const rail = railRef.current;
        const cardW = cardWRef.current || 1;
        const maxLeft = Math.max(0, rail.scrollWidth - rail.clientWidth);
        const target = Math.max(0, Math.min(Math.round(idx) * cardW, maxLeft));
        return target;
    };

    const currentIndex = () => {
        const rail = railRef.current;
        const cardW = cardWRef.current || 1;
        return rail ? rail.scrollLeft / cardW : 0;
    };

    const drainQueue = async () => {
        // Procesa cualquier clic acumulado durante la animación
        while (queueRef.current !== 0 && !busyRef.current) {
            const step = queueRef.current;
            queueRef.current = 0;
            const rail = railRef.current;
            if (!rail) break;

            const idx = currentIndex();
            const nextIdx = Math.round(idx) + step;
            const to = snapToIndex(nextIdx);
            await animateTo(to, { duration: 360 });

            // Re-sincroniza al múltiplo exacto para evitar pelea con scroll-snap
            rail.scrollLeft = snapToIndex(Math.round(nextIdx));
        }
    };

    const go = async (dir, step = 1) => {
        const rail = railRef.current;
        const cardW = cardWRef.current;
        if (!rail || !cardW) return;

        // Si está animando, acumulamos el clic
        if (busyRef.current) {
            queueRef.current += dir * step;
            return;
        }

        const idx = currentIndex();
        const nextIdx = Math.round(idx) + dir * step;
        const to = snapToIndex(nextIdx);

        await animateTo(to, { duration: 360 });

        // Re-sincroniza exacto
        rail.scrollLeft = snapToIndex(Math.round(nextIdx));

        // Si hubo clics durante la animación, los drenamos
        await drainQueue();
    };

    return (
        <div className="projects-carousel" data-reveal>
            <button
                className="proj-btn proj-left"
                onClick={() => go(-1)}
                aria-disabled={busyRef.current}
            >
                ‹
            </button>

            <div className="projects-row" ref={railRef}>
                {repeated.map((p, i) => (
                    <ProjectCard key={`${p.id}-${i}`} p={p} />
                ))}
            </div>

            <button
                className="proj-btn proj-right"
                onClick={() => go(1)}
                aria-disabled={busyRef.current}
            >
                ›
            </button>
        </div>
    );
}

/* =========================
   ICONOS (SVG)
   ========================= */

const IconLinkedIn = () => (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">
        <path fill="currentColor" d="M20.45 20.45h-3.56v-5.4c0-1.29-.02-2.95-1.8-2.95-1.8 0-2.07 1.4-2.07 2.85v5.5H9.46V9h3.42v1.56h.05c.48-.9 1.66-1.85 3.4-1.85 3.64 0 4.31 2.4 4.31 5.52v6.22ZM5.34 7.44a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.55V9h3.57v11.45Z" />
    </svg>
);

const IconGitHub = () => (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">
        <path fill="currentColor" d="M12 .5a11.5 11.5 0 0 0-3.64 22.42c.58.11.79-.25.79-.56v-2.1c-3.2.69-3.87-1.38-3.87-1.38-.53-1.35-1.29-1.7-1.29-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.2 1.79 1.2 1.04 1.78 2.74 1.27 3.41.97.11-.76.4-1.27.74-1.56-2.56-.29-5.26-1.28-5.26-5.68 0-1.25.45-2.27 1.19-3.08-.12-.29-.52-1.46.11-3.06 0 0 .98-.31 3.2 1.18.94-.26 1.95-.4 2.95-.4s2.01.14 2.95.4c2.22-1.49 3.2-1.18 3.2-1.18.63 1.6.23 2.77.11 3.06.74.81 1.19 1.83 1.19 3.08 0 4.41-2.71 5.38-5.29 5.67.41.36.78 1.08.78 2.18v3.23c0 .31.21.68.8.56A11.5 11.5 0 0 0 12 .5Z" />
    </svg>
);

/* =========================
   APP
   ========================= */

export default function App() {
    const expRailRef = useRef(null);
    useReveal();

    useEffect(() => {
        document.body.classList.add("theme-dim", "js");
    }, []);

    return (
        <>
            {/* HEADER */}
            <section id="head">
                <h1 class="visually-hidden">
                    Nufi - Backend &amp; Machine Learning
                </h1>
            </section >

            <header className="site-header" >
                <div className="container header-inner">
                    <a className="brand" href="#head" aria-label="Inicio">
                        <img className="brand-logo" src={LOGO_URL} alt="Nufi" />
                    </a>
                    <nav className="nav">
                        <a href="#proyectos">Proyectos</a>
                        <a href="#herramientas">Herramientas</a>
                        <a href="#sobre-mi">Sobre mí</a>
                        <a href="#contacto">Contacto</a>
                    </nav>
                </div>
            </header>

            {/* HERO */}
            <section class="hero">
                <div class="hero__container">
                    <h1 class="hero__title">
                        <span class="line reveal delay-1">
                            <span class="t-dim">Menos</span>
                            <span class="t-grad t-caps">PROCESOS</span>
                        </span>
                        <span class="line reveal delay-2">
                            <span class="t-dim">Más</span>
                            <span class="t-grad t-caps">DATOS</span>
                        </span>
                        <span class="line reveal delay-3">
                            <span class="t-dim">Mejores</span>
                            <span class="t-grad t-caps">RESULTADOS</span>
                        </span>
                    </h1>

                    <p class="hero__subtitle reveal delay-4">
                        <strong>Backend &amp; Machine Learning</strong> para transformar procesos complejos
                        en soluciones simples y escalables, con impacto real en el negocio.
                    </p>

                    <div class="hero__pills reveal delay-5">
                        <span class="pill">APIs &amp; Microservicios</span>
                        <span class="pill">AI &amp; MLOps</span>
                        <span class="pill">Data Pipelines</span>
                        <span class="pill">Cloud Solutions</span>
                    </div>
                </div>
            </section>

            {/* PROYECTOS */}
            <section className="projects" id="proyectos">
                <div className="container">
                    <h2 className="section-title">{SECTION_TITLES.projects}</h2>
                    <ProjectsCarousel />
                </div>
            </section>

            {/* HERRAMIENTAS */}
            <section className="tools-section" id="herramientas">
                <div className="container">
                    <h2 className="section-title">{SECTION_TITLES.tools}</h2>

                    <div className="tools-groups two-cols" data-reveal>
                        {TOOLS_GROUPS.map((group) => (
                            <div className="tool-group" key={group.title}>
                                <h3 className="tool-group-title">{group.title}</h3>
                                <div className="tools-list">
                                    {group.items.map((tool) => (
                                        <div className="tool-item" key={`${group.title}-${tool.name}`}>
                                            {tool.icon.startsWith("<svg") ? (
                                                // Caso 1: SVG inline
                                                <span
                                                    className="tool-icon"
                                                    dangerouslySetInnerHTML={{ __html: tool.icon }}
                                                />
                                            ) : tool.icon.startsWith("http") ? (
                                                // Caso 2: URL (PNG/SVG externo)
                                                <img src={tool.icon} alt={tool.name} className="tool-icon" />
                                            ) : (
                                                // Caso 3: Clase Devicon
                                                <i className={tool.icon}></i>
                                            )}
                                            <span className="tool-name">{tool.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SOBRE MÍ + EXPERIENCIA (marquee infinito CSS) */}
            <section className="about" id="sobre-mi">
                <div className="container">
                    <h2 className="section-title">{SECTION_TITLES.about}</h2>

                    <div class="about-card">
                        <div class="about-row">
                            <div class="about-icon">👤</div>
                            <div class="about-label">Juan Carlos Hernández</div>
                            <div class="about-text">Ingeniero Informático enfocado en Backend &amp; Machine Learning.</div>
                        </div>

                        <div class="about-row">
                            <div class="about-icon">🎓</div>
                            <div class="about-label">Educación</div>
                            <div class="about-text">Pregrado en Ingeniería Informática y dos MicroMasters en Data Science &amp; Software Development.</div>
                        </div>

                        <div class="about-row">
                            <div class="about-icon">🏅</div>
                            <div class="about-label">+28 certificaciones</div>
                            <div class="about-text">
                                Harvard, Google, IBM, MITx y otros referentes globales.
                            </div>
                        </div>

                        <div class="about-row">
                            <div class="about-icon">⚙️</div>
                            <div class="about-label">Experiencia práctica</div>
                            <div class="about-text">Microservicios en producción, MLOps, optimización de arquitecturas y automatización.</div>
                        </div>
                    </div>

                    <div className="experience-only">
                        <h3 className="sub-title">{SECTION_TITLES.experience}</h3>

                        <div className="marquee-in" ref={expRailRef} aria-hidden="true">
                            <div className="marquee-track-in">
                                {/* Grupo A */}
                                {EXPERIENCE_LOGOS.map((e, idx) => (
                                    <div className="marquee-item-in exp-card card" key={`${e.id}_A_${idx}`}>
                                        <img
                                            src={e.src}
                                            alt={e.alt}
                                            className="exp-logo-in"
                                            loading="lazy"
                                            decoding="async"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* CONTACTO */}
            <section className="contact" id="contacto">
                <div className="container">
                    <h2 className="section-title">{SECTION_TITLES.contact}</h2>

                    <div className="contact-cards" data-reveal>
                        <a className="contact-card" href="mailto:info@nufi.com.co" target="_blank" rel="noreferrer">
                            <div className="cc-icon" aria-hidden="true">
                                <svg viewBox="0 0 24 24" width="22" height="22"><path fill="currentColor" d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 4-8 5L4 8V6l8 5 8-5v2Z" /></svg>
                            </div>
                            <div className="cc-content">
                                <h4>Email</h4>
                                <p className="cc-url">info [at] nufi [dot] com [dot] co</p>
                            </div>
                        </a>

                        <a className="contact-card" href="https://linkedin.com/in/juanhdzma" target="_blank" rel="noreferrer">
                            <div className="cc-icon" aria-hidden="true"><IconLinkedIn /></div>
                            <div className="cc-content">
                                <h4>LinkedIn</h4>
                                <p className="cc-url">linkedin.com/in/juanhdzma</p>
                            </div>
                        </a>

                        <a className="contact-card" href="https://github.com/juanhdzma" target="_blank" rel="noreferrer">
                            <div className="cc-icon" aria-hidden="true"><IconGitHub /></div>
                            <div className="cc-content">
                                <h4>GitHub</h4>
                                <p className="cc-url">github.com/juanhdzma</p>
                            </div>
                        </a>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="site-footer">
                <div className="container">
                    <small className="text-muted">© {new Date().getFullYear()} Nufi — Enfoque técnico y resultados.</small>
                </div>
            </footer>
        </>
    );
}