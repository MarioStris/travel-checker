import React from "react";
import Animated, { FadeInDown } from "react-native-reanimated";
import { TripCard } from "./TripCard";
import type { TripDTO } from "@travel-checker/shared/src/types";

interface AnimatedTripCardProps {
  trip: TripDTO;
  index: number;
  onPress?: () => void;
}

export function AnimatedTripCard({ trip, index, onPress }: AnimatedTripCardProps) {
  return (
    <Animated.View entering={FadeInDown.delay(index * 80).duration(400).springify()}>
      <TripCard trip={trip} onPress={onPress} />
    </Animated.View>
  );
}
