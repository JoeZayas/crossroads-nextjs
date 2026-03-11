"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import type { House, PaymentType, ResidentBalanceRow, ResidentStatus } from "@/lib/admin-types";

const formatMoney = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

type ResidentCreate = {
  full_name: string;
  house_id: string;
  payment_type: PaymentType;
  move_in_date: string;
  contract_signed_date: string;
  move_in_fee_due: string;
  status: ResidentStatus;
  notes: string;
};

const defaultForm: ResidentCreate = {
  full_name: "",
  house_id: "",
  payment_type: "Weekly",
  move_in_date: "",
  contract_signed_date: "",
  move_in_fee_due: "200",
  status: "Active",
  notes: "",
};

export default function ResidentsPage() {
  const [residents, setResidents] = useState<ResidentBalanceRow[]>([]);
  const [houses, setHouses] = useState<House[]>([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [houseFilter, setHouseFilter] = useState("");
  const [form, setForm] = useState<ResidentCreate>(defaultForm);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const query = useMemo(() => {
    const params = new URLSearchParams();
    if (statusFilter) params.set("status", statusFilter);
    if (houseFilter) params.set("house_id", houseFilter);
    return params.toString();
  }, [statusFilter, houseFilter]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [residentsResponse, housesResponse] = await Promise.all([
        fetch(`/api/admin/residents${query ? `?${query}` : ""}`, { cache: "no-store" }),
        fetch("/api/admin/houses", { cache: "no-store" }),
      ]);

      if (!residentsResponse.ok) {
        const body = (await residentsResponse.json()) as { error?: string };
        throw new Error(body.error ?? "Unable to load residents");
      }

      if (!housesResponse.ok) {
        const body = (await housesResponse.json()) as { error?: string };
        throw new Error(body.error ?? "Unable to load houses");
      }

      setResidents((await residentsResponse.json()) as ResidentBalanceRow[]);
      setHouses((await housesResponse.json()) as House[]);
    } catch (loadError) {
      const message = loadError instanceof Error ? loadError.message : "Unable to load data";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    load().catch(() => setError("Unable to load data"));
  }, [load]);

  const onCreateResident = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const payload = {
      full_name: form.full_name,
      house_id: form.house_id || null,
      payment_type: form.payment_type,
      move_in_date: form.move_in_date || null,
      contract_signed_date: form.contract_signed_date || null,
      move_in_fee_due: Number(form.move_in_fee_due || 0),
      status: form.status,
      notes: form.notes || null,
    };

    const response = await fetch("/api/admin/residents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const body = (await response.json()) as { error?: string };
      setError(body.error ?? "Unable to create resident");
      return;
    }

    setForm(defaultForm);
    setSuccessMessage(`Resident "${form.full_name}" created successfully.`);
    await load();
  };

  if (loading) {
    return (
      <p role="status" aria-live="polite" className="text-slate-600">
        Loading residents...
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Residents</h2>
        <p className="text-slate-600">Manage residents, view balances, and create new records.</p>
      </div>

      {error && (
        <div role="alert" className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-red-700">
          <p className="font-semibold mb-1">Error</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {successMessage && (
        <div role="status" aria-live="polite" className="rounded-md bg-green-50 border border-green-200 px-4 py-3 text-green-700 text-sm">
          {successMessage}
        </div>
      )}

      <section className="rounded-xl border border-slate-200 bg-white p-5" aria-labelledby="filters-heading">
        <h3 id="filters-heading" className="text-lg font-semibold text-slate-900 mb-4">Filters</h3>
        <fieldset>
          <legend className="sr-only">Filter residents</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <label htmlFor="status-filter" className="text-sm font-medium text-slate-700">
              Status
              <select
                id="status-filter"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500"
              >
                <option value="">All</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </label>
            <label htmlFor="house-filter" className="text-sm font-medium text-slate-700">
              House
              <select
                id="house-filter"
                value={houseFilter}
                onChange={(event) => setHouseFilter(event.target.value)}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500"
              >
                <option value="">All</option>
                {houses.map((house) => (
                  <option key={house.id} value={house.id}>
                    {house.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </fieldset>
      </section>

      <section aria-labelledby="residents-table-heading">
        <h3 id="residents-table-heading" className="sr-only">Residents list</h3>
        <div
          className="rounded-xl border border-slate-200 bg-white p-5 overflow-x-auto"
          role="region"
          aria-label="Residents table"
        >
          {residents.length === 0 ? (
            <p className="text-slate-600">No residents found matching the current filters.</p>
          ) : (
            <table className="w-full text-sm">
              <caption className="sr-only">Resident balances and details</caption>
              <thead>
                <tr className="border-b border-slate-200 text-left">
                  <th scope="col" className="py-2">Resident</th>
                  <th scope="col" className="py-2">House</th>
                  <th scope="col" className="py-2">Status</th>
                  <th scope="col" className="py-2">Payment Type</th>
                  <th scope="col" className="py-2">Due Now</th>
                  <th scope="col" className="py-2">Ledger Balance</th>
                  <th scope="col" className="py-2">Balance</th>
                  <th scope="col" className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {residents.map((resident) => (
                  <tr key={resident.resident_id} className="border-b border-slate-100">
                    <td className="py-2 font-medium text-slate-900">{resident.full_name}</td>
                    <td className="py-2 text-slate-700">{resident.house_name ?? "-"}</td>
                    <td className="py-2 text-slate-700">{resident.status}</td>
                    <td className="py-2 text-slate-700">{resident.payment_type ?? "-"}</td>
                    <td className="py-2 text-amber-700 font-semibold">
                      {formatMoney(Number(resident.scheduled_due_missing ?? 0))}
                    </td>
                    <td className="py-2 text-slate-700 font-semibold">
                      {formatMoney(Number(resident.raw_balance ?? resident.balance))}
                    </td>
                    <td className={`py-2 font-semibold ${resident.balance > 0 ? "text-amber-700" : "text-emerald-700"}`}>
                      {formatMoney(Number(resident.balance))}
                      <span className="sr-only">{resident.balance > 0 ? " owed" : " credit"}</span>
                    </td>
                    <td className="py-2">
                      <Link
                        href={`/admin/residents/${resident.resident_id}`}
                        className="rounded-md border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500"
                        aria-label={`View details for ${resident.full_name}`}
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5" aria-labelledby="create-resident-heading">
        <h3 id="create-resident-heading" className="text-lg font-semibold text-slate-900 mb-4">Create Resident</h3>
        <form className="grid gap-4 md:grid-cols-2" onSubmit={onCreateResident} aria-label="Create new resident">
          <div className="flex flex-col gap-1">
            <label htmlFor="create-full-name" className="text-sm font-medium text-slate-700">
              Full Name <span aria-hidden="true" className="text-red-500">*</span>
            </label>
            <input
              id="create-full-name"
              value={form.full_name}
              onChange={(event) => setForm((prev) => ({ ...prev, full_name: event.target.value }))}
              className="rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500"
              required
              aria-required="true"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="create-house" className="text-sm font-medium text-slate-700">
              House
            </label>
            <select
              id="create-house"
              value={form.house_id}
              onChange={(event) => setForm((prev) => ({ ...prev, house_id: event.target.value }))}
              className="rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500"
            >
              <option value="">No house</option>
              {houses.map((house) => (
                <option key={house.id} value={house.id}>
                  {house.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="create-payment-type" className="text-sm font-medium text-slate-700">
              Payment Type
            </label>
            <select
              id="create-payment-type"
              value={form.payment_type}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, payment_type: event.target.value as PaymentType }))
              }
              className="rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500"
            >
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="create-status" className="text-sm font-medium text-slate-700">
              Status
            </label>
            <select
              id="create-status"
              value={form.status}
              onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value as ResidentStatus }))}
              className="rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="create-move-in-date" className="text-sm font-medium text-slate-700">
              Move-in Date
            </label>
            <input
              id="create-move-in-date"
              type="date"
              value={form.move_in_date}
              onChange={(event) => setForm((prev) => ({ ...prev, move_in_date: event.target.value }))}
              className="rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="create-contract-signed-date" className="text-sm font-medium text-slate-700">
              Contract Signed Date
            </label>
            <input
              id="create-contract-signed-date"
              type="date"
              value={form.contract_signed_date}
              onChange={(event) => setForm((prev) => ({ ...prev, contract_signed_date: event.target.value }))}
              className="rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="create-move-in-fee" className="text-sm font-medium text-slate-700">
              Move-in Fee Due ($)
            </label>
            <input
              id="create-move-in-fee"
              type="number"
              min="0"
              step="0.01"
              value={form.move_in_fee_due}
              onChange={(event) => setForm((prev) => ({ ...prev, move_in_fee_due: event.target.value }))}
              className="rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="create-notes" className="text-sm font-medium text-slate-700">
              Notes
            </label>
            <input
              id="create-notes"
              value={form.notes}
              onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
              className="rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500"
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              className="rounded-md bg-slate-900 px-4 py-2 text-white font-semibold hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-1"
            >
              Create Resident
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
