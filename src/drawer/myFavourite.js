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
import Toast from 'react-native-simple-toast';
import resp from 'rn-responsive-font';
class Favourite extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      tableData: [],
      showDate:false,      
      newTime:'',  
    };
  }
  renderItem = ({ item,index }) =>{
    console.log(item);
    return (
    <View key={index}>
     <TouchableOpacity style={{flexDirection:'row',height:'auto',justifyContent:'center',alignItems:'center'}} >
     <View style={{width:wp(150),alignSelf:'center',flexDirection:'row',justifyContent:'flex-start',alignItems:'flex-start'}}>
     <Text style={{fontSize:15,marginLeft:15,flexWrap:'wrap',marginBottom:10,textAlign:'left',}}>{item.name}</Text>
     </View>
     {/* <View style={{borderWidth:1,borderColor:'red'}}></View> */}
     <View style={{width:wp(100),alignSelf:'center',}}>
     <Text style={{fontSize:15,marginBottom:10,textAlign:'left'}}>{item.orggroup}</Text>
     </View>
     <View style={{width:wp(120),alignSelf:'flex-end',marginRight:wp(10)}}>
     <Text style={{fontSize:15,marginBottom:10,textAlign:'right',marginRight:wp(10)}}>{item.type}</Text>
     </View>
     {/* <View style={{width:wp(120),alignSelf:'flex-end',marginRight:wp(10)}}>
     <Text style={{fontSize:15,marginBottom:10,textAlign:'right',marginRight:wp(10)}}>{item.linvdt}</Text>
     </View> */}
     {/* <Text style={{fontSize:13,marginLeft:20}}>{item.contact}</Text> */}
     {/* <Text style={{fontSize:13,marginLeft:20,}}>{item.city}</Text> */}
    
     </TouchableOpacity>
     <View style={{borderWidth:0.5,backgroundColor:'black'}}></View>
    </View>
  );
    }
  ListHeader = () => {
    //View to set in Header
    return (
        <View style={{marginBottom:5,marginLeft:5,marginTop:15,zIndex:2,backgroundColor:'#fff',justifyContent:'center',alignItems:'center'}}>
        <View style={{flexDirection:'row'}}>
        <View style={{ width:wp(150), alignSelf: 'center' }} >
        <Text style={{fontWeight:'bold',}}>Customer Name</Text>
        </View>
        <View style={{  width:wp(90), alignSelf: 'center' }} >
        <Text style={{fontWeight:'bold',}}> Group</Text>
        </View>
        <View style={{flex:wp(120),alignSelf:'flex-end'}}>
                 <Text style={{fontWeight:'bold',}}>Customer Type</Text></View>
                
        </View>
    </View>
    );
  };
  nodata=()=>{
    return(<View style={{justifyContent:'center',alignItems:'center',marginTop:hp(45)}}>
        {this.state.Nodata?  <Text>No  Data found</Text>:null}
     </View>
    )
 }
  componentDidMount() {
    // Initialize BackgroundFetch ONLY ONCE when component mounts.
    this.initBackgroundFetch();
    AsyncStorage.getItem('@orgid').then(id=>{
      if(id){
       this.setState({orgId:id});
      }
    })
     AsyncStorage.getItem('@loginToken').then(succ=>{
       if(succ){
      this.setState({token:succ});
     
       }
     })
  }
  dataFetchStockItem=()=>{
    var EditProfileUrl = `http://demo.3ptec.com/dms-demo/FetchLoginEntityMasterData?logintoken=${this.state.token}&sourcetype=AndroidSalesPersonApp&startIndex=0&packetSize=100&selEntityId=${this.state.orgId}&selEntityType=superstockist&reportDataSource=FetchEntityCustomersDetail`
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
       console.log(JSON.stringify(responseData));
      //  this.setState({tableData:responseData.customerDetails.data});
       
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

  async initBackgroundFetch() {
    // BackgroundFetch event handler.
    const onEvent = async (taskId) => {
      console.log('[BackgroundFetch] task: ', taskId);
      // Do your background work...
      await this.addEvent(taskId);
      // IMPORTANT:  You must signal to the OS that your task is complete.
      BackgroundFetch.finish(taskId);
    }

    // Timeout callback is executed when your Task has exceeded its allowed running-time.
    // You must stop what you're doing immediately BackgorundFetch.finish(taskId)
    const onTimeout = async (taskId) => {
      console.warn('[BackgroundFetch] TIMEOUT task: ', taskId);
      BackgroundFetch.finish(taskId);
    }

    // Initialize BackgroundFetch only once when component mounts.
    let status = await BackgroundFetch.configure({minimumFetchInterval: 15}, onEvent, onTimeout);

    console.log('[BackgroundFetch] configure status: ', status);
  }

  // Add a BackgroundFetch event to <FlatList>
  addEvent(taskId) {
    this.dataFetchStockItem();
    // Simulate a possibly long-running asynchronous task with a Promise.
    // Toast.show('the background task working', Toast.LONG);
   console.log('the background task working')
  }
  onFocus=()=>{
    console.log('inserder');
    this.setState({showDate:true})
  }

  render() {
    return (
      <>
        {/* <StatusBar barStyle="dark-content" /> */}
        <SafeAreaView style={styles.scrollView}>
        <View style={styles.headerView}>
          <View style={styles.BackButtonContainer}>
           
              <Icon name="arrow-back" size={25} color={"#fff"} onPress={()=>{this.props.navigation.goBack()}} />
           
          </View>
          <View style={styles.TitleContainer}>
            <View
              >
              <Text style={styles.TitleStyle}>i9 Sales Force</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.SearchContainer}
            onPress={()=>{this.props.navigation.navigate('DashBoardScreen')}}
            >
               <Icon name="home"  size={25} color={"#fff"} onPress={()=>{this.props.navigation.navigate('DashBoardScreen')}} />
          </TouchableOpacity>
        </View>
          <View style={{justifyContent:'center',alignItems:'center'}}>
            <View style={{flexDirection:'row'}}>
              <Feather name="clock" size={25} color="#1976D2"   style={{marginTop:12,padding:10}}    />
         <TouchableOpacity onPress={()=>{this.setState({showDate:true})}} style={{width: 250,height: 40}}>
          <TextInput  
              style={styles.timeInput}
              placeholder="Select the time "
              value={this.state.newTime}
              editable={false}
            ></TextInput>
            </TouchableOpacity>
            </View>
        {this.state.showDate?<DateTimePicker

              style={{ width: 250, marginTop: 18, marginRight: 25, }}
              timeZoneOffsetInMinutes={0}
              value={new Date()}
              mode="time"
              testID="dateTimePicker"
               is24Hour={true}
              display="default"
              
             
              customStyles={
                {
                  dateInput: {
                    marginLeft: 36
                  }
                }
              }
              onChange={(date) => { 
                let dateTime=date.nativeEvent.timestamp;
                var s = new Date(dateTime).toLocaleTimeString();
                console.log('the time',s);
                this.setState({ newTime: s,showDate:false }) }}
            />:null}
            </View>
     {/* <FlatList
         keyExtractor={(item, index) => index.toString()} 
         data={this.state.tableData}
         initialNumToRender={20}
         maxToRenderPerBatch={20}
         ListHeaderComponent={this.ListHeader}
         ListEmptyComponent={this.nodata}
        //  onEndReachedThreshold={0.1}
        //  onMomentumScrollBegin = {() => {this.onEndReached = false;}}
         numColumns={1}
         renderItem={this.renderItem}
        
          /> */}
          {/* <View style={styles.sectionContainer}>
            <FlatList
              data={this.state.events}
              renderItem={({item}) => (<Text>[{item.taskId}]: {item.timestamp}</Text>)}
              keyExtractor={item => item.timestamp}
            />
          </View> */}
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    flex:1,
    backgroundColor: '#fff',
  },
  timeInput:{
    color: '#21AAF9',
    padding: 4,
    marginTop: 12,
    borderColor: 'rgb(219,219,219)',
    textAlign:'center',
    borderWidth: 2,
    width: 250,
    height: 40,
    fontSize: 17,
    backgroundColor: '#F1F3F4',
    
  },
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
     flex:0.8,
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
