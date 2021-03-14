import React, { Component } from 'react';
import {TextInput,View,TouchableOpacity,Alert,Text,ScrollView,StyleSheet,FlatList, Dimensions,BackHandler,ActivityIndicator} from 'react-native';
import firebase from '../utils/firebase';
import { Table, Row, Rows } from 'react-native-table-component';
import resp from 'rn-responsive-font';
import Icon from 'react-native-vector-icons/Ionicons'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';
import { wp, hp } from '../utils/heightWidthRatio';
import { CommonActions } from '@react-navigation/native';
let width=Dimensions.get('window').width;
export default class SalesinTransit extends Component{
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
     }
      backItems(){
        if (this.props.navigation.isFocused()) { 
          console.log('working')
          this.props.navigation.goBack();
          return true;
      } 
    }
searchFilterFunction = (text) => {
  console.log('name',text);
  if (text) {
    this.onEndReached = true
    let combineArray=this.state.tableData
    const newData = combineArray.filter(
      function (item) {
        const itemData = item.itemname
          ? item.itemname.toUpperCase()
          : ''.toUpperCase();
          const itemgroup=item.itemdescription
            ?item.itemdescription.toUpperCase()
                        :''.toUpperCase();
                        const itemUnit=item.itemgroup
                        ?item.itemgroup.toUpperCase()
                                    :''.toUpperCase();
                                    const itemStock=item.instockqty
                                    ?item.instockqty.toUpperCase()
                                                :''.toUpperCase();
        const textData = text.toUpperCase();
        return (
          itemData.indexOf(textData) > -1 ||
          itemgroup.indexOf(textData) > -1 ||
          itemUnit.indexOf(textData) > -1 ||
          itemStock.indexOf(textData) >-1
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
}
renderItem = ({ item,index }) => (
    <View key={index}>
     <TouchableOpacity style={{flexDirection:'row',height:'auto',}} >
       <View style={{width:wp(150),alignSelf:'flex-start',flexDirection:'row',justifyContent:'flex-start',alignItems:'flex-start',marginLeft:10}}>
     <Text style={{fontSize:13,marginLeft:5,flexWrap:'wrap',marginBottom:10,}}>{item.itemname}</Text>
     </View>
     <View style={{width:wp(150),alignSelf:'center',flexDirection:'row',justifyContent:'flex-start',alignItems:'flex-start',marginLeft:10}}>
     <Text style={{fontSize:13,marginLeft:15,flexWrap:'wrap',marginBottom:10,textAlign:'left'}}>{item.itemdescription}</Text>
     </View>
     <View style={{width:wp(120),alignSelf:'flex-end',flexDirection:'row',justifyContent:'flex-start',alignItems:'flex-start',marginLeft:10}}>
     <Text style={{fontSize:13,marginLeft:15,flexWrap:'wrap',marginBottom:10,textAlign:'left'}}>{item.itemgroup}</Text>
     </View>
     <View style={{width:wp(80),alignSelf:'flex-end',flexDirection:'row',justifyContent:'flex-start',alignItems:'flex-start',marginLeft:10}}>
     <Text style={{fontSize:13,marginLeft:15,flexWrap:'wrap',marginBottom:10,textAlign:'left'}}>{item.instockqty}</Text>
     </View>
     </TouchableOpacity>
     <View style={{borderWidth:0.5,backgroundColor:'black'}}></View>
    </View>
  );
  dataFetchStockItem=()=>{
    let orgid=JSON.stringify(this.props.route.params.dataItem.orgid);
    let type=JSON.stringify(this.props.route.params.dataItem.typecus);
    var EditProfileUrl = `http://demo.3ptec.com/dms-demo/mobile-json-data?logintoken=${JSON.stringify(this.state.token)}&sourcetype=AndroidSalesPersonApp&fileDataSource=reorder-invoice-fetch&inputFieldsData={"selEntityId":${JSON.stringify(this.state.orgId)},"selEntityType":${JSON.stringify(this.state.type)},"selZoneId":${JSON.stringify(this.state.zoneid)},"selCustomerType": ${type},"selCustomerId":${orgid},"timeoffset": "330"}`
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
                if(Object.prototype.toString.call(responseData) === '[object Array]'){
                  this.hideLoading();
                  this.setState({tableData:responseData,masterlist:responseData});
                  console.log(JSON.stringify(responseData));
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
  listHeader=()=>{
    return(
      <View style={{marginTop:8,marginBottom:5,marginLeft:5,}}>
      {this.state.NoData==false?<View style={{flexDirection:'row',}}>
      <View style={{width:wp(150),alignSelf:'flex-start'}}>
      <Text style={{fontWeight:'bold',textAlign:'center'}}>Name</Text></View>
      <View style={{width:wp(150),alignSelf:'center'}}>
      <Text style={{fontWeight:'bold',textAlign:'center'}}>Description</Text></View>
      <View style={{width:wp(120),}}>
       <Text style={{fontWeight:'bold',textAlign:'center'}}>Group</Text></View>
       <View style={{width:wp(80),marginLeft:10}}>
       <Text style={{fontWeight:'bold',textAlign:'center'}}>Stock Qty</Text></View>
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
            </View>:<View >
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
         <ScrollView horizontal={true}>
         <FlatList
         keyExtractor={(item, index) => index.toString()} 
         style={{flex:0.2}}
         data={this.state.tableData}
         initialNumToRender={20}
         maxToRenderPerBatch={20}
         ListEmptyComponent={this.nodata}
         ListHeaderComponent={this.listHeader}
         numColumns={1}
         renderItem={this.renderItem}
          />
          </ScrollView>
      </View>
    )
}
}
const styles = StyleSheet.create({
    container: { flex: 1, },
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