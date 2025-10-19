import React from "react";
import { View } from "react-native";

export default function ScreenLayout({ children }:{ children:any }) {
  return <View style={{flex:1}}>{children}</View>;
}
