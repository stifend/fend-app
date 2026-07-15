import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qmbqkuxejbgjhfudwehy.supabase.co';
const supabaseKey = 'sb_publishable_pOrDPsPaBaearve4jceAFA_mjxGdqm-';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  // Test columns one by one
  const cols = [
    'id', 'reservation', 'name', 'email', 'phone', 'address',
    'room_type', 'check_in', 'check_out', 'guests', 'special_request',
    'nights', 'subtotal', 'discount', 'total_payment', 'status', 'created_at',
    'room_price', 'price_per_night', 'total', 'amount', 'city',
    'payment_status', 'total_price', 'price', 'number_of_nights',
    'guest_count', 'notes', 'updated_at'
  ];
  
  const existing = [];
  const missing = [];
  
  for (const col of cols) {
    const { data, error } = await supabase.from('reservations').select(col).limit(0);
    if (error) {
      missing.push(col);
    } else {
      existing.push(col);
    }
  }
  
  console.log('EXISTING columns:', existing);
  console.log('MISSING columns:', missing);
}

test();
