const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function test() {
  const { data, error } = await supabase.from("institutions").insert({
      name: "Test College",
      days_active: ["Mon", "Tue"],
      time_slots: [8, 9, 10],
      lunch_slot: 12,
      max_continuous_lectures: 2
  }).select();
  console.log("INSERT RESULT:", data, error);
}

test();
