<?php
// Load WordPress
require_once 'wp-load.php';

// 1. Clean parent theme mods custom_logo
$mods_astra = get_option('theme_mods_astra');
if (is_array($mods_astra)) {
    if (isset($mods_astra['custom_logo'])) {
        unset($mods_astra['custom_logo']);
        update_option('theme_mods_astra', $mods_astra);
        echo "Removed custom_logo from theme_mods_astra.\n";
    }
}

// 2. Clean child theme mods custom_logo
$mods_child = get_option('theme_mods_calmerplaces-child');
if (is_array($mods_child)) {
    if (isset($mods_child['custom_logo'])) {
        unset($mods_child['custom_logo']);
        update_option('theme_mods_calmerplaces-child', $mods_child);
        echo "Removed custom_logo from theme_mods_calmerplaces-child.\n";
    }
}

// 3. Update astra-settings
$settings = get_option('astra-settings');
if (is_array($settings)) {
    $settings['header-button1-text'] = 'Add your place';
    $settings['header-button1-link-option'] = array(
        'url' => home_url('/add-listing/'),
        'new_tab' => false,
        'link_rel' => ''
    );
    $settings['footer-copyright-editor'] = 'Copyright [copyright] [current_year] [site_title] | The world, a little calmer.';
    
    update_option('astra-settings', $settings);
    echo "Updated astra-settings (header button and footer copyright text).\n";
}

// 4. Flush cache
wp_cache_flush();
echo "Flushed object cache.\n";
