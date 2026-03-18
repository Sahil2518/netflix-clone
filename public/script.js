document.addEventListener('DOMContentLoaded', () => {
    // FAQ Accordion Functionality
    const faqBoxes = document.querySelectorAll('.faqbox');

    faqBoxes.forEach(box => {
        box.addEventListener('click', () => {
            // Toggle the active class on the clicked box
            box.classList.toggle('active');

            // Optional: Close other open boxes (accordion style)
            // Uncomment the lines below if you want only one open at a time
            /*
            faqBoxes.forEach(otherBox => {
                if (otherBox !== box) {
                    otherBox.classList.remove('active');
                }
            });
            */
        });
    });

    // Email Validation in Hero Section
    const heroInput = document.querySelector('.hero-buttons input');
    const heroButton = document.querySelector('.hero-buttons .btn-red');

    if (heroInput && heroButton) {
        heroButton.addEventListener('click', () => {
            const email = heroInput.value.trim();
            if (validateEmail(email)) {
                alert(`Success! Email "${email}" is valid. Redirecting to sign up...`); // Replace with actual logic
                // window.location.href = '/signup'; // Example redirect
            } else {
                alert('Please enter a valid email address.');
                heroInput.focus();
                heroInput.style.border = '2px solid red';
            }
        });

        // Remove error border on input
        heroInput.addEventListener('input', () => {
            heroInput.style.border = '1px solid rgba(246, 238, 238, 0.5)';
        });
    }

    // Language Selector Functionality
    const langSelect = document.querySelector('.lang-select');
    if (langSelect) {
        langSelect.addEventListener('change', (e) => {
            const lang = e.target.options[e.target.selectedIndex].text;
            alert(`Language switched to ${lang} (Mock functionality)`);
        });
    }

    // Sticky Header Logic: Hide when reaching Footer
    const nav = document.querySelector('nav');
    const footer = document.querySelector('footer');

    if (nav && footer) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Footer is visible, hide nav
                    nav.style.transform = 'translateY(-100%)';
                    nav.style.transition = 'transform 0.3s ease-in-out';
                } else {
                    // Footer is not visible, show nav
                    nav.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1 // Trigger when 10% of footer is visible
        });

        observer.observe(footer);
    }
});

// Helper function for email validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}
