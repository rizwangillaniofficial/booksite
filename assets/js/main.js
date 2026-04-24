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
});

// ---- Load Books & Categories ----
async function loadBooks() {
  try {
    let firestoreBooks = [];
    let firestoreCats = [];
    
    // Try Firestore first if initialized
    if (window.db) {
      try {
        const booksSnap = await window.db.collection('books').get();
        booksSnap.forEach(doc => firestoreBooks.push(doc.data()));
        
        const catsSnap = await window.db.collection('categories').get();
        catsSnap.forEach(doc => firestoreCats.push(doc.data()));
        
        if (firestoreBooks.length > 0 || firestoreCats.length > 0) {
          console.log("Loaded from Firestore");
          return { books: firestoreBooks, categories: firestoreCats, site: {} };
        }
      } catch (dbErr) {
        console.warn("Firestore read failed, falling back to JSON:", dbErr);
      }
    }
    
    // Fallback to JSON
    const res = await fetch('data/books.json');
    const data = await res.json();
    console.log("Loaded from local JSON");
    return data;
  } catch (e) {
    console.error('Could not load data', e);
    return { books: [], categories: [], site: {} };
  }
}

// ---- Render Book Card ----
function renderBookCard(book) {
  return `
    <div class="book-card bg-white dark:bg-slate-800 rounded-xl overflow-hidden flex flex-col h-full shadow-sm border border-gray-100 dark:border-slate-700">
      <div class="relative overflow-hidden aspect-[2/3] bg-gray-50 dark:bg-slate-700 flex items-center justify-center">
        <img src="${book.cover || 'assets/images/placeholder.jpg'}" alt="${book.title}" class="w-full h-full object-contain" onerror="this.src='assets/images/placeholder.jpg'">
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
