import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Animated, StyleSheet, TouchableWithoutFeedback, View } from "react-native";

interface EmojiCardProps {
 emoji: string;
 isFlipped: boolean;
 isMatched: boolean;
 onPress: () => void;
}

export const EmojiCard: React.FC<EmojiCardProps> = ({ emoji, isFlipped, isMatched, onPress }) => {
 const flipAnimation = React.useRef(new Animated.Value(0)).current;
 const scaleAnimation = React.useRef(new Animated.Value(1)).current;

 React.useEffect(() => {
  Animated.spring(flipAnimation, {
   toValue: isFlipped ? 1 : 0,
   friction: 8,
   tension: 10,
   useNativeDriver: true,
  }).start();
 }, [isFlipped]);

 const handlePressIn = () => {
  Animated.spring(scaleAnimation, {
   toValue: 0.85,
   friction: 3,
   tension: 40,
   useNativeDriver: true,
  }).start();
 };

 const handlePressOut = () => {
  Animated.spring(scaleAnimation, {
   toValue: 1,
   friction: 3,
   tension: 40,
   useNativeDriver: true,
  }).start();
 };

 const frontInterpolate = flipAnimation.interpolate({
  inputRange: [0, 1],
  outputRange: ["0deg", "180deg"],
 });

 const backInterpolate = flipAnimation.interpolate({
  inputRange: [0, 1],
  outputRange: ["180deg", "360deg"],
 });

 const frontAnimatedStyle = {
  transform: [{ rotateY: frontInterpolate }, { scale: scaleAnimation }],
 };

 const backAnimatedStyle = {
  transform: [{ rotateY: backInterpolate }, { scale: scaleAnimation }],
 };

 return (
  <TouchableWithoutFeedback onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut} disabled={isFlipped || isMatched}>
   <Animated.View style={styles.container}>
    <Animated.View style={[styles.card, frontAnimatedStyle]}>
     <View style={styles.cardInner}>
      <MaterialCommunityIcons name="help-circle" size={40} color="#666" />
     </View>
    </Animated.View>
    <Animated.View style={[styles.card, styles.cardBack, backAnimatedStyle]}>
     <View style={styles.cardInner}>
      <MaterialCommunityIcons name={emoji as any} size={40} color={isMatched ? "#4CAF50" : "#333"} />
     </View>
    </Animated.View>
   </Animated.View>
  </TouchableWithoutFeedback>
 );
};

const styles = StyleSheet.create({
 container: {
  width: 77,
  height: 77,
  margin: 3,
 },
 card: {
  width: "100%",
  height: "100%",
  position: "absolute",
  backfaceVisibility: "hidden",
  borderRadius: 10,
  backgroundColor: "#fff",
  shadowColor: "#000",
  shadowOffset: {
   width: 0,
   height: 2,
  },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
 },
 cardBack: {
  backgroundColor: "#f0f0f0",
 },
 cardInner: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
 },
});
