# Pages Tracker

Tracks which pages are fully built vs. still just a title-only stub, waiting on real content/implementation.

## ✅ Completed

| Page | Route | File |
|---|---|---|
| Profile | `/profile` | `src/pages/profile/Profile.tsx` |
| Accessibility Statement | `/accessibility` | `src/pages/legal-policies/Accessibility.tsx` |
| Disclaimer | `/disclaimer` | `src/pages/legal-policies/Disclaimer.tsx` |
| Terms & Conditions | `/terms-conditions` | `src/pages/legal-policies/TermsAndConditions.tsx` |
| Cookie Policy | `/cookie-policy` | `src/pages/legal-policies/CookiePolicy.tsx` |
| Privacy Policy | `/privacy-policy` | `src/pages/legal-policies/PrivacyPolicy.tsx` |

## ⏳ Pending (stub only — title, no real content yet)

### Profile

| Page | Route | File |
|---|---|---|
| Orders | `/profile/orders` | `src/pages/profile/Orders.tsx` |
| Return & Refund | `/profile/orders/return-refund` | `src/pages/profile/OrderReturnRefund.tsx` |
| Track Order | `/profile/orders/track` | `src/pages/profile/OrderTrack.tsx` |
| Addresses | `/profile/addresses` | `src/pages/profile/Addresses.tsx` |
| Wishlist | `/profile/wishlist` | `src/pages/profile/Wishlist.tsx` |
| Reviews | `/profile/reviews` | `src/pages/profile/Reviews.tsx` |
| Refer a Friend | `/profile/refer-a-friend` | `src/pages/profile/ReferAFriend.tsx` |
| Gift Cards | `/profile/gift-cards` | `src/pages/profile/GiftCards.tsx` |
| Notifications | `/profile/notifications` | `src/pages/profile/Notifications.tsx` |

### Company

| Page | Route | File |
|---|---|---|
| About Us | `/about-us` | `src/pages/company/AboutUs.tsx` |
| Partner With Us | `/partner-with-us` | `src/pages/company/PartnerWithUs.tsx` |
| Careers | `/careers` | `src/pages/company/Careers.tsx` |
| Sustainability | `/sustainability` | `src/pages/company/Sustainability.tsx` |
| Ethics | `/ethics` | `src/pages/company/Ethics.tsx` |
| Press / Media | `/press-media` | `src/pages/company/PressMedia.tsx` |

### Services

| Page | Route | File |
|---|---|---|
| Contact Us | `/contact` | `src/pages/services/Contact.tsx` |
| Help Center / FAQ | `/help-center-faq` | `src/pages/services/HelpCenterFAQ.tsx` |
| Shipping Info | `/shipping-info` | `src/pages/services/ShippingInfo.tsx` |

### Misc

| Page | Route | File |
|---|---|---|
| Store Locator | `/store-locator` | `src/pages/misc/StoreLocator.tsx` |
| Become a Seller | `/become-seller` | `src/pages/misc/BecomeSeller.tsx` |
| Awards | `/awards` | `src/pages/misc/Awards.tsx` |

## Known gap (no page or route yet at all)

- **Gift Card / Offers** — `Gift Card` nav item in `NAVBAR_TOP_LAYER_DATA` points to `/offers`, but no route or page exists for it yet.
