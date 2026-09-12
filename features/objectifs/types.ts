export type Goal = {
  id: string
  user_id: string
  title: string
  icon: string | null
  target_amount: number
  current_amount: number
  deadline: string | null
  created_at: string
}

export type GoalContribution = {
  id: string
  goal_id: string
  user_id: string
  amount: number
  created_at: string
}