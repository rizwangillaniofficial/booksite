/* ============================================
   Syed Ejaz Gillani Digital Library
   reader.js — Book Reader Page Logic
   ============================================ */
document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const bookId = parseInt(params.get('id'));

  if (!bookId) return; // Show default "Select a book" message

  const data = await loadBooks();
  const book = data.books.find(b => b.id === bookId);

  if (!book) {
    document.getElementById('reader-loading').innerHTML = `
      <span class="material-symbols-outlined text-6xl mb-4 text-red-300">error</span>
      <p class="font-headline font-bold text-lg text-slate-500">Book not found</p>
      <p class="text-sm mt-2">This book may have been removed. <a href="books.html" class="text-[#006a6a] hover:underline">Browse all books</a></p>
    `;
    return;
  }

  // Update page title
  document.title = `${book.title} - Syed Ejaz Digital Library`;

  // Fill in book info
  const cover = document.getElementById('book-cover');
  const title = document.getElementById('book-title');
  const titleUr = document.getElementById('book-title-ur');
  const author = document.getElementById('book-author');
  const desc = document.getElementById('book-description');
  const cat = document.getElementById('book-category');
  const year = document.getElementById('book-year');
  const lang = document.getElementById('book-lang');

  if (cover) { cover.src = book.cover || ''; cover.alt = book.title; }
  if (title) title.textContent = book.title;
  if (titleUr && book.title_ur) { titleUr.textContent = book.title_ur; } else if (titleUr) { titleUr.style.display = 'none'; }
  if (author) author.textContent = `By ${book.author}`;
  if (desc) desc.textContent = book.description;
  if (cat) cat.textContent = book.category;
  if (year) year.textContent = `Year: ${book.year}`;
  if (lang) lang.textContent = `Language: ${book.language || 'Urdu'}`;

  // Show PDF if available
  const loading = document.getElementById('reader-loading');
  const viewer = document.getElementById('pdf-viewer');
  const frame = document.getElementById('pdf-frame');

  if (book.pdf_url && frame) {
    loading.classList.add('hidden');
    viewer.classList.remove('hidden');
    frame.src = book.pdf_url;
  } else {
    // Show a styled "Coming Soon" reader view
    loading.innerHTML = `
      <span class="material-symbols-outlined text-6xl mb-4" style="color: #006a6a;">auto_stories</span>
      <p class="font-headline font-bold text-xl text-on-surface">${book.title}</p>
      ${book.title_ur ? `<p class="urdu-text text-lg text-slate-400 mt-1">${book.title_ur}</p>` : ''}
      <p class="text-slate-400 mt-4 max-w-md text-center">The online reader for this book is coming soon. Please check back later or contact us for access.</p>
      <a href="contact.html" class="mt-6 inline-flex items-center gap-2 gradient-cta text-white px-6 py-3 rounded-full font-headline font-bold text-sm hover:scale-105 transition-all">
        <span class="material-symbols-outlined text-[18px]">mail</span>
        Request Access
      </a>
    `;
  }
});
