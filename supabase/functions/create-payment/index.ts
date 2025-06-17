
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Create Supabase client with service role for database operations
  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  // Create Supabase client for user authentication
  const supabaseAuth = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    // Retrieve authenticated user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Authorization header missing");
    }
    
    const token = authHeader.replace("Bearer ", "");
    const { data, error: authError } = await supabaseAuth.auth.getUser(token);
    
    if (authError || !data.user?.email) {
      throw new Error("User not authenticated or email not available");
    }

    const user = data.user;

    // Check if user already has access to the course
    const { data: existingAccess } = await supabaseClient
      .from('course_access')
      .select('*')
      .eq('user_id', user.id)
      .eq('course_id', 'ai-workplace-productivity')
      .eq('is_active', true)
      .single();

    if (existingAccess) {
      throw new Error("You already have access to this course");
    }

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Check if a Stripe customer record exists for this user
    const customers = await stripe.customers.list({ 
      email: user.email, 
      limit: 1 
    });
    
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    }

    // Create order record
    const { data: order, error: orderError } = await supabaseClient
      .from('orders')
      .insert({
        user_id: user.id,
        amount: 4999, // $49.99 in cents
        currency: 'usd',
        status: 'pending',
        product_name: 'AI for Workplace Productivity Course'
      })
      .select()
      .single();

    if (orderError) {
      console.error('Order creation error:', orderError);
      throw new Error("Failed to create order record");
    }

    // Create a one-time payment session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { 
              name: "AI for Workplace Productivity Course",
              description: "Complete access to all 7 modules, templates, and certification"
            },
            unit_amount: 4999, // $49.99 in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/payment-success?order_id=${order.id}`,
      cancel_url: `${req.headers.get("origin")}/payment-canceled?order_id=${order.id}`,
      metadata: {
        order_id: order.id,
        user_id: user.id,
        course_id: 'ai-workplace-productivity'
      },
      allow_promotion_codes: true,
    });

    // Update order with Stripe session ID
    await supabaseClient
      .from('orders')
      .update({ 
        stripe_session_id: session.id,
        updated_at: new Date().toISOString()
      })
      .eq('id', order.id);

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error('Payment creation error:', error);
    return new Response(JSON.stringify({ 
      error: error.message || "Internal server error" 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
