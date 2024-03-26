import React, { useEffect, useState, useCallback} from 'react';
import { View, Text, Button, ActivityIndicator, StyleSheet } from 'react-native';
import axios from "axios";
import { usePlaidLink,
  PlaidLinkOnSuccess,} from "react-plaid-link";


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

  useEffect(() => {
    async function fetch() {
      try {
        const response = await axios.post("/create_link_token");
        setLinkToken(response.data.link_token);
        setIsLinkTokenReady(true);
      } catch (error) {
        console.error("Error fetching link token:", error);
        setIsLinkTokenReady(false);
      }
    }
    fetch();
  }, []);


  const onSuccess = useCallback<PlaidLinkOnSuccess>((publicToken, metadata) => {
    // send public_token to your server
    // https://plaid.com/docs/api/tokens/#token-exchange-flow
    console.log(publicToken, metadata);
  }, []);



  const { open, ready, } = usePlaidLink({
    token: linkToken,
    onSuccess,
  });

  if (!isLinkTokenReady || !ready) {
    console.log("DOES LINK TOKEN EXIST???", linkToken);
    console.log("STATE OF THE READY??", ready);
    // This will show an activity indicator until both the link token is fetched and Plaid Link is ready.
    return <ActivityIndicator size="large" />;
  }

  return (
    <View style={styles.container}>
      <Button onPress={() => open()} title="Connect a bank account" disabled={!ready} />
    </View>
  )
}

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
});

export default PlaidLoginScreen;