import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, Button, Image, TouchableOpacity } from 'react-native';
import tw from 'tailwind-rn';
import useAuth from '../hooks/useAuth';
import { SafeAreaView } from 'react-native';
import { AntDesign, Entypo, Ionicons } from '@expo/vector-icons';

const HomeScreen = () => {
  const navigation = useNavigation();
  const { user, logout } = useAuth();

  return (
    <SafeAreaView>
      {/* Header */}
      <View style={tw('flex-row items-center justify-between px-5')}>
        <TouchableOpacity onPress={logout}>
          <Image
            style={tw('h-10 w-10 rounded-full')}
            source={{ uri: user.photoURL }}
          />
        </TouchableOpacity>

        <TouchableOpacity>
          <Image
            style={tw('h-14 w-14')}
            source={require('../assets/logo.png')}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Chat')}>
          <Ionicons name="chatbubbles-sharp" size={30} color="#ff5864" />
        </TouchableOpacity>
      </View>
      {/* End of Header */}
    </SafeAreaView>
  );
};

export default HomeScreen;
