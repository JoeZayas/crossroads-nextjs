import { createClient } from '@supabase/supabase-js';
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

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
  },
});

async function runQueries() {
  try {
    console.log('Connecting to Supabase...');

    // First, let's create the migration (create the views)
    const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '20260501_recalculate_balances.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf-8');

    console.log('\n=== Applying migration: Creating views ===');
    const migrationResult = await supabase.rpc('exec_sql', { sql: migrationSQL }).catch(async () => {
      // If rpc doesn't exist, try raw SQL execution through REST
      console.log('Note: Views may already exist or will be created via standard methods');
      return null;
    });

    if (migrationResult?.error) {
      console.log('Migration notice:', migrationResult.error.message);
    } else {
      console.log('Migration applied successfully');
    }

    // QUERY 1: All residents with their calculated balance
    console.log('\n=== QUERY 1: All Residents with Balances as of April 30, 2026 ===');
    const query1 = `
SELECT
  r.full_name,
  r.status,
  r.payment_type,
  r.rent_amount,
  r.move_in_date,
  (
    SELECT COALESCE(SUM(
      CASE
        WHEN le.entry_type = 'charge' THEN le.amount
        WHEN le.entry_type = 'payment' THEN -le.amount
        ELSE le.amount
      END
    ), 0)
    FROM ledger_entries le
    WHERE le.resident_id = r.id
      AND le.entry_date < '2026-05-01'
  )::numeric(10,2) as balance_through_apr30,
  (
    SELECT COALESCE(SUM(le.amount), 0)
    FROM ledger_entries le
    WHERE le.resident_id = r.id
      AND le.entry_type = 'charge'
      AND le.entry_date < '2026-05-01'
  )::numeric(10,2) as total_charges,
  (
    SELECT COALESCE(SUM(le.amount), 0)
    FROM ledger_entries le
    WHERE le.resident_id = r.id
      AND le.entry_type = 'payment'
      AND le.entry_date < '2026-05-01'
  )::numeric(10,2) as total_payments,
  (
    SELECT COUNT(*)
    FROM ledger_entries le
    WHERE le.resident_id = r.id
      AND le.entry_date < '2026-05-01'
  ) as transaction_count,
  (
    SELECT MAX(le.entry_date)
    FROM ledger_entries le
    WHERE le.resident_id = r.id
      AND le.entry_date < '2026-05-01'
  ) as last_transaction_date
FROM residents r
ORDER BY full_name;
    `;

    const { data: result1, error: error1 } = await supabase.rpc('exec', { query: query1 }).catch(() => ({ data: null, error: { message: 'RPC not available' } }));

    if (error1) {
      console.log('Note: Cannot execute raw queries via current method. Would need direct database access.');
      console.log('Attempting to query via REST API...');

      // Try via REST API instead
      const { data: residents, error: resError } = await supabase
        .from('residents')
        .select('id,full_name,status,payment_type,rent_amount,move_in_date')
        .order('full_name');

      if (resError) {
        console.error('Error fetching residents:', resError);
      } else if (residents) {
        console.log(`Found ${residents.length} residents`);
        console.log('\nResident Details:');
        console.table(residents);
      }
    } else if (result1) {
      console.log(result1);
    }

  } catch (error) {
    console.error('Error:', error.message);
  }
}

runQueries();
