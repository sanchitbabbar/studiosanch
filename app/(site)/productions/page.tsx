'use client';

import { useEffect, useState, type FormEvent } from 'react';
import SiteHeader from '../../components/site/SiteHeader';
import SiteFooter from '../../components/site/SiteFooter';
import CinematicReel from '../../components/site/CinematicReel';
import { useLanguage } from '../../context/LanguageContext';

const services = [
  {
    number: '01',
    title: 'CINEMATIC',
    text: 'Direction for film, fashion, editorial and audiovisual production—from first conception to final realisation.',
    textFr: 'Direction de films, de mode, de projets éditoriaux et audiovisuels — de la première conception à la réalisation finale.',
  },
  {
    number: '02',
    title: 'CULTURAL',
    text: 'Fashion shows, photoshoots, exhibitions and live performance formed into resonant artistic experiences.',
    textFr: 'Défilés, séances photo, expositions et performances vivantes façonnés en expériences artistiques mémorables.',
  },
  {
    number: '03',
    title: 'IDENTITY',
    text: 'Brand worlds, visual identities, art direction and digital or physical communication designed with a singular point of view.',
    textFr: 'Univers de marque, identités visuelles, direction artistique et communication numérique ou physique conçus avec un regard singulier.',
  },
  {
    number: '04',
    title: 'DISTRIBUTION',
    text: 'Editorial, audiovisual and musical works developed for the right audience, platform and cultural context.',
    textFr: 'Œuvres éditoriales, audiovisuelles et musicales développées pour le public, la plateforme et le contexte culturel appropriés.',
  },
];

const productionProcess = [
  {
    number: '01',
    title: 'LISTEN',
    titleFr: 'ÉCOUTER',
    text: 'We begin with the intention: what should the audience feel, remember and carry with them?',
    textFr: "Nous commençons par l’intention : que doit ressentir, retenir et emporter le public ?",
  },
  {
    number: '02',
    title: 'COMPOSE',
    titleFr: 'COMPOSER',
    text: 'Narrative, image, movement, casting and space are shaped into one precise creative language.',
    textFr: 'Récit, image, mouvement, casting et espace s’accordent dans un langage créatif précis.',
  },
  {
    number: '03',
    title: 'REALISE',
    titleFr: 'RÉALISER',
    text: 'A trusted team carries the idea through production with calm, rigor and absolute attention to detail.',
    textFr: "Une équipe de confiance conduit l’idée jusqu’à sa réalisation avec calme, rigueur et attention absolue.",
  },
  {
    number: '04',
    title: 'REVEAL',
    titleFr: 'RÉVÉLER',
    text: 'The final work is refined for every screen, room and encounter where it will live.',
    textFr: 'La forme finale est affinée pour chaque écran, espace et rencontre où elle prendra vie.',
  },
];

export default function ProductionsPage() {
  const { language } = useLanguage();
  const fr = language === 'fr';
  const [contactOpen, setContactOpen] = useState(false);
  const [contactStatus, setContactStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const closeContact = () => {
    setContactOpen(false);
    window.setTimeout(() => setContactStatus('idle'), 350);
  };

  const submitContact = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setContactStatus('sending');
    const form = event.currentTarget;
    const data = new FormData(form);
    data.append('service', 'Studio Sanch Production');
    data.append('_subject', 'Production Project Enquiry');
    try {
      const response = await fetch('https://formspree.io/f/mrpgkojw', {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) throw new Error('Submission failed');
      form.reset();
      setContactStatus('sent');
    } catch {
      setContactStatus('error');
    }
  };

  useEffect(() => {
    if (!contactOpen) return;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => event.key === 'Escape' && closeContact();
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [contactOpen]);

  useEffect(() => {
    const revealItems = Array.from(document.querySelectorAll<HTMLElement>('[data-production-reveal]'));
    const observer = new IntersectionObserver(
      entries => entries.forEach(entry => entry.target.classList.toggle('is-visible', entry.isIntersecting)),
      { threshold: 0.16, rootMargin: '0px 0px -8% 0px' },
    );
    revealItems.forEach(item => observer.observe(item));

    const textItems = Array.from(document.querySelectorAll<HTMLElement>('[data-production-text]'));
    const textObserver = new IntersectionObserver(
      entries => entries.forEach(entry => entry.target.classList.toggle('is-text-active', entry.isIntersecting)),
      { threshold: 0.2, rootMargin: '-12% 0px -18% 0px' },
    );
    textItems.forEach(item => textObserver.observe(item));

    const updateProgress = () => {
      const main = document.querySelector<HTMLElement>('.productions-main');
      if (!main) return;
      const rect = main.getBoundingClientRect();
      const distance = Math.max(1, main.offsetHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, -rect.top / distance));
      main.style.setProperty('--production-progress', progress.toString());
    };
    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    return () => {
      observer.disconnect();
      textObserver.disconnect();
      window.removeEventListener('scroll', updateProgress);
    };
  }, []);

  return (
    <>
      <SiteHeader active="PRODUCTIONS" />
      <main className="productions-main">
        <div className="productions-progress" aria-hidden="true"><i /></div>
        <section className="productions-hero">
          <h1>PRODUCTIONS</h1>
          <p className="productions-intro">
            {fr ? 'Pour celles et ceux qui souhaitent donner forme à une idée singulière — un film, une image, une exposition ou un univers dont on se souviendra.' : 'For those seeking to realise a singular idea as a film, an image, an exhibition—or a world that could be remembered.'}
          </p>
          <div className="productions-reel">
            <CinematicReel
              src="/Videos/productions-gallery-montage-selective-monochrome.mp4?v=1"
              poster="/images/productions-hero-reel.png"
              label={fr ? 'Réalisation d’un film de mode dans une galerie contemporaine' : 'A fashion film being directed in a contemporary gallery setting'}
            />
          </div>
        </section>

        <section className="productions-statement" aria-labelledby="production-statement-title" data-production-reveal>
          <div className="productions-statement-orbit" aria-hidden="true"><i /><i /><i /></div>
          <div className="productions-statement-copy" data-production-text>
            <p className="productions-eyebrow">{fr ? 'LE STUDIO' : 'THE STUDIO'}</p>
            <h2 id="production-statement-title" className="productions-statement-lines">
              {(fr
                ? ["De l’idée originelle à la forme pérenne,", 'chaque création est bercée de sensibilité', "et ciselée d’une précision absolue."]
                : ['From an initial idea to a lasting form,', 'every production is composed with sensitivity', 'and minute precision.']
              ).map((line, index) => <span key={line} style={{ '--line-index': index } as React.CSSProperties}>{line}</span>)}
            </h2>
            <button className="productions-pill" type="button" onClick={() => setContactOpen(true)}>{fr ? 'PARLER DE VOTRE PROJET' : 'DISCUSS YOUR PROJECT'} <span>↗︎</span></button>
          </div>
        </section>

        <section className="productions-journey" aria-labelledby="productions-journey-title">
          <div className="productions-journey-intro" data-production-text data-production-reveal>
            <div>
              <p className="productions-eyebrow">{fr ? 'NOTRE APPROCHE' : 'THE APPROACH'}</p>
              <h2 id="productions-journey-title">{fr ? 'À chaque vision,\nsa voie.' : 'Each vision,\nits own route.'}</h2>
            </div>
            <p>{fr ? 'De sa première impulsion à sa présence finale, chaque vision reçoit l’espace, l’attention et la précision nécessaires pour devenir pleinement elle-même.' : 'From its first impulse to its final presence, each vision is given the space, attention and precision to become entirely its own.'}</p>
          </div>
          <div className="productions-process">
            {productionProcess.map((step, index) => (
              <article className="productions-process-step" key={step.number} data-production-reveal>
                <div className="productions-process-visual" aria-hidden="true">
                  <i className={`process-glyph process-glyph-${index + 1}`}><b /></i>
                </div>
                <div className="productions-process-copy" data-production-text>
                  <h3>{fr ? step.titleFr : step.title}</h3>
                  <p>{fr ? step.textFr : step.text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="productions-services" aria-label="The Work">
          <div className="productions-services-heading" data-production-text>
            <div><p className="productions-eyebrow">{fr ? 'LE TRAVAIL' : 'THE WORK'}</p><h2>{fr ? 'Les idées, mises en forme.' : 'Ideas, given form.'}</h2></div>
            <p>{fr ? 'Chaque projet reçoit une réponse réfléchie.' : 'Each project is met with a considered response.'}</p>
          </div>
          <div className="productions-grid">
            {services.map((service, index) => (
              <article className="productions-card" key={service.number} data-production-reveal>
                <div className="productions-card-head"><span>{service.number}</span></div>
                <div className={`productions-card-shape shape-${index + 1}`} aria-hidden="true"><i /></div>
                <div className="productions-card-copy" data-production-text>
                  <h3>{service.title}</h3>
                  <p>{fr ? service.textFr : service.text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="productions-closing" data-production-reveal>
          <div className="productions-closing-light" aria-hidden="true" />
          <div className="productions-closing-copy" data-production-text>
            <p className="productions-eyebrow">{fr ? 'LE PREMIER CADRE' : 'THE FIRST FRAME'}</p>
            <h2>{fr ? 'L’idée se révèle.' : 'Let the idea reveal itself.'}</h2>
            <button className="productions-cta" type="button" onClick={() => setContactOpen(true)}>
              {fr ? 'DÉMARRER UN PROJET' : 'START A PROJECT'} <span>↗︎</span>
            </button>
          </div>
        </section>
      </main>
      <div className={`production-contact-modal${contactOpen ? ' is-open' : ''}`} aria-hidden={!contactOpen}>
        <button className="production-contact-backdrop" type="button" aria-label={fr ? 'Fermer' : 'Close'} onClick={closeContact} />
        <section className="production-contact-panel" role="dialog" aria-modal="true" aria-labelledby="production-contact-title">
          <div className="production-contact-orbits" aria-hidden="true" />
          <div className="production-contact-header">
            <p>{fr ? 'NOUVELLE PRODUCTION' : 'NEW PRODUCTION'}</p>
            <button type="button" onClick={closeContact} aria-label={fr ? 'Fermer' : 'Close'}><span aria-hidden="true" /></button>
          </div>
          {contactStatus === 'sent' ? (
            <div className="production-contact-success">
              <span>✓</span>
              <h2>{fr ? 'Votre message a été envoyé.' : 'Your message has been sent.'}</h2>
              <p>{fr ? 'Nous reviendrons vers vous prochainement.' : 'We will be in touch shortly.'}</p>
              <button type="button" onClick={closeContact}>{fr ? 'FERMER' : 'CLOSE'}</button>
            </div>
          ) : (
            <>
              <h2 id="production-contact-title">{fr ? 'Commencez par ce que vous imaginez.' : 'Begin with what you imagine.'}</h2>
              <p className="production-contact-intro">{fr ? 'Partagez ce qui vous semble essentiel.' : 'Share what feels essential.'}</p>
              <form onSubmit={submitContact}>
                <label>{fr ? 'VOTRE NOM' : 'YOUR NAME'}<input name="name" type="text" required autoFocus /></label>
                <label>{fr ? 'VOTRE E-MAIL' : 'YOUR EMAIL'}<input name="email" type="email" required /></label>
                <label>{fr ? 'VOTRE PROJET' : 'YOUR PROJECT'}<textarea name="message" rows={3} required /></label>
                {contactStatus === 'error' && <p className="production-contact-error">{fr ? 'Votre message n’a pas pu être envoyé. Écrivez-nous à info@studiosanch.com.' : 'Your message could not be sent. Please write to info@studiosanch.com.'}</p>}
                <button className="production-contact-submit" type="submit" disabled={contactStatus === 'sending'}>{contactStatus === 'sending' ? (fr ? 'ENVOI…' : 'SENDING…') : (fr ? 'ENVOYER' : 'SEND')} <span>↗︎</span></button>
              </form>
            </>
          )}
        </section>
      </div>
      <SiteFooter />
      <style>{`
        .productions-main { --production-progress: 0; position: relative; display: block; width: 100%; margin-top: 3rem; overflow: clip; background: #000; color: #fff; }
        .productions-progress { position: fixed; z-index: 70; top: 50%; right: 1.1rem; width: 1px; height: 110px; overflow: hidden; background: rgba(255,255,255,.16); transform: translateY(-50%); }
        .productions-progress i { display: block; width: 100%; height: 100%; background: #fff; transform: scaleY(var(--production-progress)); transform-origin: top; }
        .productions-hero { display: flex; flex-direction: column; align-items: center; padding: 5.5rem max(2rem, calc((100vw - 1200px) / 2)) 0; text-align: center; border-bottom: 1px solid rgba(255,255,255,.1); background: #000; }
        .productions-eyebrow { margin: 0 0 1.6rem; color: rgba(255,255,255,.5); font-size: .58rem; font-weight: 400; letter-spacing: .34em; line-height: 1.5; text-transform: uppercase; }
        .productions-hero h1 { margin: 0; padding: 0 15px; box-sizing: border-box; color: #e0e0e0; font-family: 'Syne', sans-serif; font-size: 1.8rem; font-weight: 600; letter-spacing: .1em; line-height: normal; text-align: center; text-transform: uppercase; }
        .productions-intro { max-width: 590px; margin: 2.15rem auto 0; color: rgba(255,255,255,.68); font-size: clamp(.76rem, 1.3vw, .9rem); font-weight: 300; letter-spacing: .115em; line-height: 1.9; }
        .productions-reel { width: 100%; max-width: 1200px; aspect-ratio: 2.32 / 1; margin: clamp(3.5rem, 6vw, 5.25rem) auto 0; overflow: hidden; background: #070707; border-top: 1px solid rgba(255,255,255,.12); border-bottom: 1px solid rgba(255,255,255,.12); }
        .productions-reel video { display: block; width: 100%; height: 100%; object-fit: cover; object-position: center 52%; filter: saturate(.72) contrast(1.06) brightness(.78); }
        [data-production-reveal] { opacity: .03; filter: blur(14px); transform: translate3d(0,58px,0) scale(.985); transition: opacity 1.15s cubic-bezier(.16,1,.3,1), filter 1.25s cubic-bezier(.16,1,.3,1), transform 1.25s cubic-bezier(.16,1,.3,1); will-change: opacity, filter, transform; }
        [data-production-reveal].is-visible { opacity: 1; filter: blur(0); transform: translate3d(0,0,0) scale(1); }
        [data-production-text] { opacity: .08; filter: blur(9px); transform: translate3d(0, 52px, 0) scale(.985); transition: opacity .9s cubic-bezier(.16,1,.3,1), filter 1.1s cubic-bezier(.16,1,.3,1), transform 1.1s cubic-bezier(.16,1,.3,1); will-change: opacity, filter, transform; }
        [data-production-text].is-text-active { opacity: 1; filter: blur(0); transform: translate3d(0,0,0) scale(1); }
        .productions-statement { position: relative; display: grid; min-height: min(860px, 90vh); place-items: center; padding: clamp(7rem, 13vw, 13rem) 2rem; overflow: hidden; border-bottom: 1px solid rgba(255,255,255,.1); }
        .productions-statement::before { content: ''; position: absolute; inset: 12% 8%; background: radial-gradient(circle at 50% 50%, rgba(255,255,255,.09), transparent 30%), radial-gradient(circle at 62% 48%, rgba(255,255,255,.035), transparent 46%); filter: blur(4px); }
        .productions-statement-copy { position: relative; z-index: 2; width: min(1100px, 100%); padding: clamp(4rem, 8vw, 7rem) clamp(2rem, 5vw, 4.5rem); overflow: visible; text-align: center; isolation: isolate; }
        .productions-statement-copy::before { content: ''; position: absolute; z-index: -2; top: 50%; left: 50%; width: min(78vw, 920px); aspect-ratio: 1; border: 1px solid rgba(255,255,255,.13); border-radius: 50%; background: radial-gradient(circle at 34% 28%, rgba(255,255,255,.11), rgba(255,255,255,.035) 31%, rgba(255,255,255,.012) 58%, rgba(255,255,255,.045)); box-shadow: inset 0 1px 0 rgba(255,255,255,.16), inset -55px -35px 95px rgba(255,255,255,.025), 0 55px 150px rgba(0,0,0,.58); -webkit-backdrop-filter: blur(28px); backdrop-filter: blur(28px); transform: translate(-50%,-50%); pointer-events: none; }
        .productions-statement-copy::after { content: ''; position: absolute; z-index: -1; top: 50%; left: 50%; width: min(64vw, 745px); aspect-ratio: 1; border: 1px solid rgba(255,255,255,.08); border-radius: 50%; opacity: .66; background: repeating-radial-gradient(circle at 48% 52%, transparent 0 68px, rgba(255,255,255,.12) 69px, transparent 70px, transparent 116px); box-shadow: inset 24px 18px 70px rgba(255,255,255,.035), 0 0 85px rgba(255,255,255,.035); filter: blur(.22px); transform: translate(-50%,-50%) rotate(calc(var(--production-progress) * 28deg)); pointer-events: none; -webkit-mask-image: radial-gradient(circle, #000 30%, rgba(0,0,0,.8) 64%, transparent 86%); mask-image: radial-gradient(circle, #000 30%, rgba(0,0,0,.8) 64%, transparent 86%); }
        .productions-statement-copy > * { position: relative; z-index: 1; }
        .productions-statement h2 { max-width: 1000px; margin: 0 auto; font-size: clamp(1.75rem, 3.5vw, 3.8rem); font-weight: 300; letter-spacing: -.025em; line-height: 1.14; text-wrap: balance; }
        .productions-statement-lines span { display: block; opacity: .12; filter: blur(10px); transform: translate3d(calc((var(--line-index) - 1) * 28px), 32px, 0); transition: opacity .9s cubic-bezier(.16,1,.3,1), filter 1s cubic-bezier(.16,1,.3,1), transform 1.1s cubic-bezier(.16,1,.3,1); transition-delay: calc(var(--line-index) * 110ms); }
        .productions-statement-copy.is-text-active .productions-statement-lines span { opacity: 1; filter: blur(0); transform: translate3d(0,0,0); }
        .productions-statement-copy > p:not(.productions-eyebrow) { max-width: 620px; margin: 2.2rem auto 0; color: rgba(255,255,255,.58); font-size: clamp(.78rem, 1.15vw, .95rem); font-weight: 300; letter-spacing: .07em; line-height: 1.9; }
        .productions-pill { display: inline-flex; align-items: center; gap: .85rem; margin-top: 2.5rem; padding: .68rem .78rem .68rem 1.15rem; border: 1px solid rgba(255,255,255,.18); border-radius: 99px; background: rgba(255,255,255,.045); color: rgba(255,255,255,.72); -webkit-backdrop-filter: blur(16px); backdrop-filter: blur(16px); font: inherit; font-size: .53rem; letter-spacing: .23em; text-decoration: none; cursor: pointer; box-shadow: inset 0 1px 0 rgba(255,255,255,.07); transition: color .4s ease, background .4s ease, border-color .4s ease, transform .4s ease, box-shadow .4s ease; }
        .productions-pill span { display: grid; width: 1.55rem; height: 1.55rem; place-items: center; padding-top: .11em; padding-left: .11em; border: 1px solid rgba(255,255,255,.14); border-radius: 50%; background: rgba(255,255,255,.055); color: rgba(255,255,255,.75); font-size: .7rem; line-height: 1; box-sizing: border-box; transition: color .4s ease, background .4s ease; }
        .productions-pill:hover { border-color: #fff; background: #fff; color: #000; transform: translateY(-3px); }
        .productions-pill:hover span { background: #000; color: #fff; }
        .productions-statement-orbit { position: absolute; inset: 50% auto auto 50%; width: min(66vw, 720px); aspect-ratio: 1; border: 1px solid rgba(255,255,255,.08); border-radius: 50%; transform: translate(-50%,-50%) rotate(calc(var(--production-progress) * 110deg)); }
        .productions-statement-orbit::before, .productions-statement-orbit::after { content: ''; position: absolute; border: 1px solid rgba(255,255,255,.06); border-radius: 50%; }
        .productions-statement-orbit::before { inset: 13%; }
        .productions-statement-orbit::after { inset: 30%; }
        .productions-statement-orbit i { position: absolute; width: 12px; height: 12px; border-radius: 50%; background: radial-gradient(circle at 38% 32%, rgba(255,255,255,.44) 0 3%, rgba(180,180,176,.22) 17%, rgba(78,78,76,.2) 46%, rgba(12,12,12,.78) 76%, rgba(0,0,0,.94) 100%); box-shadow: inset -3px -4px 7px rgba(0,0,0,.72), inset 2px 2px 4px rgba(255,255,255,.055), 0 7px 18px rgba(0,0,0,.72), 0 0 24px rgba(210,210,205,.045); opacity: .78; filter: blur(.15px); animation: productionPearl 9s ease-in-out infinite; }
        .productions-statement-orbit i:nth-child(1) { top: 8%; left: 25%; }
        .productions-statement-orbit i:nth-child(2) { right: 12%; bottom: 24%; width: 8px; height: 8px; opacity: .62; animation-delay: -3.2s; animation-duration: 11s; }
        .productions-statement-orbit i:nth-child(3) { left: 28%; bottom: 17%; width: 5px; height: 5px; opacity: .46; animation-delay: -6.4s; animation-duration: 13s; }
        @keyframes productionPearl { 0%,100% { opacity: .62; transform: scale(.94); } 48% { opacity: .84; transform: scale(1.035); } 56% { opacity: .79; transform: scale(1); } }
        .productions-journey { position: relative; display: grid; grid-template-columns: minmax(260px,.78fr) minmax(520px,1.25fr); gap: clamp(3rem, 8vw, 9rem); max-width: 1320px; margin: 0 auto; padding: clamp(7rem, 11vw, 11rem) max(2rem, 5vw); isolation: isolate; }
        .productions-journey::before, .productions-journey::after { content: ''; position: absolute; z-index: -1; border-radius: 50%; filter: blur(80px); pointer-events: none; }
        .productions-journey::before { top: 18%; right: 2%; width: 320px; height: 480px; background: rgba(190,198,204,.14); transform: rotate(24deg); }
        .productions-journey::after { bottom: 8%; left: 8%; width: 390px; height: 280px; background: rgba(255,255,255,.075); }
        .productions-journey-intro { position: sticky; top: 8rem; align-self: start; min-height: 420px; padding: clamp(2rem, 4vw, 3.2rem); border: 1px solid rgba(255,255,255,.1); border-radius: 2.5rem; background: linear-gradient(145deg, rgba(255,255,255,.07), rgba(255,255,255,.018)); box-shadow: inset 0 1px 0 rgba(255,255,255,.1), 0 30px 80px rgba(0,0,0,.35); -webkit-backdrop-filter: blur(24px); backdrop-filter: blur(24px); }
        .productions-journey-intro::before { content: ''; position: absolute; right: -18%; bottom: -4%; width: 86%; aspect-ratio: 1; border-radius: 50%; opacity: .34; background: repeating-radial-gradient(ellipse at center, transparent 0 38px, rgba(255,255,255,.13) 39px, transparent 40px, transparent 68px); filter: blur(.35px); transform: rotate(22deg); pointer-events: none; -webkit-mask-image: linear-gradient(to left, #000, transparent 78%); mask-image: linear-gradient(to left, #000, transparent 78%); }
        .productions-journey-intro > * { position: relative; z-index: 1; }
        .productions-journey-intro h2 { max-width: 500px; margin: 0; white-space: pre-line; font-size: clamp(2.4rem, 4.6vw, 4.8rem); font-weight: 300; letter-spacing: -.04em; line-height: 1.02; }
        .productions-journey-intro > p { max-width: 390px; margin: 2.2rem 0 0; color: rgba(255,255,255,.48); font-size: .76rem; letter-spacing: .06em; line-height: 1.9; }
        .productions-process { display: grid; gap: 1.8rem; perspective: 1200px; }
        .productions-process-step { position: relative; display: grid; grid-template-columns: 180px 1fr; align-items: center; min-height: 350px; padding: 3rem 2rem; overflow: hidden; border: 1px solid rgba(255,255,255,.14); border-top-color: rgba(255,255,255,.24); border-left-color: rgba(255,255,255,.18); border-radius: 2.25rem; background: linear-gradient(128deg, rgba(255,255,255,.095), rgba(16,16,16,.68) 36%, rgba(4,4,4,.82) 68%, rgba(255,255,255,.055)); box-shadow: inset 0 1px 0 rgba(255,255,255,.17), inset 18px 12px 45px rgba(255,255,255,.025), 0 18px 24px rgba(0,0,0,.74), 0 42px 85px rgba(0,0,0,.62), 0 0 70px rgba(210,220,228,.035); -webkit-backdrop-filter: blur(28px) saturate(115%); backdrop-filter: blur(28px) saturate(115%); transform: translate3d(0,72px,-90px) rotateX(4deg) scale(.93); transform-style: preserve-3d; }
        .productions-process-step.is-visible { transform: translate3d(0,-6px,0) rotateX(0) scale(1); }
        .productions-process-step::after { content: ''; position: absolute; top: -45%; right: -20%; width: 58%; height: 115%; border-radius: 50%; background: rgba(230,237,242,.085); filter: blur(38px); transition: transform 1.2s cubic-bezier(.16,1,.3,1); }
        .productions-process-step::before { content: ''; position: absolute; inset: -45% -18%; z-index: 0; opacity: .28; background: repeating-radial-gradient(ellipse at 82% 50%, transparent 0 54px, rgba(255,255,255,.14) 55px, transparent 56px, transparent 94px); transform: rotate(calc(-7deg + var(--production-progress) * 18deg)); pointer-events: none; -webkit-mask-image: linear-gradient(100deg, transparent 38%, #000 74%, transparent 96%); mask-image: linear-gradient(100deg, transparent 38%, #000 74%, transparent 96%); }
        .productions-process-step > * { position: relative; z-index: 1; }
        .productions-process-step:hover::after { transform: translate3d(-30%,18%,0); }
        .productions-process-visual { position: relative; display: grid; width: 126px; height: 126px; place-items: center; perspective: 600px; }
        .productions-process-visual > span { position: absolute; right: -2px; bottom: 4px; color: rgba(255,255,255,.3); font-size: .55rem; letter-spacing: .16em; }
        .process-glyph { position: relative; display: block; width: 78px; height: 62px; border: 1px solid rgba(255,255,255,.4); border-radius: 48% 52% 46% 54% / 56% 44% 56% 44%; transform: rotate(-12deg); transition: transform 1.2s cubic-bezier(.16,1,.3,1), border-color .5s ease, border-radius 1.2s cubic-bezier(.16,1,.3,1); }
        .process-glyph b { position: absolute; inset: 12px; border: 1px solid rgba(255,255,255,.2); border-radius: inherit; }
        .productions-process-step:hover .process-glyph { border-color: #fff; border-radius: 58% 42% 55% 45% / 43% 57% 42% 58%; transform: rotate(12deg) scale(1.08); }
        .process-glyph-2 { border-radius: 50%; transform: none; }
        .productions-process-step:hover .process-glyph-2 { transform: scale(1.08); }
        .process-glyph-2 b { border-radius: 50%; }
        .process-glyph-3 { width: 82px; height: 54px; border-radius: 50%; transform: rotate(-12deg) skewX(-6deg); }
        .productions-process-step:hover .process-glyph-3 { transform: rotate(12deg) skewX(6deg) scale(1.08); }
        .process-glyph-4 { border-radius: 62% 38% 56% 44% / 44% 57% 43% 56%; transform: rotate(18deg); }
        .productions-process-step:hover .process-glyph-4 { transform: rotate(198deg) scale(1.08); }
        .productions-process-copy small { color: rgba(255,255,255,.3); font-size: .54rem; letter-spacing: .22em; }
        .productions-process-copy h3 { margin: 1.3rem 0 1rem; font-size: clamp(1.15rem, 2vw, 1.7rem); font-weight: 400; letter-spacing: .22em; }
        .productions-process-copy p { max-width: 440px; margin: 0; color: rgba(255,255,255,.56); font-size: .8rem; letter-spacing: .055em; line-height: 1.85; }
        .productions-services { position: relative; padding: clamp(6rem, 10vw, 10rem) max(2rem, calc((100vw - 1200px) / 2)); overflow: hidden; border-bottom: 1px solid rgba(255,255,255,.1); isolation: isolate; }
        .productions-services::before { content: ''; position: absolute; z-index: -1; top: 20%; left: 50%; width: min(850px,82vw); height: 620px; border-radius: 50%; background: radial-gradient(circle, rgba(210,216,220,.11), rgba(255,255,255,.025) 42%, transparent 70%); filter: blur(45px); transform: translateX(-50%); }
        .productions-services-heading { display: flex; align-items: end; justify-content: space-between; gap: 2rem; margin-bottom: 4rem; }
        .productions-services-heading .productions-eyebrow { margin: 0; }
        .productions-services-heading h2 { margin: 0; font-size: clamp(1.35rem, 2.5vw, 2.3rem); font-weight: 300; letter-spacing: .08em; }
        .productions-services-heading > p { max-width: 340px; margin: 0; color: rgba(255,255,255,.45); font-size: .72rem; letter-spacing: .06em; line-height: 1.8; }
        .productions-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1.1rem; }
        .productions-card { position: relative; min-height: 440px; padding: 2rem; overflow: hidden; border: 1px solid rgba(255,255,255,.11); border-radius: 2.5rem; background: linear-gradient(145deg, rgba(255,255,255,.065), rgba(5,5,5,.72) 55%, rgba(255,255,255,.025)); box-shadow: inset 0 1px 0 rgba(255,255,255,.1), 0 32px 80px rgba(0,0,0,.36); -webkit-backdrop-filter: blur(24px); backdrop-filter: blur(24px); transition: opacity 1.15s cubic-bezier(.16,1,.3,1), filter 1.25s cubic-bezier(.16,1,.3,1), background .6s ease, transform 1.25s cubic-bezier(.16,1,.3,1), border-color .6s ease; }
        .productions-card:nth-child(odd), .productions-card:nth-child(even) { transform: translate3d(0,62px,0) scale(.94); }
        .productions-card.is-visible { transform: translate3d(0,0,0) scale(1); }
        .productions-card::before { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at 75% 28%, rgba(255,255,255,.08), transparent 30%); opacity: 0; transition: opacity .6s ease; }
        .productions-card::after { content: ''; position: absolute; inset: -34% -22%; z-index: 0; opacity: .3; background: repeating-radial-gradient(ellipse at 78% 36%, transparent 0 50px, rgba(255,255,255,.13) 51px, transparent 52px, transparent 88px); filter: blur(.3px); transform: rotate(-15deg); transition: opacity .7s ease, transform 1.4s cubic-bezier(.16,1,.3,1); pointer-events: none; -webkit-mask-image: linear-gradient(118deg, transparent 30%, #000 68%, transparent 94%); mask-image: linear-gradient(118deg, transparent 30%, #000 68%, transparent 94%); }
        .productions-card:hover { border-color: rgba(255,255,255,.24); background: linear-gradient(145deg, rgba(255,255,255,.1), rgba(8,8,8,.68) 55%, rgba(255,255,255,.04)); transform: translateY(-8px); }
        .productions-card:hover::before { opacity: 1; }
        .productions-card:hover::after { opacity: .58; transform: rotate(2deg) scale(1.04); }
        .productions-card-head { position: relative; z-index: 2; display: flex; justify-content: space-between; color: rgba(255,255,255,.38); font-size: .6rem; letter-spacing: .2em; }
        .productions-card-head i { font-size: 1rem; font-style: normal; transition: transform .5s ease, color .5s ease; }
        .productions-card:hover .productions-card-head i { color: #fff; transform: translate(3px,-3px); }
        .productions-card-shape { position: absolute; z-index: 1; top: 78px; right: 10%; width: 128px; height: 128px; border: 1px solid rgba(255,255,255,.19); border-radius: 50%; transition: transform 1s cubic-bezier(.16,1,.3,1), border-color .6s ease; }
        .productions-card-shape i { position: absolute; inset: 22%; border: 1px solid rgba(255,255,255,.13); border-radius: inherit; }
        .productions-card:hover .productions-card-shape { border-color: rgba(255,255,255,.62); transform: rotate(90deg) scale(1.08); }
        .shape-2 { border-radius: 28%; transform: rotate(18deg); }
        .productions-card:hover .shape-2 { transform: rotate(108deg) scale(1.08); }
        .shape-3 { width: 150px; height: 92px; border-radius: 50%; transform: rotate(-20deg); }
        .productions-card:hover .shape-3 { transform: rotate(20deg) scale(1.08); }
        .shape-4 { border-radius: 50% 0 50% 50%; }
        .productions-card-copy { position: relative; z-index: 2; margin-top: 12.2rem; }
        .productions-card h3 { margin: 0 0 1.1rem; font-size: 1rem; font-weight: 400; letter-spacing: .22em; }
        .productions-card-copy p { max-width: 390px; margin: 0; color: rgba(255,255,255,.58); font-size: .78rem; font-weight: 300; letter-spacing: .065em; line-height: 1.85; }
        .productions-card > a { position: absolute; z-index: 2; right: 2rem; bottom: 2rem; left: 2rem; display: flex; justify-content: space-between; padding-top: 1.1rem; border-top: 1px solid rgba(255,255,255,.14); color: rgba(255,255,255,.48); font-size: .55rem; letter-spacing: .22em; text-decoration: none; transition: color .4s ease; }
        .productions-card > a:hover { color: #fff; }
        .productions-card > a span { font-size: .85rem; }
        .productions-closing { position: relative; max-width: 1180px; margin: 0 auto; padding: clamp(8rem, 14vw, 14rem) 2rem; overflow: hidden; text-align: center; }
        .productions-closing-copy { position: relative; }
        .productions-closing h2 { position: relative; max-width: 920px; margin: 0 auto; font-size: clamp(2rem, 5vw, 5.4rem); font-weight: 300; letter-spacing: -.035em; line-height: 1.08; text-wrap: balance; }
        .productions-closing-copy > p:not(.productions-eyebrow) { position: relative; margin: 2rem 0 0; color: rgba(255,255,255,.36); font-size: .58rem; letter-spacing: .22em; text-transform: uppercase; }
        .productions-closing-light { position: absolute; top: 45%; left: 50%; width: min(780px,80vw); height: 280px; border-radius: 50%; background: rgba(255,255,255,.08); filter: blur(90px); transform: translate(-50%,-50%); }
        .productions-cta { position: relative; display: inline-flex; gap: .78rem; align-items: center; margin-top: 2.5rem; padding: .68rem 1.05rem; border: 1px solid rgba(255,255,255,.18); border-radius: 99px; background: rgba(255,255,255,.045); color: rgba(255,255,255,.72); -webkit-backdrop-filter: blur(16px); backdrop-filter: blur(16px); font: inherit; font-size: .53rem; font-weight: 400; letter-spacing: .25em; text-decoration: none; cursor: pointer; box-shadow: inset 0 1px 0 rgba(255,255,255,.07); transition: color .35s ease, background .35s ease, border-color .35s ease, transform .35s ease, box-shadow .35s ease; }
        .productions-cta:hover { background: #fff; color: #000; transform: translateY(-3px); }
        .productions-cta span { font-size: .9rem; font-weight: 300; }
        .production-contact-modal { position: fixed; z-index: 5000; inset: 0; display: grid; place-items: center; padding: 1.25rem; visibility: hidden; opacity: 0; transition: opacity .55s ease, visibility 0s linear .55s; }
        .production-contact-modal.is-open { visibility: visible; opacity: 1; transition-delay: 0s; }
        .production-contact-backdrop { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; background: rgba(0,0,0,.68); -webkit-backdrop-filter: blur(18px); backdrop-filter: blur(18px); cursor: default; }
        .production-contact-panel { position: relative; width: min(520px,100%); max-height: calc(100vh - 2rem); padding: clamp(1.5rem,3vw,2.25rem); overflow: hidden; border: 1px solid rgba(255,255,255,.15); border-radius: 1.5rem; background: linear-gradient(145deg, rgba(30,30,30,.88), rgba(4,4,4,.93)); box-shadow: inset 0 1px 0 rgba(255,255,255,.12), 0 40px 120px rgba(0,0,0,.72); color: #fff; transform: translateY(32px) scale(.975); transition: transform .7s cubic-bezier(.16,1,.3,1); }
        .production-contact-modal.is-open .production-contact-panel { transform: translateY(0) scale(1); }
        .production-contact-orbits { position: absolute; inset: -28% -30%; opacity: .22; background: repeating-radial-gradient(ellipse at 82% 38%, transparent 0 54px, rgba(255,255,255,.16) 55px, transparent 56px, transparent 94px); transform: rotate(-13deg); pointer-events: none; -webkit-mask-image: linear-gradient(120deg, transparent 26%, #000 68%, transparent 94%); mask-image: linear-gradient(120deg, transparent 26%, #000 68%, transparent 94%); }
        .production-contact-panel > *:not(.production-contact-orbits) { position: relative; z-index: 1; }
        .production-contact-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; }
        .production-contact-header p { margin: 0; color: rgba(255,255,255,.42); font-size: .56rem; letter-spacing: .3em; }
        .production-contact-header button { position: relative; display: grid; width: 2rem; height: 2rem; flex: 0 0 auto; place-items: center; padding: 0; border: 0; background: transparent; cursor: pointer; transition: transform .35s ease; }
        .production-contact-header button span, .production-contact-header button span::after { display: block; width: .72rem; height: 1px; background: rgba(255,255,255,.68); transition: background .35s ease; }
        .production-contact-header button span { transform: rotate(45deg); }
        .production-contact-header button span::after { content: ''; transform: rotate(90deg); }
        .production-contact-header button:hover { transform: rotate(90deg); }
        .production-contact-header button:hover span, .production-contact-header button:hover span::after { background: #fff; }
        .production-contact-panel h2 { max-width: 430px; margin: 0; font-size: clamp(1.55rem,3vw,2.25rem); font-weight: 300; letter-spacing: -.025em; line-height: 1.1; }
        .production-contact-intro { margin: .65rem 0 1.5rem; color: rgba(255,255,255,.45); font-size: .68rem; letter-spacing: .08em; }
        .production-contact-panel form { display: grid; gap: 1rem; }
        .production-contact-panel label { display: grid; gap: .4rem; padding-bottom: .55rem; border-bottom: 1px solid rgba(255,255,255,.16); color: rgba(255,255,255,.4); font-size: .5rem; letter-spacing: .24em; }
        .production-contact-panel input, .production-contact-panel textarea { width: 100%; border: 0; padding: .1rem 0; background: transparent; color: rgba(255,255,255,.92); font: inherit; font-size: .76rem; letter-spacing: .05em; outline: none; resize: none; }
        .production-contact-panel label:focus-within { border-color: rgba(255,255,255,.7); color: rgba(255,255,255,.8); }
        .production-contact-submit, .production-contact-success button { display: inline-flex; width: fit-content; align-items: center; gap: .75rem; margin-top: .2rem; border: 1px solid rgba(255,255,255,.18); border-radius: 99px; padding: .58rem .65rem .58rem 1rem; background: rgba(255,255,255,.055); color: rgba(255,255,255,.76); -webkit-backdrop-filter: blur(16px); backdrop-filter: blur(16px); font: inherit; font-size: .51rem; letter-spacing: .24em; cursor: pointer; box-shadow: inset 0 1px 0 rgba(255,255,255,.07); transition: color .35s ease, background .35s ease, border-color .35s ease, transform .35s ease; }
        .production-contact-submit span { display: grid; width: 1.45rem; height: 1.45rem; place-items: center; padding-top: .11em; padding-left: .11em; border: 1px solid rgba(255,255,255,.15); border-radius: 50%; background: rgba(255,255,255,.06); color: rgba(255,255,255,.76); line-height: 1; box-sizing: border-box; transition: color .35s ease, background .35s ease; }
        .production-contact-submit:hover, .production-contact-success button:hover { border-color: #fff; background: #fff; color: #000; transform: translateY(-2px); }
        .production-contact-submit:hover span { background: #000; color: #fff; }
        .production-contact-submit:disabled { opacity: .55; cursor: wait; }
        .production-contact-error { margin: 0; color: #dba9a9; font-size: .65rem; line-height: 1.6; }
        .production-contact-success { padding: 3rem 0 1rem; text-align: center; }
        .production-contact-success > span { display: grid; width: 4rem; height: 4rem; margin: 0 auto 2rem; place-items: center; border: 1px solid rgba(255,255,255,.2); border-radius: 50%; }
        .production-contact-success h2 { margin-inline: auto; }
        .production-contact-success p { color: rgba(255,255,255,.48); font-size: .75rem; }
        .production-contact-success button { margin: 2rem auto 0; }
        @media (max-width: 900px) { .productions-journey { grid-template-columns: 1fr; } .productions-journey-intro { position: relative; top: 0; min-height: 0; } }
        @media (max-width: 700px) { .productions-progress { display: none; } .productions-hero { padding: 4.5rem 1.5rem 0; } .productions-hero h1 { font-size: 2rem; letter-spacing: .12em; white-space: nowrap; } .productions-reel { width: calc(100% + 3rem); aspect-ratio: 1.38 / 1; margin-inline: -1.5rem; } .productions-statement { min-height: 700px; padding-inline: 1.5rem; } .productions-statement-copy { padding: 2.5rem 1.4rem; border-radius: 2rem; } .productions-statement-orbit { width: min(92vw, 560px); } .productions-journey { padding-inline: 1.5rem; } .productions-journey-intro { padding: 2rem 1.5rem; border-radius: 2rem; } .productions-process-step { grid-template-columns: 92px 1fr; min-height: 300px; padding: 2.25rem 1.25rem; border-radius: 2rem; } .productions-process-visual { width: 76px; height: 88px; } .process-glyph { width: 54px; height: 54px; } .process-glyph-3 { width: 62px; height: 42px; } .productions-services { padding-inline: 1.5rem; } .productions-services-heading { display: block; } .productions-services-heading > p { margin-top: 1.4rem; } .productions-services-heading h2 { margin-top: 1rem; } .productions-grid { grid-template-columns: 1fr; } .productions-card { min-height: 0; padding: 1.5rem; border-radius: 2rem; } .productions-card > a { position: relative; right: auto; bottom: auto; left: auto; margin-top: 2rem; } .productions-closing { padding-inline: 1.5rem; } }
        @media (max-width: 700px) { .productions-statement { min-height: 760px; } .productions-statement-copy { padding: 3.5rem 1.4rem; border-radius: 0; } .productions-statement-copy::before { width: min(94vw, 580px); } .productions-statement-copy::after { width: min(78vw, 480px); } }
        @media (max-width: 600px), (max-height: 600px) { .production-contact-panel { overflow: auto; } }
        @media (max-width: 480px) { .productions-hero h1 { width: 85%; padding: 0; font-size: 1.5rem; letter-spacing: .07em; } }
        @media (prefers-reduced-motion: reduce) { [data-production-reveal] { opacity: .18; filter: none; transform: translate3d(0,12px,0); transition: opacity .35s ease, transform .35s ease; } [data-production-reveal].is-visible { opacity: 1; transform: translate3d(0,0,0); } [data-production-text] { opacity: .18; filter: none; transform: none; transition: opacity .3s ease; } [data-production-text].is-text-active { opacity: 1; } .productions-statement-orbit { transform: translate(-50%,-50%); } .productions-statement-orbit i { animation: none; } }
      `}</style>
    </>
  );
}
