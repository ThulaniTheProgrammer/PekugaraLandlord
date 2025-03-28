import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createClient } from "@supabase/supabase-js";
import tw from "twrnc";

const supabaseUrl = "https://aqlztcsukugmsztrrkau.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxbHp0Y3N1a3VnbXN6dHJya2F1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc5NzQyMTgsImV4cCI6MjA1MzU1MDIxOH0.jjefq42swAHHFCfAjE66gDniK4fyJaYOl5iDNBfzmcc";
const supabase = createClient(supabaseUrl, supabaseKey);


const Main = () => {
  const [houseDetails, setHouseDetails] = useState({
    name: "",
    price: "",
    distance: "",
    address: "",
    landlordPhone: "",
 
    
    image1: "",
    image2: "",
    image3: "",
  });

  const handleChange = (key: keyof typeof houseDetails, value: string) => {
    setHouseDetails({ ...houseDetails, [key]: value });
  };

  const handleSubmit = async () => {
    const { data, error } = await supabase.from("House").insert([houseDetails]);
    if (error) {
      Alert.alert("Error", error.message);
    } else {
      Alert.alert("Success", "House added successfully!");
      setHouseDetails({
        name: "",
        price: "",
        distance: "",
        address: "",
        landlordPhone: "",
        description: "",
        image: "",
        image1: "", 
        image2: "",
        image3: "",
      });
    }
  };

  return (
    <ScrollView>
      <SafeAreaView style={tw`p-4 bg-white min-h-full`}>
        <Text style={tw`text-2xl font-bold mb-4`}>Landlord House Form</Text>
        <TextInput style={tw`border p-2 mb-2`} placeholder="House Name" onChangeText={(text) => handleChange("name", text)} value={houseDetails.name} />
        <TextInput style={tw`border p-2 mb-2`} placeholder="Price per month" keyboardType="numeric" onChangeText={(text) => handleChange("price", text)} value={houseDetails.price} />
        <TextInput style={tw`border p-2 mb-2`} placeholder="Distance to Campus" onChangeText={(text) => handleChange("distance", text)} value={houseDetails.distance} />
        <TextInput style={tw`border p-2 mb-2`} placeholder="Address" onChangeText={(text) => handleChange("address", text)} value={houseDetails.address} />
        <TextInput style={tw`border p-2 mb-2`} placeholder="Landlord Phone" keyboardType="phone-pad" onChangeText={(text) => handleChange("landlordPhone", text)} value={houseDetails.landlordPhone} />
        <TextInput style={tw`border p-2 mb-2`} placeholder="Description" multiline numberOfLines={4} onChangeText={(text) => handleChange("description", text)} value={houseDetails.description} />
        <TextInput style={tw`border p-2 mb-2`} placeholder="Image URL" onChangeText={(text) => handleChange("image", text)} value={houseDetails.image} />
        <TextInput style={tw`border p-2 mb-2`} placeholder="Additional Image 1 URL" onChangeText={(text) => handleChange("image1", text)} value={houseDetails.image1} />
        <TextInput style={tw`border p-2 mb-2`} placeholder="Additional Image 2 URL" onChangeText={(text) => handleChange("image2", text)} value={houseDetails.image2} />
        <TextInput style={tw`border p-2 mb-2`} placeholder="Additional Image 3 URL" onChangeText={(text) => handleChange("image3", text)} value={houseDetails.image3} />
        <TouchableOpacity style={tw`bg-blue-500 p-3 rounded`} onPress={handleSubmit}>
          <Text style={tw`text-white text-center text-lg`}>Submit</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </ScrollView>
  );
};

export default Main;
