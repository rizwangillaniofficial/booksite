<?php
/**
 * Single Book Template (Reader Page)
 * @package SyedEjazLibrary
 */
get_header();
$book = sejaz_get_book_data(get_post());
$pdf_url = $book['pdf_url'];
?>

<main class="pt-24 pb-16">
<div class="max-w-5xl mx-auto px-8">
    <!-- Book Info Header -->
    <div class="mb-8">
        <a href="<?php echo get_post_type_archive_link('book'); ?>" class="inline-flex items-center gap-2 text-primary hover:text-secondary transition-colors font-headline font-semibold mb-6">
            <span class="material-symbols-outlined">arrow_back</span>
            <span>Back to Books</span>
        </a>
        <div class="flex flex-col md:flex-row gap-8 bg-surface-container-low rounded-xl p-8">
            <div class="w-48 h-72 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0 shadow-lg">
                <?php if ($book['cover']): ?>
                    <img src="<?php echo esc_url($book['cover']); ?>" alt="<?php echo esc_attr($book['title']); ?>" class="w-full h-full object-contain">
                <?php else: ?>
                    <div class="w-full h-full flex items-center justify-center"><span class="material-symbols-outlined text-6xl text-gray-300">menu_book</span></div>
                <?php endif; ?>
            </div>
            <div class="flex flex-col justify-center">
                <span class="text-xs font-bold uppercase tracking-widest text-[#006a6a] mb-2"><?php echo esc_html($book['category']); ?></span>
                <h1 class="font-headline text-3xl font-extrabold text-on-surface mb-2"><?php echo esc_html($book['title']); ?></h1>
                <?php if ($book['title_ur']): ?>
                    <p class="urdu-text text-lg text-slate-500 mb-3"><?php echo esc_html($book['title_ur']); ?></p>
                <?php endif; ?>
                <p class="text-primary mb-4">By <?php echo esc_html($book['author']); ?></p>
                <div class="text-slate-500 text-sm leading-relaxed max-w-xl"><?php the_content(); ?></div>
                <div class="flex gap-3 mt-6">
                    <span class="px-3 py-1 bg-surface-container-high rounded-full text-xs font-semibold text-primary">Year: <?php echo esc_html($book['year']); ?></span>
                    <span class="px-3 py-1 bg-surface-container-high rounded-full text-xs font-semibold text-primary">Language: <?php echo esc_html($book['language']); ?></span>
                </div>
            </div>
        </div>
    </div>

    <!-- Reader Area -->
    <div class="bg-surface-container-lowest rounded-xl shadow-lg p-8 md:p-12 min-h-[600px]">
        <?php if ($pdf_url): ?>
            <div class="w-full">
                <!-- 3D FlipBook Plugin Shortcode -->
                <?php echo do_shortcode('[3d-flip-book mode="fullscreen" pdf="' . esc_url($pdf_url) . '"][/3d-flip-book]'); ?>
                <!-- Fallback or alternative shortcode if you are using DearFlip: echo do_shortcode('[dflip source="' . esc_url($pdf_url) . '"][/dflip]'); -->
            </div>
            <div class="text-center mt-8 py-3">
                <p class="text-sm text-slate-400 mb-2">Having trouble viewing the book?</p>
                <a href="<?php echo esc_url($pdf_url); ?>" target="_blank" rel="noopener noreferrer"
                   class="inline-flex items-center gap-2 px-6 py-2.5 bg-[#006a6a] text-white rounded-full font-semibold text-sm hover:bg-[#005555] transition-all">
                    <span class="material-symbols-outlined text-[18px]">file_download</span>
                    Download / Open PDF Directly
                </a>
            </div>
        <?php else: ?>
            <div class="flex flex-col items-center justify-center h-96 text-slate-400">
                <span class="material-symbols-outlined text-6xl mb-4" style="color: #006a6a;">auto_stories</span>
                <p class="font-headline font-bold text-xl text-on-surface"><?php echo esc_html($book['title']); ?></p>
                <?php if ($book['title_ur']): ?>
                    <p class="urdu-text text-lg text-slate-400 mt-1"><?php echo esc_html($book['title_ur']); ?></p>
                <?php endif; ?>
                <p class="text-slate-400 mt-4 max-w-md text-center">The online reader for this book is coming soon.</p>
                <a href="<?php echo home_url('/contact/'); ?>" class="mt-6 inline-flex items-center gap-2 gradient-cta text-white px-6 py-3 rounded-full font-headline font-bold text-sm hover:scale-105 transition-all">
                    <span class="material-symbols-outlined text-[18px]">mail</span> Request Access
                </a>
            </div>
        <?php endif; ?>
    </div>
</div>
</main>

<?php get_footer(); ?>
