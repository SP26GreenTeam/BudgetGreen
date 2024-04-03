import React, { useEffect, useState, useCallback} from 'react';
import { View, Platform, NativeModules, ActivityIndicator, StyleSheet, Text, NativeEventEmitter } from 'react-native';
import axios from "axios";
import { LinkTokenConfiguration, LinkOpenProps, LinkSuccess, LinkExit, LinkIOSPresentationStyle, LinkLogLevel, LinkError, LinkEventListener } from 'react-native-plaid-link-sdk';
import PlaidLinkButton from './PlaidLinkButton';


axios.defaults.baseURL ="http://10.0.2.2:8080"

interface PlaidAuthProps {
  publicToken: string; // Specify the type of publicToken as string
}


export const usePlaidEmitter = (LinkEventListener: LinkEventListener) => {
  useEffect(() => {
    const emitter = new NativeEventEmitter(
      Platform.OS === 'ios'
        ? NativeModules.RNLinksdk
        : NativeModules.PlaidAndroid,
    );
    const listener = emitter.addListener('onEvent', LinkEventListener);
    // Clean up after this effect:
    return function cleanup() {
      listener.remove();
    };
  }, []);
};

export const create = (props: LinkTokenConfiguration) => {
  let token = props.token;
  let noLoadingState = props.noLoadingState ?? false;

  if (Platform.OS === 'android') {
    NativeModules.PlaidAndroid.create(
      token,
      noLoadingState,
      props.logLevel ?? LinkLogLevel.ERROR,
    );
  } else {
    NativeModules.RNLinksdk.create(token, noLoadingState);
  }
};


export const open = async (props: LinkOpenProps) => {
  if (Platform.OS === 'android') {
    NativeModules.PlaidAndroid.open(
      (result: LinkSuccess) => {
        if (props.onSuccess != null) {
          props.onSuccess(result);
        }
      },
      (result: LinkExit) => {
        if (props.onExit != null) {
          if (result.error != null && result.error.displayMessage != null) {
            //TODO(RNSDK-118): Remove errorDisplayMessage field in next major update.
            result.error.errorDisplayMessage = result.error.displayMessage;
          }
          props.onExit(result);
        }
      },
    );
  } else {
    let presentFullScreen =
      props.iOSPresentationStyle == LinkIOSPresentationStyle.FULL_SCREEN;

    NativeModules.RNLinksdk.open(
      presentFullScreen,
      (result: LinkSuccess) => {
        if (props.onSuccess != null) {
          props.onSuccess(result);
        }
      },
      (error: LinkError, result: LinkExit) => {
        if (props.onExit != null) {
          if (error) {
            var data = result || {};
            data.error = error;
            props.onExit(data);
          } else {
            props.onExit(result);
          }
        }
      },
    );
  }
};

export const dismissLink = () => {
  if (Platform.OS === 'ios') {
    NativeModules.RNLinksdk.dismiss();
  }
};

function createLinkTokenConfiguration(
  token: string,
  noLoadingState: boolean = false,
): LinkTokenConfiguration {
  return {
    token: token,
    // Hides native activity indicator if true.
    noLoadingState: noLoadingState,
  };
}

function createLinkOpenProps(): LinkOpenProps {
  return {
    onSuccess: (success: LinkSuccess) => {
      // User was able to successfully link their account.
      console.log('Success: ', success);
    },
    onExit: (linkExit: LinkExit) => {
      // User exited Link session. There may or may not be an error depending on what occured.
      console.log('Exit: ', linkExit);
      dismissLink();
    },
    // MODAL or FULL_SCREEEN presentation on iOS. Defaults to MODAL.
    iOSPresentationStyle: LinkIOSPresentationStyle.MODAL,
    logLevel: LinkLogLevel.ERROR,
  };
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
  const [publicToken, setPublicToken] = useState<string | null>(null);

  useEffect(() => {
    async function fetch() {
      try {
        const response = await axios.post("/create_link_token");
        if (response.data.link_token) {
          setLinkToken(response.data.link_token);         
          const tokenConfiguration = createLinkTokenConfiguration(response.data.link_token);
          create(tokenConfiguration);
        } else {
          console.error("Invalid link token received:", response.data);
        }
      } catch (error) {
        console.error("Error fetching link token:", error);
      }
    }
    fetch();
  }, []);

  const openProps = createLinkOpenProps();

  return (
    <View style={styles.container}>
      {publicToken ? (
        // Display your component or UI for after successful link
        <Text>Bank account linked successfully!</Text>
      ) : linkToken ? (
        <PlaidLinkButton
          onPress={() => open(openProps)}
        />
      ) : (
        <ActivityIndicator size="large" color="#0000ff" />
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