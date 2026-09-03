(() => {
  const trigger = document.querySelector('[data-purchase-inquiry]');
  if (!trigger) return;

  const productName = trigger.dataset.productName || 'Private Collection Consultation';
  const productPrice = trigger.dataset.productPrice || '';

  const modal = document.createElement('div');
  modal.className = 'purchase-inquiry-modal';
  modal.setAttribute('aria-hidden', 'true');
  modal.innerHTML = `
    <div class="purchase-inquiry-backdrop"></div>
    <div class="purchase-inquiry-stage" role="dialog" aria-modal="true" aria-labelledby="purchase-inquiry-title">
      <div class="purchase-inquiry-card">
        <div class="purchase-inquiry-glow"></div>
        <div class="purchase-inquiry-content">
          <div class="purchase-inquiry-heading">
            <h3 id="purchase-inquiry-title">Place Your Request</h3>
            <button type="button" class="purchase-inquiry-close" aria-label="Close">×</button>
          </div>
          <div class="purchase-inquiry-summary">
            <h4></h4>
            <span></span>
          </div>
          <form class="purchase-inquiry-form" action="https://formspree.io/f/mrpgkojw" method="POST">
            <label>Full Name<input type="text" name="name" required></label>
            <label>Email Address<input type="email" name="email" required></label>
            <label>Your Message<textarea name="message" rows="3" required></textarea></label>
            <button type="submit">SEND</button>
            <p class="purchase-inquiry-error" role="status" hidden>Your request could not be sent. Please contact contact@studiosanch.com.</p>
          </form>
          <div class="purchase-inquiry-success" hidden>
            <div class="purchase-inquiry-check">✓</div>
            <p>Message sent successfully.</p>
            <small>We will contact you shortly.</small>
          </div>
          <p class="purchase-inquiry-note">Private Collection pieces are presented by consultation with the atelier. Delivery details will be confirmed with your request.</p>
          <p class="purchase-inquiry-note">As artistic services and personalized creations are unique, no refunds or exchanges will be possible.</p>
        </div>
      </div>
    </div>`;
  document.body.appendChild(modal);

  const summaryTitle = modal.querySelector('.purchase-inquiry-summary h4');
  const summaryPrice = modal.querySelector('.purchase-inquiry-summary span');
  const form = modal.querySelector('.purchase-inquiry-form');
  const message = form.querySelector('textarea');
  const success = modal.querySelector('.purchase-inquiry-success');
  const error = modal.querySelector('.purchase-inquiry-error');
  summaryTitle.textContent = productName;
  summaryPrice.textContent = productPrice;
  summaryPrice.hidden = !productPrice;
  message.value = `I would like to enquire about the SANCH Private Collection.`;

  const close = () => {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };
  const open = () => {
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    form.querySelector('input[name="name"]').focus();
  };

  trigger.addEventListener('click', (event) => {
    event.preventDefault();
    open();
  });
  modal.querySelector('.purchase-inquiry-close').addEventListener('click', close);
  modal.querySelector('.purchase-inquiry-backdrop').addEventListener('click', close);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('is-open')) close();
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    error.hidden = true;
    const data = new FormData(form);
    data.append('product', productName);
    if (productPrice) data.append('productPrice', productPrice);
    data.append('_subject', `Purchase Inquiry: ${productName}`);
    data.append('_replyto', data.get('email'));
    try {
      const response = await fetch(form.action, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error('Request failed');
    } catch {
      error.hidden = false;
      return;
    }
    form.hidden = true;
    success.hidden = false;
    setTimeout(close, 5000);
  });
})();
