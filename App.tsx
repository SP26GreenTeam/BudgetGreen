/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
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

type SectionProps = PropsWithChildren<{
  title: string;
}>;

<<<<<<< HEAD
type RootStackParamList = {
  Home: undefined; 
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

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

<<<<<<< HEAD
const Stack = createStackNavigator();

=======
>>>>>>> 5ab57a2 (Initial commit)
function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
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
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
