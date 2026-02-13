## Overview

Apple has long charged developers a 30% commission on every in-app purchase made through the App Store. For many app businesses, that's a devastating cut. But a recent US court order has changed the game: Apple can no longer force developers to use its payment gateway for in-app purchases in the US App Store. You can now integrate third-party payment processors and keep significantly more of your revenue.

This guide walks through the entire setup using Polar, a payment processor that handles taxes, compliance, chargebacks, and customer support — all for roughly 4.5–4.9% in transaction fees instead of Apple's 30%.

## Choosing a Payment Processor

With the court ruling in effect, you have options. The three main contenders are Stripe, PayPal, and Polar — each with different trade-offs.

**PayPal** leans heavily toward consumer protection. They tend to issue refunds generously, which is great for buyers but painful for app developers. As a business owner, you need a processor that's fair to both sides.

**Stripe** is a strong option with excellent developer tools. However, Stripe doesn't handle taxes, compliance, chargebacks, or customer support. If you've been using Apple's in-app purchases, you're used to all of that being handled for you. With Stripe, those responsibilities fall on you.

**Polar** acts as a merchant of record, meaning they handle taxes, compliance, chargebacks, fraud prevention, and customer support — the same services Apple provides — but at a fraction of the cost. At roughly 4.5–4.9% in transaction fees, Polar gives you the full-service experience without the 30% price tag.

## Setting Up a Product in Polar

The first step is registering your in-app purchase as a product in Polar.

1. Create a new product in the Polar dashboard (you can use their sandbox environment for testing)
2. Name the product (e.g., "In-App Purchase")
3. Choose your pricing model — one-time, monthly, or yearly
4. Set the price (e.g., $19)

![Polar pricing configuration](/blog/bypass-apple-in-app-purchase-cut-deep-linking/polar-pricing-setup.jpg)

## Creating a Checkout Link

Once your product exists, you need a checkout link that your app will open when users want to purchase.

1. Go to checkout links in Polar
2. Create a new link with a descriptive label
3. Select your product
4. Set the **success URL** — this is the URL users will be redirected to after a successful payment, and it's what brings them back into your app

![Creating a checkout link in Polar](/blog/bypass-apple-in-app-purchase-cut-deep-linking/create-checkout-link.jpg)

![Completed checkout link with URL and success URL](/blog/bypass-apple-in-app-purchase-cut-deep-linking/checkout-link-details.jpg)

## Configuring Universal Links

For the success URL to reopen your native app after payment, you need to set up **universal links** (also called app links). This requires creating an `apple-app-site-association` JSON file.

![Apple App Site Association JSON configuration](/blog/bypass-apple-in-app-purchase-cut-deep-linking/app-links-json-config.jpg)

The file structure looks like this:

```json
{
  "applinks": {
    "details": [
      {
        "appIDs": ["TEAM_ID.com.your.bundle.id"],
        "components": [{ "/": "/*" }]
      }
    ]
  }
}
```

This file must be hosted at `/.well-known/apple-app-site-association` on your domain. The exact implementation depends on your stack — it could be a proxy route, a static JSON file in your project, an edge worker, or a file uploaded through your platform's file manager.

The wildcard path (`/*`) means all URLs on your domain will deep-link into the app. You can narrow this to specific paths if needed.

## Whitelisting Payment URLs for Safari

Here's a critical legal requirement: **Apple mandates that third-party payment processor URLs open in Safari, not in an in-app browser.** If you open these URLs inside your app, your submission will be rejected.

You need to whitelist these Polar domains in your app's "always open in browser" configuration:

- `sandbox-api.polar.sh` (for testing)
- `buy.polar.sh` (for production)

This can be configured in your visual editor or directly in your Xcode project settings. After making these changes, you must rebuild and redeploy your app since these are structural changes.

## Testing the Payment Flow

With everything configured, the end-to-end flow works like this:

1. User taps the purchase link in your app
2. Safari opens with Polar's checkout page
3. User completes payment (Apple Pay, card, or other methods)
4. Polar redirects to your success URL
5. Universal links bring the user back into your native app

![Payment screen on iPhone with Apple Pay and card options](/blog/bypass-apple-in-app-purchase-cut-deep-linking/iap-payment-screen.jpg)

![Checkout processing with order total](/blog/bypass-apple-in-app-purchase-cut-deep-linking/checkout-total-processing.jpg)

![Successful purchase confirmation in the app](/blog/bypass-apple-in-app-purchase-cut-deep-linking/purchase-success.jpg)

## Post-Payment: Webhooks and the Checkouts API

After a purchase completes, you'll want to track it. Polar offers two mechanisms:

**Webhooks** let you listen for completed purchases and trigger post-payment logic — sending confirmation emails, unlocking features, or updating your database.

**The Checkouts API** lets you generate checkout links dynamically with metadata attached. You can assign a user ID or pre-inject an email address into the checkout, so you know exactly which user completed a purchase. This is far more flexible than static checkout links and is the recommended approach for production apps.

## Key Takeaways

- A US court order now prevents Apple from forcing developers to use its 30% payment gateway in the US App Store
- Polar charges ~4.5–4.9% while handling taxes, compliance, chargebacks, fraud, and customer support
- Setup requires: a Polar product, a checkout link with a success URL, universal links (apple-app-site-association), and Safari whitelisting
- Payment URLs must open in Safari — this is a legal requirement from Apple
- Use Polar's Checkouts API with metadata for production-grade user tracking
- Rebuild and redeploy your app after configuring link handling settings

---

## Source

This guide is based on the video by **NoCode ProCode (Despia CEO)**.

[![How to Avoid Apple's 30% In-App Purchase Cut using Deep Linking](https://img.youtube.com/vi/Pc5Zdm8qmm0/maxresdefault.jpg)](https://youtube.com/watch?v=Pc5Zdm8qmm0)

[Watch the original video →](https://youtube.com/watch?v=Pc5Zdm8qmm0)
