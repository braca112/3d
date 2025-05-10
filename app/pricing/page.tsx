import { auth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"
import Link from "next/link"

export default async function PricingPage() {
  const session = await auth()

  return (
    <main className="container mx-auto py-10 px-4">
      <div className="mx-auto max-w-5xl text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Simple, transparent pricing</h1>
        <p className="mt-6 text-xl text-muted-foreground">
          Choose the plan that's right for you and start creating amazing 3D models today.
        </p>
      </div>

      <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
        {/* Free Tier */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="text-2xl">Free</CardTitle>
            <div className="mt-4">
              <span className="text-4xl font-bold">$0</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <CardDescription className="mt-4">Perfect for trying out the platform and occasional use.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <ul className="space-y-3">
              <li className="flex items-center">
                <Check className="mr-2 h-5 w-5 text-primary" />
                <span>5 model generations per month</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-5 w-5 text-primary" />
                <span>Basic 3D model quality</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-5 w-5 text-primary" />
                <span>Download in GLB format</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-5 w-5 text-primary" />
                <span>100MB storage</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            {session ? (
              <Link href="/dashboard" className="w-full">
                <Button variant="outline" className="w-full">
                  Current Plan
                </Button>
              </Link>
            ) : (
              <Link href="/" className="w-full">
                <Button variant="outline" className="w-full">
                  Get Started
                </Button>
              </Link>
            )}
          </CardFooter>
        </Card>

        {/* Premium Tier */}
        <Card className="flex flex-col border-primary">
          <CardHeader>
            <div className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground w-fit">
              POPULAR
            </div>
            <CardTitle className="text-2xl mt-4">Premium</CardTitle>
            <div className="mt-4">
              <span className="text-4xl font-bold">$15</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <CardDescription className="mt-4">
              For professionals and serious creators who need more power.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <ul className="space-y-3">
              <li className="flex items-center">
                <Check className="mr-2 h-5 w-5 text-primary" />
                <span>Unlimited model generations</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-5 w-5 text-primary" />
                <span>High-quality 3D models</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-5 w-5 text-primary" />
                <span>Download in multiple formats</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-5 w-5 text-primary" />
                <span>1GB storage</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-5 w-5 text-primary" />
                <span>Priority support</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            {session?.user ? (
              session.user.isPremium ? (
                <Button disabled className="w-full">
                  Current Plan
                </Button>
              ) : (
                <form action="/api/create-checkout-session" method="POST" className="w-full">
                  <Button type="submit" className="w-full">
                    Upgrade Now
                  </Button>
                </form>
              )
            ) : (
              <Link href="/" className="w-full">
                <Button className="w-full">Sign Up</Button>
              </Link>
            )}
          </CardFooter>
        </Card>
      </div>

      <div className="mx-auto mt-16 max-w-3xl text-center">
        <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
        <dl className="mt-8 space-y-6 text-left">
          <div>
            <dt className="font-semibold">Can I upgrade or downgrade at any time?</dt>
            <dd className="mt-2 text-muted-foreground">
              Yes, you can upgrade to Premium at any time. If you downgrade, your Premium benefits will continue until
              the end of your billing period.
            </dd>
          </div>
          <div>
            <dt className="font-semibold">What payment methods do you accept?</dt>
            <dd className="mt-2 text-muted-foreground">
              We accept all major credit cards through our secure payment processor, Stripe.
            </dd>
          </div>
          <div>
            <dt className="font-semibold">Is there a refund policy?</dt>
            <dd className="mt-2 text-muted-foreground">
              If you're not satisfied with our service, contact us within 7 days of your purchase for a full refund.
            </dd>
          </div>
        </dl>
      </div>
    </main>
  )
}
