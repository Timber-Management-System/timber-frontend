'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';

import { Badge } from '@/shared/components/ui/Badge';
import { Button, buttonClassName } from '@/shared/components/ui/Button';
import { Card } from '@/shared/components/ui/Card';
import { Icon, type IconName } from '@/shared/components/ui/Icon';

import type { Cell, Kpi, Tone, Widget } from '../types/dashboard.types';

import styles from './Dashboard.module.css';

/** Translate a dashboard label: key `dash.<slug>`, English text as fallback. */
export type Label = (english: string) => string;

const ID_PATTERN = /^([A-Z]{2,4}[- ])+[A-Z]*-?\d{2,}[A-Z0-9-]*$|^[A-Z]{2,}-\d+( \/ [A-Z]+-\d+)?$/;

const TONE_ICON: Record<Tone, IconName> = { ok: 'check', warn: 'warning', crit: 'blocked', neutral: 'info' };

export function KpiTile({ kpi, label }: { kpi: Kpi; label: Label }) {
  const body = (
    <>
      <span className={styles.kpiLabel}>{label(kpi.label)}</span>
      <span className={styles.kpiValue}>{kpi.value}</span>
      {kpi.hint && (
        <span className={[styles.kpiHint, kpi.tone && styles[kpi.tone]].filter(Boolean).join(' ')}>{kpi.hint}</span>
      )}
      {!kpi.hint && kpi.tone && kpi.tone !== 'neutral' && (
        <span className={[styles.kpiDot, styles[kpi.tone]].join(' ')} aria-hidden="true" />
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

function ViewAll({ href, text }: { href?: string; text: string }) {
  if (!href) return null;
  return (
    <Link href={href} className={buttonClassName({ variant: 'ghost', size: 'sm' })}>
      {text}
    </Link>
  );
}

function Bars({ widget, label }: { widget: Extract<Widget, { type: 'bars' }>; label: Label }) {
  const max = Math.max(...widget.series.flatMap((s) => s.values), 0) || 1;
  const unit = widget.unit ?? '';
  const summary = widget.labels
    .map((l, i) => `${l}: ${widget.series.map((s) => `${s.values[i]}${unit}`).join(' / ')}`)
    .join(', ');
  return (
    <>
      <div className={styles.chart} role="img" aria-label={`${label(widget.title)}. ${summary}`}>
        {widget.labels.map((l, i) => (
          <div key={l} className={styles.barGroup}>
            <div className={styles.barStack}>
              {widget.series.map((s, si) => (
                <span
                  key={s.name}
                  className={[styles.bar, si > 0 && styles.barAlt].filter(Boolean).join(' ')}
                  style={{ height: `${(s.values[i] / max) * 100}%` }}
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
      {widget.series.length > 1 && (
        <ul className={styles.legend}>
          {widget.series.map((s, si) => (
            <li key={s.name}>
              <i className={[styles.swatch, si > 0 ? styles.barAlt : styles.bar].join(' ')} aria-hidden="true" />
              {label(s.name)}
            </li>
          ))}
        </ul>
      )}
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
        aria-label={`${label(widget.title)}. ${widget.slices.map((s) => `${label(s.label)} ${Math.round((s.value / total) * 100)}%`).join(', ')}`}
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
            <b>{Math.round((s.value / total) * 100)}%</b>
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

export function WidgetCard({
  widget,
  label,
  words,
}: {
  widget: Widget;
  label: Label;
  words: { viewAll: string; trace: string; comingWith: (req: string) => string };
}) {
  const span = styles[widget.span ?? 'narrow'];
  const actions =
    'viewAllHref' in widget && widget.viewAllHref ? (
      <ViewAll href={widget.viewAllHref} text={words.viewAll} />
    ) : undefined;

  return (
    <Card title={label(widget.title)} actions={actions} className={span} flush={widget.type === 'table'}>
      {widget.type === 'bars' && <Bars widget={widget} label={label} />}
      {widget.type === 'donut' && <Donut widget={widget} label={label} />}

      {widget.type === 'alerts' && (
        <ul className={styles.alerts}>
          {widget.items.map((a) => (
            <li key={a.text} className={[styles.alert, styles[a.tone]].join(' ')}>
              <Icon name={TONE_ICON[a.tone]} size={16} />
              <span>{a.text}</span>
            </li>
          ))}
        </ul>
      )}

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
                <tr key={ri}>
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
