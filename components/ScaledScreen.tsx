import { BASE_WIDTH } from "@/constants/responsive";
import React from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";

interface Props {
  children: React.ReactNode;
}

/**
 * Wraps screen content in a uniformly-scaled View.
 * Everything inside scales proportionally to the device width.
 * Mount this INSIDE SafeAreaView, wrapping all your content.
 *
 * How it works:
 *  - The inner View is always BASE_WIDTH (390) wide in layout terms.
 *  - We translate it to be centered in the real device screen, then apply
 *    scale = deviceWidth / BASE_WIDTH so it visually fills the screen.
 *  - Because transforms also apply to touch coordinates, tap targets
 *    align perfectly with the visual layout.
 */
export default function ScaledScreen({ children }: Props) {
  const { width } = useWindowDimensions();
  const scale = width / BASE_WIDTH;
  // translateX centers the BASE_WIDTH view inside the real-width container
  // so that scaling from the center keeps the content filling edge-to-edge.
  const offsetX = (width - BASE_WIDTH) / 2;

  return (
    <View style={styles.outer}>
      <View
        style={[
          styles.inner,
          { transform: [{ translateX: offsetX }, { scale }] },
        ]}
      >
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: { flex: 1, overflow: "hidden" },
  inner: { flex: 1, width: BASE_WIDTH },
});
