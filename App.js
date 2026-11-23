import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import {
  Platform,
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Modal,
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const API_URL = 'https://swapi.py4e.com/api/';

function Screen({ route }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search state
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [submittedText, setSubmittedText] = useState('');

  const type = route.name;

  // Display search text in modal
  const handleSearch = () => {
    setSubmittedText(searchText);
    setModalVisible(true);
  };

  useEffect(() => {
    let active = true;

    async function loadData() {
      setLoading(true);
      setError('');

      const endpoint =
        type === 'Planets'
          ? 'planets/'
          : type === 'Films'
          ? 'films/'
          : 'starships/';

      try {
        const response = await fetch(API_URL + endpoint);

        if (!response.ok) {
          throw new Error('Failed to load data');
        }

        const data = await response.json();

        if (active) {
          setItems(data.results || []);
        }
      } catch (err) {
        if (active) {
          setError('Unable to load data. Please try again.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      active = false;
    };
  }, [type]);

  function renderItem({ item }) {
    if (type === 'Planets') {
      return (
        <View style={styles.card}>
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.info}>
            Climate: {item.climate}
          </Text>
          <Text style={styles.info}>
            Terrain: {item.terrain}
          </Text>
          <Text style={styles.info}>
            Population: {item.population}
          </Text>
        </View>
      );
    }

    if (type === 'Films') {
      return (
        <View style={styles.card}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.info}>
            Episode: {item.episode_id}
          </Text>
          <Text style={styles.info}>
            Director: {item.director}
          </Text>
          <Text style={styles.info}>
            Release Date: {item.release_date}
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.card}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.info}>
          Model: {item.model}
        </Text>
        <Text style={styles.info}>
          Manufacturer: {item.manufacturer}
        </Text>
        <Text style={styles.info}>
          Passengers: {item.passengers}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Text style={styles.heading}>{type}</Text>

      {/* Search input */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Enter search term"
          placeholderTextColor="#777777"
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />

        <TouchableOpacity
          style={styles.searchButton}
          onPress={handleSearch}
        >
          <Text style={styles.searchButtonText}>
            Search
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Search Term
            </Text>

            <Text style={styles.modalText}>
              You entered: {submittedText}
            </Text>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Star Wars data */}
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#ffe81f"
        />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => item.url}
          contentContainerStyle={styles.list}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <Text style={styles.info}>
              No results found.
            </Text>
          }
        />
      )}
    </View>
  );
}

function AppNavigation() {
  if (Platform.OS === 'android') {
    return (
      <Drawer.Navigator initialRouteName="Planets">
        <Drawer.Screen
          name="Planets"
          component={Screen}
        />
        <Drawer.Screen
          name="Films"
          component={Screen}
        />
        <Drawer.Screen
          name="Spaceships"
          component={Screen}
        />
      </Drawer.Navigator>
    );
  }

  return (
    <Tab.Navigator
      initialRouteName="Planets"
      screenOptions={{
        tabBarActiveTintColor: '#806000',
        tabBarIcon: () => (
          <Text style={{ fontSize: 20 }}>★</Text>
        ),
      }}
    >
      <Tab.Screen
        name="Planets"
        component={Screen}
      />
      <Tab.Screen
        name="Films"
        component={Screen}
      />
      <Tab.Screen
        name="Spaceships"
        component={Screen}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <NavigationContainer>
          <AppNavigation />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screen: {
    flex: 1,
    backgroundColor: '#101820',
    padding: 15,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffe81f',
    textAlign: 'center',
    marginBottom: 15,
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#202b36',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffe81f',
    marginBottom: 8,
  },
  info: {
    fontSize: 15,
    color: '#ffffff',
    marginBottom: 4,
  },
  error: {
    color: '#ff7777',
    textAlign: 'center',
    marginTop: 20,
  },

  // Search styles
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#ffffff',
    color: '#000000',
    padding: 10,
    borderRadius: 8,
    marginRight: 8,
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: '#ffe81f',
    padding: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#000000',
    fontWeight: 'bold',
    fontSize: 16,
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#202b36',
    padding: 25,
    borderRadius: 12,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffe81f',
    marginBottom: 15,
  },
  modalText: {
    fontSize: 18,
    color: '#ffffff',
    marginBottom: 20,
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#ffe81f',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
