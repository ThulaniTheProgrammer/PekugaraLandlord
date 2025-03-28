import { Stack } from "expo-router";




export default function RootLayout() {
  return (
 
    <Stack>
      <Stack.Screen  options={{ headerShown: false }} name="index" />
      <Stack.Screen  options={{ headerShown: false }} name="Welcome" />
      <Stack.Screen  options={{ headerShown: false }} name="StudentLogIn" />
      <Stack.Screen  options={{ headerShown: false }} name="LandlordLogIn" />
      <Stack.Screen  options={{ headerShown: false }} name="Main" />
      <Stack.Screen  options={{ headerShown: false }} name="ForgotPassword" />
      <Stack.Screen  options={{ headerShown: false }} name="HouseDetail" />
      <Stack.Screen  options={{ headerShown: false }} name="Mzari" />
      <Stack.Screen  options={{ headerShown: false }} name="ReceiveMoney" />
      <Stack.Screen  options={{ headerShown: false }} name="TapToPay" />
      <Stack.Screen  options={{ headerShown: false }} name="HouseArea" />
      
    
    

      <Stack.Screen  options={{ headerShown: false }} name="StudentSignUp" />
       
        <Stack.Screen  options={{ headerShown: false }} name="SignUp" />
        <Stack.Screen  options={{ headerShown: false }} name="LandlordMain" />
        <Stack.Screen  options={{ headerShown: false }} name="HouseRegistration" />
        <Stack.Screen  options={{ headerShown: false }} name="LandLordSignUp" />
        
     
        
   
    </Stack>
 
  );
}
