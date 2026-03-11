"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { EntryType, House, LedgerEntry, PaymentType, ResidentStatus } from "@/lib/admin-types";

type ResidentDetail = {
  resident_id: string;
  full_name: string;
  house_id: string | null;
  house_name: string | null;
  status: ResidentStatus;
  payment_type: PaymentType | null;
  move_in_date: string | null;
  move_out_date: string | null;
  contract_signed_date: string | null;
  move_in_fee_due: number;
  notes: string | null;
  balance: number;
};

const formatMoney = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

const moneyClass = (value: number) => (value > 0 ? "text-amber-700" : "text-emerald-700");

export default function ResidentDetailPage() {
  const params = useParams<{ id: string }>();
  const residentId = params.id;
  const [resident, setResident] = useState<ResidentDetail | null>(null);
  const [houses, setHouses] = useState<House[]>([]);
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [ledgerSuccess, setLedgerSuccess] = useState(false);

  const [entryDate, setEntryDate] = useState(new Date().toISOString().slice(0, 10));
  const [entryType, setEntryType] = useState<EntryType>("charge");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");

  const [fullName, setFullName] = useState("");
  const [status, setStatus] = useState<ResidentStatus>("Active");
  const [paymentType, setPaymentType] = useState<PaymentType>("Weekly");
  const [houseId, setHouseId] = useState("");
  const [moveInDate, setMoveInDate] = useState("");
  const [contractSignedDate, setContractSignedDate] = useState("");
  const [moveOutDate, setMoveOutDate] = useState("");
  const [moveInFeeDue, setMoveInFeeDue] = useState("0");
  const [notes, setNotes] = useState("");

  const load = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const [residentResponse, ledgerResponse, housesResponse] = await Promise.all([
        fetch(`/api/admin/residents/${id}`, { cache: "no-store" }),
        fetch(`/api/admin/residents/${id}/ledger`, { cache: "no-store" }),
        fetch("/api/admin/houses", { cache: "no-store" }),
      ]);

      if (!residentResponse.ok) {
        const body = (await residentResponse.json()) as { error?: string };
        throw new Error(body.error ?? "Unable to load resident");
      }
      if (!ledgerResponse.ok) {
        const body = (await ledgerResponse.json()) as { error?: string };
        throw new Error(body.error ?? "Unable to load ledger");
      }
      if (!housesResponse.ok) {
        const body = (await housesResponse.json()) as { error?: string };
        throw new Error(body.error ?? "Unable to load houses");
      }

      const residentData = (await residentResponse.json()) as ResidentDetail;
      setResident(residentData);
      setLedger((await ledgerResponse.json()) as LedgerEntry[]);
      setHouses((await housesResponse.json()) as House[]);

      setFullName(residentData.full_name);
      setStatus(residentData.status);
      setPaymentType(residentData.payment_type ?? "Weekly");
      setHouseId(residentData.house_id ?? "");
      setMoveInDate(residentData.move_in_date ?? "");
      setContractSignedDate(residentData.contract_signed_date ?? "");
      setMoveOutDate(residentData.move_out_date ?? "");
      setMoveInFeeDue(String(residentData.move_in_fee_due ?? 0));
      setNotes(residentData.notes ?? "");
    } catch (loadError) {
      const message = loadError instanceof Error ? loadError.message : "Unable to load resident data";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!residentId) {
      return;
    }
    load(residentId).catch(() => setError("Unable to load resident data"));
  }, [residentId]);

  const onAddLedger = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!residentId) {
      return;
    }
    setError(null);
    setLedgerSuccess(false);

    const response = await fetch(`/api/admin/residents/${residentId}/ledger`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        entry_date: entryDate,
        entry_type: entryType,
        description,
        amount: Number(amount),
      }),
    });

    if (!response.ok) {
      const body = (await response.json()) as { error?: string };
      setError(body.error ?? "Unable to add ledger entry");
      return;
    }

    setDescription("");
    setAmount("");
    setLedgerSuccess(true);
    await load(residentId);
  };

  const onSaveResident = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!residentId) {
      return;
    }
    setError(null);
    setSaveSuccess(false);

    const response = await fetch(`/api/admin/residents/${residentId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        full_name: fullName,
        status,
        payment_type: paymentType,
        house_id: houseId || null,
        move_in_date: moveInDate || null,
        contract_signed_date: contractSignedDate || null,
        move_out_date: moveOutDate || null,
        move_in_fee_due: Number(moveInFeeDue || 0),
        notes: notes || null,
      }),
    });

    if (!response.ok) {
      const body = (await response.json()) as { error?: string };
      setError(body.error ?? "Unable to update resident");
      return;
    }

    setSaveSuccess(true);
    await load(residentId);
  };

  if (loading) {
    return (
      <p role="status" aria-live="polite" className="text-slate-600">
        Loading resident details...
      </p>
    );
  }

  if (!resident) {
    return (
      <div role="alert" className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-red-700">
        <p>Resident not found.</p>
        <Link href="/admin/residents" className="text-sm underline hover:no-underline mt-1 inline-block">
          Back to Residents
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/residents"
          className="text-sm text-slate-500 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 rounded"
          aria-label="Back to residents list"
        >
          &larr; Back to Residents
        </Link>
        <h2 className="text-3xl font-bold text-slate-900 mt-1">{resident.full_name}</h2>
        <p className="text-slate-600">Resident details and ledger management.</p>
      </div>

      {error && (
        <div role="alert" className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-red-700">
          <p className="font-semibold mb-1">Error</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-white p-5" aria-label="Current balance">
        <p className="text-sm text-slate-500">Current Balance</p>
        <p className={`text-3xl font-bold ${moneyClass(Number(resident.balance))}`}>
          {formatMoney(Number(resident.balance))}
          <span className="sr-only">{Number(resident.balance) > 0 ? " owed" : " credit"}</span>
        </p>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-5" aria-labelledby="update-resident-heading">
        <h3 id="update-resident-heading" className="text-lg font-semibold text-slate-900 mb-4">Update Resident</h3>

        {saveSuccess && (
          <div role="status" aria-live="polite" className="mb-4 rounded-md bg-green-50 border border-green-200 px-4 py-3 text-green-700 text-sm">
            Resident saved successfully.
          </div>
        )}

        <form className="grid gap-4 md:grid-cols-2" onSubmit={onSaveResident} aria-label="Update resident details">
          <div className="flex flex-col gap-1">
            <label htmlFor="update-full-name" className="text-sm font-medium text-slate-700">
              Full Name <span aria-hidden="true" className="text-red-500">*</span>
            </label>
            <input
              id="update-full-name"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              className="rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500"
              required
              aria-required="true"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="update-house" className="text-sm font-medium text-slate-700">
              House
            </label>
            <select
              id="update-house"
              value={houseId}
              onChange={(event) => setHouseId(event.target.value)}
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
            <label htmlFor="update-status" className="text-sm font-medium text-slate-700">
              Status
            </label>
            <select
              id="update-status"
              value={status}
              onChange={(event) => setStatus(event.target.value as ResidentStatus)}
              className="rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="update-payment-type" className="text-sm font-medium text-slate-700">
              Payment Type
            </label>
            <select
              id="update-payment-type"
              value={paymentType}
              onChange={(event) => setPaymentType(event.target.value as PaymentType)}
              className="rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500"
            >
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="update-move-in-date" className="text-sm font-medium text-slate-700">
              Move-in Date
            </label>
            <input
              id="update-move-in-date"
              type="date"
              value={moveInDate}
              onChange={(event) => setMoveInDate(event.target.value)}
              className="rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="update-contract-signed-date" className="text-sm font-medium text-slate-700">
              Contract Signed Date
            </label>
            <input
              id="update-contract-signed-date"
              type="date"
              value={contractSignedDate}
              onChange={(event) => setContractSignedDate(event.target.value)}
              className="rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="update-move-out-date" className="text-sm font-medium text-slate-700">
              Move-out Date
            </label>
            <input
              id="update-move-out-date"
              type="date"
              value={moveOutDate}
              onChange={(event) => setMoveOutDate(event.target.value)}
              className="rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="update-move-in-fee" className="text-sm font-medium text-slate-700">
              Move-in Fee Due ($)
            </label>
            <input
              id="update-move-in-fee"
              type="number"
              min="0"
              step="0.01"
              value={moveInFeeDue}
              onChange={(event) => setMoveInFeeDue(event.target.value)}
              className="rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500"
            />
          </div>

          <div className="flex flex-col gap-1 md:col-span-2">
            <label htmlFor="update-notes" className="text-sm font-medium text-slate-700">
              Notes
            </label>
            <input
              id="update-notes"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              className="rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500"
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              className="rounded-md bg-slate-900 px-4 py-2 text-white font-semibold hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-1"
            >
              Save Resident
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5" aria-labelledby="add-ledger-heading">
        <h3 id="add-ledger-heading" className="text-lg font-semibold text-slate-900 mb-4">Add Ledger Entry</h3>

        {ledgerSuccess && (
          <div role="status" aria-live="polite" className="mb-4 rounded-md bg-green-50 border border-green-200 px-4 py-3 text-green-700 text-sm">
            Ledger entry added successfully.
          </div>
        )}

        <form className="grid gap-4 md:grid-cols-4" onSubmit={onAddLedger} aria-label="Add ledger entry">
          <div className="flex flex-col gap-1">
            <label htmlFor="ledger-date" className="text-sm font-medium text-slate-700">
              Date <span aria-hidden="true" className="text-red-500">*</span>
            </label>
            <input
              id="ledger-date"
              type="date"
              value={entryDate}
              onChange={(event) => setEntryDate(event.target.value)}
              className="rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500"
              required
              aria-required="true"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="ledger-type" className="text-sm font-medium text-slate-700">
              Type
            </label>
            <select
              id="ledger-type"
              value={entryType}
              onChange={(event) => setEntryType(event.target.value as EntryType)}
              className="rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500"
            >
              <option value="charge">Charge (+)</option>
              <option value="payment">Payment (-)</option>
              <option value="adjustment">Adjustment (+/-)</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="ledger-description" className="text-sm font-medium text-slate-700">
              Description <span aria-hidden="true" className="text-red-500">*</span>
            </label>
            <input
              id="ledger-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500"
              required
              aria-required="true"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="ledger-amount" className="text-sm font-medium text-slate-700">
              Amount ($) <span aria-hidden="true" className="text-red-500">*</span>
            </label>
            <input
              id="ledger-amount"
              type="number"
              step="0.01"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              className="rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500"
              required
              aria-required="true"
            />
          </div>

          <div className="md:col-span-4">
            <button
              type="submit"
              className="rounded-md bg-slate-900 px-4 py-2 text-white font-semibold hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-1"
            >
              Add Entry
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 overflow-x-auto" aria-labelledby="ledger-heading">
        <h3 id="ledger-heading" className="text-lg font-semibold text-slate-900 mb-4">Ledger</h3>
        {ledger.length === 0 ? (
          <p className="text-slate-600">No ledger entries yet.</p>
        ) : (
          <table className="w-full text-sm">
            <caption className="sr-only">Ledger entries for {resident.full_name}</caption>
            <thead>
              <tr className="border-b border-slate-200 text-left">
                <th scope="col" className="py-2">Date</th>
                <th scope="col" className="py-2">Type</th>
                <th scope="col" className="py-2">Description</th>
                <th scope="col" className="py-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {ledger.map((entry) => (
                <tr key={entry.id} className="border-b border-slate-100">
                  <td className="py-2">{entry.entry_date}</td>
                  <td className="py-2 capitalize">{entry.entry_type}</td>
                  <td className="py-2">{entry.description}</td>
                  <td className={`py-2 font-semibold ${moneyClass(Number(entry.amount))}`}>
                    {formatMoney(Number(entry.amount))}
                    <span className="sr-only">{Number(entry.amount) > 0 ? " charge" : " payment"}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
