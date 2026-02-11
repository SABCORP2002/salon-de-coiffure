// ===== DÉFILEMENT FLUIDE =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ===== SLIDER D'IMAGES =====
document.addEventListener('DOMContentLoaded', function() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        const slider = card.querySelector('.image-slider');
        if (!slider) return;
        
        const images = slider.querySelectorAll('img');
        const dots = card.querySelectorAll('.dot');
        
        let currentIndex = 0;
        let intervalId;

        function showImage(index) {
            images.forEach(img => img.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));
            
            images[index].classList.add('active');
            dots[index].classList.add('active');
            
            currentIndex = index;
        }

        function startAutoSlide() {
            intervalId = setInterval(() => {
                let nextIndex = (currentIndex + 1) % images.length;
                showImage(nextIndex);
            }, 3000);
        }

        function stopAutoSlide() {
            clearInterval(intervalId);
        }

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                stopAutoSlide();
                showImage(index);
                startAutoSlide();
            });
        });

        card.addEventListener('mouseenter', stopAutoSlide);
        card.addEventListener('mouseleave', startAutoSlide);

        startAutoSlide();
    });

    // ===== DATE MINIMUM POUR RÉSERVATION =====
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }
});

// ===== VALIDATION ET ENVOI DU FORMULAIRE DE RÉSERVATION =====
const reservationForm = document.getElementById('reservationForm');

if (reservationForm) {
    reservationForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Récupération des données du formulaire
        const formData = {
            name: document.getElementById('name').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            email: document.getElementById('email').value.trim(),
            service: document.getElementById('service').value,
            date: document.getElementById('date').value,
            time: document.getElementById('time').value,
            message: document.getElementById('message').value.trim()
        };

        // Validation
        let isValid = true;
        
        // Validation nom
        if (formData.name.length < 3) {
            showError('name', 'Le nom doit contenir au moins 3 caractères');
            isValid = false;
        } else {
            clearError('name');
        }

        // Validation téléphone
        const phoneRegex = /^(\+237)?[6-9]\d{8}$/;
        if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
            showError('phone', 'Numéro de téléphone invalide');
            isValid = false;
        } else {
            clearError('phone');
        }

        // Validation email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            showError('email', 'Adresse e-mail invalide');
            isValid = false;
        } else {
            clearError('email');
        }

        // Validation service
        if (!formData.service) {
            showError('service', 'Veuillez sélectionner un service');
            isValid = false;
        } else {
            clearError('service');
        }

        // Validation date
        const selectedDate = new Date(formData.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
            showError('date', 'Veuillez choisir une date future');
            isValid = false;
        } else {
            clearError('date');
        }

        // Validation heure
        if (!formData.time) {
            showError('time', 'Veuillez sélectionner une heure');
            isValid = false;
        } else {
            clearError('time');
        }

        if (!isValid) return;

        // Affichage du loader
        const submitBtn = document.getElementById('submitBtn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoader = submitBtn.querySelector('.btn-loader');
        
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline-block';
        submitBtn.disabled = true;

        // Envoi de l'email
        try {
            await sendEmail(formData);
            
            // Succès
            showMessage('Réservation confirmée ! Nous vous contacterons sous peu pour confirmer votre rendez-vous.', 'success');
            reservationForm.reset();
            
        } catch (error) {
            // Erreur
            showMessage('Une erreur est survenue. Veuillez nous appeler au +237 680 065 161.', 'error');
        } finally {
            // Rétablissement du bouton
            btnText.style.display = 'inline';
            btnLoader.style.display = 'none';
            submitBtn.disabled = false;
        }
    });
}

// Fonction d'envoi d'email
async function sendEmail(formData) {
    // Construction du corps de l'email
    const emailBody = `
NOUVELLE RÉSERVATION - SULAI-BARBER

Informations du client:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Nom: ${formData.name}
Téléphone: ${formData.phone}
Email: ${formData.email}

Détails de la réservation:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Service: ${formData.service}
Date: ${formData.date}
Heure: ${formData.time}

${formData.message ? `Message particulier:\n${formData.message}` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Merci de confirmer ce rendez-vous au plus vite.
    `.trim();

    // Utilisation de FormSubmit pour l'envoi d'email
    const response = await fetch('https://formsubmit.co/ajax/sulaimanuadamubello144@gmail.com', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            subject: `Nouvelle Réservation - ${formData.name} - ${formData.date} à ${formData.time}`,
            message: emailBody,
            _template: 'box'
        })
    });

    if (!response.ok) {
        throw new Error('Erreur d\'envoi');
    }

    return response.json();
}

// Fonction pour afficher les erreurs
function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorSpan = field.parentElement.querySelector('.error-message');
    
    field.style.borderColor = '#dc3545';
    if (errorSpan) {
        errorSpan.textContent = message;
        errorSpan.style.display = 'block';
    }
}

// Fonction pour effacer les erreurs
function clearError(fieldId) {
    const field = document.getElementById(fieldId);
    const errorSpan = field.parentElement.querySelector('.error-message');
    
    field.style.borderColor = '#e0e0e0';
    if (errorSpan) {
        errorSpan.textContent = '';
        errorSpan.style.display = 'none';
    }
}

// Fonction pour afficher les messages
function showMessage(text, type) {
    const messageDiv = document.getElementById('formMessage');
    messageDiv.textContent = text;
    messageDiv.className = `form-message ${type}`;
    
    // Scroll vers le message
    messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Masquer après 10 secondes si succès
    if (type === 'success') {
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 10000);
    }
}

// ===== GALERIE AVEC LIGHTBOX =====
document.addEventListener('DOMContentLoaded', function() {

    // Liste des images de la galerie (dans l'ordre)
    const galleryImages = [
        'assets/a.jpg',
        'assets/b.jpg',
        'assets/c.jpg',
        'assets/d.jpg',
        'assets/e.jpg',
        'assets/f.jpg',
        'assets/g.jpg',
        'assets/h.jpg'
    ];

    let currentLightboxIndex = 0;

    const lightbox      = document.getElementById('lightbox');
    const lightboxImg   = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev  = document.getElementById('lightboxPrev');
    const lightboxNext  = document.getElementById('lightboxNext');
    const lightboxCounter = document.getElementById('lightboxCounter');

    // Ouvre la lightbox au clic sur une image
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', function() {
            currentLightboxIndex = parseInt(this.getAttribute('data-index'));
            openLightbox(currentLightboxIndex);
        });
    });

    // Affiche l'image dans la lightbox
    function openLightbox(index) {
        lightboxImg.src = galleryImages[index];
        lightboxCounter.textContent = (index + 1) + ' / ' + galleryImages.length;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Bloque le scroll
    }

    // Ferme la lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        lightboxImg.src = '';
    }

    // Bouton fermer
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    // Ferme si on clique à côté de l'image
    lightbox && lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Image suivante
    function showNext() {
        currentLightboxIndex = (currentLightboxIndex + 1) % galleryImages.length;
        openLightbox(currentLightboxIndex);
    }

    // Image précédente
    function showPrev() {
        currentLightboxIndex = (currentLightboxIndex - 1 + galleryImages.length) % galleryImages.length;
        openLightbox(currentLightboxIndex);
    }

    if (lightboxNext) lightboxNext.addEventListener('click', showNext);
    if (lightboxPrev) lightboxPrev.addEventListener('click', showPrev);

    // Navigation clavier (flèches + Echap)
    document.addEventListener('keydown', function(e) {
        if (!lightbox || !lightbox.classList.contains('active')) return;
        if (e.key === 'ArrowRight') showNext();
        if (e.key === 'ArrowLeft')  showPrev();
        if (e.key === 'Escape')     closeLightbox();
    });
});


// ===== FORMULAIRE D'AVIS CLIENT =====
document.addEventListener('DOMContentLoaded', function() {

    // Gestion des étoiles cliquables
    const stars = document.querySelectorAll('.star');
    const ratingInput = document.getElementById('reviewRating');

    if (stars.length > 0) {
        // Survol des étoiles
        stars.forEach(star => {
            star.addEventListener('mouseenter', function() {
                const value = parseInt(this.getAttribute('data-value'));
                highlightStars(value);
            });
        });

        // Quand la souris quitte la zone des étoiles
        const starRating = document.querySelector('.star-rating');
        if (starRating) {
            starRating.addEventListener('mouseleave', function() {
                const selected = parseInt(ratingInput.value);
                if (selected > 0) {
                    highlightStars(selected);
                } else {
                    resetStars();
                }
            });
        }

        // Clic sur une étoile pour valider la note
        stars.forEach(star => {
            star.addEventListener('click', function() {
                const value = parseInt(this.getAttribute('data-value'));
                ratingInput.value = value;
                highlightStars(value);
                // Marque les étoiles comme sélectionnées
                stars.forEach((s, i) => {
                    if (i < value) s.classList.add('active');
                    else s.classList.remove('active');
                });
            });
        });
    }

    // Allume les étoiles jusqu'à la valeur donnée
    function highlightStars(value) {
        stars.forEach((s, i) => {
            if (i < value) s.classList.add('hover');
            else s.classList.remove('hover');
        });
    }

    // Éteint toutes les étoiles
    function resetStars() {
        stars.forEach(s => s.classList.remove('hover'));
    }

    // Soumission du formulaire d'avis
    const reviewForm = document.getElementById('reviewForm');
    if (reviewForm) {
        reviewForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const name    = document.getElementById('reviewName').value.trim();
            const rating  = parseInt(document.getElementById('reviewRating').value);
            const service = document.getElementById('reviewService').value;
            const comment = document.getElementById('reviewComment').value.trim();
            const msgDiv  = document.getElementById('reviewMessage');

            let isValid = true;

            // Validation nom
            if (name.length < 2) {
                showReviewError('reviewName', 'Veuillez entrer votre nom');
                isValid = false;
            } else {
                clearReviewError('reviewName');
            }

            // Validation note
            if (rating === 0) {
                const ratingError = document.getElementById('ratingError');
                if (ratingError) {
                    ratingError.textContent = 'Veuillez sélectionner une note';
                    ratingError.style.display = 'block';
                }
                isValid = false;
            } else {
                const ratingError = document.getElementById('ratingError');
                if (ratingError) {
                    ratingError.textContent = '';
                    ratingError.style.display = 'none';
                }
            }

            // Validation commentaire
            if (comment.length < 10) {
                showReviewError('reviewComment', 'Le commentaire doit faire au moins 10 caractères');
                isValid = false;
            } else {
                clearReviewError('reviewComment');
            }

            if (!isValid) return;

            // Crée la carte du nouvel avis
            addReviewCard(name, rating, service, comment);

            // Message de succès
            msgDiv.textContent = 'Merci pour votre avis ! Il a été publié.';
            msgDiv.className = 'form-message success';

            // Remet le formulaire à zéro
            reviewForm.reset();
            if (ratingInput) ratingInput.value = '0';
            stars.forEach(s => {
                s.classList.remove('active', 'hover');
            });

            // Cache le message après 5 secondes
            setTimeout(() => {
                msgDiv.style.display = 'none';
            }, 5000);
        });
    }

    // Ajoute un nouvel avis dans la liste
    function addReviewCard(name, rating, service, comment) {
        const reviewsList = document.getElementById('reviewsList');
        if (!reviewsList) return;

        // Crée les étoiles selon la note
        const starsHtml = '★'.repeat(rating) + '☆'.repeat(5 - rating);

        // Prend la première lettre du nom
        const initial = name.charAt(0).toUpperCase();

        const card = document.createElement('div');
        card.className = 'review-card new-review';
        card.innerHTML = `
            <div class="review-header">
                <div class="review-avatar">${initial}</div>
                <div class="review-meta">
                    <p class="review-author">${name}</p>
                    <div class="review-stars">${starsHtml}</div>
                </div>
            </div>
            <p class="review-text">${comment}</p>
            ${service ? `<p class="review-service">${service}</p>` : ''}
        `;

        // Ajoute en haut de la liste
        reviewsList.insertBefore(card, reviewsList.firstChild);

        // Fait défiler vers le nouvel avis
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Affiche une erreur sous un champ
    function showReviewError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const errorSpan = field.parentElement.querySelector('.error-message');
        field.style.borderColor = '#dc3545';
        if (errorSpan) {
            errorSpan.textContent = message;
            errorSpan.style.display = 'block';
        }
    }

    // Efface l'erreur d'un champ
    function clearReviewError(fieldId) {
        const field = document.getElementById(fieldId);
        const errorSpan = field.parentElement.querySelector('.error-message');
        field.style.borderColor = '#e0e0e0';
        if (errorSpan) {
            errorSpan.textContent = '';
            errorSpan.style.display = 'none';
        }
    }
});