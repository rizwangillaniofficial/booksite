<?php
/**
 * Syed Ejaz Digital Library - functions.php
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'SEJAZ_VERSION', '1.0.1' );
define( 'SEJAZ_DIR', get_template_directory() );
define( 'SEJAZ_URI', get_template_directory_uri() );

/**
 * Theme Setup
 */
add_action( 'after_setup_theme', function() {
	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'custom-logo' );
	add_theme_support( 'html5', array( 'search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script' ) );
	
	add_image_size( 'book-cover', 400, 600, true );
	add_image_size( 'gallery-thumb', 600, 800, true );

	register_nav_menus( array(
		'primary' => 'Primary Menu',
		'footer'  => 'Footer Menu',
	) );
} );

/**
 * Enqueue Scripts and Styles
 */
add_action( 'wp_enqueue_scripts', function() {
	// Tailwind CDN (for development/ease of use)
	wp_enqueue_script( 'tailwindcss', 'https://cdn.tailwindcss.com?plugins=forms,typography,aspect-ratio,container-queries', array(), null );
	
	// Google Fonts & Material Symbols
	wp_enqueue_style( 'google-fonts', 'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap', array(), null );
	
	// Theme Style
	wp_enqueue_style( 'sejaz-style', get_stylesheet_uri(), array(), SEJAZ_VERSION );

	// Inline Tailwind Config (to match your design system)
	wp_add_inline_script( 'tailwindcss', '
		tailwind.config = {
			darkMode: "class",
			theme: {
				extend: {
					colors: {
						"surface": "#f8f9fa",
						"surface-dim": "#d9dadb",
						"surface-bright": "#f8f9fa",
						"surface-container-lowest": "#ffffff",
						"surface-container-low": "#f3f4f5",
						"surface-container": "#edeeef",
						"surface-container-high": "#e7e8e9",
						"surface-container-highest": "#e1e3e4",
						"on-surface": "#191c1d",
						"on-surface-variant": "#3e4948",
						"outline": "#6e7979",
						"outline-variant": "#bec9c8",
						"primary": "#454749",
						"primary-container": "#5d5f61",
						"on-primary": "#ffffff",
						"on-primary-container": "#d9d9db",
						"secondary": "#006a6a",
						"secondary-container": "#9deeed",
						"on-secondary": "#ffffff",
						"on-secondary-container": "#0b6e6e",
						"tertiary": "#0132c5",
						"tertiary-container": "#2f4fdd",
						"on-tertiary": "#ffffff",
						"on-tertiary-container": "#d2d7ff",
						"error": "#ba1a1a",
						"error-container": "#ffdad6",
						"on-error": "#ffffff",
						"on-error-container": "#93000a",
						"background": "#f8f9fa",
						"on-background": "#191c1d",
					},
					fontFamily: {
						headline: ["Manrope", "sans-serif"],
						body: ["Inter", "sans-serif"],
					},
				}
			}
		}
	' );
} );

/**
 * Custom Post Types
 */
add_action( 'init', function() {
	// Books CPT
	register_post_type( 'book', array(
		'labels' => array(
			'name'               => 'Books',
			'singular_name'      => 'Book',
			'add_new'            => 'Add New Book',
			'add_new_item'       => 'Add New Book',
			'edit_item'          => 'Edit Book',
			'all_items'          => 'All Books',
			'view_item'          => 'View Book',
			'search_items'       => 'Search Books',
			'not_found'          => 'No books found',
			'not_found_in_trash' => 'No books found in Trash',
		),
		'public'              => true,
		'has_archive'         => true,
		'rewrite'             => array( 'slug' => 'books' ),
		'menu_icon'           => 'dashicons-book-alt',
		'supports'            => array( 'title', 'editor', 'thumbnail', 'excerpt' ),
		'show_in_rest'        => true,
		'taxonomies'          => array( 'book_category' ),
	) );

	// Book Categories Taxonomy
	register_taxonomy( 'book_category', 'book', array(
		'labels' => array(
			'name'          => 'Book Categories',
			'singular_name' => 'Book Category',
		),
		'hierarchical' => true,
		'show_ui'      => true,
		'show_in_rest' => true,
		'show_admin_column' => true,
		'rewrite'      => array( 'slug' => 'book-category' ),
	) );

	// Gallery CPT
	register_post_type( 'gallery_item', array(
		'labels' => array(
			'name'          => 'Gallery',
			'singular_name' => 'Gallery Item',
			'add_new'       => 'Add New Image',
			'all_items'     => 'All Gallery Items',
		),
		'public'      => true,
		'has_archive' => true,
		'rewrite'     => array( 'slug' => 'gallery' ),
		'menu_icon'   => 'dashicons-format-gallery',
		'supports'    => array( 'title', 'thumbnail' ),
		'show_in_rest'=> true,
	) );
} );

/**
 * Meta Boxes for Books
 */
add_action( 'add_meta_boxes', function() {
	add_meta_box( 'book_details', 'Book Details', 'sejaz_book_details_cb', 'book', 'normal', 'high' );
} );

function sejaz_book_details_cb( $post ) {
	wp_nonce_field( 'sejaz_save_book_meta', 'sejaz_book_meta_nonce' );
	
	$author      = get_post_meta( $post->ID, '_book_author', true ) ?: 'Syed Ejaz Gillani';
	$year        = get_post_meta( $post->ID, '_book_year', true );
	$pdf_url     = get_post_meta( $post->ID, '_book_pdf_url', true );
	$language    = get_post_meta( $post->ID, '_book_language', true ) ?: 'Urdu';
	$title_urdu  = get_post_meta( $post->ID, '_book_title_ur', true );

	?>
	<div class="sejaz-meta-box">
		<p>
			<label for="book_title_ur"><strong>Urdu Title</strong></label><br>
			<input type="text" id="book_title_ur" name="book_title_ur" value="<?php echo esc_attr( $title_urdu ); ?>" class="regular-text" style="width:100%;" dir="rtl">
		</p>
		<p>
			<label for="book_author"><strong>Author</strong></label><br>
			<input type="text" id="book_author" name="book_author" value="<?php echo esc_attr( $author ); ?>" class="regular-text" style="width:100%;">
		</p>
		<p>
			<label for="book_year"><strong>Publication Year</strong></label><br>
			<input type="text" id="book_year" name="book_year" value="<?php echo esc_attr( $year ); ?>" class="small-text">
		</p>
		<p>
			<label for="book_language"><strong>Language</strong></label><br>
			<input type="text" id="book_language" name="book_language" value="<?php echo esc_attr( $language ); ?>" class="regular-text">
		</p>
		<p>
			<label for="book_pdf_url"><strong>PDF URL (Google Drive)</strong></label><br>
			<input type="url" id="book_pdf_url" name="book_pdf_url" value="<?php echo esc_url( $pdf_url ); ?>" class="large-text" style="width:100%;">
			<span class="description">Paste your Google Drive link here. It will be automatically converted to embed format.</span>
		</p>
	</div>
	<?php
}

add_action( 'save_post_book', function( $post_id ) {
	if ( ! isset( $_POST['sejaz_book_meta_nonce'] ) || ! wp_verify_nonce( $_POST['sejaz_book_meta_nonce'], 'sejaz_save_book_meta' ) ) {
		return;
	}
	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
		return;
	}
	if ( ! current_user_can( 'edit_post', $post_id ) ) {
		return;
	}

	$fields = array(
		'book_title_ur' => '_book_title_ur',
		'book_author'   => '_book_author',
		'book_year'     => '_book_year',
		'book_language' => '_book_language',
		'book_pdf_url'  => '_book_pdf_url',
	);

	foreach ( $fields as $key => $meta_key ) {
		if ( isset( $_POST[ $key ] ) ) {
			$value = ( 'book_pdf_url' === $key ) ? esc_url_raw( $_POST[ $key ] ) : sanitize_text_field( $_POST[ $key ] );
			
			// Auto-convert GDrive URL
			if ( 'book_pdf_url' === $key && ! empty( $value ) ) {
				$value = sejaz_convert_gdrive_url( $value );
			}
			
			update_post_meta( $post_id, $meta_key, $value );
		}
	}
} );

/**
 * Helper to convert GDrive URLs
 */
function sejaz_convert_gdrive_url( $url ) {
	if ( preg_match( '/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/', $url, $matches ) ) {
		return 'https://drive.google.com/file/d/' . $matches[1] . '/preview';
	}
	if ( preg_match( '/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/', $url, $matches ) ) {
		return 'https://drive.google.com/file/d/' . $matches[1] . '/preview';
	}
	return $url;
}

/**
 * Customizer Settings (Make everything editable)
 */
add_action( 'customize_register', function( $wp_customize ) {
	// Hero Section
	$wp_customize->add_section( 'sejaz_hero', array(
		'title'    => 'Hero Section',
		'priority' => 30,
	) );

	$wp_customize->add_setting( 'sejaz_hero_title', array( 'default' => 'Syed Ejaz Gillani' ) );
	$wp_customize->add_control( 'sejaz_hero_title', array( 'label' => 'Hero Title', 'section' => 'sejaz_hero', 'type' => 'text' ) );

	$wp_customize->add_setting( 'sejaz_hero_subtitle', array( 'default' => 'A Pakistani Canadian writer, blogger & Community Coordinator. promoting infos, languages & cultures.' ) );
	$wp_customize->add_control( 'sejaz_hero_subtitle', array( 'label' => 'Hero Subtitle', 'section' => 'sejaz_hero', 'type' => 'textarea' ) );

	// About Section
	$wp_customize->add_section( 'sejaz_about', array( 'title' => 'About Section', 'priority' => 35 ) );
	
	$wp_customize->add_setting( 'sejaz_about_title', array( 'default' => 'Read More, Learn More, Grow More' ) );
	$wp_customize->add_control( 'sejaz_about_title', array( 'label' => 'About Title', 'section' => 'sejaz_about', 'type' => 'text' ) );

	$wp_customize->add_setting( 'sejaz_about_text', array( 'default' => 'Syed Ejaz Digital Library is more than just a collection of books — it is a platform built to share knowledge, ideas, and learning resources with a wider audience.' ) );
	$wp_customize->add_control( 'sejaz_about_text', array( 'label' => 'About Text', 'section' => 'sejaz_about', 'type' => 'textarea' ) );

	// Stats
	$wp_customize->add_setting( 'sejaz_stat1_num', array( 'default' => '7+' ) );
	$wp_customize->add_control( 'sejaz_stat1_num', array( 'label' => 'Stat 1 Number', 'section' => 'sejaz_about', 'type' => 'text' ) );
	$wp_customize->add_setting( 'sejaz_stat1_text', array( 'default' => 'Digital Books' ) );
	$wp_customize->add_control( 'sejaz_stat1_text', array( 'label' => 'Stat 1 Text', 'section' => 'sejaz_about', 'type' => 'text' ) );

	$wp_customize->add_setting( 'sejaz_stat2_num', array( 'default' => '120+' ) );
	$wp_customize->add_control( 'sejaz_stat2_num', array( 'label' => 'Stat 2 Number', 'section' => 'sejaz_about', 'type' => 'text' ) );
	$wp_customize->add_setting( 'sejaz_stat2_text', array( 'default' => 'Global Archives' ) );
	$wp_customize->add_control( 'sejaz_stat2_text', array( 'label' => 'Stat 2 Text', 'section' => 'sejaz_about', 'type' => 'text' ) );

	// Footer Section
	$wp_customize->add_section( 'sejaz_footer', array( 'title' => 'Footer Settings', 'priority' => 40 ) );
	
	$wp_customize->add_setting( 'sejaz_footer_desc', array( 'default' => 'Curating knowledge, preserving heritage, and empowering the future through digital literacy.' ) );
	$wp_customize->add_control( 'sejaz_footer_desc', array( 'label' => 'Footer Description', 'section' => 'sejaz_footer', 'type' => 'textarea' ) );

	$wp_customize->add_setting( 'sejaz_facebook_url', array( 'default' => '#' ) );
	$wp_customize->add_control( 'sejaz_facebook_url', array( 'label' => 'Facebook URL', 'section' => 'sejaz_footer', 'type' => 'url' ) );

	$wp_customize->add_setting( 'sejaz_youtube_url', array( 'default' => '#' ) );
	$wp_customize->add_control( 'sejaz_youtube_url', array( 'label' => 'YouTube URL', 'section' => 'sejaz_footer', 'type' => 'url' ) );

	$wp_customize->add_setting( 'sejaz_email_address', array( 'default' => '' ) );
	$wp_customize->add_control( 'sejaz_email_address', array( 'label' => 'Contact Email', 'section' => 'sejaz_footer', 'type' => 'text' ) );

	// About Page Settings
	$wp_customize->add_section( 'sejaz_about_page', array( 'title' => 'About Page Content', 'priority' => 45 ) );
	
	$wp_customize->add_setting( 'sejaz_about_p_tag', array( 'default' => 'Founder' ) );
	$wp_customize->add_control( 'sejaz_about_p_tag', array( 'label' => 'Profile Tag', 'section' => 'sejaz_about_page', 'type' => 'text' ) );

	$wp_customize->add_setting( 'sejaz_about_p_name', array( 'default' => 'Syed Ejaz Gillani' ) );
	$wp_customize->add_control( 'sejaz_about_p_name', array( 'label' => 'Profile Name', 'section' => 'sejaz_about_page', 'type' => 'text' ) );

	$wp_customize->add_setting( 'sejaz_about_p_bio', array( 'default' => 'Syed Ejaz Digital Library is a knowledge-driven platform...' ) );
	$wp_customize->add_control( 'sejaz_about_p_bio', array( 'label' => 'Profile Bio', 'section' => 'sejaz_about_page', 'type' => 'textarea' ) );

	$wp_customize->add_setting( 'sejaz_about_p_quote', array( 'default' => '"Knowledge is a universal heritage..." ' ) );
	$wp_customize->add_control( 'sejaz_about_p_quote', array( 'label' => 'Profile Quote', 'section' => 'sejaz_about_page', 'type' => 'textarea' ) );

	// Contact Page Settings
	$wp_customize->add_section( 'sejaz_contact_page', array( 'title' => 'Contact Page Content', 'priority' => 50 ) );
	
	$wp_customize->add_setting( 'sejaz_contact_p_title', array( 'default' => "Let's Connect with the Archive." ) );
	$wp_customize->add_control( 'sejaz_contact_p_title', array( 'label' => 'Contact Title', 'section' => 'sejaz_contact_page', 'type' => 'text' ) );

	$wp_customize->add_setting( 'sejaz_contact_p_sub', array( 'default' => 'Have a question about our collections or need assistance?' ) );
	$wp_customize->add_control( 'sejaz_contact_p_sub', array( 'label' => 'Contact Subtitle', 'section' => 'sejaz_contact_page', 'type' => 'textarea' ) );

	$wp_customize->add_setting( 'sejaz_contact_address', array( 'default' => '123 Library Lane, Academic District' ) );
	$wp_customize->add_control( 'sejaz_contact_address', array( 'label' => 'Physical Address', 'section' => 'sejaz_contact_page', 'type' => 'textarea' ) );

	$wp_customize->add_setting( 'sejaz_contact_phone', array( 'default' => '+1 (555) 012-3456' ) );
	$wp_customize->add_control( 'sejaz_contact_phone', array( 'label' => 'Phone Number', 'section' => 'sejaz_contact_page', 'type' => 'text' ) );
} );

/**
 * Data Helpers
 */
function sejaz_get_book_data( $post ) {
	$categories = get_the_terms( $post->ID, 'book_category' );
	return array(
		'id'          => $post->ID,
		'title'       => get_the_title( $post ),
		'title_ur'    => get_post_meta( $post->ID, '_book_title_ur', true ),
		'author'      => get_post_meta( $post->ID, '_book_author', true ) ?: 'Syed Ejaz Gillani',
		'year'        => get_post_meta( $post->ID, '_book_year', true ),
		'category'    => ( $categories && ! is_wp_error( $categories ) ) ? $categories[0]->name : '',
		'cover'       => get_the_post_thumbnail_url( $post, 'book-cover' ) ?: '',
		'pdf_url'     => get_post_meta( $post->ID, '_book_pdf_url', true ),
		'description' => get_the_excerpt( $post ),
		'language'    => get_post_meta( $post->ID, '_book_language', true ) ?: 'Urdu',
		'permalink'   => get_permalink( $post ),
	);
}

function sejaz_render_book_card( $book ) {
	?>
	<div class="book-card bg-white dark:bg-slate-900 rounded-xl overflow-hidden flex flex-col h-full shadow-sm border border-gray-100 dark:border-slate-800 transition-all hover:-translate-y-1 hover:shadow-lg">
		<div class="relative overflow-hidden aspect-[2/3] bg-gray-50 dark:bg-slate-950 flex items-center justify-center">
			<?php if ( $book['cover'] ) : ?>
				<img src="<?php echo esc_url( $book['cover'] ); ?>" alt="<?php echo esc_attr( $book['title'] ); ?>" class="w-full h-full object-contain">
			<?php else : ?>
				<span class="material-symbols-outlined text-6xl text-gray-300 dark:text-slate-800">menu_book</span>
			<?php endif; ?>
			<?php if ( $book['category'] ) : ?>
				<span class="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-widest bg-secondary text-white px-3 py-1 rounded-full"><?php echo esc_html( $book['category'] ); ?></span>
			<?php endif; ?>
		</div>
		<div class="flex flex-col flex-grow p-5">
			<h3 class="text-base font-headline font-bold text-on-surface dark:text-white mb-1 truncate"><?php echo esc_html( $book['title'] ); ?></h3>
			<?php if ( $book['title_ur'] ) : ?>
				<p class="text-sm text-slate-400 dark:text-slate-500 mb-1" dir="rtl"><?php echo esc_html( $book['title_ur'] ); ?></p>
			<?php endif; ?>
			<p class="text-xs text-slate-400 dark:text-slate-500 mb-3"><?php echo esc_html( $book['author'] ); ?></p>
			<div class="mt-auto flex gap-2">
				<a href="<?php echo esc_url( $book['permalink'] ); ?>" class="read-btn flex-1 py-2.5 bg-surface-container-low dark:bg-slate-800 text-center font-headline font-semibold rounded-lg text-sm block dark:text-white hover:bg-secondary hover:text-white transition-all">Read Online</a>
				<?php if ( $book['pdf_url'] ) : ?>
					<a href="<?php echo esc_url( str_replace( '/preview', '/view', $book['pdf_url'] ) ); ?>" target="_blank" class="py-2.5 px-3 bg-surface-container-low dark:bg-slate-800 rounded-lg hover:bg-secondary hover:text-white transition-all dark:text-white">
						<span class="material-symbols-outlined text-[18px]">open_in_new</span>
					</a>
				<?php endif; ?>
			</div>
		</div>
	</div>
	<?php
}
