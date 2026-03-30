/**
 * Shared rental-period calculation utilities.
 *
 * Canonical rule: a period whose `periodStart` equals today is NOT yet overdue
 * because rent due today has not missed its deadline.  All callers must use
 * `periodStart < today` (strict less-than) when deciding whether to count a
 * period as missing.
 */

export const startOfToday = (): Date => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

export const addDays = (date: Date, days: number): Date => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

export const startOfMonth = (date: Date): Date =>
  new Date(date.getFullYear(), date.getMonth(), 1);

export const nextMonthStart = (date: Date): Date =>
  new Date(date.getFullYear(), date.getMonth() + 1, 1);

/**
 * Returns true if `periodStart` represents a rental period that is already
 * overdue — i.e. the period began strictly before today.
 *
 * A period starting *on* today is not yet overdue (use `< today`, not `<= today`).
 */
export const isPeriodOverdue = (periodStart: Date, today: Date): boolean =>
  periodStart < today;
