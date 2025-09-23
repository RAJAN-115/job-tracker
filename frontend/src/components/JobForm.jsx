/*
BEGINNER-FRIENDLY JOB FORM OVERHAUL

What changed and why (rationale):
- Added controlled inputs with inline validation and helpful messages (title, company, status, type, location, salary, link, notes).
- Mobile-first layout with logical grouping and accessible labels/hints.
- Reused option lists to stay consistent with Header filters and JobList sorting.
- onSubmit provides a safe, normalized payload; onCancel lets users back out easily.
- Added defaults and PropTypes so this form is predictable and beginner-friendly.

How to use:
<JobForm initialValues={...} onSubmit={handleSave} onCancel={() => setOpen(false)} />

See implementation-guide.md for guidelines around validation and UX.
*/

import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

const STATUS_OPTIONS = ['applied', 'interview', 'offer', 'rejected'];
const TYPE_OPTIONS = ['full-time', 'part-time', 'contract', 'internship', 'remote'];

const styles = {
  form: { display: 'grid', gap: 12 },
  field: { display: 'grid', gap: 6 },
  row: { display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' },
  input: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: 10,
    border: '1px solid rgba(255,255,255,0.16)',
    background: 'rgba(255,255,255,0.06)',
    color: 'inherit',
  },
  select: {
    padding: '10px 12px',
    borderRadius: 10,
    border: '1px solid rgba(255,255,255,0.16)',
    background: 'rgba(255,255,255,0.06)',
    color: 'inherit',
  },
  textarea: {
    width: '100%',
    minHeight: 80,
    padding: '10px 12px',
    borderRadius: 10,
    border: '1px solid rgba(255,255,255,0.16)',
    background: 'rgba(255,255,255,0.06)',
    color: 'inherit',
  },
  hint: { fontSize: 12, opacity: 0.8 },
  error: { fontSize: 12, color: '#fca5a5' },
  actions: { display: 'flex', gap: 8, justifyContent: 'flex-end', flexWrap: 'wrap' },
  primary: {
    padding: '10px 14px',
    background: '#10b981',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    cursor: 'pointer',
  },
  ghost: {
    padding: '10px 14px',
    background: 'transparent',
    color: 'inherit',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: 10,
    cursor: 'pointer',
  },
};

const normalize = v => (typeof v === 'string' ? v.trim() : v);

export default function JobForm({ initialValues = {}, onSubmit = () => {}, onCancel = () => {} }) {
  const defaults = useMemo(
    () => ({
      title: '',
      company: '',
      status: STATUS_OPTIONS[0],
      type: TYPE_OPTIONS[0],
      location: '',
      salary: '',
      link: '',
      notes: '',
    }),
    []
  );

  const [values, setValues] = useState({ ...defaults, ...initialValues });
  useEffect(() => setValues({ ...defaults, ...initialValues }), [initialValues, defaults]);

  const [errors, setErrors] = useState({});

  const setField = (key, value) => setValues(v => ({ ...v, [key]: value }));

  const validate = () => {
    const e = {};
    if (!normalize(values.title)) e.title = 'Job title is required';
    if (!normalize(values.company)) e.company = 'Company is required';
    if (values.salary && Number(values.salary) < 0) e.salary = 'Salary must be positive';
    if (values.link) {
      try {
        new URL(values.link);
      } catch {
        e.link = 'Please enter a valid URL (https://...)';
      }
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!validate()) return;
    const payload = {
      ...values,
      title: normalize(values.title),
      company: normalize(values.company),
      location: normalize(values.location),
      salary: values.salary ? Number(values.salary) : '',
      link: normalize(values.link),
      notes: normalize(values.notes),
      createdAt: values.createdAt || new Date().toISOString(),
    };
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form} noValidate>
      <div style={styles.row}>
        <div style={styles.field}>
          <label htmlFor="title">Job Title</label>
          <input
            id="title"
            style={styles.input}
            value={values.title}
            onChange={e => setField('title', e.target.value)}
            placeholder="e.g. Frontend Engineer"
          />
          {errors.title ? (
            <span style={styles.error}>{errors.title}</span>
          ) : (
            <span style={styles.hint}>Required</span>
          )}
        </div>
        <div style={styles.field}>
          <label htmlFor="company">Company</label>
          <input
            id="company"
            style={styles.input}
            value={values.company}
            onChange={e => setField('company', e.target.value)}
            placeholder="e.g. Acme Inc."
          />
          {errors.company ? (
            <span style={styles.error}>{errors.company}</span>
          ) : (
            <span style={styles.hint}>Required</span>
          )}
        </div>
      </div>

      <div style={styles.row}>
        <div style={styles.field}>
          <label htmlFor="status">Status</label>
          <select
            id="status"
            style={styles.select}
            value={values.status}
            onChange={e => setField('status', e.target.value)}
          >
            {STATUS_OPTIONS.map(s => (
              <option key={s} value={s}>
                {s[0].toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
          <span style={styles.hint}>Track where you are in the process</span>
        </div>

        <div style={styles.field}>
          <label htmlFor="type">Type</label>
          <select
            id="type"
            style={styles.select}
            value={values.type}
            onChange={e => setField('type', e.target.value)}
          >
            {TYPE_OPTIONS.map(t => (
              <option key={t} value={t}>
                {t[0].toUpperCase() + t.slice(1)}
              </option>
            ))}
          </select>
          <span style={styles.hint}>Choose employment type</span>
        </div>

        <div style={styles.field}>
          <label htmlFor="location">Location</label>
          <input
            id="location"
            style={styles.input}
            value={values.location}
            onChange={e => setField('location', e.target.value)}
            placeholder="e.g. Remote, Bangalore"
          />
        </div>
      </div>

      <div style={styles.row}>
        <div style={styles.field}>
          <label htmlFor="salary">Salary (annual)</label>
          <input
            id="salary"
            type="number"
            min={0}
            inputMode="numeric"
            style={styles.input}
            value={values.salary}
            onChange={e => setField('salary', e.target.value)}
            placeholder="e.g. 120000"
          />
          {errors.salary ? (
            <span style={styles.error}>{errors.salary}</span>
          ) : (
            <span style={styles.hint}>Optional</span>
          )}
        </div>

        <div style={styles.field}>
          <label htmlFor="link">Job Link</label>
          <input
            id="link"
            type="url"
            style={styles.input}
            value={values.link}
            onChange={e => setField('link', e.target.value)}
            placeholder="https://..."
          />
          {errors.link ? (
            <span style={styles.error}>{errors.link}</span>
          ) : (
            <span style={styles.hint}>Optional but helpful</span>
          )}
        </div>
      </div>

      <div style={styles.field}>
        <label htmlFor="notes">Notes</label>
        <textarea
          id="notes"
          style={styles.textarea}
          value={values.notes}
          onChange={e => setField('notes', e.target.value)}
          placeholder="Anything you want to remember (referral, timeline, questions)"
        />
      </div>

      <div style={styles.actions}>
        <button type="button" style={styles.ghost} onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" style={styles.primary}>
          Save Job
        </button>
      </div>
    </form>
  );
}

JobForm.propTypes = {
  initialValues: PropTypes.object,
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
};
