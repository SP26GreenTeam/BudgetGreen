import React, { useEffect, useState, useCallback} from 'react';
import { View, Platform, NativeModules, ActivityIndicator, StyleSheet, Text, NativeEventEmitter, TouchableOpacity } from 'react-native';
import axios from "axios";
import { LinkTokenConfiguration, LinkOpenProps, LinkSuccess, LinkExit, LinkIOSPresentationStyle, LinkLogLevel, LinkError, LinkEventListener } from 'react-native-plaid-link-sdk';
import PlaidLinkButton from './PlaidLinkButton';
import { usePlaidData } from './PlaidDataProvider';
import {Account, PlaidResponse, AccountBalance } from '../types/interfaces';

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

function createLinkOpenProps(setPublicToken: (token: string) => void): LinkOpenProps {
  return {
    onSuccess: (success: LinkSuccess) => {
      console.log('Success: ', success);
      setPublicToken(success.publicToken); // Use the actual property that holds the public token
    },
    onExit: (linkExit: LinkExit) => {
      console.log('Exit: ', linkExit);
      dismissLink();
    },
    iOSPresentationStyle: LinkIOSPresentationStyle.MODAL,
    logLevel: LinkLogLevel.ERROR,
  };
}

/*
const createUser = async () => {
  try {
      const response = await axios.post('/user/create', { client_user_id: 'custom_reese1' });
      console.log('User Created:', response.data);
      // Store the user_token and user_id as needed
      const { user_token, user_id } = response.data;
      
      // Example: Storing in local state or sending to another function/component
      // setState({ userToken: user_token, userId: user_id });

      return { user_token, user_id }; // Returning the tokens for further use
  } catch (error) {
      console.error('Failed to create user:', error);
      throw error; // Rethrow or handle error as needed
  }
};
*/

export const useFetchPlaidData = (publicToken: string | null,
  userToken: string | null,
  setUserToken: React.Dispatch<React.SetStateAction<string | null>>) => {

  console.log('useFetchPlaidData called with publicToken:', publicToken);
  const { setData } = usePlaidData();

  useEffect(() => {
    async function fetchData() {
      if (publicToken == null) return;
      try {
     
        const accessTokenResponse = await axios.post("/item/public_token/exchange", { public_token: publicToken });
        const { accessToken } = accessTokenResponse.data;
        console.log("access token", accessToken);

        const balanceInfoResponse = await axios.post("/accounts/balance/get", { accessToken: accessToken });
        console.log(balanceInfoResponse.data);
        const accounts = balanceInfoResponse.data; // Directly accessing the data since it's the array

        // Now, filter for "checking" subtype accounts and sum their current balances
        let totalCurrentBalance = accounts
          .filter((account: Account) => account.subtype === 'checking') 
          .reduce((sum: number, account: Account) => sum + account.balances.current, 0); 

          const bankIncomeResponse = await axios.post("/get_bank_income", { accessToken: accessToken });
          const bankIncomeData = bankIncomeResponse.data.bank_income[0]; // Adjust based on your actual data structure

          const latestIncomeSummary = bankIncomeData.items[0].bank_income_sources[0].historical_summary.slice(-1)[0];
          const monthlyIncomeAmount = latestIncomeSummary.total_amount;
          console.log("Monthly Income Amount:", monthlyIncomeAmount);

        /*
        const transactionsResponse = await axios.post("/transactions/get", {
          accessToken: accessToken,
          start_date: "2024-01-01",
          end_date: "2024-02-01"
        });      

        if (transactionsResponse.status === 202) {
            console.log("too early on the call.")
         } else {
          // Handle the successful response
         console.log(transactionsResponse.data);
         }
         */
       
        /*
        const transactions = transactionsResponse.data.transactions || [];
        
        console.log(transactionsResponse.data);
        */
      

        console.log({ balance: totalCurrentBalance, bankIncomeData });

        setData({
          balance: totalCurrentBalance,
          BankIncome: monthlyIncomeAmount,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        // Handle the error state appropriately
      }
    }

    fetchData();
  }, [publicToken, setData, userToken, setUserToken]);
};

function PlaidLoginScreen() {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [publicToken, setPublicToken] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLinkToken() {
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
    fetchLinkToken();
  }, []);

  const openProps = createLinkOpenProps(setPublicToken);

  useFetchPlaidData(publicToken, userToken, setUserToken);

  return (
    <View style={styles.container}>
      {publicToken ? (
        <Text>Bank account linked successfully!</Text>
      ) : linkToken ? (
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={() => open(openProps)} style={styles.button}>
         <Text style={styles.buttonText}>Connect to Plaid</Text>
         </TouchableOpacity>
  </View>
      ) : (
        <ActivityIndicator size="large" color="#0000ff" />
      )}
    </View>
  );
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
  button: {
    backgroundColor: '#4CAF50', // A more vibrant color
    paddingVertical: 15, // Make the button taller
    paddingHorizontal: 20, // Button wider
    borderRadius: 25, // Rounded corners
    shadowColor: '#000', // Shadow for more depth
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: 'white', // Ensure text is easily readable
    fontWeight: 'bold', // Make text bold
    fontSize: 18, // Larger text
    textAlign: 'center',
  },
  buttonDisabled: {
    backgroundColor: 'grey', // Example style for disabled state
    padding: 10,
    borderRadius: 5,
  },
});

export default PlaidLoginScreen;