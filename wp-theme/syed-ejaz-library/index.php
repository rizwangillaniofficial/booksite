<?php
/**
 * Fallback index template
 * @package SyedEjazLibrary
 */
get_header(); ?>

<main class="pt-32 pb-24 px-8 max-w-7xl mx-auto">
    <?php if (have_posts()): ?>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <?php while (have_posts()): the_post(); ?>
                <article class="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-sm border border-gray-100 dark:border-slate-700">
                    <h2 class="font-headline text-xl font-bold mb-3">
                        <a href="<?php the_permalink(); ?>" class="text-on-surface hover:text-[#006a6a] transition-colors"><?php the_title(); ?></a>
                    </h2>
                    <div class="text-sm text-slate-500 mb-4"><?php the_excerpt(); ?></div>
                    <a href="<?php the_permalink(); ?>" class="text-[#006a6a] font-semibold text-sm hover:underline">Read More →</a>
                </article>
            <?php endwhile; ?>
        </div>
        <?php the_posts_pagination(['class' => 'mt-12']); ?>
    <?php else: ?>
        <div class="text-center py-20">
            <span class="material-symbols-outlined text-6xl text-slate-300 mb-4 block">search_off</span>
            <h2 class="font-headline text-2xl font-bold text-slate-400">Nothing found</h2>
        </div>
    <?php endif; ?>
</main>

<?php get_footer(); ?>
