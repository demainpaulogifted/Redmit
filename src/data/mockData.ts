// 1. Static reference for Signup form and ad targeting
export const countries = [
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', currency: 'NGN', users: 125000 },
  { code: 'US', name: 'United States', flag: '🇺🇸', currency: 'USD', users: 890000 },
  { code: 'UK', name: 'United Kingdom', flag: '🇬🇧', currency: 'GBP', users: 340000 },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭', currency: 'GHS', users: 67000 },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦', currency: 'ZAR', users: 98000 },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', currency: 'CAD', users: 210000 },
  { code: 'IN', name: 'India', flag: '🇮🇳', currency: 'INR', users: 520000 },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪', currency: 'KES', users: 45000 },
]

// 2. Static reference for mapping category_id to names/colors/icons in the UI
export const categories = [
  { id: 'personal-finance', name: 'Personal Finance', icon: '💰', color: 'bg-green-500', topics: 12400, posts: 48700, description: 'Budgeting, savings, loans, credit, investing and more.' },
  { id: 'tech', name: 'Technology & Gadgets', icon: '💻', color: 'bg-blue-500', topics: 10800, posts: 41200, description: 'Phones, apps, AI, coding, cybersecurity and tech news.' },
  { id: 'jobs', name: 'Jobs & Careers', icon: '💼', color: 'bg-orange-500', topics: 8600, posts: 32400, description: 'Job openings, CVs, remote work, interviews and career advice.' },
  { id: 'business', name: 'Business & Entrepreneurship', icon: '📊', color: 'bg-teal-500', topics: 2700, posts: 11300, description: 'Startups, marketing, e-commerce, side hustles and business growth.' },
  { id: 'real-estate', name: 'Real Estate', icon: '🏠', color: 'bg-indigo-500', topics: 5200, posts: 19700, description: 'Buying, renting, mortgages, land and property investment.' },
  { id: 'education', name: 'Education & Scholarships', icon: '🎓', color: 'bg-purple-500', topics: 6100, posts: 22800, description: 'Universities, scholarships, study abroad and student life.' },
  { id: 'others', name: 'Others', icon: '📌', color: 'bg-gray-500', topics: 0, posts: 0, description: 'Questions that don\'t fit into other categories' }, // <-- ADDED
]

// 3. Fallback data for empty states or sidebar recommendations
export const communities = [
  { id: 'c1', name: 'Personal Finance NG', slug: 'personal-finance-ng', country: 'NG', members: 45200, posts: 12800, icon: '💰', color: 'bg-green-500', description: 'Discuss savings, investments, budgeting and financial literacy in Nigeria.' },
  { id: 'c2', name: 'Tech Hub Global', slug: 'tech-hub-global', country: 'global', members: 128000, posts: 45600, icon: '💻', color: 'bg-blue-500', description: 'The global community for technology enthusiasts.' },
  { id: 'c3', name: 'Jobs & Careers', slug: 'jobs-careers', country: 'global', members: 89400, posts: 32100, icon: '💼', color: 'bg-orange-500', description: 'Find jobs, share career advice and grow professionally.' },
]

export const creators = [
  { id: 'u1', username: 'FinanceGuru', displayName: 'Adaobi Nwosu', avatar: '👩🏾‍💼', country: 'NG', followers: 24500, posts: 342, verified: true, creator: true, bio: 'Financial educator. Helping Nigerians build wealth.' },
  { id: 'u2', username: 'TechBro', displayName: 'James Chen', avatar: '👨🏻‍💻', country: 'US', followers: 89200, posts: 1204, verified: true, creator: true, bio: 'Software engineer. Sharing tech career insights.' },
]

// Note: The 'posts' and 'replies' arrays below are now mostly legacy. 
// The app fetches real posts from Supabase, but we keep a tiny fallback 
// here just in case the database is completely empty on day one.
export const posts = [
  {
    id: 'p1', title: 'Which bank gives the best interest rate on savings in Nigeria?', content: 'I\'m looking for a reliable bank in Nigeria with a good interest rate on savings accounts.',
    author: { username: 'danieltech', displayName: 'DanielTech', avatar: '👨🏾', badge: 'New Member' }, category: 'Personal Finance', country: 'NG', community: 'Personal Finance NG',
    timestamp: '2h ago', views: 3200, likes: 23, replies: 45, shares: 12, trending: true, tags: ['banking', 'savings', 'nigeria'],
  }
]

export const replies = [
  { id: 'r1', author: { username: 'financequeen', displayName: 'FinanceQueen', avatar: '👩🏾‍💼', badge: 'Trusted Member' }, content: 'I use GTBank. Their savings account gives a decent interest rate.', timestamp: '2h ago', likes: 18 }
]

export const notifications = [
  { id: 'n1', type: 'like', user: 'FinanceQueen', content: 'liked your post', post: 'Which bank gives the best interest rate...', time: '5m ago', read: false },
]

export const trendingTopics = [
  { tag: '#NigerianEconomy', posts: 12400 },
  { tag: '#RemoteWork2025', posts: 8900 },
  { tag: '#TechCareers', posts: 6800 },
]