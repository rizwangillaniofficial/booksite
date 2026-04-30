/* Admin CRUD - Load, Save, Delete, Forms */

// Load tab content
async function loadTabContent(){
  const area=document.getElementById('tab-content');
  if(!window.db)return area.innerHTML='<div class="empty-state"><span class="material-symbols-outlined">error</span><p>Firebase not connected!</p></div>';

  if(currentTab==='dashboard'){
    let bc=0,cc=0,gc=0;
    try{
      const bs=await db.collection('books').get();bc=bs.size;
      const cs=await db.collection('categories').get();cc=cs.size;
      const gs=await db.collection('gallery').get();gc=gs.size;
    }catch(e){}
    area.innerHTML=`<div class="stat-grid">
      <div class="stat-card"><div class="stat-icon" style="background:#f0fdfa"><span class="material-symbols-outlined" style="color:#006a6a">menu_book</span></div><h4>${bc}</h4><p>Total Books</p></div>
      <div class="stat-card"><div class="stat-icon" style="background:#eff6ff"><span class="material-symbols-outlined" style="color:#2563eb">category</span></div><h4>${cc}</h4><p>Categories</p></div>
      <div class="stat-card"><div class="stat-icon" style="background:#fdf4ff"><span class="material-symbols-outlined" style="color:#9333ea">collections</span></div><h4>${gc}</h4><p>Gallery Images</p></div>
      <div class="stat-card"><div class="stat-icon" style="background:#fff7ed"><span class="material-symbols-outlined" style="color:#ea580c">article</span></div><h4>4</h4><p>Pages</p></div>
    </div>
    <div class="data-card"><div class="data-card-header"><h3>Quick Tip</h3></div><div style="padding:24px;color:#64748b;font-size:14px;line-height:1.8">
      <p>📚 <b>Images</b> are auto-compressed & saved directly — no separate upload needed!</p>
      <p>📄 <b>PDFs</b>: Upload to <a href="https://drive.google.com" target="_blank" style="color:#006a6a">Google Drive</a>, set sharing to "Anyone with link", then paste the link.</p>
      <p>🔗 <b>Google Drive PDF link format</b>: Change <code>/view</code> to <code>/preview</code> in the URL for embedded reading.</p>
    </div></div>`;
    return;
  }

  if(currentTab==='pages'){
    area.innerHTML=`<div class="data-card"><table><thead><tr><th>Page</th><th>Description</th><th>Action</th></tr></thead><tbody>
      ${['home','about','contact','gallery'].map(p=>`<tr><td style="font-weight:700;text-transform:capitalize">${p} Page</td><td style="color:#64748b">Edit all text & images for ${p} page</td><td><button class="btn btn-sm btn-primary" onclick="editPage('${p}')"><span class="material-symbols-outlined" style="font-size:14px">edit</span> Edit</button></td></tr>`).join('')}
    </tbody></table></div>`;
    return;
  }

  if(currentTab==='settings'){
    editId='general';
    let d={};try{const doc=await db.collection('settings').doc('general').get();if(doc.exists)d=doc.data()}catch(e){}
    area.innerHTML=`<div class="data-card" style="padding:28px"><form id="settings-form">
      <div class="form-group"><label>Site Title</label><input id="s-title" value="${d.siteTitle||'Syed Ejaz Digital Library'}"></div>
      <div class="form-group"><label>Footer Description</label><textarea id="s-footer" class="rich-text">${d.footerDesc||''}</textarea></div>
      <div class="form-group"><label>Facebook URL</label><input id="s-fb" value="${d.facebookUrl||''}"></div>
      <div class="form-group"><label>YouTube URL</label><input id="s-yt" value="${d.youtubeUrl||''}"></div>
      <div class="form-group"><label>Contact Email</label><input id="s-email" value="${d.emailUrl||''}"></div>
      <button type="button" class="btn btn-primary" onclick="saveSettings()"><span class="material-symbols-outlined" style="font-size:16px">save</span> Save Settings</button>
    </form></div>`;
    initRichText();
    return;
  }

  // Books, Categories, Gallery tables
  area.innerHTML='<div class="empty-state"><span class="material-symbols-outlined animate-spin">refresh</span><p>Loading...</p></div>';
  try{
    const snap=await db.collection(currentTab).get();
    if(snap.empty){area.innerHTML='<div class="empty-state"><span class="material-symbols-outlined">inbox</span><p>No items yet. Click "Add New" to start!</p></div>';return}
    let rows='';
    snap.forEach(doc=>{
      const d=doc.data(),id=doc.id;
      if(currentTab==='books'){
        rows+=`<tr><td><div style="display:flex;align-items:center;gap:12px">${d.cover?`<img src="${d.cover}" class="table-img">`:''}
          <div><div style="font-weight:700">${d.title||''}</div><div style="font-size:12px;color:#94a3b8">${d.author||''}</div></div></div></td>
          <td><span class="badge">${d.category||''}</span><div style="font-size:12px;color:#94a3b8;margin-top:4px">${d.year||''}</div></td>
          <td style="text-align:right"><button class="btn btn-sm btn-ghost" onclick="editItem('${id}')"><span class="material-symbols-outlined" style="font-size:16px">edit</span></button>
          <button class="btn btn-sm btn-danger" onclick="deleteItem('${id}')"><span class="material-symbols-outlined" style="font-size:16px">delete</span></button></td></tr>`;
      }else if(currentTab==='categories'){
        rows+=`<tr><td><div style="display:flex;align-items:center;gap:10px"><span class="material-symbols-outlined" style="color:#006a6a">${d.icon||'category'}</span><b>${d.name||''}</b></div></td>
          <td style="color:#94a3b8">${d.id||''}</td>
          <td style="text-align:right"><button class="btn btn-sm btn-ghost" onclick="editItem('${id}')"><span class="material-symbols-outlined" style="font-size:16px">edit</span></button>
          <button class="btn btn-sm btn-danger" onclick="deleteItem('${id}')"><span class="material-symbols-outlined" style="font-size:16px">delete</span></button></td></tr>`;
      }else if(currentTab==='gallery'){
        rows+=`<tr><td><div style="display:flex;align-items:center;gap:12px"><img src="${d.url||''}" class="table-thumb"><b>${d.title||''}</b></div></td>
          <td><span class="badge">${d.category||''}</span></td>
          <td style="text-align:right"><button class="btn btn-sm btn-ghost" onclick="editItem('${id}')"><span class="material-symbols-outlined" style="font-size:16px">edit</span></button>
          <button class="btn btn-sm btn-danger" onclick="deleteItem('${id}')"><span class="material-symbols-outlined" style="font-size:16px">delete</span></button></td></tr>`;
      }
    });
    area.innerHTML=`<div class="data-card"><table><thead><tr><th>Item</th><th>Details</th><th style="text-align:right">Actions</th></tr></thead><tbody>${rows}</tbody></table></div>`;
  }catch(e){area.innerHTML=`<div class="empty-state"><span class="material-symbols-outlined">error</span><p>Error: ${e.message}</p></div>`}
}

// Forms
function openAddForm(){editId=null;openFormFor(null)}
async function editItem(id){
  editId=id;
  try{const doc=await db.collection(currentTab).doc(id).get();openFormFor(doc.exists?doc.data():null)}
  catch(e){showToast('Error loading item','error')}
}
async function editPage(pageId){
  currentTab='pages';editId=pageId;
  let d={};try{const doc=await db.collection('pages').doc(pageId).get();if(doc.exists)d=doc.data()}catch(e){}
  openFormFor(d);
}

function imgField(label,id,current){
  return `<div class="form-group"><label>${label}</label>
    <div class="img-upload-zone" onclick="this.querySelector('input').click()">
      <input type="file" id="${id}" accept="image/*" onchange="previewImg(this,'${id}-prev')">
      <span class="material-symbols-outlined">cloud_upload</span>
      <p>Click to select image</p><small>Auto-compressed, no upload delay</small>
    </div>
    ${current?`<img src="${current}" class="img-preview" id="${id}-prev">`:`<img class="img-preview hidden" id="${id}-prev">`}
  </div>`;
}
function previewImg(input,prevId){
  const prev=document.getElementById(prevId);
  if(input.files&&input.files[0]){
    const r=new FileReader();r.onload=e=>{prev.src=e.target.result;prev.classList.remove('hidden')};r.readAsDataURL(input.files[0]);
  }
}

function openFormFor(d){
  const form=document.getElementById('data-form');
  const t=currentTab==='pages'?editId:currentTab;

  if(t==='books'||currentTab==='books'){
    form.innerHTML=`
      <div class="form-row"><div class="form-group"><label>Title (English)</label><input id="f-title" value="${d?.title||''}"></div>
      <div class="form-group"><label>Title (Urdu)</label><input id="f-title-ur" value="${d?.title_ur||''}" dir="rtl"></div></div>
      <div class="form-row"><div class="form-group"><label>Author</label><input id="f-author" value="${d?.author||'Syed Ejaz Gillani'}"></div>
      <div class="form-group"><label>Year</label><input id="f-year" value="${d?.year||''}"></div></div>
      <div class="form-group"><label>Category ID</label><input id="f-cat" value="${d?.category||''}" placeholder="e.g. literature"></div>
      ${imgField('Cover Image','f-cover',d?.cover)}
      <div class="form-group"><label>PDF Link</label><input id="f-pdf" value="${d?.pdf_url||''}" placeholder="Google Drive or direct URL">
        <div class="form-hint">Upload PDF to Google Drive → Share → "Anyone with link" → Paste link here</div></div>
      <div class="form-group"><label>Description</label><textarea id="f-desc" class="rich-text">${d?.description||''}</textarea></div>`;
  }else if(t==='categories'||currentTab==='categories'){
    form.innerHTML=`
      <div class="form-group"><label>Category ID (no spaces)</label><input id="f-id" value="${d?.id||''}" ${editId?'disabled':''}></div>
      <div class="form-row"><div class="form-group"><label>Name (English)</label><input id="f-name" value="${d?.name||''}"></div>
      <div class="form-group"><label>Name (Urdu)</label><input id="f-name-ur" value="${d?.name_ur||''}" dir="rtl"></div></div>
      <div class="form-group"><label>Material Icon</label><input id="f-icon" value="${d?.icon||'category'}" placeholder="e.g. menu_book">
        <div class="form-hint"><a href="https://fonts.google.com/icons" target="_blank" style="color:#006a6a">Browse icons here</a></div></div>`;
  }else if(t==='gallery'||currentTab==='gallery'){
    form.innerHTML=`
      <div class="form-group"><label>Title</label><input id="f-gtitle" value="${d?.title||''}"></div>
      <div class="form-group"><label>Category</label><input id="f-gcat" value="${d?.category||'Events'}" placeholder="Events / Family / Travel"></div>
      ${imgField('Image','f-gimg',d?.url)}
      <div class="form-group"><label>Or paste image URL</label><input id="f-gurl" value="${d?.url||''}"></div>`;
  }else if(editId==='home'){
    form.innerHTML=`
      <div class="form-section">Hero Section</div>
      ${imgField('Hero Image','f-img-hero',d?.imgHero)}
      <div class="form-group"><label>Title</label><input id="f-hero-title" value="${d?.heroTitle||'Syed Ejaz Gillani'}"></div>
      <div class="form-group"><label>Subtitle</label><textarea id="f-hero-sub" class="rich-text">${d?.heroSubtitle||''}</textarea></div>
      <div class="form-section">Floating Card</div>
      <div class="form-row"><div class="form-group"><label>Tag</label><input id="f-new-tag" value="${d?.newArrivalTag||'New Arrival'}"></div>
      <div class="form-group"><label>Author</label><input id="f-new-author" value="${d?.newArrivalAuthor||'by Syed Ejaz Gillani'}"></div></div>
      <div class="form-group"><label>Card Title</label><input id="f-new-title" value="${d?.newArrivalTitle||'Uncover the Latest in Knowledge'}"></div>
      <div class="form-section">About Section</div>
      <div class="form-group"><label>About Title</label><input id="f-about-title" value="${d?.aboutTitle||'Read More, Learn More, Grow More'}"></div>
      <div class="form-group"><label>About Text</label><textarea id="f-about-text" class="rich-text">${d?.aboutText||''}</textarea></div>
      <div class="form-row"><div class="form-group"><label>Stat 1 Number</label><input id="f-s1n" value="${d?.stat1Num||'7+'}"></div>
      <div class="form-group"><label>Stat 1 Label</label><input id="f-s1t" value="${d?.stat1Text||'Digital Books'}"></div></div>
      <div class="form-row"><div class="form-group"><label>Stat 2 Number</label><input id="f-s2n" value="${d?.stat2Num||'120+'}"></div>
      <div class="form-group"><label>Stat 2 Label</label><input id="f-s2t" value="${d?.stat2Text||'Global Archives'}"></div></div>
      ${imgField('Archive Image','f-img-archive',d?.imgArchive)}
      ${imgField('Library Image','f-img-library',d?.imgLibrary)}
      <div class="form-section">Featured & Categories Headings</div>
      <div class="form-row"><div class="form-group"><label>Featured Sub</label><input id="f-feat-sub" value="${d?.featuredSub||'Our Curated Selection'}"></div>
      <div class="form-group"><label>Featured Title</label><input id="f-feat-title" value="${d?.featuredTitle||'Featured Books'}"></div></div>
      <div class="form-row"><div class="form-group"><label>Categories Title</label><input id="f-cat-title" value="${d?.categoriesTitle||'Browse by Category'}"></div>
      <div class="form-group"><label>Categories Sub</label><input id="f-cat-sub" value="${d?.categoriesSub||''}"></div></div>
      <div class="form-group"><label>Newsletter Title</label><input id="f-news-title" value="${d?.newsletterTitle||'Stay Updated with New Archives'}"></div>
      <div class="form-group"><label>Newsletter Subtitle</label><input id="f-news-sub" value="${d?.newsletterSub||''}"></div>`;
  }else if(editId==='about'){
    form.innerHTML=`
      <div class="form-section">Hero Bio</div>
      ${imgField('Profile Image','f-img-profile',d?.imgProfile)}
      <div class="form-group"><label>Tag</label><input id="f-tag" value="${d?.heroTag||'Founder'}"></div>
      <div class="form-group"><label>Name</label><input id="f-name" value="${d?.heroTitle||'Syed Ejaz Gillani'}"></div>
      <div class="form-group"><label>Bio</label><textarea id="f-bio" class="rich-text">${d?.heroBio||''}</textarea></div>
      <div class="form-group"><label>Quote</label><textarea id="f-quote">${d?.quote||''}</textarea></div>
      <div class="form-section">Our Story</div>
      <div class="form-group"><label>Title</label><input id="f-title" value="${d?.title||'Our Story'}"></div>
      <div class="form-group"><label>Subtitle</label><textarea id="f-sub">${d?.subtitle||''}</textarea></div>
      <div class="form-group"><label>Content</label><textarea id="f-content" class="rich-text">${d?.content||''}</textarea></div>
      <div class="form-section">Mission & Vision</div>
      <div class="form-row"><div class="form-group"><label>Mission Title</label><input id="f-miss-t" value="${d?.missionTitle||'Mission'}"></div>
      <div class="form-group"><label>Vision Title</label><input id="f-vis-t" value="${d?.visionTitle||'Vision'}"></div></div>
      <div class="form-group"><label>Mission Text</label><textarea id="f-miss-tx">${d?.missionText||''}</textarea></div>
      <div class="form-group"><label>Vision Text</label><textarea id="f-vis-tx">${d?.visionText||''}</textarea></div>`;
  }else if(editId==='contact'){
    form.innerHTML=`
      <div class="form-section">Contact Info</div>
      ${imgField('Accent Image','f-img-accent',d?.imgAccent)}
      ${imgField('Map Image','f-img-map',d?.imgMap)}
      <div class="form-group"><label>Title</label><input id="f-title" value="${d?.title||"Let's Connect with the Archive."}"></div>
      <div class="form-group"><label>Subtitle</label><textarea id="f-sub" class="rich-text">${d?.subtitle||''}</textarea></div>
      <div class="form-group"><label>Address</label><textarea id="f-addr">${d?.address||''}</textarea></div>
      <div class="form-row"><div class="form-group"><label>Email</label><input id="f-email" value="${d?.email||''}"></div>
      <div class="form-group"><label>Phone</label><input id="f-phone" value="${d?.phone||''}"></div></div>`;
  }else if(editId==='gallery'){
    form.innerHTML=`
      <div class="form-group"><label>Tag</label><input id="f-tag" value="${d?.tag||'Our Visual Heritage'}"></div>
      <div class="form-group"><label>Title</label><input id="f-title" value="${d?.title||'Gallery'}"></div>
      <div class="form-group"><label>Subtitle</label><textarea id="f-sub">${d?.subtitle||''}</textarea></div>`;
  }

  openModal(editId?'Edit Item':'Add New Item');
  setTimeout(initRichText,100);
}

// Helper to get value safely
function v(id){const el=document.getElementById(id);return el?el.value:'';}

// Save
async function saveData(){
  if(!window.db)return showToast('Firebase not connected!','error');
  if(typeof tinymce!=='undefined')tinymce.triggerSave();
  const btn=document.getElementById('save-btn');
  btn.innerHTML='<span class="material-symbols-outlined animate-spin">refresh</span> Saving...';btn.disabled=true;

  try{
    let payload={};
    if(currentTab==='books'){
      const coverImg=await getImageBase64('f-cover');
      payload={title:v('f-title'),title_ur:v('f-title-ur'),author:v('f-author'),year:v('f-year'),category:v('f-cat'),
        cover:coverImg||v('f-cover-prev-src')||'',pdf_url:v('f-pdf'),description:v('f-desc'),id:editId||Date.now().toString()};
      // Keep old cover if no new one selected
      if(!coverImg&&editId){try{const old=await db.collection('books').doc(editId).get();if(old.exists&&old.data().cover)payload.cover=old.data().cover}catch(e){}}
      if(!payload.title)throw new Error('Title is required!');
    }else if(currentTab==='categories'){
      payload={id:v('f-id'),name:v('f-name'),name_ur:v('f-name-ur'),icon:v('f-icon')};
      if(!payload.id||!payload.name)throw new Error('ID and Name required!');
    }else if(currentTab==='gallery'){
      const galleryImg=await getImageBase64('f-gimg');
      payload={title:v('f-gtitle'),category:v('f-gcat'),url:galleryImg||v('f-gurl')};
      if(!galleryImg&&editId&&!v('f-gurl')){try{const old=await db.collection('gallery').doc(editId).get();if(old.exists&&old.data().url)payload.url=old.data().url}catch(e){}}
      if(!payload.title)throw new Error('Title required!');
    }else if(currentTab==='pages'){
      if(editId==='home'){
        let cur={};try{const d=await db.collection('pages').doc('home').get();if(d.exists)cur=d.data()}catch(e){}
        const heroImg=await getImageBase64('f-img-hero');
        const archiveImg=await getImageBase64('f-img-archive');
        const libraryImg=await getImageBase64('f-img-library');
        payload={imgHero:heroImg||cur.imgHero||'',imgArchive:archiveImg||cur.imgArchive||'',imgLibrary:libraryImg||cur.imgLibrary||'',
          heroTitle:v('f-hero-title'),heroSubtitle:v('f-hero-sub'),newArrivalTag:v('f-new-tag'),newArrivalTitle:v('f-new-title'),newArrivalAuthor:v('f-new-author'),
          aboutTitle:v('f-about-title'),aboutText:v('f-about-text'),stat1Num:v('f-s1n'),stat1Text:v('f-s1t'),stat2Num:v('f-s2n'),stat2Text:v('f-s2t'),
          featuredSub:v('f-feat-sub'),featuredTitle:v('f-feat-title'),categoriesTitle:v('f-cat-title'),categoriesSub:v('f-cat-sub'),
          newsletterTitle:v('f-news-title'),newsletterSub:v('f-news-sub')};
      }else if(editId==='about'){
        let cur={};try{const d=await db.collection('pages').doc('about').get();if(d.exists)cur=d.data()}catch(e){}
        const profileImg=await getImageBase64('f-img-profile');
        payload={imgProfile:profileImg||cur.imgProfile||'',heroTag:v('f-tag'),heroTitle:v('f-name'),heroBio:v('f-bio'),quote:v('f-quote'),
          title:v('f-title'),subtitle:v('f-sub'),content:v('f-content'),missionTitle:v('f-miss-t'),missionText:v('f-miss-tx'),visionTitle:v('f-vis-t'),visionText:v('f-vis-tx')};
      }else if(editId==='contact'){
        let cur={};try{const d=await db.collection('pages').doc('contact').get();if(d.exists)cur=d.data()}catch(e){}
        const accentImg=await getImageBase64('f-img-accent');
        const mapImg=await getImageBase64('f-img-map');
        payload={imgAccent:accentImg||cur.imgAccent||'',imgMap:mapImg||cur.imgMap||'',
          title:v('f-title'),subtitle:v('f-sub'),address:v('f-addr'),email:v('f-email'),phone:v('f-phone')};
      }else if(editId==='gallery'){
        payload={tag:v('f-tag'),title:v('f-title'),subtitle:v('f-sub')};
      }
    }

    // Save to Firestore
    const collection=currentTab==='pages'?'pages':currentTab;
    const docId=editId||(payload.id&&typeof payload.id==='string'?payload.id:null);
    if(docId){
      await db.collection(collection).doc(docId).set(payload,{merge:true});
    }else{
      await db.collection(collection).add(payload);
    }
    showToast(editId?'Updated successfully!':'Created successfully!');
    closeModal();
    loadTabContent();
  }catch(e){
    console.error('Save error:',e);
    showToast('Error: '+e.message,'error');
  }finally{
    btn.innerHTML='<span class="material-symbols-outlined" style="font-size:16px">save</span> Save Changes';btn.disabled=false;
  }
}

// Save settings (inline form, no modal)
async function saveSettings(){
  if(!window.db)return showToast('Firebase not connected!','error');
  if(typeof tinymce!=='undefined')tinymce.triggerSave();
  try{
    await db.collection('settings').doc('general').set({
      siteTitle:v('s-title'),footerDesc:v('s-footer'),facebookUrl:v('s-fb'),youtubeUrl:v('s-yt'),emailUrl:v('s-email')
    },{merge:true});
    showToast('Settings saved!');
  }catch(e){showToast('Error: '+e.message,'error')}
}

// Delete
async function deleteItem(id){
  if(!confirm('Are you sure? This cannot be undone.'))return;
  try{await db.collection(currentTab).doc(id).delete();showToast('Deleted!');loadTabContent()}
  catch(e){showToast('Error: '+e.message,'error')}
}
