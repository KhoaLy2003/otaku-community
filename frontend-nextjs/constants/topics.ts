import type { TopicCategory } from '@/types/topic'

export const TOPIC_CATEGORIES: Record<TopicCategory, { name: string; description: string }> = {
  anime: {
    name: 'Anime',
    description: 'Discuss your favorite anime series and characters',
  },
  manga: {
    name: 'Manga',
    description: 'Share and discover manga recommendations',
  },
  'japan-culture': {
    name: 'Japan Culture',
    description: 'Explore Japanese traditions, customs, and culture',
  },
  'japan-food': {
    name: 'Japan Food',
    description: 'Share Japanese cuisine, recipes, and food experiences',
  },
  'jlpt-learning': {
    name: 'JLPT Learning',
    description: 'Study Japanese language and prepare for JLPT exams',
  },
  'japan-travel': {
    name: 'Japan Travel',
    description: 'Travel tips, itineraries, and experiences in Japan',
  },
  'japanese-life': {
    name: 'Japanese Life & Work',
    description: 'Living and working in Japan, daily life experiences',
  },
}

export const TOPIC_CATEGORY_LIST: TopicCategory[] = [
  'anime',
  'manga',
  'japan-culture',
  'japan-food',
  'jlpt-learning',
  'japan-travel',
  'japanese-life',
]



