/* ============================================
   Syed Ejaz Gillani Digital Library
   nav-footer.js — Shared Navigation & Footer
   ============================================ */
(function () {
  // --- Dark mode: apply EARLY before paint ---
  if (localStorage.getItem('theme') === 'dark') {
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
  }

  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  const navLinks = [
    { href: 'index.html', label: 'Home' },
    { href: 'books.html', label: 'Books' },
    { href: 'categories.html', label: 'Categories' },
    { href: 'gallery.html', label: 'Gallery' },
    { href: 'about.html', label: 'About' },
    { href: 'contact.html', label: 'Contact' },
  ];

  function isActive(page) {
    if (page === 'index.html' && (currentPage === '' || currentPage === '/' || currentPage === 'index.html')) return true;
    return currentPage === page;
  }

  function desktopLinkClass(page) {
    return isActive(page)
      ? 'text-[#006A6A] border-b-2 border-[#0132c5] pb-1 transition-all duration-300 ease-in-out'
      : 'text-slate-600 dark:text-slate-300 hover:text-[#006A6A] transition-all duration-300 ease-in-out';
  }

  function mobileLinkClass(page) {
    return isActive(page)
      ? 'block px-4 py-3 rounded-lg font-headline font-semibold tracking-tight text-[#006A6A] bg-[#006a6a]/5'
      : 'block px-4 py-3 rounded-lg font-headline font-semibold tracking-tight text-slate-600 dark:text-slate-300 hover:text-[#006A6A] hover:bg-slate-50 dark:hover:bg-slate-800 transition-all';
  }

  const isDark = document.documentElement.classList.contains('dark');
  const darkIcon = isDark ? 'light_mode' : 'dark_mode';

  const desktopLinks = navLinks.map(l => `<a href="${l.href}" class="${desktopLinkClass(l.href)}">${l.label}</a>`).join('\n');
  const mobileLinks = navLinks.map(l => `<a href="${l.href}" class="${mobileLinkClass(l.href)}">${l.label}</a>`).join('\n');

  const navHTML = `
<nav id="main-nav" class="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-[0px_20px_40px_rgba(25,28,29,0.05)] transition-colors duration-300">
  <div class="max-w-7xl mx-auto w-full flex justify-between items-center px-6 md:px-8 py-4">
    <a href="index.html" id="dyn-nav-title" class="text-lg md:text-xl font-bold text-slate-800 dark:text-white font-headline tracking-tight hover:opacity-80 transition-opacity flex items-center gap-2">
      <span class="material-symbols-outlined text-[#006A6A]" style="font-variation-settings:'FILL' 1;">auto_stories</span>
      Syed Ejaz Digital Library
    </a>
    <div class="hidden md:flex items-center space-x-8 font-headline font-semibold tracking-tight">
      ${desktopLinks}
    </div>
    <div class="flex items-center space-x-3">
      <button id="dark-mode-btn" class="p-2 hover:opacity-90 transition-all rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800" title="Toggle dark mode">
        <span class="material-symbols-outlined text-[#006A6A]">${darkIcon}</span>
      </button>
      <button id="mobile-menu-btn" class="md:hidden p-2 hover:opacity-90 transition-all rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800" title="Menu">
        <span class="material-symbols-outlined text-[#006A6A]">menu</span>
      </button>
    </div>
  </div>
  <div id="mobile-menu" class="md:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-800">
    <div class="max-w-7xl mx-auto px-6 py-4 flex flex-col space-y-1">
      ${mobileLinks}
    </div>
  </div>
</nav>`;

  const footerHTML = `
<footer class="w-full border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 transition-colors duration-300">
  <div class="max-w-7xl mx-auto px-8 py-12 flex flex-col md:flex-row justify-between gap-12">
    <div class="mb-4 md:mb-0 max-w-sm">
      <div id="dyn-footer-title" class="font-headline font-bold text-lg text-slate-900 dark:text-white mb-4 flex items-center gap-2">
        <span class="material-symbols-outlined text-[#006A6A]" style="font-variation-settings:'FILL' 1;">auto_stories</span>
        Syed Ejaz Digital Library
      </div>
      <p id="dyn-footer-desc" class="text-[#454749] dark:text-slate-400 font-body text-sm leading-relaxed">
        Curating knowledge, preserving heritage, and empowering the future through digital literacy.
      </p>
      <div class="flex gap-4 mt-6">
        <a id="dyn-social-fb" href="https://www.facebook.com/SyedEjazGillani" target="_blank" class="w-10 h-10 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:bg-[#006a6a] hover:text-white transition-all">
          <span class="material-symbols-outlined text-[20px]">share</span>
        </a>
        <a id="dyn-social-yt" href="https://www.youtube.com/@SyedEjazGillani" target="_blank" class="w-10 h-10 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:bg-[#006a6a] hover:text-white transition-all">
          <span class="material-symbols-outlined text-[20px]">play_circle</span>
        </a>
        <a id="dyn-social-email" href="mailto:info@syedejazgillani.com" class="w-10 h-10 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:bg-[#006a6a] hover:text-white transition-all">
          <span class="material-symbols-outlined text-[20px]">mail</span>
        </a>
      </div>
    </div>
    <div class="grid grid-cols-2 sm:grid-cols-3 gap-8 md:gap-12">
      <div class="flex flex-col space-y-3">
        <span class="text-on-surface dark:text-white font-bold font-headline text-sm uppercase tracking-widest mb-1">Library</span>
        <a class="text-slate-500 hover:text-[#006a6a] dark:hover:text-white transition-all text-sm" href="books.html">Books</a>
        <a class="text-slate-500 hover:text-[#006a6a] dark:hover:text-white transition-all text-sm" href="categories.html">Categories</a>
        <a class="text-slate-500 hover:text-[#006a6a] dark:hover:text-white transition-all text-sm" href="gallery.html">Gallery</a>
      </div>
      <div class="flex flex-col space-y-3">
        <span class="text-on-surface dark:text-white font-bold font-headline text-sm uppercase tracking-widest mb-1">About</span>
        <a class="text-slate-500 hover:text-[#006a6a] dark:hover:text-white transition-all text-sm" href="about.html">About Us</a>
        <a class="text-slate-500 hover:text-[#006a6a] dark:hover:text-white transition-all text-sm" href="contact.html">Contact</a>
        <a class="text-slate-500 hover:text-[#006a6a] dark:hover:text-white transition-all text-sm" href="reader.html">Reader</a>
      </div>
      <div class="flex flex-col space-y-3">
        <span class="text-on-surface dark:text-white font-bold font-headline text-sm uppercase tracking-widest mb-1">Legal</span>
        <a class="text-slate-500 hover:text-[#006a6a] dark:hover:text-white transition-all text-sm" href="#">Privacy Policy</a>
        <a class="text-slate-500 hover:text-[#006a6a] dark:hover:text-white transition-all text-sm" href="#">Terms of Service</a>
        <a class="text-slate-500 hover:text-[#006a6a] dark:hover:text-white transition-all text-sm" href="#">Copyright</a>
      </div>
    </div>
  </div>
  <div class="max-w-7xl mx-auto px-8 pb-8 flex flex-col md:flex-row justify-between items-center border-t border-slate-50 dark:border-slate-900 pt-6">
    <p class="text-[#454749] dark:text-slate-400 text-sm">© 2026 Syed Ejaz Digital Library. All rights reserved.</p>
  </div>
</footer>`;

  // --- Inject nav & footer when DOM is ready ---
  function inject() {
    const nc = document.getElementById('nav-container');
    const fc = document.getElementById('footer-container');
    if (nc) nc.innerHTML = navHTML;
    if (fc) fc.innerHTML = footerHTML;

    // Dark Mode Toggle
    const darkBtn = document.getElementById('dark-mode-btn');
    if (darkBtn) {
      darkBtn.addEventListener('click', function () {
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
      menuBtn.addEventListener('click', function () {
        mobileMenu.classList.toggle('open');
        const icon = menuBtn.querySelector('.material-symbols-outlined');
        icon.textContent = mobileMenu.classList.contains('open') ? 'close' : 'menu';
      });
    }

    // Navbar shadow on scroll
    const navbar = document.getElementById('main-nav');
    if (navbar) {
      window.addEventListener('scroll', function () {
        if (window.scrollY > 20) {
          navbar.classList.add('shadow-md');
        } else {
          navbar.classList.remove('shadow-md');
        }
      });
    }

    // Load Site Settings from Firebase
    if (window.db) {
      window.db.collection('settings').doc('general').get().then(doc => {
        if (doc.exists) {
          const s = doc.data();
          const safeText = (id, text) => { 
            const el = document.getElementById(id); 
            if(el) {
              if (el.tagName === 'A' && el.id.startsWith('dyn-social')) el.href = text;
              else if (el.id === 'dyn-nav-title' || el.id === 'dyn-footer-title') {
                el.innerHTML = `<span class="material-symbols-outlined text-[#006A6A]" style="font-variation-settings:'FILL' 1;">auto_stories</span> ${text}`;
              }
              else el.textContent = text; 
            }
          };
          
          if(s.siteTitle) { safeText('dyn-nav-title', s.siteTitle); safeText('dyn-footer-title', s.siteTitle); }
          if(s.footerDesc) safeText('dyn-footer-desc', s.footerDesc);
          if(s.facebookUrl) safeText('dyn-social-fb', s.facebookUrl);
          if(s.youtubeUrl) safeText('dyn-social-yt', s.youtubeUrl);
          if(s.emailUrl) safeText('dyn-social-email', s.emailUrl.includes('@') ? 'mailto:' + s.emailUrl : s.emailUrl);
        }
      }).catch(e => console.error("Error loading settings", e));
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
