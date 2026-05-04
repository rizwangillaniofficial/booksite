<?php
/**
 * Gallery Archive Template
 * @package SyedEjazLibrary
 */
get_header(); ?>

<main class="pt-32 pb-20">
<section class="max-w-7xl mx-auto px-8 mb-16">
    <div class="max-w-3xl">
        <span class="text-secondary font-label font-bold tracking-[0.05em] uppercase text-[0.75rem] mb-4 block">Our Visual Heritage</span>
        <h1 class="text-5xl md:text-[3.5rem] font-headline font-extrabold tracking-tight text-primary leading-tight mb-6">Gallery</h1>
        <p class="text-lg md:text-xl text-on-surface-variant font-body leading-relaxed">A visual journey through our heritage and events.</p>
    </div>
</section>

<section class="max-w-7xl mx-auto px-8">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <?php
        $gallery = new WP_Query(['post_type' => 'gallery_item', 'posts_per_page' => -1]);
        if ($gallery->have_posts()):
            while ($gallery->have_posts()): $gallery->the_post();
                $cat_label = get_post_meta(get_the_ID(), '_gallery_category', true) ?: 'Events';
                $img_url = get_the_post_thumbnail_url(get_the_ID(), 'gallery-thumb');
                ?>
                <div class="gallery-card group relative overflow-hidden bg-surface-container-lowest rounded-[1rem] transition-all duration-300 shadow-[0px_20px_40px_rgba(25,28,29,0.05)]">
                    <div class="aspect-[3/4] overflow-hidden rounded-[1rem]">
                        <?php if ($img_url): ?>
                            <img alt="<?php the_title_attribute(); ?>" class="w-full h-full object-cover transition-transform duration-500 ease-in-out" src="<?php echo esc_url($img_url); ?>">
                        <?php else: ?>
                            <div class="w-full h-full bg-gray-100 flex items-center justify-center"><span class="material-symbols-outlined text-4xl text-gray-300">image</span></div>
                        <?php endif; ?>
                    </div>
                    <div class="p-5">
                        <span class="text-[0.65rem] font-label font-bold uppercase tracking-wider text-secondary"><?php echo esc_html($cat_label); ?></span>
                        <h3 class="font-headline font-bold text-primary mt-1"><?php the_title(); ?></h3>
                    </div>
                </div>
            <?php endwhile;
            wp_reset_postdata();
        else: ?>
            <div class="col-span-full text-center py-16 text-slate-400">
                <span class="material-symbols-outlined text-6xl mb-4 block">collections</span>
                <p>No gallery items yet. Add from Dashboard → Gallery.</p>
            </div>
        <?php endif; ?>
    </div>
</section>
</main>

<?php get_footer(); ?>
