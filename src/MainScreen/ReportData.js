import React, { Component } from 'react';
import {TextInput,View,TouchableOpacity,Text,StyleSheet} from 'react-native';
import firebase from '../utils/firebase';
import resp from 'rn-responsive-font';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ChildChart from '../scenes/Chart/ChildChart/childchart';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import {BASE_URL} from '../utils/BaseUrl';
export default class ReportScreen extends Component{
state={
    text:"",
    ReportData:[],
    token:'',
    

}
data=()=>{
  firebase.database().ref('Stock/').push({
      StockName:this.state.text
  }).then((data)=>{
      console.log('data',data)
  }).catch((err)=>{
      console.log('error',err);
  });
}
componentDidMount(){
    AsyncStorage.getItem('@loginToken').then(succ=>{
        if(succ){
       this.setState({token:succ});
      //  this.dataFetchStockItem();
        }
      });
   console.log('props in report data',JSON.stringify(this.props.route.params.dataItem.orgid))
}
dataFetchStockItem=()=>{
  console.log('token',this.state.token,'orgid',this.props.route.params.dataItem)
    var EditProfileUrl = `${BASE_URL}/dms-demo/FetchLoginEntityMasterData?logintoken=${this.state.token}&sourcetype=AndroidSalesPersonApp&startIndex=0&packetSize=100&selEntityId=${this.props.route.params.dataItem.orgid}&selEntityType=superstockist&reportDataSource=FetchEntityCustomersDetail`
    console.log('Add product Url:' + EditProfileUrl)
    fetch(EditProfileUrl,  {
      method: 'Post',
      headers:{
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(responseData => {
        if (responseData !== 'Error - Invalid username / password') {
        
          console.log(JSON.stringify(responseData.customerDetails.data));
        } else {
         alert(responseData);
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
  let item=this.props.navigation;
  console.log('item',item);
  console.log(this.props.navigation);
    return(
        <View style={{flex:1,backgroundColor:'#fff',}}>
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
            <View style={{justifyContent:'center',alignItems:'center',marginTop:25,marginBottom:10}}>
                <TouchableOpacity style={{backgroundColor:'#1976D2',width:200,height:45,justifyContent:'center',alignItems:'center',borderRadius:10}}
                 onPress={()=>{this.props.navigation.navigate('CustomerGrid',{dataItem:this.props.route.params.dataItem})}}>
                     <Text style={{color:'#fff',fontSize:18}}>View Details</Text>
                     </TouchableOpacity>
            </View>
             <ChildChart item={'Report data'} propsData={this.props} dataNavigate={this.props.navigation} ItemChild={this.props.route.params.dataItem.name} />
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