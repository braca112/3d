import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { stripe } from "@/lib/stripe"
import { db } from "@/lib/db"
import type Stripe from "stripe"

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get("Stripe-Signature") as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (error: any) {
    console.error(`Webhook Error: ${error.message}`)
    return NextResponse.json({ message: `Webhook Error: ${error.message}` }, { status: 400 })
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session

        if (!session?.metadata?.userId) {
          console.error("No userId in session metadata")
          return NextResponse.json({ message: "No userId in session metadata" }, { status: 400 })
        }

        // Update user to premium
        await db.user.update({
          where: { id: session.metadata.userId },
          data: {
            isPremium: true,
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: session.subscription as string,
            stripeSubscriptionStatus: "active",
          },
        })

        break
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription

        // Find user by customer ID
        const user = await db.user.findFirst({
          where: { stripeCustomerId: subscription.customer as string },
        })

        if (!user) {
          console.error("No user found with customer ID:", subscription.customer)
          return NextResponse.json({ message: "User not found" }, { status: 404 })
        }

        // Update subscription status
        await db.user.update({
          where: { id: user.id },
          data: {
            stripeSubscriptionStatus: subscription.status,
            isPremium: subscription.status === "active",
          },
        })

        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription

        // Find user by customer ID
        const user = await db.user.findFirst({
          where: { stripeCustomerId: subscription.customer as string },
        })

        if (!user) {
          console.error("No user found with customer ID:", subscription.customer)
          return NextResponse.json({ message: "User not found" }, { status: 404 })
        }

        // Downgrade user from premium
        await db.user.update({
          where: { id: user.id },
          data: {
            isPremium: false,
            stripeSubscriptionStatus: "canceled",
          },
        })

        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Error processing webhook:", error)
    return NextResponse.json({ message: "Error processing webhook" }, { status: 500 })
  }
}
