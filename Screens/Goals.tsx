import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Button, Modal, TextInput } from 'react-native';
import { useGoals } from '../GoalsContext';

// Define a type for the goal structure, including the amount
type Goal = {
  id: string;
  title: string;
  amount: number;
  priority: number;
};

const GoalsAndTrendsScreen: React.FC = () => {
    const { goals, setGoals } = useGoals();
    const [modalVisible, setModalVisible] = useState(false);
    const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
    const [editedTitle, setEditedTitle] = useState('');
    const [editedAmount, setEditedAmount] = useState('');

  const addGoal = () => {
    const newGoal: Goal = {
      id: Math.random().toString(),
      title: `Goal ${goals.length + 1}`,
      amount: 0, // Default amount
      priority: goals.length + 1,
    };
    setGoals(currentGoals => [...currentGoals, newGoal].sort((a, b) => a.priority - b.priority));
  };

  const startEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
    setEditedTitle(goal.title);
    setEditedAmount(goal.amount.toString());
    setModalVisible(true);
  };

  const saveGoal = () => {
    if (!editingGoal) return;

    const updatedGoals = goals.map(goal => {
      if (goal.id === editingGoal.id) {
        return { ...goal, title: editedTitle, amount: parseFloat(editedAmount) };
      }
      return goal;
    });

    setGoals(updatedGoals);
    setModalVisible(false);
    setEditingGoal(null);
    setEditedTitle('');
    setEditedAmount('');
  };

  const highestPriorityGoal = goals[0];

  return (
    <View style={styles.container}>
      <Button title="Add New Goal" onPress={addGoal} />
      <Modal
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          <TextInput
            style={styles.input}
            value={editedTitle}
            onChangeText={setEditedTitle}
            placeholder="Edit Title"
          />
          <TextInput
            style={styles.input}
            value={editedAmount}
            onChangeText={setEditedAmount}
            placeholder="Edit Amount"
            keyboardType="numeric"
          />
          <Button title="Save" onPress={saveGoal} />
        </View>
      </Modal>
      <FlatList
        data={goals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.goalItem}>
            <Text style={styles.goalText}>{item.title}</Text>
            <Text style={styles.goalAmount}>${item.amount.toFixed(2)}</Text>
            <TouchableOpacity style={styles.editButton} onPress={() => startEditGoal(item)}>
              <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={() => Alert.alert("Delete Goal", "Are you sure you want to delete this goal?", [{ text: "Cancel", style: "cancel" }, { text: "OK", onPress: () => setGoals(currentGoals => currentGoals.filter(goal => goal.id !== item.id)) }])}>
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
    marginHorizontal: 20,
  },
  goalItem: {
    backgroundColor: '#ddd',
    padding: 20,
    marginVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  goalText: {
    fontSize: 16,
  },
  goalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  editButton: {
    backgroundColor: 'blue',
    padding: 10,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 10,
  },
  buttonText: {
    color: '#fff', 
  },
  deleteButtonText: {
    color: '#fff',
  },
  modalView: {
    marginTop: 100,
    marginHorizontal: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: '80%',
  },
});

export default GoalsAndTrendsScreen;