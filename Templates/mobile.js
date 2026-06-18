'use strict';

module.exports = function getMobileFiles(projectName) {
  return {

// ─── package.json ─────────────────────────────────────────────────────────────
'package.json': `{
  "name": "${projectName}",
  "version": "1.0.0",
  "main": "expo-router/entry",
  "scripts": {
    "start":   "expo start",
    "android": "expo run:android",
    "ios":     "expo run:ios",
    "web":     "expo start --web",
    "test":    "jest --passWithNoTests"
  },
  "dependencies": {
    "expo":                          "~53.0.0",
    "expo-router":                   "~5.1.11",
    "expo-status-bar":               "~2.2.3",
    "expo-splash-screen":            "~0.30.10",
    "expo-constants":                "~17.0.8",
    "expo-linking":                  "~7.0.5",
    "react":                         "19.0.0",
    "react-native":                  "0.79.6",
    "react-native-safe-area-context":"5.4.0",
    "react-native-screens":          "~4.11.1",
    "@reduxjs/toolkit":              "^2.5.1",
    "@react-navigation/native":      "^7.1.6",
    "react-redux":                   "^9.2.0",
    "axios":                         "^1.7.9"
  },
  "devDependencies": {
    "@babel/core":        "^7.25.2",
    "typescript":         "~5.8.3",
    "@types/react":       "~19.0.10",
    "jest":               "^29.7.0",
    "@types/jest":        "^29.5.14",
    "jest-expo":          "~53.0.0"
  }
}`,

// ─── app.json ─────────────────────────────────────────────────────────────────
'app.json': `{
  "expo": {
    "name": "${projectName}",
    "slug": "${projectName}",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "${projectName}",
    "userInterfaceStyle": "automatic",
    "newArchEnabled": true,
    "splash": {
      "image":           "./assets/images/splash-icon.png",
      "resizeMode":      "contain",
      "backgroundColor": "#ffffff"
    },
    "ios":     { "supportsTablet": true },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      }
    },
    "web": {
      "bundler": "metro",
      "output":  "static",
      "favicon": "./assets/images/favicon.png"
    },
    "plugins":     ["expo-router"],
    "experiments": { "typedRoutes": true }
  }
}`,

// ─── tsconfig.json ────────────────────────────────────────────────────────────
'tsconfig.json': `{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "paths": {
      "@/*": ["./*"]
    }
  }
}`,

// ─── babel.config.js ──────────────────────────────────────────────────────────
'babel.config.js': `module.exports = function (api) {
  api.cache(true)
  return {
    presets: ['babel-preset-expo'],
  }
}`,

// ─── app/_layout.tsx ──────────────────────────────────────────────────────────
'app/_layout.tsx': `import { Stack }        from 'expo-router'
import { StatusBar }     from 'expo-status-bar'
import { Provider }      from 'react-redux'
import { store }         from '@/store'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect }     from 'react'

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync()
  }, [])

  return (
    <Provider store={store}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </Provider>
  )
}`,

// ─── app/+not-found.tsx ───────────────────────────────────────────────────────
'app/+not-found.tsx': `import { Link, Stack } from 'expo-router'
import { StyleSheet, Text, View } from 'react-native'

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={styles.container}>
        <Text style={styles.title}>This screen does not exist.</Text>
        <Link href="/" style={styles.link}>
          <Text>Go to home screen</Text>
        </Link>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  title:     { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  link:      { marginTop: 15, paddingVertical: 15 },
})`,

// ─── app/(tabs)/_layout.tsx ───────────────────────────────────────────────────
'app/(tabs)/_layout.tsx': `import { Tabs }           from 'expo-router'
import { Ionicons }       from '@expo/vector-icons'
import { Colors }         from '@/constants/Colors'
import { useColorScheme } from '@/hooks/useColorScheme'

export default function TabLayout() {
  const colorScheme = useColorScheme()

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor:   Colors[colorScheme ?? 'light'].tint,
        tabBarInactiveTintColor: '#888',
        headerShown:             false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="compass-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  )
}`,

// ─── app/(tabs)/index.tsx ─────────────────────────────────────────────────────
'app/(tabs)/index.tsx': `import { StyleSheet, Text, View } from 'react-native'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.row}>
        <ThemedText type="title" style={styles.title}>${projectName} </ThemedText>
        <Text style={styles.emoji}>👋</Text>
      </View>
      <ThemedText style={styles.subtitle}>Built with MakeFast AI ⚡</ThemedText>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  row:       { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  title:     { fontSize: 28, fontWeight: 'bold' },
  emoji:     { fontSize: 28, fontFamily: undefined },
  subtitle:  { color: '#888', fontSize: 16 },
})`,

// ─── app/(tabs)/explore.tsx ───────────────────────────────────────────────────
'app/(tabs)/explore.tsx': `import { StyleSheet } from 'react-native'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'

export default function ExploreScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Explore</ThemedText>
      <ThemedText>Add your exploration content here.</ThemedText>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
})`,

// ─── components/ThemedText.tsx ────────────────────────────────────────────────
'components/ThemedText.tsx': `import { Text, type TextProps, StyleSheet } from 'react-native'
import { useThemeColor } from '@/hooks/useThemeColor'

export type ThemedTextProps = TextProps & {
  lightColor?: string
  darkColor?:  string
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link'
}

export function ThemedText({
  style, lightColor, darkColor, type = 'default', ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text')
  return <Text style={[{ color }, styles[type], style]} {...rest} />
}

const styles = StyleSheet.create({
  default:         { fontSize: 16, lineHeight: 24 },
  defaultSemiBold: { fontSize: 16, lineHeight: 24, fontWeight: '600' },
  title:           { fontSize: 32, fontWeight: 'bold', lineHeight: 36 },
  subtitle:        { fontSize: 20, fontWeight: 'bold' },
  link:            { fontSize: 16, lineHeight: 30, color: '#0a7ea4' },
})`,

// ─── components/ThemedView.tsx ────────────────────────────────────────────────
'components/ThemedView.tsx': `import { View, type ViewProps } from 'react-native'
import { useThemeColor } from '@/hooks/useThemeColor'

export type ThemedViewProps = ViewProps & {
  lightColor?: string
  darkColor?:  string
}

export function ThemedView({ style, lightColor, darkColor, ...rest }: ThemedViewProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background')
  return <View style={[{ backgroundColor }, style]} {...rest} />
}`,

// ─── components/ui/Button.tsx ─────────────────────────────────────────────────
'components/ui/Button.tsx': `import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native'

interface ButtonProps {
  title:     string
  onPress:   () => void
  loading?:  boolean
  disabled?: boolean
  variant?:  'primary' | 'secondary'
}

export function Button({ title, onPress, loading, disabled, variant = 'primary' }: ButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.base, styles[variant], (disabled || loading) && styles.disabled]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading
        ? <ActivityIndicator color="#fff" />
        : <Text style={styles.label}>{title}</Text>
      }
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  base:      { paddingVertical: 14, paddingHorizontal: 24, borderRadius: 10, alignItems: 'center' },
  primary:   { backgroundColor: '#0a7ea4' },
  secondary: { backgroundColor: '#e5e7eb' },
  disabled:  { opacity: 0.5 },
  label:     { color: '#fff', fontWeight: '600', fontSize: 16 },
})`,

// ─── constants/Colors.ts ──────────────────────────────────────────────────────
'constants/Colors.ts': `const tint            = '#0a7ea4'
const tabIconDefault  = '#687076'
const tabIconSelected = tint

export const Colors = {
  light: {
    text:             '#11181C',
    background:       '#fff',
    tint,
    icon:             '#687076',
    tabIconDefault,
    tabIconSelected,
  },
  dark: {
    text:             '#ECEDEE',
    background:       '#151718',
    tint,
    icon:             '#9BA1A6',
    tabIconDefault,
    tabIconSelected,
  },
}`,

// ─── hooks/useColorScheme.ts ──────────────────────────────────────────────────
'hooks/useColorScheme.ts': `export { useColorScheme } from 'react-native'`,

// ─── hooks/useThemeColor.ts ───────────────────────────────────────────────────
'hooks/useThemeColor.ts': `import { useColorScheme } from 'react-native'
import { Colors }        from '@/constants/Colors'

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme() ?? 'light'
  const colorFromProps = props[theme]
  return colorFromProps ?? Colors[theme][colorName]
}`,

// ─── store/index.ts ───────────────────────────────────────────────────────────
'store/index.ts': `import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
})

export type RootState   = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch`,

// ─── store/slices/authSlice.ts ────────────────────────────────────────────────
'store/slices/authSlice.ts': `import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface User {
  id:    string
  email: string
  name?: string
}

interface AuthState {
  user:  User | null
  token: string | null
}

const initialState: AuthState = { user: null, token: null }

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<{ user: User; token: string }>) {
      state.user  = action.payload.user
      state.token = action.payload.token
    },
    logout(state) {
      state.user  = null
      state.token = null
    },
  },
})

export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer`,

// ─── services/api.ts ──────────────────────────────────────────────────────────
'services/api.ts': `import axios from 'axios'

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api/v1',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

// Attach auth token - wire up from Redux store if needed
api.interceptors.request.use(config => {
  // const token = store.getState().auth.token
  // if (token) config.headers.Authorization = \`Bearer \${token}\`
  return config
})

api.interceptors.response.use(
  res => res,
  err => {
    const message = err.response?.data?.error || err.message || 'Something went wrong'
    return Promise.reject(new Error(message))
  }
)

export default api`,

// ─── .gitignore ───────────────────────────────────────────────────────────────
'.gitignore': `node_modules/
.expo/
dist/
web-build/
*.log
.DS_Store`,

// ─── README.md ────────────────────────────────────────────────────────────────
'README.md': `# ${projectName}

> React Native App - built with [MakeFast AI](https://github.com/avision488/makefast-ai) ⚡

## Stack

| Layer    | Tech                    |
|----------|-------------------------|
| Framework| Expo 53 + Expo Router 4 |
| Language | TypeScript 5.8          |
| State    | Redux Toolkit           |
| HTTP     | Axios                   |

## Quick Start

\`\`\`bash
npm install
npx expo start
\`\`\`

## Structure

\`\`\`
app/              - Expo Router screens
components/       - Shared UI components
constants/        - Colors, theme tokens
hooks/            - Custom hooks
store/            - Redux store + slices
services/         - API layer
\`\`\`
`,

  }
}