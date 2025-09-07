export default function NotFound() {
    return (
        <section className="hero" style={{ minHeight: '85vh', display: 'grid', placeItems: 'center' }}>
            <div className="hero__container reveal delay-1" style={{ textAlign: 'center' }}>
                <h1 className="hero__title">
                    <span className="line t-dim">Error</span>
                    <span className="line t-grad t-caps">404</span>
                </h1>

                <p className="hero__subtitle" style={{ maxWidth: '70ch', marginTop: 16 }}>
                    La página que buscas no existe o fue movida. Verifica la URL o vuelve al inicio.
                </p>

                <div className="hero__pills" style={{ marginTop: 20 }}>
                    <a className="btn btn--primary" href="/" aria-label="Ir al inicio">
                        Ir al inicio <span className="arrow">↗</span>
                    </a>
                </div>
            </div>
        </section>
    );
}