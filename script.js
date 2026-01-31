// Smooth scroll pour les ancres
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Gestion du formulaire newsletter
function handleSubmit(event) {
    event.preventDefault();
    const email = event.target.email.value;
    
    // Animation de succès
    const form = event.target;
    const button = form.querySelector('button');
    const originalText = button.textContent;
    
    button.textContent = 'Inscription en cours...';
    button.disabled = true;
    
    setTimeout(() => {
        button.textContent = '✓ Inscrit !';
        button.style.background = '#4CAF50';
        
        setTimeout(() => {
            alert('Merci ! Vous recevrez nos offres exclusives à ' + email);
            form.reset();
            button.textContent = originalText;
            button.disabled = false;
            button.style.background = '';
        }, 1500);
    }, 1000);
}

// Animation au scroll pour les éléments
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observer les cartes au chargement
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.feature-card, .testimonial-card, .pricing-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });
});

// Changement d'image au survol des mini-previews
document.addEventListener('DOMContentLoaded', () => {
    const miniPreviews = document.querySelectorAll('.mini-preview');
    
    miniPreviews.forEach(preview => {
        preview.addEventListener('click', function() {
            const card = this.closest('.feature-card');
            const mainImage = card.querySelector('.feature-img');
            const tempSrc = mainImage.src;
            
            mainImage.style.opacity = '0';
            setTimeout(() => {
                mainImage.src = this.src;
                mainImage.style.opacity = '1';
            }, 200);
        });
    });
});