'use client';

import { FormEvent, useState } from 'react';

export default function AuctionInterestForm({ language }: { language: string }) {
  const french = language === 'fr';
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === 'sending') return;
    const form = event.currentTarget;
    const data = new FormData(form);
    data.set('artwork', 'Celle qui se connaît — original artwork');
    data.set('request_type', 'Interest in attending the upcoming auction');
    data.set('_subject', 'Auction attendance interest: Celle qui se connaît — Original');
    data.set('_replyto', String(data.get('email') || ''));
    data.set('language', language);
    setStatus('sending');
    try {
      const response = await fetch(form.action, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error('Submission failed');
      setStatus('sent');
    } catch { setStatus('error'); }
  }
  return (
    <div className="w-full max-w-md mx-auto text-left">
      <p className="text-white/40 text-[10px] tracking-[0.2em] uppercase text-center mb-3">{french ? 'Vente aux enchères à venir · Œuvre originale' : 'Upcoming auction · Original artwork'}</p>
      <h2 className="text-white/80 text-sm font-light text-center mb-7">Celle qui se connaît</h2>
      {status === 'sent' ? (
        <div role="status" className="py-6 text-center space-y-2">
          <p className="text-white/80 text-sm tracking-wide font-light">{french ? 'Votre message a bien été envoyé.' : 'Message sent successfully.'}</p>
          <p className="text-white/50 text-xs">{french ? 'Nous vous recontacterons au sujet de la prochaine vente aux enchères.' : 'We will be in touch about the upcoming auction.'}</p>
        </div>
      ) : (
        <form action="https://formspree.io/f/mrpgkojw" method="POST" onSubmit={submit} className="space-y-4">
          <div className="space-y-5">
            <label className="flex flex-col border-b border-white/10 px-0 py-3">
              <span className="text-white/40 text-xs tracking-[0.2em] mb-2">{french ? 'Nom Complet' : 'Full Name'}</span>
              <input type="text" name="name" autoComplete="name" required className="text-white/90 text-xs tracking-[0.2em] bg-transparent border-none focus:outline-none w-full mt-1 caret-white" />
            </label>
            <label className="flex flex-col border-b border-white/10 px-0 py-3">
              <span className="text-white/40 text-xs tracking-[0.2em] mb-2">{french ? 'Adresse Email' : 'Email Address'}</span>
              <input type="email" name="email" autoComplete="email" required className="text-white/90 text-xs tracking-[0.2em] bg-transparent border-none focus:outline-none w-full mt-1 caret-white" />
            </label>
            <label className="flex flex-col border-b border-white/10 px-0 py-3">
              <span className="text-white/40 text-xs tracking-[0.2em] mb-2">{french ? 'Votre Message' : 'Your Message'}</span>
              <textarea name="message" required rows={3} defaultValue={french ? 'Je souhaite manifester mon intérêt pour assister à la prochaine vente aux enchères de l’œuvre originale « Celle qui se connaît ».' : 'I would like to express my interest in attending the upcoming auction of the original artwork “Celle qui se connaît”.'} className="text-white/90 text-xs leading-relaxed tracking-[0.05em] bg-transparent border-none focus:outline-none w-full resize-none mt-1" />
            </label>
          </div>
          <button type="submit" disabled={status === 'sending'} className="w-full px-4 py-1.5 bg-transparent text-white/80 hover:text-white font-extralight text-[10px] tracking-[0.25em] uppercase transition-all duration-300 disabled:opacity-40">
            {status === 'sending' ? (french ? 'Envoi…' : 'Sending…') : (french ? 'ENVOYER MA DEMANDE' : 'PLACE YOUR REQUEST')}
          </button>
          {status === 'error' && <p role="alert" className="text-[10px] text-center text-red-300/80">{french ? 'Votre demande n’a pas pu être envoyée. Veuillez réessayer.' : 'Your request could not be sent. Please try again.'}</p>}
        </form>
      )}
    </div>
  );
}
