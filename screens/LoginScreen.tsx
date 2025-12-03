import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, StatusBar } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) return;
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const displayName = user.displayName || user.email?.split('@')[0] || "User";
      navigation.replace("Chat", { name: displayName }); 
    } catch (error: any) {
      Alert.alert("Gagal Login", "Email atau password salah.");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0B0D17" />
      
      <View style={styles.headerContainer}>
        <Text style={styles.planetIcon}>🪐</Text>
        <Text style={styles.title}>Login</Text>
        <Text style={styles.subtitle}>Ayo Masuk</Text>
      </View>
      
      <View style={styles.formContainer}>
        <TextInput 
          style={styles.input} 
          placeholder="Email" 
          placeholderTextColor="#8899A6"
          value={email} 
          onChangeText={setEmail} 
          keyboardType="email-address" 
          autoCapitalize="none" 
        />
        <TextInput 
          style={styles.input} 
          placeholder="Kode Sandi" 
          placeholderTextColor="#8899A6"
          value={password} 
          onChangeText={setPassword} 
          secureTextEntry 
        />

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Masuk</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.link}>Belum punya ID? <Text style={styles.linkHighlight}>Daftar disini</Text></Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B0D17", justifyContent: "center", padding: 20 },
  headerContainer: { alignItems: 'center', marginBottom: 40 },
  planetIcon: { fontSize: 50, marginBottom: 10 },
  title: { fontSize: 32, color: "#00D4FF", fontWeight: "bold", textShadowColor: '#00D4FF', textShadowRadius: 10 },
  subtitle: { color: "#8899A6", marginTop: 5, fontSize: 16 },
  formContainer: { width: '100%' },
  input: { 
    backgroundColor: "#151A23", 
    borderWidth: 1, 
    borderColor: "#2C3E50", 
    color: "#FFF", 
    padding: 15, 
    borderRadius: 12, 
    marginBottom: 20,
    fontSize: 16
  },
  loginButton: {
    backgroundColor: "#00D4FF",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#00D4FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  loginButtonText: { color: "#0B0D17", fontWeight: "bold", fontSize: 18 },
  link: { color: "#8899A6", textAlign: "center", marginTop: 10 },
  linkHighlight: { color: "#00D4FF", fontWeight: "bold" },
});