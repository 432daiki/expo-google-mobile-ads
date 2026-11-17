import ExpoModulesCore
import GoogleMobileAds
import UIKit

final class FullScreenAppOpenAd: FullScreenAd {
  private var expiryTask: DispatchWorkItem?
  private var ad: AppOpenAd?
  private let expiryLock = NSLock()
  private var loadedAt: TimeInterval?
  var appOpenStatus: String {
    let current = status
    expiryLock.lock()
    let timestamp = loadedAt
    expiryLock.unlock()
    if current == "loaded", let timestamp, ProcessInfo.processInfo.systemUptime - timestamp >= 4 * 60 * 60 {
      return "error"
    }
    return current
  }

  override func loadAd(request: Request, loadId: Int) {
    AppOpenAd.load(with: adUnitId, request: request) { [weak self] ad, error in
      DispatchQueue.main.async {
        self?.handleLoadCompletion(ad: ad, error: error, loadId: loadId)
      }
    }
  }

  private func handleLoadCompletion(ad: AppOpenAd?, error: Error?, loadId: Int) {
    if let error {
      handleLoadFailed(error, loadId: loadId)
      return
    }
    guard let ad else {
      handleLoadFailed(missingAdError(), loadId: loadId)
      return
    }
    if isStaleLoadResult(loadId) || shouldDiscardLoadResult {
      return
    }
    tearDownAd()
    ad.fullScreenContentDelegate = delegateProxy
    ad.paidEventHandler = { [weak self] value in
      self?.emitPaid(value)
    }
    self.ad = ad
    expiryLock.lock()
    loadedAt = ProcessInfo.processInfo.systemUptime
    expiryLock.unlock()
    handleLoaded(responseInfo: ad.responseInfo)
    let expiry = DispatchWorkItem { [weak self] in self?.expireLoadedAd(loadId: loadId) }
    expiryTask = expiry
    DispatchQueue.main.asyncAfter(deadline: .now() + 4 * 60 * 60, execute: expiry)
  }

  @MainActor
  override func presentAd(from viewController: UIViewController) -> Bool {
    guard appOpenStatus == "loaded", let ad else { return false }
    ad.present(from: viewController)
    return true
  }

  override func tearDownAd() {
    expiryTask?.cancel()
    expiryTask = nil
    ad?.fullScreenContentDelegate = nil
    ad?.paidEventHandler = nil
    ad = nil
  }
}
