import React, { Component } from 'react';
import {TextInput,View,TouchableOpacity,Text,Alert,ScrollView,StyleSheet,FlatList, Dimensions,BackHandler,ActivityIndicator} from 'react-native';
import firebase from '../utils/firebase';
import { Table, Row, Rows } from 'react-native-table-component';
import resp from 'rn-responsive-font';
import Spinner from 'react-native-loading-spinner-overlay';
import Icon from 'react-native-vector-icons/Ionicons'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';
import moment from 'moment';
import { wp, hp } from '../utils/heightWidthRatio';
import {BASE_URL} from '../utils/BaseUrl';
let width=Dimensions.get('window').width;
export default class OpenPurchaseChildScreen extends Component{
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
              grossValue:'',
              taxamount:''
        }
        let onEndReached = false;
        this.backItems= this.backItems.bind(this);
    }
    componentWillUnmount(){
      BackHandler.removeEventListener('hardwareBackPressed',this.backItems);
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
        const itemData = item.itemname
          ? item.itemname.toUpperCase()
          : ''.toUpperCase();
          const itemgroup=item.pkgunit
            ?item.pkgunit.toUpperCase()
                        :''.toUpperCase();
                        const itemUnit=item.pkgunitrate
                        ?item.pkgunitrate.toUpperCase()
                                    :''.toUpperCase();
                                    const status=item.actqtypkgunits
                        ?item.actqtypkgunits.toUpperCase()
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
  BackHandler.addEventListener('hardwareBackPressed',this.backItems);
//   this.getCustomerData();
  
}

renderItem = ({ item,index }) => 
{
  console.log('item',item);
  return(
    <View key={index}>
     <TouchableOpacity style={{flexDirection:'row',height:'auto',}} >
       <View style={{width:wp(100),alignSelf:'flex-start',flexDirection:'row',justifyContent:'flex-start',alignItems:'flex-start',marginLeft:10}}>
     <Text style={{fontSize:13,marginLeft:5,flexWrap:'wrap',marginBottom:10,}}>{item.itemname}</Text>
     </View>
     <View style={{width:wp(90),alignSelf:'flex-start',flexDirection:'row',justifyContent:'flex-start',alignItems:'flex-start',}}>
     <Text style={{fontSize:13,flexWrap:'wrap',marginBottom:10,textAlign:'left'}}>{item.pkgunit}</Text>
     </View>
     <View style={{width:wp(100),alignSelf:'flex-start',flexDirection:'row',justifyContent:'flex-start',alignItems:'flex-start'}}>
     <Text style={{fontSize:13,flexWrap:'wrap',marginBottom:10,textAlign:'left'}}>{item.pkgunitrate}</Text>
     </View>
     <View style={{width:wp(80),alignSelf:'flex-start',flexDirection:'row',justifyContent:'flex-start',alignItems:'flex-start',}}>
     <Text style={{fontSize:13,flexWrap:'wrap',marginBottom:10,textAlign:'left'}}>{item.actqtypkgunits}</Text>
     </View>
     {/* <View style={{width:wp(80),alignSelf:'flex-end',flexDirection:'row',justifyContent:'flex-start',alignItems:'flex-start',marginLeft:10}}>
     <Text style={{fontSize:13,marginLeft:15,flexWrap:'wrap',marginBottom:10,textAlign:'left'}}>{item.status}</Text>
     </View> */}
     
    
     </TouchableOpacity>
     <View style={{borderWidth:0.5,backgroundColor:'black'}}></View>

    </View>
  );
}
  
  dataFetchStockItem=()=>{
    let orderID=JSON.stringify(this.props.route.params.orderID);
    var EditProfileUrl = `${BASE_URL}/dms-demo/mobile-json-data?logintoken=${this.state.token}&sourcetype=AndroidSalesPersonApp&fileDataSource=salesorder-print&inputFieldsData={"selEntityId":${JSON.stringify(this.state.orgId)},"selEntityType":${JSON.stringify(this.state.type)},"salesOrderId":${orderID}}`
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
                console.log(responseData);
                if(Object.prototype.toString.call(responseData) === '[object Object]'){
                  console.log('working');
                  this.hideLoading();
                  let arr=[]
                  arr.push(responseData.lineitem);
                  console.log('working',JSON.stringify(responseData));
                  let grossValue=0;
                  let taxamount=0;
                  responseData.lineitem.map((item,index)=>{
                    grossValue+=Number(item.actqtyamount);
                    taxamount+=Number(item.taxamount)
                  });
                  let newGrossvalue=grossValue.toFixed(2);
                  let newtaxamount=taxamount.toFixed(2);
                 let grossnum= newGrossvalue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                 let taxamountnum= newtaxamount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                  this.setState({tableData:responseData.lineitem,masterlist:responseData.lineitem,grossValue:grossnum,taxamount:taxamountnum});
                  console.log('gross value',grossnum,'tax amount',taxamountnum);
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
  return(<View style={{width:width,justifyContent:'center',alignItems:'center',marginTop:hp(45)}}>
      {this.state.NoData?<Text>No Data Found</Text>:null}
   </View>
  )
}
  BottomView=()=>
  {
    return (
       
      <View style={{justifyContent:'center',alignItems:'center',marginTop:10,width:width}}>
      <TouchableOpacity style={{backgroundColor:'#1976D2',width:200,height:45,justifyContent:'center',alignItems:'center',borderRadius:10}} onPress={()=>{this.props.navigation.navigate('CreateOrder',{dataItem:this.props.route.params.dataItem})}}>
                <Text style={{color:'#fff',fontSize:18}}>Create Order</Text>
                </TouchableOpacity>
                </View>       
 
        
    )
  }
  listHeader=({item,index})=>{
    return(
      <View style={{marginTop:8,marginBottom:5,marginLeft:5,}}>
               {!this.state.NoData?<View style={{flexDirection:'row',}}>
                <View style={{width:wp(100),alignSelf:'flex-start',marginLeft:5}}>
                <Text style={{fontWeight:'bold',textAlign:'left'}}>Item Name</Text></View>
                <View style={{width:wp(90),justifyContent:'flex-start',alignItems:'flex-start'}}>
                <Text style={{fontWeight:'bold',textAlign:'left',}}>UOM</Text></View>
                <View style={{width:wp(100),justifyContent:'flex-start',alignItems:'flex-start'}}>
                 <Text style={{fontWeight:'bold',textAlign:'left'}}>Rate</Text></View>
                 <View style={{width:wp(100),justifyContent:'flex-start',alignItems:'flex-start'}}>
                 <Text style={{fontWeight:'bold',textAlign:'left'}}>Order Qty</Text></View>
                 {/* <View style={{width:wp(80),justifyContent:'center',alignItems:'center'}}>
                 <Text style={{fontWeight:'bold',textAlign:'center'}}>Status</Text></View> */}
                 {/* <Text style={{marginLeft:20,fontWeight:'bold',}}>City</Text> */}
                </View>:null}
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
        {!this.state.NoData?<View style={{backgroundColor:'#1976D2',margin:10,}}>
          <View style={{justifyContent:'flex-start',alignItems:'flex-start',marginTop:15,marginBottom:10,marginLeft:wp(10)}}>
                <TouchableOpacity style={{width:'auto',height:'auto',justifyContent:'center',alignItems:'center',borderRadius:10}}>
                     <View style={{margin:10,flexDirection:'row'}}>
                     <View style={{flex:0.3}}>
                     <Text style={{color:'#fff',fontSize:17}}>Gross Value</Text>
                     </View>
                     <View style={{flex:0.7}}>
                     <Text style={{color:'#fff',fontSize:17}}>{this.state.grossValue}</Text>
                     </View>
                     </View>
                     </TouchableOpacity>
            </View> 
            <View style={{borderWidth:1,borderColor:'#fff',}}></View>
            <View style={{justifyContent:'flex-start',alignItems:'flex-start',marginTop:15,marginBottom:10,marginLeft:wp(10)}}>
                <TouchableOpacity style={{backgroundColor:'#1976D2',width:'auto',height:'auto',justifyContent:'center',alignItems:'center',borderRadius:10}}>
                     <View style={{margin:10,flexDirection:'row'}}>
                       <View style={{flex:0.3}}>
                     <Text style={{color:'#fff',fontSize:17}}>Tax Value</Text>
                     </View>
                     <View style={{flex:0.7}}>
                     <Text style={{color:'#fff',fontSize:17}}>{this.state.taxamount}</Text>
                     </View>
                     </View>
                     </TouchableOpacity>
            </View>
            </View>:null}
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