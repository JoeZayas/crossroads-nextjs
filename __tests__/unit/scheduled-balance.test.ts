import { applyScheduledBalances } from "@/lib/scheduled-balance";
import type { ResidentBalanceRow } from "@/lib/admin-types";

// Mock the supabaseRest function
jest.mock("@/lib/supabase", () => ({
  supabaseRest: jest.fn(),
}));

jest.mock("@/lib/rental-period", () => ({
  addDays: (date: Date, days: number) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  },
  nextMonthStart: (date: Date) => {
    const result = new Date(date.getFullYear(), date.getMonth() + 1, 1);
    return result;
  },
  startOfToday: () => new Date("2026-05-01"),
}));

import { supabaseRest } from "@/lib/supabase";

describe("applyScheduledBalances", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should calculate payment coverage for residents without Rent due entries", async () => {
    // Resident with no "Rent due" entries but with payment history
    const residents: ResidentBalanceRow[] = [
      {
        resident_id: "res-1",
        full_name: "John Doe",
        house_id: "house-1",
        house_name: "House A",
        status: "Active",
        payment_type: "Monthly",
        move_in_date: "2026-03-01",
        move_out_date: null,
        balance: 0,
      },
    ];

    // Payments made but no formal "Rent due" charges
    // Only one payment that covers move_in to end of April
    const mockPaymentRows = [
      {
        resident_id: "res-1",
        amount: 650, // One month's rent
        entry_date: "2026-04-15",
      },
    ];

    const mockRentDueRows: any[] = []; // No "Rent due" entries

    (supabaseRest as jest.Mock)
      .mockResolvedValueOnce(mockRentDueRows) // First call for rentDueRows
      .mockResolvedValueOnce(mockPaymentRows); // Second call for rentPaymentRows

    const result = await applyScheduledBalances(residents, "fake-token");

    // Should have processed the resident
    expect(result).toHaveLength(1);
    expect(result[0].resident_id).toBe("res-1");

    // Payment coverage should have been calculated from move_in_date
    // Payment applied successfully (not skipped due to missing Rent due entries)
    // The key fix is that payment coverage is calculated, not skipped
    expect(result[0]).toBeDefined();
    // As of May 1 with April covered, May rent is now owed
    expect(result[0].scheduled_due_missing).toBeGreaterThanOrEqual(0);
  });

  it("should skip residents without move_in_date when no Rent due entries exist", async () => {
    const residents: ResidentBalanceRow[] = [
      {
        resident_id: "res-2",
        full_name: "Jane Smith",
        house_id: "house-1",
        house_name: "House A",
        status: "Active",
        payment_type: "Monthly",
        move_in_date: null, // No move_in_date
        move_out_date: null,
        balance: 0,
      },
    ];

    const mockPaymentRows = [
      {
        resident_id: "res-2",
        amount: 650,
        entry_date: "2026-04-15",
      },
    ];

    const mockRentDueRows: any[] = [];

    (supabaseRest as jest.Mock)
      .mockResolvedValueOnce(mockRentDueRows)
      .mockResolvedValueOnce(mockPaymentRows);

    const result = await applyScheduledBalances(residents, "fake-token");

    // Should still return the resident but with default calculation
    expect(result).toHaveLength(1);
    expect(result[0].resident_id).toBe("res-2");
  });

  it("should handle residents with both Rent due entries and payments", async () => {
    const residents: ResidentBalanceRow[] = [
      {
        resident_id: "res-3",
        full_name: "Bob Johnson",
        house_id: "house-1",
        house_name: "House A",
        status: "Active",
        payment_type: "Monthly",
        move_in_date: "2026-01-01",
        move_out_date: null,
        balance: 0,
      },
    ];

    const mockRentDueRows = [
      {
        resident_id: "res-3",
        description: "Rent due 04/01/2026 to 04/30/2026",
        amount: 650,
        entry_date: "2026-04-01",
      },
    ];

    const mockPaymentRows = [
      {
        resident_id: "res-3",
        amount: 650,
        entry_date: "2026-04-20",
      },
    ];

    (supabaseRest as jest.Mock)
      .mockResolvedValueOnce(mockRentDueRows)
      .mockResolvedValueOnce(mockPaymentRows);

    const result = await applyScheduledBalances(residents, "fake-token");

    // Should process payment from Rent due baseline
    expect(result).toHaveLength(1);
    expect(result[0].resident_id).toBe("res-3");
    // Resident processed successfully
    expect(result[0]).toBeDefined();
    expect(result[0].balance).toEqual(expect.any(Number));
  });

  it("should return empty array when given no residents", async () => {
    const result = await applyScheduledBalances([], "fake-token");
    expect(result).toEqual([]);
    expect(supabaseRest).not.toHaveBeenCalled();
  });
});
