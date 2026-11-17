---
title: Rewarded interstitial ads
---

# Rewarded interstitial ads

Gather consent and call `initialize()` before loading ads.

```tsx
import { Platform } from 'react-native';
import { useRewardedInterstitialAd } from '@kazutoyo/expo-google-mobile-ads';

const adUnitId = Platform.select({
  android: 'ca-app-pub-3940256099942544/5354046379',
  ios: 'ca-app-pub-3940256099942544/6978759866',
})!;

const { ad, isLoaded, error } = useRewardedInterstitialAd({ adUnitId });
// Call from your app's chosen placement, only when ready.
if (isLoaded) {
  const reward = await ad.show();
  if (reward) grantReward(reward);
}
```

Before showing, your app must display an introduction that explains the reward and lets the user skip the ad. Call `show()` only after that screen. The library does not provide the introduction UI.

`ad.reward` describes the offered reward before presentation. It is not evidence that the reward was earned. `show()` resolves on dismissal with the earned `{ type, amount }`, or `null` when dismissed without earning. Grant the reward using either the resolved result or the `earnedReward` event, never both. The ad is single-use; create a new one after presentation. Server-side verification (SSV) is not yet exposed.

## API

- `createRewardedInterstitialAd({ adUnitId, requestOptions? })`: preload outside React; call `release()` when finished.
- `useRewardedInterstitialAd(options)`: creates and releases the ad; `requestOptions` is read at creation time.
- `useRewardedInterstitialAdState(ad)`: subscribes without owning or releasing the ad.
- `ad.load()`: retry or reload before presentation.
- `ad.status`, `ad.error`, `ad.responseInfo`: current load state and diagnostics.
- Events: `statusChange`, `impression`, `clicked`, `paid`, `showed`, `dismissed`, `earnedReward`.

[Google integration guide](https://developers.google.com/admob/ios/rewarded-interstitial)
