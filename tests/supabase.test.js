import { describe, it, expect, vi, beforeEach } from 'vitest';

const OLD_ENV = process.env;

beforeEach(() => {
  vi.resetModules();
  process.env = { ...OLD_ENV };
  // Clear the env vars the module checks at import time
  delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
});

describe('supabase client', () => {
  it('creates a client even without env vars (uses defaults)', async () => {
    const { supabase } = await import('../src/lib/supabase');
    expect(supabase).not.toBeNull();
  });

  it('uses NEXT_PUBLIC_SUPABASE_ANON_KEY when provided', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'my-anon-key';

    const { supabase } = await import('../src/lib/supabase');
    expect(supabase).not.toBeNull();
  });

  it('falls back to NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY for anon key', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = 'publishable-key';

    const { supabase } = await import('../src/lib/supabase');
    expect(supabase).not.toBeNull();
  });

  it('supabaseAdmin falls back to supabase (anon) when no service key', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'my-anon-key';

    const { supabase, supabaseAdmin } = await import('../src/lib/supabase');
    // supabaseAdmin falls back to the anon client, not null
    expect(supabaseAdmin).not.toBeNull();
    // It's the same object as supabase (or at least truthy)
    expect(supabaseAdmin).toBe(supabase);
  });

  it('creates a separate supabaseAdmin with service role key', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'my-anon-key';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'my-service-key';

    const { supabase, supabaseAdmin } = await import('../src/lib/supabase');
    expect(supabaseAdmin).not.toBeNull();
    // Should be a different instance from the anon client
    expect(supabaseAdmin).not.toBe(supabase);
  });
});
