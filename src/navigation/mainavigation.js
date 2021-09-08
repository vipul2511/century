
import React,{Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Image,
  TouchableOpacity,
  Text,
  StatusBar,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Splash from '../splash';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Login from '../scenes/login/login';
import  DashBoardScreen  from "../MainScreen/Dashboard";
import ForgetPassword from '../scenes/Forgot';
import ReportScreen from '../MainScreen/ReportData';
import ViewCustomer from '../drawer/ViewCustomer';
import ViewStock from '../drawer/ViewStock';
import BeatPlan from '../drawer/Beatplan';
import CustomerGrid from '../scenes/CustomerGrid';
import Secondarychart from '../scenes/Chart/Secondary Sales Chart';
import StockTable from '../MainScreen/StockTable';
import CustomerTable from '../MainScreen/CustomerTable';
import SalesinTransit from '../MainScreen/SalesinTransit';
import BPR from '../MainScreen/BPR';
import DailyRoute from '../drawer/DailyRoute';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ChildChart from '../scenes/Chart/ChildChart/childchart';
import PieChartData from '../scenes/Chart/ChildChart/PieChartData';
import Favourite from '../drawer/myFavourite';
import BarChildGraph from '../scenes/Chart/ChildChart/BarchildGraph';
import ChildDataBarGraph from '../MainScreen/ChildDataBargraph';
import InnerBarGraph from '../MainScreen/InnerBarGraph';
import BillingOutlet from '../scenes/Chart/BillingOutlet';
import DateWiseReport from '../MainScreen/DateWiseReport';
import OpenPurchase from '../MainScreen/OpenPurchase';
import OpenPurchaseChildScreen from '../MainScreen/OpenPurchaseChildData';
import CreateOrder from '../MainScreen/createOrder';
import GSTBilling from '../MainScreen/GSTBilling';
import Search from '../utils/Search';
let username;

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
function Root(props)
{
  console.log('this props',props.route);
 
  AsyncStorage.getItem('@username').then(succ=>{
    if(succ){
      username=succ;
      console.log('sucss',username);
      customDrawerContent();
    }
  });
    return(
<Stack.Navigator initialRouteName={"DashBoardScreen"}>
<Stack.Screen name="DashBoardScreen" component={DashBoardScreen}   options={{ headerShown: false }}  />
 <Stack.Screen name="ReportScreen" component={ReportScreen}  options={{ headerShown: false }} />
 <Stack.Screen name="ViewCustomer" component={ViewCustomer} options={{ headerShown: false }} />
 <Stack.Screen name="ViewStock" component={ViewStock} options={{ headerShown: false }} />
 <Stack.Screen name="CustomerGrid" component={CustomerGrid} options={{ headerShown: false }} />
 <Stack.Screen name="SecondarySales" component={Secondarychart} options={{ headerShown: false }} />
 <Stack.Screen name="StockTable" component={StockTable} options={{ headerShown: false }} />
 <Stack.Screen name="CustomerTable" component={CustomerTable} options={{ headerShown: false }} />
 <Stack.Screen name="SalesinTransit" component={SalesinTransit} options={{ headerShown: false }} />
 <Stack.Screen name="BPR" component={BPR} options={{ headerShown: false }} />
 <Stack.Screen name="DailyRoute" component={DailyRoute} options={{ headerShown: false }} />
 <Stack.Screen name="ChildChart" component={ChildChart} options={{ headerShown: false }} />
 <Stack.Screen name="PieChartData" component={PieChartData} options={{ headerShown: false }} />
 <Stack.Screen name="BeatPlan" component={BeatPlan} options={{ headerShown: false }} />
 <Stack.Screen name="BarChildGraph" component={BarChildGraph} options={{ headerShown: false }} />
 <Stack.Screen name="Favourite" component={Favourite} options={{ headerShown: false }} />
 <Stack.Screen name="ChildDataGraph" component={ChildDataBarGraph} options={{ headerShown: false }} />
 <Stack.Screen name="InnerBarGraph" component={InnerBarGraph} options={{ headerShown: false }} />
 <Stack.Screen name="BillingOutlet" component={BillingOutlet} options={{ headerShown: false }} />
 <Stack.Screen name="DateWiseReport" component={DateWiseReport} options={{ headerShown: false }} />
 <Stack.Screen name="OpenPurchase" component={OpenPurchase} options={{ headerShown: false }} />
 <Stack.Screen name="OpenPurchaseChildScreen" component={OpenPurchaseChildScreen} options={{ headerShown: false }} />
 <Stack.Screen name="CreateOrder" component={CreateOrder} options={{ headerShown: false }} />
 <Stack.Screen name="GSTBilling" component={GSTBilling} options={{ headerShown: false }} />
 <Stack.Screen name="Search" component={Search} options={{ headerShown: false }} />
  </Stack.Navigator>

    )
  }
 function MainNavigator(){
 
   return(
    <NavigationContainer> 
<Drawer.Navigator
    initialRouteName="Splash"
    drawerContent={props => customDrawerContent(props)}>
      <Drawer.Screen name="Splash" component={Splash} options={{gestureEnabled:false}} />
<Drawer.Screen name="Login" component={Login} options={{gestureEnabled:false}} />
<Drawer.Screen name ="Root" component={Root}  />
<Drawer.Screen name="ForgotPassword" component={ForgetPassword} options={{gestureEnabled:false}} />
  </Drawer.Navigator>
  </NavigationContainer>

   )
 }

 const customDrawerContent = (props) => {
  
    return (
      <View>
    <View style={{justifyContent:'center',alignItems:'center',marginTop:25}}>
    <Image source={require('../assets/image/logo.jpeg')}     />
    <Text style={{marginTop:15,fontSize:16,fontWeight:'bold'}}>Hello {username}</Text>
</View>
          <TouchableOpacity style={styles.Home} onPress={() => props.navigation.navigate('DashBoardScreen')} ><Text style={styles.home_text}>Home</Text></TouchableOpacity>
          <TouchableOpacity style={styles.Home} ><Text style={styles.home_text}>Reports</Text></TouchableOpacity>
        <TouchableOpacity style={styles.Home} onPress={() => props.navigation.navigate('ViewCustomer')}><Text style={styles.home_text}>My stock</Text></TouchableOpacity>
        <TouchableOpacity style={styles.Home} onPress={() => props.navigation.navigate('ViewStock')}><Text style={styles.home_text}>My customer</Text></TouchableOpacity>
        <TouchableOpacity style={styles.Home} onPress={()=>{props.navigation.navigate('BeatPlan')}}><Text style={styles.home_text} >My Daily Route</Text></TouchableOpacity>
        <TouchableOpacity style={styles.Home}  ><Text style={styles.home_text} onPress={()=>{props.navigation.navigate('Favourite')}}>My Favourite</Text></TouchableOpacity>
        {/* TouchableOpacity style={styles.Home}  onPress={()=>{props.navigation.navigate('BeatPlan')}} ><Text style={styles.home_text}>Beat Plan</Text></TouchableOpacity> */}
        {/* <TouchableOpacity style={styles.Home} onPress={() => props.navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'Login'}],
        }),
      )}><Text style={styles.home_text}>Logout</Text></TouchableOpacity> */}
        </View>
    )
  }
  
const styles = StyleSheet.create({
    home_text: {
        color: '#6AADEF',
        fontSize: 18,
        marginLeft: 12,
        marginTop: 5,
        fontFamily:'sans-serif',
      },
      Home: {
        marginTop: 30,
        backgroundColor: '#DFEFFF',
        height: 40,
        width: 260,
        marginLeft: 10
      },
});

export default MainNavigator;
