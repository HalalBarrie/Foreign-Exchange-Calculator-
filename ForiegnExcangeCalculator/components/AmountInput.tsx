import React from 'react';
import { View } from 'react-native';
import { TextInput } from 'react-native-paper';

interface AmountInputProps {
  amount: string;
  onAmountChange: (amount: string) => void;
}

const AmountInput: React.FC<AmountInputProps> = ({ amount, onAmountChange }) => {
  return (
    <View>
      <TextInput
        label="Amount"
        value={amount}
        onChangeText={onAmountChange}
        keyboardType="numeric"
      />
    </View>
  );
};

export default AmountInput;
