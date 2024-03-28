
import React from 'react';
import { Button, StyleSheet, View, ActivityIndicator } from 'react-native';
import { usePlaidLink } from 'react-plaid-link';

interface PlaidLinkButtonProps {
  token: string;
  onSuccess: (public_token: string, metadata: any) => void;
  onExit?: () => void;
}

const PlaidLinkButton: React.FC<PlaidLinkButtonProps> = ({ token }) => {
    console.log('PlaidLinkButton rendering');

  const { open, ready } = usePlaidLink({
    token,
    onSuccess: (public_token, metadata) => {
      console.log('Plaid link success:', public_token, metadata);
      // Handle the successful linking here. E.g., sending the public_token to your server.
    },
    // Add other necessary Plaid link configurations here
  });

  console.log('Plaid link ready:', ready, 'Token:', token);

  if (!ready) {
    return <ActivityIndicator />; // Show loading indicator while Plaid link is getting ready
  }

  return (
    <View style={styles.buttonContainer}>
      <Button onPress={() => open()} title="Connect a bank account" />
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    // Your styling here
  },
});

export default PlaidLinkButton;
