export { createBannerAd } from './BannerAd';
export type { BannerAd, BannerAdOptions, BannerAdEvents } from './BannerAd';

export { BannerAdView } from './BannerAdView';
export type { BannerAdViewProps } from './BannerAdView';

export { BannerAdSize } from './BannerAdSize';
export type {
  AdaptiveOptions,
  BannerAdAdaptiveKind,
  BannerAdSizeSpec,
  InlineAdaptiveOptions,
} from './BannerAdSize';

export { initialize, setRequestConfiguration } from './initialization';

export { useBannerAd, useBannerAdState } from './hooks/useBannerAd';
export type { BannerAdState } from './hooks/useBannerAd';
export { useBannerAdSize } from './hooks/useBannerAdSize';

export { createInterstitialAd } from './InterstitialAd';
export type { InterstitialAd, FullScreenAdEvents } from './InterstitialAd';

export { createRewardedAd } from './RewardedAd';
export type { RewardedAd, RewardedAdEvents } from './RewardedAd';

export { ShowAdError } from './FullScreenAd';
export type { FullScreenAdOptions } from './FullScreenAd';

export { useInterstitialAd, useInterstitialAdState } from './hooks/useInterstitialAd';
export type { FullScreenAdState } from './hooks/useInterstitialAd';
export { useRewardedAd, useRewardedAdState } from './hooks/useRewardedAd';

export {
  ConsentError,
  gatherConsent,
  getConsentInfo,
  requestConsentInfoUpdate,
  resetConsent,
  showConsentFormIfRequired,
  showPrivacyOptionsForm,
} from './consent';

export { useConsentInfo } from './hooks/useConsentInfo';

export type {
  AdError,
  AdReward,
  AdapterResponse,
  BannerAdStatus,
  ConsentErrorCode,
  ConsentInfo,
  ConsentRequestOptions,
  ConsentStatus,
  DebugGeography,
  FullScreenAdStatus,
  InitializationStatus,
  PaidEventValue,
  PrivacyOptionsRequirementStatus,
  RequestConfiguration,
  RequestOptions,
  ResponseInfo,
  ShowAdErrorCode,
} from './types';

export { createSwipeableInterstitialAd } from './SwipeableInterstitialAd';
export type {
  SwipeableInterstitialAd,
  SwipeableInterstitialAdOptions,
  SwipeableInterstitialAdEvents,
} from './SwipeableInterstitialAd';
export { SwipeableInterstitialAdView } from './SwipeableInterstitialAdView';
export type { SwipeableInterstitialAdViewProps } from './SwipeableInterstitialAdView';
export {
  useSwipeableInterstitialAd,
  useSwipeableInterstitialAdState,
} from './hooks/useSwipeableInterstitialAd';
export type { SwipeableInterstitialAdState } from './hooks/useSwipeableInterstitialAd';

export { createAppOpenAd } from './AppOpenAd';
export type { AppOpenAd } from './AppOpenAd';
export { useAppOpenAd, useAppOpenAdState } from './hooks/useAppOpenAd';
