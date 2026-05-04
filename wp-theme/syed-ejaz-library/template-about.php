<?php
/**
 * Template Name: About Page
 */
get_header(); ?>
<main class="pt-24 pb-24 bg-surface dark:bg-slate-950">
    <section class="relative overflow-hidden bg-surface-container-lowest dark:bg-slate-900 py-24 md:py-32">
        <div class="max-w-7xl mx-auto px-8">
            <div class="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">
                <div class="lg:w-7/12 z-10">
                    <span class="inline-block px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-sm font-bold tracking-widest uppercase mb-6"><?php echo esc_html(get_theme_mod('sejaz_about_p_tag', 'Founder')); ?></span>
                    <h1 class="font-headline text-5xl md:text-7xl font-extrabold tracking-tight text-on-surface dark:text-white mb-8 leading-[1.1]"><?php echo esc_html(get_theme_mod('sejaz_about_p_name', 'Syed Ejaz Gillani')); ?></h1>
                    <div class="space-y-6 text-on-surface-variant dark:text-slate-400 leading-relaxed text-base md:text-lg">
                        <?php echo wpautop(wp_kses_post(get_theme_mod('sejaz_about_p_bio', 'Syed Ejaz Digital Library is a knowledge-driven platform dedicated to promoting literature, education, and community awareness. This platform reflects the lifelong contributions and literary journey of a distinguished writer, journalist, and educator who has been actively serving in the field of media, literature, and social development since the 1980s.'))); ?>
                    </div>
                </div>
                <div class="lg:w-5/12 lg:sticky lg:top-32">
                    <div class="relative rounded-xl overflow-hidden shadow-2xl">
                        <img alt="Portrait" class="w-full h-auto object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700" src="<?php echo SEJAZ_URI; ?>/assets/images/founder_portrait.png" onerror="this.src='https://lh3.googleusercontent.com/aida/ADBb0uiPj9eWgH0FhQF9hDQv8R4KC2jtj8zIs3Lk7m1dktzLrMrdPVrtMhsj9KJP3nU8VgLv3oKPx4XRJChjrRwK8YJdl1hP08RIL8ydH8ev-AS791Lin1m2kwfByXl4LJ4BXWLshLkpaKaPZk3hUF-PJvAJIQgxPoFqgcQ7L4z-XrDn6plxfP8heme2Mo18OOG-0FV8n-jVb406D5ddXRZplgPkJYgKrdpYSHLb4PMkNHf1TOGxjfN5A6LEryAihnBgfg7TLy9oIzVwww';">
                    </div>
                    <div class="mt-16 bg-white dark:bg-slate-800 p-8 rounded-xl border border-outline-variant/30 text-center">
                        <p class="italic text-on-surface-variant dark:text-slate-300 mb-6"><?php echo esc_html(get_theme_mod('sejaz_about_p_quote', '"Knowledge is a universal heritage, and digital preservation is our duty to the future."')); ?></p>
                    </div>
                </div>
            </div>
        </div>
    </section>
</main>
<?php get_footer(); ?>
