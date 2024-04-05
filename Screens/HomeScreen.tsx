import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import type { PropsWithChildren } from 'react';
import RNPickerSelect from 'react-native-picker-select';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../RootStack';
import { useIsFocused } from '@react-navigation/native';
import { useGoals } from '../GoalsContext';
import { usePlaidData } from './PlaidDataProvider';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'HomeScreen'>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { data } = usePlaidData();
  const { goals } = useGoals();
  const highestPriorityGoal = goals.sort((a, b) => a.priority - b.priority)[0] || null;
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      setSelectedValue('HomeScreen');
    }
  }, [isFocused]);

  const [selectedValue, setSelectedValue] = useState<'HomeScreen' | 'PlaidLoginScreen' | 'Goals' | 'LoginScreen' | 'SignupScreen'>('HomeScreen');

  const handleItemSelected = (value: keyof RootStackParamList) => {
    console.log(`Navigating to ${value}`);
    if (value !== selectedValue) {
      setSelectedValue(value);
    }
    navigation.navigate(value);
  };

  return (
    <ScrollView style={styles.outerContainer}>
      <RNPickerSelect
        onValueChange={(value) => handleItemSelected(value)}
        items={[
          { label: 'Home', value: 'HomeScreen' },
          { label: 'Plaid Login', value: 'PlaidLoginScreen' },
          { label: 'Goals', value: 'Goals' },
          // Add more menu items as needed
        ]}
        value={selectedValue}
        placeholder={{}}
        style={{
          inputIOS: styles.inputIOS,
          inputAndroid: styles.inputAndroid,
        }}
      />
      <View style={styles.container}>
        <Text style={styles.title}>Budget Overview</Text>
        {/* Display Current Balance */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Balance</Text>
          <Text style={styles.balance}>${data?.balance.toFixed(2)}</Text> 
        </View>
        {highestPriorityGoal && (
          <View style={styles.fullWidthSection}>
            <Text style={styles.sectionTitle}>Top Priority Goal</Text>
            <Text>{highestPriorityGoal.title} - ${highestPriorityGoal.amount.toFixed(2)}</Text>
            <Text>Priority Level: {highestPriorityGoal.priority}</Text>
          </View>
        )}
        <View style={styles.fullWidthSection}>
          <Text style={styles.sectionTitle}>Recent Transactions:</Text>
        </View>
      </View>
    </ScrollView>
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
  fullWidthSection: {
    width: '100%', 
    alignItems: 'center', 
    marginBottom: 10,
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
  transactionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
});

export default HomeScreen;