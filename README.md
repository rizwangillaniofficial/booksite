# Syed Ejaz Digital Library

This **bookweb** folder contains the full static website for the Syed Ejaz Digital Library. All HTML screen files have been imported from Stitch, and the site is styled with Tailwind CSS and custom CSS.

## Project Structure
```
bookweb/
├─ assets/
│  ├─ css/style.css      # Custom design tokens and overrides
│  └─ js/main.js        # Simple navigation logic (optional)
├─ data/books.json      # Sample book metadata (you can extend)
├─ desktop/             # Desktop HTML screens imported from Stitch
│   ├─ home-page-v1.html
│   ├─ about-us-desktop.html
│   └─ ... (other screens)
├─ mobile/              # (if you downloaded mobile screens)
├─ index.html           # Main landing page (links to screens)
└─ README.md            # This file
```

## How to Run locally
1. Open a terminal in the `bookweb` folder.
2. Run a simple HTTP server. Example (Node.js):
   ```bash
   npx -y serve .
   ```
   or using Python:
   ```bash
   python -m http.server 8000
   ```
3. Open `http://localhost:5000` (or the port you chose) in your browser.

## Navigation
- The **Home** page (`index.html`) provides quick links to all imported screens.
- Each screen under `desktop/` can be opened directly, e.g. `desktop/about-us-desktop.html`.
- You can add a navigation bar to the top of each page by copying the `<nav>` block from any existing screen and adjusting the links.

## Extending the Site
- Add more book entries to `data/books.json` and display them using a template in JavaScript.
- Replace placeholder images in `assets/images/` with your own book covers.
- Customize colors and fonts in `assets/css/style.css` – the file already defines a rich Tailwind‐based design system.

Enjoy building your digital library! 🚀
