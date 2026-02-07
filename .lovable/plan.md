
# Implementation Plan: End-to-End Testing, One-Time Payments & Pricing Integration

## Overview
This plan covers three interconnected tasks:
1. Testing all recently implemented features end-to-end
2. Adding one-time payment products (Call Reports Pack, White-Glove Setup)
3. Connecting the landing page pricing section to the functional `/pricing` page

---

## Part 1: End-to-End Testing Checklist

### Authentication Flow
- Sign up with email/password
- Email verification (if enabled)
- Sign in to dashboard
- Sign out functionality

### Agent Management (Dashboard)
- View agents list
- Toggle agent status (pause/resume)
- Edit agent (opens dialog, saves changes)
- Delete agent (confirmation dialog, removes from database)

### Subscription Flow
- Visit `/pricing` page
- Click "Get Started" on a plan
- Redirect to Stripe Checkout (new tab)
- After payment, check subscription status displays correctly
- "Manage Subscription" opens Stripe Customer Portal

---

## Part 2: One-Time Payment Products

### New Products to Create in Stripe

| Product | Price | Description |
|---------|-------|-------------|
| Call Reports Pack | $29 | Detailed AI call transcripts and analytics export |
| White-Glove Setup | $199 | Premium onboarding with custom agent training |

### New Edge Function: `create-payment`
A backend function for processing one-time payments with `mode: "payment"` (not subscription).

```text
Key differences from subscription checkout:
- mode: "payment" instead of "subscription"
- Different success/cancel URLs
- No recurring billing
```

### Frontend Updates
- Add one-time products section to `/pricing` page
- Create purchase buttons that invoke `create-payment`
- Add success page route for one-time purchases

---

## Part 3: Connect Landing Page Pricing to /pricing

### Current Issue
The `PricingSection.tsx` on the landing page shows hardcoded pricing ($97, $297, Custom) that doesn't match the actual Stripe products ($49, $149, $299). The buttons are non-functional.

### Solution
Update the landing page pricing section to:
1. Link to `/pricing` page for checkout functionality
2. Synchronize displayed prices with actual Stripe tier pricing
3. Add proper navigation via React Router `Link`

### Header Navigation
Update the Header component to:
- Link "Sign In" button to `/auth`
- Link "Get Started" button to `/pricing`
- Link the `#pricing` nav item to scroll OR navigate to `/pricing`

---

## Technical Implementation Details

### Files to Create
| File | Purpose |
|------|---------|
| `supabase/functions/create-payment/index.ts` | Edge function for one-time payments |
| `src/pages/PaymentSuccess.tsx` | Success page for one-time purchases |

### Files to Modify
| File | Changes |
|------|---------|
| `src/lib/stripe.ts` | Add one-time products configuration |
| `src/pages/Pricing.tsx` | Add one-time payment section with purchase buttons |
| `src/components/PricingSection.tsx` | Update prices to match tiers, add Link to /pricing |
| `src/components/Header.tsx` | Connect Sign In to /auth, Get Started to /pricing |
| `supabase/config.toml` | Register new create-payment function |
| `src/App.tsx` | Add /payment-success route |

### One-Time Products Configuration
```text
oneTimeProducts = {
  callReports: {
    name: "Call Reports Pack",
    price: 29,
    priceId: "[to be created]",
    productId: "[to be created]",
    description: "Detailed AI call transcripts and analytics export"
  },
  whiteGloveSetup: {
    name: "White-Glove Setup",
    price: 199,
    priceId: "[to be created]",
    productId: "[to be created]",
    description: "Premium onboarding with custom agent training"
  }
}
```

---

## Implementation Sequence

1. **Create Stripe Products** - Use Stripe tools to create Call Reports Pack ($29) and White-Glove Setup ($199) products

2. **Create Payment Edge Function** - Build `create-payment` for one-time purchases

3. **Update Configuration** - Add one-time products to `stripe.ts` and register function in `config.toml`

4. **Update Pricing Page** - Add one-time products section with purchase buttons

5. **Connect Landing Page** - Update `PricingSection.tsx` with correct prices and links to `/pricing`

6. **Update Header Navigation** - Connect Sign In and Get Started buttons properly

7. **Add Success Route** - Create payment success page and add route

---

## Expected Outcomes

After implementation:
- Users can purchase subscriptions OR one-time add-ons
- Landing page pricing matches actual Stripe products
- All navigation buttons work correctly
- Complete payment flow from landing page to checkout to success
