document.addEventListener('DOMContentLoaded', () => {
    // Header Scroll Effect
    const header = document.querySelector('.header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const menuBtn = document.querySelector('.menu-btn');
    const navList = document.querySelector('.nav-list');

    // Create mobile menu container if not exists (for better animation control)
    if (window.innerWidth <= 768) {
        // Simple toggle for now
        menuBtn.addEventListener('click', () => {
            navList.classList.toggle('active');
            // Toggle icon or animation here
        });
    }

    // Intersection Observer for Scroll Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-in-scroll');
    animatedElements.forEach(el => observer.observe(el));

    // Cart Interaction
    const cartBtn = document.querySelector('.cart-btn');
    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
    const cartCount = document.querySelector('.cart-count');
    let count = 0;

    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            count++;
            cartCount.textContent = count;

            // Button feedback
            const originalText = btn.textContent;
            btn.textContent = 'Added';
            btn.style.backgroundColor = 'var(--bg-card)';
            btn.style.border = '1px solid var(--text-muted)';
            btn.style.color = 'var(--text-muted)';

            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.backgroundColor = '';
                btn.style.border = '';
                btn.style.color = '';
            }, 1000);
        });
    });

    // Smooth Scrolling for Anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
                // Close mobile menu if open
                navList.classList.remove('active');
            }
        });
    });

    // Aesthetic Slider Logic
    const initSlider = () => {
        const sliderTrack = document.querySelector('.slider-track');
        if (!sliderTrack) return;

        const slides = Array.from(document.querySelectorAll('.slide'));
        const nextBtn = document.querySelector('.next-btn');
        const prevBtn = document.querySelector('.prev-btn');
        const dotsContainer = document.querySelector('.slider-dots');

        let currentIndex = 0;
        let isAnimating = false;

        // Create Dots
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });

        const dots = document.querySelectorAll('.dot');

        const updateSlider = () => {
            slides.forEach((slide, index) => {
                slide.className = 'slide'; // Reset classes

                if (index === currentIndex) {
                    slide.classList.add('active');
                } else if (index === (currentIndex - 1 + slides.length) % slides.length) {
                    slide.classList.add('prev');
                } else if (index === (currentIndex + 1) % slides.length) {
                    slide.classList.add('next');
                }
            });

            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        };

        const goToSlide = (index) => {
            if (isAnimating) return;
            isAnimating = true;
            currentIndex = index;
            updateSlider();
            setTimeout(() => isAnimating = false, 600); // Match CSS transition
        };

        const nextSlide = () => {
            goToSlide((currentIndex + 1) % slides.length);
        };

        const prevSlide = () => {
            goToSlide((currentIndex - 1 + slides.length) % slides.length);
        };

        // Event Listeners
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetAutoPlay();
        });

        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetAutoPlay();
        });

        // Auto Play
        let autoPlayInterval = setInterval(nextSlide, 4000);

        const resetAutoPlay = () => {
            clearInterval(autoPlayInterval);
            autoPlayInterval = setInterval(nextSlide, 4000);
        };

        // Pause on Hover
        sliderTrack.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
        sliderTrack.addEventListener('mouseleave', resetAutoPlay);

        // Init
        updateSlider();
    };

    initSlider();
});
