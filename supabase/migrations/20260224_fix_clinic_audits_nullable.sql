-- Relax provider_name constraint to allow regional audits
ALTER TABLE clinic_audits ALTER COLUMN provider_name DROP NOT NULL;
