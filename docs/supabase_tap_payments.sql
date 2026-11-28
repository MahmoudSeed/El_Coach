-- Migration: جدول معاملات الدفع الفوري عبر Tap Payments + سياسة RLS
CREATE TABLE IF NOT EXISTS public.payment_transactions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    auth_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    provider text NOT NULL DEFAULT 'tap',
    tap_charge_id text UNIQUE,
    tier_months integer NOT NULL,
    days_to_add integer NOT NULL,
    amount numeric(10,2) NOT NULL,
    currency text NOT NULL DEFAULT 'SAR',
    status text NOT NULL DEFAULT 'pending',
    raw_webhook jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now(),
    paid_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_payment_transactions_client_created
    ON public.payment_transactions (client_id, created_at DESC);

ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Clients can view own payment transactions" ON public.payment_transactions;
CREATE POLICY "Clients can view own payment transactions"
    ON public.payment_transactions
    FOR SELECT
    TO authenticated
    USING (
        (select auth.uid()) = auth_user_id
        OR ((auth.jwt() -> 'app_metadata' ->> 'role') = 'coach')
    );
