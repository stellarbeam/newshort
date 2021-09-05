import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import Home from '../screens/Home';
import Bookmarks from '../screens/Bookmarks';
import Preference from '../screens/Preference';
import GearIcon from '../components/GearIcon';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import BookmarksIcon from '../components/BookmarksIcon';

const Stack = createStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={Home}
        options={({navigation}) => ({
          title: 'NewShort',
          headerStyle: {
            backgroundColor: '#097B71',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
            color: 'white',
          },
          headerRight: () => (
            <View style={styles.settingContainer}>
              <TouchableOpacity
                onPress={() => navigation.navigate('Bookmarks')}>
                <BookmarksIcon />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate('Preference')}>
                <GearIcon />
              </TouchableOpacity>
            </View>
          ),
        })}
      />
      <Stack.Screen name="Bookmarks" component={Bookmarks} />
      <Stack.Screen name="Preference" component={Preference} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  settingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
