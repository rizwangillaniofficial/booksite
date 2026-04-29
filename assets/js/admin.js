/* ============================================
   Syed Ejaz Gillani Digital Library
   admin.js — Admin Dashboard Logic (Firebase)
   ============================================ */

const ADMIN_PWD = "admin"; // Simple password for demo. Real app should use Firebase Auth
let currentTab = 'books';
let editId = null;

// DOM Elements
const loginModal = document.getElementById('login-modal');
const adminDashboard = document.getElementById('admin-dashboard');
const pwdInput = document.getElementById('admin-pwd');
const loginBtn = document.getElementById('login-btn');
const loginErr = document.getElementById('login-err');
const tableBody = document.getElementById('data-table-body');
const formModal = document.getElementById('form-modal');
const dataForm = document.getElementById('data-form');
const tabTitle = document.getElementById('tab-title');

// Login Logic
loginBtn.addEventListener('click', () => {
  if (pwdInput.value === ADMIN_PWD) {
    loginModal.classList.add('hidden');
    adminDashboard.classList.remove('hidden');
    loadData();
  } else {
    loginErr.classList.remove('hidden');
  }
});
pwdInput.addEventListener('keypress', (e) => { if(e.key === 'Enter') loginBtn.click() });

// Tab Switching
window.switchTab = (tab) => {
  currentTab = tab;
  document.querySelectorAll('.tab-btn').forEach(btn => {
    if(btn.dataset.tab === tab) {
      btn.classList.replace('text-slate-600', 'text-[#006a6a]');
      btn.classList.replace('bg-transparent', 'bg-gray-100');
      btn.classList.add('bg-gray-100');
    } else {
      btn.classList.replace('text-[#006a6a]', 'text-slate-600');
      btn.classList.remove('bg-gray-100');
    }
  });
  tabTitle.textContent = `Manage ${tab.charAt(0).toUpperCase() + tab.slice(1)}`;
  
  const tabSubtitle = tabTitle.nextElementSibling;
  if (tab === 'pages' || tab === 'settings') {
    document.getElementById('add-new-btn').classList.add('hidden');
    tabSubtitle.textContent = 'Edit existing content and configuration for your site.';
  } else {
    document.getElementById('add-new-btn').classList.remove('hidden');
    tabSubtitle.textContent = 'Add, edit, or delete items from your database.';
  }
  loadData();
};

// Data Loading (Real-time from Firestore)
function loadData() {
  if(!window.db) return tableBody.innerHTML = `<tr><td colspan="3" class="px-6 py-8 text-center text-red-500">Firebase not initialized!</td></tr>`;
  
  tableBody.innerHTML = `<tr><td colspan="3" class="px-6 py-12 text-center text-slate-400"><span class="material-symbols-outlined animate-spin">refresh</span></td></tr>`;
  
  window.db.collection(currentTab).onSnapshot(snapshot => {
    if (snapshot.empty && currentTab !== 'pages' && currentTab !== 'settings') {
      tableBody.innerHTML = `<tr><td colspan="3" class="px-6 py-12 text-center text-slate-400">No data found. Add your first item!</td></tr>`;
      return;
    }
    
    let html = '';
    
    if (currentTab === 'pages') {
      ['home', 'about', 'contact'].forEach(id => {
        html += `
          <tr class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 font-bold text-slate-800 capitalize">${id} Page</td>
            <td class="px-6 py-4 text-sm text-slate-500">Edit text content for the ${id} page.</td>
            <td class="px-6 py-4 text-right">
              <button onclick="editItem('${id}')" class="px-4 py-2 bg-gray-100 text-[#006a6a] font-medium rounded-lg hover:bg-gray-200 transition-colors text-sm">Edit Content</button>
            </td>
          </tr>
        `;
      });
    } else if (currentTab === 'settings') {
      html += `
        <tr class="hover:bg-gray-50 transition-colors">
          <td class="px-6 py-4 font-bold text-slate-800 capitalize">General Settings</td>
          <td class="px-6 py-4 text-sm text-slate-500">Site title, footer, social links.</td>
          <td class="px-6 py-4 text-right">
            <button onclick="editItem('general')" class="px-4 py-2 bg-gray-100 text-[#006a6a] font-medium rounded-lg hover:bg-gray-200 transition-colors text-sm">Edit Settings</button>
          </td>
        </tr>
      `;
    } else {
      snapshot.forEach(doc => {
        const data = doc.data();
        const id = doc.id;
        
        if (currentTab === 'books') {
          html += `
            <tr class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4">
                <div class="flex items-center gap-4">
                  <img src="${data.cover || 'assets/images/placeholder.jpg'}" class="w-12 h-16 object-cover rounded bg-gray-100 shadow-sm">
                  <div>
                    <div class="font-bold text-slate-800">${data.title}</div>
                    <div class="text-xs text-slate-500">${data.author}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <span class="inline-block px-2.5 py-1 bg-gray-100 text-xs font-semibold rounded-full text-slate-600 mb-1">${data.category}</span>
                <div class="text-xs text-slate-400">${data.year} • ${data.language || 'Urdu'}</div>
              </td>
              <td class="px-6 py-4 text-right">
                <button onclick="editItem('${id}')" class="p-2 text-slate-400 hover:text-[#006a6a] transition-colors" title="Edit"><span class="material-symbols-outlined text-[20px]">edit</span></button>
                <button onclick="deleteItem('${id}')" class="p-2 text-slate-400 hover:text-red-500 transition-colors" title="Delete"><span class="material-symbols-outlined text-[20px]">delete</span></button>
              </td>
            </tr>
          `;
        } else if (currentTab === 'categories') {
          html += `
            <tr class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <span class="material-symbols-outlined text-2xl text-[#006a6a]">${data.icon}</span>
                  <span class="font-bold text-slate-800">${data.name}</span>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-slate-500">${data.id} (ID)</td>
              <td class="px-6 py-4 text-right">
                <button onclick="editItem('${id}')" class="p-2 text-slate-400 hover:text-[#006a6a] transition-colors"><span class="material-symbols-outlined text-[20px]">edit</span></button>
                <button onclick="deleteItem('${id}')" class="p-2 text-slate-400 hover:text-red-500 transition-colors"><span class="material-symbols-outlined text-[20px]">delete</span></button>
              </td>
            </tr>
          `;
        } else if (currentTab === 'gallery') {
          html += `
            <tr class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4">
                <div class="flex items-center gap-4">
                  <img src="${data.url}" class="w-20 h-16 object-cover rounded bg-gray-100 shadow-sm">
                  <div class="font-bold text-slate-800">${data.title}</div>
                </div>
              </td>
              <td class="px-6 py-4">
                <span class="inline-block px-2.5 py-1 bg-gray-100 text-xs font-semibold rounded-full text-slate-600">${data.category}</span>
              </td>
              <td class="px-6 py-4 text-right">
                <button onclick="editItem('${id}')" class="p-2 text-slate-400 hover:text-[#006a6a] transition-colors"><span class="material-symbols-outlined text-[20px]">edit</span></button>
                <button onclick="deleteItem('${id}')" class="p-2 text-slate-400 hover:text-red-500 transition-colors"><span class="material-symbols-outlined text-[20px]">delete</span></button>
              </td>
            </tr>
          `;
        }
      });
    }
    tableBody.innerHTML = html;
  }, err => {
    tableBody.innerHTML = `<tr><td colspan="3" class="px-6 py-8 text-center text-red-500">Error loading data: ${err.message}</td></tr>`;
  });
}

// Modal Form Logic
document.getElementById('add-new-btn').addEventListener('click', () => openForm());
document.getElementById('close-modal').addEventListener('click', () => {
  if (typeof tinymce !== 'undefined') tinymce.remove();
  formModal.classList.add('hidden');
});
document.getElementById('cancel-btn').addEventListener('click', () => {
  if (typeof tinymce !== 'undefined') tinymce.remove();
  formModal.classList.add('hidden');
});

function openForm(docData = null, docId = null) {
  editId = docId;
  document.getElementById('form-title').textContent = editId ? `Edit ${currentTab.slice(0,-1)}` : `Add New ${currentTab.slice(0,-1)}`;
  
  if (currentTab === 'books') {
    dataForm.innerHTML = `
      <div class="grid grid-cols-2 gap-4">
        <div class="col-span-2"><label class="block text-sm font-bold text-slate-700 mb-1">Book Title (English)</label><input type="text" id="b-title" class="w-full px-3 py-2 border rounded-lg" value="${docData?.title || ''}" required></div>
        <div class="col-span-2"><label class="block text-sm font-bold text-slate-700 mb-1">Book Title (Urdu)</label><input type="text" id="b-title-ur" class="w-full px-3 py-2 border rounded-lg urdu-text" value="${docData?.title_ur || ''}" dir="rtl"></div>
        <div><label class="block text-sm font-bold text-slate-700 mb-1">Author</label><input type="text" id="b-author" class="w-full px-3 py-2 border rounded-lg" value="${docData?.author || 'Syed Ejaz Gillani'}" required></div>
        <div><label class="block text-sm font-bold text-slate-700 mb-1">Year</label><input type="text" id="b-year" class="w-full px-3 py-2 border rounded-lg" value="${docData?.year || ''}"></div>
        <div><label class="block text-sm font-bold text-slate-700 mb-1">Category ID</label><input type="text" id="b-cat" class="w-full px-3 py-2 border rounded-lg" value="${docData?.category || ''}" placeholder="e.g. literature" required></div>
        <div>
          <label class="block text-sm font-bold text-slate-700 mb-1">Cover Image URL or Upload</label>
          <input type="text" id="b-cover" class="w-full px-3 py-2 border rounded-lg mb-2" value="${docData?.cover || ''}" placeholder="https://...">
          <input type="file" id="b-cover-file" class="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#006a6a]/10 file:text-[#006a6a] hover:file:bg-[#006a6a]/20" accept="image/*">
        </div>
        <div class="col-span-2">
          <label class="block text-sm font-bold text-slate-700 mb-1">PDF URL or Upload File</label>
          <input type="text" id="b-pdf" class="w-full px-3 py-2 border rounded-lg mb-2" value="${docData?.pdf_url || ''}" placeholder="Leave blank if not available">
          <input type="file" id="b-pdf-file" class="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#006a6a]/10 file:text-[#006a6a] hover:file:bg-[#006a6a]/20" accept="application/pdf">
        </div>
        <div class="col-span-2"><label class="block text-sm font-bold text-slate-700 mb-1">Description</label><textarea id="b-desc" class="w-full px-3 py-2 border rounded-lg h-24 rich-text">${docData?.description || ''}</textarea></div>
      </div>
    `;
  } else if (currentTab === 'categories') {
    dataForm.innerHTML = `
      <div class="space-y-4">
        <div><label class="block text-sm font-bold text-slate-700 mb-1">Category ID (no spaces)</label><input type="text" id="c-id" class="w-full px-3 py-2 border rounded-lg" value="${docData?.id || ''}" ${editId?'disabled':''} required></div>
        <div><label class="block text-sm font-bold text-slate-700 mb-1">Name (English)</label><input type="text" id="c-name" class="w-full px-3 py-2 border rounded-lg" value="${docData?.name || ''}" required></div>
        <div><label class="block text-sm font-bold text-slate-700 mb-1">Name (Urdu)</label><input type="text" id="c-name-ur" class="w-full px-3 py-2 border rounded-lg urdu-text" value="${docData?.name_ur || ''}" dir="rtl"></div>
        <div><label class="block text-sm font-bold text-slate-700 mb-1">Material Icon Name</label><input type="text" id="c-icon" class="w-full px-3 py-2 border rounded-lg" value="${docData?.icon || 'category'}" required></div>
      </div>
    `;
  } else if (currentTab === 'gallery') {
    dataForm.innerHTML = `
      <div class="space-y-4">
        <div><label class="block text-sm font-bold text-slate-700 mb-1">Title</label><input type="text" id="g-title" class="w-full px-3 py-2 border rounded-lg" value="${docData?.title || ''}" required></div>
        <div><label class="block text-sm font-bold text-slate-700 mb-1">Category (Events/Family/Travel)</label><input type="text" id="g-cat" class="w-full px-3 py-2 border rounded-lg" value="${docData?.category || 'Events'}" required></div>
        <div>
          <label class="block text-sm font-bold text-slate-700 mb-1">Image URL or Upload</label>
          <input type="text" id="g-url" class="w-full px-3 py-2 border rounded-lg mb-2" value="${docData?.url || ''}">
          <input type="file" id="g-file" class="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#006a6a]/10 file:text-[#006a6a] hover:file:bg-[#006a6a]/20" accept="image/*">
        </div>
      </div>
    `;
  } else if (currentTab === 'pages') {
    if (editId === 'home') {
      dataForm.innerHTML = `
        <div class="space-y-4">
          <h4 class="font-bold text-lg border-b pb-2 text-secondary">Hero Section</h4>
          <div><label class="block text-sm font-bold text-slate-700 mb-1">Hero Title</label><input type="text" id="p-hero-title" class="w-full px-3 py-2 border rounded-lg" value="${docData?.heroTitle || 'Syed Ejaz Gillani'}"></div>
          <div><label class="block text-sm font-bold text-slate-700 mb-1">Hero Subtitle</label><textarea id="p-hero-sub" class="w-full px-3 py-2 border rounded-lg h-24 rich-text">${docData?.heroSubtitle || 'A Pakistani Canadian writer...'}</textarea></div>
          
          <h4 class="font-bold text-lg border-b pb-2 mt-6 text-secondary">Floating Card</h4>
          <div class="grid grid-cols-2 gap-4">
            <div><label class="block text-sm font-bold text-slate-700 mb-1">Tag (e.g. New Arrival)</label><input type="text" id="p-new-tag" class="w-full px-3 py-2 border rounded-lg" value="${docData?.newArrivalTag || 'New Arrival'}"></div>
            <div><label class="block text-sm font-bold text-slate-700 mb-1">Author / Sub</label><input type="text" id="p-new-author" class="w-full px-3 py-2 border rounded-lg" value="${docData?.newArrivalAuthor || 'by Syed Ejaz Gillani'}"></div>
            <div class="col-span-2"><label class="block text-sm font-bold text-slate-700 mb-1">Title</label><input type="text" id="p-new-title" class="w-full px-3 py-2 border rounded-lg" value="${docData?.newArrivalTitle || 'Uncover the Latest in Knowledge'}"></div>
          </div>

          <h4 class="font-bold text-lg border-b pb-2 mt-6 text-secondary">About Section</h4>
          <div><label class="block text-sm font-bold text-slate-700 mb-1">Title</label><input type="text" id="p-about-title" class="w-full px-3 py-2 border rounded-lg" value="${docData?.aboutTitle || 'Read More, Learn More, Grow More'}"></div>
          <div><label class="block text-sm font-bold text-slate-700 mb-1">Text Content</label><textarea id="p-about-text" class="w-full px-3 py-2 border rounded-lg h-24 rich-text">${docData?.aboutText || 'Syed Ejaz Digital Library is more than just a collection of books...'}</textarea></div>
          <div class="grid grid-cols-2 gap-4">
            <div><label class="block text-sm font-bold text-slate-700 mb-1">Stat 1 Number</label><input type="text" id="p-stat1-num" class="w-full px-3 py-2 border rounded-lg" value="${docData?.stat1Num || '7+'}"></div>
            <div><label class="block text-sm font-bold text-slate-700 mb-1">Stat 1 Label</label><input type="text" id="p-stat1-text" class="w-full px-3 py-2 border rounded-lg" value="${docData?.stat1Text || 'Digital Books'}"></div>
            <div><label class="block text-sm font-bold text-slate-700 mb-1">Stat 2 Number</label><input type="text" id="p-stat2-num" class="w-full px-3 py-2 border rounded-lg" value="${docData?.stat2Num || '120+'}"></div>
            <div><label class="block text-sm font-bold text-slate-700 mb-1">Stat 2 Label</label><input type="text" id="p-stat2-text" class="w-full px-3 py-2 border rounded-lg" value="${docData?.stat2Text || 'Global Archives'}"></div>
          </div>

          <h4 class="font-bold text-lg border-b pb-2 mt-6 text-secondary">Other Headings</h4>
          <div class="grid grid-cols-2 gap-4">
            <div><label class="block text-sm font-bold text-slate-700 mb-1">Featured Books Subtitle</label><input type="text" id="p-feat-sub" class="w-full px-3 py-2 border rounded-lg" value="${docData?.featuredSub || 'Our Curated Selection'}"></div>
            <div><label class="block text-sm font-bold text-slate-700 mb-1">Featured Books Title</label><input type="text" id="p-feat-title" class="w-full px-3 py-2 border rounded-lg" value="${docData?.featuredTitle || 'Featured Books'}"></div>
            
            <div><label class="block text-sm font-bold text-slate-700 mb-1">Categories Title</label><input type="text" id="p-cat-title" class="w-full px-3 py-2 border rounded-lg" value="${docData?.categoriesTitle || 'Browse by Category'}"></div>
            <div class="col-span-2"><label class="block text-sm font-bold text-slate-700 mb-1">Categories Subtitle</label><input type="text" id="p-cat-sub" class="w-full px-3 py-2 border rounded-lg" value="${docData?.categoriesSub || 'Explore our diverse collection across various genres and specialized academic disciplines.'}"></div>
            
            <div class="col-span-2"><label class="block text-sm font-bold text-slate-700 mb-1">Newsletter Title</label><input type="text" id="p-news-title" class="w-full px-3 py-2 border rounded-lg" value="${docData?.newsletterTitle || 'Stay Updated with New Archives'}"></div>
            <div class="col-span-2"><label class="block text-sm font-bold text-slate-700 mb-1">Newsletter Subtitle</label><input type="text" id="p-news-sub" class="w-full px-3 py-2 border rounded-lg" value="${docData?.newsletterSub || 'Join our monthly newsletter to receive updates on newly digitized historical collections and featured readings.'}"></div>
          </div>
        </div>
      `;
    } else if (editId === 'about') {
      dataForm.innerHTML = `
        <div class="space-y-4">
          <div><label class="block text-sm font-bold text-slate-700 mb-1">Title</label><input type="text" id="p-about-title" class="w-full px-3 py-2 border rounded-lg" value="${docData?.title || ''}"></div>
          <div><label class="block text-sm font-bold text-slate-700 mb-1">Subtitle</label><textarea id="p-about-sub" class="w-full px-3 py-2 border rounded-lg h-24 rich-text">${docData?.subtitle || ''}</textarea></div>
          <div><label class="block text-sm font-bold text-slate-700 mb-1">Content</label><textarea id="p-about-content" class="w-full px-3 py-2 border rounded-lg h-40 rich-text">${docData?.content || ''}</textarea></div>
        </div>
      `;
    } else if (editId === 'contact') {
      dataForm.innerHTML = `
        <div class="space-y-4">
          <div><label class="block text-sm font-bold text-slate-700 mb-1">Title</label><input type="text" id="p-contact-title" class="w-full px-3 py-2 border rounded-lg" value="${docData?.title || ''}"></div>
          <div><label class="block text-sm font-bold text-slate-700 mb-1">Subtitle</label><textarea id="p-contact-sub" class="w-full px-3 py-2 border rounded-lg h-24 rich-text">${docData?.subtitle || ''}</textarea></div>
          <div><label class="block text-sm font-bold text-slate-700 mb-1">Address</label><input type="text" id="p-contact-address" class="w-full px-3 py-2 border rounded-lg" value="${docData?.address || ''}"></div>
          <div><label class="block text-sm font-bold text-slate-700 mb-1">Email</label><input type="email" id="p-contact-email" class="w-full px-3 py-2 border rounded-lg" value="${docData?.email || ''}"></div>
          <div><label class="block text-sm font-bold text-slate-700 mb-1">Phone</label><input type="text" id="p-contact-phone" class="w-full px-3 py-2 border rounded-lg" value="${docData?.phone || ''}"></div>
        </div>
      `;
    }
  } else if (currentTab === 'settings') {
    dataForm.innerHTML = `
      <div class="space-y-4">
        <div><label class="block text-sm font-bold text-slate-700 mb-1">Site Title</label><input type="text" id="s-title" class="w-full px-3 py-2 border rounded-lg" value="${docData?.siteTitle || ''}"></div>
        <div><label class="block text-sm font-bold text-slate-700 mb-1">Footer Description</label><textarea id="s-footer" class="w-full px-3 py-2 border rounded-lg h-24 rich-text">${docData?.footerDesc || ''}</textarea></div>
        <div><label class="block text-sm font-bold text-slate-700 mb-1">Facebook URL</label><input type="url" id="s-fb" class="w-full px-3 py-2 border rounded-lg" value="${docData?.facebookUrl || ''}"></div>
        <div><label class="block text-sm font-bold text-slate-700 mb-1">YouTube URL</label><input type="url" id="s-yt" class="w-full px-3 py-2 border rounded-lg" value="${docData?.youtubeUrl || ''}"></div>
        <div><label class="block text-sm font-bold text-slate-700 mb-1">Contact Email</label><input type="email" id="s-email" class="w-full px-3 py-2 border rounded-lg" value="${docData?.emailUrl || ''}"></div>
      </div>
    `;
  }
  
  formModal.classList.remove('hidden');
  formModal.classList.add('flex');

  // Initialize TinyMCE for rich text areas
  if (typeof tinymce !== 'undefined') {
    tinymce.remove();
    tinymce.init({
      selector: 'textarea.rich-text',
      menubar: false,
      plugins: 'lists link image code table formatpainter',
      toolbar: 'undo redo | blocks | bold italic | alignleft aligncenter alignright | bullist numlist | link image | code',
      height: 300,
      skin: "oxide",
      content_css: "default",
      setup: function (editor) {
        editor.on('change', function () {
          editor.save();
        });
      }
    });
  }
}

// Save Data
async function uploadFile(file, folder) {
  if (!window.storage) throw new Error("Firebase Storage not initialized");
  const storageRef = window.storage.ref();
  const fileRef = storageRef.child(`${folder}/${Date.now()}_${file.name}`);
  await fileRef.put(file);
  return await fileRef.getDownloadURL();
}

document.getElementById('save-btn').addEventListener('click', async () => {
  if(!window.db) return showToast("Firebase not connected!", "error");
  if (typeof tinymce !== 'undefined') tinymce.triggerSave();
  
  const btn = document.getElementById('save-btn');
  btn.innerHTML = `<span class="material-symbols-outlined animate-spin">refresh</span> Saving...`;
  btn.disabled = true;
  
  try {
    let payload = {};
    
    if (currentTab === 'books') {
      let coverUrl = document.getElementById('b-cover').value;
      const coverFile = document.getElementById('b-cover-file')?.files[0];
      if (coverFile) {
        btn.innerHTML = `<span class="material-symbols-outlined animate-spin">refresh</span> Uploading Cover...`;
        coverUrl = await uploadFile(coverFile, 'covers');
      }

      let pdfUrl = document.getElementById('b-pdf').value;
      const pdfFile = document.getElementById('b-pdf-file')?.files[0];
      if (pdfFile) {
        btn.innerHTML = `<span class="material-symbols-outlined animate-spin">refresh</span> Uploading PDF...`;
        pdfUrl = await uploadFile(pdfFile, 'pdfs');
      }

      payload = {
        title: document.getElementById('b-title').value,
        title_ur: document.getElementById('b-title-ur').value,
        author: document.getElementById('b-author').value,
        year: document.getElementById('b-year').value,
        category: document.getElementById('b-cat').value,
        cover: coverUrl,
        pdf_url: pdfUrl,
        description: document.getElementById('b-desc').value,
        id: editId || Date.now().toString()
      };
      if(!payload.title || !payload.category) throw new Error("Title and Category required!");
    } 
    else if (currentTab === 'categories') {
      payload = {
        id: document.getElementById('c-id').value,
        name: document.getElementById('c-name').value,
        name_ur: document.getElementById('c-name-ur').value,
        icon: document.getElementById('c-icon').value
      };
      if(!payload.id || !payload.name) throw new Error("ID and Name required!");
    }
    else if (currentTab === 'gallery') {
      let imgUrl = document.getElementById('g-url').value;
      const imgFile = document.getElementById('g-file')?.files[0];
      if (imgFile) {
        btn.innerHTML = `<span class="material-symbols-outlined animate-spin">refresh</span> Uploading Image...`;
        imgUrl = await uploadFile(imgFile, 'gallery');
      }
      
      payload = {
        title: document.getElementById('g-title').value,
        category: document.getElementById('g-cat').value,
        url: imgUrl
      };
      if(!payload.url || !payload.title) throw new Error("Title and URL required!");
    }
    else if (currentTab === 'pages') {
      if (editId === 'home') {
        payload = {
          heroTitle: document.getElementById('p-hero-title').value,
          heroSubtitle: document.getElementById('p-hero-sub').value,
          newArrivalTag: document.getElementById('p-new-tag').value,
          newArrivalTitle: document.getElementById('p-new-title').value,
          newArrivalAuthor: document.getElementById('p-new-author').value,
          aboutTitle: document.getElementById('p-about-title').value,
          aboutText: document.getElementById('p-about-text').value,
          stat1Num: document.getElementById('p-stat1-num').value,
          stat1Text: document.getElementById('p-stat1-text').value,
          stat2Num: document.getElementById('p-stat2-num').value,
          stat2Text: document.getElementById('p-stat2-text').value,
          featuredSub: document.getElementById('p-feat-sub').value,
          featuredTitle: document.getElementById('p-feat-title').value,
          categoriesTitle: document.getElementById('p-cat-title').value,
          categoriesSub: document.getElementById('p-cat-sub').value,
          newsletterTitle: document.getElementById('p-news-title').value,
          newsletterSub: document.getElementById('p-news-sub').value
        };
      } else if (editId === 'about') {
        payload = {
          title: document.getElementById('p-about-title').value,
          subtitle: document.getElementById('p-about-sub').value,
          content: document.getElementById('p-about-content').value
        };
      } else if (editId === 'contact') {
        payload = {
          title: document.getElementById('p-contact-title').value,
          subtitle: document.getElementById('p-contact-sub').value,
          address: document.getElementById('p-contact-address').value,
          email: document.getElementById('p-contact-email').value,
          phone: document.getElementById('p-contact-phone').value
        };
      }
    }
    else if (currentTab === 'settings') {
      payload = {
        siteTitle: document.getElementById('s-title').value,
        footerDesc: document.getElementById('s-footer').value,
        facebookUrl: document.getElementById('s-fb').value,
        youtubeUrl: document.getElementById('s-yt').value,
        emailUrl: document.getElementById('s-email').value
      };
    }
    if (editId) {
      await window.db.collection(currentTab).doc(editId).set(payload, { merge: true });
      showToast("Item updated successfully!");
    } else {
      if(payload.id && typeof payload.id === 'string') {
        await window.db.collection(currentTab).doc(payload.id).set(payload);
      } else {
        await window.db.collection(currentTab).add(payload);
      }
      showToast("Item created successfully!");
    }
    formModal.classList.add('hidden');
  } catch (error) {
    console.error("Error saving: ", error);
    showToast("Error saving: " + error.message, "error");
  } finally {
    btn.innerHTML = `Save Item`;
    btn.disabled = false;
  }
});

// Edit & Delete
window.editItem = async (docId) => {
  try {
    const doc = await window.db.collection(currentTab).doc(docId).get();
    if (doc.exists) {
      openForm(doc.data(), doc.id);
    } else {
      openForm({}, docId);
    }
  } catch(e) { showToast("Error fetching document", "error"); }
};

window.deleteItem = async (docId) => {
  if(confirm("Are you sure you want to delete this item? This action cannot be undone.")) {
    try {
      await window.db.collection(currentTab).doc(docId).delete();
      showToast("Item deleted successfully!");
    } catch(e) { showToast("Error deleting: " + e.message, "error"); }
  }
};

// Toast Notifications System
function showToast(message, type = "success") {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'fixed bottom-4 right-4 z-50 flex flex-col gap-2';
    document.body.appendChild(container);
  }
  
  const toast = document.createElement('div');
  const bgColor = type === 'success' ? 'bg-[#006a6a]' : 'bg-red-500';
  const icon = type === 'success' ? 'check_circle' : 'error';
  
  toast.className = `flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-white ${bgColor} transform translate-y-10 opacity-0 transition-all duration-300 ease-out`;
  toast.innerHTML = `
    <span class="material-symbols-outlined">${icon}</span>
    <span class="font-medium text-sm">${message}</span>
  `;
  
  container.appendChild(toast);
  
  // Animate in
  setTimeout(() => {
    toast.classList.remove('translate-y-10', 'opacity-0');
  }, 10);
  
  // Remove after 3s
  setTimeout(() => {
    toast.classList.add('translate-y-10', 'opacity-0');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
