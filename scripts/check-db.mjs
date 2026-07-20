import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load environment variables
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  if (line && !line.startsWith('#')) {
    const [key, value] = line.split('=');
    if (key && value) {
      env[key.trim()] = value.trim();
    }
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase configuration');
  process.exit(1);
}

// Try to get database URL from environment or construct it
const dbUrlEnv = env.DATABASE_URL || env.SUPABASE_DB_URL;

if (!dbUrlEnv) {
  console.log('\n⚠️  No direct database URL found in .env.local');
  console.log('Will attempt to connect via Supabase REST API instead...\n');
}

async function runQueriesViaREST() {
  console.log('=== Connecting to Supabase via REST API ===\n');

  try {
    const headers = {
      'apikey': supabaseKey,
      'Content-Type': 'application/json',
    };

    // Get all residents
    console.log('Fetching residents data...');
    const residentsRes = await fetch(`${supabaseUrl}/rest/v1/residents?select=id,full_name,status,payment_type,rent_amount,move_in_date`, {
      headers,
    });

    if (!residentsRes.ok) {
      throw new Error(`Residents fetch failed: ${residentsRes.status}`);
    }

    const residents = await residentsRes.json();
    console.log(`✓ Found ${residents.length} residents\n`);

    // Get ledger entries
    console.log('Fetching ledger entries...');
    const ledgerRes = await fetch(`${supabaseUrl}/rest/v1/ledger_entries?select=*&limit=10000`, {
      headers,
    });

    if (!ledgerRes.ok) {
      throw new Error(`Ledger fetch failed: ${ledgerRes.status}`);
    }

    const ledgerEntries = await ledgerRes.json();
    console.log(`✓ Found ${ledgerEntries.length} ledger entries\n`);

    // QUERY 1: All residents with balances through April 30
    console.log('=== QUERY 1: All Residents - Balances as of April 30, 2026 ===\n');

    const results = residents.map(r => {
      const residentEntries = ledgerEntries.filter(le =>
        le.resident_id === r.id && new Date(le.entry_date) < new Date('2026-05-01')
      );

      const balance = residentEntries.reduce((sum, le) => {
        if (le.entry_type === 'charge') return sum + le.amount;
        if (le.entry_type === 'payment') return sum - le.amount;
        return sum + le.amount;
      }, 0);

      const totalCharges = residentEntries
        .filter(le => le.entry_type === 'charge')
        .reduce((sum, le) => sum + le.amount, 0);

      const totalPayments = residentEntries
        .filter(le => le.entry_type === 'payment')
        .reduce((sum, le) => sum + le.amount, 0);

      const lastTx = residentEntries.length > 0
        ? new Date(Math.max(...residentEntries.map(le => new Date(le.entry_date)))).toISOString().split('T')[0]
        : null;

      return {
        full_name: r.full_name,
        status: r.status,
        payment_type: r.payment_type,
        rent_amount: r.rent_amount,
        balance_through_apr30: balance.toFixed(2),
        total_charges: totalCharges.toFixed(2),
        total_payments: totalPayments.toFixed(2),
        transaction_count: residentEntries.length,
        last_transaction_date: lastTx,
      };
    });

    console.table(results);

    // QUERY 2: Only residents who owe money
    console.log('\n=== QUERY 2: Residents Who Owe Money (April 30, 2026) ===\n');

    const owingResults = results.filter(r => parseFloat(r.balance_through_apr30) > 0);

    if (owingResults.length === 0) {
      console.log('No residents owe money (or all balances are zero/negative)');
    } else {
      console.table(owingResults.sort((a, b) => parseFloat(b.balance_through_apr30) - parseFloat(a.balance_through_apr30)));
    }

    // QUERY 3: Summary
    console.log('\n=== QUERY 3: Summary - Total Owed Across All Residents ===\n');

    const activeResidents = results.filter(r => r.status === 'Active');
    const residentsWithDebt = results.filter(r => parseFloat(r.balance_through_apr30) > 0 && r.status === 'Active');
    const totalBalance = results.reduce((sum, r) => sum + parseFloat(r.balance_through_apr30), 0);
    const totalChargesPosted = results.reduce((sum, r) => sum + parseFloat(r.total_charges), 0);
    const totalPaymentsReceived = results.reduce((sum, r) => sum + parseFloat(r.total_payments), 0);

    console.log(`Active Residents:           ${activeResidents.length}`);
    console.log(`Residents with Debt:        ${residentsWithDebt.length}`);
    console.log(`Total Balance (Apr 30):     $${totalBalance.toFixed(2)}`);
    console.log(`Total Charges Posted:       $${totalChargesPosted.toFixed(2)}`);
    console.log(`Total Payments Received:    $${totalPaymentsReceived.toFixed(2)}`);

    // QUERY 7: Identify residents with missing April charges
    console.log('\n=== QUERY 7: Residents Missing April Charges (Potential Data Loss) ===\n');

    const missingCharges = residents.filter(r => {
      if (r.status !== 'Active' || !r.payment_type || !r.rent_amount) return false;

      const aprilCharges = ledgerEntries.filter(le =>
        le.resident_id === r.id &&
        le.entry_type === 'charge' &&
        le.entry_date >= '2026-04-01' &&
        le.entry_date < '2026-05-01' &&
        le.description.includes('04/')
      );

      return aprilCharges.length === 0;
    });

    if (missingCharges.length === 0) {
      console.log('✓ All active residents have April charges (no missing data detected)');
    } else {
      console.log(`⚠️  ${missingCharges.length} active residents missing April charges:\n`);
      missingCharges.forEach(r => {
        const residentTxs = ledgerEntries.filter(le => le.resident_id === r.id &&
          le.entry_date >= '2026-04-01' && le.entry_date < '2026-05-01');
        console.log(`- ${r.full_name}: rent_amount=$${r.rent_amount}, april_entries=${residentTxs.length}, last_tx=${
          residentTxs.length > 0 ? new Date(Math.max(...residentTxs.map(le => new Date(le.entry_date)))).toISOString().split('T')[0] : 'never'
        }`);
      });
    }

    // Check for residents without Rent due entries
    console.log('\n=== ADDITIONAL: Residents Without "Rent due" Entries ===\n');

    const noRentDueEntries = residents.filter(r => {
      const rentDue = ledgerEntries.filter(le =>
        le.resident_id === r.id &&
        le.entry_type === 'charge' &&
        le.description.includes('Rent due')
      );
      return rentDue.length === 0 && r.status === 'Active';
    });

    if (noRentDueEntries.length === 0) {
      console.log('✓ All active residents have "Rent due" entries');
    } else {
      console.log(`⚠️  ${noRentDueEntries.length} active residents WITHOUT "Rent due" entries (affected by the bug):\n`);
      noRentDueEntries.forEach(r => {
        const hasPayments = ledgerEntries.some(le =>
          le.resident_id === r.id && le.entry_type === 'payment'
        );
        console.log(`- ${r.full_name}: rent_amount=$${r.rent_amount}, has_payments=${hasPayments}, move_in=${r.move_in_date}`);
      });
    }

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

runQueriesViaREST();
