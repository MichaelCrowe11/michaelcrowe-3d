# App Store Readiness Guide

This guide provides a clear path to publishing michaelcrowe.ai / Crowe Logic as a native iOS app that will pass Apple's review process.

---

## The Challenge: Minimum Functionality (Guideline 4.2)

Apple rejects apps that are "just a website in a wrapper" under minimum functionality rules. Your web app is excellent, but to become an App Store app, you must add **real iOS-native value** that can't be replicated in Safari.

---

## Option 1: Native Shell + Web Stack (Recommended)

Keep your existing Next.js web app for most UI, but add native iOS features that provide clear app-only value.

### What to Make Native

These features transform your web app into a "real" iOS app in Apple's eyes:

1. **Sign in with Apple**
   - Fast, secure authentication
   - Required if you offer any social login
   - Native implementation shows you're committed to iOS platform

2. **Push Notifications**
   - Session reminders ("Your consultation starts in 15 min")
   - Transcript ready notifications
   - Credit balance alerts
   - Follow-up prompts

3. **Native Audio Session**
   - More reliable than Safari's audio
   - Better microphone access and permissions
   - Lower latency for voice conversations
   - Background audio support (conversation continues when screen locks)

4. **Offline Access**
   - View past transcripts without internet
   - Save conversation notes locally
   - Cache agent profiles and pricing info

5. **Native Sharing & Deep Links**
   - Share transcript summaries via iOS share sheet
   - Deep link to specific agents from Safari/Messages
   - Handoff support between devices
   - Shortcuts app integration

### Tech Stack Options

#### A. Capacitor (Fastest Path)

**Pros:**
- Your existing web code runs with minimal changes
- Plugin ecosystem for native features
- TypeScript support
- Active community

**Cons:**
- Slightly less "native feel" than pure native
- May need native modules for complex features

**Timeline:** 2-4 weeks to App Store submission

**Implementation:**
```bash
npm install @capacitor/core @capacitor/cli
npx cap init
npx cap add ios
npx cap sync
```

Then add native plugins:
```bash
npm install @capacitor/push-notifications
npm install @capacitor/share
npm install @capacitor/filesystem
```

#### B. React Native (Better Long-Term)

**Pros:**
- More native feel
- Better performance for complex interactions
- Larger ecosystem
- Skills transfer to Android

**Cons:**
- More initial work to port web UI
- Two codebases to maintain (unless using Expo)
- Learning curve for native modules

**Timeline:** 6-8 weeks to App Store submission

#### C. SwiftUI (Best Quality, Most Work)

**Pros:**
- Truly native iOS experience
- Best performance
- Full access to iOS capabilities
- Apple's recommended approach

**Cons:**
- Complete rewrite required
- Separate Android app needed
- Longer development time
- Need Swift/iOS expertise

**Timeline:** 12-16 weeks to App Store submission

### Recommended: Capacitor

For your use case (voice-first consulting), Capacitor strikes the best balance:
- Reuse your Next.js UI (~90% of code)
- Add native audio session (critical for reliability)
- Implement push notifications (high value, low effort)
- Ship in 2-4 weeks

---

## Option 2: Pure Native App

If voice quality and reliability are critical, consider full native:

### Benefits
- No browser audio edge cases
- Better latency control
- Cleaner permission flows
- Superior user experience

### When to Choose This
- Voice is your primary interface (it is)
- You have iOS development resources
- Long-term platform commitment
- Budget allows for proper native development

---

## Payments: Stripe vs Apple IAP

This is **critical** and complex. Here's the breakdown:

### Can You Use Stripe? (Probably Yes)

Your service appears to be **real-time human consulting** (even though AI-powered), similar to:
- Uber/Lyft (ride services)
- TaskRabbit (services marketplace)
- Calendly (scheduling with payments)

These apps use external payment processors without Apple IAP.

### The Gray Area

Apple might argue your product is "digital content consumed in-app" rather than a real-world service. This could trigger requirement for IAP under Guideline 3.1.1.

### Safe Approach

1. **Position as consulting service**: Emphasize the human expertise (your knowledge) delivered via AI
2. **Keep checkout clean**: Don't be aggressive about "pay on the web to avoid Apple fees"
3. **Document the service nature**: In app review notes, explain this is professional consulting delivery
4. **Consider hybrid**: Use IAP for credit packs, Stripe for subscriptions (if needed)
5. **Monitor policy**: U.S. storefront has had shifts around external links (3.1.3) - stay current

### Stripe Integration (If Allowed)

If you continue using Stripe:
```swift
// Deep link to web checkout
let checkoutURL = URL(string: "https://michaelcrowe.ai/checkout?session=...")
UIApplication.shared.open(checkoutURL)
```

Or use Stripe's native iOS SDK for in-app browser:
```swift
import StripePaymentSheet

let paymentSheet = PaymentSheet(...)
paymentSheet.present(from: viewController)
```

### IAP Integration (If Required)

If Apple requires IAP:
```swift
import StoreKit

// Define products
let productIDs = ["com.crowelogic.minutes.60", "com.crowelogic.minutes.300"]

// Purchase flow
func purchase(productID: String) {
    // StoreKit 2 implementation
    Task {
        let result = try await Product.products(for: [productID])
        // Handle purchase
    }
}
```

**Note:** IAP takes 30% commission but provides seamless checkout experience.

---

## App Store Submission Checklist

### 1. Apple Developer Program Enrollment
- [ ] Create/join Apple Developer Program ($99/year)
- [ ] Complete organization details
- [ ] Verify banking/tax information (for IAP if used)

### 2. Create App in App Store Connect
- [ ] Create new app record
- [ ] Choose bundle ID: `com.crowelogic.app` or similar
- [ ] Enable capabilities:
  - Push Notifications
  - Sign in with Apple
  - Background Modes (if needed)
  - Network Extensions (for VPN-like features, if needed)

### 3. Implement Permissions & Privacy
- [ ] **Microphone Usage**: Required for voice conversations
  ```xml
  <key>NSMicrophoneUsageDescription</key>
  <string>Voice conversations with AI consultants require microphone access for real-time consultation.</string>
  ```
- [ ] **Camera Usage** (if adding video): 
  ```xml
  <key>NSCameraUsageDescription</key>
  <string>Video consultations require camera access.</string>
  ```
- [ ] **Speech Recognition** (if using on-device):
  ```xml
  <key>NSSpeechRecognitionUsageDescription</key>
  <string>We use speech recognition to improve conversation quality.</string>
  ```

- [ ] **Privacy Policy**: Must be publicly accessible URL
  - Required sections:
    - What data you collect (voice recordings, transcripts, payment info)
    - How you use it (service delivery, improvement)
    - Third parties (Stripe, ElevenLabs, Claude, etc.)
    - User rights (access, deletion)
    - Contact information

- [ ] **Data Handling Declaration**: In App Store Connect
  - Declare what data types you collect
  - Specify if data is linked to user identity
  - Indicate if used for tracking
  - List third-party SDKs

- [ ] **Account Deletion**: Required if you have accounts
  - In-app deletion flow, or
  - Link to web-based deletion
  - Must be easy to find

### 4. Build & TestFlight Beta
- [ ] Archive app in Xcode
- [ ] Upload to App Store Connect
- [ ] Create TestFlight internal test group
- [ ] Invite testers (up to 100 internal)
- [ ] Test critical flows:
  - Sign in
  - Start voice conversation
  - Purchase credits
  - View transcript
  - Delete account

### 5. Prepare App Store Assets

#### Screenshots Required
- **6.7" display** (iPhone 14 Pro Max, 15 Pro Max): 1290 x 2796 pixels
- **6.5" display** (iPhone 11 Pro Max, XS Max): 1242 x 2688 pixels  
- **5.5" display** (iPhone 8 Plus): 1242 x 2208 pixels (if supporting older devices)

Minimum: 3 screenshots per size  
Maximum: 10 screenshots per size  
First 3 are shown in search results - make them count!

#### App Preview Video (Optional but Recommended)
- 15-30 seconds
- Show core value prop: voice consultation
- No music with lyrics (copyright issues)
- Same sizes as screenshots

#### App Icon
- 1024 x 1024 pixels
- No transparency
- No rounded corners (Apple adds them)

#### Keywords
- 100 character limit (including commas)
- Suggested: "AI,consulting,voice,drug discovery,chemistry,mycology,cultivation,expert,advisor,computational"
- Test with App Store Optimization (ASO) tools

#### Category
- **Primary**: Business or Productivity
- **Secondary**: Education or Medical (if applicable)

#### Age Rating
- 4+ (if content is appropriate)
- Medical/Treatment Information: Check if discussing health topics
- Unrestricted Web Access: Check if includes browser component

### 6. Submit with Review Notes

**Critical:** Use "App Review Information" section to explain your app:

```
Crowe Logic - Voice AI Consulting Platform

APP TYPE: Professional consulting services delivery platform

WHAT'S NATIVE:
• Sign in with Apple integration
• Native audio session for high-quality voice conversations
• Push notifications for session reminders and transcript delivery
• Offline access to past consultation transcripts
• Native share sheet for transcript summaries
• Deep linking for direct agent access

WHY IT'S NOT A MARKETING APP:
This is a functional consulting platform where users have real-time voice conversations 
with AI agents trained on domain expertise (drug discovery, computational chemistry, 
mushroom cultivation). Users pay per-minute for consultation services, receive transcripts, 
and can reference conversations offline. This is not a brochure or marketing site.

SERVICE EXPLANATION:
Users purchase consulting time (measured in minutes) to access specialized AI agents 
for professional guidance. This is similar to legal/medical consultation apps but for 
scientific and technical domains.

DEMO ACCOUNT:
Email: [provide test account]
Password: [provide password]
Note: Test account has 60 minutes of free credit to fully experience the app.

PAYMENT APPROACH:
We process payments via Stripe for professional consulting services (similar to 
service marketplaces like TaskRabbit or consultation platforms). This is for a 
real-world professional service, not digital content.
```

### 7. Common Rejection Reasons & How to Avoid

#### 4.2 Minimum Functionality
**Issue:** App is just a website wrapper  
**Solution:** Clearly document native features in review notes

#### 2.1 App Completeness
**Issue:** App crashes, broken features  
**Solution:** Thorough TestFlight testing before submission

#### 3.1.1 In-App Purchase
**Issue:** Using external payment processor for digital content  
**Solution:** Position as service, not content; document in review notes

#### 5.1.1 Privacy
**Issue:** Missing privacy policy or data usage declarations  
**Solution:** Complete all privacy disclosures before submitting

#### 4.3 Spam
**Issue:** Generic app, not unique enough  
**Solution:** Emphasize specialized domain expertise, unique value

---

## Implementation Roadmap

### Phase 1: Native Foundation (Week 1-2)
- [ ] Set up Capacitor (or chosen tech stack)
- [ ] Implement Sign in with Apple
- [ ] Configure push notifications
- [ ] Set up native audio session
- [ ] Test on physical devices

### Phase 2: Core Features (Week 3-4)
- [ ] Implement offline transcript storage
- [ ] Add native share sheet integration
- [ ] Create deep linking scheme
- [ ] Implement account deletion flow
- [ ] Add push notification handlers

### Phase 3: Polish & Assets (Week 5-6)
- [ ] Create App Store screenshots (use design-prompts.md)
- [ ] Generate app icon
- [ ] Record app preview video
- [ ] Write app description
- [ ] Implement privacy policy
- [ ] Create support website

### Phase 4: Testing & Submission (Week 7-8)
- [ ] Internal TestFlight testing
- [ ] Fix bugs from testing
- [ ] Complete App Store Connect setup
- [ ] Submit for review
- [ ] Respond to review feedback (if needed)

---

## Post-Launch Checklist

- [ ] Monitor crash reports in App Store Connect
- [ ] Track conversion funnel (installs → sign-ups → purchases)
- [ ] Collect user reviews and respond promptly
- [ ] Iterate on onboarding based on analytics
- [ ] Plan feature updates (App Store prefers active development)
- [ ] Consider Android version (if successful on iOS)

---

## Resources

### Official Documentation
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [App Store Connect Help](https://developer.apple.com/help/app-store-connect/)

### Tech Stack Documentation
- [Capacitor Documentation](https://capacitorjs.com/docs)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [SwiftUI Documentation](https://developer.apple.com/documentation/swiftui/)

### Payment Guidelines
- [In-App Purchase Guidelines](https://developer.apple.com/app-store/review/guidelines/#in-app-purchase)
- [Stripe iOS SDK](https://stripe.com/docs/mobile/ios)

### Community Resources
- [App Review Subreddit](https://reddit.com/r/iOSProgramming)
- [iOS Dev Weekly](https://iosdevweekly.com/)
- [Apple Developer Forums](https://developer.apple.com/forums/)

---

## Version History

- **v1.0** (2026-01-12): Initial App Store readiness guide created
