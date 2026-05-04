/* ============================================
   Syed Ejaz Gillani Digital Library
   reader.js — Book Reader Page Logic
   ============================================ */

/**
 * Convert any Google Drive link to embeddable /preview format.
 * Handles:
 *   - https://drive.google.com/file/d/FILE_ID/view?usp=sharing
 *   - https://drive.google.com/file/d/FILE_ID/view
 *   - https://drive.google.com/file/d/FILE_ID/edit?usp=sharing
 *   - https://drive.google.com/open?id=FILE_ID
 *   - Already correct /preview links (returns as-is)
 */
function convertToGDriveEmbed(url) {
  if (!url) return '';

  // Pattern 1: /file/d/FILE_ID/anything
  const fileMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch) {
    return `https://drive.google.com/file/d/${fileMatch[1]}/preview`;
  }

  // Pattern 2: /open?id=FILE_ID
  const openMatch = url.match(/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/);
  if (openMatch) {
    return `https://drive.google.com/file/d/${openMatch[1]}/preview`;
  }

  // Pattern 3: ?id=FILE_ID in any drive URL
  const idMatch = url.match(/drive\.google\.com.*[?&]id=([a-zA-Z0-9_-]+)/);
  if (idMatch) {
    return `https://drive.google.com/file/d/${idMatch[1]}/preview`;
  }

  // Not a Google Drive link — return as-is (could be a direct PDF URL)
  return url;
}

document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const bookId = params.get('id');

  if (!bookId) return; // Show default "Select a book" message

  const data = await loadBooks();
  // Compare as strings since Firestore stores IDs as strings
  const book = data.books.find(b => String(b.id) === String(bookId));

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
  if (desc) desc.innerHTML = book.description;
  if (cat) cat.textContent = book.category;
  if (year) year.textContent = `Year: ${book.year}`;
  if (lang) lang.textContent = `Language: ${book.language || 'urdu'}`;

  // Show PDF if available
  const loading = document.getElementById('reader-loading');
  const viewer = document.getElementById('pdf-viewer');
  const frame = document.getElementById('pdf-frame');

  if (book.pdf_url && frame) {
    // Auto-convert Google Drive links to embeddable format
    const embedUrl = convertToGDriveEmbed(book.pdf_url);

    loading.classList.add('hidden');
    viewer.classList.remove('hidden');
    frame.src = embedUrl;

    // Add error handling — if iframe fails to load, show direct link
    frame.onerror = () => showPdfFallback(book);

    // Also check after a timeout if the iframe content loaded
    setTimeout(() => {
      try {
        // Can't access cross-origin iframe content, so just add a fallback link
        addDirectLinkButton(book, embedUrl);
      } catch (e) {
        addDirectLinkButton(book, embedUrl);
      }
    }, 2000);
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

/** Add a "Can't see the PDF?" fallback link below the reader */
function addDirectLinkButton(book, embedUrl) {
  const existing = document.getElementById('pdf-fallback-link');
  if (existing) return; // already added

  const viewer = document.getElementById('pdf-viewer');
  if (!viewer) return;

  // Extract the file ID to build a direct view link
  const fileMatch = embedUrl.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  const directUrl = fileMatch
    ? `https://drive.google.com/file/d/${fileMatch[1]}/view`
    : book.pdf_url;

  const fallback = document.createElement('div');
  fallback.id = 'pdf-fallback-link';
  fallback.className = 'text-center mt-4 py-3';
  fallback.innerHTML = `
    <p class="text-sm text-slate-400 mb-2">Can't see the PDF? Make sure it's shared publicly on Google Drive.</p>
    <a href="${directUrl}" target="_blank" rel="noopener noreferrer"
       class="inline-flex items-center gap-2 px-6 py-2.5 bg-[#006a6a] text-white rounded-full font-semibold text-sm hover:bg-[#005555] transition-all">
      <span class="material-symbols-outlined text-[18px]">open_in_new</span>
      Open PDF Directly
    </a>
  `;
  viewer.appendChild(fallback);
}

function showPdfFallback(book) {
  const loading = document.getElementById('reader-loading');
  const viewer = document.getElementById('pdf-viewer');
  if (viewer) viewer.classList.add('hidden');
  if (loading) {
    loading.classList.remove('hidden');
    loading.innerHTML = `
      <span class="material-symbols-outlined text-6xl mb-4" style="color: #e06666;">error</span>
      <p class="font-headline font-bold text-xl text-on-surface">Unable to load PDF</p>
      <p class="text-slate-400 mt-2 max-w-md text-center">The PDF could not be embedded. This usually means the Google Drive file is not shared publicly.</p>
      <div class="flex gap-3 mt-6">
        <a href="${book.pdf_url}" target="_blank" rel="noopener noreferrer"
           class="inline-flex items-center gap-2 gradient-cta text-white px-6 py-3 rounded-full font-headline font-bold text-sm hover:scale-105 transition-all">
          <span class="material-symbols-outlined text-[18px]">open_in_new</span>
          Open in Google Drive
        </a>
        <a href="books.html"
           class="inline-flex items-center gap-2 bg-gray-100 text-slate-600 px-6 py-3 rounded-full font-headline font-bold text-sm hover:bg-gray-200 transition-all">
          <span class="material-symbols-outlined text-[18px]">arrow_back</span>
          Back to Books
        </a>
      </div>
    `;
  }
}
