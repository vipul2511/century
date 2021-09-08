import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StatusBar,
  TextInput
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { hp, wp } from '../utils/heightWidthRatio';
import Icon from 'react-native-vector-icons/Ionicons'
import BackgroundFetch from "react-native-background-fetch";
import Feather from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase from '../utils/firebase';
import Toast from 'react-native-simple-toast';
import BackgroundTimer from 'react-native-background-timer';
import resp from 'rn-responsive-font';
import {BASE_URL} from '../utils/BaseUrl';
import Database from '../utils/Database';
const db = new Database();
class Favourite extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      tableData: [],
      showDate: false,
      newTime: '',
      password: '',
      emailID: '',
      time: '',
      Apicallingdate:'',
      timemill:'',
      date:new Date(),
      orgId:'',
      token:''
    };
  }
  renderItem = ({ item, index }) => {
    console.log(item);
    return (
      <View key={index}>
        <TouchableOpacity style={{ flexDirection: 'row', height: 'auto', justifyContent: 'center', alignItems: 'center' }} >
          <View style={{ width: wp(150), alignSelf: 'center', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
            <Text style={{ fontSize: 15, marginLeft: 15, flexWrap: 'wrap', marginBottom: 10, textAlign: 'left', }}>{item.name}</Text>
          </View>
          {/* <View style={{borderWidth:1,borderColor:'red'}}></View> */}
          <View style={{ width: wp(100), alignSelf: 'center', }}>
            <Text style={{ fontSize: 15, marginBottom: 10, textAlign: 'left' }}>{item.orggroup}</Text>
          </View>
          <View style={{ width: wp(120), alignSelf: 'flex-end', marginRight: wp(10) }}>
            <Text style={{ fontSize: 15, marginBottom: 10, textAlign: 'right', marginRight: wp(10) }}>{item.type}</Text>
          </View>
        </TouchableOpacity>
        <View style={{ borderWidth: 0.5, backgroundColor: 'black' }}></View>
      </View>
    );
  }
  ListHeader = () => {
    //View to set in Header
    return (
      <View style={{ marginBottom: 5, marginLeft: 5, marginTop: 15, zIndex: 2, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ width: wp(150), alignSelf: 'center' }} >
            <Text style={{ fontWeight: 'bold', }}>Customer Name</Text>
          </View>
          <View style={{ width: wp(90), alignSelf: 'center' }} >
            <Text style={{ fontWeight: 'bold', }}> Group</Text>
          </View>
          <View style={{ flex: wp(120), alignSelf: 'flex-end' }}>
            <Text style={{ fontWeight: 'bold', }}>Customer Type</Text></View>

        </View>
      </View>
    );
  };
  nodata = () => {
    return (<View style={{ justifyContent: 'center', alignItems: 'center', marginTop: hp(45) }}>
      {this.state.Nodata ? <Text>No  Data found</Text> : null}
    </View>
    )
  }
  
  componentDidMount() {
    // Initialize BackgroundFetch ONLY ONCE when component mounts.
    let time;
    AsyncStorage.getItem('@orgid').then(id => {
      if (id) {
        this.setState({ orgId: id });
      }
    })
    AsyncStorage.getItem('@loginToken').then(succ => {
      if (succ) {
        this.setState({ token: succ });

      }
    })
    AsyncStorage.getItem('email_id').then(succ => {
      if (succ) {
        this.setState({ emailID: succ });
      }
    })
    AsyncStorage.getItem('@time').then(succ => {
      if (succ) {
        let time = JSON.parse(succ);
        var d = new Date(time).getTime();
        var now = new Date().getTime();
        if (now > d) {
          var s = new Date(time).toLocaleTimeString();
          this.setState({ Apicallingdate: s });
          console.log('greater');
        }
      }
    })
    AsyncStorage.getItem('password').then(succ => {
      if (succ) {
        this.setState({ password: succ });
        // this.initBackgroundFetch()
      }
    });
  }
  background=()=>{
    let time=this.state.timemill;
    var d = new Date(time).getTime();
    var now = new Date().getTime();
    var seconds = (d - now);
    console.log(seconds.toFixed(0));
    const timeoutId = BackgroundTimer.setTimeout(() => {
      this.login();
  }, seconds);
  }
  stockDatainDB = (data, count, time, token, orgid) => {
    firebase.database().ref('StockMaster/').set({ data, Totalcount: count, Time: time }).then((data) => {
      console.log('data', data);
      this.dataFetch(token, orgid)
    }).catch((err) => {
      console.log('error', err);
    })
  }
  storeDatainDB = (data, count, time) => {
    firebase.database().ref('CustomerMaster/').set({ data, Totalcount: count, Time: time }).then((data) => {
      console.log('data', data);
    }).catch((err) => {
      console.log('error', err);
    })
  }
  dataFetchSecondCall=(packet)=>{
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
           db.insertDataStock(responseData.stockItems.data).then((data)=>{
              db.insertDataTimeStock(responseData.stockItems.totalCount,responseData.stockItems.serviceTimeMilliSec).then(succ=>{
                this.dataFetchStockItem();
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
  dataFetch=()=>{  
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
           this.dataFetchSecondCall(responseData.stockItems.totalCount);
          } else {
           console.log(responseData);
          }
        })
        .catch(error => {
          console.error('error coming',error)
        })
        .done()
  }
  dataFetchStockItem=()=>{
    console.log('next api called')
    this.setState({progressStatus: parseInt(70)}); 
    var EditProfileUrl = `${BASE_URL}/dms-demo/FetchLoginEntityMasterData?logintoken=${this.state.token}&sourcetype=AndroidSalesPersonApp&startIndex=0&packetSize=500&selEntityId=${this.state.orgId}&selEntityType=superstockist&reportDataSource=FetchEntityCustomersDetail`
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
        //  this.hideLoading();
        console.error('error coming',error)
      })
      .done()
}
  login = () => {
    var EditProfileUrl = `${BASE_URL}/dms-demo/Login?user_txt=${this.state.emailID}&pwd_txt=${this.state.password}&sourcetype=AndroidSalesPersonApp&timeoffset=330`
    console.log('Add product Url:' + EditProfileUrl)
    fetch(EditProfileUrl, {
      method: 'Post',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Zoho-oauthtoken 1000.848a86e35b52ef204f8eed9536f088ca.f6cdf0c2044f124f5ae538499ad58385'
      },
    })
      .then(response => response.json())
      .then(responseData => {
        if (responseData !== 'Error - Invalid username / password') {
          this.setState({token:responseData.logintoken,orgId:responseData.orgid},()=>{
            this.dataFetch(responseData.logintoken, responseData.orgid);
          });
          // console.log(JSON.stringify(responseData))
        } else {
          console.log(responseData);
        }
        // console.log('contact list response object:', JSON.stringify(responseData))
      })
      .catch(error => {
        console.error('error coming', error)
      })
      .done()
  }


  onFocus = () => {
    console.log('inserder');
    this.setState({ showDate: true })
  }
  onChange = (event, selectedDate) => {
    const currentDate = selectedDate || this.state.date;
    var s = new Date(currentDate).toLocaleTimeString();
    console.log('cureent date',currentDate,'s',s);
    AsyncStorage.setItem('@time', JSON.stringify(currentDate)).then(succ => {
    this.setState({ newTime: s, showDate: false,timemill:currentDate },()=>{
              this.background();
            });
          });
  };
  render() {
    return (
      <>
        {/* <StatusBar barStyle="dark-content" /> */}
        <SafeAreaView style={styles.scrollView}>
          <View style={styles.headerView}>
            <View style={styles.BackButtonContainer}>

              <Icon name="arrow-back" size={25} color={"#fff"} onPress={() => { this.props.navigation.goBack() }} />

            </View>
            <View style={styles.TitleContainer}>
              <View
              >
                <Text style={styles.TitleStyle}>i9 Sales Force</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.SearchContainer}
              onPress={() => { this.props.navigation.navigate('DashBoardScreen') }}
            >
              <Icon name="home" size={25} color={"#fff"} onPress={() => { this.props.navigation.navigate('DashBoardScreen') }} />
            </TouchableOpacity>
          </View>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ flexDirection: 'row' }}>
              <Feather name="clock" size={25} color="#1976D2" style={{ marginTop: 12, padding: 10 }} />
              <TouchableOpacity onPress={() => { this.setState({ showDate: true }) }} style={{ width: 250, height: 40 }}>
                <TextInput
                  style={styles.timeInput}
                  placeholder="Select the time "
                  value={this.state.newTime}
                  editable={false}
                ></TextInput>
              </TouchableOpacity>
            </View>
            {this.state.showDate ?<DateTimePicker
              style={{ width: 250, marginTop: 18, marginRight: 25, }}
              testID="dateTimePicker"
          value={this.state.date}
          mode={"time"}
          is24Hour={true}
          display="default"
              customStyles={
                {
                  dateInput: {
                    marginLeft: 36
                  }
                }
              }
              onChange={this.onChange}
              // onChange={(date) => {
              //   let dateTime = date.nativeEvent.timestamp;
              //   var s = new Date(dateTime).toLocaleTimeString();
              //   console.log('date time',dateTime,'s',s);
              //   AsyncStorage.setItem('@time', JSON.stringify(dateTime)).then(succ => {
              //       this.setState({ newTime: s, showDate: false, timemill:dateTime},()=>{
              //         this.background();
              //       });
              //     });
              //     // console.log('the time',s,'date time',time);
              // }}
            /> : null}
            {this.state.Apicallingdate?<View style={{justifyContent:'center',alignItems:'center'}}>
              <Text style={{fontSize:19,fontWeight:'bold'}}>{this.state.Apicallingdate}</Text>
            </View>:null}
          </View>

        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  timeInput: {
    color: '#21AAF9',
    padding: 4,
    marginTop: 12,
    borderColor: 'rgb(219,219,219)',
    textAlign: 'center',
    borderWidth: 2,
    width: 250,
    height: 40,
    fontSize: 17,
    backgroundColor: '#F1F3F4',

  },
  SearchContainer: {
    marginLeft: 15,
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
    color: '#fff'
  },
  headerView: {
    height: 65,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1976D2',
    elevation: 2,
  },
  BackButtonContainer: {

    marginRight: 10,
    backgroundColor: '#1976D2',
  },
  TitleContainer: {
    flexDirection: 'row',
    flex: 0.8,
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

export default Favourite;
