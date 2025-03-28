import React, { useState, useEffect } from 'react';
import { Text, View, Image, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import tw from 'twrnc';
import { TextInput, TouchableOpacity } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { auth } from './Components/firebaseConfig';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

WebBrowser.maybeCompleteAuthSession();

type RootStackParamList = {
  Main: undefined;
 
  StudentSignUp: undefined;
  ForgotPassword: undefined;

};

const  LandlordLogIn: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Google authentication setup
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
    iosClientId: 'YOUR_IOS_CLIENT_ID.apps.googleusercontent.com',
    androidClientId: 'YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com',
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then(() => {
          navigation.navigate('Main');
        })
        .catch((error) => {
          Alert.alert('Google Login Failed', error.message);
        });
    }
  }, [response]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.navigate('Main');
    } catch (error: any) {
      Alert.alert('Login Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white px-4`}>
      {/* Logo */}
      <View style={tw`items-center mt-6`}>
        <Image source={require('../assets/images/logo.png')} style={tw`w-24 h-24`} />
      </View>

      {/* Welcome Text */}
      <Text style={tw`text-black font-bold text-2xl mt-4 text-center`}>WELCOME BACK</Text>
      <Text style={tw`text-gray-500 text-center`}>Sign in to continue</Text>

      {/* Input Fields */}
      <View style={tw`mt-6`}>
        <TextInput
          placeholder="Email"
          placeholderTextColor="#ccc"
          style={tw`bg-white text-black p-3 rounded-lg border border-gray-300 mb-3`}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          placeholder="Password"
          placeholderTextColor="#ccc"
          style={tw`bg-white text-black p-3 rounded-lg border border-gray-300`}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      {/* Forgot Password */}
      <Text onPress={() => navigation.navigate('ForgotPassword')}  style={tw`text-right w-full mt-2 text-gray-400`}>Forgot Password?</Text>

      {/* Login Button */}
      <TouchableOpacity
        style={tw`w-full bg-[#ff914d] rounded-xl mt-6 p-3`}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={tw`text-center text-white font-semibold text-lg`}>LOG IN</Text>
        )}
      </TouchableOpacity>

      {/* Social Media Login */}
      <Text style={tw`text-center text-gray-500 mt-6`}>or log in with</Text>
      <View style={tw`flex-row justify-center space-x-6 mt-4`}>
        <TouchableOpacity onPress={() => promptAsync()}>
          <AntDesign name="google" size={30} color="black" />
        </TouchableOpacity>
      </View>

      {/* Sign Up Link */}
      <View style={tw`absolute bottom-6 w-full items-center`}>
        <Text style={tw`text-gray-500`}>
          Don't have an account?
          <Text onPress={() => navigation.navigate('StudentSignUp')} style={tw`font-bold text-black`}>
            {' '}Sign Up
          </Text>
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default LandlordLogIn;
