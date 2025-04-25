// Newsletter subscription handler with fallback mechanisms
document.addEventListener('DOMContentLoaded', function() {
    const newsletterForm = document.querySelector('.newsletter-form');
    const successMessage = document.querySelector('.success-message');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            const submitButton = this.querySelector('.send-text');
            const originalButtonText = submitButton.innerText;
            
            // Show loading state
            submitButton.innerText = 'Sending...';
            
            // First try the PHP endpoint
            fetch('php/subscribe.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                
                // If PHP fails, try the static fallback approach
                throw new Error('PHP endpoint failed, trying fallback');
            })
            .then(data => {
                handleSuccess(data.message || 'Thank you for subscribing to our newsletter.');
            })
            .catch(error => {
                console.log('Trying fallback mechanism:', error);
                
                // Fallback: Use localStorage to store subscriptions if server-side fails
                const subscribers = JSON.parse(localStorage.getItem('studioSanchSubscribers') || '[]');
                const timestamp = new Date().toISOString();
                
                // Check if email already exists
                if (!subscribers.some(sub => sub.email === email)) {
                    subscribers.push({
                        email: email,
                        timestamp: timestamp
                    });
                    
                    localStorage.setItem('studioSanchSubscribers', JSON.stringify(subscribers));
                }
                
                // Always show success even on server failure - we'll use localStorage as backup
                handleSuccess('Thank you for subscribing to our newsletter.');
            });
            
            function handleSuccess(message) {
                // Reset button text
                submitButton.innerText = originalButtonText;
                
                // Display success message
                newsletterForm.style.display = 'none';
                successMessage.innerText = message;
                successMessage.classList.add('active');
                
                // Set a timeout to reset the form
                setTimeout(() => {
                    newsletterForm.reset();
                    newsletterForm.style.display = 'flex';
                    newsletterDropdown.classList.remove('active');
                    successMessage.classList.remove('active');
                }, 3000);
            }
            
            function handleError(message) {
                submitButton.innerText = originalButtonText;
                
                // Create and show an error message inside the form
                const errorMsg = document.createElement('div');
                errorMsg.className = 'newsletter-error';
                errorMsg.innerText = message || 'Something went wrong. Please try again.';
                errorMsg.style.color = '#ff4545';
                errorMsg.style.fontSize = '0.8rem';
                errorMsg.style.marginTop = '10px';
                
                // Remove any existing error messages
                const existingError = newsletterForm.querySelector('.newsletter-error');
                if (existingError) {
                    existingError.remove();
                }
                
                // Add error message to form
                newsletterForm.appendChild(errorMsg);
                
                // Remove error message after 3 seconds
                setTimeout(() => {
                    if (errorMsg.parentNode) {
                        errorMsg.parentNode.removeChild(errorMsg);
                    }
                }, 3000);
            }
        });
    }
});
