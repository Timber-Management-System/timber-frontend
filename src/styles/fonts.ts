import { Inter, JetBrains_Mono, Noto_Sans_Sinhala, Noto_Sans_Tamil, Plus_Jakarta_Sans } from 'next/font/google';

/**
 * Confirmed fonts (Font Selection, Option A). Each one exposes a CSS variable that
 * src/styles/tokens/typography.css picks up (--ff-heading, --ff-body, ...).
 *
 * Iskoola Pota (Sinhala) is a Windows system font: it cannot be bundled, so it is referenced by
 * name in --font-sinhala and Noto Sans Sinhala below is the free fallback for every other device.
 *
 * Usage (src/app/layout.tsx):
 *   import { fontVariables } from '@/styles/fonts';
 *   <html lang={locale} className={fontVariables}>
 */
const heading = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['500', '600', '700', '800'], variable: '--ff-heading', display: 'swap' });
const body = Inter({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--ff-body', display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--ff-mono', display: 'swap' });
const sinhala = Noto_Sans_Sinhala({ subsets: ['sinhala'], weight: ['400', '500', '600', '700'], variable: '--ff-sinhala', display: 'swap' });
const tamil = Noto_Sans_Tamil({ subsets: ['tamil'], weight: ['400', '500', '600', '700'], variable: '--ff-tamil', display: 'swap' });

export const fontVariables = [heading, body, mono, sinhala, tamil].map((f) => f.variable).join(' ');
