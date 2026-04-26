import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemeProvider, useAppTheme } from '../../src/theme/ThemeContext';
import AuthGate from '../../src/auth/AuthGate';

function TabsNavigator() {
  const { colors, dark } = useAppTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: dark ? '#9ca3af' : '#6b7280',
        tabBarStyle: {
          position: 'absolute',
          left: 14,
          right: 14,
          bottom: 12,
          height: 78,
          paddingTop: 10,
          paddingBottom: 12,
          borderTopWidth: 0,
          borderRadius: 24,
          backgroundColor: dark ? 'rgba(17,18,20,0.96)' : 'rgba(255,255,255,0.96)',
          borderWidth: 1,
          borderColor: colors.border,
          shadowColor: '#000',
          shadowOpacity: dark ? 0.35 : 0.12,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: 8 },
          elevation: 12,
        },
        tabBarItemStyle: {
          borderRadius: 18,
          marginHorizontal: 2,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '800',
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Command',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="camera"
        options={{
          title: 'Inspect',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="review"
        options={{
          title: 'Work',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="shield-checkmark-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="analytics"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="history"
        options={{
          title: 'Records',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: 'Control',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="options-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="actions"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="vault"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="report"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="team"
        options={{
          href: null,
        }}
      />
    
      <Tabs.Screen
        name="audit"
        options={{
          href: null,
        }}
      />

    </Tabs>
  );
}

export default function TabsLayout() {
  return (
    <ThemeProvider>
      <AuthGate>
        <TabsNavigator />
      </AuthGate>
    </ThemeProvider>
  );
}
