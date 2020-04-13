import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

//containers
import LoginScreen from '../containers/Login';
import HomeScreen from '../containers/Home';
import SplashScreen from '../containers/Splash';

const Stack = createStackNavigator();

// Definimos las rutas de la app
function Routing() {
    return (
      <NavigationContainer screenOptions={{gestureDirection:'horizontal'}}>
        <Stack.Navigator headerMode='none' screenOptions={{gestureDirection:'horizontal'}}>
           <Stack.Screen name="Login" component={LoginScreen}/>
          <Stack.Screen name="Home" component={HomeScreen}/>
          <Stack.Screen name="Splash" component={SplashScreen}/>
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

export default Routing
