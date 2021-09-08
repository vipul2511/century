import React, { Component } from 'react';
import {TextInput,View,TouchableOpacity,Text,Alert,ScrollView,StyleSheet,FlatList, Dimensions,BackHandler,ActivityIndicator} from 'react-native';
import firebase from '../utils/firebase';
import { Table, Row, Rows } from 'react-native-table-component';
import resp from 'rn-responsive-font';
import Spinner from 'react-native-loading-spinner-overlay';
import Icon from 'react-native-vector-icons/Ionicons'
import { CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import { wp, hp } from '../utils/heightWidthRatio';
import {BASE_URL} from '../utils/BaseUrl';
let width=Dimensions.get('window').width;
export default class BPR extends Component{
    constructor(props){
        super(props);
        this.state={
            text:"",
            ReportData:[],
            tableHead: ['Head', 'Head2', 'Head3', 'Head4'],
              tableData:'',
              masterlist:'',
              totalCount:'',
              orgId:'',
              token:'',
              zoneid:'',
              NoData:false,
              type:'',
              loading:false,
              spinner:false,
        }
        let onEndReached = false;
        this.backItems= this.backItems.bind(this);
    }
    componentWillUnmount(){
      BackHandler.removeEventListener('hardwareBackPressed',this.backItems);
      this._unsubscribe();
     }
      backItems(){
        if (this.props.navigation.isFocused()) { 
          console.log('working')
          this.props.navigation.goBack();
          return true;
      } 
    }
searchFilterFunction = (text) => {
  // Check if searched text is not blank
  console.log('name',text);
  if (text) {
    this.onEndReached = true
    let combineArray=this.state.tableData
    const newData = combineArray.filter(
      function (item) {
        const itemData = item.customername
          ? item.customername.toUpperCase()
          : ''.toUpperCase();
          const itemgroup=item.orderno
            ?item.orderno.toUpperCase()
                        :''.toUpperCase();
                        const itemUnit=item.customertype
                        ?item.customertype.toUpperCase()
                                    :''.toUpperCase();
                                    const status=item.status
                        ?item.status.toUpperCase()
                                    :''.toUpperCase();
        const textData = text.toUpperCase();
        return (
          itemData.indexOf(textData) > -1 ||
          itemgroup.indexOf(textData) > -1 ||
          itemUnit.indexOf(textData) > -1 ||
          status.indexOf(textData) >-1
        )
    });
    this.setState({tableData:newData});
  } else {
  this.setState({tableData:this.state.masterlist});
  this.onEndReached = true
  }
};
componentDidMount(){
  this._unsubscribe = this.props.navigation.addListener('focus', () => {
  this.showLoading()
  AsyncStorage.getItem('@loginToken').then(succ=>{
    if(succ){
   this.setState({token:succ});
    }
  })
  AsyncStorage.getItem('@orgid').then(succ=>{
   if(succ){
  this.setState({orgId:succ});
   }
 })
 AsyncStorage.getItem('@zone_id').then(succ=>{
   if(succ){
  this.setState({zoneid:succ});
   }
 })
 AsyncStorage.getItem('@type').then(succ=>{
   if(succ){
  this.setState({type:succ});
  this.dataFetchStockItem();
   }
 })
});
  BackHandler.addEventListener('hardwareBackPressed',this.backItems);
//   this.getCustomerData();
  
}



renderItem = ({ item,index }) => 
{
  return(
    <View key={index}>
     <TouchableOpacity style={{flexDirection:'row',height:'auto',}} onPress={()=>{this.props.navigation.navigate('OpenPurchaseChildScreen',{dataItem:this.props.route.params.dataItem,orderID:item._id.$oid})}}>
       <View style={{width:wp(50),alignSelf:'flex-start',flexDirection:'row',justifyContent:'flex-start',alignItems:'flex-start',marginLeft:10}}>
     <Text style={{fontSize:13,marginLeft:5,flexWrap:'wrap',marginBottom:10,}}>{item.customername}</Text>
     </View>
     <View style={{width:wp(100),alignSelf:'center',flexDirection:'row',justifyContent:'flex-start',alignItems:'flex-start',marginLeft:10}}>
     <Text style={{fontSize:13,marginLeft:15,flexWrap:'wrap',marginBottom:10,textAlign:'left'}}>{item.customertype}</Text>
     </View>
     <View style={{width:wp(100),alignSelf:'flex-end',flexDirection:'row',justifyContent:'flex-start',alignItems:'flex-start',marginLeft:10}}>
     <Text style={{fontSize:13,marginLeft:15,flexWrap:'wrap',marginBottom:10,textAlign:'left'}}>{item.orderno}</Text>
     </View>
     <View style={{width:wp(100),alignSelf:'flex-end',flexDirection:'row',justifyContent:'flex-start',alignItems:'flex-start',marginLeft:10}}>
     <Text style={{fontSize:13,marginLeft:15,flexWrap:'wrap',marginBottom:10,textAlign:'left'}}>{moment(Number(item.orderdate)).format('DD/MM/YY')}</Text>
     </View>
     <View style={{width:wp(80),alignSelf:'flex-end',flexDirection:'row',justifyContent:'flex-start',alignItems:'flex-start',marginLeft:10}}>
     <Text style={{fontSize:13,marginLeft:15,flexWrap:'wrap',marginBottom:10,textAlign:'left'}}>{item.status}</Text>
     </View>
     
    
     </TouchableOpacity>
     <View style={{borderWidth:0.5,backgroundColor:'black'}}></View>

    </View>
  );
}
  
  dataFetchStockItem=()=>{
    let orgid=JSON.stringify(this.props.route.params.dataItem.orgid);
    let type=JSON.stringify(this.props.route.params.dataItem.typecus);
    var EditProfileUrl = `${BASE_URL}/dms-demo/mobile-json-data?logintoken=${this.state.token}&sourcetype=AndroidSalesPersonApp&fileDataSource=salesorder-fetch&inputFieldsData={"selEntityId":${JSON.stringify(this.state.orgId)},"selEntityType":${JSON.stringify(this.state.type)},"selZoneId":${JSON.stringify(this.state.zoneid)},"selCustomerType": ${type},"selCustomerId":${orgid},"startIndex": "0","packetSize": "5000","status": "All","timeoffset": "330"}`
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
              if(responseData!="lstDbReportChildEntities is null / empty"){
                console.log(Object.prototype.toString.call(responseData));
                if(Object.prototype.toString.call(responseData) === '[object Object]'){
                  console.log('working');
                  this.hideLoading();
                  this.setState({tableData:responseData.data,masterlist:responseData.data});
                  console.log('working',JSON.stringify(responseData));
                }else{
                  this.hideLoading();
                  console.log(responseData)
                  this.setState({NoData:true}) 
                }
              }else{
                this.hideLoading();
                console.log(responseData)
                this.setState({NoData:true}) 
              }
            }else{
              this.hideLoading();
              console.log(responseData)
              this.setState({NoData:true})
            }
        } else {
          this.hideLoading();
          this.createTwoButtonAlert()
         console.log(responseData);
        }
      })
      .catch(error => {
         this.hideLoading();
        console.error('error coming',error)
      })
      .done()
}
showLoading () {
  this.setState({spinner: true})
}

hideLoading () {
  this.setState({spinner: false})
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
nodata=()=>{
  return(<View style={{justifyContent:'center',alignItems:'center',marginTop:hp(45)}}>
      {this.state.NoData?<Text>No Data Found</Text>:null}
   </View>
  )
}
  BottomView=()=>
  {
    return (
       
      <View style={{justifyContent:'center',alignItems:'center',marginTop:10}}>
      <TouchableOpacity style={{backgroundColor:'#1976D2',width:200,height:45,justifyContent:'center',alignItems:'center',borderRadius:10}}
            >
                <Text style={{color:'#fff',fontSize:18}}>Create Order</Text>
                </TouchableOpacity>
                </View>       
 
        
    )
  }
  listHeader=()=>{
    return(
      <View style={{marginTop:8,marginBottom:5,marginLeft:5,}}>
                <View style={{flexDirection:'row',}}>
                <View style={{width:wp(50),alignSelf:'flex-start',marginLeft:5}}>
                <Text style={{fontWeight:'bold',textAlign:'left'}}>Name</Text></View>
                <View style={{width:wp(100),alignSelf:'center'}}>
                <Text style={{fontWeight:'bold',textAlign:'center'}}>Type</Text></View>
                <View style={{width:wp(100),marginLeft:15}}>
                 <Text style={{fontWeight:'bold',textAlign:'center'}}>Order Number</Text></View>
                 <View style={{width:wp(100),marginLeft:10}}>
                 <Text style={{fontWeight:'bold',textAlign:'center'}}>Order Date</Text></View>
                 <View style={{width:wp(80),marginLeft:10}}>
                 <Text style={{fontWeight:'bold',textAlign:'center'}}>Status</Text></View>
                 {/* <Text style={{marginLeft:20,fontWeight:'bold',}}>City</Text> */}
                </View>
            </View>
    )
  }
render(){
    return(
        <View style={styles.container}>
           <View style={styles.headerView}>
          <View style={styles.BackButtonContainer}>
           
              <Icon name="arrow-back" size={25} color={"#fff"} onPress={()=>{this.props.navigation.goBack()}} />
           
          </View>
          <View style={styles.TitleContainer}>
          {this.state.NoData==false?<View>
               <TextInput placeholder="Search" style={{backgroundColor:'#fff',width:wp(250),height:hp(50)}} onChangeText={(text)=>{this.searchFilterFunction(text)}}    />
            </View>:<View style={{flex:0.6}}>
              <Text style={styles.TitleStyle}>{this.props.route.params.dataItem.name}</Text>
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
        <Spinner
          visible={this.state.spinner}
          color='#1976D2'
        />
        </View>
        <View style={{flex:0.9}}>
            <ScrollView horizontal={true}>
         <FlatList
         keyExtractor={(item, index) => index.toString()} 
         data={this.state.tableData}
         initialNumToRender={20}
         maxToRenderPerBatch={20}
         ListHeaderComponent={this.listHeader}
         ListEmptyComponent={this.nodata}
        //  ListFooterComponent={this.BottomView}
         numColumns={1}
         renderItem={this.renderItem}
          />
          </ScrollView>
          </View>
          <View style={{flex:0.1}}>
          <View style={{justifyContent:'center',alignItems:'center',marginTop:10}}>
      <TouchableOpacity style={{backgroundColor:'#1976D2',width:200,height:45,justifyContent:'center',alignItems:'center',borderRadius:10}}
           onPress={()=>{this.props.navigation.navigate('CreateOrder',{dataItem:this.props.route.params.dataItem})}} >
                <Text style={{color:'#fff',fontSize:18}}>Create Order</Text>
                </TouchableOpacity>
                </View> 
          </View>
      </View>
    )
}
}
const styles = StyleSheet.create({
    container: { flex: 1,backgroundColor:'#fff' },
    head: { height: 40, backgroundColor: '#f1f8ff' },
    text: { margin: 6 },
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
        // flex: 0.2,
      marginRight:10,
      backgroundColor: '#1976D2',
    },
    TitleContainer: {
      flexDirection: 'row',
      // flex: 0.57,
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