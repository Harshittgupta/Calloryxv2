import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import {
  ActivityIndicator,
  Button,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// Exp 05 imports
import PostItem from "./components/PostItem";
import { fetchPosts } from "./services/api";
import { getMeetingNote, saveMeetingNote } from "./storage/asyncstorage";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Provider, useDispatch, useSelector } from "react-redux";
import { createStore } from "redux";

/* ==========================================================
   1. REDUX — Actions, Reducer, Store
   Used for: meeting insights counter (global, shared state)
   ========================================================== */

// Action types
const INCREMENT_INSIGHTS = "INCREMENT_INSIGHTS";
const RESET_INSIGHTS = "RESET_INSIGHTS";

// Action creators
const incrementInsights = () => ({ type: INCREMENT_INSIGHTS });
const resetInsights = () => ({ type: RESET_INSIGHTS });

// Reducer
const insightsReducer = (state = { count: 42 }, action) => {
  switch (action.type) {
    case INCREMENT_INSIGHTS:
      return { ...state, count: state.count + 1 };
    case RESET_INSIGHTS:
      return { ...state, count: 0 };
    default:
      return state;
  }
};

// Redux Store
const store = createStore(insightsReducer);

/* ==========================================================
   2. CONTEXT API — Theme / User Context
   Used for: sharing logged-in user info across all screens
   ========================================================== */

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    name: "Harshit Gupta",
    email: "harshit@calloryx.ai",
    org: "Calloryx Pvt. Ltd.",
  });
  const [darkMode, setDarkMode] = useState(false);

  return (
    <UserContext.Provider value={{ user, setUser, darkMode, setDarkMode }}>
      {children}
    </UserContext.Provider>
  );
};

/* ==========================================================
   3. useREDUCER — Notes / Q&A local complex state
   Used for: managing Q&A answers (add / clear actions)
   ========================================================== */

const qaInitialState = {
  questions: [
    {
      id: 1,
      q: "What decisions were made?",
      a: "Deployment timeline confirmed for Friday. Backend tasks assigned to Harshit. QA to use staging-v2.",
    },
    {
      id: 2,
      q: "Any risks identified?",
      a: "API performance bottlenecks and potential testing delays were flagged. Mitigation plan discussed with QA team.",
    },
    {
      id: 3,
      q: "Who owns what?",
      a: "Harshit — backend API. Priya — release notes. QA Team — performance testing.",
    },
  ],
};

const qaReducer = (state, action) => {
  switch (action.type) {
    case "ADD_QUESTION":
      return {
        ...state,
        questions: [
          ...state.questions,
          { id: Date.now(), q: action.payload, a: "AI is analyzing..." },
        ],
      };
    case "CLEAR_ALL":
      return { ...state, questions: [] };
    default:
      return state;
  }
};

/* ==========================================================
   THEME HELPER
   ========================================================== */

const lightTheme = {
  bg: "#fff",
  card: "#fafafa",
  cardBorder: "#ddd",
  text: "#111",
  subtext: "#444",
  muted: "#888",
  input: "#fafafa",
  inputBorder: "#ccc",
  statBg: "#f5f5f5",
};

const darkTheme = {
  bg: "#121212",
  card: "#1e1e1e",
  cardBorder: "#333",
  text: "#f0f0f0",
  subtext: "#bbb",
  muted: "#777",
  input: "#2a2a2a",
  inputBorder: "#444",
  statBg: "#1a1a1a",
};

const useTheme = () => {
  const { darkMode } = useContext(UserContext);
  return darkMode ? darkTheme : lightTheme;
};

/* ================= COMMON COMPONENTS ================= */

const UserIcon = () => (
  <View style={styles.userIcon}>
    <Text style={styles.userIconText}>👤</Text>
  </View>
);

const Card = ({ title, children }) => {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.card, borderColor: theme.cardBorder },
      ]}
    >
      {title ? (
        <Text style={[styles.cardTitle, { color: theme.text }]}>{title}</Text>
      ) : null}
      {children}
    </View>
  );
};

const StatBox = ({ label, value }) => {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.statBox,
        { backgroundColor: theme.statBg, borderColor: theme.cardBorder },
      ]}
    >
      <Text style={[styles.statValue, { color: theme.text }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: theme.muted }]}>{label}</Text>
    </View>
  );
};

/* ================= LOGIN SCREEN ================= */

function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useContext(UserContext);
  const theme = useTheme();

  const handleLogin = () => {
    setUser({
      name: "Harshit Gupta",
      email: email || "harshit@calloryx.ai",
      org: "Calloryx Pvt. Ltd.",
    });
    navigation.replace("Main");
  };

  return (
    <ScrollView
      contentContainerStyle={[styles.center, { backgroundColor: theme.bg }]}
    >
      <UserIcon />
      <Text style={[styles.appName, { color: theme.text }]}>Calloryx</Text>
      <Text style={[styles.subtitle, { color: theme.muted }]}>
        AI Meeting Intelligence Platform
      </Text>

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.input,
            borderColor: theme.inputBorder,
            color: theme.text,
          },
        ]}
        placeholder="Work email"
        placeholderTextColor={theme.muted}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.input,
            borderColor: theme.inputBorder,
            color: theme.text,
          },
        ]}
        placeholder="Password"
        placeholderTextColor={theme.muted}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button title="Login" onPress={handleLogin} />

      <Text style={[styles.hint, { color: theme.muted }]}>
        Demo: harshit@calloryx.ai / 1234
      </Text>
    </ScrollView>
  );
}

/* ================= MEETINGS SCREEN ================= */

function MeetingsScreen() {
  const [search, setSearch] = useState("");
  const insightsCount = useSelector((state) => state.count);
  const dispatch = useDispatch();
  const { user } = useContext(UserContext);
  const theme = useTheme();

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { backgroundColor: theme.bg }]}
    >
      <Text style={[styles.title, { color: theme.text }]}>
        Meetings Dashboard
      </Text>
      <Text style={[styles.meta, { color: theme.subtext }]}>
        Welcome, {user.name}
      </Text>

      <View style={styles.statsRow}>
        <StatBox label="Total" value="18" />
        <StatBox label="Insights" value={insightsCount} />
        <StatBox label="Pending" value="3" />
      </View>

      <View style={styles.row}>
        <Button
          title="+ Add Insight"
          onPress={() => dispatch(incrementInsights())}
        />
        <View style={{ width: 10 }} />
        <Button
          title="Reset"
          color="gray"
          onPress={() => dispatch(resetInsights())}
        />
      </View>

      <View style={{ height: 14 }} />

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.input,
            borderColor: theme.inputBorder,
            color: theme.text,
          },
        ]}
        placeholder="Search meetings..."
        placeholderTextColor={theme.muted}
        value={search}
        onChangeText={setSearch}
      />

      <Card title="Sprint Review">
        <Text style={[styles.meta, { color: theme.subtext }]}>
          Status: Completed | Duration: 42 mins
        </Text>
        <Text style={[styles.meta, { color: theme.subtext }]}>
          Topics: API integration, Deployment
        </Text>
        <Text style={[styles.meta, { color: theme.subtext }]}>
          Participants: Harshit, Priya, Rohan
        </Text>
        <TouchableOpacity style={styles.btn}>
          <Text style={styles.btnText}>View Insights</Text>
        </TouchableOpacity>
      </Card>

      <Card title="Client Sync — TechMahindra">
        <Text style={[styles.meta, { color: theme.subtext }]}>
          Status: Upcoming | Today 4:30 PM
        </Text>
        <Text style={[styles.meta, { color: theme.subtext }]}>
          Participants: 5
        </Text>
      </Card>

      <Card title="Design Handoff">
        <Text style={[styles.meta, { color: theme.subtext }]}>
          Status: Completed | Duration: 28 mins
        </Text>
        <Text style={[styles.meta, { color: theme.subtext }]}>
          Topics: Figma, Components
        </Text>
        <Text style={[styles.meta, { color: theme.subtext }]}>
          Participants: Sneha, Karan, Divya
        </Text>
        <TouchableOpacity style={styles.btn}>
          <Text style={styles.btnText}>View Insights</Text>
        </TouchableOpacity>
      </Card>
    </ScrollView>
  );
}

/* ================= SUMMARY SCREEN ================= */

function SummaryScreen() {
  const theme = useTheme();
  return (
    <ScrollView
      contentContainerStyle={[styles.container, { backgroundColor: theme.bg }]}
    >
      <Text style={[styles.title, { color: theme.text }]}>Meeting Summary</Text>

      <Card title="Executive Summary">
        <Text style={[styles.bodyText, { color: theme.subtext }]}>
          The team finalized deployment timelines and assigned backend ownership
          to Harshit. QA handoff is scheduled for Thursday. Cross-team blockers
          were resolved.
        </Text>
      </Card>

      <Card title="Action Items">
        <Text style={[styles.meta, { color: theme.subtext }]}>
          • Complete backend API integration — Harshit (Thu)
        </Text>
        <Text style={[styles.meta, { color: theme.subtext }]}>
          • Prepare release notes — Priya (Wed)
        </Text>
        <Text style={[styles.meta, { color: theme.subtext }]}>
          • Conduct performance testing — QA Team (Fri)
        </Text>
      </Card>

      <Card title="Key Decisions">
        <Text style={[styles.meta, { color: theme.subtext }]}>
          • Deployment confirmed for Friday 6 PM IST
        </Text>
        <Text style={[styles.meta, { color: theme.subtext }]}>
          • Harshit leads backend until handoff
        </Text>
        <Text style={[styles.meta, { color: theme.subtext }]}>
          • Staging-v2 environment approved for testing
        </Text>
      </Card>
    </ScrollView>
  );
}

/* ================= TRANSCRIPT SCREEN ================= */

function TranscriptScreen() {
  const theme = useTheme();
  return (
    <ScrollView
      contentContainerStyle={[styles.container, { backgroundColor: theme.bg }]}
    >
      <Text style={[styles.title, { color: theme.text }]}>Transcript</Text>

      <Card title="Sprint Review — 42:17">
        <Text style={[styles.meta, { color: theme.subtext }]}>
          0:32 Harshit: Let's finalize the endpoints today.
        </Text>
        <Text style={[styles.meta, { color: theme.subtext }]}>
          1:14 Priya: AI summary looks accurate. We should adopt this.
        </Text>
        <Text style={[styles.meta, { color: theme.subtext }]}>
          3:05 Rohan: Deployment confirmed for Friday. Align by Thursday EOD.
        </Text>
        <Text style={[styles.meta, { color: theme.subtext }]}>
          5:47 Harshit: I'll handle backend. API rate limits need adjustment.
        </Text>
        <Text style={[styles.meta, { color: theme.subtext }]}>
          9:22 Priya: I'll update the Confluence docs.
        </Text>
      </Card>

      <Card title="Talk Time">
        <Text style={[styles.meta, { color: theme.subtext }]}>
          Harshit — 42%
        </Text>
        <Text style={[styles.meta, { color: theme.subtext }]}>Priya — 35%</Text>
        <Text style={[styles.meta, { color: theme.subtext }]}>Rohan — 23%</Text>
      </Card>
    </ScrollView>
  );
}

/* ================= Q&A SCREEN (useReducer) ================= */

function QAScreen() {
  const [qaState, qaDispatch] = useReducer(qaReducer, qaInitialState);
  const [query, setQuery] = useState("");
  const theme = useTheme();

  const handleAsk = () => {
    if (query.trim() === "") return;
    qaDispatch({ type: "ADD_QUESTION", payload: query });
    setQuery("");
  };

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { backgroundColor: theme.bg }]}
    >
      <Text style={[styles.title, { color: theme.text }]}>AI Q&A</Text>
      <Text style={[styles.hint, { color: theme.muted }]}>
        State managed with useReducer
      </Text>

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.input,
            borderColor: theme.inputBorder,
            color: theme.text,
          },
        ]}
        placeholder="Ask something about this meeting..."
        placeholderTextColor={theme.muted}
        value={query}
        onChangeText={setQuery}
      />

      <View style={styles.row}>
        <Button title="Ask AI" onPress={handleAsk} />
        <View style={{ width: 10 }} />
        <Button
          title="Clear All"
          color="gray"
          onPress={() => qaDispatch({ type: "CLEAR_ALL" })}
        />
      </View>

      <View style={{ height: 16 }} />

      {qaState.questions.length === 0 && (
        <Text style={[styles.meta, { color: theme.muted }]}>
          No questions yet. Ask something above.
        </Text>
      )}

      {qaState.questions.map((item) => (
        <Card key={item.id} title={`Q: ${item.q}`}>
          <Text style={[styles.bodyText, { color: theme.subtext }]}>
            {item.a}
          </Text>
        </Card>
      ))}
    </ScrollView>
  );
}

/* ================= POSTS SCREEN (Exp 05) ================= */
// Demonstrates: Fetch API + async/await + FlatList + AsyncStorage

function PostsScreen() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState("");
  const [savedNote, setSavedNote] = useState("");
  const theme = useTheme();

  // Fetch API with async/await on mount
  useEffect(() => {
    loadPosts();
    loadNote();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    const data = await fetchPosts(); // services/api.js
    setPosts(data);
    setLoading(false);
  };

  // AsyncStorage — save note
  const handleSaveNote = async () => {
    await saveMeetingNote(note); // storage/asyncstorage.js
    alert("Note saved to AsyncStorage!");
  };

  // AsyncStorage — retrieve note
  const loadNote = async () => {
    const stored = await getMeetingNote(); // storage/asyncstorage.js
    if (stored) setSavedNote(stored);
  };

  return (
    <View style={[styles.container, { flex: 1, backgroundColor: theme.bg }]}>
      <Text style={[styles.title, { color: theme.text }]}>
        Posts (Fetch API)
      </Text>
      <Text style={[styles.hint, { color: theme.muted }]}>
        Data fetched from JSONPlaceholder using async/await
      </Text>

      {/* AsyncStorage note saver */}
      <View
        style={[
          styles.card,
          { backgroundColor: theme.card, borderColor: theme.cardBorder },
        ]}
      >
        <Text style={[styles.cardTitle, { color: theme.text }]}>
          Meeting Note (AsyncStorage)
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.input,
              borderColor: theme.inputBorder,
              color: theme.text,
            },
          ]}
          placeholder="Type a note to save locally..."
          placeholderTextColor={theme.muted}
          value={note}
          onChangeText={setNote}
        />
        <View style={styles.row}>
          <Button title="Save Note" onPress={handleSaveNote} />
          <View style={{ width: 10 }} />
          <Button title="Load Note" onPress={loadNote} color="gray" />
        </View>
        {savedNote !== "" && (
          <Text style={[styles.meta, { color: theme.subtext, marginTop: 8 }]}>
            Saved: {savedNote}
          </Text>
        )}
      </View>

      <Text style={[styles.cardTitle, { color: theme.text, marginBottom: 8 }]}>
        API Posts (FlatList)
      </Text>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#4A90E2"
          style={{ marginTop: 20 }}
        />
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <PostItem item={item} />} // components/PostItem.js
          ListEmptyComponent={
            <Text style={[styles.meta, { color: theme.muted }]}>
              No posts loaded.
            </Text>
          }
        />
      )}
    </View>
  );
}

/* ================= INSIGHTS TOP TABS ================= */

const TopTab = createMaterialTopTabNavigator();

function InsightsTopTabs() {
  return (
    <TopTab.Navigator>
      <TopTab.Screen name="Summary" component={SummaryScreen} />
      <TopTab.Screen name="Transcript" component={TranscriptScreen} />
      <TopTab.Screen name="Q&A" component={QAScreen} />
    </TopTab.Navigator>
  );
}

/* ================= BOTTOM TABS ================= */

const BottomTab = createBottomTabNavigator();

function HomeTabs() {
  return (
    <BottomTab.Navigator>
      <BottomTab.Screen name="Meetings" component={MeetingsScreen} />
      <BottomTab.Screen name="Insights" component={InsightsTopTabs} />
      <BottomTab.Screen name="Posts" component={PostsScreen} />
    </BottomTab.Navigator>
  );
}

/* ================= SETTINGS SCREEN ================= */

function SettingsScreen() {
  const { user, setUser, darkMode, setDarkMode } = useContext(UserContext);
  const [editName, setEditName] = useState(user.name);
  const theme = useTheme();

  const handleSave = () => {
    setUser({ ...user, name: editName });
  };

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { backgroundColor: theme.bg }]}
    >
      <View style={styles.profileSection}>
        <UserIcon />
        <Text style={[styles.profileName, { color: theme.text }]}>
          {user.name}
        </Text>
        <Text style={[styles.profileEmail, { color: theme.muted }]}>
          {user.email}
        </Text>
      </View>

      <Card title="Edit Profile (Context API)">
        <Text style={[styles.meta, { color: theme.subtext }]}>
          Display Name:
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.input,
              borderColor: theme.inputBorder,
              color: theme.text,
            },
          ]}
          value={editName}
          onChangeText={setEditName}
        />
        <Button title="Save Name" onPress={handleSave} />
      </Card>

      <Card title="Appearance">
        <View style={styles.row}>
          <Text style={[styles.meta, { flex: 1, color: theme.subtext }]}>
            Dark Mode
          </Text>
          <TouchableOpacity
            style={[
              styles.toggle,
              { backgroundColor: darkMode ? "#4A90E2" : "#ccc" },
            ]}
            onPress={() => setDarkMode(!darkMode)}
          >
            <View
              style={[
                styles.toggleKnob,
                { alignSelf: darkMode ? "flex-end" : "flex-start" },
              ]}
            />
          </TouchableOpacity>
        </View>
        <Text style={[styles.hint, { color: theme.muted, marginTop: 4 }]}>
          Currently: {darkMode ? "Dark" : "Light"} mode
        </Text>
      </Card>

      <Card title="Profile">
        <Text style={[styles.meta, { color: theme.subtext }]}>
          Name: {user.name}
        </Text>
        <Text style={[styles.meta, { color: theme.subtext }]}>
          Email: {user.email}
        </Text>
        <Text style={[styles.meta, { color: theme.subtext }]}>
          Organization: {user.org}
        </Text>
        <Text style={[styles.meta, { color: theme.subtext }]}>
          Timezone: IST (UTC+5:30)
        </Text>
      </Card>

      <Card title="AI Preferences">
        <Text style={[styles.meta, { color: theme.subtext }]}>
          Auto Summary: Enabled
        </Text>
        <Text style={[styles.meta, { color: theme.subtext }]}>
          Transcript Language: English
        </Text>
        <Text style={[styles.meta, { color: theme.subtext }]}>
          AI Model: GPT-4 Turbo
        </Text>
      </Card>

      <Card title="Notifications">
        <Text style={[styles.meta, { color: theme.subtext }]}>
          Meeting Reminders: 15 min before
        </Text>
        <Text style={[styles.meta, { color: theme.subtext }]}>
          Insight Alerts: Enabled
        </Text>
        <Text style={[styles.meta, { color: theme.subtext }]}>
          Weekly Reports: Monday 9 AM
        </Text>
      </Card>
    </ScrollView>
  );
}

/* ================= LOGOUT SCREEN ================= */

function LogoutScreen({ navigation }) {
  const theme = useTheme();
  return (
    <View style={[styles.center, { backgroundColor: theme.bg }]}>
      <UserIcon />
      <Text style={[styles.title, { color: theme.text }]}>Logout</Text>
      <Text style={[styles.meta, { color: theme.subtext }]}>
        Are you sure you want to log out?
      </Text>
      <View style={{ height: 16 }} />
      <Button
        title="Confirm Logout"
        onPress={() => navigation.replace("Login")}
      />
    </View>
  );
}

/* ================= DRAWER + STACK ================= */

const Drawer = createDrawerNavigator();

function DrawerNavigator() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Home" component={HomeTabs} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
      <Drawer.Screen name="Logout" component={LogoutScreen} />
    </Drawer.Navigator>
  );
}

const Stack = createNativeStackNavigator();

function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Main" component={DrawerNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

/* ================= ROOT — wrap with Redux Provider + UserContext ================= */

export default function App() {
  return (
    <Provider store={store}>
      {" "}
      {/* Redux Provider */}
      <UserProvider>
        {" "}
        {/* Context API Provider */}
        <AppNavigator />
      </UserProvider>
    </Provider>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  center: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  container: {
    padding: 16,
    backgroundColor: "#fff",
  },
  appName: {
    fontSize: 26,
    fontWeight: "bold",
    marginTop: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#111",
  },
  subtitle: {
    fontSize: 13,
    color: "#666",
    marginBottom: 24,
  },
  hint: {
    fontSize: 12,
    color: "#aaa",
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
    width: "100%",
    fontSize: 14,
    backgroundColor: "#fafafa",
  },
  userIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  userIconText: {
    fontSize: 38,
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 20,
    paddingTop: 8,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 6,
    color: "#111",
  },
  profileEmail: {
    fontSize: 13,
    color: "#666",
  },
  card: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 14,
    marginBottom: 14,
    backgroundColor: "#fafafa",
  },
  cardTitle: {
    fontWeight: "600",
    fontSize: 15,
    marginBottom: 8,
    color: "#222",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  statBox: {
    flex: 1,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginHorizontal: 4,
    backgroundColor: "#f5f5f5",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  statLabel: {
    fontSize: 11,
    color: "#888",
    marginTop: 2,
  },
  meta: {
    fontSize: 13,
    color: "#444",
    marginBottom: 4,
    lineHeight: 20,
  },
  bodyText: {
    fontSize: 13,
    color: "#444",
    lineHeight: 20,
  },
  btn: {
    marginTop: 10,
    backgroundColor: "#4A90E2",
    padding: 8,
    borderRadius: 6,
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  toggle: {
    width: 46,
    height: 26,
    borderRadius: 13,
    padding: 3,
    justifyContent: "center",
  },
  toggleKnob: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
  },
});
