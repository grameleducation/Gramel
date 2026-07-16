-- Better auth users schema merged with custom users schema

CREATE TABLE public.users (
    "id" TEXT NOT NULL PRIMARY KEY,

    -- Personal Info
    "name" TEXT NOT NULL, -- better-auth. App MOSTLY uses first_name, last_name, middle_name
    "email" TEXT NOT NULL UNIQUE,
    "email_verified" BOOLEAN NOT NULL,
    "image" TEXT, -- better-auth. App MOSTLY uses profile_picture_url
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "role" TEXT NOT NULL DEFAULT 'student', -- student, staff, admin
    "first_name" TEXT,
    "last_name" TEXT,
    "middle_name" TEXT,
    "date_of_birth" DATE,
    "passport_no" TEXT,
    "passport_expiry_date" DATE,
    "gender" TEXT,
    "marital_status" TEXT,
    "address" TEXT,
    "phone" TEXT,
    "profile_picture_url" TEXT,

    -- Education Summary
    "highest_education" TEXT,
    "highest_edu_country" TEXT,
    "highest_edu_grading_scale" TEXT,
    "highest_edu_grade_average" TEXT,

    -- Next of Kin
    "next_of_kin" JSONB NOT NULL DEFAULT '{}'::JSONB,
    "higher_institutions" JSONB NOT NULL DEFAULT '[]'::JSONB, 
    "secondary_schools" JSONB NOT NULL DEFAULT '[]'::JSONB,
    "other_education" JSONB NOT NULL DEFAULT '[]'::JSONB,

    -- Staff Assignment
    "assigned_staff_id" TEXT REFERENCES "users" ("id") ON DELETE SET NULL
);

-- Create indexes for faster lookups/joins
CREATE INDEX idx_users_role_gender ON public.users(role, gender);

-- next_of_kin value is a single object of: name, address, phone, attended_from, attended_to, graduation_date
-- higher_institutions is an array of objects. each object contains: name, attended_from, attended_to, graduation_date, country, city
-- secondary_schools and other_education are arrays with same structure as higher_institution above


-- Better auth session table

CREATE TABLE "session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "expires_at" TIMESTAMPTZ NOT NULL,
    "token" TEXT NOT NULL UNIQUE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "ip_address" TEXT,
    "user_agent" TEXT,
    "user_id" TEXT NOT NULL REFERENCES "users" ("id") ON DELETE CASCADE
);


-- Better auth account table

CREATE TABLE "account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "account_id" TEXT NOT NULL,
    "provider_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL REFERENCES "users" ("id") ON DELETE CASCADE,
    "access_token" TEXT,
    "refresh_token" TEXT,
    "id_token" TEXT,
    "access_token_expires_at" TIMESTAMPTZ,
    "refresh_token_expires_at" TIMESTAMPTZ,
    "scope" TEXT,
    "password" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- Better auth verification table

CREATE TABLE "verification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expires_at" TIMESTAMPTZ NOT NULL,
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);


-- Better auth index tables

CREATE INDEX "session_user_id_idx" ON "session" ("user_id");
CREATE INDEX "account_user_id_idx" ON "account" ("user_id");
CREATE INDEX "verification_identifier_idx" ON "verification" ("identifier");

-- ========== STUDENT STAFF ASSIGNMENT STATE TRACKING TABLE ===========

-- Helper table to track last staff assigned to a student

CREATE TABLE IF NOT EXISTS public.student_staff_assignment_state (
  id BOOLEAN PRIMARY KEY DEFAULT TRUE,
  last_staff_index INTEGER NOT NULL DEFAULT 0
);

INSERT INTO public.student_staff_assignment_state (id, last_staff_index)
VALUES (TRUE, 0)
ON CONFLICT (id) DO NOTHING;

-- ========== NOTIFICATIONS TABLE =============

CREATE TABLE public.notifications (
  id BIGSERIAL PRIMARY KEY,
  recipient_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_notifications_recipient_id_read_at ON public.notifications (recipient_id, read_at);

-- ============== FUNCTION TO UPDATE THE updated_at COLUMN ==============

CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS TRIGGER
SET search_path = 'pg_catalog,public'
LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ SECURITY DEFINER;

-- Trigger the set_updated_at function on public.users table

CREATE TRIGGER set_updated_at_users
BEFORE UPDATE ON public.users
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- ============== PAYMENT TRANSACTIONS TABLE ==============

CREATE TABLE public.payment_transactions (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  transaction_reference TEXT NOT NULL UNIQUE,
  service TEXT NOT NULL,
  service_slug TEXT NOT NULL,
  service_code TEXT NOT NULL,
  amount INTEGER NOT NULL, 
  status TEXT NOT NULL DEFAULT 'pending', 
  access_code TEXT,
  payment_type TEXT NOT NULL DEFAULT 'online',
  created_by TEXT REFERENCES public.users(id) ON DELETE SET NULL,
  proof_of_payment TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  CONSTRAINT check_offline_payment_has_creator CHECK (
    payment_type <> 'offline' OR (payment_type = 'offline' AND created_by IS NOT NULL)
  )
);



-- Trigger the set_updated_at function on payment_transactions table

CREATE TRIGGER set_updated_at_payment_transactions
BEFORE UPDATE ON public.payment_transactions
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- Create indexes for faster transaction grouping

CREATE INDEX idx_payment_transactions_status ON public.payment_transactions(status);
CREATE INDEX idx_payment_transactions_user_id_completed ON public.payment_transactions(user_id) WHERE status = 'completed';
CREATE INDEX idx_payment_transactions_service_code_completed ON public.payment_transactions(service_code) WHERE status = 'completed';

-- Create index for payment_transactions table on transaction_reference column
CREATE INDEX idx_payment_transactions_transaction_reference ON public.payment_transactions (transaction_reference);

-- ===================== SERVICE PRICING TABLES =====================
-- Enables admins to update service prices over time

-- Current active pricing
CREATE TABLE IF NOT EXISTS public.service_prices (
  id BIGSERIAL PRIMARY KEY,
  service_slug TEXT NOT NULL,
  option_name TEXT,
  service_code TEXT NOT NULL,
  price_kobo INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Unique constraints:
-- - base row: only one per service (option_name IS NULL)
CREATE UNIQUE INDEX IF NOT EXISTS idx_service_prices_unique_base
  ON public.service_prices (service_slug)
  WHERE option_name IS NULL;

-- - option row: unique per (service_slug, option_name) when option_name IS NOT NULL
CREATE UNIQUE INDEX IF NOT EXISTS idx_service_prices_unique_option
  ON public.service_prices (service_slug, option_name)
  WHERE option_name IS NOT NULL;

-- Update timestamp trigger
CREATE TRIGGER set_updated_at_service_prices
BEFORE UPDATE ON public.service_prices
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- Price history (every price change is saved)
CREATE TABLE IF NOT EXISTS public.service_price_history (
  id BIGSERIAL PRIMARY KEY,
  service_slug TEXT NOT NULL,
  option_name TEXT,
  service_code TEXT NOT NULL,
  old_price_kobo INTEGER NOT NULL,
  new_price_kobo INTEGER NOT NULL,
  changed_by TEXT REFERENCES public.users(id) ON DELETE SET NULL,
  changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_service_price_history_lookup
  ON public.service_price_history (service_slug, option_name, changed_at DESC);

-- ===================== SEED INITIAL PRICES =====================
INSERT INTO public.service_prices (service_slug, option_name, service_code, price_kobo)
VALUES ('international-admissions', NULL, 'IADM', 0),
       ('document-verification', NULL, 'DOCV', 0),
       ('scholarships', NULL, 'SCHL', 0),
       ('visa-assistance', NULL, 'VISA', 0),
       ('language-proficiency-tests', NULL, 'LANG', 0),
       ('student-loan', NULL, 'LOAN', 0),
       ('advisory-services', NULL, 'ADVS', 0),
       ('international-admissions', 'Single Application', 'IADM1', 40000000),
       ('international-admissions', 'Applications to 2 Schools', 'IADM2', 60000000),
       ('language-proficiency-tests', 'IELTS', 'IELTS', 28500000),
       ('language-proficiency-tests', 'TOEFL', 'TOEFL', 24500000),
       ('language-proficiency-tests', 'GRE', 'GRE', 31200000),
       ('language-proficiency-tests', 'Duolingo English Test', 'DTE', 12000000),
       ('language-proficiency-tests', 'Pearson - PTE', 'PTE', 35200000);
