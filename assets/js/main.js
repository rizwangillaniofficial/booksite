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
  initGallery();
  loadHomepageBooks();
  loadHomepageCategories();
  loadCategoriesPage();
});

// ---- Load Page Content (Dynamic Text) ----
async function loadPageContent() {
  if (!window.db) return;
  const path = window.location.pathname;
  let docId = '';
  if (path.includes('index.html') || path === '/' || path.endsWith('/')) docId = 'home';
  else if (path.includes('about.html')) docId = 'about';
  else if (path.includes('contact.html')) docId = 'contact';
  else if (path.includes('gallery.html')) docId = 'gallery';
  
  if (!docId) return;

  try {
    const doc = await window.db.collection('pages').doc(docId).get();
    if (doc.exists) {
      const data = doc.data();
      const safeText = (id, text) => { 
        const el = document.getElementById(id); 
        if(el && text) { el.innerHTML = text; }
      };
      const updateImage = (id, url) => {
        const el = document.getElementById(id);
        if (el && url) el.src = url;
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
        updateImage('dyn-home-img-hero', data.imgHero);
        updateImage('dyn-home-img-archive', data.imgArchive);
        updateImage('dyn-home-img-library', data.imgLibrary);
      } else if (docId === 'about') {
        safeText('dyn-about-tag', data.heroTag || 'Founder');
        safeText('dyn-about-title-main', data.heroTitle || 'Syed Ejaz Gillani');
        if(data.heroBio) safeText('dyn-about-bio', data.heroBio);
        safeText('dyn-about-quote', data.quote || '"Knowledge is a universal heritage, and digital preservation is our duty to the future."');
        safeText('dyn-about-title', data.title || 'Our Story');
        safeText('dyn-about-sub', data.subtitle || '');
        safeText('dyn-about-content', data.content || 'Founded on the principle that knowledge is a universal heritage...');
        safeText('dyn-about-miss-title', data.missionTitle || 'Mission');
        safeText('dyn-about-miss-text', data.missionText || 'To democratize access to the world\'s scholarly and cultural knowledge...');
        safeText('dyn-about-vis-title', data.visionTitle || 'Vision');
        safeText('dyn-about-vis-text', data.visionText || 'To become the preeminent global archive for digital wisdom...');
        updateImage('dyn-about-img-profile', data.imgProfile);
      } else if (docId === 'contact') {
        safeText('dyn-contact-title', data.title || 'Let\'s Connect with the Archive.');
        safeText('dyn-contact-sub', data.subtitle || 'Have a question about our collections or need assistance with digital access?');
        safeText('dyn-contact-address', data.address || '123 Library Lane, Academic District<br>Digital City, DC 45678');
        safeText('dyn-contact-email', data.email || 'support@syedejazlibrary.com');
        safeText('dyn-contact-phone', data.phone || '+1 (555) 012-3456');
        updateImage('dyn-contact-img-accent', data.imgAccent);
        updateImage('dyn-contact-img-map', data.imgMap);
      } else if (docId === 'gallery') {
        safeText('dyn-gallery-tag', data.tag || 'Our Visual Heritage');
        safeText('dyn-gallery-title', data.title || 'Gallery');
        safeText('dyn-gallery-sub', data.subtitle || 'A visual journey through our heritage and events. Exploring the depths of the Syed Ejaz Digital Library through curated artifacts and community moments.');
      }
    } else {
      // If document doesn't exist, seed default content for gallery
      if (docId === 'gallery') {
        const defaultGalleryPage = {
          tag: 'Our Visual Heritage',
          title: 'Gallery',
          subtitle: 'A visual journey through our heritage and events. Exploring the depths of the Syed Ejaz Digital Library through curated artifacts and community moments.'
        };
        await window.db.collection('pages').doc('gallery').set(defaultGalleryPage);
        safeText('dyn-gallery-tag', defaultGalleryPage.tag);
        safeText('dyn-gallery-title', defaultGalleryPage.title);
        safeText('dyn-gallery-sub', defaultGalleryPage.subtitle);
      }
    }
  } catch (err) {
    console.error("Failed to load page content:", err);
  }
}

// ---- Load Gallery Items ----
async function initGallery() {
  const grid = document.getElementById('gallery-grid');
  if (!grid || !window.db) return;
  
  try {
    const snap = await window.db.collection('gallery').get();
    let items = [];
    
    // Seed initial gallery items if database is empty
    if (snap.empty) {
      const defaultItems = [
        { title: "With Qasim Ali Shah", category: "Events", url: "https://scontent.flhe25-1.fna.fbcdn.net/v/t39.30808-6/598333741_733011743209827_3449996546459891379_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=7b2446&_nc_eui2=AeGfGl2QO2jTu_woTN1eTDHsiac_KkeA1xyJpz8qR4DXHDpNjWx-ersuToNtpJ_tqPB7iZMlgS0R0X059k21s5mt&_nc_ohc=BusyXGqc12MQ7kNvwHsjuDl&_nc_oc=AdpWC7uKnJ--8NdcD7fgVfr1T1bx8ADkGA4qL13h3Q8RmWwrskJFskxqcOtKGmt8JPs&_nc_zt=23&_nc_ht=scontent.flhe25-1.fna&_nc_gid=9O1uv-zlzAnWsisUIbZduQ&_nc_ss=7a3a8&oh=00_Af1oQZoI8XyF6IhPdIPCcXf7I4cfHkQGsmm5WxJEGwfvug&oe=69E06747" },
        { title: "With Rubina Faisal", category: "Events", url: "https://scontent.flhe25-1.fna.fbcdn.net/v/t39.30808-6/517256608_602520922925577_8379562873143077191_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=13d280&_nc_eui2=AeEIeCJN3j-eeo8Eq1niLysKB8pHoJ319Q0HykegnfX1DVPy9S3ga1huEb9jFN-h9UpXNEU89gqZcJ7oSXT1hnwS&_nc_ohc=dW5KUjy4tJMQ7kNvwEx9eEX&_nc_oc=AdoImF8vVo-gVpJQ2jpUZE37h2V8d4aX-WeaBzUeXkhk7-mzAp5NJh-gFa3JGpJmeys&_nc_zt=23&_nc_ht=scontent.flhe25-1.fna&_nc_gid=jPG1XZixXpun6MkmlC8oFQ&_nc_ss=7a3a8&oh=00_Af15rANtxOpy3BYvIZ87IdsJSnYGq66vWZNcZZkFYCf5Cg&oe=69E05DC2" },
        { title: "With Dr Amjid Saqib", category: "Events", url: "https://scontent.flhe25-1.fna.fbcdn.net/v/t39.30808-6/647039666_797322890112045_386960210985654729_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=7b2446&_nc_eui2=AeGowxWLNiUgnsVb1fgTPILWkkhYyyNBPe-SSFjLI0E97-skyS0hBm9YjbYUj35CzsfTVVd0cCMfBKZbNFyCz8y5&_nc_ohc=t8OAa2cxumIQ7kNvwHveqA4&_nc_oc=AdoCworxmz6e4F-p8n668kAO50tic4q6HNNHkzAfUIABFDl29ZyyA5OPSVEtoPRcgH8&_nc_zt=23&_nc_ht=scontent.flhe25-1.fna&_nc_gid=rOMN8IxBo5W48GfeBLFGiA&_nc_ss=7a3a8&oh=00_Af3bDCc-o9uQAkwqYIuHGiH69olzinOQN_TsE1iqARatHg&oe=69E05E40" },
        { title: "With Syed Ali Haider", category: "Events", url: "https://scontent.flhe25-1.fna.fbcdn.net/v/t39.30808-6/493337915_544434982067505_1834908677159886631_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=7b2446&_nc_eui2=AeH5EPCZixzb4Vy4wHxmb-nTdPC3Q2_f5mt08LdDb9_ma2_WDEUKvmctHHU1TJOz05-sVSUQDeoVIr9N3VmrgNej&_nc_ohc=rWR1w-ICdP4Q7kNvwFTFOqR&_nc_oc=AdqSwOpOW-mhCCNn9Jc3HQ1imiKHZRp39bJkl0CCGlpkYx_XrhFgYOVz6ZvBcGDuCzU&_nc_zt=23&_nc_ht=scontent.flhe25-1.fna&_nc_gid=93KVHlWzc98whaJXz3r9cg&_nc_ss=7a3a8&oh=00_Af3f-v4zzAZQ7ZX-bO3egaOScawJuHct0WkDhpVgCGQ72Q&oe=69E09463" },
        { title: "With Dr. Faizalat Bano", category: "Events", url: "https://scontent.flhe25-1.fna.fbcdn.net/v/t39.30808-6/491950325_540171372493866_8180168048676830072_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=7b2446&_nc_eui2=AeFbCeKwadP4eJPCySyjgidXuOpY_l-ZZxu46lj-X5lnG38HB_zqvvwv2MDHSfW50HZbgz2TtWVQmS5GWXiPYpKl&_nc_ohc=SY0Q-PNVZF8Q7kNvwESTI_1&_nc_oc=AdodjNijkj8TLjamIon8nLdXeGlp3my3lhqxoMOPb6d12Qqx9qECpZ-Kn0pQuIPmxqQ&_nc_zt=23&_nc_ht=scontent.flhe25-1.fna&_nc_gid=8_5tc4XsVaYAz9xPJ6eKkQ&_nc_ss=7a3a8&oh=00_Af1XrFVEDGbl748XLIvK_j7Z20cz1uSqnKlqvTokOc_mjQ&oe=69E07156" },
        { title: "With Sardar Latif Khan Khosa", category: "Events", url: "https://scontent.flhe25-1.fna.fbcdn.net/v/t39.30808-6/509424731_583068884870781_5971707440883188624_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=7b2446&_nc_eui2=AeEppGwgnLtN21wtSXlKB0yNR1mFPZIYQXJHWYU9khhBcrTv-mdYb9xUoiXsLUecy-i_GxWcmE81kwFOFAjNf56H&_nc_ohc=hdgv8-HXcT4Q7kNvwEl23xL&_nc_oc=AdqNikGD5htKAxbeSUwJU3QpgMiHmgqabyPNadGWN_55F44hE3u_pFnCWpU-B-XxpyA&_nc_zt=23&_nc_ht=scontent.flhe25-1.fna&_nc_gid=OWz7MkSaSD4429LMa_QGXg&_nc_ss=7a3a8&oh=00_Af3-NR10CZ7PR9nz3pvkMAUvTgfKgbyZcwC9SqxxEE3g2g&oe=69E088CC" },
        { title: "With Late Tajmal Kaleem", category: "Events", url: "https://scontent.flhe25-1.fna.fbcdn.net/v/t39.30808-6/534677448_631617730015896_188242810554214877_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=13d280&_nc_eui2=AeHWWmqjgDnLrw3CyzCwFPNChLW-ODSA7H2Etb44NIDsfWns0DeR4JpgCVaN3m-jGT6mz4ajO3OfW3jnPizKJL6K&_nc_ohc=PbyjBqMXIb4Q7kNvwFUhNVi&_nc_oc=Ado2uDYLP8-KHbY5UCyy6mZcerarr1V5WlxPa_9EJEaQq5tesoN8g4-xk48jPR-w-Vs&_nc_zt=23&_nc_ht=scontent.flhe25-1.fna&_nc_gid=O10RLuuh37hDA-06dQJ-4Q&_nc_ss=7a3a8&oh=00_Af0Ue5dKCRn3UkzwJLYVdPkXdrvw9Mk94rImqCRILwDdjg&oe=69E06E94" },
        { title: "With Ikram Arefi", category: "Events", url: "https://scontent.flhe25-1.fna.fbcdn.net/v/t39.30808-6/497089659_557552677422402_5105729681853363677_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=7b2446&_nc_eui2=AeHJBOTZRZBZ8fiQlzBQyV0Ato9wXAgVCNy2j3BcCBUI3NWHHUbkeSz1KZ9KBM3bhrWlfUQg6VWFziT7pO934Vnn&_nc_ohc=P8SL0r-iWZwQ7kNvwELR_aS&_nc_oc=AdrTTvQw_Xpw4ygFPCEVPkz-3mI6FROFvL-ddUnHh1OG89PWyadHp0hCl7PeQJ8OWfc&_nc_zt=23&_nc_ht=scontent.flhe25-1.fna&_nc_gid=ar27AyZ5I51_OO-LpGhW_A&_nc_ss=7a3a8&oh=00_Af2oR1kv9yAEIugYOL6m83GBOjcCOiPSvfCRovQB1SYUsw&oe=69E0773A" }
      ];
      
      const batch = window.db.batch();
      defaultItems.forEach((item, index) => {
        const ref = window.db.collection('gallery').doc('default_image_' + index);
        batch.set(ref, item);
        items.push(item); // Add to local items so they render immediately
      });
      await batch.commit();
      console.log("Seeded default gallery items.");
    } else {
      snap.forEach(doc => items.push(doc.data()));
    }
    
    const renderItems = (filter) => {
      let html = '';
      items.forEach(item => {
        if (filter === 'all' || item.category === filter) {
          html += `
            <div class="gallery-card group relative overflow-hidden bg-surface-container-lowest rounded-[1rem] transition-all duration-300 shadow-[0px_20px_40px_rgba(25,28,29,0.05)]">
            <div class="aspect-[3/4] overflow-hidden rounded-[1rem]">
            <img alt="${item.title}" class="w-full h-full object-cover transition-transform duration-500 ease-in-out" src="${item.url || 'assets/images/placeholder.jpg'}">
            </div>
            <div class="p-5">
            <span class="text-[0.65rem] font-label font-bold uppercase tracking-wider text-secondary">${item.category}</span>
            <h3 class="font-headline font-bold text-primary mt-1">${item.title}</h3>
            </div>
            </div>
          `;
        }
      });
      grid.innerHTML = html || '<div class="col-span-full text-center text-slate-500 py-10">No memories found.</div>';
    };
    
    renderItems('all');
    
    // Filter Buttons
    const btns = document.querySelectorAll('.gallery-filter-btn');
    btns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        // Reset styles
        btns.forEach(b => {
          b.classList.remove('bg-primary', 'text-white');
          b.classList.add('bg-surface-container-high', 'text-on-surface');
        });
        // Set active style
        e.target.classList.remove('bg-surface-container-high', 'text-on-surface');
        e.target.classList.add('bg-primary', 'text-white');
        
        renderItems(e.target.dataset.filter);
      });
    });
    
  } catch (err) {
    console.error("Error loading gallery:", err);
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
          ${book.pdf_url ? `<a href="${book.pdf_url.replace('/preview','/view')}" target="_blank" rel="noopener noreferrer" class="py-2.5 px-3 bg-gray-100 dark:bg-slate-700 text-on-surface dark:text-white rounded-lg hover:bg-[#006a6a] hover:text-white transition-all" title="Open PDF"><span class="material-symbols-outlined text-[18px]">open_in_new</span></a>` : ''}
        </div>
      </div>
    </div>`;
}

// ---- Render Category Card ----
function renderCategoryCard(cat) {
  const count = cat.count || 0;
  return `
    <a href="books.html?category=${cat.id}" class="cat-card bg-white dark:bg-slate-800 p-8 rounded-xl text-center block cursor-pointer border border-gray-100 dark:border-slate-700">
      <span class="material-symbols-outlined text-4xl text-[#006a6a] mb-3 block">${cat.icon}</span>
      <span class="font-headline font-bold text-on-surface dark:text-white text-sm block">${cat.name}</span>
      ${cat.name_ur ? `<span class="urdu-text text-xs text-slate-400 block mt-1">${cat.name_ur}</span>` : ''}
      <span class="text-xs text-slate-400 mt-1 block">${count} book${count !== 1 ? 's' : ''}</span>
    </a>`;
}

// ---- Load Featured Books on Homepage ----
async function loadHomepageBooks() {
  const grid = document.getElementById('featured-books-grid');
  if (!grid || !window.db) return;

  try {
    const snap = await window.db.collection('books').get();
    if (snap.empty) return; // keep hardcoded fallback if no books

    let html = '';
    let count = 0;
    snap.forEach(doc => {
      if (count >= 4) return; // show max 4 featured
      const book = doc.data();
      html += renderBookCard(book);
      count++;
    });
    if (html) grid.innerHTML = html;
  } catch (e) {
    console.error("Error loading featured books:", e);
  }
}

// ---- Load Categories on Homepage ----
async function loadHomepageCategories() {
  const grid = document.getElementById('home-categories-grid');
  if (!grid || !window.db) return;

  try {
    const catsSnap = await window.db.collection('categories').get();
    if (catsSnap.empty) return; // keep hardcoded fallback

    // Count books per category
    const booksSnap = await window.db.collection('books').get();
    const bookCounts = {};
    booksSnap.forEach(doc => {
      const cat = doc.data().category;
      bookCounts[cat] = (bookCounts[cat] || 0) + 1;
    });

    let html = '';
    catsSnap.forEach(doc => {
      const cat = doc.data();
      html += `
        <a href="books.html?category=${cat.id}" class="bg-surface-container-lowest p-8 rounded-xl text-center group hover:-translate-y-2 transition-all duration-300 cursor-pointer block">
          <span class="material-symbols-outlined text-4xl text-secondary mb-4 group-hover:scale-110 transition-transform block">${cat.icon}</span>
          <span class="font-headline font-bold text-on-surface text-sm block">${cat.name}</span>
          ${cat.name_ur ? `<span class="urdu-text text-xs text-slate-400 block mt-1">${cat.name_ur}</span>` : ''}
          <span class="text-xs text-slate-400 mt-1 block">${bookCounts[cat.id] || 0} books</span>
        </a>`;
    });
    if (html) grid.innerHTML = html;
  } catch (e) {
    console.error("Error loading homepage categories:", e);
  }
}

// ---- Load Categories Page ----
async function loadCategoriesPage() {
  const container = document.getElementById('categories-dynamic-container');
  if (!container || !window.db) return;

  try {
    const [catsSnap, booksSnap] = await Promise.all([
      window.db.collection('categories').get(),
      window.db.collection('books').get()
    ]);

    // Group books by category
    const booksByCategory = {};
    booksSnap.forEach(doc => {
      const book = doc.data();
      if (!booksByCategory[book.category]) booksByCategory[book.category] = [];
      booksByCategory[book.category].push(book);
    });

    let html = '';
    catsSnap.forEach(doc => {
      const cat = doc.data();
      const books = booksByCategory[cat.id] || [];
      
      html += `
        <section id="${cat.id}" class="mb-20">
          <div class="flex items-end justify-between mb-12">
            <div>
              <h2 class="text-3xl font-headline font-bold text-on-surface mb-2">
                <span class="material-symbols-outlined text-secondary align-middle mr-2">${cat.icon}</span>${cat.name}
                ${cat.name_ur ? `<span class="urdu-text text-lg text-slate-400 ml-2">${cat.name_ur}</span>` : ''}
              </h2>
              <div class="h-1 w-20 gradient-button rounded-full"></div>
            </div>
            <a class="text-secondary font-semibold flex items-center gap-2 hover:gap-3 transition-all" href="books.html?category=${cat.id}">
              View All (${books.length}) <span class="material-symbols-outlined">arrow_forward</span>
            </a>
          </div>`;

      if (books.length === 0) {
        html += `<p class="text-slate-400 text-center py-8">No books in this category yet.</p>`;
      } else {
        html += `<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">`;
        books.slice(0, 3).forEach(book => { html += renderBookCard(book); });
        html += `</div>`;
      }
      html += `</section>`;
    });

    if (html) container.innerHTML = html;
  } catch (e) {
    console.error("Error loading categories page:", e);
  }
}

