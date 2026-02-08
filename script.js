// ========================================
// DEFILEMENT DOUX VERS LES SECTIONS
// ========================================

// Quand on clique sur un lien du menu
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();  // Empêche le saut brusque
        
        // Trouve la section où aller
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            // Va vers la section en douceur
            target.scrollIntoView({ 
                behavior: 'smooth'
            });
        }
    });
});


// ========================================
// FORMULAIRE DE RESERVATION
// ========================================

// Quand on envoie le formulaire de réservation
function handleReservation(event) {
    event.preventDefault();  // Empêche la page de se recharger
    
    // Récupère toutes les valeurs du formulaire
    const name = event.target.name.value;
    const phone = event.target.phone.value;
    const service = event.target.service.value;
    const date = event.target.date.value;
    const time = event.target.time.value;
    const message = event.target.message.value;
    
    // Trouve la zone de message
    const messageDiv = event.target.querySelector('.reservation-message');
    
    // Vérifie que la date n'est pas dans le passé
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
        messageDiv.textContent = 'Veuillez choisir une date future.';
        messageDiv.className = 'reservation-message error';
        return;
    }
    
    // Crée le message de confirmation
    const serviceName = event.target.service.options[event.target.service.selectedIndex].text;
    const confirmMessage = `
        Réservation confirmée pour ${name} !
        Service: ${serviceName}
        Date: ${date} à ${time}
        Nous vous appellerons au ${phone} pour confirmer.
    `;
    
    // Affiche le message de succès
    messageDiv.textContent = confirmMessage;
    messageDiv.className = 'reservation-message success';
    
    // Vide le formulaire après 5 secondes
    setTimeout(() => {
        event.target.reset();
        messageDiv.textContent = '';
        messageDiv.className = 'reservation-message';
    }, 5000);
}


// ========================================
// FORMULAIRE D'INSCRIPTION
// ========================================

// Quand on envoie le formulaire
function handleSubmit(event) {
    event.preventDefault();  // Empêche la page de se recharger
    
    // Récupère l'email tapé
    const email = event.target.email.value;
    
    // Affiche un message
    alert('Merci ! Vous recevrez nos offres à ' + email);
    
    // Vide le champ email
    event.target.reset();
}


// ========================================
// SLIDER D'IMAGES (CARROUSEL)
// ========================================

// Attend que la page soit chargée
document.addEventListener('DOMContentLoaded', function() {
    
    // Configure la date minimum (aujourd'hui)
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }
    
    // Trouve toutes les cartes de service
    const featureCards = document.querySelectorAll('.feature-card');
    
    // Pour chaque carte
    featureCards.forEach(card => {
        // Trouve les éléments du slider
        const slider = card.querySelector('.image-slider');
        const images = slider.querySelectorAll('img');
        const dots = card.querySelectorAll('.dot');
        
        let currentIndex = 0;  // Image actuellement affichée
        let intervalId;        // Pour l'auto-défilement

        // Fonction pour afficher une image
        function showImage(index) {
            // Cache toutes les images
            images.forEach(img => img.classList.remove('active'));
            // Désactive tous les points
            dots.forEach(dot => dot.classList.remove('active'));
            
            // Affiche l'image choisie
            images[index].classList.add('active');
            // Active le point correspondant
            dots[index].classList.add('active');
            
            // Met à jour l'index
            currentIndex = index;
        }

        // Fonction pour démarrer le défilement auto
        function startAutoSlide() {
            // Change d'image toutes les 3 secondes
            intervalId = setInterval(() => {
                // Calcule la prochaine image
                let nextIndex = (currentIndex + 1) % images.length;
                showImage(nextIndex);
            }, 3000);  // 3000 = 3 secondes
        }

        // Fonction pour arrêter le défilement auto
        function stopAutoSlide() {
            clearInterval(intervalId);
        }

        // Quand on clique sur un point
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                stopAutoSlide();        // Arrête le défilement
                showImage(index);       // Affiche cette image
                startAutoSlide();       // Redémarre le défilement
            });
        });

        // Quand la souris entre sur la carte
        card.addEventListener('mouseenter', stopAutoSlide);
        
        // Quand la souris sort de la carte
        card.addEventListener('mouseleave', startAutoSlide);

        // Lance le défilement au démarrage
        startAutoSlide();
    });
});