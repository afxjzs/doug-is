-- Fix overly strict email validation constraint on contact_messages
-- The existing valid_email constraint rejects valid emails containing + characters
-- (e.g. user+tag@example.com). Drop and replace with RFC 5322 compliant pattern.

ALTER TABLE public.contact_messages DROP CONSTRAINT IF EXISTS valid_email;

ALTER TABLE public.contact_messages
  ADD CONSTRAINT valid_email
  CHECK (email ~* '^[a-zA-Z0-9.!#$%&''*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$');
