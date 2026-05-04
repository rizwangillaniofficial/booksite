<?php
/**
 * Header Template
 * @package SyedEjazLibrary
 */
$site_title = get_bloginfo('name');
$is_dark = isset($_COOKIE['theme']) && $_COOKIE['theme'] === 'dark';
$dark_icon = $is_dark ? 'light_mode' : 'dark_mode';
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?> class="light">
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <?php wp_head(); ?>
</head>
<body <?php body_class('bg-surface font-body text-on-surface antialiased'); ?>>
<?php wp_body_open(); ?>

<nav id="main-nav" class="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-[0px_20px_40px_rgba(25,28,29,0.05)] transition-colors duration-300">
    <div class="max-w-7xl mx-auto w-full flex justify-between items-center px-6 md:px-8 py-4">
        <a href="<?php echo home_url('/'); ?>" class="text-lg md:text-xl font-bold text-slate-800 dark:text-white font-headline tracking-tight hover:opacity-80 transition-opacity flex items-center gap-2">
            <span class="material-symbols-outlined text-[#006A6A]" style="font-variation-settings:'FILL' 1;">auto_stories</span>
            <?php echo esc_html($site_title); ?>
        </a>
        <div class="hidden md:flex items-center space-x-8 font-headline font-semibold tracking-tight">
            <a href="<?php echo home_url('/'); ?>" class="<?php echo is_front_page() ? 'text-[#006A6A] border-b-2 border-[#0132c5] pb-1' : 'text-slate-600 dark:text-slate-300 hover:text-[#006A6A]'; ?> transition-all">Home</a>
            <a href="<?php echo get_post_type_archive_link('book'); ?>" class="<?php echo is_post_type_archive('book') ? 'text-[#006A6A] border-b-2 border-[#0132c5] pb-1' : 'text-slate-600 dark:text-slate-300 hover:text-[#006A6A]'; ?> transition-all">Books</a>
            <a href="<?php echo home_url('/categories/'); ?>" class="<?php echo is_page('categories') ? 'text-[#006A6A] border-b-2 border-[#0132c5] pb-1' : 'text-slate-600 dark:text-slate-300 hover:text-[#006A6A]'; ?> transition-all">Categories</a>
            <a href="<?php echo get_post_type_archive_link('gallery_item'); ?>" class="<?php echo is_post_type_archive('gallery_item') ? 'text-[#006A6A] border-b-2 border-[#0132c5] pb-1' : 'text-slate-600 dark:text-slate-300 hover:text-[#006A6A]'; ?> transition-all">Gallery</a>
            <a href="<?php echo home_url('/about/'); ?>" class="<?php echo is_page('about') ? 'text-[#006A6A] border-b-2 border-[#0132c5] pb-1' : 'text-slate-600 dark:text-slate-300 hover:text-[#006A6A]'; ?> transition-all">About</a>
            <a href="<?php echo home_url('/contact/'); ?>" class="<?php echo is_page('contact') ? 'text-[#006A6A] border-b-2 border-[#0132c5] pb-1' : 'text-slate-600 dark:text-slate-300 hover:text-[#006A6A]'; ?> transition-all">Contact</a>
        </div>
        <div class="flex items-center space-x-3">
            <button id="dark-mode-btn" class="p-2 hover:opacity-90 transition-all rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800" title="Toggle dark mode">
                <span class="material-symbols-outlined text-[#006A6A]"><?php echo $dark_icon; ?></span>
            </button>
            <button id="mobile-menu-btn" class="md:hidden p-2 hover:opacity-90 transition-all rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800" title="Menu">
                <span class="material-symbols-outlined text-[#006A6A]">menu</span>
            </button>
        </div>
    </div>
    <div id="mobile-menu" class="md:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-800">
        <div class="max-w-7xl mx-auto px-6 py-4 flex flex-col space-y-1">
            <a href="<?php echo home_url('/'); ?>" class="block px-4 py-3 rounded-lg font-headline font-semibold text-slate-600 dark:text-slate-300 hover:text-[#006A6A] hover:bg-slate-50 transition-all">Home</a>
            <a href="<?php echo get_post_type_archive_link('book'); ?>" class="block px-4 py-3 rounded-lg font-headline font-semibold text-slate-600 dark:text-slate-300 hover:text-[#006A6A] hover:bg-slate-50 transition-all">Books</a>
            <a href="<?php echo home_url('/categories/'); ?>" class="block px-4 py-3 rounded-lg font-headline font-semibold text-slate-600 dark:text-slate-300 hover:text-[#006A6A] hover:bg-slate-50 transition-all">Categories</a>
            <a href="<?php echo get_post_type_archive_link('gallery_item'); ?>" class="block px-4 py-3 rounded-lg font-headline font-semibold text-slate-600 dark:text-slate-300 hover:text-[#006A6A] hover:bg-slate-50 transition-all">Gallery</a>
            <a href="<?php echo home_url('/about/'); ?>" class="block px-4 py-3 rounded-lg font-headline font-semibold text-slate-600 dark:text-slate-300 hover:text-[#006A6A] hover:bg-slate-50 transition-all">About</a>
            <a href="<?php echo home_url('/contact/'); ?>" class="block px-4 py-3 rounded-lg font-headline font-semibold text-slate-600 dark:text-slate-300 hover:text-[#006A6A] hover:bg-slate-50 transition-all">Contact</a>
        </div>
    </div>
</nav>
