'use client';

import { Fragment } from 'react';

import { Icon } from './Icon';
import styles from './Stepper.module.css';

export interface StepperProps {
  /** Step names, already translated. */
  steps: string[];
  /** Index of the current step (0-based). */
  current: number;
  /** Accessible name of the list, e.g. t('common.progress'). */
  label: string;
  /** Screen-reader text for finished steps, e.g. t('common.completed'). */
  completedLabel: string;
  /** Lets users jump back to a finished step. Leave out to make steps display-only. */
  onStepClick?: (index: number) => void;
}

/**
 * Step bar for multi-step popups and forms:  (1) Information —— (2) Assessment —— (3) Result
 * Finished steps show a tick and can be clicked to go back; later steps are not clickable,
 * so users can't skip validation.
 *
 *   <Stepper steps={[t('x.step.info'), t('x.step.review')]} current={step}
 *     label={t('common.progress')} completedLabel={t('common.completed')} onStepClick={setStep} />
 */
export function Stepper({ steps, current, label, completedLabel, onStepClick }: StepperProps) {
  return (
    <ol className={styles.steps} aria-label={label}>
      {steps.map((name, i) => {
        const done = i < current;
        const state = done ? styles.done : i === current ? styles.current : styles.todo;
        const content = (
          <>
            <span className={styles.dot} aria-hidden="true">
              {done ? <Icon name="check" size={13} /> : i + 1}
            </span>
            <span className={styles.name}>
              {name}
              {done && <span className="sr-only"> ({completedLabel})</span>}
            </span>
          </>
        );
        return (
          <Fragment key={name}>
            {i > 0 && (
              <li
                className={[styles.line, done || i === current ? styles.lineDone : ''].join(' ')}
                aria-hidden="true"
              />
            )}
            <li className={[styles.step, state].join(' ')} aria-current={i === current ? 'step' : undefined}>
              {done && onStepClick ? (
                <button type="button" className={styles.button} onClick={() => onStepClick(i)}>
                  {content}
                </button>
              ) : (
                <span className={styles.button}>{content}</span>
              )}
            </li>
          </Fragment>
        );
      })}
    </ol>
  );
}
