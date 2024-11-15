import React from 'react';
import {useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';

const App = () => {
  // state to hold the fetched forms
  const [forms, setForms] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchForms = async () => {
    try {
      setLoading(true);
      setError(null);
      const snapshot = await firestore().collection('forms').get();
      const formsData = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      }));
      return formsData || []; // ensure its an array
    } catch (error) {
      setError('Error fetching form. Please try again later.');
      console.error('Error fetching forms: ', error);
      return []; // Return empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadForms = async () => {
      const formsData = await fetchForms();
      setForms(formsData);
    };
    loadForms();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <Text style={styles.header}>Forms</Text>
        (loading && (
        <ActivityIndicator
          size="large"
          color="0000ff"
          style={styles.loader}></ActivityIndicator>
        )) (error && (<Text style={styles.errorText}>{error}</Text>
        ))
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
  loader: {
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});

export default App;
