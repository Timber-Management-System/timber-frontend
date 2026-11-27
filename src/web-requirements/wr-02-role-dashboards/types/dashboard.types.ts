/**
 * WR-02 Role-based dashboard. A dashboard is data: KPI tiles + widgets. The backend will send
 * the same shape (GET /dashboard); until then src/…/data/dashboards.mock.ts holds the wireframe values.
 *
 * Labels and titles are English and are translated with the key `dash.<slug of the English text>`
 * (e.g. "Active permits" → `dash.active-permits`), so translators only add keys to si.json / ta.json.
 */
import type { IconName } from '@/shared/components/ui/Icon';

export type Tone = 'ok' | 'warn' | 'crit' | 'neutral';

export interface Kpi {
  label: string;
  value: string;
  hint?: string;
  tone?: Tone;
  /** Page that explains this number. */
  href?: string;
}

/** A table cell: plain text, a status badge, or a link/button. */
export type Cell = string | { badge: string; tone: Tone } | { link: string; href: string };

export type Span = 'narrow' | 'wide' | 'full';

export type Widget =
  | {
      type: 'bars';
      title: string;
      span?: Span;
      labels: string[];
      series: { name: string; values: number[] }[];
      /** Suffix for values, e.g. "%" or " m³". */
      unit?: string;
    }
  | { type: 'donut'; title: string; span?: Span; slices: { label: string; value: number }[] }
  | {
      type: 'alerts';
      title: string;
      span?: Span;
      /** Option B style: bold title, one-line text, time. `text` alone is shown as the title. */
      items: { text: string; tone: Tone; title?: string; time?: string }[];
      viewAllHref?: string;
    }
  | { type: 'table'; title: string; span?: Span; columns: string[]; rows: Cell[][]; viewAllHref?: string }
  | { type: 'list'; title: string; span?: Span; items: { text: string; meta?: string; tone?: Tone }[] }
  | { type: 'placeholder'; title: string; span?: Span; text: string; requirement: string }
  | { type: 'trace'; title: string; span?: Span; placeholder: string }
  | { type: 'links'; title: string; span?: Span; links: { label: string; href: string; description?: string }[] }
  | { type: 'actions'; title: string; span?: Span };

/** A shortcut on the "Quick actions" card and the welcome banner (Option B). */
export interface QuickAction {
  label: string;
  hint: string;
  href: string;
  icon: IconName;
}

export interface Dashboard {
  /** Which wireframe this follows, e.g. "S-01.4". */
  screen: string;
  title: string;
  /** Short notice under the title (e.g. auditor read-only). */
  notice?: string;
  /** One sentence for the welcome banner: what this role looks after. */
  intro?: string;
  /** Most-used tasks for this role. The first one is the banner's main button. */
  quickActions?: QuickAction[];
  kpis: Kpi[];
  widgets: Widget[];
}
