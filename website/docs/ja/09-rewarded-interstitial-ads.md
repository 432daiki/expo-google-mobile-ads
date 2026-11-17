---
title: リワードインタースティシャル広告
---

# リワードインタースティシャル広告

同意を取得し、`initialize()` を呼び出してから広告をロードします。

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

表示前に、報酬の説明と広告をスキップする選択肢を含む案内画面をアプリ側で表示してください。その後に `show()` を呼びます。案内画面自体はライブラリに含まれません。

`ad.reward` は視聴前に提示する報酬です。報酬を獲得した証拠ではありません。`show()` は広告を閉じると獲得した `{ type, amount }`、獲得せず閉じた場合は `null` を返します。報酬付与には Promise の結果か `earnedReward` イベントの片方を使い、二重付与を避けてください。表示後は再利用できません。サーバーサイド検証（SSV）は未対応です。

## API

- `createRewardedInterstitialAd({ adUnitId, requestOptions? })`: preload outside React; call `release()` when finished.
- `useRewardedInterstitialAd(options)`: creates and releases the ad; `requestOptions` is read at creation time.
- `useRewardedInterstitialAdState(ad)`: subscribes without owning or releasing the ad.
- `ad.load()`: retry or reload before presentation.
- `ad.status`, `ad.error`, `ad.responseInfo`: current load state and diagnostics.
- Events: `statusChange`, `impression`, `clicked`, `paid`, `showed`, `dismissed`, `earnedReward`.

[Google integration guide](https://developers.google.com/admob/ios/rewarded-interstitial)
