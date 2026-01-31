// NAVIGATION SMOOTH SCROLL

// Fonction pour le défilement fluide vers les sections
// Quand on clique sur un lien du menu, la page descend doucement
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();  // Empêche le saut brusque
        
        // Trouve la section ciblée
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            // Défile doucement vers la section
            target.scrollIntoView({ 
                behavior: 'smooth'   // Animation fluide
            });
        }
    });
});

// FORMULAIRE NEWSLETTER

// Fonction appelée quand on soumet le formulaire
function handleSubmit(event) {
    event.preventDefault();  // Empêche le rechargement de la page
    
    // Récupère l'email saisi
    const email = event.target.email.value;
    
    // Affiche un message de confirmation
    alert('Merci ! Vous recevrez nos offres à ' + email);
    
    // Vide le formulaire
    event.target.reset();
}

// SLIDER D'IMAGES POUR LES SERVICES

// Attend que la page soit complètement chargée
document.addEventListener('DOMContentLoaded', function() {
    
    // Sélectionne toutes les cartes de service
    const featureCards = document.querySelectorAll('.feature-card');
    
    // Pour chaque carte de service
    featureCards.forEach(card => {
        // Sélectionne les éléments du slider
        const slider = card.querySelector('.image-slider');
        const images = slider.querySelectorAll('img');
        const dots = card.querySelectorAll('.dot');
        
        let currentIndex = 0;  // Index de l'image affichée
        let intervalId;        // ID de l'intervalle pour l'auto-slide

        // Fonction pour afficher une image spécifique
        function showImage(index) {
            // Retire la classe "active" de toutes les images
            images.forEach(img => img.classList.remove('active'));
            // Retire la classe "active" de tous les points
            dots.forEach(dot => dot.classList.remove('active'));
            
            // Ajoute la classe "active" à l'image choisie
            images[index].classList.add('active');
            // Ajoute la classe "active" au point correspondant
            dots[index].classList.add('active');
            
            // Met à jour l'index actuel
            currentIndex = index;
        }

        // Fonction pour démarrer le défilement automatique
        function startAutoSlide() {
            // Change d'image toutes les 3 secondes
            intervalId = setInterval(() => {
                // Calcule l'index de la prochaine image
                // Si on est à la dernière, on retourne à la première
                let nextIndex = (currentIndex + 1) % images.length;
                showImage(nextIndex);
            }, 3000);  // 3000 millisecondes = 3 secondes
        }

        // Fonction pour arrêter le défilement automatique
        function stopAutoSlide() {
            clearInterval(intervalId);
        }

        // Quand on clique sur un point
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                stopAutoSlide();        // Arrête l'auto-slide
                showImage(index);       // Affiche l'image correspondante
                startAutoSlide();       // Redémarre l'auto-slide
            });
        });

        // Quand la souris entre sur la carte, arrête l'auto-slide
        card.addEventListener('mouseenter', stopAutoSlide);
        
        // Quand la souris quitte la carte, redémarre l'auto-slide
        card.addEventListener('mouseleave', startAutoSlide);

        // Démarre le slider automatique au chargement
        startAutoSlide();
    });
});