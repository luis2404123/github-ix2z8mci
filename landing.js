document.addEventListener('DOMContentLoaded', () => {
    // Navbar Background Change on Scroll
    const navbar = document.querySelector('.navbar');

    const handleScroll = () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll);

    // Smooth Scroll for Anchor Links
    const smoothScroll = (target) => {
        const element = document.querySelector(target);
        const headerOffset = navbar.offsetHeight;
        const elementPosition = element.offsetTop;
        const offsetPosition = elementPosition - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
        });
    };

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            smoothScroll(this.getAttribute('href'));
        });
    });

    // Billing Toggle Functionality
    const billingToggle = document.getElementById('billingToggle');
    const basicPrice = document.getElementById('basicPrice');
    const proPrice = document.getElementById('proPrice');

    const prices = {
        basic: {
            monthly: 29,
            annual: 290, // Annual price with discount
        },
        pro: {
            monthly: 59,
            annual: 590, // Annual price with discount
        },
    };

    const updatePrices = (isAnnual) => {
        if (isAnnual) {
            basicPrice.textContent = `$${prices.basic.annual}/year`;
            proPrice.textContent = `$${prices.pro.annual}/year`;
        } else {
            basicPrice.textContent = `$${prices.basic.monthly}/month`;
            proPrice.textContent = `$${prices.pro.monthly}/month`;
        }
    };

    billingToggle.addEventListener('change', () => {
        updatePrices(billingToggle.checked);
    });

    // Initialize with monthly prices
    updatePrices(false);

    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuToggle.classList.toggle('open');
    });


    // FAQ Accordion Toggle
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach((item) => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            item.classList.toggle('active');

            // Close others when one is opened
            faqItems.forEach((otherItem) => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
        });
    });

    // Flag Carousel and Progress Bar
    const carouselFlags = document.getElementById('carouselFlags');
    const progressBar = document.getElementById('progressBar');

    // List of flag images
    const flagImages = [
        'https://flagcdn.com/w320/us.png', 'https://flagcdn.com/w320/fr.png', 'https://flagcdn.com/w320/de.png',
        'https://flagcdn.com/w320/es.png', 'https://flagcdn.com/w320/cn.png', 'https://flagcdn.com/w320/it.png',
        'https://flagcdn.com/w320/gb.png', 'https://flagcdn.com/w320/jp.png', 'https://flagcdn.com/w320/au.png',
        'https://flagcdn.com/w320/br.png', 'https://flagcdn.com/w320/ru.png', 'https://flagcdn.com/w320/za.png',
        'https://flagcdn.com/w320/nl.png', 'https://flagcdn.com/w320/se.png', 'https://flagcdn.com/w320/kr.png',
        'https://flagcdn.com/w320/in.png', 'https://flagcdn.com/w320/ca.png', 'https://flagcdn.com/w320/fi.png',
        'https://flagcdn.com/w320/pt.png', 'https://flagcdn.com/w320/no.png', 'https://flagcdn.com/w320/gr.png',
        'https://flagcdn.com/w320/dk.png', 'https://flagcdn.com/w320/ae.png', 'https://flagcdn.com/w320/vn.png',
        'https://flagcdn.com/w320/ar.png', 'https://flagcdn.com/w320/th.png', 'https://flagcdn.com/w320/cl.png',
        'https://flagcdn.com/w320/sa.png', 'https://flagcdn.com/w320/ie.png', 'https://flagcdn.com/w320/nz.png',
        'https://flagcdn.com/w320/mx.png', 'https://flagcdn.com/w320/kr.png'
    ];

    // Display 6 flags at a time
    const flagsPerSet = 6;
    let currentSet = 0;

    function updateFlags() {
        carouselFlags.innerHTML = ''; // Clear the current flags

        // Create and display the next set of flags
        for (let i = 0; i < flagsPerSet; i++) {
            const index = (currentSet * flagsPerSet + i) % flagImages.length; // Loop through flags
            const flagDiv = document.createElement('div');
            flagDiv.classList.add('flag-item');
            flagDiv.innerHTML = `<img src="${flagImages[index]}" alt="Flag">`;
            carouselFlags.appendChild(flagDiv);
        }

        // Update the progress bar
        const progress = ((currentSet + 1) / Math.ceil(flagImages.length / flagsPerSet)) * 100;
        progressBar.style.width = progress + '%';

        // Move to the next set
        currentSet = (currentSet + 1) % Math.ceil(flagImages.length / flagsPerSet);
    }

    // Automatically rotate flags every 5 seconds
    setInterval(updateFlags, 5000);

    // Initial flag load
    updateFlags();
});
