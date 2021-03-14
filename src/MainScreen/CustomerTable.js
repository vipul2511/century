import React, { Component } from 'react';
import {TextInput,View,TouchableOpacity,Text,ScrollView,StyleSheet,FlatList, Dimensions,BackHandler,ActivityIndicator} from 'react-native';
import firebase from '../utils/firebase';
import { Table, Row, Rows } from 'react-native-table-component';
import resp from 'rn-responsive-font';
import Icon from 'react-native-vector-icons/Ionicons'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { wp, hp } from '../utils/heightWidthRatio';
import moment from 'moment';
let width=Dimensions.get('window').width;
export default class CustomerTable extends Component{
    constructor(props){
        super(props);
        this.state={
            text:"",
            ReportData:[],
            tableHead: ['Head', 'Head2', 'Head3', 'Head4'],
              tableData: [],
              masterlist:'',
              totalCount:'',
              orgId:'',
              token:'',
              loading:false,
              time:'',
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
getCustomerData=()=>{
    firebase.database().ref('StockMasterTable/Totalcount').once('value',(snap)=>{
        this.setState({totalCount:snap.val()});
        console.log(snap.val())
      })
      firebase.database().ref('StockMasterTable/Time').once('value',(snap)=>{
        let mill=snap.val();
        let time=moment(Number(mill)).format('lll');
        this.setState({time:time});
        console.log('the time',time);
      })
  firebase.database().ref('StockMasterTable/data/').on('value',(snap) =>{
    let items =this.state.tableData;
    snap.forEach((child)=>{
      items.push({
        city:child.val().city,
        type:child.val().orgtypename,
        name:child.val().name,
        orggroup:child.val().orggroup,
        orgid:child.val().orgid,
        loginid:child.val().loginid,
      });
    });
    console.log(items);
    this.setState({masterlist:items});
    this.setState({tableData:items});
    this.setState({loading:false});
    console.log('report',this.state.tableData.length)
  });
}
componentDidMount(){
   AsyncStorage.getItem('@loginToken').then(succ=>{
     if(succ){
    this.setState({token:succ});
     }
   })
  BackHandler.addEventListener('hardwareBackPressed',this.backItems);
  this.getCustomerData();
  
}
// pressData=(data)=>{
//   console.log(JSON.stringify(data))
//   if(data.loginid==""){
//     this.props.navigation.navigate('CustomerGrid',{dataItem:data})
//   }else{
//     this.props.navigation.navigate('ReportScreen',{dataItem:data})
//   }
  
// }
renderItem = ({ item,index }) => (
    <View key={index}>
     <TouchableOpacity style={{flexDirection:'row',height:'auto',}} >
       <View style={{flex:0.6,alignSelf:'flex-start',flexDirection:'row'}}>
     <Text style={{fontSize:13,marginLeft:5,flexWrap:'wrap',marginBottom:10}}>{item.name}</Text>
     </View>
     <View style={{flex:0.5,alignSelf:'center',flexDirection:'row'}}>
     <Text style={{fontSize:13,marginLeft:15,flexWrap:'wrap',marginBottom:10}}>{item.orggroup}</Text>
     </View>
     <View style={{flex:0.4,alignSelf:'flex-end',flexDirection:'row'}}>
     <Text style={{fontSize:13,marginLeft:15,flexWrap:'wrap',marginBottom:10}}>{item.type}</Text>
     </View>
     {/* <Text style={{fontSize:13,marginLeft:20}}>{item.contact}</Text> */}
     {/* <Text style={{fontSize:13,marginLeft:20,}}>{item.city}</Text> */}
    
     </TouchableOpacity>
     <View style={{borderWidth:0.5,backgroundColor:'black'}}></View>
    </View>
  );
  stockDatainDB=(data,count,time)=>{
    firebase.database().ref('StockMasterTable/').set({data,Totalcount:count,Time:time}).then((data)=>{
      console.log('data',data);
      this.getCustomerData()
  }).catch((err)=>{
      console.log('error',err);
  })
    }
  dataFetchStockItem=()=>{
    var EditProfileUrl = `http://demo.3ptec.com/dms-demo/FetchLoginEntityMasterData?logintoken=${this.state.token}&sourcetype=AndroidSalesPersonApp&startIndex=0&packetSize=100&selEntityId=${this.props.route.params.orgid}&selEntityType=superstockist&reportDataSource=FetchEntityCustomersDetail`
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
          this.stockDatainDB(responseData.customerDetails.data,responseData.customerDetails.totalCount,responseData.customerDetails.serviceTimeMilliSec);
          console.log(JSON.stringify(responseData.customerDetails.data));
        } else {
         console.log(responseData);
        }
        // console.log('contact list response object:', JSON.stringify(responseData))
      })
      .catch(error => {
        //  this.hideLoading();
        console.error('error coming',error)
      })
      .done()
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
render(){
    return(
        <View style={styles.container}>
           <View style={styles.headerView}>
          <View style={styles.BackButtonContainer}>
           
              <Icon name="arrow-back" size={25} color={"#fff"} onPress={()=>{this.props.navigation.goBack()}} />
           
          </View>
          <View style={styles.TitleContainer}>
            <View
              >
              {/* <Text style={styles.TitleStyle}>Century</Text> */}
              <TextInput placeholder="Search" style={{backgroundColor:'#fff',width:wp(250),height:hp(50)}} onChangeText={(text)=>{this.searchFilterFunction(text)}}    />
            </View>
          </View>
          <TouchableOpacity
            style={styles.SearchContainer}
            onPress={() => {
              this.props.navigation.navigate('DashBoardScreen')
            }}>
               <Icon name="home"  size={25} color={"#fff"} onPress={()=>{this.props.navigation.navigate('DashBoardScreen')}} />
          </TouchableOpacity>
        </View>
        <View>
        <View style={{flexDirection:'row'}}>
     
          <Text style={{fontSize:13}}>Last Refresh- {this.state.time}</Text>
          <Text style={{position:'absolute',right:5,fontWeight:'bold'}}>Total Count-{this.state.totalCount}</Text>
      
        </View>
        </View>
            <View style={{marginTop:8,marginBottom:5,marginLeft:5,}}>
                <View style={{flexDirection:'row',}}>
                <View style={{flex:0.6,alignSelf:'flex-start'}}>
                <Text style={{fontWeight:'bold',}}>Customer Name</Text></View>
                <View style={{flex:0.3,alignSelf:'center'}}>
                <Text style={{fontWeight:'bold',}}>Group</Text></View>
                <View style={{flex:0.4,alignSelf:'flex-end'}}>
                 <Text style={{fontWeight:'bold',}}>Customer Type</Text></View>
                 {/* <Text style={{marginLeft:20,fontWeight:'bold',}}>City</Text> */}
                </View>
            </View>
         <FlatList
         keyExtractor={(item, index) => index.toString()} 
         style={{flex:0.2}}
         data={this.state.tableData}
         initialNumToRender={20}
         maxToRenderPerBatch={20}
         onEndReachedThreshold={0.1}
         onMomentumScrollBegin = {() => {this.onEndReached = false;}}
         numColumns={1}
         renderItem={this.renderItem}
         ListFooterComponent={this.BottomView}
         onEndReached = {() => {
          if (!this.onEndReached) {
            console.log('reached')
               this.dataFetchStockItem();   // on End reached
                this.onEndReached = true;
          }
        }
       }
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
      // flex:0.2,
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