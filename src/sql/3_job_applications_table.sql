-- ===================== JOB APPLICATIONS TABLE =====================
-- Backs the /careers recruitment form (public, unauthenticated applicants).

CREATE TABLE IF NOT EXISTS public.job_applications (
  id BIGSERIAL PRIMARY KEY,
  role_slug TEXT NOT NULL,
  role_title TEXT NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  cv_url TEXT NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'new', -- new, reviewed, contacted, rejected, hired
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_job_applications_role_slug ON public.job_applications (role_slug);
CREATE INDEX IF NOT EXISTS idx_job_applications_created_at ON public.job_applications (created_at DESC);

CREATE TRIGGER set_updated_at_job_applications
BEFORE UPDATE ON public.job_applications
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();
