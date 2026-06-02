import { describe, it, expect, vi, beforeEach } from 'vitest';

// vi.hoisted runs before vi.mock factory, so mockFrom is available
const { mockFrom } = vi.hoisted(() => ({ mockFrom: vi.fn() }));

vi.mock('../src/lib/supabase', () => ({
  supabase: { from: mockFrom },
  supabaseAdmin: { from: mockFrom },
}));

import { createAd, getUserAds, getAds, getFeaturedAds, clearProfileCache } from '../src/lib/data';

beforeEach(() => {
  vi.clearAllMocks();
  clearProfileCache();
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('createAd', () => {
  it('strips category and price-sanitizes "$299/month" to 299', async () => {
    const profileId = 'profile-uuid-1';

    mockFrom
      .mockImplementationOnce(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            maybeSingle: vi.fn().mockResolvedValue({ data: { id: profileId }, error: null }),
          })),
        })),
      }))
      .mockImplementationOnce(() => ({
        insert: vi.fn((data) => ({
          select: vi.fn(() => ({
            single: vi.fn().mockResolvedValue({
              data: { id: 'ad-1', title: data.title, price: data.price, user_id: data.user_id, clerk_id: data.clerk_id },
              error: null,
            }),
          })),
        })),
      }));

    const result = await createAd({
      title: 'Test',
      price: '$299/month',
      category: 'Services',
      category_name: 'Services',
      user_id: 'user_2test123',
    });

    expect(result.data.price).toBe(299);
    expect(result.data.title).toBe('Test');

    const insertCall = mockFrom.mock.results[1].value.insert.mock.calls[0][0];
    expect(insertCall.category).toBeUndefined();
    expect(insertCall.category_name).toBeUndefined();
    expect(insertCall.price).toBe(299);
  });

  it('handles free-text price like "Free" by setting null', async () => {
    mockFrom
      .mockImplementationOnce(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            maybeSingle: vi.fn().mockResolvedValue({ data: { id: 'profile-2' }, error: null }),
          })),
        })),
      }))
      .mockImplementationOnce(() => ({
        insert: vi.fn((data) => ({
          select: vi.fn(() => ({
            single: vi.fn().mockResolvedValue({
              data: { id: 'ad-2', title: 'Free Item', price: data.price },
              error: null,
            }),
          })),
        })),
      }));

    const result = await createAd({ title: 'Free Item', price: 'Free', user_id: 'user_2test456' });
    expect(result.data.price).toBeNull();
  });

  it('auto-creates profile when resolveProfileId returns null', async () => {
    const newProfileId = 'auto-created-uuid';

    mockFrom
      .mockImplementationOnce(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
          })),
        })),
      }))
      .mockImplementationOnce(() => ({
        upsert: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn().mockResolvedValue({ data: { id: newProfileId }, error: null }),
          })),
        })),
      }))
      .mockImplementationOnce(() => ({
        insert: vi.fn((data) => ({
          select: vi.fn(() => ({
            single: vi.fn().mockResolvedValue({
              data: { id: 'ad-3', title: 'Test', user_id: data.user_id },
              error: null,
            }),
          })),
        })),
      }));

    const result = await createAd({ title: 'Test', description: 'Desc', user_id: 'user_2newuser' });

    const upsertCall = mockFrom.mock.results[1].value.upsert.mock.calls[0][0];
    expect(upsertCall.clerk_id).toBe('user_2newuser');
    expect(result.data.user_id).toBe(newProfileId);
  });

  it('stores clerk_id as fallback when profile upsert fails', async () => {
    const rawClerkId = 'user_2blocked';

    mockFrom
      .mockImplementationOnce(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
          })),
        })),
      }))
      .mockImplementationOnce(() => ({
        upsert: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn().mockResolvedValue({ data: null, error: { message: 'permission denied' } }),
          })),
        })),
      }))
      .mockImplementationOnce(() => ({
        insert: vi.fn((data) => ({
          select: vi.fn(() => ({
            single: vi.fn().mockResolvedValue({
              data: { id: 'ad-4', title: 'RLS Test', clerk_id: data.clerk_id, user_id: data.user_id },
              error: null,
            }),
          })),
        })),
      }));

    const result = await createAd({ title: 'RLS Test', user_id: rawClerkId });

    const insertCall = mockFrom.mock.results[2].value.insert.mock.calls[0][0];
    expect(insertCall.clerk_id).toBe(rawClerkId);
    expect(insertCall.user_id).toBeNull();
    expect(result.data.clerk_id).toBe(rawClerkId);
  });
});

describe('getUserAds', () => {
  it('finds ads by profile UUID when profile exists', async () => {
    const profileUuid = 'profile-uuid-3';

    mockFrom
      .mockImplementationOnce(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            maybeSingle: vi.fn().mockResolvedValue({ data: { id: profileUuid }, error: null }),
          })),
        })),
      }))
      .mockImplementationOnce(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            order: vi.fn().mockResolvedValue({ data: [{ id: 'ad-5', title: 'Profile-based ad', user_id: profileUuid }], error: null }),
          })),
        })),
      }));

    const ads = await getUserAds('user_2test789');
    expect(ads).toHaveLength(1);
    expect(ads[0].title).toBe('Profile-based ad');
  });

  it('falls back to clerk_id lookup when no profile exists', async () => {
    const clerkId = 'user_2orphan';

    mockFrom
      .mockImplementationOnce(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
          })),
        })),
      }))
      .mockImplementationOnce(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            order: vi.fn().mockResolvedValue({ data: [{ id: 'ad-6', title: 'Orphan ad', clerk_id: clerkId, user_id: null }], error: null }),
          })),
        })),
      }));

    const ads = await getUserAds(clerkId);
    expect(ads).toHaveLength(1);
    expect(ads[0].clerk_id).toBe(clerkId);
  });

  it('returns empty array when no ads found', async () => {
    mockFrom
      .mockImplementationOnce(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
          })),
        })),
      }))
      .mockImplementationOnce(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            order: vi.fn().mockResolvedValue({ data: [], error: null }),
          })),
        })),
      }));

    const ads = await getUserAds('user_2empty');
    expect(ads).toEqual([]);
  });
});

describe('getAds', () => {
  it('returns ads with pagination info', async () => {
    // Build a query builder that can be called multiple times
    const makeQuery = (resolveValue) => {
      const query = {
        order: vi.fn(() => query),
        eq: vi.fn(() => query),
        limit: vi.fn(() => query),
        range: vi.fn(() => query),
        then: vi.fn((resolver) => Promise.resolve(resolver(resolveValue))),
      };
      // Make it thenable so it works as a promise
      return query;
    };

    const resolvedData = { data: [{ id: '1', title: 'Test', status: 'approved' }], error: null, count: 1 };
    const query = makeQuery(resolvedData);

    mockFrom.mockImplementationOnce(() => ({
      select: vi.fn(() => query),
    }));

    const result = await getAds({});
    expect(result.ads).toHaveLength(1);
    expect(result.total).toBe(1);
  });
});

describe('getFeaturedAds', () => {
  it('filters by is_sponsored and approved', async () => {
    const makeQuery = (resolveValue) => {
      const query = {
        order: vi.fn(() => query),
        eq: vi.fn(() => query),
        limit: vi.fn(() => query),
        then: vi.fn((resolver) => Promise.resolve(resolver(resolveValue))),
      };
      return query;
    };

    const resolvedData = { data: [{ id: 'sp-1', title: 'Featured', is_sponsored: true, status: 'approved' }], error: null };
    const query = makeQuery(resolvedData);

    mockFrom.mockImplementationOnce(() => ({
      select: vi.fn(() => query),
    }));

    const ads = await getFeaturedAds();
    expect(ads).toHaveLength(1);
    expect(ads[0].is_sponsored).toBe(true);
  });
});
