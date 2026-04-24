/* ============================================
   Syed Ejaz Gillani Digital Library
   books.js — Books Archive Page Logic
   ============================================ */
document.addEventListener('DOMContentLoaded', async () => {
  const data = await loadBooks();
  const books = data.books || [];
  const categories = data.categories || [];

  const grid = document.getElementById('books-grid');
  const filtersDiv = document.getElementById('category-filters');
  const searchInput = document.getElementById('search-input');
  const searchBtn = document.getElementById('search-btn');

  // Check URL params for pre-selected category
  const urlParams = new URLSearchParams(window.location.search);
  let activeCategory = urlParams.get('category') || 'all';

  // Render category filter buttons
  function renderFilters() {
    const allBtn = `<button data-cat="all" class="cat-filter-btn px-6 py-2 rounded-full font-medium text-sm transition-all ${activeCategory === 'all' ? 'bg-[#9deeed] text-[#0b6e6e] font-bold' : 'bg-white text-[#454749] hover:bg-[#e7e8e9]'} border border-gray-100">All Books</button>`;
    const catBtns = categories.map(cat =>
      `<button data-cat="${cat.id}" class="cat-filter-btn px-6 py-2 rounded-full font-medium text-sm transition-all ${activeCategory === cat.id ? 'bg-[#9deeed] text-[#0b6e6e] font-bold' : 'bg-white text-[#454749] hover:bg-[#e7e8e9]'} border border-gray-100">
        <span class="material-symbols-outlined text-[14px] align-middle mr-1">${cat.icon}</span>${cat.name}
      </button>`
    ).join('');
    filtersDiv.innerHTML = allBtn + catBtns;

    // Add click handlers
    filtersDiv.querySelectorAll('.cat-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        activeCategory = btn.dataset.cat;
        renderFilters();
        renderBooks();
      });
    });
  }

  // Render books grid
  function renderBooks() {
    const query = (searchInput ? searchInput.value : '').toLowerCase().trim();
    let filtered = books;

    // Filter by category
    if (activeCategory !== 'all') {
      filtered = filtered.filter(b => b.category === activeCategory);
    }

    // Filter by search
    if (query) {
      filtered = filtered.filter(b =>
        b.title.toLowerCase().includes(query) ||
        b.author.toLowerCase().includes(query) ||
        b.category.toLowerCase().includes(query) ||
        (b.title_ur && b.title_ur.includes(query)) ||
        (b.description && b.description.toLowerCase().includes(query)) ||
        (b.tags && b.tags.some(t => t.toLowerCase().includes(query)))
      );
    }

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="col-span-full text-center py-16">
          <span class="material-symbols-outlined text-6xl text-slate-300 mb-4 block">search_off</span>
          <p class="font-headline font-bold text-lg text-slate-400">No books found</p>
          <p class="text-sm text-slate-400 mt-2">Try a different search term or category</p>
        </div>`;
      return;
    }

    grid.innerHTML = filtered.map(book => renderBookCard(book)).join('');
  }

  // Search handlers
  if (searchInput) {
    searchInput.addEventListener('input', () => renderBooks());
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') renderBooks();
    });
  }
  if (searchBtn) {
    searchBtn.addEventListener('click', () => renderBooks());
  }

  // Initial render
  renderFilters();
  renderBooks();
});
