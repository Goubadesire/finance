import { createClient } from '@/lib/supabase/client'
import { Goal, GoalContribution } from '../types'

export const goalService = {
  async getGoals() {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as Goal[]
  },

  async addGoal(goal: {
    title: string
    target_amount: number
    icon?: string | null
    deadline?: string | null
  }) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Utilisateur non authentifié')

    const { data, error } = await supabase
      .from('goals')
      .insert([
        {
          user_id: user.id,
          current_amount: 0,
          icon: goal.icon ?? 'Target',
          ...goal,
        },
      ])
      .select()

    if (error) throw error
    return data
  },

  async updateGoal(id: string, updates: { title?: string; target_amount?: number }) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('goals')
      .update(updates)
      .eq('id', id)
      .select()

    if (error) throw error
    return data
  },

  async deleteGoal(id: string) {
    const supabase = createClient()
    const { error } = await supabase.from('goals').delete().eq('id', id)
    if (error) throw error
  },

  // ---- Versements (goal_contributions) ----

  async getContributions(goalId: string) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('goal_contributions')
      .select('*')
      .eq('goal_id', goalId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as GoalContribution[]
  },

  async addFunds(goalId: string, amount: number) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Utilisateur non authentifié')

    const { data, error } = await supabase
      .from('goal_contributions')
      .insert([{ goal_id: goalId, user_id: user.id, amount }])
      .select()

    if (error) throw error
    return data
  },

  async updateContribution(id: string, amount: number) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('goal_contributions')
      .update({ amount })
      .eq('id', id)
      .select()

    if (error) throw error
    return data
  },

  async deleteContribution(id: string) {
    const supabase = createClient()
    const { error } = await supabase.from('goal_contributions').delete().eq('id', id)
    if (error) throw error
  },
}