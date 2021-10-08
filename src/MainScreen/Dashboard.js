import React,{Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  PermissionsAndroid,
  TouchableOpacity,
  Animated,
  SafeAreaViewBase,
  BackHandler,
  Alert,
} from 'react-native';
import { CommonActions } from '@react-navigation/native';
import resp from 'rn-responsive-font';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Chart from '../scenes/Chart';
import firebase from '../utils/firebase';
import Spinner from 'react-native-loading-spinner-overlay';
import Icon from 'react-native-vector-icons/Ionicons';
import {BASE_URL} from '../utils/BaseUrl';
import Database from '../utils/Database';
import NetInfo from "@react-native-community/netinfo";
import OfflineUserScreen from '../utils/OfflineScreen';
const db = new Database();
// db.initDB();
// db.initCustomerDB();
class DashBoardScreen extends Component{
     constructor(props){
         super(props);
         this.state={
           loading:'',
           progressStatus: 0,
           token:'',
           orgId:'',
           islogin:true,
           tenantName:'',
           logout:false,
           spinner:false,
           type:'',
           NoDataShow:false,
           syncingText:'Syncing Please wait....',
           callingName:'',
           connected:true
         }
         this.backItems= this.backItems.bind(this);
     }
     anim = new Animated.Value(0);  
     backItems(){
      if (this.props.navigation.isFocused()) { 
        console.log('working')
        BackHandler.exitApp();
        return true;
    } 
  }
  componentWillUnmount(){
    BackHandler.removeEventListener('hardwareBackPressed',this.backItems);
   }
   permission=async()=>{
    const granted = await PermissionsAndroid.request( PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION );
    if (granted) {
      console.log( "You can use the ACCESS_FINE_LOCATION" )
    } 
    else {
      console.log( "ACCESS_FINE_LOCATION permission denied" )
    }
   }
    componentDidMount(){
      this.checkInternet();
      BackHandler.addEventListener('hardwareBackPressed',this.backItems);
      this.permission();
      AsyncStorage.getItem('@orgid').then(id=>{
        if(id){
         this.setState({orgId:id});
        }
      });
      AsyncStorage.getItem('@tenantName').then(succ=>{
        if(succ){
          this.setState({tenantName:succ});
        }
      });
     
       AsyncStorage.getItem('@loginToken').then(succ=>{
         if(succ){
        this.setState({token:succ});
        console.log('login token',succ); 
        if(this.props.route.params){
          if(this.props.route.params.data=="from login"){
            console.log('api is called');
           this.setState({islogin:false});
           this.onAnimate(); 
           this.dataFetch();
           
          }else{
           console.log('api not is called');
          }
        }
         }
       });
       
       console.log('props values dasg',JSON.stringify(this.props))
      
    }
    checkInternet=()=>{
      NetInfo.fetch().then(state => {
        console.log("Connection type", state.isConnected);
        this.setState({connected:state.isConnected});
      });
    }
    updateProgress (oEvent) {
      if (oEvent.lengthComputable) {
        var progress = oEvent.loaded / oEvent.total;
        this.setState({progress})
      } else {
        // Unable to compute progress information since the total size is unknown
      }
    }
    onAnimate = () =>{  
      // this.anim.addListener(({value})=> {  
      //     this.setState({progressStatus: parseInt(value,10)});  
      //     if(this.state.progressStatus==100) this.setState({islogin:true})
      // });  
      Animated.timing(this.anim,{  
           toValue: 100,  
           duration: 5000,  
           useNativeDriver: true 
      }).start();  
  }  
  storeDatainDB=(data,count,time)=>{
  firebase.database().ref('CustomerMaster/').set({data,Totalcount:count,Time:time}).then((data)=>{
    console.log('data',data,count) 
    this.dataFetchStockItem();
}).catch((err)=>{
    console.log('error',err);
})
  }
  stockDatainDB=(data,count,time)=>{
    firebase.database().ref('StockMaster/').set({data,Totalcount:count,Time:time}).then((data)=>{
      console.log('data',data,count);
     
  }).catch((err)=>{
      console.log('error',err);
  })
    }
  dataFetchStockItem=()=>{
    console.log('next api called')
    this.setState({progressStatus: parseInt(30),syncingText:'We are all most there...Please wait',callingName:'Syncing Customer Master Data'}); 
    var EditProfileUrl = `${BASE_URL}/dms-demo/FetchLoginEntityMasterData?logintoken=${this.state.token}&sourcetype=AndroidSalesPersonApp&startIndex=0&packetSize=500&selEntityId=${this.state.orgId}&selEntityType=superstockist&reportDataSource=FetchEntityCustomersDetail`
    console.log('Add product Urlsss:' + EditProfileUrl)
    fetch(EditProfileUrl,  {
      method: 'Post',
      headers:{
        'Content-Type': 'application/json', 
      },
    })
      .then(response => response.json())
      .then(responseData => {
        if (responseData !== 'Error - Invalid username / password') {
          this.setState({progressStatus: parseInt(80)}); 
          db.insertDataCustomer(responseData.customerDetails.data).then(succ=>{
            db.insertDataTimeCustomer(responseData.customerDetails.totalCount,responseData.customerDetails.serviceTimeMilliSec).then(success=>{
              this.setState({progressStatus: parseInt(100)}); 
              if(this.state.progressStatus==100) this.setState({islogin:true,})
            });
          });
        } else {
         alert(responseData);
        }
        // console.log('contact list response object:', JSON.stringify(responseData))
      })
      .catch(error => {
        this.checkInternet();
         this.hideLoading();
        console.error('error coming',error)
      })
      .done()
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
    dataFetchSecondCall=(packet)=>{
      this.setState({progressStatus: parseInt(50),syncingText:'Please wait this process may take several minutes'}); 
      console.log('second packet',packet)
      var EditProfileUrl = `${BASE_URL}/dms-demo/FetchLoginEntityMasterData?logintoken=${this.state.token}&sourcetype=AndroidSalesPersonApp&startIndex=0&packetSize=${packet}&selEntityId=${this.state.orgId}&selEntityType=superstockist&reportDataSource=FetchEntityStockItems`
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
            this.setState({progressStatus: parseInt(70)}); 
             db.insertDataStock(responseData.stockItems.data).then((data)=>{
              this.setState({progressStatus: parseInt(80),syncingText:`Seems like it's taking more than usual time...Please wait`},()=>{
                db.insertDataTimeStock(responseData.stockItems.totalCount,responseData.stockItems.serviceTimeMilliSec).then(succ=>{
                  this.setState({progressStatus:parseInt(100)});
                  this.dataFetchStockItem();
                });
              });
             });
          } else {
           console.log(responseData);
          }
        })
        .catch(error => {
           this.hideLoading();
           this.checkInternet();
          console.error('error coming',error)
        })
        .done()
  }
  dataFetch=()=>{
    this.setState({progressStatus: parseInt(0),callingName:'Syncing Item Master Data'});  
      var EditProfileUrl = `${BASE_URL}/dms-demo/FetchLoginEntityMasterData?logintoken=${this.state.token}&sourcetype=AndroidSalesPersonApp&startIndex=0&packetSize=500&selEntityId=${this.state.orgId}&selEntityType=superstockist&reportDataSource=FetchEntityStockItems`
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
            console.log('second called');
            this.setState({progressStatus: parseInt(30)}); 
           this.dataFetchSecondCall(responseData.stockItems.totalCount);
            console.log('value',responseData.stockItems.totalCount);
          } else {
           console.log(responseData);
          }
        })
        .catch(error => {
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
  render(){
    if(!this.state.connected){
      return(<OfflineUserScreen onTry={this.checkInternet} />)
         }
    return(
     <View style={styles.container} >
   <Spinner
          visible={this.state.spinner}
          color='#1976D2'
        />
        <View style={styles.headerView}>
          <View style={styles.BackButtonContainer}>
          {this.state.islogin?<Icon name="menu" size={25} color={"#fff"} onPress={()=>{this.props.navigation.toggleDrawer()}} />:null}
          </View>
          <View style={styles.TitleContainer}>
            <View
              style={{alignItems: 'center', justifyContent: 'center'}}>
              <Text style={styles.TitleStyle}>{this.state.tenantName}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.SearchContainer}
            onPress={() => {
              this.logout();
              // this.props.navigation.navigate('Login')
            }}>
             {this.state.islogin?<Text style={styles.backButtonStyle}>Log Out</Text>:null}
          </TouchableOpacity>
        </View>
         {this.state.islogin?<Chart navigation={this.props.navigation} item={'Dashboard'} />: <View style={{flex:1}}>
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
      </View> }
      
         </View>
        
    )
  }
}
const styles = StyleSheet.create({
    container:{
        flex:1,
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
    loading: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    SearchContainer: {
      flex: 0.2,
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
      flex: 0.1,
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

export default DashBoardScreen;