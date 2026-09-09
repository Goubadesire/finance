import { createClient } from "@/lib/supabase/client";

export const authService = {
    async signUp(email: string, password: string, fullName: string){
        const supabase = createClient()
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName
                }
            }
        })

        if(error){
            throw error
        }
        return data
    },

    async singIn(email: string, password: string){
        const supabase = createClient()
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        })
        if(error){
            throw error
        }
        return data
    },

    async signOut(){
        const supabase = createClient()
        const { error } = await supabase.auth.signOut()
        if(error){
            throw error
        }
    }
}