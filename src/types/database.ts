export type Category = {
  id: string
  name: string
  icon: string
  color: string
  description: string | null
  topics_count: number
  posts_count: number
}

export type Community = {
  id: string
  name: string
  slug: string
  country: string
  members_count: number
  posts_count: number
  icon: string | null
  color: string | null
  description: string | null
}

export type Creator = {
  id: string
  username: string
  display_name: string
  avatar: string | null
  bio: string | null
  country: string
  followers_count: number
  following_count: number
  is_creator: boolean
}

export type Profile = {
  id: string
  username: string
  display_name: string
  avatar: string | null
  bio: string | null
  country: string
  followers_count: number
  following_count: number
  is_creator: boolean
  payment_url: string | null
  currency: string
  super_thanks_prices: any[]
}

export type Post = {
  id: string
  title: string
  content: string
  author_id: string
  category_id: string | null
  community_id: string | null
  country: string
  views: number
  likes_count: number
  replies_count: number
  shares_count: number
  is_trending: boolean
  tags: string[]
  created_at: string
  profiles: Profile
}

export type Reply = {
  id: string
  post_id: string
  author_id: string
  content: string
  reply_type: 'comment' | 'answer'
  likes_count: number
  is_verified_answer: boolean
  created_at: string
  profiles: Profile
}
