import React, { useEffect, useState, useRef } from "react";
import {
  View, Text, TextInput, FlatList, StyleSheet,
  KeyboardAvoidingView, Platform, TouchableOpacity, Image, Alert, ActivityIndicator,
  Modal, StatusBar
} from "react-native";
import {
  addDoc, serverTimestamp, query, orderBy, onSnapshot, messagesCollection,
} from "../firebase";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { launchImageLibrary, ImageLibraryOptions } from 'react-native-image-picker';

type MessageType = {
  id: string; text: string; user: string; createdAt: any; imageUrl?: string;
};

type Props = NativeStackScreenProps<RootStackParamList, "Chat">;

// ==========================================================
// 1. KOMPONEN MESSAGE ITEM
// ==========================================================
const MessageItem = ({ item, currentUser, onImagePress }: { item: MessageType; currentUser: string, onImagePress: (url: string) => void }) => {
  const isMyMessage = item.user === currentUser;
  
  return (
    <View style={[styles.msgWrapper, isMyMessage ? styles.myMsgWrapper : styles.otherMsgWrapper]}>
      {!isMyMessage && <Text style={styles.senderName}>{item.user}</Text>}

      <View style={[styles.msgBox, isMyMessage ? styles.myMsg : styles.otherMsg]}>
        {item.imageUrl && (
          <TouchableOpacity onPress={() => onImagePress(item.imageUrl!)} activeOpacity={0.8}>
            <View style={styles.imageContainer}>
              <Image 
                source={{ uri: item.imageUrl }} 
                style={styles.messageImage} 
                resizeMode="cover" 
              />
              <View style={styles.zoomIconOverlay}><Text style={{fontSize:10}}>🔍</Text></View>
            </View>
          </TouchableOpacity>
        )}
        {item.text ? <Text style={isMyMessage ? styles.myText : styles.otherText}>{item.text}</Text> : null}
      </View>
    </View>
  );
};

// ==========================================================
// 2. KOMPONEN UTAMA SCREEN
// ==========================================================
export default function ChatScreen({ route }: Props) {
  const { name } = route.params;
  
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<MessageType[]>([]);
  
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  
  // State Modal Pop-up
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const q = query(messagesCollection, orderBy("createdAt", "asc"));
    const unsub = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MessageType)));
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (messages.length > 0) flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const pickImage = async () => {
    const options: ImageLibraryOptions = { 
      mediaType: 'photo', quality: 0.9, maxWidth: 800, maxHeight: 800, selectionLimit: 1, includeBase64: true 
    };
    try {
      const result = await launchImageLibrary(options);
      if (result.assets?.[0]) {
        setImageUri(result.assets[0].uri || null);
        setImageBase64(result.assets[0].base64 || null);
      }
    } catch (err) { console.log(err); }
  };

  const sendMessage = async () => {
    if (!message.trim() && !imageBase64) return;
    setIsSending(true);

    try {
      const messageData: any = { text: message, user: name, createdAt: serverTimestamp() };
      if (imageBase64) {
        messageData.imageUrl = `data:image/jpeg;base64,${imageBase64}`;
      }
      await addDoc(messagesCollection, messageData);
      setMessage(""); setImageUri(null); setImageBase64(null);
    } catch (error) { 
      console.error(error); Alert.alert("Gagal", "Error kirim pesan."); 
    } finally { setIsSending(false); }
  };

  const handleImagePress = (url: string) => {
    setSelectedImage(url);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0B0D17" />
      
      <FlatList
        ref={flatListRef} data={messages} keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <MessageItem item={item} currentUser={name} onImagePress={handleImagePress} />
        )}
        contentContainerStyle={{ padding: 15, paddingBottom: 20 }}
      />
      
      {imageUri && (
        <View style={styles.previewContainer}>
           <Image source={{ uri: imageUri }} style={styles.previewImage} />
           <TouchableOpacity onPress={() => {setImageUri(null); setImageBase64(null);}} style={styles.cancelButton}>
             <Text style={styles.cancelText}>✕ Batal</Text>
           </TouchableOpacity>
        </View>
      )}

      <View style={styles.inputRow}>
        <TouchableOpacity onPress={pickImage} style={styles.iconButton}>
           <Text style={{fontSize: 22}}>📷</Text>
        </TouchableOpacity>
        <TextInput 
          style={styles.input} placeholder="Kirim pesan" placeholderTextColor="#666"
          value={message} onChangeText={setMessage} 
        />
        {isSending ? <ActivityIndicator size="small" color="#00D4FF" style={{marginRight: 10}}/> : 
        <TouchableOpacity onPress={sendMessage} disabled={!message.trim() && !imageUri}
          style={[styles.sendButton, (!message.trim() && !imageUri) && {backgroundColor: '#333'}]}>
          <Text style={{fontSize: 20}}>🚀</Text>
        </TouchableOpacity>}
      </View>

      <Modal visible={modalVisible} transparent={true} animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalBackground}>
          <TouchableOpacity style={styles.modalCloseArea} onPress={() => setModalVisible(false)} activeOpacity={1}>
            {selectedImage && <Image source={{ uri: selectedImage }} style={styles.fullScreenImage} resizeMode="contain" />}
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Tutup</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B0D17" },
  msgWrapper: { marginVertical: 5, maxWidth: "80%" },
  myMsgWrapper: { alignSelf: "flex-end" }, otherMsgWrapper: { alignSelf: "flex-start" },
  senderName: { color: "#8899A6", fontSize: 10, marginBottom: 2, marginLeft: 10 },
  msgBox: { padding: 12, borderRadius: 16 },
  myMsg: { backgroundColor: "#0056D2", borderBottomRightRadius: 2, borderWidth: 1, borderColor: "#00D4FF" },
  otherMsg: { backgroundColor: "#1F2937", borderBottomLeftRadius: 2, borderWidth: 1, borderColor: "#374151" },
  myText: { color: "#FFF", fontSize: 15 }, otherText: { color: "#E5E7EB", fontSize: 15 },
  messageImage: { width: 200, height: 150, borderRadius: 10, backgroundColor: '#000' },
  imageContainer: { borderRadius: 10, overflow: 'hidden', marginBottom: 5 },
  zoomIconOverlay: { position: 'absolute', bottom: 5, right: 5, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 10, padding: 3 },
  inputRow: { flexDirection: "row", padding: 10, backgroundColor: "#151A23", alignItems: "center", borderTopWidth: 1, borderTopColor: "#2C3E50" },
  input: { flex: 1, backgroundColor: "#0B0D17", color: "#FFF", borderWidth: 1, borderColor: "#2C3E50", marginHorizontal: 10, padding: 10, borderRadius: 25 },
  iconButton: { padding: 5 },
  sendButton: { backgroundColor: "#00D4FF", borderRadius: 25, width: 45, height: 45, justifyContent: 'center', alignItems: 'center' },
  previewContainer: { padding: 10, backgroundColor: '#1F2937', flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderColor: '#374151' },
  previewImage: { width: 60, height: 60, borderRadius: 8, borderWidth: 1, borderColor: '#00D4FF' },
  cancelButton: { marginLeft: 15 }, cancelText: { color: '#FF6B6B', fontWeight: 'bold' },
  modalBackground: { flex: 1, backgroundColor: "rgba(0,0,0,0.95)", justifyContent: "center", alignItems: "center" },
  modalCloseArea: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
  fullScreenImage: { width: '95%', height: '70%', borderRadius: 10 },
  closeButton: { position: 'absolute', top: 50, right: 20, backgroundColor: 'rgba(255,255,255,0.2)', padding: 10, borderRadius: 20 },
  closeButtonText: { color: '#FFF', fontWeight: 'bold' }
});