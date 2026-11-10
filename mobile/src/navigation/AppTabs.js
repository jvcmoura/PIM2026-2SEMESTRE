import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import MatriculasScreen from '../screens/MatriculasScreen';
import PagamentosScreen from '../screens/PagamentosScreen';

const Tab = createBottomTabNavigator();

const icones = { Início: 'home', Matrículas: 'clipboard', Pagamentos: 'card' };

export default function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: '#0f172a' },
        headerTintColor: '#fff',
        tabBarStyle: { backgroundColor: '#0f172a', borderTopColor: '#1e293b' },
        tabBarActiveTintColor: '#22c55e',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarIcon: ({ color, size }) => (
          <Ionicons name={icones[route.name]} size={size} color={color} />
        ),
      })}
    >
      <Tab.Screen name="Início" component={HomeScreen} />
      <Tab.Screen name="Matrículas" component={MatriculasScreen} />
      <Tab.Screen name="Pagamentos" component={PagamentosScreen} />
    </Tab.Navigator>
  );
}