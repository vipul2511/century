import React,{Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
  Animated,
  SafeAreaViewBase,
  BackHandler,
  Alert
} from 'react-native';
import { CommonActions } from '@react-navigation/native';
import resp from 'rn-responsive-font';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Chart from '../scenes/Chart';
import firebase from '../utils/firebase';
import Spinner from 'react-native-loading-spinner-overlay';
import Icon from 'react-native-vector-icons/Ionicons'
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
           type:''
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
    componentDidMount(){
      BackHandler.addEventListener('hardwareBackPressed',this.backItems);
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
        //  this.dataFetching()
         }
       });
       if(this.props.route.params){
         if(this.props.route.params.data=="from login"){
          this.setState({islogin:false});
          this.onAnimate(); 
          this.dataFetch();
          this.dataFetchStockItem();
          
         }
       }
       console.log('props values dasg',JSON.stringify(this.props))
      
    }
    onAnimate = () =>{  
      this.anim.addListener(({value})=> {  
          this.setState({progressStatus: parseInt(value,10)});  
          if(this.state.progressStatus==100) this.setState({islogin:true})
      });  
      Animated.timing(this.anim,{  
           toValue: 100,  
           duration: 5000,  
           useNativeDriver: true 
      }).start();  
  }  
  storeDatainDB=(data,count,time)=>{
  firebase.database().ref('CustomerMaster/').set({data,Totalcount:count,Time:time}).then((data)=>{
    console.log('data',data,count)
}).catch((err)=>{
    console.log('error',err);
})
  }
  stockDatainDB=(data,count,time)=>{
    firebase.database().ref('StockMaster/').set({data,Totalcount:count,Time:time}).then((data)=>{
      console.log('data',data,count)
  }).catch((err)=>{
      console.log('error',err);
  })
    }
  dataFetchStockItem=()=>{
    var EditProfileUrl = `http://demo.3ptec.com/dms-demo/FetchLoginEntityMasterData?logintoken=${this.state.token}&sourcetype=AndroidSalesPersonApp&startIndex=0&packetSize=500&selEntityId=${this.state.orgId}&selEntityType=superstockist&reportDataSource=FetchEntityCustomersDetail`
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
createTwoButtonAlert = () =>
    Alert.alert(
      "Invalid Session",
      "Your Session is expired Please login again",
      [
        
        { text: "OK", onPress: () => {this.logout()} }
      ],
      { cancelable: false }
    );

  dataFetch=()=>{
      var EditProfileUrl = `http://demo.3ptec.com/dms-demo/FetchLoginEntityMasterData?logintoken=${this.state.token}&sourcetype=AndroidSalesPersonApp&startIndex=0&packetSize=500&selEntityId=${this.state.orgId}&selEntityType=superstockist&reportDataSource=FetchEntityStockItems`
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
            this.storeDatainDB(responseData.stockItems.data,responseData.stockItems.totalCount,responseData.stockItems.serviceTimeMilliSec);
            // console.log(JSON.stringify(responseData.stockItems.data));
            console.log('value',responseData.stockItems.totalCount);
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
  logout=()=>{
            this.props.navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Login'}],
              }),
            ) 

  }
  render(){
    return(
     
     <View style={styles.container} >
   <Spinner
          visible={this.state.spinner}
          color='#1976D2'
        />
        <View style={styles.headerView}>
          <View style={styles.BackButtonContainer}>
           
              <Icon name="menu" size={25} color={"#fff"} onPress={()=>{this.props.navigation.toggleDrawer()}} />
           
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
         {this.state.islogin?  <Chart navigation={this.props.navigation} item={'Dashboard'} />: <View>
      <View style={styles.containerAnimation}>  
            <Animated.View  
                style={[  
                    styles.inner,{width: this.state.progressStatus +"%"},  
                ]}  
            />   
      </View>  
      <Animated.Text style={styles.label}>  
                  Syncing Please wait....  {this.state.progressStatus }%  
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
      marginTop: 200,  
      justifyContent: "center",  
    },  
    inner:{  
      width: "100%",  
      height: 30,  
      borderRadius: 5,  
      backgroundColor:"#1976D2",  
    },  
    label:{  
      fontSize:23,  
      color: "black",  
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
