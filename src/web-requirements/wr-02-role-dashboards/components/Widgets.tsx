'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';

import { Badge } from '@/shared/components/ui/Badge';
import { Button, buttonClassName } from '@/shared/components/ui/Button';
import { Card } from '@/shared/components/ui/Card';
import { Icon, type IconName } from '@/shared/components/ui/Icon';

import type { Cell, Kpi, QuickAction, Tone, Widget } from '../types/dashboard.types';

import styles from './Dashboard.module.css';

/** Translate a dashboard label: key `dash.<slug>`, English text as fallback. */
export type Label = (english: string) => string;

/** Words the widgets need, already translated by the caller. */
export interface WidgetWords {
  viewAll: string;
  trace: string;
  critical: string;
  comingWith: (requirement: string) => string;
  criticalCount: (n: number) => string;
  updateCount: (n: number) => string;
}

const ID_PATTERN = /^([A-Z]{2,4}[- ])+[A-Z]*-?\d{2,}[A-Z0-9-]*$|^[A-Z]{2,}-\d+( \/ [A-Z]+-\d+)?$/;

const TONE_ICON: Record<Tone, IconName> = { ok: 'check', warn: 'warning', crit: 'blocked', neutral: 'info' };

/** Picks an icon from the meaning of a KPI label (Option B stat-card icon tile). */
const KPI_ICONS: [RegExp, IconName][] = [
  [/user|login|account/i, 'users'],
  [/sync|device/i, 'smartphone'],
  [/backup|uptime|health/i, 'shield'],
  [/blocked|protected|unaccounted|compliance|risk/i, 'blocked'],
  [/permit|quota|licen|expir/i, 'file'],
  [/tree|survey|felled|approval/i, 'tree'],
  [/trip|transit|vehicle|discrepanc|deliver/i, 'truck'],
  [/yield|output|input|processing|downtime|reject|machine|order.*progress/i, 'factory'],
  [/revenue|sales|receivable|payable|overdue|cash|margin|cost|stock value|payable/i, 'wallet'],
  [/quotation|order|purchase|complaint|credit/i, 'cart'],
  [/log|stock|inventory|low-stock/i, 'box'],
];

function kpiIcon(label: string): IconName {
  return KPI_ICONS.find(([re]) => re.test(label))?.[1] ?? 'chart';
}

/** "1,240 m³" → ["1,240", "m³"]; values without a unit stay whole. */
function splitUnit(value: string): [string, string | null] {
  const m = value.match(/^(.*\d)\s+(m³|h|pcs|trees|logs|permits|orders)$/);
  return m ? [m[1], m[2]] : [value, null];
}

/** Option B stat card: label + icon tile, big value, trend chip and note. */
export function KpiTile({ kpi, label }: { kpi: Kpi; label: Label }) {
  const [value, unit] = splitUnit(kpi.value);
  const amber = kpi.tone === 'warn' || kpi.tone === 'crit';
  // "+8% vs last month" → chip "+8%" with a trend arrow, then "vs last month".
  const trend = kpi.hint?.match(/^([+-]\d[\d.,]*%)\s*(.*)$/);

  const body = (
    <>
      <span className={styles.statTop}>
        <span className={styles.kpiLabel}>{label(kpi.label)}</span>
        <span className={[styles.statIcon, amber && styles.statIconAmber].filter(Boolean).join(' ')} aria-hidden="true">
          <Icon name={kpiIcon(kpi.label)} size={18} />
        </span>
      </span>
      <span className={styles.kpiValue}>
        {value}
        {unit && <small>{unit}</small>}
      </span>
      {kpi.hint && (
        <span className={styles.statFoot}>
          {trend ? (
            <>
              <span className={[styles.chip, styles[kpi.tone ?? 'ok']].join(' ')}>
                <Icon name="trendUp" size={14} />
                {trend[1]}
              </span>
              {trend[2]}
            </>
          ) : kpi.tone && kpi.tone !== 'neutral' ? (
            <span className={[styles.chip, styles[kpi.tone]].join(' ')}>{kpi.hint}</span>
          ) : (
            kpi.hint
          )}
        </span>
      )}
    </>
  );
  return kpi.href ? (
    <Link href={kpi.href} className={[styles.kpi, styles.kpiLink].join(' ')}>
      {body}
    </Link>
  ) : (
    <div className={styles.kpi}>{body}</div>
  );
}

/** Option B hero: greeting, what this role looks after, and the most-used task as the main button. */
export function WelcomeBanner({
  greeting,
  intro,
  action,
  label,
}: {
  greeting: string;
  intro?: string;
  action?: QuickAction;
  label: Label;
}) {
  return (
    <section className={styles.hero} aria-label={greeting}>
      <div className={styles.heroCopy}>
        <h2 className={styles.heroTitle}>{greeting}</h2>
        {intro && <p className={styles.heroText}>{label(intro)}</p>}
        {action && (
          <Link href={action.href} className={buttonClassName({ variant: 'primary' })}>
            {label(action.label)}
            <Icon name="arrowUpRight" size={16} />
          </Link>
        )}
      </div>
      <span className={styles.heroArt} aria-hidden="true">
        <Icon name="tree" size={52} strokeWidth={1.4} />
      </span>
    </section>
  );
}

function CellView({ cell, label }: { cell: Cell; label: Label }) {
  // IDs and codes (PER-010, TRP-014, WP LM-2210) use the mono font; names and text do not.
  if (typeof cell === 'string')
    return ID_PATTERN.test(cell) ? <span className={styles.mono}>{cell}</span> : <>{cell}</>;
  if ('badge' in cell) return <Badge tone={cell.tone}>{label(cell.badge)}</Badge>;
  return (
    <Link href={cell.href} className={buttonClassName({ variant: 'ghost', size: 'sm' })}>
      {label(cell.link)}
    </Link>
  );
}

const isCritical = (cell: Cell) => typeof cell === 'object' && 'badge' in cell && cell.tone === 'crit';

/** Rounds the chart's top value up to a readable number (e.g. 66 → 75, 8.6 → 9). */
function niceMax(max: number): number {
  if (max <= 0) return 1;
  const raw = max / 3;
  const power = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((f) => f * power).find((s) => s >= raw) ?? raw;
  return step * 3;
}

function formatTick(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}

function Bars({ widget, label }: { widget: Extract<Widget, { type: 'bars' }>; label: Label }) {
  const top = niceMax(Math.max(...widget.series.flatMap((s) => s.values), 0));
  const ticks = [3, 2, 1, 0].map((k) => (top / 3) * k);
  const unit = widget.unit ?? '';
  const summary = widget.labels
    .map((l, i) => `${l}: ${widget.series.map((s) => `${s.values[i]}${unit}`).join(' / ')}`)
    .join(', ');
  return (
    <>
      <div className={styles.chartArea}>
        <div className={styles.yaxis} aria-hidden="true">
          {ticks.map((t) => (
            <span key={t}>
              {formatTick(t)}
              {unit}
            </span>
          ))}
        </div>
        <div className={styles.chart} role="img" aria-label={`${label(widget.title)}. ${summary}`}>
          {widget.labels.map((l, i) => (
            <div key={l} className={styles.barGroup}>
              <div className={styles.barStack}>
                {widget.series.map((s, si) => (
                  <span
                    key={s.name}
                    className={[styles.bar, si > 0 && styles.barAlt].filter(Boolean).join(' ')}
                    style={{ height: `${(s.values[i] / top) * 100}%` }}
                    title={`${label(s.name)}: ${s.values[i]}${unit}`}
                  >
                    <span className={styles.barValue}>
                      {s.values[i]}
                      {unit}
                    </span>
                  </span>
                ))}
              </div>
              <span className={styles.barLabel}>{l}</span>
            </div>
          ))}
        </div>
      </div>
      <ul className={styles.legend}>
        {widget.series.map((s, si) => (
          <li key={s.name}>
            <i className={[styles.swatch, si > 0 ? styles.barAlt : styles.bar].join(' ')} aria-hidden="true" />
            {label(s.name)}
          </li>
        ))}
      </ul>
    </>
  );
}

const DONUT_CLASSES = ['d1', 'd2', 'd3', 'd4', 'd5', 'd6'];

function Donut({ widget, label }: { widget: Extract<Widget, { type: 'donut' }>; label: Label }) {
  const total = widget.slices.reduce((sum, s) => sum + s.value, 0) || 1;
  const pcts = widget.slices.map((s) => (s.value / total) * 100);
  // Each slice starts where the previous ones end; 25 = start at 12 o'clock.
  const offsets = pcts.map((_, i) => 25 - pcts.slice(0, i).reduce((a, b) => a + b, 0));
  return (
    <div className={styles.donutWrap}>
      <svg
        viewBox="0 0 42 42"
        className={styles.donut}
        role="img"
        aria-label={`${label(widget.title)}. ${widget.slices.map((s, i) => `${label(s.label)} ${Math.round(pcts[i])}%`).join(', ')}`}
      >
        {widget.slices.map((s, i) => (
          <circle
            key={s.label}
            className={styles[DONUT_CLASSES[i % DONUT_CLASSES.length]]}
            cx="21"
            cy="21"
            r="15.915"
            fill="none"
            strokeWidth="7"
            strokeDasharray={`${pcts[i]} ${100 - pcts[i]}`}
            strokeDashoffset={offsets[i]}
          />
        ))}
      </svg>
      <ul className={styles.donutLegend}>
        {widget.slices.map((s, i) => (
          <li key={s.label}>
            <i
              className={[styles.swatch, styles[`${DONUT_CLASSES[i % DONUT_CLASSES.length]}Bg`]].join(' ')}
              aria-hidden="true"
            />
            <span>{label(s.label)}</span>
            <b>{Math.round(pcts[i])}%</b>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TraceSearch({ placeholder, label, buttonText }: { placeholder: string; label: Label; buttonText: string }) {
  const router = useRouter();
  const [q, setQ] = useState('');
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (q.trim()) router.push(`/search?q=${encodeURIComponent(q.trim())}`);
  };
  return (
    <form className={styles.trace} role="search" onSubmit={submit}>
      <label className="sr-only" htmlFor="trace-input">
        {label(placeholder)}
      </label>
      <Icon name="search" size={16} className={styles.traceIcon} />
      <input
        id="trace-input"
        className={styles.traceInput}
        placeholder={label(placeholder)}
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <Button type="submit">{buttonText}</Button>
    </form>
  );
}

function AlertList({
  items,
  criticalWord,
}: {
  items: Extract<Widget, { type: 'alerts' }>['items'];
  criticalWord: string;
}) {
  return (
    <ul className={styles.alerts}>
      {items.map((a) => (
        <li
          key={a.text}
          className={[styles.alert, styles[a.tone]].join(' ')}
          role={a.tone === 'crit' ? 'alert' : undefined}
        >
          <span className={styles.alertIcon} aria-hidden="true">
            <Icon name={TONE_ICON[a.tone]} size={18} />
          </span>
          <span className={styles.alertBody}>
            <b>
              {a.title ?? a.text}
              {a.tone === 'crit' && <span className={styles.alertTag}>{criticalWord}</span>}
            </b>
            {a.title && <span className={styles.alertText}>{a.text}</span>}
          </span>
          {a.time && <span className={styles.alertTime}>{a.time}</span>}
        </li>
      ))}
    </ul>
  );
}

function QuickActions({ actions, label }: { actions: QuickAction[]; label: Label }) {
  return (
    <ul className={styles.quick}>
      {actions.map((a, i) => (
        <li key={a.href + a.label}>
          <Link href={a.href} className={styles.quickItem}>
            <span
              className={[styles.quickIcon, i % 2 === 1 && styles.statIconAmber].filter(Boolean).join(' ')}
              aria-hidden="true"
            >
              <Icon name={a.icon} size={18} />
            </span>
            <span className={styles.quickText}>
              <b>{label(a.label)}</b>
              <small>{label(a.hint)}</small>
            </span>
            <Icon name="chevronRight" size={16} className={styles.quickGo} />
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function WidgetCard({
  widget,
  label,
  words,
  quickActions = [],
}: {
  widget: Widget;
  label: Label;
  words: WidgetWords;
  /** Used by the 'actions' widget: the role's quick actions the user may open. */
  quickActions?: QuickAction[];
}) {
  if (widget.type === 'actions' && quickActions.length === 0) return null;

  const span = styles[widget.span ?? 'narrow'];
  const viewAll =
    'viewAllHref' in widget && widget.viewAllHref ? (
      <Link href={widget.viewAllHref} className={buttonClassName({ variant: 'ghost', size: 'sm' })}>
        {words.viewAll}
      </Link>
    ) : null;

  let actions = viewAll;
  if (widget.type === 'alerts') {
    const crit = widget.items.filter((a) => a.tone === 'crit').length;
    const updates = widget.items.length - crit;
    actions = (
      <>
        <span className={styles.counts}>
          {crit > 0 && <span className={[styles.chip, styles.crit].join(' ')}>{words.criticalCount(crit)}</span>}
          {updates > 0 && <span className={[styles.chip, styles.warn].join(' ')}>{words.updateCount(updates)}</span>}
        </span>
        {viewAll}
      </>
    );
  }

  return (
    <Card title={label(widget.title)} actions={actions ?? undefined} className={span} flush={widget.type === 'table'}>
      {widget.type === 'bars' && <Bars widget={widget} label={label} />}
      {widget.type === 'donut' && <Donut widget={widget} label={label} />}
      {widget.type === 'alerts' && <AlertList items={widget.items} criticalWord={words.critical} />}
      {widget.type === 'actions' && <QuickActions actions={quickActions} label={label} />}

      {widget.type === 'table' && (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                {widget.columns.map((c) => (
                  <th key={c} scope="col">
                    {label(c)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {widget.rows.map((row, ri) => (
                <tr key={ri} className={row.some(isCritical) ? styles.rowCrit : undefined}>
                  {row.map((cell, ci) => (
                    <td key={ci}>
                      <CellView cell={cell} label={label} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {widget.type === 'list' && (
        <ul className={styles.list}>
          {widget.items.map((item) => (
            <li key={item.text}>
              <span className={styles.listText}>
                {item.tone && <Icon name={TONE_ICON[item.tone]} size={16} className={styles[item.tone]} />}
                {item.text}
              </span>
              {item.meta && (
                <span className={[styles.listMeta, item.tone && styles[item.tone]].filter(Boolean).join(' ')}>
                  {item.meta}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}

      {widget.type === 'placeholder' && (
        <div className={styles.placeholder}>
          <Icon name="mapPin" size={28} />
          <p>{words.comingWith(widget.requirement)}</p>
        </div>
      )}

      {widget.type === 'trace' && (
        <TraceSearch placeholder={widget.placeholder} label={label} buttonText={words.trace} />
      )}

      {widget.type === 'links' && (
        <ul className={styles.links}>
          {widget.links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className={styles.linkTile}>
                <b>{label(l.label)}</b>
                {l.description && <span>{label(l.description)}</span>}
                <Icon name="chevronRight" size={16} className={styles.linkArrow} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
