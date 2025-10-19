import React from "react";
import { View, Text } from "react-native";

/**
 * Root / index screen (safe to create)
 * Created: 2025-10-19T08:48:30.733Z
 */

export default function HomeScreen() {
  return (
    <ThemedView style={{flex:1, alignItems:'center', justifyContent:'center'}}>
      <ThemedText>HomeScreen</ThemedText>
    </View>
  );
}
