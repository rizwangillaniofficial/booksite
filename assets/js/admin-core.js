/* Admin Core - Image Compression & Utils */
const ADMIN_PWD="admin";
let currentTab='dashboard',editId=null;

// Compress image to base64 (NO Firebase Storage needed!)
function compressImage(file,maxW=800,quality=0.7){
  return new Promise((resolve,reject)=>{
    if(file.size>10*1024*1024)return reject(new Error("Image must be under 10MB"));
    const reader=new FileReader();
    reader.onload=e=>{
      const img=new Image();
      img.onload=()=>{
        const canvas=document.createElement('canvas');
        let w=img.width,h=img.height;
        if(w>maxW){h=Math.round(h*maxW/w);w=maxW}
        canvas.width=w;canvas.height=h;
        canvas.getContext('2d').drawImage(img,0,0,w,h);
        resolve(canvas.toDataURL('image/jpeg',quality));
      };
      img.onerror=()=>reject(new Error("Invalid image"));
      img.src=e.target.result;
    };
    reader.onerror=()=>reject(new Error("Could not read file"));
    reader.readAsDataURL(file);
  });
}

// Get file from input as base64
async function getImageBase64(inputId){
  const input=document.getElementById(inputId);
  if(!input||!input.files||!input.files[0])return null;
  return await compressImage(input.files[0]);
}

// Toast
function showToast(msg,type="success"){
  let c=document.getElementById('toast-container');
  if(!c){c=document.createElement('div');c.id='toast-container';c.className='toast-container';document.body.appendChild(c)}
  const t=document.createElement('div');
  t.className=`toast ${type}`;
  t.innerHTML=`<span class="material-symbols-outlined">${type==='success'?'check_circle':'error'}</span><span>${msg}</span>`;
  c.appendChild(t);
  setTimeout(()=>t.classList.add('show'),10);
  setTimeout(()=>{t.classList.remove('show');setTimeout(()=>t.remove(),300)},3500);
}

// Login
document.getElementById('login-btn').onclick=()=>{
  if(document.getElementById('admin-pwd').value===ADMIN_PWD){
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('admin-panel').classList.remove('hidden');
    switchTab('dashboard');
  }else{document.getElementById('login-err').style.display='block'}
};
document.getElementById('admin-pwd').onkeypress=e=>{if(e.key==='Enter')document.getElementById('login-btn').click()};

// Tab switch
function switchTab(tab){
  currentTab=tab;
  document.querySelectorAll('.nav-btn').forEach(b=>{b.classList.toggle('active',b.dataset.tab===tab)});
  document.getElementById('page-title').textContent={dashboard:'Dashboard',books:'Books',categories:'Categories',gallery:'Gallery',pages:'Page Content',settings:'Site Settings'}[tab]||tab;
  const addBtn=document.getElementById('add-new-btn');
  addBtn.classList.toggle('hidden',['dashboard','pages','settings'].includes(tab));
  loadTabContent();
}

// Modal
function openModal(title){
  document.getElementById('modal-title').textContent=title;
  document.getElementById('modal-overlay').classList.add('show');
}
function closeModal(){
  document.getElementById('modal-overlay').classList.remove('show');
  if(typeof tinymce!=='undefined')tinymce.remove();
  editId=null;
}

// Init rich text
function initRichText(){
  if(typeof tinymce==='undefined')return;
  tinymce.remove();
  tinymce.init({selector:'textarea.rich-text',menubar:false,plugins:'lists link code',toolbar:'undo redo | bold italic | bullist numlist | link | code',height:250,setup:ed=>{ed.on('change',()=>ed.save())}});
}
