import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;

// Client-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side Supabase client with service key
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Storage bucket names
export const STORAGE_BUCKETS = {
  financialDocuments: 'financial-documents',
  analysisReports: 'analysis-reports',
  companyLogos: 'company-logos',
};

// File upload functions
export async function uploadFinancialDocument(
  file: File,
  userId: string,
  companyId: string
): Promise<{ path: string; url: string } | null> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${companyId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKETS.financialDocuments)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Error uploading file:', error);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from(STORAGE_BUCKETS.financialDocuments)
      .getPublicUrl(data.path);

    return {
      path: data.path,
      url: publicUrl
    };
  } catch (error) {
    console.error('Error in uploadFinancialDocument:', error);
    return null;
  }
}

export async function downloadFile(
  bucket: string,
  path: string
): Promise<Blob | null> {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .download(path);

    if (error) {
      console.error('Error downloading file:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in downloadFile:', error);
    return null;
  }
}

export async function deleteFile(
  bucket: string,
  path: string
): Promise<boolean> {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) {
      console.error('Error deleting file:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteFile:', error);
    return false;
  }
}

// Authentication functions
export async function signUp(
  email: string,
  password: string,
  metadata?: any
): Promise<{ user: any; error: any }> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata
    }
  });

  return { user: data?.user, error };
}

export async function signIn(
  email: string,
  password: string
): Promise<{ user: any; error: any }> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  return { user: data?.user, error };
}

export async function signOut(): Promise<{ error: any }> {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function updateUserProfile(
  userId: string,
  updates: any
): Promise<{ data: any; error: any }> {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .single();

  return { data, error };
}

// Database helper functions
export async function createRecord(
  table: string,
  data: any
): Promise<{ data: any; error: any }> {
  const { data: result, error } = await supabase
    .from(table)
    .insert(data)
    .select()
    .single();

  return { data: result, error };
}

export async function updateRecord(
  table: string,
  id: string,
  updates: any
): Promise<{ data: any; error: any }> {
  const { data, error } = await supabase
    .from(table)
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  return { data, error };
}

export async function deleteRecord(
  table: string,
  id: string
): Promise<{ error: any }> {
  const { error } = await supabase
    .from(table)
    .delete()
    .eq('id', id);

  return { error };
}

export async function getRecord(
  table: string,
  id: string
): Promise<{ data: any; error: any }> {
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .eq('id', id)
    .single();

  return { data, error };
}

export async function getRecords(
  table: string,
  filters?: any,
  orderBy?: { column: string; ascending: boolean }
): Promise<{ data: any[]; error: any }> {
  let query = supabase.from(table).select('*');

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      query = query.eq(key, value);
    });
  }

  if (orderBy) {
    query = query.order(orderBy.column, { ascending: orderBy.ascending });
  }

  const { data, error } = await query;

  return { data: data || [], error };
}

// Real-time subscriptions
export function subscribeToTable(
  table: string,
  callback: (payload: any) => void,
  filter?: any
) {
  const channel = supabase
    .channel(`public:${table}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: table,
        filter: filter
      },
      callback
    )
    .subscribe();

  return channel;
}

export function unsubscribe(channel: any) {
  supabase.removeChannel(channel);
}

// Analysis specific functions
export async function saveAnalysisResults(
  analysisId: string,
  results: any
): Promise<{ error: any }> {
  const { error } = await supabase
    .from('analysis_results')
    .upsert({
      id: analysisId,
      results: results,
      updated_at: new Date().toISOString()
    });

  return { error };
}

export async function getAnalysisResults(
  analysisId: string
): Promise<{ data: any; error: any }> {
  const { data, error } = await supabase
    .from('analysis_results')
    .select('*')
    .eq('id', analysisId)
    .single();

  return { data, error };
}

// Industry benchmark functions
export async function getIndustryBenchmarks(
  sector: string,
  activity: string,
  region: string,
  metrics?: string[]
): Promise<{ data: any[]; error: any }> {
  let query = supabase
    .from('industry_benchmarks')
    .select('*')
    .eq('sector', sector)
    .eq('activity', activity)
    .eq('region', region);

  if (metrics && metrics.length > 0) {
    query = query.in('metric', metrics);
  }

  const { data, error } = await query;

  return { data: data || [], error };
}

export async function updateIndustryBenchmark(
  sector: string,
  activity: string,
  region: string,
  metric: string,
  value: number,
  source: string
): Promise<{ error: any }> {
  const { error } = await supabase
    .from('industry_benchmarks')
    .upsert({
      sector,
      activity,
      region,
      metric,
      value,
      source,
      year: new Date().getFullYear(),
      updated_at: new Date().toISOString()
    });

  return { error };
}
