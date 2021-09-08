import React from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  processColor,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Alert,
  TextInput
} from 'react-native';
import {LineChart,PieChart,BarChart} from 'react-native-charts-wrapper';
import resp from 'rn-responsive-font';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {ProgressChart} from 'react-native-chart-kit';
import { wp, hp } from '../../../utils/heightWidthRatio';
import { CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL} from '../../../utils/BaseUrl';
let width=Dimensions.get('window').width;
let height=Dimensions.get('window').height;
export default class Secondarychart extends React.Component {
  constructor(props){
      super(props);
      this.state={
        value: 45,
        Nodata:false,
        tableData: '',
        zoneid:'',
        token:''
      }
  }
  componentDidMount(){
    console.log('the props of chart',JSON.stringify(this.props))
    AsyncStorage.getItem('@zone_id').then(id=>{
      if(id){
       this.setState({zoneid:JSON.stringify(id)});
       console.log('zone id in chart',this.state.zoneid); 
      }
    });
    AsyncStorage.getItem('@loginToken').then(succ=>{
      if(succ){
     this.setState({token:succ});
     console.log('login token in chat',this.state.token); 
      this.millsecond()
      }
    });
  }
  nodata=()=>{
    return(<View style={{justifyContent:'center',alignItems:'center',marginTop:hp(45)}}>
        {this.state.Nodata?<Text>No Data Found</Text>:null}
     </View>
    )
 }
 millsecond=()=>{
  var d = new Date();
console.log(d.toLocaleDateString());
d.setMonth(d.getMonth() - 3);
console.log(d.toLocaleDateString());
let timebeforemonth = new Date(d.toLocaleDateString()).getTime(); 
let timebefore3month=JSON.stringify(timebeforemonth);
console.log('3 before current millsecond',timebefore3month);
let timemonth=new Date().getTime(); 
let time3month=JSON.stringify(timemonth);
console.log('current millsecond',time3month);
this.salesReportData(timebefore3month,time3month);  
}
salesReportData=(startdate,enddate)=>{
  let startDate=JSON.stringify(startdate);
  let endDate=JSON.stringify(enddate);
  console.log('start date',startDate,'end date',endDate);
  var EditProfileUrl = `${BASE_URL}/dms-demo/DmsCommonReport?logintoken=${this.state.token}&sourcetype=AndroidSalesPersonApp&reportDataSource=secondary-sales&reportInputFieldsData={"selZoneId":${this.state.zoneid},"childZoneFlag": "true","AllHierarchyFlag": "false","selCustomerType": "All","selCustomerId": "All","selStartDateNum": ${startDate},"selEndDateNum": ${endDate},"fetchDataSource": "report-runtime-data","timeoffset": 330}`
  console.log('Add product Url:' + EditProfileUrl)
  fetch(EditProfileUrl,  {
    method: 'Post',
    headers:{
      'Content-Type': 'application/json',
    },
  })
    .then(response => response.json())
    .then(responseData => {
      if(responseData!=="Invalid Session"){
        if(responseData!=="No Data Found"){
          if(responseData!="lstDbReportChildEntities is null / empty" && responseData!="Periodic Sales Data is null or empty"){ 
            console.log(responseData);
            if(Object.prototype.toString.call(responseData) === '[object Array]'){
            let arra=[]
            responseData.map(item=>{
           let obj={
             childname:item.childname,
             entitytypename:item.entitytypename,
             state:item.zonedetails.State,
             city:item.zonedetails.City,
            //  tenantzonehierarchy:item.zonedetails.Country+','+item.zonedetails.State+','+item.zonedetails.City,
             salesamount:item.salesamount
           }
           arra.push(obj)
            })
            console.log('the arary',arra);
            this.setState({tableData:arra});
            }else{
              this.setState({Nodata:true})
            }
        
         }
      else {
        this.setState({Nodata:true})
    console.log(responseData);
      }
    }
    }else{
      this.createTwoButtonAlert()
    }
      // console.log('contact list response object:', JSON.stringify(responseData))
    })
    .catch(error => {
      //  this.hideLoading();
      console.error('error coming',error)
    })
    .done()
 
}
renderItem = ({ item,index }) =>{
  console.log('item',item)
 return(
  <View key={index}>
   <TouchableOpacity style={{flexDirection:'row',height:'auto',}} >
     <TouchableOpacity style={{width:wp(100),alignSelf:'flex-start',marginLeft:5}} >
   <Text style={{fontSize:15,marginBottom:10,textAlign:'left',}}>{item.childname}</Text>
   </TouchableOpacity>
   <TouchableOpacity style={{width:wp(100),flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
   <Text style={{fontSize:15,marginBottom:10,textAlign:'center',}}>{item.salesamount}</Text>
   </TouchableOpacity>
   <TouchableOpacity style={{width:wp(90),flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
   <Text style={{fontSize:15,marginBottom:10,textAlign:'center',}}>{item.state}</Text>
   </TouchableOpacity>
   <TouchableOpacity style={{width:wp(90),flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
   <Text style={{fontSize:15,marginBottom:10,textAlign:'center',}}>{item.city}</Text>
   </TouchableOpacity>
   <View style={{width:wp(100),flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
   <Text style={{fontSize:15,flexWrap:'wrap',marginBottom:10,textAlign:'right'}}>{item.entitytypename}</Text>
   </View>
   </TouchableOpacity>
   <View style={{borderWidth:0.5,backgroundColor:'black'}}></View>

  </View>
);
 }
createTwoButtonAlert = () =>
Alert.alert(
  "Invalid Session",
  "Your Session is expired Please login again",
  [
    
    { text: "OK", onPress: () => {this.logout()} }
  ],
  { cancelable: false }
);
headerList=()=>{
  return(
 <View style={{marginTop:8,marginBottom:5,marginLeft:5,}}>
            {this.state.Nodata==false? <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
              <View style={{width:wp(100),alignSelf:'flex-start'}}>
              <Text style={{fontWeight:'bold',textAlign:'left'}}>Customer Name</Text></View>
              <View style={{width:wp(100),alignSelf:'center',justifyContent:'center',alignItems:'center'}}>
              <Text style={{fontWeight:'bold',textAlign:'left'}}>Sales Amount</Text></View>
              <View style={{width:wp(90),alignSelf:'center',justifyContent:'center',alignItems:'center'}}>
              <Text style={{fontWeight:'bold',textAlign:'left'}}>State</Text></View>
              <View style={{width:wp(90),alignSelf:'center',justifyContent:'center',alignItems:'center'}}>
              <Text style={{fontWeight:'bold',textAlign:'left'}}>City</Text></View>
               <View style={{width:wp(100),marginRight:10,}}>
               <Text style={{fontWeight:'bold',textAlign:'right'}}>Customer Type</Text></View>
          </View>:null}
              </View>
  )
}
logout=()=>{
  this.props.navigation.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{name: 'Login'}],
    }),
  ) 
  }
  render() {
    
    return (
       
      <View style={{flex: 1,backgroundColor:'#fff'}}>
        <View style={styles.headerView}>
          <View style={styles.BackButtonContainer}>
           
          <Ionicons name="arrow-back"  size={25} color={"#fff"} onPress={()=>{this.props.navigation.goBack()}} />
           
          </View>
          <View style={styles.TitleContainer}>
          {this.state.Nodata==false?<View>
               <TextInput placeholder="Search" style={{backgroundColor:'#fff',width:wp(250),height:hp(50)}} onChangeText={(text)=>{this.searchFilterFunction(text)}}    />
            </View>:<View style={{flex:0.6}}>
              <Text style={styles.TitleStyle}>i9 Sales Force</Text>
            </View>}
          </View>
          <TouchableOpacity
            style={styles.SearchContainer}
            onPress={() => {
              this.props.navigation.navigate('DashBoardScreen')
            }}>
                <Ionicons name="home"  size={25} color={"#fff"} onPress={()=>{this.props.navigation.navigate('DashBoardScreen')}} />
          </TouchableOpacity>
          </View>
          <ScrollView horizontal={true}>
          <FlatList
         keyExtractor={(item, index) => index.toString()} 
         data={this.state.tableData}
         initialNumToRender={20}
         maxToRenderPerBatch={20}
         numColumns={1}
         ListEmptyComponent={this.nodata}
         ListHeaderComponent={this.headerList}
         renderItem={this.renderItem}
          />
          </ScrollView>
        </View>
      


    );
  }
}
const chartConfig = {
    backgroundGradientFrom: "#1E2923",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#08130D",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false // optional
  };
const styles = StyleSheet.create({
  container: {
      marginTop:10,
    flex: 0.2,
    backgroundColor: '#F5FCFF'
  },
  chart: {
    flex: 1
  },
  card:{
      marginTop:12,
      width:wp(350),
      backgroundColor:'#fff',
      elevation:3,
      height:hp(140),
      marginBottom:10,
      marginLeft:10,
      marginRight:10
  },
  SearchContainer: {
    // flex: 0.1,
    marginLeft:15,
    backgroundColor: '#1976D2',
  },
  LogoIconStyle: {
    margin: 5,
    height: 30,
    width: 30,
  },
  backButtonStyle: {
    margin: 10,
    height: 20,
    width: 80,
    color:'#fff'
  },
  headerView: {
    height:65,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1976D2',
    elevation: 2,
  },
  BackButtonContainer: {
    // flex: 0.2,
    marginRight: 10,
    backgroundColor: '#1976D2',
  },
  TitleContainer: {
    flexDirection: 'row',
    // flex: 0.6,
    backgroundColor: '#1976D2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  TitleStyle: {
    fontWeight: 'bold',
    color: '#fff',
    fontSize: resp(20),
    textAlign: 'center',
  },
});