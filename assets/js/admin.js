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
  loadData();
};

// Data Loading (Real-time from Firestore)
function loadData() {
  if(!window.db) return tableBody.innerHTML = `<tr><td colspan="3" class="px-6 py-8 text-center text-red-500">Firebase not initialized!</td></tr>`;
  
  tableBody.innerHTML = `<tr><td colspan="3" class="px-6 py-12 text-center text-slate-400"><span class="material-symbols-outlined animate-spin">refresh</span></td></tr>`;
  
  window.db.collection(currentTab).onSnapshot(snapshot => {
    if (snapshot.empty) {
      tableBody.innerHTML = `<tr><td colspan="3" class="px-6 py-12 text-center text-slate-400">No data found. Add your first item!</td></tr>`;
      return;
    }
    
    let html = '';
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
    tableBody.innerHTML = html;
  }, err => {
    tableBody.innerHTML = `<tr><td colspan="3" class="px-6 py-8 text-center text-red-500">Error loading data: ${err.message}</td></tr>`;
  });
}

// Modal Form Logic
document.getElementById('add-new-btn').addEventListener('click', () => openForm());
document.getElementById('close-modal').addEventListener('click', () => formModal.classList.add('hidden'));
document.getElementById('cancel-btn').addEventListener('click', () => formModal.classList.add('hidden'));

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
        <div><label class="block text-sm font-bold text-slate-700 mb-1">Cover Image URL</label><input type="text" id="b-cover" class="w-full px-3 py-2 border rounded-lg" value="${docData?.cover || ''}" placeholder="https://..."></div>
        <div class="col-span-2"><label class="block text-sm font-bold text-slate-700 mb-1">PDF URL</label><input type="text" id="b-pdf" class="w-full px-3 py-2 border rounded-lg" value="${docData?.pdf_url || ''}" placeholder="Leave blank if not available"></div>
        <div class="col-span-2"><label class="block text-sm font-bold text-slate-700 mb-1">Description</label><textarea id="b-desc" class="w-full px-3 py-2 border rounded-lg h-24">${docData?.description || ''}</textarea></div>
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
        <div><label class="block text-sm font-bold text-slate-700 mb-1">Image URL</label><input type="text" id="g-url" class="w-full px-3 py-2 border rounded-lg" value="${docData?.url || ''}" required></div>
      </div>
    `;
  }
  
  formModal.classList.remove('hidden');
  formModal.classList.add('flex');
}

// Save Data
document.getElementById('save-btn').addEventListener('click', async () => {
  if(!window.db) return alert("Firebase not connected!");
  
  let payload = {};
  
  if (currentTab === 'books') {
    payload = {
      title: document.getElementById('b-title').value,
      title_ur: document.getElementById('b-title-ur').value,
      author: document.getElementById('b-author').value,
      year: document.getElementById('b-year').value,
      category: document.getElementById('b-cat').value,
      cover: document.getElementById('b-cover').value,
      pdf_url: document.getElementById('b-pdf').value,
      description: document.getElementById('b-desc').value,
      id: editId || Date.now() // Simple numerical ID for backward compatibility
    };
    if(!payload.title || !payload.category) return alert("Title and Category required!");
  } 
  else if (currentTab === 'categories') {
    payload = {
      id: document.getElementById('c-id').value,
      name: document.getElementById('c-name').value,
      name_ur: document.getElementById('c-name-ur').value,
      icon: document.getElementById('c-icon').value
    };
    if(!payload.id || !payload.name) return alert("ID and Name required!");
  }
  else if (currentTab === 'gallery') {
    payload = {
      title: document.getElementById('g-title').value,
      category: document.getElementById('g-cat').value,
      url: document.getElementById('g-url').value
    };
    if(!payload.url || !payload.title) return alert("Title and URL required!");
  }

  const btn = document.getElementById('save-btn');
  btn.innerHTML = `<span class="material-symbols-outlined animate-spin">refresh</span> Saving...`;
  btn.disabled = true;

  try {
    if (editId) {
      await window.db.collection(currentTab).doc(editId).update(payload);
    } else {
      // For new docs, if we have an explicit string ID (like categories) use it, else auto-gen
      if(payload.id && typeof payload.id === 'string') {
        await window.db.collection(currentTab).doc(payload.id).set(payload);
      } else {
        await window.db.collection(currentTab).add(payload);
      }
    }
    formModal.classList.add('hidden');
  } catch (error) {
    console.error("Error saving: ", error);
    alert("Error saving: " + error.message);
  } finally {
    btn.innerHTML = `Save Item`;
    btn.disabled = false;
  }
});

// Edit & Delete
window.editItem = async (docId) => {
  try {
    const doc = await window.db.collection(currentTab).doc(docId).get();
    if (doc.exists) openForm(doc.data(), doc.id);
  } catch(e) { alert("Error fetching document"); }
};

window.deleteItem = async (docId) => {
  if(confirm("Are you sure you want to delete this item? This action cannot be undone.")) {
    try {
      await window.db.collection(currentTab).doc(docId).delete();
    } catch(e) { alert("Error deleting: " + e.message); }
  }
};
