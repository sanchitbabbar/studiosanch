'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

interface ProductCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    name: string;
    price: string;
    id: string;
  };
}

export default function ProductCheckoutModal({ isOpen, onClose, product }: ProductCheckoutModalProps) {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [submissionError, setSubmissionError] = useState(false);
  const { language } = useLanguage();
  const fr = language === 'fr';
  const isSunglassesWaitlist = product.id === 'sunglasses-black';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/20 pointer-events-none" />
      </motion.div>

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="fixed inset-0 flex items-center justify-center z-[101]"
      >
        <div className="w-full max-w-lg px-4">
          <div
            className="relative overflow-hidden bg-black/80 backdrop-blur-2xl rounded-sm w-full border border-white/5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Decorative gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-50 pointer-events-none" />

            {/* Content */}
            <div className="relative p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white/90 text-lg font-light tracking-wider">
                  {isSunglassesWaitlist ? (fr ? 'Liste privée' : 'Private Waitlist') : (fr ? 'Envoyer votre demande' : 'Place Your Request')}
                </h3>
                <button
                  onClick={onClose}
                  className="text-white/40 hover:text-white/60 transition-colors focus:outline-none focus:ring-0 ring-0 no-ring cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Product Summary */}
              <div className="rounded-lg bg-white/5 p-4 space-y-1 mb-8">
                <h4 className="text-white/90 text-base font-light tracking-wide">{product.name}</h4>
                <div className="pt-1">
                  <span className="text-white/90 text-lg font-light">{product.price}</span>
                </div>
              </div>

              {/* Form or Success */}
              {showSuccessMessage ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="py-8 flex flex-col items-center justify-center space-y-4"
                >
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                    <svg className="w-8 h-8 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="text-white/80 text-sm tracking-wide font-light">
                      {isSunglassesWaitlist ? (fr ? 'Votre demande a bien été reçue.' : 'Your request has been received.') : (fr ? 'Message envoyé avec succès.' : 'Message sent successfully.')}
                    </p>
                    <p className="text-white/50 text-xs mt-1">
                      {isSunglassesWaitlist ? (fr ? 'Nous vous contacterons dès que la prochaine édition sera disponible.' : 'We will contact you when the next edition becomes available.') : (fr ? 'Nous vous contacterons prochainement pour confirmer votre demande.' : 'We will contact you shortly to confirm your purchase.')}
                    </p>
                  </div>
                </motion.div>
              ) : (
                <form
                  action="https://formspree.io/f/mrpgkojw"
                  method="POST"
                                onSubmit={(e) => {
                                  e.preventDefault();
                                  setSubmissionError(false);
                    const form = e.target as HTMLFormElement;
                    const formData = new FormData(form);
                    formData.append('product', product.name);
                    formData.append('productPrice', product.price);
                    formData.append('_subject', isSunglassesWaitlist ? `Private Waitlist: ${product.name}` : `Purchase Inquiry: ${product.name}`);
                    const emailValue = formData.get('email');
                    if (emailValue && !formData.get('_replyto')) {
                      formData.append('_replyto', emailValue.toString());
                    }
                    fetch(form.action, {
                      method: 'POST',
                      body: formData,
                      headers: { Accept: 'application/json' },
                    })
                      .then((response) => {
                        if (!response.ok) throw new Error('Submission failed');
                        setShowSuccessMessage(true);
                        setTimeout(() => {
                          onClose();
                          setTimeout(() => setShowSuccessMessage(false), 500);
                        }, 5000);
                      })
                      .catch(() => setSubmissionError(true));
                  }}
                  className="space-y-4"
                >
                  <div className="space-y-6">
                    <div className="relative">
                      <div className="flex flex-col border-b border-white/10 px-0 py-3">
                        <span className="text-white/40 text-xs tracking-[0.2em] mb-2">{fr ? 'Nom complet' : 'Full Name'}</span>
                        <input
                          type="text"
                          name="name"
                          required
                          className="text-white/90 text-xs tracking-[0.2em] bg-transparent border-none focus:outline-none w-full resize-none mt-1 caret-white"
                        />
                      </div>
                    </div>

                    <div className="relative">
                      <div className="flex flex-col border-b border-white/10 px-0 py-3">
                        <span className="text-white/40 text-xs tracking-[0.2em] mb-2">{fr ? 'Adresse e-mail' : 'Email Address'}</span>
                        <input
                          type="email"
                          name="email"
                          required
                          className="text-white/90 text-xs tracking-[0.2em] bg-transparent border-none focus:outline-none w-full resize-none mt-1 caret-white"
                        />
                      </div>
                    </div>

                    <div className="relative">
                      <div className="flex flex-col border-b border-white/10 px-0 py-3">
                        <span className="text-white/40 text-xs tracking-[0.2em] mb-2">{fr ? 'Votre message' : 'Your Message'}</span>
                        <textarea
                          name="message"
                          required
                          rows={3}
                          defaultValue={isSunglassesWaitlist
                            ? (fr ? `Je souhaite rejoindre la liste privée pour ${product.name}.` : `I would like to join the private waitlist for ${product.name}.`)
                            : (fr ? `Je souhaite commander ${product.name} (${product.price}).` : `I'm interested in purchasing ${product.name} (${product.price}).`)}
                          className="text-white/90 text-xs leading-relaxed tracking-[0.05em] bg-transparent border-none focus:outline-none w-full resize-none mt-1"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full px-4 py-1.5 relative group bg-transparent text-white/80 hover:text-white font-extralight text-[10px] tracking-[0.25em] uppercase transition-all duration-300 overflow-hidden focus:outline-none focus:ring-0 ring-0 hover:ring-0 no-ring"
                      style={{ outline: 'none !important', boxShadow: 'none !important' }}
                    >
                      <span className="relative z-10">
                        {isSunglassesWaitlist ? (fr ? 'REJOINDRE LA LISTE' : 'JOIN THE WAITLIST') : (fr ? 'ENVOYER' : 'SEND')}
                      </span>
                      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-transparent" />
                      <div
                        className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{ animation: 'productCheckoutGradientSlide 2s linear infinite' }}
                      />
                      <style jsx>{`
                        @keyframes productCheckoutGradientSlide {
                          0% { transform: translateX(-100%); }
                          100% { transform: translateX(100%); }
                        }
                      `}</style>
                    </button>
                  </div>
                </form>
              )}

              {submissionError && <p role="status" className="text-[10px] text-center text-red-300/80 mt-4">{fr ? 'Votre demande n’a pas pu être envoyée. Contactez contact@studiosanch.com.' : 'Your request could not be sent. Please contact contact@studiosanch.com.'}</p>}

              {isSunglassesWaitlist ? (
                <p className="text-[9px] italic text-white/30 text-center mt-6">
                  {fr ? 'Aucun paiement n’est requis. Nous vous contacterons exclusivement au sujet de la disponibilité de cette pièce.' : 'No payment is required. We will contact you exclusively regarding the availability of this piece.'}
                </p>
              ) : (
                <>
                  <p className="text-[9px] italic text-white/30 text-center mt-6">
                    {fr ? 'Les expéditions en France et à l’étranger entraînent des frais de livraison supplémentaires selon les tarifs FedEx en vigueur.' : 'Shipments within and outside France will incur additional delivery charges based on current FedEx rates.'}
                  </p>
                  <p className="text-[9px] italic text-white/30 text-center mt-2">
                    {product.id === 'artbook-main'
                      ? fr
                        ? "En validant cette commande, vous reconnaissez que cet article est personnalisé selon vos spécifications, et vous renoncez à votre droit de rétractation conformément à l'article L.221-28 du Code de la consommation."
                        : 'By placing this order, you acknowledge that this item is personalized to your specifications, and you waive your right of withdrawal pursuant to Article L.221-28 of the French Consumer Code.'
                      : product.id === 'sanch-suede'
                        ? fr
                          ? "Sac de luxe : Pièce sur mesure fabriquée exclusivement sur commande selon les spécifications du client. Conformément à l'article L.221-28 du Code de la consommation, ce bien confectionné sur mesure est exclu du droit de rétractation, d'échange ou de remboursement une fois la production commencée."
                          : "Luxury designer bag: Custom-made piece manufactured exclusively per order to the client's specifications. Pursuant to Article L.221-28 of the French Consumer Code, this custom-manufactured good is excluded from the right of withdrawal, exchange, or refund once production has started."
                      : fr
                        ? 'Les œuvres, services artistiques et créations personnalisées étant uniques, aucun remboursement ni échange ne sera possible.'
                        : 'As artworks, artistic services, and personalized creations are unique, no refunds or exchanges will be possible.'}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
