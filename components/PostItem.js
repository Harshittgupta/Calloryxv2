// components/PostItem.js
// Exp 05 — Reusable component used inside FlatList
// Displays a single post fetched from the API

import { StyleSheet, Text, View } from "react-native";

const PostItem = ({ item }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.id}>#{item.id}</Text>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.body} numberOfLines={2}>
        {item.body}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    backgroundColor: "#fafafa",
  },
  id: {
    fontSize: 11,
    color: "#aaa",
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#222",
    marginBottom: 4,
    textTransform: "capitalize",
  },
  body: {
    fontSize: 12,
    color: "#666",
    lineHeight: 18,
  },
});

export default PostItem;
