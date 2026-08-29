'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import styles from './ClientSpace.module.css';
import ClientSignIn from './ClientSignIn';
import { clientAuth } from '../../utils/clientAuth';

const disciplines = [
  { en: 'Film', fr: 'Film', detail: 'Direction · Movement · Emotion', detailFr: 'Réalisation · Mouvement · Émotion' },
  { en: 'Photoshoot', fr: 'Séance photo', detail: 'Portrait · Fashion · Editorial', detailFr: 'Portrait · Mode · Éditorial' },
  { en: 'Exhibition', fr: 'Exposition', detail: 'Art · Space · Dialogue', detailFr: 'Art · Espace · Dialogue' },
  { en: 'Art installation', fr: 'Installation artistique', detail: 'Form · Presence · Experience', detailFr: 'Forme · Présence · Expérience' },
];

export default function ClientSpace() {
  const { language, setLanguage } = useLanguage();
  const fr = language === 'fr';
  const [step, setStep] = useState<'language' | 'signin' | 'project' | 'brief'>('language');
  const [selected, setSelected] = useState(0);
  const [invitation, setInvitation] = useState('');
  const [logoutError, setLogoutError] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  useEffect(() => {
    const token = new URLSearchParams(window.location.hash.slice(1)).get('invite');
    if (token && /^[a-f0-9]{64}$/.test(token)) {
      setInvitation(token);
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  }, []);
  async function signOut() {
    if (signingOut) return;
    setSigningOut(true);
    try {
      const session = await clientAuth();
      await clientAuth({ action: 'logout' }, session.csrf);
      setDraft({ name: '', email: '', organisation: '', location: '', timing: '', vision: '' });
      setPrepared(false); setStep('signin'); setLogoutError(false);
    } catch { setLogoutError(true); }
    finally { setSigningOut(false); }
  }
  const [draft, setDraft] = useState({ name: '', email: '', organisation: '', location: '', timing: '', vision: '' });
  const [prepared, setPrepared] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    heading.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [step]);
  const chooseLanguage = (value: 'en' | 'fr') => { setLanguage(value); setStep('signin'); };
  const project = disciplines[selected];
  const brief = [fr ? 'Nouveau projet — Studio Sanch' : 'New project — Studio Sanch', '', `${fr ? 'Projet' : 'Project'}: ${fr ? project.fr : project.en}`, `${fr ? 'Nom' : 'Name'}: ${draft.name}`, `Email: ${draft.email}`, `${fr ? 'Organisation' : 'Organisation'}: ${draft.organisation}`, `${fr ? 'Lieu' : 'Location'}: ${draft.location}`, `${fr ? 'Calendrier' : 'Timing'}: ${draft.timing}`, '', draft.vision].join('\n');
  function prepareEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const subject = `${fr ? 'Projet' : 'Project'} ${fr ? project.fr : project.en} — ${draft.name}`;
    window.location.href = `mailto:contact@studiosanch.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(brief)}`;
    setPrepared(true);
  }
  function downloadBrief() {
    const url = URL.createObjectURL(new Blob([brief], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url; link.download = 'studio-sanch-project-brief.txt'; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <main className={styles.space} lang={step === 'language' ? undefined : language}>
      <div className={styles.topline}>
        {(step === 'project' || step === 'brief') && <button onClick={signOut} disabled={signingOut}>{fr ? 'Se déconnecter' : 'Sign out'}</button>}
        {logoutError && <span role="status">{fr ? 'Déconnexion indisponible. Réessayez.' : 'Sign-out unavailable. Please retry.'}</span>}
      </div>
      {step === 'language' ? (
        <section className={styles.welcome} aria-labelledby="client-title">
          <div className={styles.atmosphere} aria-hidden="true" />
          <div className={styles.welcomeContent}>
            <h1 id="client-title" className={styles.visuallyHidden} ref={heading} tabIndex={-1}>Choose your language / Choisissez votre langue</h1>
            <div className={styles.languages}>
              <button onClick={() => chooseLanguage('en')} lang="en">English</button>
              <button onClick={() => chooseLanguage('fr')} lang="fr">Français</button>
            </div>
          </div>
        </section>
      ) : step === 'signin' ? (
        <section className={styles.welcome} aria-labelledby="client-title">
          <div className={styles.atmosphere} aria-hidden="true" />
          <div className={styles.welcomeContent}>
            <h1 id="client-title" className={styles.visuallyHidden} ref={heading} tabIndex={-1}>{fr ? 'Connexion' : 'Sign in'}</h1>
            <ClientSignIn fr={fr} invitation={invitation} onActivated={() => setInvitation('')} onSignedIn={() => setStep('project')} />
            <button className={styles.signInBack} onClick={() => setStep('language')}>{fr ? 'Langue' : 'Language'}</button>
          </div>
        </section>
      ) : step === 'project' ? (
        <section className={styles.content} aria-labelledby="client-title">
          <div className={styles.intro}>
            <h1 id="client-title" ref={heading} tabIndex={-1}>{fr ? 'Tout commence' : 'It begins'}<br /><span>{fr ? 'par une idée.' : 'with an idea.'}</span></h1>
            <p>{fr ? <>Certaines créations naissent d’une vision.<br />D’autres, d’une sensation.<br /><strong>Par où commencer ?</strong></> : <>Some creations begin with a vision.<br />Others, with a sensation.<br /><strong>Where shall we begin?</strong></>}</p>
          </div>
          <div className={styles.projects} aria-label={fr ? 'Choisissez une forme de projet' : 'Choose a project form'}>{disciplines.map((item, index) => <button key={item.en} className={styles.project} onClick={() => { setSelected(index); setPrepared(false); setStep('brief'); }}>
            <span className={styles.projectNumber}>0{index + 1}</span>
            <span className={styles.projectName}>{fr ? item.fr : item.en}</span>
            <span className={styles.projectDetail}>{fr ? item.detailFr : item.detail}</span>
            <span className={styles.projectArrow} aria-hidden="true">↗</span>
          </button>)}</div>
          <button className={styles.back} onClick={() => setStep('language')}>← {fr ? 'Choisir une langue' : 'Choose a language'}</button>
        </section>
      ) : (
        <section className={`${styles.content} ${styles.brief}`} aria-labelledby="client-title">
          <div><button className={styles.back} onClick={() => setStep('project')}>← {fr ? 'Votre projet' : 'Your project'}</button><p className={styles.eyebrow}>02 / {fr ? project.fr.toUpperCase() : project.en.toUpperCase()}</p><h1 id="client-title" ref={heading} tabIndex={-1}>{fr ? 'Votre vision,' : 'Your vision,'}<br /><span>{fr ? 'en quelques mots.' : 'in your words.'}</span></h1><p className={styles.briefIntro}>{fr ? 'Partagez les premières lignes de votre projet. Les détails se dessineront ensemble.' : 'Share the first thoughts behind your project. We will shape the details together.'}</p><p className={styles.discretion}>{fr ? 'UNE CONVERSATION AVANT TOUT.' : 'A CONVERSATION, FIRST.'}</p></div>
          <form onSubmit={prepareEmail} className={styles.form}>
            <p className={styles.formNote}>{fr ? '* Champs requis' : '* Required fields'}</p>
            <div className={styles.fields}>{([
              ['name', fr ? 'Votre nom' : 'Your name', 'name'], ['email', fr ? 'Votre adresse e-mail' : 'Your email', 'email'], ['organisation', fr ? 'Maison / organisation' : 'House / organisation', 'organization'], ['location', fr ? 'Lieu envisagé' : 'Envisaged location', 'off'], ['timing', fr ? 'Calendrier envisagé' : 'Envisaged timing', 'off'],
            ] as const).map(([key, label, autocomplete]) => <label key={key}>{label}{(key === 'name' || key === 'email') && ' *'}<input name={key} type={key === 'email' ? 'email' : 'text'} autoComplete={autocomplete} required={key === 'name' || key === 'email'} maxLength={150} value={draft[key]} onChange={e => { setPrepared(false); setDraft({ ...draft, [key]: e.target.value }); }} /></label>)}</div>
            <label>{fr ? 'Racontez-nous votre idée' : 'Tell us about your idea'} *<textarea name="vision" required maxLength={1500} rows={4} value={draft.vision} onChange={e => { setPrepared(false); setDraft({ ...draft, vision: e.target.value }); }} placeholder={fr ? 'Une atmosphère, une histoire, une ambition…' : 'An atmosphere, a story, an ambition…'} /></label>
            <p className={styles.formNote}>{fr ? 'Votre messagerie s’ouvrira avec votre brief. Rien n’est envoyé ni enregistré sur ce site.' : 'Your email app will open with your brief. Nothing is sent or saved on this site.'}</p>
            <button type="submit" className={styles.submit}>{fr ? 'Préparer notre échange' : 'Begin our conversation'} <span aria-hidden="true">↗</span></button>
            {prepared && <div className={styles.status} role="status"><p>{fr ? 'Votre brief est prêt. Envoyez-le depuis votre messagerie à contact@studiosanch.com. Si elle ne s’est pas ouverte, téléchargez votre brief.' : 'Your brief is ready. Send it from your email app to contact@studiosanch.com. If it did not open, download your brief.'}</p><button type="button" className={styles.back} onClick={downloadBrief}>{fr ? 'Télécharger le brief' : 'Download your brief'} ↓</button></div>}
          </form>
        </section>
      )}
      <footer className={styles.footer}><span>STUDIO SANCH</span><span>PARIS, FRANCE</span></footer>
    </main>
  );
}
