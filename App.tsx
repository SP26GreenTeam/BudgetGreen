import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StackNavigationProp } from '@react-navigation/stack';
import { GoalsProvider } from './GoalsContext';
import HomeScreen from './Screens/HomeScreen';
import PlaidLoginScreen from './Screens/PlaidLoginScreen';
import GoalsnTrends from './Screens/GoalsnTrends';
import { RootStackParamList } from './RootStack';


type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'HomeScreen'>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

const Stack = createStackNavigator();

function App(): React.JSX.Element  {
  return (
    <GoalsProvider>
      <NavigationContainer>
            <Stack.Navigator initialRouteName="HomeScreen">
            <Stack.Screen name = "HomeScreen" component={HomeScreen}/>
            <Stack.Screen name = "PlaidLoginScreen" component={PlaidLoginScreen} />
            <Stack.Screen name = "GoalsnTrends" component={GoalsnTrends} />
            </Stack.Navigator>  
      </NavigationContainer>
      </GoalsProvider>
  );
}

export default App;
