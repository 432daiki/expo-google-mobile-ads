package expo.modules.googlemobileads

import android.app.Activity
import com.google.android.libraries.ads.mobile.sdk.common.AdLoadCallback
import com.google.android.libraries.ads.mobile.sdk.common.AdRequest
import com.google.android.libraries.ads.mobile.sdk.common.AdValue
import com.google.android.libraries.ads.mobile.sdk.common.FullScreenContentError
import com.google.android.libraries.ads.mobile.sdk.common.LoadAdError
import com.google.android.libraries.ads.mobile.sdk.appopen.AppOpenAdEventCallback
import expo.modules.kotlin.AppContext
import com.google.android.libraries.ads.mobile.sdk.appopen.AppOpenAd as GmaAppOpenAd

class AppOpenAd(
  appContext: AppContext,
  adUnitId: String,
  requestOptions: Map<String, Any?>?
) : FullScreenAd(appContext, adUnitId, requestOptions) {

  private val expiryHandler = android.os.Handler(android.os.Looper.getMainLooper())
  private var expiryTask: Runnable? = null
  @Volatile
  private var ad: GmaAppOpenAd? = null
  @Volatile private var loadedAt = 0L
  val appOpenStatus: String get() {
    val current = status
    return if (current == "loaded" && android.os.SystemClock.elapsedRealtime() - loadedAt >= 4 * 60 * 60 * 1000L) "error" else current
  }

  override fun loadAd(request: AdRequest, loadId: Long) {
    GmaAppOpenAd.load(
      request,
      object : AdLoadCallback<GmaAppOpenAd> {
        override fun onAdLoaded(ad: GmaAppOpenAd) {
          postToMain { onAdReady(ad, loadId) }
        }

        override fun onAdFailedToLoad(adError: LoadAdError) {
          postToMain { handleLoadFailed(adError, loadId) }
        }
      }
    )
  }

  private fun onAdReady(loaded: GmaAppOpenAd, loadId: Long) {
    if (isStaleLoadResult(loadId) || shouldDiscardLoadResult) {
      loaded.destroy()
      return
    }
    tearDownAd()
    loaded.adEventCallback = object : AppOpenAdEventCallback {
      override fun onAdShowedFullScreenContent() = handleShowed()

      override fun onAdDismissedFullScreenContent() = handleDismissed()

      override fun onAdFailedToShowFullScreenContent(fullScreenContentError: FullScreenContentError) =
        handleFailedToShow(fullScreenContentError)

      override fun onAdImpression() = handleImpression()

      override fun onAdClicked() = handleClicked()

      override fun onAdPaid(value: AdValue) = handlePaid(value)

    }
    ad = loaded
    loadedAt = android.os.SystemClock.elapsedRealtime()
    handleLoaded(loaded.getResponseInfo())
    val owner = java.lang.ref.WeakReference(this)
    val expiry = Runnable { owner.get()?.expireLoadedAd(loadId) }
    expiryTask = expiry
    expiryHandler.postDelayed(expiry, 4 * 60 * 60 * 1000L)
  }

  override fun presentAd(activity: Activity): Boolean {
    if (appOpenStatus != "loaded") return false
    val current = ad ?: return false
    current.show(activity)
    return true
  }

  override fun tearDownAd() {
    expiryTask?.let { expiryHandler.removeCallbacks(it) }
    expiryTask = null
    ad?.let {
      it.adEventCallback = null
      it.destroy()
    }
    ad = null
  }
}
