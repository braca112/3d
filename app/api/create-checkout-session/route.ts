import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { stripe } from "@/lib/stripe"
import { absoluteUrl } from "@/lib/utils"

export async function POST() {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const billingUrl = absoluteUrl("/dashboard")

    const stripeSession = await stripe.checkout.sessions.create({
      success_url: `${billingUrl}?success=true`,
      cancel_url: `${billingUrl}?canceled=true`,
      payment_method_types: ["card"],
      mode: "subscription",
      billing_address_collection: "auto",
      customer_email: session.user.email!,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "3D Model Generator Premium",
              description: "Unlimited 3D model generations",
            },
            unit_amount: 1500, // $15.00
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId: session.user.id,
      },
    })

    if (!stripeSession.url) {
      return NextResponse.json({ message: "Error creating checkout session" }, { status: 500 })
    }

    return NextResponse.json({ url: stripeSession.url })
  } catch (error) {
    console.error("Error creating checkout session:", error)
    return NextResponse.json({ message: "Error creating checkout session" }, { status: 500 })
  }
}
