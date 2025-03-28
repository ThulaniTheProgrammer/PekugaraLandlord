import React, { useState } from 'react';
import { Text, View, Image, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import tw from 'twrnc';
import { TextInput, TouchableOpacity } from 'react-native';
import { auth } from './Components/firebaseConfig';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';

type RootStackParamList = {
  LandlordDashboard: undefined;
  LandlordLogIn: undefined;
};

const LandlordSignUp: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [firstName, setFirstName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  const handleSignUp = async () => {
    if (!firstName || !surname || !email || !password || !confirmPassword || !phone) {
      Alert.alert('Error', 'All fields are required');
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert('Error', 'Enter a valid email address');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await sendEmailVerification(user);
      Alert.alert(
        'Verification Email Sent',
        'Please check your email and verify your account before logging in.'
      );

      navigation.navigate('LandlordLogIn');
    } catch (error: any) {
      Alert.alert('Sign Up Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white px-6`}>
      {/* Logo */}
      <View style={tw`items-center mt-6`}>
        <Image source={require('../assets/images/logo.png')} style={tw`w-24 h-24`} />
      </View>

      {/* Welcome Text */}
      <Text style={tw`text-black font-bold text-2xl mt-4 text-center`}>Landlord Sign Up</Text>
      <Text style={tw`text-gray-500 text-center`}>Create an account to list properties</Text>

      {/* Input Fields */}
      <View style={tw`mt-6`}>
        <TextInput placeholder="First Name" style={tw`bg-white text-black p-3 rounded-lg border border-gray-300 mb-3`} value={firstName} onChangeText={setFirstName} />
        <TextInput placeholder="Surname" style={tw`bg-white text-black p-3 rounded-lg border border-gray-300 mb-3`} value={surname} onChangeText={setSurname} />
        <TextInput placeholder="Email" keyboardType="email-address" autoCapitalize="none" style={tw`bg-white text-black p-3 rounded-lg border border-gray-300 mb-3`} value={email} onChangeText={setEmail} />
        <TextInput placeholder="Password" secureTextEntry style={tw`bg-white text-black p-3 rounded-lg border border-gray-300 mb-3`} value={password} onChangeText={setPassword} />
        <TextInput placeholder="Confirm Password" secureTextEntry style={tw`bg-white text-black p-3 rounded-lg border border-gray-300 mb-3`} value={confirmPassword} onChangeText={setConfirmPassword} />
        <TextInput placeholder="Phone Number" keyboardType="phone-pad" style={tw`bg-white text-black p-3 rounded-lg border border-gray-300 mb-3`} value={phone} onChangeText={setPhone} />
      </View>

      {/* Sign Up Button */}
      <TouchableOpacity style={tw`w-full bg-[#ff914d] rounded-xl mt-6 p-3`} onPress={handleSignUp} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={tw`text-center text-white font-semibold text-lg`}>Sign Up</Text>
        )}
      </TouchableOpacity>

      {/* Sign in link */}
      <Text style={tw`text-center text-gray-500 mt-4`}>
        Already have an account?{' '}
        <Text onPress={() => navigation.navigate('LandlordLogIn')} style={tw`font-bold text-black`}>
          Log In
        </Text>
      </Text>
    </SafeAreaView>
  );
};

export default LandlordSignUp;
