-- ===================== SERVICE PRICES TABLES =====================
-- Backs /services/[slug] pages and the admin service-management dashboard.
-- Without this table, every /services/[slug] page 404s (getServiceDetailsWithCurrentPrices
-- returns null when no base price row exists for a service_slug).

CREATE TABLE IF NOT EXISTS public.service_prices (
  id BIGSERIAL PRIMARY KEY,
  service_slug TEXT NOT NULL,
  option_name TEXT, -- NULL = base price for the service
  service_code TEXT NOT NULL,
  price_kobo INTEGER NOT NULL, -- INTEGER, not BIGINT: node-postgres returns BIGINT as a string,
  -- but application code expects a JS number (typeof check) when reading base prices.
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_service_prices_service_slug ON public.service_prices (service_slug);

CREATE TRIGGER set_updated_at_service_prices
BEFORE UPDATE ON public.service_prices
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

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

CREATE INDEX IF NOT EXISTS idx_service_price_history_service_slug ON public.service_price_history (service_slug);

-- ===================== SEED BASE PRICES (placeholders — update via the admin Service Management dashboard) =====================

INSERT INTO public.service_prices (service_slug, option_name, service_code, price_kobo) VALUES
  ('international-admissions', NULL, 'IADM', 0),
  ('international-admissions', 'Single Application', 'IADM1', 40000000),
  ('international-admissions', 'Applications to 2 Schools', 'IADM2', 60000000),
  ('document-verification', NULL, 'DOCV', 1),
  ('scholarships', NULL, 'SCHL', 1),
  ('visa-assistance', NULL, 'VISA', 1),
  ('language-proficiency-tests', NULL, 'LANG', 0),
  ('language-proficiency-tests', 'IELTS', 'IELTS', 1),
  ('language-proficiency-tests', 'TOEFL', 'TOEFL', 1),
  ('language-proficiency-tests', 'GRE', 'GRE', 1),
  ('language-proficiency-tests', 'Duolingo English Test', 'DTE', 1),
  ('language-proficiency-tests', 'Pearson - PTE', 'PTE', 1),
  ('advisory-services', NULL, 'ADVS', 1)
ON CONFLICT DO NOTHING;
