'use client';
import { FormEvent, useState } from 'react';
import { clientAuth, ClientAuthError } from '../../utils/clientAuth';
import styles from './ClientSpace.module.css';

export default function ClientSignIn({ fr, invitation, onActivated, onSignedIn }: {
  fr: boolean; invitation: string; onActivated: () => void; onSignedIn: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [activated, setActivated] = useState(false);
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
      // Get a fresh server-generated CSRF token before sending any credentials.
      const session = await clientAuth();
      const result = await clientAuth({ action: invitation ? 'activate' : 'login', username: String(values.get('username') || ''), password: String(values.get('password') || ''), ...(invitation ? { token: invitation } : {}) }, session.csrf);
      if (invitation && result.activated === true) { form.reset(); setActivated(true); onActivated(); }
      else if (result.user && typeof result.user.id === 'string') { form.reset(); onSignedIn(); }
      else throw new ClientAuthError('service_unavailable');
    } catch (error) { setMessage(error instanceof ClientAuthError ? error.code : 'service_unavailable'); }
    finally { setBusy(false); }
  }
  return <form className={styles.signIn} onSubmit={submit} aria-describedby="signin-status" aria-busy={busy}>
    <label className={styles.usernameLabel} htmlFor="client-username">{fr ? 'Identifiant' : 'Username'}</label>
    <input id="client-username" name="username" type="text" autoComplete="username" autoCapitalize="none" spellCheck={false} required maxLength={64} disabled={busy} placeholder={fr ? 'Identifiant' : 'Username'} />
    <label className={styles.usernameLabel} htmlFor="client-password">{fr ? 'Mot de passe' : 'Password'}</label>
    <input id="client-password" name="password" type="password" autoComplete={invitation ? 'new-password' : 'current-password'} required minLength={invitation ? 15 : undefined} maxLength={128} disabled={busy} placeholder={fr ? 'Mot de passe' : 'Password'} />
    <button type="submit" disabled={busy}>{busy ? (fr ? 'Un instant…' : 'One moment…') : invitation ? (fr ? 'Créer mon accès' : 'Set my password') : (fr ? 'Se connecter' : 'Sign in')}</button>
    <p id="signin-status" className={styles.signInNote} role="status">{message ? (messages[message] || messages.service_unavailable) : activated ? (fr ? 'Votre mot de passe est prêt. Vous pouvez vous connecter.' : 'Your password is ready. You can now sign in.') : invitation ? (fr ? 'Votre invitation privée. Choisissez 15 à 128 caractères.' : 'Your private invitation. Choose 15–128 characters.') : ''}</p>
    {!invitation && <a className={styles.recovery} href="mailto:contact@studiosanch.com">{fr ? 'Besoin d’aide ?' : 'Need assistance?'}</a>}
  </form>;
}
