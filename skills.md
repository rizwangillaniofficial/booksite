# Antigravity Skills for Syed Ejaz Digital Library

This file contains the core skills and context instructions for Antigravity AI when working on this WordPress project.

<skill>
<name>WordPress Theme Standards</name>
<description>Rules for developing and modifying the custom syed-ejaz-library theme</description>
<instructions>
1. **Security**: Always sanitize and escape data before outputting to templates using `esc_html()`, `esc_url()`, and `esc_attr()`.
2. **Architecture**: Register all Custom Post Types (`book`, `gallery_item`), Meta Boxes, and Customizer settings cleanly in `functions.php`.
3. **Hierarchy**: Adhere strictly to the WordPress template hierarchy (`front-page.php`, `archive-book.php`, `single-book.php`, `template-about.php`, `template-contact.php`).
</instructions>
</skill>

<skill>
<name>Design System & Styling</name>
<description>Guidelines for UI/UX using Tailwind CSS</description>
<instructions>
1. **Framework**: Use Tailwind CSS via CDN with the inline configuration defined in `functions.php`.
2. **Color Palette**: Use the predefined theme colors (e.g., `bg-surface`, `text-on-surface`, `text-primary`, `bg-secondary`).
3. **Typography**: Use `Manrope` for headlines (`font-headline`) and `Inter` for body text (`font-body`).
4. **Interactivity**: Apply smooth transitions (`transition-all`) and subtle hover effects (`hover:scale-105`) to interactive elements.
</instructions>
</skill>

<skill>
<name>Book Reader & PDF Integration</name>
<description>How to display PDF books effectively</description>
<instructions>
1. **Shortcode**: Render PDF books using the 3D FlipBook plugin shortcode: `[3d-flip-book mode="fullscreen" pdf="URL"][/3d-flip-book]`.
2. **Fallback**: Always provide a direct "Download / Open PDF" fallback link below the reader.
3. **Data Retrieval**: Extract the PDF URL from the `_book_pdf_url` custom meta field using `get_post_meta()`.
</instructions>
</skill>

<skill>
<name>Multi-language Support (Urdu/English)</name>
<description>Handling dual-language book titles and content</description>
<instructions>
1. **English First**: The primary `post_title` should be in English to ensure URL slugs are readable.
2. **Urdu Meta**: The Urdu title is stored in the `_book_title_ur` custom meta field.
3. **RTL**: Apply `dir="rtl"` and appropriate classes (`urdu-text`) when displaying Urdu content to ensure proper alignment and styling.
</instructions>
</skill>

<skill>
<name>Form Integrations</name>
<description>Handling the Contact Page</description>
<instructions>
1. **Plugin**: Rely on `Contact Form 7` for form processing.
2. **Shortcode**: Output the form using `[contact-form-7 title="Contact form 1"]` within `template-contact.php`.
</instructions>
</skill>
