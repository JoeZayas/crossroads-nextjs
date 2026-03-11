"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { OverdueResidentRow } from "@/lib/admin-types";

type DashboardResponse = {
  kpis: {
    activeCount: number;
    totalOwed: number;
    paymentsThisMonth: number;
    owedThisMonth: number;
  };
  overdue: OverdueResidentRow[];
};

const formatMoney = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    setError(null);
    fetch("/api/admin/dashboard", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) {
          const body = (await response.json()) as { error?: string };
          setError(body.error ?? "Unable to load dashboard");
          return;
        }
        setData((await response.json()) as DashboardResponse);
      })
      .catch(() => setError("Unable to load dashboard"));
  };

  useEffect(() => {
    load();
  }, []);

  if (error) {
    return (
      <div role="alert" className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-red-700">
        <p className="font-semibold mb-1">Failed to load dashboard</p>
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

  if (!data) {
    return (
      <p role="status" aria-live="polite" className="text-slate-600">
        Loading dashboard...
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Dashboard</h2>
        <p className="text-slate-600">Active resident balances and payment health.</p>
      </div>

      <section aria-label="Key metrics" className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5" aria-label="Active Residents">
          <p className="text-sm text-slate-500" id="kpi-active-label">Active Residents</p>
          <p className="text-3xl font-bold text-slate-900" aria-labelledby="kpi-active-label">
            {data.kpis.activeCount}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5" aria-label="Total Owed">
          <p className="text-sm text-slate-500" id="kpi-total-owed-label">Total Owed</p>
          <p className="text-3xl font-bold text-amber-700" aria-labelledby="kpi-total-owed-label">
            {formatMoney(data.kpis.totalOwed)}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5" aria-label="Payments This Month">
          <p className="text-sm text-slate-500" id="kpi-payments-label">Payments This Month</p>
          <p className="text-3xl font-bold text-emerald-700" aria-labelledby="kpi-payments-label">
            {formatMoney(data.kpis.paymentsThisMonth)}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5" aria-label="Owed This Month">
          <p className="text-sm text-slate-500" id="kpi-owed-month-label">Owed This Month</p>
          <p className="text-3xl font-bold text-amber-700" aria-labelledby="kpi-owed-month-label">
            {formatMoney(data.kpis.owedThisMonth)}
          </p>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5" aria-labelledby="overdue-heading">
        <h3 id="overdue-heading" className="text-xl font-semibold text-slate-900 mb-4">Overdue Residents</h3>
        {data.overdue.length === 0 ? (
          <p className="text-slate-600">No overdue active residents.</p>
        ) : (
          <div className="overflow-x-auto" role="region" aria-label="Overdue residents table">
            <table className="w-full text-sm">
              <caption className="sr-only">Residents with overdue balances</caption>
              <thead>
                <tr className="border-b border-slate-200 text-left">
                  <th scope="col" className="py-2">Resident</th>
                  <th scope="col" className="py-2">House</th>
                  <th scope="col" className="py-2">Balance</th>
                  <th scope="col" className="py-2">Due Now</th>
                  <th scope="col" className="py-2">Last Payment</th>
                  <th scope="col" className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.overdue.map((resident) => (
                  <tr key={resident.resident_id} className="border-b border-slate-100">
                    <td className="py-2 font-medium text-slate-900">{resident.full_name}</td>
                    <td className="py-2 text-slate-700">{resident.house_name ?? "-"}</td>
                    <td className="py-2 text-amber-700 font-semibold">{formatMoney(Number(resident.balance))}</td>
                    <td className="py-2 text-amber-700 font-semibold">
                      {formatMoney(Number(resident.due_now ?? 0))}
                    </td>
                    <td className="py-2 text-slate-700">{resident.last_payment_date ?? "-"}</td>
                    <td className="py-2">
                      <Link
                        href={`/admin/residents/${resident.resident_id}`}
                        className="rounded-md border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500"
                        aria-label={`View details for ${resident.full_name}`}
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
