import React, { useEffect, useState, useCallback} from 'react';
import { View, Text, Button, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import axios from "axios";
import PlaidLinkButton from './PlaidLinkButton';



axios.defaults.baseURL ="http://10.0.2.2:8080"

interface PlaidAuthProps {
  publicToken: string; // Specify the type of publicToken as string
}



function PlaidAuth({publicToken}: PlaidAuthProps) {
  const [account, setAccount] = useState();

  useEffect(() => {
    async function fetchData() {
      let accessToken = await axios.post("/exchange_public_token", {public_token: publicToken});
      console.log("accessToken", accessToken.data);
      const auth = await axios.post("/auth", {access_token: accessToken.data.accessToken});
      console.log("auth data ", auth.data);
      setAccount(auth.data.numbers.ach[0]);
    }
    fetchData();
  }, []);
  return account && (
      <>
      </>
  );
}


function PlaidLoginScreen() {

  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [isLinkTokenReady, setIsLinkTokenReady] = useState(false);
  const [publicToken, setPublicToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function fetch() {
      try {
        const response = await axios.post("/create_link_token");
        setLinkToken(response.data.link_token);
        setIsLinkTokenReady(true);
        console.log('Link token fetched:', response.data.link_token);
      } catch (error) {
        console.error("Error fetching link token:", error);
        setIsLinkTokenReady(false);
      }
    }
    fetch();
  }, []);

  return (
    <View style={styles.container}>
      {publicToken ? (
        // Step 3: Once we have the publicToken, show the PlaidAuth component
        <PlaidAuth publicToken={publicToken} />
      ) : linkToken && isLinkTokenReady ? (
        // Step 2: Link token is ready, show PlaidLinkButton
        <PlaidLinkButton token={linkToken} onExit={() => setReady(false)} onSuccess={(token:string) => setPublicToken(token)} />
      ) : (
        // Step 1: Waiting for the linkToken to be ready, show a loading button or indicator
        <ActivityIndicator size="large" color="#0000ff" /> // Or a disabled Button with "Loading..."
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  app: {
    padding: 20,
    backgroundColor: '#f4f4f9',
    flex: 1,
  },
  header: {
    backgroundColor: '#6200ee',
    padding: 20,
    borderRadius: 8,
  },
  title: {
    color: '#ffffff',
  },
  infoSection: {
    marginTop: 20, // Ensure there's space between this text and the header
    textAlign: 'left',
    lineHeight: 24, // Adjusted for readability
  },
  buttonContainer: {
    // Additional styles for the button container if needed
    marginTop: 20, // Ensure there's space above the button
    flex: 0, // This makes the container not grow to fill, adjusting only based on its content
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
  button: {
    backgroundColor: 'blue', // Example style
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white', // Example style
    textAlign: 'center',
  },
  buttonDisabled: {
    backgroundColor: 'grey', // Example style for disabled state
    padding: 10,
    borderRadius: 5,
  },
});

export default PlaidLoginScreen;