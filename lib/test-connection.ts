/**
 * Database Connection Test Utility
 * 
 * This utility helps verify that all database connections are working properly.
 * Run this from a server component or API route to test your database setup.
 */

import { getSupabaseClient } from "./supabase"
import { getActiveAboutSections } from "./about"
import { getPhotosByAlbumKey } from "./photos"
import { getPublishedArticles } from "./articles"

export interface ConnectionTestResult {
  component: string
  connected: boolean
  dataCount: number
  error?: string
}

export async function testDatabaseConnections(): Promise<{
  overall: boolean
  results: ConnectionTestResult[]
  summary: string
}> {
  const results: ConnectionTestResult[] = []

  // Test 1: Supabase Client
  try {
    const supabase = getSupabaseClient()
    if (supabase) {
      results.push({
        component: "Supabase Client",
        connected: true,
        dataCount: 0,
      })
    } else {
      results.push({
        component: "Supabase Client",
        connected: false,
        dataCount: 0,
        error: "Client not initialized - check environment variables",
      })
    }
  } catch (error) {
    results.push({
      component: "Supabase Client",
      connected: false,
      dataCount: 0,
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }

  // Test 2: About Sections
  try {
    const aboutSections = await getActiveAboutSections()
    results.push({
      component: "About Sections",
      connected: true,
      dataCount: aboutSections.length,
      error: aboutSections.length === 0 ? "No data found in table" : undefined,
    })
  } catch (error) {
    results.push({
      component: "About Sections",
      connected: false,
      dataCount: 0,
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }

  // Test 3: Photo Widget
  try {
    const photos = await getPhotosByAlbumKey("about-widget")
    results.push({
      component: "Photo Widget (about-widget album)",
      connected: true,
      dataCount: photos.length,
      error: photos.length === 0 ? "No photos found in album" : undefined,
    })
  } catch (error) {
    results.push({
      component: "Photo Widget (about-widget album)",
      connected: false,
      dataCount: 0,
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }

  // Test 4: Articles
  try {
    const articles = await getPublishedArticles()
    results.push({
      component: "Articles",
      connected: true,
      dataCount: articles.length,
      error: articles.length === 0 ? "No published articles found" : undefined,
    })
  } catch (error) {
    results.push({
      component: "Articles",
      connected: false,
      dataCount: 0,
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }

  // Test 5: Projects (via raw query)
  try {
    const supabase = getSupabaseClient()
    if (supabase) {
      const { data, error } = await supabase
        .from("projects")
        .select("id")
        .eq("status", "active")

      if (error) {
        results.push({
          component: "Projects",
          connected: false,
          dataCount: 0,
          error: error.message,
        })
      } else {
        results.push({
          component: "Projects",
          connected: true,
          dataCount: data?.length || 0,
          error: data?.length === 0 ? "No active projects found" : undefined,
        })
      }
    }
  } catch (error) {
    results.push({
      component: "Projects",
      connected: false,
      dataCount: 0,
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }

  // Test 6: Content Sections (Experience)
  try {
    const supabase = getSupabaseClient()
    if (supabase) {
      const { data, error } = await supabase
        .from("content_sections")
        .select("id")
        .eq("status", "active")
        .ilike("key", "experience_%")

      if (error) {
        results.push({
          component: "Content Sections (Experience)",
          connected: false,
          dataCount: 0,
          error: error.message,
        })
      } else {
        results.push({
          component: "Content Sections (Experience)",
          connected: true,
          dataCount: data?.length || 0,
          error: data?.length === 0 ? "No experience sections found" : undefined,
        })
      }
    }
  } catch (error) {
    results.push({
      component: "Content Sections (Experience)",
      connected: false,
      dataCount: 0,
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }

  // Calculate overall status
  const connectedCount = results.filter((r) => r.connected).length
  const totalCount = results.length
  const overall = connectedCount === totalCount

  // Generate summary
  const summary = overall
    ? `✅ All ${totalCount} database connections are working!`
    : `⚠️ ${connectedCount}/${totalCount} connections working. Check errors below.`

  return {
    overall,
    results,
    summary,
  }
}

/**
 * Format test results as a readable string
 */
export function formatTestResults(testResults: Awaited<ReturnType<typeof testDatabaseConnections>>): string {
  let output = `\n${"=".repeat(60)}\n`
  output += `DATABASE CONNECTION TEST RESULTS\n`
  output += `${"=".repeat(60)}\n\n`
  output += `${testResults.summary}\n\n`

  testResults.results.forEach((result, index) => {
    output += `${index + 1}. ${result.component}\n`
    output += `   Status: ${result.connected ? "✅ Connected" : "❌ Failed"}\n`
    output += `   Data Count: ${result.dataCount}\n`
    if (result.error) {
      output += `   Error: ${result.error}\n`
    }
    output += `\n`
  })

  output += `${"=".repeat(60)}\n`

  return output
}

/**
 * Example usage in an API route:
 * 
 * // app/api/test-db/route.ts
 * import { testDatabaseConnections, formatTestResults } from '@/lib/test-connection'
 * 
 * export async function GET() {
 *   const results = await testDatabaseConnections()
 *   return Response.json(results)
 * }
 */
