import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import { EmojiCard } from "../components/EmojiCard";
import { useMemoryGame } from "../hooks/useMemoryGame";

export default function MemoryGame() {
 const router = useRouter();
 const { cards, moves, isGameComplete, initializeGame, flipCard, matchResult } = useMemoryGame();

 const restartScale = useRef(new Animated.Value(1)).current;
 const movesFlip = useRef(new Animated.Value(0)).current;
 const statusFlip = useRef(new Animated.Value(0)).current;
 const clickSound = useRef<Audio.Sound | null>(null);
 const successSound = useRef<Audio.Sound | null>(null);
 const wrongSound = useRef<Audio.Sound | null>(null);

 useEffect(() => {
  // Initialize the game when the component mounts
  initializeGame();
 }, []);

 useEffect(() => {
  const loadSounds = async () => {
   try {
    const [click, success, wrong] = await Promise.all([
     Audio.Sound.createAsync(require("../assets/sounds/click.mp3")),
     Audio.Sound.createAsync(require("../assets/sounds/success.mp3")),
     Audio.Sound.createAsync(require("../assets/sounds/wrong.mp3")),
    ]);

    clickSound.current = click.sound;
    successSound.current = success.sound;
    wrongSound.current = wrong.sound;
   } catch (error) {
    console.error("Error loading sounds:", error);
   }
  };

  loadSounds();

  return () => {
   // Cleanup
   clickSound.current?.unloadAsync();
   successSound.current?.unloadAsync();
   wrongSound.current?.unloadAsync();
  };
 }, []);

 useEffect(() => {
  // Animate moves counter with flip effect
  movesFlip.setValue(0);
  Animated.sequence([
   Animated.timing(movesFlip, {
    toValue: 1,
    duration: 150,
    useNativeDriver: true,
   }),
   Animated.timing(movesFlip, {
    toValue: 0,
    duration: 150,
    useNativeDriver: true,
   }),
  ]).start();
 }, [moves]);

 useEffect(() => {
  // Animate status with flip effect
  statusFlip.setValue(0);
  Animated.sequence([
   Animated.timing(statusFlip, {
    toValue: 1,
    duration: 150,
    useNativeDriver: true,
   }),
   Animated.timing(statusFlip, {
    toValue: 0,
    duration: 150,
    useNativeDriver: true,
   }),
  ]).start();
 }, [isGameComplete]);

 useEffect(() => {
  if (matchResult === "correct") {
   successSound.current?.replayAsync();
  } else if (matchResult === "incorrect") {
   wrongSound.current?.replayAsync();
  }
 }, [matchResult]);

 const handlePressIn = (scale: Animated.Value) => {
  Animated.spring(scale, {
   toValue: 0.85,
   friction: 3,
   tension: 40,
   useNativeDriver: true,
  }).start();
 };

 const handlePressOut = (scale: Animated.Value) => {
  Animated.spring(scale, {
   toValue: 1,
   friction: 3,
   tension: 40,
   useNativeDriver: true,
  }).start();
 };

 const movesInterpolate = movesFlip.interpolate({
  inputRange: [0, 1],
  outputRange: ["0deg", "180deg"],
 });

 const statusInterpolate = statusFlip.interpolate({
  inputRange: [0, 1],
  outputRange: ["0deg", "180deg"],
 });

 return (
  <View style={styles.container}>
   <View style={styles.stats}>
    <View style={styles.statContainer}>
     <MaterialCommunityIcons name="counter" size={24} color="#FFD700" />
     <View style={styles.statTextContainer}>
      <Text style={styles.statText}>Moves: </Text>
      <Animated.View style={{ transform: [{ rotateX: movesInterpolate }] }}>
       <Text style={styles.statText}>{moves}</Text>
      </Animated.View>
     </View>
    </View>

    <View style={styles.statContainer}>
     <MaterialCommunityIcons name={isGameComplete ? "trophy" : "gamepad-variant"} size={24} color="#FFD700" />
     <Animated.View style={{ transform: [{ rotateX: statusInterpolate }] }}>
      <Text style={[styles.statText, isGameComplete && styles.completeText]}>{isGameComplete ? "Complete!" : "In Progress"}</Text>
     </Animated.View>
    </View>
   </View>

   <View style={styles.grid}>
    {cards.map((card, index) => (
     <View key={index} style={styles.cardContainer}>
      <EmojiCard emoji={card.emoji} isFlipped={card.isFlipped} isMatched={card.isMatched} onPress={() => flipCard(card.id)} />
     </View>
    ))}
   </View>

   <TouchableWithoutFeedback
    onPressIn={() => handlePressIn(restartScale)}
    onPressOut={() => handlePressOut(restartScale)}
    onPress={() => {
     Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
     initializeGame();
    }}
   >
    <Animated.View style={[styles.restartButton, { transform: [{ scale: restartScale }] }]}>
     <MaterialCommunityIcons name="restart" size={24} color="#fff" />
     <Text style={styles.buttonText}>Restart Game</Text>
    </Animated.View>
   </TouchableWithoutFeedback>
  </View>
 );
}

const styles = StyleSheet.create({
 container: {
  flex: 1,
  backgroundColor: "#1a1a2e",
  padding: 20,
 },
 stats: {
  flexDirection: "row",
  justifyContent: "space-around",
  marginTop: 40,
  marginBottom: 45,
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  borderRadius: 16,
  padding: 16,
  shadowColor: "#000",
  shadowOffset: {
   width: 0,
   height: 2,
  },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 2,
 },
 statContainer: {
  flexDirection: "row",
  alignItems: "center",

  gap: 8,
 },
 statText: {
  color: "#fff",
  fontSize: 18,
  fontWeight: "bold",
  textShadowColor: "rgba(0, 0, 0, 0.75)",
  textShadowOffset: { width: 1, height: 1 },
  textShadowRadius: 2,
 },
 completeText: {
  color: "#FFD700",
  fontWeight: "bold",
 },
 grid: {
  flex: 1,
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "center",
  gap: 4,
  paddingHorizontal: 0,
 },
 cardContainer: {
  width: "24%", // Slightly less than 25% to account for gaps
  aspectRatio: 1,
 },
 restartButton: {
  backgroundColor: "#e94560",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  paddingHorizontal: 12,
  paddingVertical: 12,
  borderRadius: 12,
  marginTop: 20,
  alignSelf: "center",
  width: 230,
  shadowColor: "#000",
  shadowOffset: {
   width: 0,
   height: 2,
  },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
 },
 buttonText: {
  color: "#fff",
  fontSize: 14,
  fontWeight: "bold",
  marginLeft: 4,
 },
 statTextContainer: {
  flexDirection: "row",
  alignItems: "center",
 },
});
