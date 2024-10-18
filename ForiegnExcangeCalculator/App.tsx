import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { Provider as PaperProvider, TextInput, Button, Text } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CurrencySelector from './components/CurrencySelector';
import RateInput from './components/RateInput';
import AmountInput from './components/AmountInput';
import LoginScreen from './components/LoginScreen';

const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'CNY'];

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [buyingRate, setBuyingRate] = useState('');
  const [sellingRate, setSellingRate] = useState('');
  const [amount, setAmount] = useState('');
  const [convertedAmount, setConvertedAmount] = useState('');

  useEffect(() => {
    loadRates();
  }, [selectedCurrency]);

  const loadRates = async () => {
    try {
      const storedBuyingRate = await AsyncStorage.getItem(`${selectedCurrency}_buyingRate`);
      const storedSellingRate = await AsyncStorage.getItem(`${selectedCurrency}_sellingRate`);
      if (storedBuyingRate) setBuyingRate(storedBuyingRate);
      if (storedSellingRate) setSellingRate(storedSellingRate);
    } catch (error) {
      console.error('Error loading rates:', error);
    }
  };

  const saveRates = async () => {
    try {
      await AsyncStorage.setItem(`${selectedCurrency}_buyingRate`, buyingRate);
      await AsyncStorage.setItem(`${selectedCurrency}_sellingRate`, sellingRate);
    } catch (error) {
      console.error('Error saving rates:', error);
    }
  };

  const handleConvert = () => {
    if (!amount || !buyingRate || !sellingRate) return;

    const amountNum = parseFloat(amount);
    const buyingRateNum = parseFloat(buyingRate);
    const sellingRateNum = parseFloat(sellingRate);

    if (isNaN(amountNum) || isNaN(buyingRateNum) || isNaN(sellingRateNum)) return;

    // Convert from Leones to Foreign Currency
    const foreignAmount = amountNum / sellingRateNum;
    // Convert from Foreign Currency to Leones
    const leonesAmount = amountNum * buyingRateNum;

    setConvertedAmount(`${foreignAmount.toFixed(2)} ${selectedCurrency} / ${leonesAmount.toFixed(2)} Leones`);
  };

  if (!isLoggedIn) {
    return <LoginScreen onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <PaperProvider>
      <SafeAreaView style={styles.container}>
        <CurrencySelector
          currencies={CURRENCIES}
          selectedCurrency={selectedCurrency}
          onSelectCurrency={setSelectedCurrency}
        />
        <RateInput
          buyingRate={buyingRate}
          sellingRate={sellingRate}
          onBuyingRateChange={setBuyingRate}
          onSellingRateChange={setSellingRate}
          onSaveRates={saveRates}
        />
        <AmountInput amount={amount} onAmountChange={setAmount} />
        <Button mode="contained" onPress={handleConvert} style={styles.button}>
          Convert
        </Button>
        {convertedAmount ? (
          <Text style={styles.result}>{convertedAmount}</Text>
        ) : null}
      </SafeAreaView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  button: {
    marginTop: 16,
  },
  result: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});