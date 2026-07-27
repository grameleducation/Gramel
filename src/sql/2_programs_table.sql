-- ===================== PROGRAMS TABLE =====================
-- Backs the /programs catalogue and filter form.

CREATE TABLE IF NOT EXISTS public.programs (
  id BIGSERIAL PRIMARY KEY,
  university TEXT NOT NULL,
  institution_type TEXT NOT NULL DEFAULT 'University',
  country TEXT NOT NULL,
  campus_city TEXT NOT NULL,
  program_type TEXT NOT NULL, -- e.g. 'Masters', 'Postgraduate Diploma', 'Bachelors'
  program_title TEXT NOT NULL,
  field_of_study TEXT NOT NULL,
  tuition_amount NUMERIC(10, 2) NOT NULL,
  tuition_currency TEXT NOT NULL DEFAULT 'CAD',
  application_fee_amount NUMERIC(10, 2) NOT NULL,
  application_fee_currency TEXT NOT NULL DEFAULT 'CAD',
  duration_months INTEGER NOT NULL,
  image_url TEXT NOT NULL,
  intakes JSONB NOT NULL DEFAULT '[]'::JSONB, -- [{ "date": "Sept 2026", "rate": "Very High" }, ...]
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_programs_country ON public.programs (country);
CREATE INDEX IF NOT EXISTS idx_programs_university ON public.programs (university);
CREATE INDEX IF NOT EXISTS idx_programs_program_type ON public.programs (program_type);
CREATE INDEX IF NOT EXISTS idx_programs_field_of_study ON public.programs (field_of_study);
CREATE INDEX IF NOT EXISTS idx_programs_institution_type ON public.programs (institution_type);

CREATE TRIGGER set_updated_at_programs
BEFORE UPDATE ON public.programs
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- ===================== SEED PROGRAMS =====================

INSERT INTO public.programs (
  university, institution_type, country, campus_city, program_type,
  program_title, field_of_study, tuition_amount, tuition_currency,
  application_fee_amount, application_fee_currency, duration_months,
  image_url, intakes
) VALUES
  ('University of Windsor', 'University', 'Canada', 'Windsor', 'Postgraduate Diploma',
   'Post-Baccalaureate Diploma - Law Enforcement Studies', 'Law', 13640, 'CAD',
   125, 'CAD', 24,
   'https://res.cloudinary.com/dqeqlgygu/image/upload/v1754939752/gramel/public/programs-school-image_yv0drx.jpg',
   '[{"date":"Sept 2026","rate":"Very High"},{"date":"Jan 2027","rate":"High"},{"date":"May 2027","rate":"Very High"}]'),

  ('University of Calgary', 'University', 'Canada', 'Calgary', 'Masters',
   'MSc Computer Science', 'Computer Science', 18000, 'CAD',
   150, 'CAD', 12,
   'https://res.cloudinary.com/dqeqlgygu/image/upload/v1754939752/gramel/public/programs-school-image_yv0drx.jpg',
   '[{"date":"Sept 2026","rate":"High"},{"date":"Jan 2027","rate":"Medium"},{"date":"May 2027","rate":"High"}]'),

  ('University of Toronto', 'University', 'Canada', 'Toronto', 'Bachelors',
   'BEng Electrical Engineering', 'Engineering', 21500, 'CAD',
   180, 'CAD', 48,
   'https://res.cloudinary.com/dqeqlgygu/image/upload/v1754939752/gramel/public/programs-school-image_yv0drx.jpg',
   '[{"date":"Sept 2026","rate":"Very High"},{"date":"Jan 2027","rate":"High"}]'),

  ('University of Manchester', 'University', 'United Kingdom', 'Manchester', 'Masters',
   'MSc Data Science', 'Computer Science', 27500, 'GBP',
   90, 'GBP', 12,
   'https://res.cloudinary.com/dqeqlgygu/image/upload/v1754939752/gramel/public/programs-school-image_yv0drx.jpg',
   '[{"date":"Sept 2026","rate":"High"},{"date":"Jan 2027","rate":"Medium"}]'),

  ('University of Edinburgh', 'University', 'United Kingdom', 'Edinburgh', 'Bachelors',
   'LLB Law', 'Law', 24800, 'GBP',
   75, 'GBP', 36,
   'https://res.cloudinary.com/dqeqlgygu/image/upload/v1754939752/gramel/public/programs-school-image_yv0drx.jpg',
   '[{"date":"Sept 2026","rate":"Very High"},{"date":"Jan 2027","rate":"High"},{"date":"May 2027","rate":"Medium"}]'),

  ('Arizona State University', 'University', 'United States', 'Tempe', 'Masters',
   'MBA - Business Administration', 'Business', 35000, 'USD',
   100, 'USD', 18,
   'https://res.cloudinary.com/dqeqlgygu/image/upload/v1754939752/gramel/public/programs-school-image_yv0drx.jpg',
   '[{"date":"Sept 2026","rate":"High"},{"date":"Jan 2027","rate":"High"}]'),

  ('Purdue University', 'University', 'United States', 'West Lafayette', 'Masters',
   'MS Aviation Technology', 'Engineering', 32000, 'USD',
   90, 'USD', 24,
   'https://res.cloudinary.com/dqeqlgygu/image/upload/v1754939752/gramel/public/programs-school-image_yv0drx.jpg',
   '[{"date":"Sept 2026","rate":"Very High"},{"date":"Jan 2027","rate":"Medium"}]'),

  ('University of Southern California', 'University', 'United States', 'Los Angeles', 'Bachelors',
   'BA Film Production', 'Art', 58000, 'USD',
   90, 'USD', 48,
   'https://res.cloudinary.com/dqeqlgygu/image/upload/v1754939752/gramel/public/programs-school-image_yv0drx.jpg',
   '[{"date":"Sept 2026","rate":"High"}]'),

  ('University of Melbourne', 'University', 'Australia', 'Melbourne', 'Masters',
   'Master of Medicine', 'Medicine', 42000, 'AUD',
   130, 'AUD', 24,
   'https://res.cloudinary.com/dqeqlgygu/image/upload/v1754939752/gramel/public/programs-school-image_yv0drx.jpg',
   '[{"date":"Sept 2026","rate":"Very High"},{"date":"Jan 2027","rate":"Very High"}]'),

  ('University of Sydney', 'University', 'Australia', 'Sydney', 'Postgraduate Diploma',
   'Graduate Diploma in Business Analytics', 'Business', 29500, 'AUD',
   110, 'AUD', 12,
   'https://res.cloudinary.com/dqeqlgygu/image/upload/v1754939752/gramel/public/programs-school-image_yv0drx.jpg',
   '[{"date":"Sept 2026","rate":"Medium"},{"date":"Jan 2027","rate":"High"}]'),

  ('Technical University of Munich', 'University', 'Germany', 'Munich', 'Masters',
   'MSc Mechanical Engineering', 'Engineering', 3000, 'EUR',
   50, 'EUR', 24,
   'https://res.cloudinary.com/dqeqlgygu/image/upload/v1754939752/gramel/public/programs-school-image_yv0drx.jpg',
   '[{"date":"Sept 2026","rate":"High"},{"date":"Jan 2027","rate":"Medium"}]'),

  ('Trinity College Dublin', 'University', 'Ireland', 'Dublin', 'Bachelors',
   'BSc Bio-Chemistry', 'Bio-Chemistry', 22000, 'EUR',
   60, 'EUR', 48,
   'https://res.cloudinary.com/dqeqlgygu/image/upload/v1754939752/gramel/public/programs-school-image_yv0drx.jpg',
   '[{"date":"Sept 2026","rate":"High"},{"date":"Jan 2027","rate":"Medium"},{"date":"May 2027","rate":"Low"}]');
