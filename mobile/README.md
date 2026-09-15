# Rutland County Pool League — mobile app

A thin native wrapper (iOS + Android) around the website at
https://rutlandcountypoolleague.com — the whole app is one WebView
pointed at the live site, plus:

- A branded loading spinner and splash screen
- Pull-to-refresh
- Android hardware back button steps back through the site's history
- An offline/error screen with a retry button
- Links to anything off-site (WhatsApp, maps, etc.) open in the OS
  browser/app instead of inside the WebView

There's no separate app backend — it always shows whatever is live on the
website, so publishing an update to the site doesn't require an app update.

## Local development

```bash
cd mobile
npm install
npx expo start
```

Scan the QR code with the Expo Go app (iOS/Android) to preview it on a
real device without building anything.

## Building an installable app (EAS)

This project is already linked to the `duncans/rutland` Expo project
(see `app.json` → `extra.eas.projectId`).

```bash
npx eas-cli build --platform android --profile preview   # installable .apk, no store account needed
npx eas-cli build --platform ios --profile preview        # needs an Apple Developer account
```

- **Android preview builds** produce a plain `.apk` you can install directly
  on any Android phone (Settings → allow installs from this source) — no
  Google Play account required for testing.
- **iOS builds** always require an active **Apple Developer Program**
  membership ($99/year) to sign the app, even just to test it on a real
  iPhone via TestFlight — there's no way around this on Apple's side.

## Publishing to the app stores

- **Google Play**: one-time $25 registration for a Play Console account,
  then `npx eas-cli submit --platform android`.
- **Apple App Store**: $99/year Developer Program membership, then
  `npx eas-cli submit --platform ios`.

Both of those account/payment steps have to be done by whoever owns (or
will own) the league's Apple ID / Google account — they're not something
that can be set up on someone else's behalf.
