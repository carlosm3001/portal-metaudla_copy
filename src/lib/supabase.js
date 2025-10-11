// Mock Supabase client
// This file is created to avoid import errors while the real Supabase configuration is not available.

export const supabase = {
  from: () => ({
    select: () => ({
      order: () => ({
        limit: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') })
      })
    })
  }),
  channel: () => ({
    on: () => ({
      subscribe: () => ({})
    })
  }),
  removeChannel: () => ({})
};
