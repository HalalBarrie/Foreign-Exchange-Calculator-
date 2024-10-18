import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button } from 'react-native-paper';

interface RateInputProps {
  buyingRate: string;
  sellingRate: string;
  onBuyingRateChange: (rate: string) => void;
  onSellingRateChange: (rate: string) => void;
  onSaveRates: () => void;
}

const RateInput: React.FC<RateInputProps> = ({
  buyingRate,
  sellingRate,
  onBuyingRateChange,
  onSellingRateChange,
  onSaveRates,
}) => {
  return (
    <View style={styles.container}>
      <TextInput
        label="Buying Rate"
        value={buyingRate}
        onChangeText={onBuyingRateChange}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        label="Selling Rate"
        value={sellingRate}
        onChangeText={onSellingRateChange}
        keyboardType="numeric"
        style={styles.input}
      />
      <Button mode="outlined" onPress={onSaveRates} style={styles.button}>
        Save Rates
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  input: {
    marginBottom: 8,
  },
  button: {
    marginTop: 8,
  },
});

export default RateInput;