import React from 'react';
import {useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  StyleSheet,
  FlatList,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';

const App = () => {
  // state to hold the fetched forms
  const [forms, setForms] = useState<any[]>([]);

  const fetchForms = async () => {
    try {
      const snapshot = await firestore().collection('forms').get();
      const formsData = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      }));
      return formsData;
    } catch (error) {
      console.error('Error fetching forms: ', error);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <Text style={styles.header}>Forms</Text>
        <FlatList
          data={forms}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <View style={styles.formContainer}>
              <Text style={styles.formTitle}>{item.title}</Text>
              <Text style={styles.formDescription}>{item.description}</Text>
            </View>
          )}></FlatList>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  formDescription: {
    fontSize: 14,
    color: '#555',
  },
});

export default App;
