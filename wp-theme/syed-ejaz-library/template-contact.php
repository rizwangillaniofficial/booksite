<?php
/**
 * Template Name: Contact Page
 */
get_header(); ?>
<main class="pt-32 pb-24 bg-surface dark:bg-slate-950">
    <div class="max-w-7xl mx-auto px-8">
        <div class="mb-20 max-w-2xl">
            <span class="font-label text-[0.75rem] uppercase tracking-[0.05em] text-secondary font-semibold mb-4 block">Get In Touch</span>
            <h1 class="font-headline text-[3.5rem] font-extrabold leading-tight -tracking-[0.02em] text-on-surface dark:text-white mb-6"><?php echo esc_html(get_theme_mod('sejaz_contact_p_title', "Let's Connect with the Archive.")); ?></h1>
            <p class="text-primary dark:text-slate-400 font-body text-[1rem] leading-relaxed"><?php echo esc_html(get_theme_mod('sejaz_contact_p_sub', 'Have a question about our collections or need assistance with digital access? Our team of curators and technical experts is here to help you navigate our digital stacks.')); ?></p>
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div class="lg:col-span-7 bg-white dark:bg-slate-900 p-8 md:p-12 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800">
                <?php 
                // Display the default contact form 7 shortcode if it exists, otherwise a simple fallback message
                if (shortcode_exists('contact-form-7')) {
                    echo do_shortcode('[contact-form-7 title="Contact form 1"]'); 
                } else {
                    echo '<p class="text-slate-500">Please install and configure Contact Form 7 plugin.</p>';
                }
                ?>
            </div>
            <div class="lg:col-span-5 space-y-8">
                <div class="bg-surface-container-high dark:bg-slate-900 p-8 rounded-xl space-y-8 border border-gray-100 dark:border-slate-800">
                    <div class="flex items-start gap-6">
                        <div class="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm">
                            <span class="material-symbols-outlined text-secondary">location_on</span>
                        </div>
                        <div>
                            <h4 class="font-headline font-bold text-lg text-on-surface dark:text-white mb-2">Physical Address</h4>
                            <p class="text-primary dark:text-slate-400 leading-relaxed"><?php echo nl2br(esc_html(get_theme_mod('sejaz_contact_address', '123 Library Lane, Academic District'))); ?></p>
                        </div>
                    </div>
                    <div class="flex items-start gap-6">
                        <div class="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm">
                            <span class="material-symbols-outlined text-secondary">mail</span>
                        </div>
                        <div>
                            <h4 class="font-headline font-bold text-lg text-on-surface dark:text-white mb-2">Email Inquiries</h4>
                            <p class="text-primary dark:text-slate-400 leading-relaxed"><?php echo esc_html(get_theme_mod('sejaz_email_address', 'support@syedejazlibrary.com')); ?></p>
                        </div>
                    </div>
                    <div class="flex items-start gap-6">
                        <div class="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm">
                            <span class="material-symbols-outlined text-secondary">call</span>
                        </div>
                        <div>
                            <h4 class="font-headline font-bold text-lg text-on-surface dark:text-white mb-2">Phone Number</h4>
                            <p class="text-primary dark:text-slate-400 leading-relaxed"><?php echo esc_html(get_theme_mod('sejaz_contact_phone', '+1 (555) 012-3456')); ?></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</main>
<?php get_footer(); ?>
