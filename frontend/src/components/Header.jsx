/*
BEGINNER-FRIENDLY HEADER COMPONENT OVERHAUL

What changed and why (rationale):
- Added unified search + multi-filter controls (status, type, location, min/max salary, sort) so users can quickly narrow jobs.
- Debounced text search to avoid re-filtering on every keystroke and improve performance.
- Mobile-first responsive layout with a collapsible filter drawer and accessible labels.
- Clear visual hierarchy and keyboard-accessible controls for usability (a11y).
- Lifted change events via onSearch/onFiltersChange props to keep component reusable.
- Documented all major decisions inline, with prop types and defaults for beginners.

How to use (quick start):
<Header
  totalJobs={jobs.length}
  search={query}
  filters={{ status, type, location, minSalary, maxSalary, sort }}
  onSearch={setQuery}
  onFiltersChange={setFilters}
  onResetFilters={() => setFilters(defaults)}
/>

See implementation-guide.md for design guidelines that informed these choices.
*/

import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

// Simple utility: wait N ms (used for debounce)
const sleep = ms => new Promise(r => setTimeout(r, ms));

// Options defined in one place to keep UI and business rules in sync
const STATUS_OPTIONS = ['all', 'applied', 'interview', 'offer', 'rejected'];
const TYPE_OPTIONS = ['all', 'full-time', 'part-time', 'contract', 'internship', 'remote'];
const SORT_OPTIONS = [
  { value: 'date-desc', label: 'Newest' },
  { value: 'date-asc', label: 'Oldest' },
  { value: 'salary-desc', label: 'Salary: High to Low' },
  { value: 'salary-asc', label: 'Salary: Low to High' },
  { value: 'title-asc', label: 'Title A→Z' },
  { value: 'title-desc', label: 'Title Z→A' },
];

// Minimal inline styles (kept small). Prefer your project CSS/tailwind.
const styles = {
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 20,
    background: 'var(--bg, #0b1020)',
    color: 'var(--fg, #e6eaf2)',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
  },
  container: { maxWidth: 1200, margin: '0 auto', padding: '12px 16px' },
  row: { display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' },
  title: { fontSize: 18, fontWeight: 700 },
  count: { opacity: 0.8, fontSize: 13 },
  grow: { flex: 1, minWidth: 200 },
  input: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: 10,
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'rgba(255,255,255,0.06)',
    color: 'inherit',
  },
  select: {
    padding: '10px 12px',
    borderRadius: 10,
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'rgba(255,255,255,0.06)',
    color: 'inherit',
  },
  number: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: 10,
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'rgba(255,255,255,0.06)',
    color: 'inherit',
  },
  button: {
    padding: '10px 14px',
    borderRadius: 10,
    border: '1px solid rgba(255,255,255,0.16)',
    background: 'transparent',
    color: 'inherit',
    cursor: 'pointer',
  },
  primary: { background: '#3b82f6', border: 'none', color: '#fff' },
  pill: {
    padding: '6px 10px',
    borderRadius: 999,
    fontSize: 12,
    border: '1px solid rgba(255,255,255,0.16)',
  },
  toolbar: { display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' },
  drawer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: 12,
    paddingTop: 10,
  },
};

function useDebouncedValue(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    let alive = true;
    (async () => {
      await sleep(delay);
      if (alive) setDebounced(value);
    })();
    return () => {
      alive = false;
    };
  }, [value, delay]);
  return debounced;
}

export default function Header({
  totalJobs = 0,
  search = '',
  filters = {},
  onSearch = () => {},
  onFiltersChange = () => {},
  onResetFilters = () => {},
}) {
  // Local UI state for mobile drawer toggle
  const [showFilters, setShowFilters] = useState(false);

  // Keep a local input string to debounce before emitting
  const [localSearch, setLocalSearch] = useState(search);
  useEffect(() => setLocalSearch(search), [search]); // keep in sync from outside
  const debouncedSearch = useDebouncedValue(localSearch, 350);
  useEffect(() => {
    onSearch(debouncedSearch);
  }, [debouncedSearch, onSearch]);

  // Merge defaults with provided filters so we always have safe values
  const merged = useMemo(
    () => ({
      status: 'all',
      type: 'all',
      location: '',
      minSalary: '',
      maxSalary: '',
      sort: 'date-desc',
      ...filters,
    }),
    [filters]
  );

  // Helper to propagate filter changes up in a single object
  const setFilter = (key, value) => onFiltersChange({ ...merged, [key]: value });

  const resetAll = () => {
    onResetFilters();
    setLocalSearch('');
  };

  return (
    <header style={styles.header}>
      <div style={styles.container}>
        {/* Top row: Branding, count, primary actions */}
        <div style={styles.row}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span aria-hidden style={{ fontSize: 18 }}>
              🗂️
            </span>
            <div>
              <div style={styles.title}>Job Tracker</div>
              <div style={styles.count} aria-live="polite">
                {totalJobs} jobs
              </div>
            </div>
          </div>

          {/* Search input grows to take available space */}
          <div style={styles.grow}>
            <label htmlFor="job-search" className="sr-only">
              Search jobs
            </label>
            <input
              id="job-search"
              style={styles.input}
              type="search"
              placeholder="Search by title, company, tags…"
              value={localSearch}
              onChange={e => setLocalSearch(e.target.value)}
            />
          </div>

          {/* Desktop filter toggles */}
          <div style={styles.toolbar}>
            <button
              type="button"
              style={{ ...styles.button, ...styles.pill }}
              aria-expanded={showFilters}
              aria-controls="filter-drawer"
              onClick={() => setShowFilters(s => !s)}
            >
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>

            <button
              type="button"
              style={{ ...styles.button, ...styles.primary }}
              onClick={resetAll}
            >
              Reset
            </button>
          </div>
        </div>

        {/* Collapsible filters: responsive grid */}
        {showFilters && (
          <div id="filter-drawer" style={styles.drawer}>
            {/* Status */}
            <div>
              <label htmlFor="filter-status">Status</label>
              <select
                id="filter-status"
                style={styles.select}
                value={merged.status}
                onChange={e => setFilter('status', e.target.value)}
              >
                {STATUS_OPTIONS.map(opt => (
                  <option key={opt} value={opt}>
                    {opt[0].toUpperCase() + opt.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Type */}
            <div>
              <label htmlFor="filter-type">Type</label>
              <select
                id="filter-type"
                style={styles.select}
                value={merged.type}
                onChange={e => setFilter('type', e.target.value)}
              >
                {TYPE_OPTIONS.map(opt => (
                  <option key={opt} value={opt}>
                    {opt[0].toUpperCase() + opt.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div>
              <label htmlFor="filter-location">Location</label>
              <input
                id="filter-location"
                style={styles.input}
                type="text"
                placeholder="e.g. Remote, Bangalore"
                value={merged.location}
                onChange={e => setFilter('location', e.target.value)}
              />
            </div>

            {/* Salary range (beginner friendly: plain numbers) */}
            <div>
              <label htmlFor="min-salary">Min Salary</label>
              <input
                id="min-salary"
                style={styles.number}
                type="number"
                min={0}
                inputMode="numeric"
                placeholder="0"
                value={merged.minSalary}
                onChange={e => setFilter('minSalary', e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="max-salary">Max Salary</label>
              <input
                id="max-salary"
                style={styles.number}
                type="number"
                min={0}
                inputMode="numeric"
                placeholder=""
                value={merged.maxSalary}
                onChange={e => setFilter('maxSalary', e.target.value)}
              />
            </div>

            {/* Sort */}
            <div>
              <label htmlFor="sort">Sort</label>
              <select
                id="sort"
                style={styles.select}
                value={merged.sort}
                onChange={e => setFilter('sort', e.target.value)}
              >
                {SORT_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

Header.propTypes = {
  // Number to announce count of jobs currently visible
  totalJobs: PropTypes.number,

  // Current search text (controlled from parent)
  search: PropTypes.string,

  // Bundle of filters controlled by parent for simplicity
  filters: PropTypes.shape({
    status: PropTypes.string,
    type: PropTypes.string,
    location: PropTypes.string,
    minSalary: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    maxSalary: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    sort: PropTypes.string,
  }),

  // Callbacks the parent can use to react to UI changes
  onSearch: PropTypes.func,
  onFiltersChange: PropTypes.func,
  onResetFilters: PropTypes.func,
};
