import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, StatusBar } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase";

type Props = NativeStackScreenProps<RootStackParamList, "Register">;

export default function RegisterScreen({ navigation }: Props) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    if (!username || !email || !password) {
      Alert.alert("Error", "Isi semua data awak kapal!");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: username });
      Alert.alert("Sukses", `Halo Kapten ${username}, akun siap!`);
      navigation.navigate("Login");
    } catch (error: any) {
      Alert.alert("Gagal Daftar", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0B0D17" />
      <Text style={styles.title}>Registrasi</Text>
      
      <TextInput style={styles.input} placeholder="Nama Panggilan" placeholderTextColor="#8899A6" value={username} onChangeText={setUsername} />
      <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#8899A6" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Sandi Rahasia" placeholderTextColor="#8899A6" value={password} onChangeText={setPassword} secureTextEntry />
      
      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.buttonText}>Daftarkan dirimu</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.link}>Sudah punya ID? <Text style={styles.linkHighlight}>Login</Text></Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B0D17", justifyContent: "center", padding: 20 },
  title: { fontSize: 28, color: "#BD00FF", fontWeight: "bold", textAlign: "center", marginBottom: 30, textShadowColor: '#BD00FF', textShadowRadius: 10 },
  input: { 
    backgroundColor: "#151A23", borderWidth: 1, borderColor: "#2C3E50", 
    color: "#FFF", padding: 15, borderRadius: 12, marginBottom: 15 
  },
  registerButton: {
    backgroundColor: "#BD00FF", padding: 15, borderRadius: 12, alignItems: "center", marginBottom: 20,
    shadowColor: "#BD00FF", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, shadowRadius: 10, elevation: 5,
  },
  buttonText: { color: "#FFF", fontWeight: "bold", fontSize: 16 },
  link: { color: "#8899A6", textAlign: "center" },
  linkHighlight: { color: "#BD00FF", fontWeight: "bold" }
});