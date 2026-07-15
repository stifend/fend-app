import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Read env variables from .env if possible, or just parse them from the file
const envFile = fs.readFileSync(path.join(process.cwd(), '.env'), 'utf8');
const supabaseUrl = envFile.match(/VITE_SUPABASE_URL=(.*)/)[1].trim();
const supabaseKey = envFile.match(/VITE_SUPABASE_KEY=(.*)/)[1].trim();

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data: vData, error: vError } = await supabase.from('vouchers').select('*');
  console.log("vouchers:", vData);
  console.log("vError:", vError);
}

check();
