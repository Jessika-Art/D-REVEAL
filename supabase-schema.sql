-- Create waitlist_submissions table
CREATE TABLE waitlist_submissions (
  id TEXT PRIMARY KEY,
  timestamp TEXT NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT NOT NULL,
  job_title TEXT NOT NULL,
  company_type TEXT NOT NULL,
  aum TEXT NOT NULL,
  primary_markets TEXT[] NOT NULL,
  current_tools TEXT[] NOT NULL,
  team_size TEXT NOT NULL,
  biggest_challenge TEXT NOT NULL,
  interest_level TEXT NOT NULL,
  budget_range TEXT NOT NULL,
  additional_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reports table
CREATE TABLE reports (
  id TEXT PRIMARY KEY,
  token TEXT UNIQUE NOT NULL,
  client_name TEXT NOT NULL,
  generated_date TEXT NOT NULL,
  chart_file_name TEXT NOT NULL,
  json_file_name TEXT NOT NULL,
  chart_url TEXT,
  data_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_waitlist_submissions_created_at ON waitlist_submissions(created_at);
CREATE INDEX idx_waitlist_submissions_email ON waitlist_submissions(email);
CREATE INDEX idx_reports_token ON reports(token);
CREATE INDEX idx_reports_created_at ON reports(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE waitlist_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Create policies (allow all operations for now - you can restrict later)
CREATE POLICY "Allow all operations on waitlist_submissions" ON waitlist_submissions FOR ALL USING (true);
CREATE POLICY "Allow all operations on reports" ON reports FOR ALL USING (true);

-- Storage policies for file uploads
-- Allow public access to storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('report-charts', 'report-charts', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('report-data', 'report-data', true);

-- Create storage policies for report-charts bucket
CREATE POLICY "Allow public uploads to report-charts" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'report-charts');
CREATE POLICY "Allow public access to report-charts" ON storage.objects FOR SELECT USING (bucket_id = 'report-charts');
CREATE POLICY "Allow public updates to report-charts" ON storage.objects FOR UPDATE USING (bucket_id = 'report-charts');
CREATE POLICY "Allow public deletes to report-charts" ON storage.objects FOR DELETE USING (bucket_id = 'report-charts');

-- Create storage policies for report-data bucket
CREATE POLICY "Allow public uploads to report-data" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'report-data');
CREATE POLICY "Allow public access to report-data" ON storage.objects FOR SELECT USING (bucket_id = 'report-data');
CREATE POLICY "Allow public updates to report-data" ON storage.objects FOR UPDATE USING (bucket_id = 'report-data');
CREATE POLICY "Allow public deletes to report-data" ON storage.objects FOR DELETE USING (bucket_id = 'report-data');