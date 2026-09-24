import { supabase } from './supabase'
import { Category, Post, Community, Creator } from '../types/database'

// Fetch categories from database
export async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name')
  
  if (error) {
    console.error('Error fetching categories:', error)
    return [] // Return empty array if error
  }
  
  return data || []
}

// Fetch trending posts
export async function fetchTrendingPosts(limit: number = 10): Promise<Post[]> {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      profiles:author_id (
        username,
        display_name,
        avatar
      )
    `)
    .eq('is_trending', true)
    .order('created_at', { ascending: false })
    .limit(limit)
  
  if (error) {
    console.error('Error fetching trending posts:', error)
    return []
  }
  
  return data || []
}

// Fetch latest posts
export async function fetchLatestPosts(limit: number = 10): Promise<Post[]> {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      profiles:author_id (
        username,
        display_name,
        avatar
      )
    `)
    .order('created_at', { ascending: false })
    .limit(limit)
  
  if (error) {
    console.error('Error fetching latest posts:', error)
    return []
  }
  
  return data || []
}

// Fetch communities
export async function fetchCommunities(): Promise<Community[]> {
  const { data, error } = await supabase
    .from('communities')
    .select('*')
    .order('members_count', { ascending: false })
    .limit(10)
  
  if (error) {
    console.error('Error fetching communities:', error)
    return []
  }
  
  return data || []
}

// Fetch creators
export async function fetchCreators(): Promise<Creator[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('is_creator', true)
    .order('followers_count', { ascending: false })
    .limit(10)
  
  if (error) {
    console.error('Error fetching creators:', error)
    return []
  }
  
  return data || []
}
