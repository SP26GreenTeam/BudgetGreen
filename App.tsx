import React, { lazy } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { GoalsProvider } from './GoalsContext';
import HomeScreen from './Screens/HomeScreen';
import LoginScreen from './Screens/LoginScreen'
import SignupScreen from './Screens/SignupScreen'
import PlaidLoginScreen from './Screens/PlaidLoginScreen';
import Goals from './Screens/Goals';


const Stack = createStackNavigator();

function App(): React.JSX.Element  {
  return (
    <GoalsProvider>
      <NavigationContainer>
            <Stack.Navigator initialRouteName="LoginScreen">
            <Stack.Screen name = "LoginScreen" component={LoginScreen}/>
            <Stack.Screen name = "SignupScreen" component={SignupScreen}/>
            <Stack.Screen name = "HomeScreen" component={HomeScreen}/>
            <Stack.Screen name = "PlaidLoginScreen" component={PlaidLoginScreen}/>
            <Stack.Screen name = "Goals" component={Goals} />
            </Stack.Navigator>  
      </NavigationContainer>
      </GoalsProvider>
  );
}

export default App;