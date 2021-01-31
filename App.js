import * as React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from './pages/HomeScreen';
import CreateNewPlan from './pages/CreateNewPlan';
import ActivePlan from './pages/ActivePlan';
import ViewAllPlan from './pages/ViewAllPlan';
import Addfooditem from './pages/Addfooditem';
import ShowDaybydayMeal from './pages/ShowDaybydayMeal';

import DeleteUser from './pages/DeleteUser';
import UpdateUser from './pages/UpdateUser';
import PlanHistory from './pages/PlanHistory';

import FoodItemScreen from './pages/FoodItem/FoodItemScreen';
import IngredientScreen from './pages/FoodItem/IngredientScreen';

import SplashScreen from 'react-native-splash-screen';


const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const NavigationDrawerStructure = (props) => {
  const toggleDrawer = () => {
    props.navigationProps.toggleDrawer();
  };
  return (
    <View style={{ flexDirection: 'row' }}>
      <TouchableOpacity onPress={() => toggleDrawer()}>
        <Image
          source={require('./Images/drawerWhite.png')}
          style={{ width: 25, height: 25, marginLeft: 5 }}
        />
      </TouchableOpacity>
    </View>
  );
}
/////////////////////////////////Home Screen///////////////////////////////////////
function HomeScreenStack({ navigation }) {
  return (

    <Stack.Navigator initialRouteName="HomeScreen">
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          title: 'FOOD BASED DIET PLAN',
          headerLeft: () => <NavigationDrawerStructure navigationProps={navigation} />,
          headerStyle: {
            backgroundColor: '#595a4e',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            //fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name="CreateNewPlan"
        component={CreateNewPlan}
        options={{
          title: 'All Plan',
          headerStyle: {
            backgroundColor: '#595a4e',
          },
          headerTintColor: '#fff',
        }} />

      <Stack.Screen
        name="Addfooditem"
        component={Addfooditem}
        options={{
          title: 'Food Item',
          headerStyle: {
            backgroundColor: '#595a4e',
          },
          headerTintColor: '#fff',
        }} />

      <Stack.Screen
        name="ActivePlan"
        component={ActivePlan}
        options={{
          title: 'Active Plan',
          headerStyle: {
            backgroundColor: '#595a4e',
          },
          headerTintColor: '#fff',
        }} />

      <Stack.Screen
        name="UpdateUser"
        component={UpdateUser}
        options={{
          title: 'Update Plan',
          headerStyle: {
            backgroundColor: '#595a4e',
          },
          headerTintColor: '#fff',
        }} />
      <Stack.Screen
        name="PlanHistory"
        component={PlanHistory}
        options={{
          title: 'Plan History',
          headerStyle: {
            backgroundColor: '#595a4e',
          },
          headerTintColor: '#fff',
        }} />

      <Stack.Screen
        name="ShowDaybydayMeal"
        component={ShowDaybydayMeal}
        options={{
          title: 'Today Meal Menu',
          headerStyle: {
            backgroundColor: '#595a4e',
          },
          headerTintColor: '#fff',
        }} />

      <Stack.Screen
        name="ViewAllPlan"
        component={ViewAllPlan}
        options={{
          title: 'View All Plan',
          headerStyle: {
            backgroundColor: '#595a4e',
          },
          headerTintColor: '#fff',
        }} />

      <Stack.Screen
        name="DeleteUser"
        component={DeleteUser}
        options={{
          title: 'Delete Plan',
          headerStyle: {
            backgroundColor: '#595a4e',
          },
          headerTintColor: '#fff',
        }} />



    </Stack.Navigator>
  );
}

//////////////////////Food Category//////////////////////////////////

function FoodItemStack({ navigation }) {
  return (
    <Stack.Navigator initialRouteName="FoodItemScreen">
      <Stack.Screen
        name="FoodItemScreen"
        component={FoodItemScreen}
        options={{
          title: 'Add Food Item',
          headerLeft: () => <NavigationDrawerStructure navigationProps={navigation} />,
          headerStyle: {
            backgroundColor: '#595a4e',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />

      <Stack.Screen
        name="IngredientScreen"
        component={IngredientScreen}
        options={{
          title: 'All Ingredient',
          headerStyle: {
            backgroundColor: '#595a4e',
          },
          headerTintColor: '#fff',

        }} />



    </Stack.Navigator>
  );
}




//////////////////////Drawer Function//////////////////////////////////
function App() {

  SplashScreen.hide();


  return (


    <NavigationContainer>
      <Drawer.Navigator
        drawerContentOptions={{
          activeTintColor: '#255d00',
          backgroundColor: '#c1ccc7',
          labelStyle: { marginVertical: 1, fontFamily: 'Verdana', fontSize: 17, borderColor: 'black', borderWidth: 1, width: 190, height: 30, textAlign: "center", borderRadius: 10 }
        }}>
        <Drawer.Screen
          name="Home Screen"
          options={{ drawerLabel: 'Home Screen' }}
          component={HomeScreenStack} />
        <Drawer.Screen
          name="Add Food Item"
          options={{ drawerLabel: 'Food Item' }}
          component={FoodItemStack} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

export default App;

