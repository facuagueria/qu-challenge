export type JokeType = 'general' | 'knock-knock' | 'programming' | 'dad'

export interface Joke {
  id: number
  type: JokeType
  setup: string
  punchline: string
  isLiked?: boolean
}
