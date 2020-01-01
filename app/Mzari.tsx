import React, { useEffect, useState } from "react";
import { Text, View, Image, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "twrnc";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://aqlztcsukugmsztrrkau.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxbHp0Y3N1a3VnbXN6dHJya2F1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc5NzQyMTgsImV4cCI6MjA1MzU1MDIxOH0.jjefq42swAHHFCfAjE66gDniK4fyJaYOl5iDNBfzmcc";
const supabase = createClient(supabaseUrl, supabaseKey);
import Header from "./Components/Header";

const Mzari: React.FC = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [searchQuery, setSearchQuery] = useState("");
  const [houses, setHouses] = useState<any[]>([]);

  useEffect(() => {
    const fetchHouses = async () => {
      const { data, error } = await supabase.from("House").select("id, name, distance, price, landlordName, landlordPhone, Image, address");
      if (error) {
        console.error("Error fetching houses:", error);
      } else {
        setHouses(data);
      }
    };
    fetchHouses();
  }, []);

  const filteredHouses = houses.filter((house) =>
    house.name.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
    house.distance.includes(searchQuery.trim()) ||
    house.price.toString().includes(searchQuery.trim())
  );

  return (
    <ScrollView>
      <SafeAreaView style={tw`py-4`}>
        <Header title="" />
        <View style={tw`mx-2 mt-4`}>
          <View style={tw`flex flex-row justify-between items-center`}>
            <View>
              <Text style={tw`text-black font-bold text-2xl`}>Your Accommodation</Text>
              <Text style={tw`text-black font-bold text-2xl`}>In Chinhoyi!</Text>
            </View>
         
          </View>

          <View style={tw`mt-10 w-full rounded-xl h-10 bg-gray-200 flex flex-row items-center px-2`}>
            <Ionicons name="search" size={20} color="gray" />
            <TextInput
              style={tw`ml-2 flex-1`}
              placeholder="Search by name, price, or distance"
              placeholderTextColor="gray"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <FontAwesome name="exchange" size={20} color="orange" style={tw`border-l pl-4 border-gray-400`} />
          </View>

          <Text style={tw`text-black text-xl pt-6`}>Available Houses</Text>
          {filteredHouses.length > 0 ? (
            <View style={tw`mt-4 flex flex-wrap flex-row`}>
              {filteredHouses.map((house, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={tw`flex px-2 w-1/2`}
                  onPress={() => {
                    console.log("Navigating with house:", house);
                    navigation.navigate("HouseDetail", { house });
                  }}
                >
                  <Image 
                    source={{ uri: house?.Image || "https://via.placeholder.com/150" }} 
                    style={tw`rounded-xl mt-4 w-full h-45`} 
                  />
                  <Text style={tw`text-black font-semibold text-xl pt-1`}>
                    {house?.name || "Unknown House"}
                  </Text>
                  <Text style={tw`text-black text-3 font-2`}>
                    {house?.distance ? `${house.distance} to Campus` : "Distance unavailable"}
                  </Text>
                  <Text style={tw`text-black font-semibold text-3 pt-1`}>
                    {house?.price ? `${house.price}/month` : "Price unavailable"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <Text style={tw`text-center text-gray-500 mt-4`}>No houses available</Text>
          )}
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default Mzari;
