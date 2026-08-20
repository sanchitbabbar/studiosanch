import type { Metadata } from 'next';
import SiteHeader from '../../components/site/SiteHeader';
import SiteFooter from '../../components/site/SiteFooter';
import CinematicReel from '../../components/site/CinematicReel';

export const metadata: Metadata = {
  title: 'PRODUCTIONS - STUDIO SANCH',
  description: 'Cinematic, fashion, cultural and brand production by Studio Sanch.',
};

const services = [
  {
    number: '01',
    title: 'CINEMATIC',
    text: 'Direction for film, fashion, editorial and audiovisual production—from first conception to final realisation.',
  },
  {
    number: '02',
    title: 'CULTURAL',
    text: 'Fashion shows, photoshoots, exhibitions and live performance formed into resonant artistic experiences.',
  },
  {
    number: '03',
    title: 'IDENTITY',
    text: 'Brand worlds, visual identities, art direction and digital or physical communication designed with a singular point of view.',
  },
  {
    number: '04',
    title: 'DISTRIBUTION',
    text: 'Editorial, audiovisual and musical works developed for the right audience, platform and cultural context.',
  },
];

export default function ProductionsPage() {
  return (
    <>
      <SiteHeader active="PRODUCTIONS" />
      <main className="productions-main">
        <section className="productions-hero">
          <h1>PRODUCTIONS</h1>
          <p className="productions-intro">
            For those seeking to realise a singular idea as a film, an image, an exhibition—or a world that could be remembered.
          </p>
          <div className="productions-reel">
            <CinematicReel
              src="/Videos/productions-gallery-montage.mp4?v=17"
              poster="/images/productions-hero-reel.png"
              label="A fashion film being directed in a contemporary gallery setting"
            />
          </div>
        </section>

        <section className="productions-statement" aria-labelledby="production-statement-title">
          <p className="productions-eyebrow">THE STUDIO</p>
          <h2 id="production-statement-title">
            From an initial idea to a lasting form, every production is composed with clarity, sensitivity and disciplined precision.
          </h2>
        </section>

        <section className="productions-services" aria-label="The Work">
          <div className="productions-services-heading">
            <p className="productions-eyebrow">THE WORK</p>
          </div>
          <div className="productions-grid">
            {services.map((service) => (
              <article className="productions-card" key={service.number}>
                <span>{service.number}</span>
                <h3>{service.title}</h3>
                <p>{service.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="productions-closing">
          <p className="productions-eyebrow">THE FIRST FRAME</p>
          <h2>Let the work begin.</h2>
          <a className="productions-cta" href="/contact.html">
            START A PROJECT <span>→</span>
          </a>
        </section>
      </main>
      <SiteFooter />
      <style>{`
        .productions-main { display: block; width: 100%; margin-top: 3rem; background: #000; color: #fff; }
        .productions-hero { display: flex; flex-direction: column; align-items: center; padding: 5.5rem max(2rem, calc((100vw - 1200px) / 2)) 0; text-align: center; border-bottom: 1px solid rgba(255,255,255,.1); background: #000; }
        .productions-eyebrow { margin: 0 0 1.6rem; color: rgba(255,255,255,.5); font-size: .58rem; font-weight: 400; letter-spacing: .34em; line-height: 1.5; text-transform: uppercase; }
        .productions-hero h1 { margin: 0; font-family: 'Montserrat', sans-serif; font-size: clamp(1.17rem, 2vw, 1.9rem); font-weight: 600; letter-spacing: .22em; line-height: 1; text-indent: .22em; text-transform: uppercase; }
        .productions-intro { max-width: 590px; margin: 2.15rem auto 0; color: rgba(255,255,255,.68); font-size: clamp(.76rem, 1.3vw, .9rem); font-weight: 300; letter-spacing: .115em; line-height: 1.9; }
        .productions-reel { width: 100%; max-width: 1200px; aspect-ratio: 2.32 / 1; margin: clamp(3.5rem, 6vw, 5.25rem) auto 0; overflow: hidden; background: #070707; border-top: 1px solid rgba(255,255,255,.12); border-bottom: 1px solid rgba(255,255,255,.12); }
        .productions-reel video { display: block; width: 100%; height: 100%; object-fit: cover; object-position: center 52%; filter: saturate(.72) contrast(1.06) brightness(.78); }
        .productions-cta { display: inline-flex; gap: 1rem; align-items: center; margin-top: 2.8rem; padding: .8rem 0; color: rgba(255,255,255,.9); font-size: .63rem; font-weight: 400; letter-spacing: .3em; text-decoration: none; transition: color .35s ease, letter-spacing .35s ease; }
        .productions-cta::after { content: ''; position: absolute; }
        .productions-cta:hover { color: #fff; letter-spacing: .34em; }
        .productions-cta span { font-size: 1rem; font-weight: 300; }
        .productions-statement, .productions-closing { max-width: 1060px; margin: 0 auto; padding: clamp(5rem, 11vw, 10rem) 2rem; text-align: center; }
        .productions-statement h2, .productions-closing h2 { max-width: 900px; margin: 0 auto; font-size: clamp(1.55rem, 3vw, 3rem); font-weight: 300; letter-spacing: .055em; line-height: 1.45; }
        .productions-services { padding: clamp(4rem, 8vw, 8rem) max(2rem, calc((100vw - 1200px) / 2)); border-top: 1px solid rgba(255,255,255,.1); border-bottom: 1px solid rgba(255,255,255,.1); }
        .productions-services-heading { display: flex; align-items: end; justify-content: space-between; gap: 2rem; margin-bottom: 4rem; }
        .productions-services-heading .productions-eyebrow { margin: 0; }
        .productions-services-heading h2 { margin: 0; font-size: clamp(1.35rem, 2.5vw, 2.3rem); font-weight: 300; letter-spacing: .08em; }
        .productions-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); border-top: 1px solid rgba(255,255,255,.12); border-left: 1px solid rgba(255,255,255,.12); }
        .productions-card { min-height: 255px; padding: 2rem; border-right: 1px solid rgba(255,255,255,.12); border-bottom: 1px solid rgba(255,255,255,.12); transition: background .45s ease; }
        .productions-card:hover { background: rgba(255,255,255,.035); }
        .productions-card span { color: rgba(255,255,255,.38); font-size: .6rem; letter-spacing: .2em; }
        .productions-card h3 { margin: 3.5rem 0 1.1rem; font-size: 1rem; font-weight: 400; letter-spacing: .22em; }
        .productions-card p { max-width: 390px; margin: 0; color: rgba(255,255,255,.58); font-size: .78rem; font-weight: 300; letter-spacing: .065em; line-height: 1.85; }
        .productions-closing { padding-bottom: clamp(6rem, 12vw, 11rem); }
        .productions-closing h2 { font-size: clamp(1.8rem, 3.6vw, 3.6rem); }
        @media (max-width: 700px) { .productions-hero { padding: 4.5rem 1.5rem 0; } .productions-hero h1 { font-size: 1.215rem; letter-spacing: .12em; text-indent: .12em; } .productions-reel { width: calc(100% + 3rem); aspect-ratio: 1.38 / 1; margin-inline: -1.5rem; } .productions-services { padding-inline: 1.5rem; } .productions-services-heading { display: block; } .productions-services-heading h2 { margin-top: 1rem; } .productions-grid { grid-template-columns: 1fr; } .productions-card { min-height: 220px; padding: 1.5rem; } .productions-statement, .productions-closing { padding-inline: 1.5rem; } }
      `}</style>
    </>
  );
}
