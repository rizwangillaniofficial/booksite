<?php
/**
 * Books Archive Template
 * @package SyedEjazLibrary
 */
get_header();
$active_cat = isset($_GET['category']) ? sanitize_text_field($_GET['category']) : 'all';
?>

<main class="pt-24 pb-16">
<!-- Hero Search -->
<section class="max-w-7xl mx-auto px-8 mb-16">
    <div class="relative overflow-hidden rounded-xl p-12 bg-surface-container-low">
        <div class="relative z-10 max-w-2xl">
            <h1 class="font-headline text-5xl font-extrabold tracking-tight mb-6 text-on-surface">Explore Our Digital Archive</h1>
            <p class="text-primary text-lg mb-8 leading-relaxed">Access our curated collection of books by Syed Ejaz Gillani covering literature, history, religion and more.</p>
            <form role="search" method="get" action="<?php echo get_post_type_archive_link('book'); ?>" class="flex items-center bg-surface-container-lowest rounded-full p-2 shadow-sm border border-outline-variant/10">
                <span class="material-symbols-outlined ml-4 text-outline">search</span>
                <input name="s" type="text" value="<?php echo get_search_query(); ?>" class="w-full border-none focus:ring-0 bg-transparent text-on-surface py-3 px-4 font-body" placeholder="Search by title, author, or category...">
                <input type="hidden" name="post_type" value="book">
                <button type="submit" class="gradient-cta text-white px-8 py-3 rounded-full font-semibold transition-all hover:scale-102 hover:opacity-95">Search</button>
            </form>
        </div>
        <div class="absolute right-0 top-0 w-1/3 h-full opacity-10 pointer-events-none">
            <span class="material-symbols-outlined text-[300px] absolute -right-20 -top-20">auto_stories</span>
        </div>
    </div>
</section>

<!-- Category Filters -->
<section class="max-w-7xl mx-auto px-8 mb-8">
    <div class="flex gap-3 overflow-x-auto pb-2 w-full">
        <a href="<?php echo get_post_type_archive_link('book'); ?>" class="px-6 py-2 rounded-full font-medium text-sm transition-all <?php echo $active_cat === 'all' ? 'bg-[#9deeed] text-[#0b6e6e] font-bold' : 'bg-white text-[#454749] hover:bg-[#e7e8e9]'; ?> border border-gray-100">All Books</a>
        <?php
        $cats = get_terms(['taxonomy' => 'book_category', 'hide_empty' => true]);
        if (!empty($cats) && !is_wp_error($cats)):
            foreach ($cats as $cat): ?>
                <a href="<?php echo add_query_arg('category', $cat->slug, get_post_type_archive_link('book')); ?>" 
                   class="px-6 py-2 rounded-full font-medium text-sm transition-all <?php echo $active_cat === $cat->slug ? 'bg-[#9deeed] text-[#0b6e6e] font-bold' : 'bg-white text-[#454749] hover:bg-[#e7e8e9]'; ?> border border-gray-100">
                    <?php echo esc_html($cat->name); ?>
                </a>
            <?php endforeach;
        endif; ?>
    </div>
</section>

<!-- Books Grid -->
<section class="max-w-7xl mx-auto px-8">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <?php
        $args = ['post_type' => 'book', 'posts_per_page' => -1, 'orderby' => 'date', 'order' => 'DESC'];
        if ($active_cat !== 'all') {
            $args['tax_query'] = [['taxonomy' => 'book_category', 'field' => 'slug', 'terms' => $active_cat]];
        }
        if (get_search_query()) {
            $args['s'] = get_search_query();
        }
        $books_query = new WP_Query($args);
        
        if ($books_query->have_posts()):
            while ($books_query->have_posts()): $books_query->the_post();
                sejaz_render_book_card(sejaz_get_book_data(get_post()));
            endwhile;
            wp_reset_postdata();
        else: ?>
            <div class="col-span-full text-center py-16">
                <span class="material-symbols-outlined text-6xl text-slate-300 mb-4 block">search_off</span>
                <p class="font-headline font-bold text-lg text-slate-400">No books found</p>
                <p class="text-sm text-slate-400 mt-2">Try a different search term or category</p>
            </div>
        <?php endif; ?>
    </div>
</section>
</main>

<?php get_footer(); ?>
