import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://dwjudarvcndjbtsqpwjm.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3anVkYXJ2Y25kamJ0c3Fwd2ptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4OTAwNDAsImV4cCI6MjA5NDQ2NjA0MH0.QaXbflHUwF-DM1zFHnU9SVhRL1eTZQhIOBmpbMr-wwI";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
