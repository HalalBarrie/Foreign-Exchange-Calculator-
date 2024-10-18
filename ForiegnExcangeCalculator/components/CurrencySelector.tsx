import React from 'react';
import { View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

interface CurrencySelectorProps {
  currencies: string[];
  selectedCurrency: string;
  onSelectCurrency: (currency: string) => void;
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  currencies,
  selectedCurrency,
  onSelectCurrency,
}) => {
  return (
    <View>
      <Dropdown
        data={currencies.map(currency => ({ label: currency, value: currency }))}
        labelField="label"
        valueField="value"
        value={selectedCurrency}
        onChange={item => onSelectCurrency(item.value)}
        placeholder="Select Currency"
      />
    </View>
  );
};

export default CurrencySelector;