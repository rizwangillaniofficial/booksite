const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'index.html',
  'books.html',
  'categories.html',
  'gallery.html',
  'about.html',
  'contact.html',
  'reader.html'
];

const firebaseScripts = `
  <!-- Firebase SDKs -->
  <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore-compat.js"></script>
  <script src="assets/js/firebase-config.js"></script>
</head>`;

filesToUpdate.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (!content.includes('firebase-app-compat.js')) {
      content = content.replace('</head>', firebaseScripts);
      fs.writeFileSync(filePath, content);
      console.log('Updated ' + file);
    } else {
      console.log(file + ' already has Firebase SDKs');
    }
  }
});
