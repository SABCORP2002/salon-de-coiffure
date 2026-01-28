// Smooth scroll pour les ancres mon chaud big
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Gestion du formulaire newsletter ais pour java je nai pas encore maitriser
function handleSubmit(event) {
    event.preventDefault();
    const email = event.target.email.value;
    alert('Merci ! Vous recevrez nos offres à ' + email);
    event.target.reset();
}