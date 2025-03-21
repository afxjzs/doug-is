// Follow this setup guide to integrate the Deno runtime into your application:
// https://deno.land/manual/examples/deploy_node_npm

// Define types for the request and error objects
interface RequestWithMethod extends Request {
	method: string
}

interface ErrorWithMessage extends Error {
	message: string
}

// Use a relative import to fix the module resolution error
const corsHeaders = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Headers":
		"authorization, x-client-info, apikey, content-type",
}

console.log("Hello from Function!")

const handler = async (req: RequestWithMethod): Promise<Response> => {
	// This is needed if you're planning to invoke your function from a browser.
	if (req.method === "OPTIONS") {
		return new Response("ok", { headers: corsHeaders })
	}

	try {
		// Return a simple response to test if service role is working
		return new Response(
			JSON.stringify({
				success: true,
				message: "Service role access is working",
				timestamp: new Date().toISOString(),
			}),
			{
				headers: { ...corsHeaders, "Content-Type": "application/json" },
				status: 200,
			}
		)
	} catch (error: unknown) {
		const errorMessage =
			error instanceof Error ? error.message : "Unknown error occurred"
		return new Response(JSON.stringify({ error: errorMessage }), {
			headers: { ...corsHeaders, "Content-Type": "application/json" },
			status: 400,
		})
	}
}

// Export the handler function
export { handler as serve }

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/get_service_role_access_test' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
