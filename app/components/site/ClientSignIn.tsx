'use client';
import { FormEvent, useState } from 'react';
import { clientAuth, ClientAuthError, ClientSession } from '../../utils/clientAuth';
import styles from './ClientSpace.module.css';

export default function ClientSignIn({ fr, invitation, onActivated, onSignedIn }: {
  fr: boolean; invitation: string; onActivated: () => void; onSignedIn: (user: NonNullable<ClientSession['user']>) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [activated, setActivated] = useState(false);
  const [username, setUsername] = useState('');
  const [recovery, setRecovery] = useState(false);
  const [recoveryBusy, setRecoveryBusy] = useState(false);
  const [recoverySent, setRecoverySent] = useState(false);
  const [recoveryError, setRecoveryError] = useState(false);
  const messages: Record<string, string> = {
    service_unavailable: fr ? 'La connexion est momentanément indisponible. Veuillez réessayer plus tard.' : 'Sign-in is currently unavailable. Please try again later.',
    invalid_credentials: fr ? 'Identifiant ou mot de passe incorrect.' : 'The username or password is incorrect.',
    rate_limited: fr ? 'Trop de tentatives. Veuillez réessayer dans 15 minutes.' : 'Too many attempts. Please try again in 15 minutes.',
    invalid_invitation: fr ? 'Cette invitation est expirée ou indisponible. Contactez le studio.' : 'This invitation has expired or is unavailable. Please contact the studio.',
    password_length: fr ? 'Choisissez un mot de passe de 15 à 128 caractères.' : 'Choose a password of 15–128 characters.',
    request_rejected: fr ? 'Veuillez réessayer pour ouvrir une nouvelle session.' : 'Please try again to start a new session.',
  };
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const form = event.currentTarget;
    const values = new FormData(form);
    setBusy(true); setMessage(''); setActivated(false);
    try {
      const request = { action: invitation ? 'activate' : 'login', username: String(values.get('username') || ''), password: String(values.get('password') || ''), ...(invitation ? { token: invitation } : {}) };
      // Safari can apply a newly issued HttpOnly cookie just after the first POST.
      // Refresh and retry once when the server detects that harmless session race.
      let session = await clientAuth();
      let result: ClientSession;
      try {
        result = await clientAuth(request, session.csrf);
      } catch (error) {
        if (!(error instanceof ClientAuthError) || error.code !== 'request_rejected') throw error;
        await new Promise(resolve => window.setTimeout(resolve, 120));
        session = await clientAuth();
        result = await clientAuth(request, session.csrf);
      }
      if (invitation && result.activated === true) { form.reset(); setActivated(true); onActivated(); }
      else if (result.user && typeof result.user.id === 'string') { form.reset(); onSignedIn(result.user); }
      else throw new ClientAuthError('service_unavailable');
    } catch (error) { setMessage(error instanceof ClientAuthError ? error.code : 'service_unavailable'); }
    finally { setBusy(false); }
  }
  async function requestAssistance(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (recoveryBusy) return;
    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.append('request_type', 'Client access assistance');
    formData.append('_subject', `Client access assistance — ${String(formData.get('username') || 'unknown account')}`);
    formData.append('page', 'https://studiosanch.com/client/');
    const email = String(formData.get('email') || '');
    if (email) formData.append('_replyto', email);
    setRecoveryBusy(true); setRecoveryError(false);
    try {
      const response = await fetch('https://formspree.io/f/mrpgkojw', { method: 'POST', body: formData, headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error('request_failed');
      setRecoverySent(true);
    } catch { setRecoveryError(true); }
    finally { setRecoveryBusy(false); }
  }
  if (recovery) return <form className={`${styles.signIn} ${styles.recoveryForm}`} onSubmit={requestAssistance} aria-describedby="recovery-status" aria-busy={recoveryBusy}>
    {recoverySent ? <>
      <p id="recovery-status" className={styles.recoveryConfirmation} role="status">
        <strong>{fr ? 'Votre demande a bien été reçue.' : 'Your request has been received.'}</strong>
        <br />
        {fr ? 'Le studio vous contactera prochainement.' : 'The studio will contact you shortly.'}
      </p>
      <button type="button" onClick={() => { setRecovery(false); setRecoverySent(false); }}>{fr ? 'Retour à la connexion' : 'Return to sign in'}</button>
    </> : <>
      <p className={styles.recoveryTitle}>{fr ? 'Assistance accès client' : 'Client access assistance'}</p>
      <label className={styles.usernameLabel} htmlFor="recovery-name">{fr ? 'Nom complet' : 'Full name'}</label>
      <input id="recovery-name" name="name" type="text" autoComplete="name" required maxLength={150} disabled={recoveryBusy} placeholder={fr ? 'Nom complet' : 'Full name'} />
      <label className={styles.usernameLabel} htmlFor="recovery-email">{fr ? 'Adresse e-mail' : 'Email address'}</label>
      <input id="recovery-email" name="email" type="email" autoComplete="email" required maxLength={254} disabled={recoveryBusy} placeholder={fr ? 'Adresse e-mail' : 'Email address'} />
      <label className={styles.usernameLabel} htmlFor="recovery-username">{fr ? 'Identifiant client' : 'Client username'}</label>
      <input id="recovery-username" name="username" type="text" autoCapitalize="none" spellCheck={false} required maxLength={64} disabled={recoveryBusy} value={username} onChange={event => setUsername(event.target.value)} placeholder={fr ? 'Identifiant client' : 'Client username'} />
      <label className={styles.usernameLabel} htmlFor="recovery-message">{fr ? 'Votre message' : 'Your message'}</label>
      <textarea id="recovery-message" name="message" rows={3} maxLength={1000} disabled={recoveryBusy} placeholder={fr ? 'Décrivez brièvement la difficulté rencontrée.' : 'Briefly describe the difficulty you encountered.'} />
      <input className={styles.honeypot} type="text" name="_gotcha" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <button type="submit" disabled={recoveryBusy}>{recoveryBusy ? (fr ? 'Envoi…' : 'Sending…') : (fr ? 'Envoyer ma demande' : 'Send my request')}</button>
      <p id="recovery-status" className={styles.signInNote} role="status">{recoveryError ? (fr ? 'La demande n’a pas pu être envoyée. Veuillez réessayer.' : 'Your request could not be sent. Please try again.') : (fr ? 'Ne communiquez jamais votre mot de passe. Le studio vérifiera votre identité avant de créer un nouveau lien.' : 'Never share your password. The studio will verify your identity before issuing a new link.')}</p>
      <button type="button" className={styles.recovery} onClick={() => { setRecovery(false); setRecoveryError(false); }}>{fr ? 'Retour à la connexion' : 'Return to sign in'}</button>
    </>}
  </form>;
  return <form className={styles.signIn} onSubmit={submit} aria-describedby="signin-status" aria-busy={busy}>
    <label className={styles.usernameLabel} htmlFor="client-username">{fr ? 'Identifiant' : 'Username'}</label>
    <input id="client-username" name="username" type="text" autoComplete="username" autoCapitalize="none" spellCheck={false} required maxLength={64} disabled={busy} value={username} onChange={event => setUsername(event.target.value)} placeholder={fr ? 'Identifiant' : 'Username'} />
    <label className={styles.usernameLabel} htmlFor="client-password">{fr ? 'Mot de passe' : 'Password'}</label>
    <input id="client-password" name="password" type="password" autoComplete={invitation ? 'new-password' : 'current-password'} required minLength={invitation ? 15 : undefined} maxLength={128} disabled={busy} placeholder={fr ? 'Mot de passe' : 'Password'} />
    <button type="submit" disabled={busy}>{busy ? (fr ? 'Un instant…' : 'One moment…') : invitation ? (fr ? 'Créer mon accès' : 'Set my password') : (fr ? 'Se connecter' : 'Sign in')}</button>
    <p id="signin-status" className={styles.signInNote} role="status">{message ? (messages[message] || messages.service_unavailable) : activated ? (fr ? 'Votre mot de passe est prêt. Vous pouvez vous connecter.' : 'Your password is ready. You can now sign in.') : invitation ? (fr ? 'Votre invitation privée. Choisissez 15 à 128 caractères.' : 'Your private invitation. Choose 15–128 characters.') : ''}</p>
    {!invitation && <button type="button" className={styles.recovery} onClick={() => { setRecovery(true); setMessage(''); }}>{fr ? 'Besoin d’aide ?' : 'Need assistance?'}</button>}
  </form>;
}
