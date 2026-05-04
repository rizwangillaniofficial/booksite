<?php
/**
 * Generic Page Template
 * @package SyedEjazLibrary
 */
get_header(); ?>

<main class="pt-32 pb-24">
    <div class="max-w-5xl mx-auto px-8">
        <h1 class="font-headline text-5xl font-extrabold tracking-tight text-on-surface mb-8"><?php the_title(); ?></h1>
        <div class="prose prose-lg max-w-none text-on-surface-variant leading-relaxed">
            <?php the_content(); ?>
        </div>
    </div>
</main>

<?php get_footer(); ?>
