import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { Provider as PaperProvider, TextInput, Button, Text, DefaultTheme } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CurrencySelector from './components/CurrencySelector';
import RateInput from './components/RateInput';
import AmountInput from './components/AmountInput';
import LoginScreen from './components/LoginScreen';

const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'CNY'];

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#4a90e2',
    accent: '#f1c40f',
  },
};

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
    <PaperProvider theme={theme}>
      <SafeAreaView style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Currency Converter</Text>
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
            <View style={styles.resultContainer}>
              <Text style={styles.resultLabel}>Converted Amount:</Text>
              <Text style={styles.result}>{convertedAmount}</Text>
            </View>
          ) : null}
        </View>
      </SafeAreaView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f4f8',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  button: {
    marginTop: 16,
    paddingVertical: 8,
  },
  resultContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  resultLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  result: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4a90e2',
    textAlign: 'center',
  },
});
