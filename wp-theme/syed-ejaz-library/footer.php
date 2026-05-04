<?php
/**
 * Footer Template
 * @package SyedEjazLibrary
 */
$site_title  = get_bloginfo('name');
$footer_desc = get_theme_mod('sejaz_footer_desc', 'Curating knowledge, preserving heritage, and empowering the future through digital literacy.');
$fb_url      = get_theme_mod('sejaz_facebook_url', '#');
$yt_url      = get_theme_mod('sejaz_youtube_url', '#');
$email       = get_theme_mod('sejaz_email_address', '');
?>

<footer class="w-full border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 transition-colors duration-300">
    <div class="max-w-7xl mx-auto px-8 py-12 flex flex-col md:flex-row justify-between gap-12">
        <div class="mb-4 md:mb-0 max-w-sm">
            <div class="font-headline font-bold text-lg text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <span class="material-symbols-outlined text-[#006A6A]" style="font-variation-settings:'FILL' 1;">auto_stories</span>
                <?php echo esc_html($site_title); ?>
            </div>
            <p class="text-[#454749] dark:text-slate-400 font-body text-sm leading-relaxed"><?php echo esc_html($footer_desc); ?></p>
            <div class="flex gap-4 mt-6">
                <?php if ($fb_url): ?>
                <a href="<?php echo esc_url($fb_url); ?>" target="_blank" class="w-10 h-10 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:bg-[#006a6a] hover:text-white transition-all">
                    <span class="material-symbols-outlined text-[20px]">share</span>
                </a>
                <?php endif; ?>
                <?php if ($yt_url): ?>
                <a href="<?php echo esc_url($yt_url); ?>" target="_blank" class="w-10 h-10 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:bg-[#006a6a] hover:text-white transition-all">
                    <span class="material-symbols-outlined text-[20px]">play_circle</span>
                </a>
                <?php endif; ?>
                <?php if ($email): ?>
                <a href="mailto:<?php echo esc_attr($email); ?>" class="w-10 h-10 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:bg-[#006a6a] hover:text-white transition-all">
                    <span class="material-symbols-outlined text-[20px]">mail</span>
                </a>
                <?php endif; ?>
            </div>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-8 md:gap-12">
            <div class="flex flex-col space-y-3">
                <span class="text-on-surface dark:text-white font-bold font-headline text-sm uppercase tracking-widest mb-1">Library</span>
                <a class="text-slate-500 hover:text-[#006a6a] dark:hover:text-white transition-all text-sm" href="<?php echo get_post_type_archive_link('book'); ?>">Books</a>
                <a class="text-slate-500 hover:text-[#006a6a] dark:hover:text-white transition-all text-sm" href="<?php echo home_url('/categories/'); ?>">Categories</a>
                <a class="text-slate-500 hover:text-[#006a6a] dark:hover:text-white transition-all text-sm" href="<?php echo get_post_type_archive_link('gallery_item'); ?>">Gallery</a>
            </div>
            <div class="flex flex-col space-y-3">
                <span class="text-on-surface dark:text-white font-bold font-headline text-sm uppercase tracking-widest mb-1">About</span>
                <a class="text-slate-500 hover:text-[#006a6a] dark:hover:text-white transition-all text-sm" href="<?php echo home_url('/about/'); ?>">About Us</a>
                <a class="text-slate-500 hover:text-[#006a6a] dark:hover:text-white transition-all text-sm" href="<?php echo home_url('/contact/'); ?>">Contact</a>
            </div>
            <div class="flex flex-col space-y-3">
                <span class="text-on-surface dark:text-white font-bold font-headline text-sm uppercase tracking-widest mb-1">Legal</span>
                <a class="text-slate-500 hover:text-[#006a6a] dark:hover:text-white transition-all text-sm" href="<?php echo home_url('/privacy-policy/'); ?>">Privacy Policy</a>
                <a class="text-slate-500 hover:text-[#006a6a] dark:hover:text-white transition-all text-sm" href="<?php echo home_url('/terms/'); ?>">Terms of Service</a>
            </div>
        </div>
    </div>
    <div class="max-w-7xl mx-auto px-8 pb-8 flex flex-col md:flex-row justify-between items-center border-t border-slate-50 dark:border-slate-900 pt-6">
        <p class="text-[#454749] dark:text-slate-400 text-sm">© <?php echo date('Y'); ?> <?php echo esc_html($site_title); ?>. All rights reserved.</p>
    </div>
</footer>

<?php wp_footer(); ?>
</body>
</html>
