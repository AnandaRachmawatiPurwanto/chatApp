// Di file App.tsx
import React from "react";
import { TouchableOpacity, Text } from "react-native"; // Jangan lupa import ini
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { signOut } from "firebase/auth"; // Import signOut
import { auth } from "./firebase"; // Import auth

import LoginScreen from "./screens/LoginScreen"; 
import RegisterScreen from "./screens/RegisterScreen"; 
import ChatScreen from "./screens/ChatScreen";

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Chat: { name: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{headerShown: false}} />
        
        {/* MODIFIKASI BAGIAN INI */}
        <Stack.Screen 
          name="Chat" 
          component={ChatScreen} 
          options={({ route, navigation }) => ({ 
            title: route.params.name,
            // Tambah Tombol Logout di Kanan Atas
            headerRight: () => (
              <TouchableOpacity 
                onPress={() => {
                  signOut(auth).then(() => {
                    navigation.replace("Login");
                  });
                }}
                style={{ marginRight: 10 }}
              >
                <Text style={{ color: "red", fontWeight: "bold" }}>Keluar</Text>
              </TouchableOpacity>
            )
          })} 
        />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}