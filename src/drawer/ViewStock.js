import React, { Component } from 'react';
import {TextInput,View,TouchableOpacity,Animated,Text,ScrollView,StyleSheet,FlatList, Dimensions,BackHandler,ActivityIndicator} from 'react-native';
import firebase from '../utils/firebase';
import { Table, Row, Rows } from 'react-native-table-component';
import resp from 'rn-responsive-font';
import Icon from 'react-native-vector-icons/Ionicons'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { wp, hp } from '../utils/heightWidthRatio';
import moment from 'moment';
import {BASE_URL} from '../utils/BaseUrl';
import Database from '../utils/Database';
import Spinner from 'react-native-loading-spinner-overlay';
const db = new Database();
let width=Dimensions.get('window').width;
export default class ViewStock extends Component{
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
              searchText:'',
              spinner:false,
              NoDataShow:false,
              syncingText:'Syncing Please wait....',
              callingName:'',
              progressStatus: 0,
              syncingText:'',
              showCustomerloader:false,
              fromApi:false,
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
    showLoading() {
      this.setState({ spinner: true })
    }
    hideLoading() {
      this.setState({ spinner: false })
    }
    searchFilterFunction = (event) => {
      let text=event.nativeEvent.text;
      if (text) {
        db.searchInCustomerTable(text).then(succ=>{
          let NoData=false;
          if(succ.length==0) NoData=true
          this.setState({ tableData: succ,noMoreLoad:false,NoDataShow:NoData});
        }).catch(err=>{
        })
      } else {
        this.setState({ tableData: this.state.masterlist,noMoreLoad:true });
        this.onEndReached = true
      }
    };
getCustomerData=async()=>{
  this.setState({progressStatus: parseInt(70)}); 
  db.retrieveCustomerTime().then(succ=>{
    let millTime=succ[0].time;
    let count=succ[0].count;
    let time = moment(Number(millTime)).format('lll');
     this.setState({time:time,totalCount:count})
   console.log('time count',succ);
  })
  db.retrieveCustomer().then(table=>{
 let NoData=false;
 if(table.length==0) NoData=true

 this.setState({tableData:table,masterlist:table,NoDataShow:NoData,showCustomerloader:false});
  })
}
componentDidMount(){
  AsyncStorage.getItem('@orgid').then(id=>{
    if(id){
     this.setState({orgId:id});
    }
  });
   AsyncStorage.getItem('@loginToken').then(succ=>{
     if(succ){
    this.setState({token:succ});
     }
   })
  BackHandler.addEventListener('hardwareBackPressed',this.backItems);
  this.getCustomerData();
  
}
pressData=(data)=>{
  if(data.loginid==""){
    this.props.navigation.navigate('CustomerGrid',{dataItem:data})
  }else{
    this.props.navigation.navigate('ChildChart',{dataItem:data,})
  }
  
}
searchText=(text)=>{
  if(text){
    this.setState({searchText:text}) 
  }else{
    this.searchFilterFunction(text)
  }
}
renderItem = ({ item,index }) => (
    <View key={index}>
     <TouchableOpacity style={{flexDirection:'row',height:'auto',}} onPress={()=>{this.pressData(item)}}>
       <View style={{flex:0.7,alignSelf:'flex-start',flexDirection:'row'}}>
     <Text style={{fontSize:13,marginLeft:5,flexWrap:'wrap',marginBottom:10}}>{item.name}</Text>
     </View>
     <View style={{flex:0.3,alignSelf:'center',flexDirection:'row'}}>
     <Text style={{fontSize:13,marginLeft:15,flexWrap:'wrap',marginBottom:10}}>{item.orggroup}</Text>
     </View>
     <View style={{flex:0.5,alignSelf:'flex-end',flexDirection:'row'}}>
     <Text style={{fontSize:13,marginLeft:15,flexWrap:'wrap',marginBottom:10}}>{item.typecus}</Text>
     </View>
     {/* <Text style={{fontSize:13,marginLeft:20}}>{item.contact}</Text> */}
     {/* <Text style={{fontSize:13,marginLeft:20,}}>{item.city}</Text> */}
    
     </TouchableOpacity>
     <View style={{borderWidth:0.5,backgroundColor:'black'}}></View>
    </View>
  );
  stockDatainDB=(data,count,time)=>{
    firebase.database().ref('StockMaster/').set({data,Totalcount:count,Time:time}).then((data)=>{
      this.getCustomerData()
  }).catch((err)=>{
      console.log('error',err);
  })
    }
  dataFetchStockItem=()=>{
    this.setState({progressStatus: parseInt(0),showCustomerloader:true,syncingText:'We are all most there...Please wait',callingName:'Syncing Customer Master Data'}); 
    var EditProfileUrl = `${BASE_URL}/dms-demo/FetchLoginEntityMasterData?logintoken=${this.state.token}&sourcetype=AndroidSalesPersonApp&startIndex=0&packetSize=100&selEntityId=${this.state.orgId}&selEntityType=superstockist&reportDataSource=FetchEntityCustomersDetail`
    fetch(EditProfileUrl,  {
      method: 'Post',
      headers:{
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(responseData => {
        if (responseData !== 'Error - Invalid username / password') {
          this.setState({progressStatus: parseInt(50)}); 
          db.insertDataCustomer(responseData.customerDetails.data).then(succ=>{
            db.insertDataTimeStock(responseData.customerDetails.totalCount,responseData.customerDetails.serviceTimeMilliSec).then(succ=>{
              this.getCustomerData();
            });
          });
        } else {
         console.log(responseData);
        }
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
  Nodata=()=>{
    return(
      <View style={{justifyContent:'center',alignItems:'center',marginTop:50}}>
        {this.state.NoDataShow?<Text style={{fontWeight:'bold'}}>
          No Data Found
        </Text>:null}
      </View>
    )
  }
render(){
    return(
        <View style={styles.container}>
           <View style={styles.headerView}>
          <View style={styles.BackButtonContainer}>
              <Icon name="arrow-back" size={25} color={"#fff"} onPress={()=>{this.props.navigation.navigate('DashBoardScreen')}} />  
          </View>
          <View style={styles.TitleContainer}>
            <View>
              <TextInput placeholder="Search" style={{backgroundColor:'#fff',width:wp(250),height:hp(50)}} onChange={this.searchFilterFunction.bind(this)} />
            </View>
          </View>
          <TouchableOpacity
            style={styles.SearchContainer}
            onPress={() => {
              this.dataFetchStockItem()
            }}>
               <Icon name="sync" size={25} color="#fff" style={{marginLeft:15}} onPress={()=>{this.dataFetchStockItem()}}/>
          </TouchableOpacity>
        </View>
        <Spinner
          visible={this.state.spinner}
          color='#1976D2'
        />
          {this.state.showCustomerloader?<View style={{flex:1}}>
        <View style={{justifyContent:'center',alignItems:'center',marginTop:190}}>
         <Text style={styles.label}>  
                  {this.state.callingName} 
            </Text> 
            </View>
      <View style={styles.containerAnimation}>  
            <Animated.View  
                style={[  
                    styles.inner,{width: this.state.progressStatus +"%"},  
                ]}  
            />   
      </View>  
      <Animated.Text style={styles.label}>  
                  {this.state.syncingText} {this.state.progressStatus }%  
            </Animated.Text>  
      </View>:
      <>
        <View>
        <View style={{flexDirection:'row'}}>
          <Text style={{fontSize:13}}>Last Refresh- {this.state.time}</Text>
          <Text style={{position:'absolute',right:30,fontWeight:'bold'}}>Total Count-{this.state.totalCount}</Text>
        </View>
        </View>
            <View style={{marginTop:8,marginBottom:5,marginLeft:5,}}>
                <View style={{flexDirection:'row',}}>
                <View style={{flex:0.7,alignSelf:'flex-start'}}>
                <Text style={{fontWeight:'bold',}}>Customer Name</Text></View>
                <View style={{flex:0.2,alignSelf:'center'}}>
                <Text style={{fontWeight:'bold',}}>Group</Text></View>
                <View style={{flex:0.5,alignSelf:'flex-end'}}>
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
         ListEmptyComponent={this.Nodata}
         ListFooterComponent={this.BottomView}
         onEndReached = {() => {
          if (!this.onEndReached) {
            console.log('reached')
              //  this.dataFetchStockItem();   // on End reached
                this.onEndReached = true;
          }
        }
       }
          />
          </>
          }
      </View>
    )
}
}
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor:'#fff'},
    head: { height: 40, backgroundColor: '#f1f8ff' },
    text: { margin: 6 },
    SearchContainer: {
      // flex: 0.2,
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
    containerAnimation: {  
      width: "100%",  
      height: 40,  
      padding: 1,  
      borderColor: "black",  
      borderWidth: 3,  
      borderRadius: 5,  
      marginTop: 10,  
      justifyContent: "center",  
    },  
    inner:{  
      width: "100%",  
      height: 30,  
      borderRadius: 5,  
      justifyContent:'center',
      alignItems:'center',
      backgroundColor:"#1976D2",  
    },  
    label:{  
      fontSize:18,  
      color: "black",  
      textAlign:'center',
      // position: "absolute",  
      // zIndex: 1,  
      alignSelf: "center",  
    }, 
  });