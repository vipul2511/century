import React, { Component } from 'react';
import {TextInput,View,TouchableOpacity,Text,ScrollView,StyleSheet,FlatList, Dimensions,BackHandler,ActivityIndicator,Alert} from 'react-native';
import { Table, Row, Rows } from 'react-native-table-component';
import resp from 'rn-responsive-font';
import Icon from 'react-native-vector-icons/Ionicons';
import { CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { wp, hp } from '../utils/heightWidthRatio';
import {BASE_URL} from '../utils/BaseUrl';
import NetInfo from "@react-native-community/netinfo";
import OfflineUserScreen from '../utils/OfflineScreen';
let width=Dimensions.get('window').width;
export default class DateWiseReport extends Component{
    constructor(props){
        super(props);
        this.state={
            text:"",
            zoneid:'',
            ReportData:[],
            tableHead: ['Head', 'Head2', 'Head3', 'Head4'],
              tableData: [],
              Nodata:false,
              masterlist:'',
              totalCount:'',
              orgId:'',
              token:'',
              loading:false,
              connected:true
        }
        let onEndReached = false;
        this.backItems= this.backItems.bind(this);
    }
    componentWillUnmount(){
      BackHandler.removeEventListener('hardwareBackPressed',this.backItems);
     }
     checkInternet=()=>{
      NetInfo.fetch().then(state => {
        console.log("Connection type", state.isConnected);
        this.setState({connected:state.isConnected});
      });
    }
      backItems(){
        if (this.props.navigation.isFocused()) { 
          console.log('working')
          this.props.navigation.goBack();
          return true;
      } 
    }
// data=()=>{
//   firebase.database().ref('Stock/').push({
//       StockName:this.state.text
//   }).then((data)=>{
//       console.log('data',data)
//   }).catch((err)=>{
//       console.log('error',err);
//   });
// }
searchFilterFunction = (text) => {
  // Check if searched text is not blank
  console.log('name',text);
  if (text) {
    this.onEndReached = true
    let combineArray=this.state.tableData
    const newData = combineArray.filter(
      function (item) {
        const itemData = item.name
          ? item.name.toUpperCase()
          : ''.toUpperCase();
          const itemgroup=item.orggroup
            ?item.orggroup.toUpperCase()
                        :''.toUpperCase();
                        const itemUnit=item.type
                        ?item.type.toUpperCase()
                                    :''.toUpperCase();
        const textData = text.toUpperCase();
        return (
          itemData.indexOf(textData) > -1 ||
          itemgroup.indexOf(textData) > -1 ||
          itemUnit.indexOf(textData) > -1
        )
    });
    this.setState({tableData:newData});
  } else {
  this.setState({tableData:this.state.masterlist});
  this.onEndReached = true
  }
};
salesReportData=(startdate,enddate)=>{
  let month=JSON.stringify(this.props.route.params.month);
  let startDate=JSON.stringify(startdate);
  let endDate=JSON.stringify(enddate);
  let token=this.props.route.params.token;
  let zoneid=this.props.route.params.zoneid;
  let invoiceDate=JSON.stringify(this.props.route.params.invoiceData.invoicedate);
  let invoicemillSec=JSON.stringify(this.props.route.params.invoiceData.invoiceMilliSec);
  let customerid=JSON.stringify(this.props.route.params.customerid);
  let type=JSON.stringify(this.props.route.params.data.entityType);
  let entitytype=JSON.stringify(this.props.route.params.data.entity);
  let name=JSON.stringify(this.props.route.params.name);
  console.log('start date',startDate,'end date',endDate);
  var EditProfileUrl = `${BASE_URL}/dms-demo/DmsCommonReport?logintoken=${token}&sourcetype=AndroidSalesPersonApp&reportDataSource=sales-report&reportInputFieldsData={"selZoneId": ${zoneid},"childZoneFlag": "true","AllHierarchyFlag": "false","selCustomerType": ${entitytype},"selCustomerId": ${customerid},"selStartDateNum": ${startDate},"selEndDateNum": ${endDate},"fetchDataSource": "report-table-data","timeoffset": 330,"reportLevel": "Item","month": ${month},"year": "2021","entitytypename": ${type},"entityname": ${name},"invoicedate":${invoiceDate},"invoicemillisec":${invoicemillSec}}`
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
          let arr=responseData;
          if(Object.prototype.toString.call(responseData) === '[object Array]'){
          console.log(arr.length);
           if(arr.length>0){
             this.setState({tableData:responseData});
           }
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
       this.hideLoading();
       this.checkInternet();
      console.error('error coming',error)
    })
    .done()
 
}
logout=()=>{
this.props.navigation.dispatch(
  CommonActions.reset({
    index: 0,
    routes: [{name: 'Login'}],
  }),
) 

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
componentDidMount(){
    console.log('daat',this.props.route.params.data);
    console.log(this.props.route.params.start,this.props.route.params.enddate);
   AsyncStorage.getItem('@loginToken').then(succ=>{
     if(succ){
    this.setState({token:succ});
     }
   });
   AsyncStorage.getItem('@zone_id').then(id=>{
    if(id){
     this.setState({zoneid:JSON.stringify(id)});
     console.log('zone id in chart',this.state.zoneid); 
     this.salesReportData(this.props.route.params.start,this.props.route.params.enddate)
    }
  });
  BackHandler.addEventListener('hardwareBackPressed',this.backItems);
//   this.getCustomerData();
  
}
searchFilterFunction = (text) => {
    // Check if searched text is not blank
    console.log('name',text);
    if (text) {
      this.onEndReached = true
      let combineArray=this.state.tableData
      const newData = combineArray.filter(
        function (item) {
          const itemData = item.itemDesc
            ? item.itemDesc.toUpperCase()
            : ''.toUpperCase();
            const itemgroup=item.itemQty
              ?item.itemQty.toUpperCase()
                          :''.toUpperCase();
                                      const billedqty=item.salesAmount
                          ?item.salesAmount.toUpperCase()
                                      :''.toUpperCase();
          const textData = text.toUpperCase();
          return (
            itemData.indexOf(textData) > -1 ||
            itemgroup.indexOf(textData) > -1 ||
            billedqty.indexOf(textData) > -1 
          )
      });
      this.setState({tableData:newData});
    } else {
    this.setState({tableData:this.state.masterlist});
    this.onEndReached = true
    }
  };
renderItem = ({ item,index }) => (
    <View key={index}>
     <View style={{flexDirection:'row',height:'auto',justifyContent:'center',alignItems:'center'}} >
       <View style={{width:wp(100),alignSelf:'flex-start',flexDirection:'row'}} >
     <Text style={{fontSize:15,flexWrap:'wrap',marginBottom:10,textAlign:'left'}}>{item.itemDesc}</Text>
     </View>
     <View style={{width:wp(100),alignSelf:'flex-end',flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
     <Text style={{fontSize:15,flexWrap:'wrap',marginBottom:10,textAlign:'center',}}>{item.itemQty}</Text>
     </View>
     <View style={{width:wp(120),alignSelf:'flex-end',flexDirection:'row',justifyContent:'flex-end',alignItems:'flex-end'}}>
     <Text style={{fontSize:15,flexWrap:'wrap',marginBottom:10,textAlign:'right'}}>{item.salesAmount}</Text>
     </View>
     </View>
     <View style={{borderWidth:0.5,backgroundColor:'black'}}></View>

    </View>
  );
  stockDatainDB=(data,count)=>{
    firebase.database().ref('StockMasterTable/').set({data,Totalcount:count}).then((data)=>{
      console.log('data',data);
      this.getCustomerData()
  }).catch((err)=>{
      console.log('error',err);
  })
    }

  BottomView=()=>
  {
    return (
       
        <View style={{alignSelf:'flex-start'}}>
                {
                    ( this.state.loading )
                    ? 
                   
                        <ActivityIndicator size="large" color = "#1976D2" style={{marginLeft:width/2-50}} />
                     
                    :
                        null
                }
 
        </View>           
 
        
    )
  }
  headerList=()=>{
    return(
   <View style={{marginTop:8,marginBottom:5,marginLeft:5,}}>
              {this.state.Nodata==false? <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                <View style={{width:wp(100),alignSelf:'flex-start'}}>
                <Text style={{fontWeight:'bold',textAlign:'left'}}>Description</Text></View>
                <View style={{width:wp(100)}}>
                 <Text style={{fontWeight:'bold',textAlign:'center'}}>Item Qty</Text></View>
                 <View style={{width:wp(120)}}>
                 <Text style={{fontWeight:'bold',textAlign:'right'}}>Sales Amount</Text></View>
            </View>:null}
                </View>
    )
  }
  nodata=()=>{
    return(<View style={{justifyContent:'center',alignItems:'center',marginTop:hp(45)}}>
        {this.state.Nodata?  <Text>No Data Found</Text>:null}
     </View>
    )
 }
render(){
  if(!this.state.connected){
    return(<OfflineUserScreen onTry={this.checkInternet} />)
       }
    return(
        <View style={styles.container}>
           <View style={styles.headerView}>
          <View style={styles.BackButtonContainer}>
           
              <Icon name="arrow-back" size={25} color={"#fff"} onPress={()=>{this.props.navigation.goBack()}} />
           
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
            onPress={()=>{this.props.navigation.navigate('DashBoardScreen')}}
            >
               <Icon name="home"  size={25} color={"#fff"} onPress={()=>{this.props.navigation.navigate('DashBoardScreen')}} />
          </TouchableOpacity>
        </View>
        <View>
        {/* <View style={{justifyContent:'center',alignItems:'center'}}>
     
          <Text style={{fontSize:15,fontWeight:'bold'}}>{this.props.route.params.name}</Text>
          
      
        </View> */}
        </View>   
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
         
      </View>
    )
}
}
const styles = StyleSheet.create({
    container: { flex: 1, },
    head: { height: 40, backgroundColor: '#f1f8ff' },
    text: { margin: 6 },
    SearchContainer: {
     marginLeft:15,
      backgroundColor: '#1976D2',
    },
    LogoIconStyle: {
      margin: 5,
      height: 30,
      width: 30,
    },
    backButtonStyle: {
      margin: 5,
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
        
      marginRight:10,
      backgroundColor: '#1976D2',
    },
    TitleContainer: {
      flexDirection: 'row',
      
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