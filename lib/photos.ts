import { supabase } from "./supabase"

export interface Photo {
  id: number
  album_id: number
  image_url: string
  alt_text: string | null
  caption: string | null
  taken_date: string | null
  sort_order: number
  is_featured: boolean
}

export interface PhotoAlbum {
  id: number
  key: string
  title: string
  description: string | null
  is_active: boolean
  sort_order: number
}

/**
 * Fetch photos from a specific album by key
 */
export async function getPhotosByAlbumKey(albumKey: string): Promise<Photo[]> {
  try {
    const { data, error } = await supabase
      .from("photos")
      .select(
        `
        id,
        album_id,
        image_url,
        alt_text,
        caption,
        taken_date,
        sort_order,
        is_featured,
        photo_albums!inner (
          key,
          is_active
        )
      `
      )
      .eq("photo_albums.key", albumKey)
      .eq("photo_albums.is_active", true)
      .order("sort_order", { ascending: true })

    if (error) {
      console.error("Error fetching photos:", error)
      return []
    }

    return (data || []) as unknown as Photo[]
  } catch (error) {
    console.error("Error in getPhotosByAlbumKey:", error)
    return []
  }
}

/**
 * Fetch all active photo albums
 */
export async function getActiveAlbums(): Promise<PhotoAlbum[]> {
  try {
    const { data, error } = await supabase
      .from("photo_albums")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })

    if (error) {
      console.error("Error fetching albums:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getActiveAlbums:", error)
    return []
  }
}
