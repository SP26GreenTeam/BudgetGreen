import React from 'react';
<<<<<<< HEAD
<<<<<<< HEAD
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StackNavigationProp } from '@react-navigation/stack';
import HomeScreen from './Screens/HomeScreen'; //This will change as it is a file path so based on the person installing
import type {PropsWithChildren} from 'react';
import { Button, Text, View, } from 'react-native';

=======
import type {PropsWithChildren} from 'react';
>>>>>>> 5ab57a2 (Initial commit)
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
<<<<<<< HEAD
  useColorScheme,
=======
  Text,
  useColorScheme,
  View,
>>>>>>> 5ab57a2 (Initial commit)
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
<<<<<<< HEAD
=======
  LearnMoreLinks,
>>>>>>> 5ab57a2 (Initial commit)
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
=======
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StackNavigationProp } from '@react-navigation/stack';
import HomeScreen from './Screens/HomeScreen';
import PlaidLoginScreen from './Screens/PlaidLoginScreen';
import { RootStackParamList } from './RootStack';

>>>>>>> 0e0549a (Plaid Login Screen and Local server to get the keys for the API. Plaid login is still not fully functional but the screen does not break anything)

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'HomeScreen'>;

<<<<<<< HEAD
<<<<<<< HEAD
type RootStackParamList = {
  Home: undefined; 
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

=======
>>>>>>> 0e0549a (Plaid Login Screen and Local server to get the keys for the API. Plaid login is still not fully functional but the screen does not break anything)
type Props = {
  navigation: HomeScreenNavigationProp;
};

<<<<<<< HEAD
=======
>>>>>>> 5ab57a2 (Initial commit)
function Section({children, title}: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}
=======
const Stack = createStackNavigator();
>>>>>>> 0e0549a (Plaid Login Screen and Local server to get the keys for the API. Plaid login is still not fully functional but the screen does not break anything)

<<<<<<< HEAD
const Stack = createStackNavigator();

=======
>>>>>>> 5ab57a2 (Initial commit)
function App(): React.JSX.Element {
  return (
<<<<<<< HEAD
    <SafeAreaView style={backgroundStyle}>
<<<<<<< HEAD
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={backgroundStyle.backgroundColor} />
      <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name = "Home" component={HomeScreen} options={{title: 'Account Overview'}}/>
            </Stack.Navigator>  
          </NavigationContainer>
=======
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="Step One">
            Edit <Text style={styles.highlight}>App.tsx</Text> to change this
            screen and then come back to see your edits.
          </Section>
          <Section title="See Your Changes">
            <ReloadInstructions />
          </Section>
          <Section title="Debug">
            <DebugInstructions />
          </Section>
          <Section title="Learn More">
            Read the docs to discover what to do next:
          </Section>
          <LearnMoreLinks />
        </View>
      </ScrollView>
>>>>>>> 5ab57a2 (Initial commit)
    </SafeAreaView>
=======
      <NavigationContainer>
            <Stack.Navigator initialRouteName="Home Screen">
            <Stack.Screen name = "HomeScreen" component={HomeScreen}/>
            <Stack.Screen name = "PlaidLoginScreen" component={PlaidLoginScreen} />
            </Stack.Navigator>  
      </NavigationContainer>
>>>>>>> 0e0549a (Plaid Login Screen and Local server to get the keys for the API. Plaid login is still not fully functional but the screen does not break anything)
  );
}

export default App;
