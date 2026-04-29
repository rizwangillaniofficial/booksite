/* ============================================
   Syed Ejaz Gillani Digital Library
   main.js — Common utilities for all pages
   ============================================ */

// ---- Scroll Fade-in Animation ----
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.fade-up').forEach(el => fadeObserver.observe(el));
  loadPageContent();
});

// ---- Load Page Content (Dynamic Text) ----
async function loadPageContent() {
  if (!window.db) return;
  const path = window.location.pathname;
  let docId = '';
  if (path.includes('index.html') || path === '/' || path.endsWith('/')) docId = 'home';
  else if (path.includes('about.html')) docId = 'about';
  else if (path.includes('contact.html')) docId = 'contact';
  
  if (!docId) return;

  try {
    const doc = await window.db.collection('pages').doc(docId).get();
    if (doc.exists) {
      const data = doc.data();
      const safeText = (id, text) => { 
        const el = document.getElementById(id); 
        if(el) { el.innerHTML = text; }
      };

      if (docId === 'home') {
        safeText('dyn-home-title', data.heroTitle || 'Syed Ejaz Gillani');
        safeText('dyn-home-sub', data.heroSubtitle || 'A Pakistani Canadian writer, blogger & Community Coordinator. promoting infos. languages & cultures.');
        safeText('dyn-home-new-tag', data.newArrivalTag || 'New Arrival');
        safeText('dyn-home-new-title', data.newArrivalTitle || 'Uncover the Latest in Knowledge');
        safeText('dyn-home-new-author', data.newArrivalAuthor || 'by Syed Ejaz Gillani');
        safeText('dyn-home-about-title', data.aboutTitle || 'Read More, Learn More, Grow More');
        safeText('dyn-home-about-text', data.aboutText || 'Syed Ejaz Digital Library is more than just a collection of books — it is a platform built to share knowledge, ideas, and learning resources with a wider audience. Our mission is to provide easy access to quality digital books and help readers explore content that supports education, awareness, and lifelong learning.');
        safeText('dyn-home-stat1-num', data.stat1Num || '7+');
        safeText('dyn-home-stat1-text', data.stat1Text || 'Digital Books');
        safeText('dyn-home-stat2-num', data.stat2Num || '120+');
        safeText('dyn-home-stat2-text', data.stat2Text || 'Global Archives');
        safeText('dyn-home-feat-sub', data.featuredSub || 'Our Curated Selection');
        safeText('dyn-home-feat-title', data.featuredTitle || 'Featured Books');
        safeText('dyn-home-cat-title', data.categoriesTitle || 'Browse by Category');
        safeText('dyn-home-cat-sub', data.categoriesSub || 'Explore our diverse collection across various genres and specialized academic disciplines.');
        safeText('dyn-home-news-title', data.newsletterTitle || 'Stay Updated with New Archives');
        safeText('dyn-home-news-sub', data.newsletterSub || 'Join our monthly newsletter to receive updates on newly digitized historical collections and featured readings.');
      } else if (docId === 'about') {
        safeText('dyn-about-title', data.title);
        safeText('dyn-about-sub', data.subtitle);
        safeText('dyn-about-content', data.content);
      } else if (docId === 'contact') {
        safeText('dyn-contact-title', data.title);
        safeText('dyn-contact-sub', data.subtitle);
        safeText('dyn-contact-address', data.address);
        safeText('dyn-contact-email', data.email);
        safeText('dyn-contact-phone', data.phone);
      }
    }
  } catch (err) {
    console.error("Failed to load page content:", err);
  }
}

// ---- Load Books & Categories ----
async function loadBooks() {
  try {
    let firestoreBooks = [];
    let firestoreCats = [];
    
    if (window.db) {
      const booksSnap = await window.db.collection('books').get();
      booksSnap.forEach(doc => firestoreBooks.push(doc.data()));
      
      const catsSnap = await window.db.collection('categories').get();
      catsSnap.forEach(doc => firestoreCats.push(doc.data()));
      
      return { books: firestoreBooks, categories: firestoreCats };
    } else {
      console.error("Firebase not initialized!");
      return { books: [], categories: [] };
    }
  } catch (e) {
    console.error('Could not load data from Firestore', e);
    return { books: [], categories: [] };
  }
}

// ---- Render Book Card ----
function renderBookCard(book) {
  return `
    <div class="book-card bg-white dark:bg-slate-800 rounded-xl overflow-hidden flex flex-col h-full shadow-sm border border-gray-100 dark:border-slate-700">
      <div class="relative overflow-hidden aspect-[2/3] bg-gray-50 dark:bg-slate-700 flex items-center justify-center">
        <img src="${book.cover || 'assets/images/placeholder.jpg'}" alt="${book.title}" class="w-full h-full object-contain" onerror="this.onerror=null; this.src='assets/images/placeholder.jpg';">
        <span class="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-widest bg-[#006a6a] text-white px-3 py-1 rounded-full">${book.category}</span>
      </div>
      <div class="flex flex-col flex-grow p-5">
        <h3 class="text-base font-headline font-bold text-on-surface dark:text-white mb-1 line-clamp-2">${book.title}</h3>
        ${book.title_ur ? `<p class="urdu-text text-sm text-slate-400 mb-1">${book.title_ur}</p>` : ''}
        <p class="text-xs text-slate-400 mb-3 font-medium">${book.author} · ${book.year}</p>
        <p class="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">${book.description}</p>
        <div class="mt-auto flex gap-2">
          <a href="reader.html?id=${book.id}" class="read-btn flex-1 py-2.5 bg-gray-100 dark:bg-slate-700 text-on-surface dark:text-white font-headline font-semibold rounded-lg text-sm text-center block">Read Online</a>
          ${book.pdf_url ? `<a href="${book.pdf_url}" download class="py-2.5 px-3 bg-gray-100 dark:bg-slate-700 text-on-surface dark:text-white rounded-lg hover:bg-[#006a6a] hover:text-white transition-all"><span class="material-symbols-outlined text-[18px]">download</span></a>` : ''}
        </div>
      </div>
    </div>`;
}

// ---- Render Category Card ----
function renderCategoryCard(cat) {
  return `
    <a href="books.html?category=${cat.id}" class="cat-card bg-white dark:bg-slate-800 p-8 rounded-xl text-center block cursor-pointer border border-gray-100 dark:border-slate-700">
      <span class="material-symbols-outlined text-4xl text-[#006a6a] mb-3 block">${cat.icon}</span>
      <span class="font-headline font-bold text-on-surface dark:text-white text-sm block">${cat.name}</span>
      ${cat.name_ur ? `<span class="urdu-text text-xs text-slate-400 block mt-1">${cat.name_ur}</span>` : ''}
      <span class="text-xs text-slate-400 mt-1 block">${cat.count} book${cat.count !== 1 ? 's' : ''}</span>
    </a>`;
}
