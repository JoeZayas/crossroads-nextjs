"use client";

import { useEffect, useState } from "react";

type MonthlyReport = {
  month: string;
  charges: number;
  payments: number;
  adjustments: number;
  net: number;
};

const formatMoney = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

export default function ReportsPage() {
  const [rows, setRows] = useState<MonthlyReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    setError(null);
    fetch("/api/admin/reports/monthly", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) {
          const body = (await response.json()) as { error?: string };
          setError(body.error ?? "Unable to load report");
          return;
        }
        setRows((await response.json()) as MonthlyReport[]);
      })
      .catch(() => setError("Unable to load report"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  if (error) {
    return (
      <div role="alert" className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-red-700">
        <p className="font-semibold mb-1">Failed to load report</p>
        <p className="text-sm mb-3">{error}</p>
        <button
          onClick={load}
          className="text-sm font-semibold underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Monthly Totals</h2>
        <p className="text-slate-600">Charges, payments, adjustments, and net by month.</p>
      </div>

      {loading ? (
        <p role="status" aria-live="polite" className="text-slate-600">
          Loading report...
        </p>
      ) : rows.length === 0 ? (
        <p className="text-slate-600">No monthly report data available.</p>
      ) : (
        <div
          className="rounded-xl border border-slate-200 bg-white p-5 overflow-x-auto"
          role="region"
          aria-label="Monthly totals table"
        >
          <table className="w-full text-sm">
            <caption className="sr-only">Monthly financial totals including charges, payments, adjustments, and net</caption>
            <thead>
              <tr className="border-b border-slate-200 text-left">
                <th scope="col" className="py-2">Month</th>
                <th scope="col" className="py-2">Charges</th>
                <th scope="col" className="py-2">Payments</th>
                <th scope="col" className="py-2">Adjustments</th>
                <th scope="col" className="py-2">Net</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.month} className="border-b border-slate-100">
                  <td className="py-2 font-medium text-slate-900">{row.month}</td>
                  <td className="py-2 text-amber-700">{formatMoney(row.charges)}</td>
                  <td className="py-2 text-emerald-700">{formatMoney(row.payments)}</td>
                  <td className="py-2 text-slate-700">{formatMoney(row.adjustments)}</td>
                  <td className={`py-2 font-semibold ${row.net > 0 ? "text-amber-700" : "text-emerald-700"}`}>
                    {formatMoney(row.net)}
                    <span className="sr-only">{row.net > 0 ? " (owed)" : " (surplus)"}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
