import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// VAPID keys - in production, use secrets
const VAPID_PUBLIC_KEY = Deno.env.get("VAPID_PUBLIC_KEY") || "BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U";
const VAPID_PRIVATE_KEY = Deno.env.get("VAPID_PRIVATE_KEY") || "UUxI4O8-FbRouADVXc-hK2llM22A5Q9Y3FVb9jD5qH0";

interface PushPayload {
  title: string;
  body: string;
  url?: string;
}

// Simple base64url encoding
function base64UrlEncode(data: Uint8Array): string {
  const base64 = btoa(String.fromCharCode(...data));
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

// Create JWT for VAPID
async function createVapidJwt(audience: string, subject: string, privateKeyBase64: string): Promise<string> {
  const header = { alg: 'ES256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    aud: audience,
    exp: now + 86400, // 24 hours
    sub: subject,
  };

  const headerB64 = base64UrlEncode(new TextEncoder().encode(JSON.stringify(header)));
  const payloadB64 = base64UrlEncode(new TextEncoder().encode(JSON.stringify(payload)));
  const unsignedToken = `${headerB64}.${payloadB64}`;

  // Import the private key
  const privateKeyBytes = Uint8Array.from(atob(privateKeyBase64.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0));
  
  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8',
    privateKeyBytes,
    { name: 'ECDSA', namedCurve: 'P-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign(
    { name: 'ECDSA', hash: 'SHA-256' },
    cryptoKey,
    new TextEncoder().encode(unsignedToken)
  );

  const signatureB64 = base64UrlEncode(new Uint8Array(signature));
  return `${unsignedToken}.${signatureB64}`;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { title, body, url } = await req.json() as PushPayload;

    // Get Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get all push subscriptions
    const { data: subscriptions, error } = await supabase
      .from("push_subscriptions")
      .select("*");

    if (error) {
      console.error("Error fetching subscriptions:", error);
      return new Response(JSON.stringify({ error: "Failed to fetch subscriptions" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!subscriptions || subscriptions.length === 0) {
      return new Response(JSON.stringify({ message: "No subscribers found" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const pushPayload = JSON.stringify({ title, body, url });
    const results: { success: number; failed: number } = { success: 0, failed: 0 };

    // Send notification to each subscriber using fetch
    for (const sub of subscriptions) {
      try {
        const endpointUrl = new URL(sub.endpoint);
        const audience = `${endpointUrl.protocol}//${endpointUrl.host}`;
        
        // Create VAPID authorization header
        const vapidHeader = `vapid t=${await createVapidJwt(audience, 'mailto:info@jmbelectrical.co.za', VAPID_PRIVATE_KEY)}, k=${VAPID_PUBLIC_KEY}`;

        const response = await fetch(sub.endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/octet-stream',
            'Content-Encoding': 'aes128gcm',
            'Authorization': vapidHeader,
            'TTL': '86400',
          },
          body: pushPayload,
        });

        if (response.ok || response.status === 201) {
          results.success++;
        } else if (response.status === 404 || response.status === 410) {
          // Subscription expired, remove it
          await supabase.from("push_subscriptions").delete().eq("id", sub.id);
          results.failed++;
        } else {
          console.error(`Push failed for ${sub.id}: ${response.status}`);
          results.failed++;
        }
      } catch (err) {
        console.error(`Error sending to ${sub.id}:`, err);
        results.failed++;
      }
    }

    return new Response(JSON.stringify({ 
      message: "Notifications sent", 
      success: results.success, 
      failed: results.failed 
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
