import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StackNavigationProp } from '@react-navigation/stack';
import HomeScreen from './Screens/HomeScreen';
import PlaidLoginScreen from './Screens/PlaidLoginScreen';
import { RootStackParamList } from './RootStack';


type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'HomeScreen'>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

const Stack = createStackNavigator();

function App(): React.JSX.Element {
  return (
      <NavigationContainer>
            <Stack.Navigator initialRouteName="Home Screen">
            <Stack.Screen name = "HomeScreen" component={HomeScreen}/>
            <Stack.Screen name = "PlaidLoginScreen" component={PlaidLoginScreen} />
            </Stack.Navigator>  
      </NavigationContainer>
  );
}

export default App;
