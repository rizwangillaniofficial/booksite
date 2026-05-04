/* ============================================
   Syed Ejaz Digital Library - WordPress Theme JS
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    // Dark Mode Toggle
    const darkBtn = document.getElementById('dark-mode-btn');
    if (darkBtn) {
        darkBtn.addEventListener('click', function() {
            const html = document.documentElement;
            html.classList.toggle('dark');
            html.classList.toggle('light');
            const isDark = html.classList.contains('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            darkBtn.querySelector('.material-symbols-outlined').textContent = isDark ? 'light_mode' : 'dark_mode';
        });
    }

    // Mobile Menu Toggle
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('open');
            const icon = menuBtn.querySelector('.material-symbols-outlined');
            icon.textContent = mobileMenu.classList.contains('open') ? 'close' : 'menu';
        });
    }

    // Navbar shadow on scroll
    const navbar = document.getElementById('main-nav');
    if (navbar) {
        window.addEventListener('scroll', function() {
            navbar.classList.toggle('shadow-md', window.scrollY > 20);
        });
    }

    // Scroll fade-in
    const fadeObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.fade-up').forEach(function(el) { fadeObserver.observe(el); });
});
