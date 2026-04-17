// components/Counter.js
// Exp 07 — Simple Counter component used for UI/component testing with Jest

import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <View>
      <Text testID="count">Count: {count}</Text>
      <Button
        title="Increment"
        onPress={() => setCount(count + 1)}
      />
    </View>
  );
}
