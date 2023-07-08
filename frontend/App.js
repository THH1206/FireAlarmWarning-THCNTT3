import {createNativeStackNavigator} from '@react-navigation/native-stack';
import * as React from 'react';
import ListRooms from './Views//ListRooms';
import ListDevices from './Views/ListDevices';
import {NavigationContainer} from '@react-navigation/native';
import 'react-native-gesture-handler';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';

const Tab = createBottomTabNavigator();
function MyTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="List Rooms" component={ListRooms} />
      <Tab.Screen name="List Devices" component={ListDevices} />
    </Tab.Navigator>
  );
}
function MyStack() {
  return (
    <Stack.Navigator>
       <Stack.Screen
          name="Tabs"
          component={MyDrawer}
          options={{ headerShown: false }}
        />
      <Stack.Screen name="ListRooms" component={ListRooms} />
      <Stack.Screen name="ListDevices" component={ListDevices} />
    </Stack.Navigator>
  );
}


const Drawer = createDrawerNavigator();
function MyDrawer() {
  return (

    <Drawer.Navigator useLegacyImplementation>
      <Drawer.Screen name=" " component={MyTabs}/>
      <Drawer.Screen name="ListRooms" component={ListRooms} />
      <Drawer.Screen name="ListDevices" component={ListDevices} />
    </Drawer.Navigator>

  );
}



const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>

      <MyTabs/>
    </NavigationContainer>
  );

}




