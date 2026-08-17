'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

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
                <h3 className="text-white/90 text-lg font-light tracking-wider">Place Your Request</h3>
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
                    <p className="text-white/80 text-sm tracking-wide font-light">Message sent successfully.</p>
                    <p className="text-white/50 text-xs mt-1">We will contact you shortly to confirm your purchase.</p>
                  </div>
                </motion.div>
              ) : (
                <form
                  action="https://formspree.io/f/mdkzyqaq"
                  method="POST"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.target as HTMLFormElement;
                    const formData = new FormData(form);
                    formData.append('product', product.name);
                    formData.append('productPrice', product.price);
                    formData.append('_subject', `Purchase Inquiry: ${product.name}`);
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
                        if (response.ok) {
                          setShowSuccessMessage(true);
                          setTimeout(() => {
                            onClose();
                            setTimeout(() => setShowSuccessMessage(false), 500);
                          }, 5000);
                        }
                      })
                      .catch(() => {
                        setShowSuccessMessage(true);
                      });
                  }}
                  className="space-y-4"
                >
                  <div className="space-y-6">
                    <div className="relative">
                      <div className="flex flex-col border-b border-white/10 px-0 py-3">
                        <span className="text-white/40 text-xs tracking-[0.2em] mb-2">Full Name</span>
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
                        <span className="text-white/40 text-xs tracking-[0.2em] mb-2">Email Address</span>
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
                        <span className="text-white/40 text-xs tracking-[0.2em] mb-2">Your Message</span>
                        <textarea
                          name="message"
                          required
                          rows={3}
                          defaultValue={`I'm interested in purchasing ${product.name} (${product.price}).`}
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
                      <span className="relative z-10">SEND</span>
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

              <p className="text-[9px] italic text-white/30 text-center mt-6">
                Shipments within and outside France will incur additional delivery charges based on current FedEx rates.
              </p>
              <p className="text-[9px] italic text-white/30 text-center mt-2">
                As artworks, artistic services, and personalized creations are unique, no refunds or exchanges will be possible.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
