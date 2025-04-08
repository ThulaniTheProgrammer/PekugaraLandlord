import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import uuid from "react-native-uuid";
import { createClient } from "@supabase/supabase-js";
import tw from "twrnc";
import { Buffer } from "buffer";
global.Buffer = Buffer;

// ⚠️ Move these to .env in production
const supabaseUrl = "https://aqlztcsukugmsztrrkau.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxbHp0Y3N1a3VnbXN6dHJya2F1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc5NzQyMTgsImV4cCI6MjA1MzU1MDIxOH0.jjefq42swAHHFCfAjE66gDniK4fyJaYOl5iDNBfzmcc";

const supabase = createClient(supabaseUrl, supabaseKey);

const Main = () => {
  const [houseDetails, setHouseDetails] = useState({
    name: "",
    price: "",
    distance: "",
    address: "",
    landlordPhone: "",
  });

  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (key: keyof typeof houseDetails, value: string) => {
    setHouseDetails({ ...houseDetails, [key]: value });
  };

  const pickImages = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 3,
      quality: 0.7,
    });

    if (!result.canceled) {
      const uris = result.assets.map((asset) => asset.uri).slice(0, 3);
      setImages(uris);
    }
  };

  const uploadImages = async (): Promise<string[]> => {
    const uploadedUrls: string[] = [];

    for (const uri of images) {
      try {
        const fileExt = uri.split(".").pop();
        const fileName = `${uuid.v4()}.${fileExt}`;
        const filePath = `houses/${fileName}`;

        const fileData = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        const buffer = Buffer.from(fileData, "base64");

        const { error } = await supabase.storage
          .from("buck")
          .upload(filePath, buffer, {
            contentType: "image/jpeg",
            upsert: true,
          });

        if (error) {
          throw new Error("Upload failed: " + error.message);
        }

        const { data } = supabase.storage.from("buck").getPublicUrl(filePath);
        uploadedUrls.push(data.publicUrl);
      } catch (err) {
        console.error("Upload failed for image:", uri, err);
        throw err;
      }
    }

    return uploadedUrls;
  };

  const handleSubmit = async () => {
    const { name, price, distance, address, landlordPhone } = houseDetails;

    if (!name || !price || !distance || !address || !landlordPhone) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    if (images.length === 0) {
      Alert.alert("Error", "Please select at least one image.");
      return;
    }

    setLoading(true);

    try {
      const imageUrls = await uploadImages();

      const houseData = {
        ...houseDetails,
        Image1: imageUrls[0] || null,
        Image2: imageUrls[1] || null,
        Image3: imageUrls[2] || null,
      };

      const { data, error } = await supabase.from("House").insert([houseData]);

      setLoading(false);

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
        });
        setImages([]);
      }
    } catch (err: any) {
      setLoading(false);
      Alert.alert("Upload Error", err.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={tw`flex-1 bg-white`}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView keyboardShouldPersistTaps="handled">
        <SafeAreaView style={tw`px-4`}>
          {/* Logo */}
          <View style={tw`items-left mt-6`}>
            <Image
              source={require("../assets/images/logo.png")}
              style={tw`w-24 h-24`}
            />
          </View>

          {/* Title */}
          <Text style={tw`text-black font-bold text-2xl mt-4 text-left`}>
            REGISTER HOUSE
          </Text>
          <Text style={tw`text-gray-500 text-left mb-4`}>
            Add house details below
          </Text>

          {/* Input Fields */}
          <View style={tw`mt-2`}>
            <TextInput
              placeholder="House Name"
              placeholderTextColor="#ccc"
              style={tw`bg-white text-black p-3 rounded-lg border border-gray-300 mb-3`}
              onChangeText={(text) => handleChange("name", text)}
              value={houseDetails.name}
            />
            <TextInput
              placeholder="Price per month"
              placeholderTextColor="#ccc"
              keyboardType="numeric"
              style={tw`bg-white text-black p-3 rounded-lg border border-gray-300 mb-3`}
              onChangeText={(text) => handleChange("price", text)}
              value={houseDetails.price}
            />
            <TextInput
              placeholder="Distance to Campus"
              placeholderTextColor="#ccc"
              style={tw`bg-white text-black p-3 rounded-lg border border-gray-300 mb-3`}
              onChangeText={(text) => handleChange("distance", text)}
              value={houseDetails.distance}
            />
            <TextInput
              placeholder="Address"
              placeholderTextColor="#ccc"
              style={tw`bg-white text-black p-3 rounded-lg border border-gray-300 mb-3`}
              onChangeText={(text) => handleChange("address", text)}
              value={houseDetails.address}
            />
            <TextInput
              placeholder="Landlord Phone (e.g. +263...)"
              placeholderTextColor="#ccc"
              keyboardType="phone-pad"
              maxLength={13}
              style={tw`bg-white text-black p-3 rounded-lg border border-gray-300`}
              onChangeText={(text) => handleChange("landlordPhone", text)}
              value={houseDetails.landlordPhone}
            />
          </View>

          {/* Image Picker */}
          <TouchableOpacity
            style={tw`w-full bg-gray-200 rounded-xl mt-4 p-3`}
            onPress={pickImages}
          >
            <Text style={tw`text-center text-black`}>
              Select Images (Max 3)
            </Text>
          </TouchableOpacity>

          {/* Selected Thumbnails */}
          <View style={tw`flex-row mt-2`}>
            {images.map((uri, index) => (
              <Image
                key={index}
                source={{ uri }}
                style={tw`w-20 h-20 mr-2 rounded-lg`}
              />
            ))}
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={tw`w-full bg-[#ff914d] rounded-xl mt-6 p-3`}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={tw`text-center text-white font-semibold text-lg`}>
                Submit
              </Text>
            )}
          </TouchableOpacity>
        </SafeAreaView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Main;
