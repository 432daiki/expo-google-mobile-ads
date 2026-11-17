import { useState } from 'react';
import { Button, Platform, Text, View } from 'react-native';
import { useRewardedInterstitialAd } from '@kazutoyo/expo-google-mobile-ads';

const adUnitId =
  Platform.OS === 'ios'
    ? 'ca-app-pub-3940256099942544/6978759866'
    : 'ca-app-pub-3940256099942544/5354046379';

function AdInstance() {
  const { ad, isLoaded, error } = useRewardedInterstitialAd({ adUnitId });
  const [result, setResult] = useState('');
  return (
    <View style={{ gap: 8 }}>
      <Text>Rewarded interstitial</Text>
      {error && <Text>{error.message}</Text>}
      <Text>
        Watch this ad to earn {ad.reward?.amount} {ad.reward?.type}. You can skip it below.
      </Text>
      <Button
        title="Show ad"
        disabled={!isLoaded}
        onPress={async () => {
          try {
            setResult(JSON.stringify(await ad.show()) ?? 'Dismissed');
          } catch (error) {
            setResult(String(error));
          }
        }}
      />
      <Text>{result}</Text>
    </View>
  );
}

export default function RewardedInterstitialExample() {
  const [key, setKey] = useState(0);
  const [visible, setVisible] = useState(false);
  return (
    <View style={{ gap: 8, padding: 16, backgroundColor: 'white' }}>
      <Button title="Rewarded interstitial: load / skip" onPress={() => setVisible((v) => !v)} />
      <Button
        title="Create a fresh ad"
        onPress={() => {
          setKey((k) => k + 1);
          setVisible(true);
        }}
      />
      {visible && <AdInstance key={key} />}
    </View>
  );
}
