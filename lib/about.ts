import { getSupabaseClient } from "./supabase"

export interface AboutSection {
  id: number
  key: string
  title: string | null
  content: string
  is_active: boolean
  sort_order: number
}

/**
 * Fetch all active about sections
 */
export async function getActiveAboutSections(): Promise<AboutSection[]> {
  try {
    const supabase = getSupabaseClient()
    if (!supabase) {
      return []
    }

    const { data, error } = await supabase
      .from("about_sections")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })

    if (error) {
      console.error("Error fetching about sections:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getActiveAboutSections:", error)
    return []
  }
}

/**
 * Fetch a specific about section by key
 */
export async function getAboutSectionByKey(key: string): Promise<AboutSection | null> {
  try {
    const supabase = getSupabaseClient()
    if (!supabase) {
      return null
    }

    const { data, error } = await supabase
      .from("about_sections")
      .select("*")
      .eq("key", key)
      .eq("is_active", true)
      .single()

    if (error) {
      console.error("Error fetching about section:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error in getAboutSectionByKey:", error)
    return null
  }
}
