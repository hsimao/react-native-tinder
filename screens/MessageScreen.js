import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  Text,
  View,
  TextInput,
  Button,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import tw from 'tailwind-rn';
import { db } from '../firebase';
import {
  addDoc,
  query,
  orderBy,
  onSnapshot,
  collection,
  serverTimestamp,
} from '@firebase/firestore';
import Header from '../components/Header';
import ReceiverMessage from '../components/ReceiverMessage';
import SenderMessage from '../components/SenderMessage';
import getMatchedUserInfo from '../utils/getMatchedUserInfo';
import useAuth from '../hooks/useAuth';

const MessageScreen = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  const { user } = useAuth();
  const {
    params: { matchDetails },
  } = useRoute();

  useEffect(() => {
    const unsub = onSnapshot(
      query(
        collection(db, 'matches', matchDetails.id, 'messages'),
        orderBy('timestamp', 'desc')
      ),
      snapshot =>
        setMessages(
          snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }))
        )
    );
    return unsub;
  }, [db, matchDetails]);

  const sendMessage = () => {
    addDoc(collection(db, 'matches', matchDetails.id, 'messages'), {
      timestamp: serverTimestamp(),
      userId: user.uid,
      displayName: user.displayName,
      photoURL: matchDetails.users[user.uid].photoURL,
      message: input,
    });

    setInput('');
  };

  return (
    <SafeAreaView style={tw('flex-1')}>
      <Header
        title={getMatchedUserInfo(matchDetails?.users, user.uid).displayName}
        callEnabled
      />

      <KeyboardAvoidingView
        style={tw('flex-1')}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={10}
      >
        <TouchableWithoutFeedback
          style={tw('bg-white flex-1')}
          onPress={Keyboard.dismiss}
        >
          <FlatList
            data={messages}
            inverted={-1} // 排序反過來
            keyExtractor={item => item.id}
            renderItem={({ item }) =>
              item.userId === user.uid ? (
                <SenderMessage key={item.id} message={item} />
              ) : (
                <ReceiverMessage key={item.id} message={item} />
              )
            }
            style={tw('pl-4')}
          />
        </TouchableWithoutFeedback>

        {/* input */}
        <View
          style={tw(
            'flex-row justify-between items-center border-t border-gray-200 px-5 py-2 bg-white'
          )}
        >
          <TextInput
            style={tw('h-10 text-lg')}
            placeholder="Send Message..."
            onChangeText={setInput}
            onSubmitEditing={sendMessage}
            value={input}
          />
          <Button title="Send" color="#ff5846" onPress={sendMessage} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default MessageScreen;
