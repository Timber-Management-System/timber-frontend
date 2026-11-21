import type { MetadataRoute } from 'next';

/**
 * Web app manifest (installable PWA for field teams, WR-05).
 * Manifest colours must be literal values: they match --tt-bg-page and --tt-sidebar-bg.
 * Add icons to public/icons/ and list them here when the logo is ready.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'TimberTrack - Timber Management System',
    short_name: 'TimberTrack',
    start_url: '/dashboard',
    display: 'standalone',
    background_color: '#f8f1e7',
    theme_color: '#042b1e',
  };
}
