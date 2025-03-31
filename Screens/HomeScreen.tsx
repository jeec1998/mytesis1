import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

interface Message {
  id: string;
  text: string;
  from: 'user' | 'bot';
}

const HomeScreen: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hola, soy tu IA 🤖 ¿En qué te puedo ayudar?',
      from: 'bot',
    },
  ]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (input.trim()) {
      const userMsg: Message = {
        id: Date.now().toString(),
        text: input,
        from: 'user',
      };
      setMessages((prev) => [...prev, userMsg]);
      setInput('');

      setTimeout(() => {
        const botReply: Message = {
          id: (Date.now() + 1).toString(),
          text: 'Estoy procesando tu mensaje... 🤔',
          from: 'bot',
        };
        setMessages((prev) => [...prev, botReply]);
      }, 500);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.innerContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              style={[
                styles.messageBubble,
                item.from === 'user' ? styles.userBubble : styles.botBubble,
              ]}
            >
              <Text style={styles.messageText}>{item.text}</Text>
            </View>
          )}
          contentContainerStyle={styles.messageList}
        />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Escribe tu mensaje..."
            value={input}
            onChangeText={setInput}
            placeholderTextColor="#555"
          />
          <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
            <Text style={styles.sendText}>Enviar</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D6E6F2', // azul predominante
  },
  innerContainer: {
    flex: 1,
  },
  messageList: {
    padding: 12,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
    marginBottom: 10,
    maxWidth: '80%',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#A7C7E7', // azul usuario
  },
  botBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#EDF4FB', // azul claro IA
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    borderTopColor: '#bbb',
    borderTopWidth: 1,
    backgroundColor: '#E5F0FF',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#D0E4FF', // input más azul
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#2F80ED', // azul profundo botón
    borderRadius: 20,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  sendText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
