import React, { useState } from 'react';
import type { PropsWithChildren } from 'react';
import { Button, View, Text, StyleSheet, TextInput, Alert, Image, ScrollView } from 'react-native';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

export default function App() {
  const [username, setName] = useState('UserName: ');
  const [password, setWord] = useState('Password: ');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Sign-up Sheet</Text>
      <Image 
        source={require('./images/depositphotos_136992572-stock-illustration-application-form-icon.jpg')}
        style ={styles.image}
      />
      <Text>Enter Email:</Text>
      <TextInput
        style={styles.input}
        placeholder='Email'
        onChangeText={(val) => setName(val)}
      />
      <Text>Enter Password:</Text>
      <TextInput
        style={styles.input}
        placeholder='Password'
        onChangeText={(val) => setWord(val)}
        secureTextEntry={true} // Password input will appear as *****
      />
      <Text>Confirm Password:</Text>
      <TextInput
        style={styles.input}
        placeholder='Confirm Password'
        onChangeText={(val) => setWord(val)}
        secureTextEntry={true} // Password input will appear as *****
      />
      <Button
          title="SignUp"
          onPress={() => Alert.alert('You have reached the signup page')}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    paddingTop: 60,
    width: '100%'
  },
  input: {
    borderWidth: 1,
    borderColor: '#FFF',
    padding: 8,
    margin: 10,
    width: 200
  },
  image: {
    width: 500,
    height: 300,
    marginBottom: 10
  },
  buttonContainer: {
    flexDirection: 'row', // Arrange children horizontally
    justifyContent: 'space-between', // Add space between children
    width: '50%',
    paddingHorizontal: 20,
  },
});
