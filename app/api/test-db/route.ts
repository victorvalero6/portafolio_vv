import { testDatabaseConnections } from "@/lib/test-connection"
import { NextResponse } from "next/server"

/**
 * API Route to test database connections
 * 
 * Visit: http://localhost:3000/api/test-db
 * 
 * This will test all database connections and return a JSON report
 * showing which components are connected and working properly.
 */
export async function GET() {
  try {
    const results = await testDatabaseConnections()

    return NextResponse.json(results, {
      status: results.overall ? 200 : 500,
    })
  } catch (error) {
    return NextResponse.json(
      {
        overall: false,
        results: [],
        summary: "Failed to run connection tests",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
