<<<<<<< HEAD
import React from 'react';
=======
import React, { useState, useCallback, useEffect } from 'react';
>>>>>>> 0e0549a (Plaid Login Screen and Local server to get the keys for the API. Plaid login is still not fully functional but the screen does not break anything)
import { View, Text, StyleSheet, Button } from 'react-native';
import type {PropsWithChildren} from 'react';
import RNPickerSelect from 'react-native-picker-select';
import { StackNavigationProp } from '@react-navigation/stack';
<<<<<<< HEAD
=======
import { RootStackParamList } from '../RootStack';
import { useIsFocused } from '@react-navigation/native';
>>>>>>> 0e0549a (Plaid Login Screen and Local server to get the keys for the API. Plaid login is still not fully functional but the screen does not break anything)

type SectionProps = PropsWithChildren<{
  title: string;
}>;

<<<<<<< HEAD
type RootStackParamList = {
  Home: undefined; 
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;
=======
type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'HomeScreen'>;
>>>>>>> 0e0549a (Plaid Login Screen and Local server to get the keys for the API. Plaid login is still not fully functional but the screen does not break anything)

type Props = {
  navigation: HomeScreenNavigationProp;
};

<<<<<<< HEAD
const HomeScreen = ({ navigation } : Props) => {
  return (
    <View style={styles.outerContainer}>
    <RNPickerSelect
          onValueChange={(value) => console.log(value)}
          items={[
            { label: 'Menu Item 1', value: 'menuItem1' },
            { label: 'Menu Item 2', value: 'menuItem2' },
            // Add more menu items as needed
          ]}
=======


const HomeScreen: React.FC<Props> = ({navigation}) => {
  //state for controling the selected value
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      // Reset selection only when the screen is focused again,
      // indicating the user has returned from the PlaidLoginScreen
      setSelectedValue('HomeScreen');
    }
  }, [isFocused]);

  const [selectedValue, setSelectedValue] = useState<'HomeScreen' | 'PlaidLoginScreen' | 'GoalsnTrends'>('HomeScreen');

  const handleItemSelected = (value: keyof RootStackParamList) => {
    console.log(`Navigating to ${value}`);
    // Consider setting the selected value only if necessary,
    // or managing navigation state more explicitly
    if (value !== selectedValue) {
      setSelectedValue(value);
    }
    navigation.navigate(value);
  };
  console.log(navigation);
  
  return (
    <View style={styles.outerContainer}>
    <RNPickerSelect
          onValueChange={(value) => handleItemSelected(value)}
          items={[
            { label: 'Home', value:'HomeScreen'},
            { label: 'Plaid Login', value:'PlaidLoginScreen'},
            { label: 'Goals and Trends', value:'GoalsnTrends'},
            // Add more menu items as needed
          ]}
          value={selectedValue}
>>>>>>> 0e0549a (Plaid Login Screen and Local server to get the keys for the API. Plaid login is still not fully functional but the screen does not break anything)
          style={{
            inputIOS: {
              fontSize: 16,
              paddingVertical: 12,
              paddingHorizontal: 10,
              borderWidth: 1,
              borderColor: 'gray',
              borderRadius: 4,
              color: 'black',
              paddingRight: 30, 
            },
            inputAndroid: {
              fontSize: 16,
              paddingHorizontal: 10,
              paddingVertical: 8,
              borderWidth: 0.5,
              borderColor: 'purple',
              borderRadius: 8,
              color: 'black',
              paddingRight: 30, 
            },
          }}
        />
      <View style={styles.container}>
        <Text style={styles.title}>Budget Overview</Text>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Balance</Text>
          <Text style={styles.balance}>$1,250.00</Text>
        </View>
        <View style={styles.sectionRow}>
          <View style={styles.halfSection}>
            <Text style={styles.sectionTitle}>Income</Text>
            <Text>$2,000.00</Text>
          </View>
          <View style={styles.halfSection}>
            <Text style={styles.sectionTitle}>Expenses</Text>
            <Text>$750.00</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#246EE9', 
  },
  buttonContainer: {
    alignSelf: 'flex-start', 
    position: 'absolute', 
    top: 10, 
    left: 10, 
    zIndex: 10, 
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    paddingTop: 60,
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 20,
  },
  section: {
    width: '100%',
    marginBottom: 10,
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  halfSection: {
    width: '48%',
  },
  sectionTitle: {
    fontSize: 18,
    color: '#000000',
    fontWeight: 'bold',
  },
  balance: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4CE205',
  },
});

export default HomeScreen;