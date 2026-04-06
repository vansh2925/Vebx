/* =====================================================
   VebX — Premium Interactions & Animations
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // --- Set Current Year ---
    const yearEl = document.getElementById('currentYear');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // --- Navbar Scroll Effect ---
    const navbar = document.getElementById('mainNavbar');
    if (navbar) {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
    }

    // --- Scroll Reveal (Fade-Up Animation) ---
    const initScrollReveal = () => {
        // Auto-tag elements for animation
        const selectors = [
            '#about .col-lg-6',
            '#why-choose-us .text-center.mb-5',
            '#why-choose-us .col-md-6',
            '#products .text-center.mb-5',
            '#products .col-lg-6',
            '#inquiry .col-lg-8',
            'footer .col-lg-4, footer .col-lg-2, footer .col-lg-3'
        ];

        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach((el, i) => {
                if (!el.classList.contains('fade-up')) {
                    el.classList.add('fade-up');
                    const delay = Math.min(i + 1, 6);
                    el.classList.add(`fade-up-delay-${delay}`);
                }
            });
        });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -60px 0px'
        });

        document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
    };

    initScrollReveal();

    // --- Smooth Scroll for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });

                // Close mobile nav if open
                const navCollapse = document.querySelector('.navbar-collapse.show');
                if (navCollapse) {
                    const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
                    if (bsCollapse) bsCollapse.hide();
                }
            }
        });
    });

    // --- Form Submission Handler ---
    const form = document.getElementById('quoteForm');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            // Simple validation animation
            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-2"></i> Sending...';
            btn.disabled = true;

            setTimeout(() => {
                form.reset();
                btn.innerHTML = originalText;
                btn.disabled = false;

                const successMsg = document.getElementById('formSuccess');
                if (successMsg) {
                    successMsg.classList.remove('d-none');
                    setTimeout(() => {
                        successMsg.classList.add('d-none');
                    }, 5000);
                }
            }, 1500);
        });
    }

    // --- Counter Animation for Stats ---
    const animateCounters = () => {
        document.querySelectorAll('[data-count]').forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            const update = () => {
                current += step;
                if (current < target) {
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(update);
                } else {
                    counter.textContent = target;
                }
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        update();
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });

            observer.observe(counter);
        });
    };

    animateCounters();

    // --- Parallax-like effect on hero ---
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            if (scrolled < window.innerHeight) {
                const heroText = heroSection.querySelector('.hero-text');
                if (heroText) {
                    heroText.style.transform = `translateY(${scrolled * 0.15}px)`;
                    heroText.style.opacity = 1 - (scrolled / (window.innerHeight * 0.8));
                }
            }
        }, { passive: true });
    }

    // --- Magnetic hover effect on CTA buttons ---
    document.querySelectorAll('.btn-primary-custom.btn-lg').forEach(btn => {
        btn.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            this.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
        });

        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translate(0, 0)';
        });
    });

});
