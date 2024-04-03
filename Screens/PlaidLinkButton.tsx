
import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

interface PlaidLinkButtonProps {
  onPress: () => void; // Add other props as needed
}

const PlaidLinkButton: React.FC<PlaidLinkButtonProps> = ({ onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <Text>Connect to Plaid</Text>
  </TouchableOpacity>
);


export default PlaidLinkButton;
