
import React,{Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Image,
  BackHandler
} from 'react-native';
import resp from 'rn-responsive-font'
import Icon from 'react-native-vector-icons/Ionicons';
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase from '../../utils/firebase';
import { wp, hp } from '../../utils/heightWidthRatio';
import {BASE_URL} from '../../utils/BaseUrl';
import Database from '../../utils/Database';
import NetInfo from "@react-native-community/netinfo";
import OfflineUserScreen from '../../utils/OfflineScreen';
const db = new Database();
export default class Login extends Component{
    constructor(props){
        super(props);
        this.state={
          loading:'',
          emailID:'',
          password:'',
          showText:true,
          spinner:false,
          user_id:'',
          connected:true
        }
    }
    componentDidMount(){
      this.checkInternet();
      firebase.database().ref('user_id').on('value',(snap) =>{
        this.setState({user_id:snap.val()});
      });
     console.log('the props are working',this.props);
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton)
            AsyncStorage.removeItem('@loginToken').then(succ=>{
              AsyncStorage.removeItem('@is_login').then(succ=>{
                AsyncStorage.removeItem('@tenantName').then(succ=>{
              AsyncStorage.removeItem('@username').then(succ=>{
              console.log('all clear'); 
              })
            });
          });
      });
 }
 clearDatabase=()=>{
  firebase.database().ref('CustomerMaster').remove().then(succ=>{
    firebase.database().ref('StockMaster').remove().then(succ=>{
      console.log('database cleared');
    });
  });
 }
 validate = (text) => {
  console.log(text);
  let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (reg.test(text) === false) {
    alert('Please Enter validate Email');
    //console.log("Email is Not Correct");
    this.setState({ emailID: text })
    return false;
  }
  else {
    // this.setState({ email: text })
    this.loginAPI()
    console.log("Email is Correct");
  }
}
 CheckTextInput = () => {
   Keyboard.dismiss();
    if (this.state.emailID === '') {
      //Check for the Name TextInput
      alert('Please Enter Email ID ');
    }
    else if (this.state.password === '') {
      alert('Please Enter Password');
    }
    else {
      this.validate(this.state.emailID)
        // this.props.navigation.navigate('DashBoardScreen')
    }
  };
  LoginOrNot = async () => {
    await AsyncStorage.setItem('@is_login', "1");
  }
  loginAPI=()=>{
    AsyncStorage.setItem('email_id',this.state.emailID).then(succ=>{
      AsyncStorage.setItem('password',this.state.password).then(succ=>{
    var EditProfileUrl = `${BASE_URL}/dms-demo/Login?user_txt=${this.state.emailID}&pwd_txt=${this.state.password}&sourcetype=AndroidSalesPersonApp&timeoffset=330`
    console.log('Add product Url:' + EditProfileUrl)
    fetch(EditProfileUrl,  {
      method: 'Post',
      headers:{
        'Content-Type': 'application/json',
        'Authorization':'Zoho-oauthtoken 1000.848a86e35b52ef204f8eed9536f088ca.f6cdf0c2044f124f5ae538499ad58385'
      },
    })
      .then(response => response.json())
      .then(responseData => {
        if (responseData !== 'Error - Invalid username / password') {
          this.LoginOrNot();
          console.log('login',JSON.stringify(responseData));
          let itemName='different name';
          let username=responseData.fname+responseData.lname;
          if(responseData.loginid!==this.state.user_id){
            itemName='from login';
          // db.deleteCustomerTable().then(succ=>{
          //   db.deleteCustomerTimeTable().then(succ=>{
          //     db.deleteStockTimeTable().then(succ=>{
          //       db.deleteStockTable().then(succ=>{
                  AsyncStorage.setItem('@loginToken',responseData.logintoken).then(succ=>{
                    AsyncStorage.setItem('@username',username).then(succ=>{
                      AsyncStorage.setItem('@orgid',responseData.orgid).then(succ=>{
                        AsyncStorage.setItem('@zone_id',responseData.zoneid).then(succ=>{
                          firebase.database().ref('user_id/').set(responseData.loginid).then(succ=>{
                        AsyncStorage.setItem('@tenantName',responseData.tenantName).then(succ=>{
                          AsyncStorage.setItem('@type',responseData.type).then(succ=>{
                            AsyncStorage.setItem('@user_id',JSON.stringify(responseData)).then(succ=>{
                             this.setState({emailID:'',password:'',showText:true,});
         
                             this.props.navigation.navigate('Root',{ screen: 'DashBoardScreen',params: { data: itemName }});
                            });
                          });
                        });
                       });
                //       });
                //     });
                //   });
                //  });
                })
              })
            })
          })
          }else{
            AsyncStorage.setItem('@loginToken',responseData.logintoken).then(succ=>{
              AsyncStorage.setItem('@username',username).then(succ=>{
                AsyncStorage.setItem('@orgid',responseData.orgid).then(succ=>{
                  AsyncStorage.setItem('@zone_id',responseData.zoneid).then(succ=>{
                    firebase.database().ref('user_id/').set(responseData.loginid).then(succ=>{
                  AsyncStorage.setItem('@tenantName',responseData.tenantName).then(succ=>{
                    AsyncStorage.setItem('@type',responseData.type).then(succ=>{
                      AsyncStorage.setItem('@user_id',JSON.stringify(responseData)).then(succ=>{
                       this.setState({emailID:'',password:'',showText:true,});
   
                       this.props.navigation.navigate('Root',{ screen: 'DashBoardScreen',params: { data: itemName }});
                      });
                    });
                  });
                 });
                });
              });
            });
           });
          }
          // console.log(JSON.stringify(responseData))
        } else {
         alert(responseData);
        }
        // console.log('contact list response object:', JSON.stringify(responseData))
      }).catch(err=>{
        this.checkInternet()
        console.log(err);
     })
      .done()
    });
  });
  }
 handleBackButton=()=>{
  if (this.props.navigation.isFocused()) {
    BackHandler.exitApp()
    console.log('if excute')
    return true
  } 
}
checkInternet=()=>{
  NetInfo.fetch().then(state => {
    console.log("Connection type", state.isConnected);
    this.setState({connected:state.isConnected});
  });
}
 componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }
  render(){
   if(!this.state.connected){
return(<OfflineUserScreen onTry={this.checkInternet} />)
   }
    return(
     <View style={styles.container}>
        <Spinner
          visible={this.state.spinner}
          color='#1976D2'
        />
       <ScrollView keyboardShouldPersistTaps={'handled'}>
          <View style={styles.container2}>
            <Image
             source={require('../../assets/image/logo.jpeg')}
              style={styles.ImageView}
            />
            <Text style={styles.CartTextStyle}>i9 Sales Force</Text>
            <View style={styles.box}></View>
            <View style={{alignSelf:'flex-start'}}>
            <Text style={styles.UserName}>Email ID</Text>
            </View>
            <View style={styles.inputView}>
              <View style={{ flexDirection: 'row', marginLeft:15 }}></View>

              <TextInput
                placeholder=''
                placeholderTextColor='#000'
                underlineColorAndroid='#1976D2'
                autoCapitalize={'none'}
                keyboardType={'email-address'}
                style={styles.input}
                value={this.state.emailID}
                // maxLength={10}
                onChangeText={phone_number => this.setState({emailID:phone_number })}
              />
            </View>
            <View style={{alignSelf:'flex-start'}}>
            <Text style={styles.UserName}>Password</Text>
            </View>
            <View style={styles.inputView}>
              <View style={{ flexDirection: 'row', marginLeft: 10 }}></View>

              <TextInput
                placeholder=''
                placeholderTextColor='#000'
                underlineColorAndroid='#1976D2'
                style={styles.input}
                autoCapitalize={'none'}
                value={this.state.password}
                secureTextEntry={this.state.showText}
                onChangeText={password => this.setState({ password })}
              />
              <Icon  name={this.state.showText==true?"eye":"eye-off"} color={"#1976D2"} size={25}  style={{alignSelf:'flex-end',position:'absolute'}} onPress={()=>{this.setState({showText:!this.state.showText})}} />
            </View>
            <TouchableOpacity  >
              <Text
               style={styles.forgetButton}
                onPress={() => {
                  this.props.navigation.navigate('ForgotPassword')
                }}>
                Forgot Password ?
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.loginButtonStyle}
              activeOpacity={0.2}
              onPress={() => {
               this.CheckTextInput()
              //  this.props.navigation.navigate('Root')
              }}>
              <Text style={styles.buttonWhiteTextStyle}>Login</Text>
            </TouchableOpacity>
            
          </View>
          </ScrollView>
     </View>
    )
  }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: '#fff',
      },
    
      container2: {
        height: 780,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
      },
      loading: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        opacity: 0.5,
        justifyContent: 'center',
        alignItems: 'center',
      },
    
      box: {
        marginTop: 60,
        height: resp(40),
        width: resp(40),
      },
      CartTextStyle: {
        marginTop: resp(0),
        fontSize: resp(30),
        color: '#000',
        fontWeight: 'bold',
      },
      buttonWhiteTextStyle: {
        textAlign: 'center',
        fontSize: resp(16),
        color: 'white',
        alignContent: 'center',
      },
      ImageView: {
        height: resp(100),
        width: resp(120),
        backgroundColor: 'white',
      },
      horizontal: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: resp(80),
      },
      OrText: {
        fontFamily: 'AvenirNext-Bold',
        color: 'red',
        fontSize: 14,
        paddingHorizontal: 5,
        alignSelf: 'center',
      },
      hairline: {
        backgroundColor: '#A2A2A2',
        height: 1,
        width: 165,
      },
      UserName: {
        color: 'gray',
        fontSize: resp(12),
        textAlign: 'left',
        marginLeft:'8%'
      },
      forgetButton: {
        color: 'black',
        width: resp(380),
        height: resp(50),
        marginRight:resp(20),
        textAlign: 'right',
      },
      SignUPText: {
        color: 'red',
        marginTop: 10,
        position: 'absolute', //Here is the trick
        bottom: 30,
      },
      color: {
        color: 'red',
      },
      account: {
        color: 'gray',
        marginTop: 10,
        position: 'absolute', //Here is the trick
        bottom: 10,
      },
      input: {
        color: 'black',
        width: 350,
        height: 50,
        padding: 10,
        textAlign: 'left',
      },
    
      inputView: {
        // width: '90%',
        // marginBottom: 15,
        // alignSelf: 'center',
        // borderColor: '#1976D2',
        // borderBottomWidth: 1,
      },
      loginButtonStyle: {
        marginTop: 10,
        width: resp(350),
        height: resp(50),
        padding: 10,
        backgroundColor: '#1976D2',
        borderRadius: 40,
        justifyContent: 'center',
        alignSelf: 'center',
        alignItems: 'center',
      },
});


