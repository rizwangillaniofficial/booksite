<?php
/**
 * Homepage Template (front-page.php)
 * @package SyedEjazLibrary
 */
get_header();

$hero_title    = get_theme_mod('sejaz_hero_title', 'Syed Ejaz Gillani');
$hero_subtitle = get_theme_mod('sejaz_hero_subtitle', 'A Pakistani Canadian writer, blogger & Community Coordinator. promoting infos. languages & cultures.');
$about_title   = get_theme_mod('sejaz_about_title', 'Read More, Learn More, Grow More');
$about_text    = get_theme_mod('sejaz_about_text', 'Syed Ejaz Digital Library is more than just a collection of books — it is a platform built to share knowledge, ideas, and learning resources with a wider audience.');
$stat1_num     = get_theme_mod('sejaz_stat1_num', '7+');
$stat1_text    = get_theme_mod('sejaz_stat1_text', 'Digital Books');
$stat2_num     = get_theme_mod('sejaz_stat2_num', '120+');
$stat2_text    = get_theme_mod('sejaz_stat2_text', 'Global Archives');
?>

<main class="pt-24">
<!-- Hero Section -->
<section class="relative min-h-[819px] flex items-center px-8 overflow-hidden">
    <div class="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center">
        <div class="z-10 text-left">
            <h1 class="text-[3.5rem] leading-[1.1] font-headline font-extrabold text-on-surface -tracking-[0.02em] mb-6">
                <span class="text-gradient"><?php echo esc_html($hero_title); ?></span><br>
            </h1>
            <div class="text-lg text-primary max-w-lg mb-10 leading-relaxed"><?php echo wp_kses_post($hero_subtitle); ?></div>
            <div class="flex items-center gap-6">
                <a href="<?php echo get_post_type_archive_link('book'); ?>" class="gradient-cta text-white px-10 py-4 rounded-full font-headline font-bold text-lg hover:scale-[1.02] transition-all duration-300 shadow-xl">Browse Books</a>
                <a href="<?php echo home_url('/categories/'); ?>" class="flex items-center gap-2 font-headline font-semibold text-primary hover:text-secondary transition-colors">
                    <span class="material-symbols-outlined">explore</span> View Collections
                </a>
            </div>
        </div>
        <div class="relative hidden lg:block">
            <div class="absolute -top-20 -right-20 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>
            <div class="relative z-10 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <?php if (has_custom_logo()): ?>
                    <?php the_custom_logo(); ?>
                <?php else: ?>
                    <img alt="Digital Library Interface" class="rounded-xl shadow-[0px_40px_80px_rgba(0,0,0,0.1)] w-full aspect-[4/5] object-cover" src="<?php echo SEJAZ_URI; ?>/assets/images/hero_library_interface.png">
                <?php endif; ?>
            </div>
        </div>
    </div>
</section>

<!-- About Intro Section -->
<section class="py-32 bg-surface-container-low">
    <div class="max-w-7xl mx-auto px-8">
        <div class="flex flex-col md:flex-row gap-16 items-center">
            <div class="md:w-1/2">
                <div class="relative inline-block mb-8">
                    <h2 class="text-3xl font-headline font-bold text-on-surface relative z-10"><?php echo esc_html($about_title); ?></h2>
                    <div class="absolute -bottom-2 left-0 w-1/3 h-2 bg-secondary/20 -z-0"></div>
                </div>
                <div class="text-primary text-lg leading-relaxed mb-8"><?php echo wp_kses_post($about_text); ?></div>
                <div class="grid grid-cols-2 gap-8">
                    <div>
                        <h4 class="text-2xl font-headline font-extrabold text-secondary"><?php echo esc_html($stat1_num); ?></h4>
                        <p class="text-sm font-medium text-slate-500 uppercase tracking-tighter"><?php echo esc_html($stat1_text); ?></p>
                    </div>
                    <div>
                        <h4 class="text-2xl font-headline font-extrabold text-secondary"><?php echo esc_html($stat2_num); ?></h4>
                        <p class="text-sm font-medium text-slate-500 uppercase tracking-tighter"><?php echo esc_html($stat2_text); ?></p>
                    </div>
                </div>
            </div>
            <div class="md:w-1/2 grid grid-cols-2 gap-4">
                <img alt="Archive Image" class="rounded-lg h-64 w-full object-cover shadow-sm" src="<?php echo SEJAZ_URI; ?>/assets/images/archive_image.png">
                <img alt="Library Design" class="rounded-lg h-64 w-full object-cover mt-12 shadow-sm" src="<?php echo SEJAZ_URI; ?>/assets/images/library_design.png">
            </div>
        </div>
    </div>
</section>

<!-- Featured Books Section -->
<section class="py-32 bg-surface-container-lowest">
    <div class="max-w-7xl mx-auto px-8">
        <div class="flex justify-between items-end mb-16">
            <div>
                <span class="text-sm text-secondary font-bold uppercase tracking-widest mb-2 block">Our Curated Selection</span>
                <h2 class="text-4xl font-headline font-extrabold text-on-surface">Featured Books</h2>
            </div>
            <a class="text-secondary font-headline font-bold hover:translate-x-1 transition-transform flex items-center gap-2" href="<?php echo get_post_type_archive_link('book'); ?>">
                View All Collections <span class="material-symbols-outlined">arrow_right_alt</span>
            </a>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <?php
            $featured = new WP_Query(['post_type' => 'book', 'posts_per_page' => 4, 'orderby' => 'date', 'order' => 'DESC']);
            if ($featured->have_posts()):
                while ($featured->have_posts()): $featured->the_post();
                    sejaz_render_book_card(sejaz_get_book_data(get_post()));
                endwhile;
                wp_reset_postdata();
            else: ?>
                <div class="col-span-full text-center py-12 text-slate-400">
                    <span class="material-symbols-outlined text-6xl mb-4 block">menu_book</span>
                    <p>No books added yet. Add books from WordPress Dashboard → Books.</p>
                </div>
            <?php endif; ?>
        </div>
    </div>
</section>

<!-- Categories Preview -->
<section class="py-32 bg-surface">
    <div class="max-w-7xl mx-auto px-8 text-center mb-16">
        <h2 class="text-3xl font-headline font-bold text-on-surface mb-4">Browse by Category</h2>
        <p class="text-primary max-w-xl mx-auto">Explore our diverse collection across various genres and specialized academic disciplines.</p>
    </div>
    <div class="max-w-7xl mx-auto px-8 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        <?php
        $categories = get_terms(['taxonomy' => 'book_category', 'hide_empty' => false]);
        if (!empty($categories) && !is_wp_error($categories)):
            foreach ($categories as $cat):
                $icon = get_term_meta($cat->term_id, '_category_icon', true) ?: 'category';
                ?>
                <a href="<?php echo get_term_link($cat); ?>" class="bg-surface-container-lowest p-8 rounded-xl text-center group hover:-translate-y-2 transition-all duration-300 cursor-pointer block">
                    <span class="material-symbols-outlined text-4xl text-secondary mb-4 group-hover:scale-110 transition-transform block"><?php echo esc_html($icon); ?></span>
                    <span class="font-headline font-bold text-on-surface text-sm block"><?php echo esc_html($cat->name); ?></span>
                    <span class="text-xs text-slate-400 mt-1 block"><?php echo $cat->count; ?> books</span>
                </a>
            <?php endforeach;
        else: ?>
            <div class="col-span-full text-center text-slate-400 py-8">Add book categories from Dashboard → Books → Book Categories</div>
        <?php endif; ?>
    </div>
</section>

<!-- Newsletter CTA -->
<section class="py-24 px-8">
    <div class="max-w-5xl mx-auto gradient-cta rounded-[2rem] p-12 text-center text-white relative overflow-hidden">
        <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div class="relative z-10">
            <h2 class="text-3xl md:text-4xl font-headline font-extrabold mb-6">Stay Updated with New Archives</h2>
            <p class="text-white/80 mb-10 max-w-lg mx-auto">Join our monthly newsletter to receive updates on newly digitized historical collections and featured readings.</p>
            <div class="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input class="flex-1 bg-white/10 border border-white/20 rounded-full px-6 py-3 text-white placeholder:text-white/50 focus:ring-2 focus:ring-white outline-none" placeholder="Your email address" type="email">
                <button class="bg-white text-secondary font-headline font-bold px-8 py-3 rounded-full hover:bg-surface transition-colors">Subscribe</button>
            </div>
        </div>
    </div>
</section>
</main>

<?php get_footer(); ?>
