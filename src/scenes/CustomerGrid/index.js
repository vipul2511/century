import React, { Component } from 'react';
import {TextInput,View,TouchableOpacity,Text,StyleSheet,ScrollView,Alert,Modal} from 'react-native';
import { wp, hp } from '../../utils/heightWidthRatio';
import resp from 'rn-responsive-font';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase from '../../utils/firebase';
import { CommonActions } from '@react-navigation/native';
export default class CustomerGrid extends Component{
state={
    text:"",
    ReportData:[],
    token:'',
    openModal:false,
    address:''
}

componentDidMount(){
  AsyncStorage.getItem('@loginToken').then(succ=>{
    if(succ){
   this.setState({token:succ});
   console.log('login token',succ); 
   this.dataFetchStockItem();
   this.dataFetch();
   let address=this.props.route.params.dataItem.city+','+this.props.route.params.dataItem.state+','+this.props.route.params.dataItem.country;
   console.log(address);
   console.log(this.props.route.params.dataItem.emailid,this.props.route.params.dataItem.contactno)
   this.setState({address:address})
    }
  });
  console.log('props of grid view',JSON.stringify(this.props.route.params.dataItem.orgid))
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
storeDatainDB=(data,count,time)=>{
  firebase.database().ref('CustomerMasterTable/').set({data,Totalcount:count,Time:time}).then((data)=>{
    console.log('data',data,count)
}).catch((err)=>{
    console.log('error',err);
})
  }
  stockDatainDB=(data,count,time)=>{
    firebase.database().ref('StockMasterTable/').set({data,Totalcount:count,Time:time}).then((data)=>{
      console.log('data',data,count)
  }).catch((err)=>{
      console.log('error',err);
  })
    }
dataFetchStockItem=()=>{
  var EditProfileUrl = `http://demo.3ptec.com/dms-demo/FetchLoginEntityMasterData?logintoken=${this.state.token}&sourcetype=AndroidSalesPersonApp&startIndex=0&packetSize=500&selEntityId=${this.props.route.params.dataItem.orgid}&selEntityType=superstockist&reportDataSource=FetchEntityCustomersDetail`
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
      if (responseData !== 'Error - Invalid username / password' ) {
        this.stockDatainDB(responseData.customerDetails.data,responseData.customerDetails.totalCount,responseData.customerDetails.serviceTimeMilliSec);
        console.log(JSON.stringify(responseData));
      } else {
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
dataFetch=()=>{
  var EditProfileUrl = `http://demo.3ptec.com/dms-demo/FetchLoginEntityMasterData?logintoken=${this.state.token}&sourcetype=AndroidSalesPersonApp&startIndex=0&packetSize=500&selEntityId=${this.props.route.params.dataItem.orgid}&selEntityType=superstockist&reportDataSource=FetchEntityStockItems`
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
        if (responseData !== 'Error - Invalid username / password' ) {
          this.storeDatainDB(responseData.stockItems.data,responseData.stockItems.totalCount,responseData.stockItems.serviceTimeMilliSec);
          console.log(JSON.stringify(responseData));
        } else {
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
render(){
    return(
        <View style={{flex:1,backgroundColor:'#fff'}}>
            <View style={styles.headerView}>
          <View style={styles.BackButtonContainer}>
           
          <Ionicons name="arrow-back"  size={25} color={"#fff"} onPress={()=>{this.props.navigation.goBack()}} />
           
          </View>
          <View style={styles.TitleContainer}>
            <View
              style={{alignItems: 'center', justifyContent: 'center'}}>
              <Text style={styles.TitleStyle}>{this.props.route.params.dataItem.name}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.SearchContainer}
            onPress={() => {
              this.props.navigation.navigate('DashBoardScreen')
            }}>
             <Ionicons name="home"  size={25} color={"#fff"} onPress={()=>{this.props.navigation.navigate('DashBoardScreen')}} />
          </TouchableOpacity>
        </View>
          <ScrollView>
            <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
           <TouchableOpacity style={{backgroundColor:'#fff',elevation:5,width:wp(150),height:hp(120),margin:15}} onPress={()=>{this.props.navigation.navigate('StockTable',{orgid:this.props.route.params.dataItem.orgid})}}>
            <View style={{justifyContent:'center',alignItems:'center',marginTop:15}}>
                <Text style={{fontWeight:'bold'}}>Stock</Text>
                <MaterialCommunityIcons name="stocking" size={30} style={{marginTop:25}} color="#1976D2" />
            </View>
           </TouchableOpacity>
           <TouchableOpacity style={{backgroundColor:'#fff',elevation:5,width:wp(150),height:hp(120),margin:15}} onPress={()=>{this.setState({openModal:true})}}>
            <View style={{justifyContent:'center',alignItems:'center',marginTop:15}}>
                <Text style={{fontWeight:'bold'}}>Address</Text>
                <Entypo name="location" size={30} style={{marginTop:25}} color="#1976D2" />
            </View>
           </TouchableOpacity>
           </View>
           <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
           <TouchableOpacity style={{backgroundColor:'#fff',elevation:5,width:wp(150),height:hp(120),margin:15}} onPress={()=>{this.props.navigation.navigate('SecondarySales',{dataItem:this.props.route.params.dataItem})}}>
            <View style={{justifyContent:'center',alignItems:'center',marginTop:15}}>
                <Text style={{fontWeight:'bold'}}>Secondary Sales</Text>
                <Entypo name="line-graph" size={30} style={{marginTop:25}} color="#1976D2" />
            </View>
           </TouchableOpacity>
           <TouchableOpacity style={{backgroundColor:'#fff',elevation:5,width:wp(150),height:hp(120),margin:15}} onPress={()=>{this.props.navigation.navigate('SalesinTransit',{dataItem:this.props.route.params.dataItem})}}>
            <View style={{justifyContent:'center',alignItems:'center',marginTop:15}}>
                <Text style={{fontWeight:'bold'}}>Customer re-order data</Text>
                <Entypo name="line-graph" size={30} style={{marginTop:25}} color="#1976D2" />
            </View>
           </TouchableOpacity>
           </View>
           <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
           <TouchableOpacity style={{backgroundColor:'#fff',elevation:5,width:wp(150),height:hp(120),margin:15}} onPress={()=>{this.props.navigation.navigate('BPR',{dataItem:this.props.route.params.dataItem})}}>
            <View style={{justifyContent:'center',alignItems:'center',marginTop:15}}>
                <Text style={{fontWeight:'bold'}}>Open Purchase order</Text>
                <FontAwesome name="first-order" size={30} style={{marginTop:25}} color="#1976D2" />
            </View>
           </TouchableOpacity>
           <TouchableOpacity style={{backgroundColor:'#fff',elevation:5,width:wp(150),height:hp(120),margin:15}} onPress={()=>{this.props.navigation.navigate('OpenPurchase',{dataItem:this.props.route.params.dataItem})}}>
            <View style={{justifyContent:'center',alignItems:'center',marginTop:15}}>
                <Text style={{fontWeight:'bold'}}>B P R</Text>
                <Entypo name="documents" size={30} style={{marginTop:25}} color="#1976D2" />
            </View>
           </TouchableOpacity>
           </View>
           <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
           <TouchableOpacity style={{backgroundColor:'#fff',elevation:5,width:wp(150),height:hp(120),margin:15}} onPress={()=>{this.props.navigation.navigate('BillingOutlet',{dataItem:this.props.route.params.dataItem,orgid:this.props.route.params.dataItem.orgid})}}>
            <View style={{justifyContent:'center',alignItems:'center',marginTop:15}}>
                <Text style={{fontWeight:'bold'}}>No Billing Outlet</Text>
                <FontAwesome5 name="file-invoice" size={30} style={{marginTop:25}} color="#1976D2" />
            </View>
           </TouchableOpacity>
           <TouchableOpacity style={{backgroundColor:'#fff',elevation:5,width:wp(150),height:hp(120),margin:15}} onPress={()=>{this.props.navigation.navigate('CustomerTable',{orgid:this.props.route.params.dataItem.orgid})}}>
            <View style={{justifyContent:'center',alignItems:'center',marginTop:15}}>
                <Text style={{fontWeight:'bold'}}>Customer list</Text>
                <Entypo name="users" size={30} style={{marginTop:25}} color="#1976D2" />
            </View>
           </TouchableOpacity>
           </View>
           </ScrollView>
           <Modal animationType='slide'  transparent={true} onBackdropPress={() => this.setState({ openModal: false })}   visible={this.state.openModal} onRequestClose={()=>{this.setState({openModal:false})}} >
         <View style={{justifyContent:'center',alignItems:'center',flex:1}}>
          <View style={{width:300,height:300,backgroundColor:"#fff",elevation:15,borderRadius:15,}}>
            <TouchableOpacity style={{alignSelf:'flex-end',justifyContent:'center',alignItems:'center'}} onPress={()=>{this.setState({openModal:false})}}><Entypo name="cross" size={25} style={{alignSelf:'flex-end',marginTop:10,marginRight:10}} /></TouchableOpacity>
            <Text style={{fontWeight:'bold',marginLeft:15,marginTop:8}}>Address</Text>
                <Text style={{marginLeft:15,marginTop:8,marginBottom:15,flexWrap:'wrap'}}>{this.state.address}</Text>
                <Text style={{fontWeight:'bold',marginLeft:15,marginTop:8}}>Email ID</Text>
                <Text style={{marginLeft:15,marginTop:8,marginBottom:15,flexWrap:'wrap'}}>{this.props.route.params.dataItem.emailid}</Text>
                <Text style={{fontWeight:'bold',marginLeft:15,marginTop:8}}>Contact Number</Text>
                <Text style={{marginLeft:15,marginTop:8,marginBottom:15,flexWrap:'wrap'}}>{this.props.route.params.dataItem.contactno}</Text>
                 </View>
                 
          </View>
         </Modal>
        </View>
    )
}
}
const styles = StyleSheet.create({
    SearchContainer: {
        flex: 0.1,
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
        flex: 0.2,
        marginLeft: 10,
        backgroundColor: '#1976D2',
      },
      TitleContainer: {
        flexDirection: 'row',
        flex: 0.6,
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