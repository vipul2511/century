import React, { Component } from 'react';
import {TextInput,View,TouchableOpacity,Text,ScrollView,StyleSheet,Alert,FlatList, Dimensions,BackHandler,ActivityIndicator,processColor} from 'react-native';
import firebase from '../utils/firebase';
import { Table, Row, Rows } from 'react-native-table-component';
import resp from 'rn-responsive-font';
import Icon from 'react-native-vector-icons/Ionicons'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { wp, hp } from '../utils/heightWidthRatio';
import { CommonActions } from '@react-navigation/native';
import {PieChart} from 'react-native-charts-wrapper';
import Spinner from 'react-native-loading-spinner-overlay';
import {BASE_URL} from '../utils/BaseUrl';
import NetInfo from "@react-native-community/netinfo";
import OfflineUserScreen from '../utils/OfflineScreen';
let width=Dimensions.get('window').width;
export default class OpenPurchase extends Component{
    constructor(props){
        super(props);
        this.state={
            text:"",
            ReportData:[],
            spinner:false,
            dataLoaded:false,
            connected:true,
            NoData:false,
            tableHead: ['Head', 'Head2', 'Head3', 'Head4'],
            pie: {
                title: 'Favorite Food in Jogja',
                detail: { 
                  time_value_list: [2017],
                  legend_list: ['White', 'Black', 'Red','Yellow','Green'],
                  dataset: {
                    White: { '2017': 1 },
                    Black: { '2017': 1 },
                    Red: { '2017': 1},
                    Yellow:{ '2017': 1},
                    Green:{ '2017': 1},
                    
                  }
                }
              },
              pieSecond: {
                title: 'Favorite Food in Jogja',
                detail: { 
                  time_value_list: [2017],
                  legend_list: ['White', 'Black', 'Red','Yellow','Green'],
                  dataset: {
                    White: { '2017': 1 },
                    Black: { '2017': 1 },
                    Red: { '2017': 1},
                    Yellow:{ '2017': 1},
                    Green:{ '2017': 1},
                    
                  }
                }
              },
              tableData:'',
              masterlist:'',
              totalCount:'',
              orgId:'',
              token:'',
              loading:false,
              zoneid:'',
              whitetechCount:'',
              whiteeconCount:'',
              blacktechCount:'',
              blackeconCount:'',
              redtechCount:'',
              redeconCount:'',
              yellowtechCount:'',
              yelloweconCount:'',
              greentechCount:'',
              greeneconCount:'',
              displaycount:0,
              colortext:'',
              yAxis:0
        }
        let onEndReached = false;
        this.backItems= this.backItems.bind(this);
    }
    componentWillUnmount(){
      BackHandler.removeEventListener('hardwareBackPressed',this.backItems);
     }
     checkInternet=()=>{
      NetInfo.fetch().then(state => {
        console.log("Connection type", state.isConnected);
        this.setState({connected:state.isConnected});
      });
    }
      backItems(){
        if (this.props.navigation.isFocused()) { 
          console.log('working')
          this.props.navigation.goBack();
          return true;
      } 
    }
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

componentDidMount(){
  this.checkInternet()
   AsyncStorage.getItem('@loginToken').then(succ=>{
     if(succ){
    this.setState({token:succ});
     }
   });
   AsyncStorage.getItem('@zone_id').then(succ=>{
    if(succ){
   this.setState({zoneid:JSON.stringify(succ)});
   this.dataFetchStockItem();
    }
  })
  BackHandler.addEventListener('hardwareBackPressed',this.backItems);
}
showLoading () {
  this.setState({spinner: true})
}

hideLoading () {
  this.setState({spinner: false})
}
renderItem = ({ item,index }) =>
{ 
  return(
    <View key={index}>
     <TouchableOpacity style={{flexDirection:'row',height:'auto',}} >
       <View style={{width:wp(200),alignSelf:'flex-start',flexDirection:'row',justifyContent:'flex-start',alignItems:'flex-start'}}>
     <Text style={{fontSize:13,marginLeft:5,flexWrap:'wrap',marginBottom:10,}}>{item.itemdescription}</Text>
     </View>
     <View style={{width:wp(120),alignSelf:'center',flexDirection:'row',justifyContent:'flex-start',alignItems:'flex-start'}}>
     <Text style={{fontSize:13,marginLeft:15,flexWrap:'wrap',marginBottom:10,textAlign:'left'}}>{item.itemcode}</Text>
     </View>
     {/* <View style={{width:wp(120),alignSelf:'flex-end',flexDirection:'row',justifyContent:'flex-start',alignItems:'flex-start'}}>
     <Text style={{fontSize:13,marginLeft:15,flexWrap:'wrap',marginBottom:10,textAlign:'left'}}>{item.colorPercent}</Text>
     </View> */}
     {/* <Text style={{fontSize:13,marginLeft:20}}>{item.contact}</Text> */}
     {/* <Text style={{fontSize:13,marginLeft:20,}}>{item.city}</Text> */}
    
     </TouchableOpacity>
     <View style={{borderWidth:0.5,backgroundColor:'black'}}></View>

    </View>
  );
}
  dataFetchStockItem=()=>{
    this.showLoading()
    let todaytime=new Date().getTime();
    let time=JSON.stringify(todaytime.toString());
    var EditProfileUrl = `${BASE_URL}/dms-demo/DmsCommonReport?logintoken=${this.state.token}&sourcetype=AndroidSalesPersonApp&reportDataSource=buffer-penetration&reportInputFieldsData={"selZoneId":${this.state.zoneid},"childZoneFlag": "true","AllHierarchyFlag":"false","selCustomerType": ${JSON.stringify(this.props.route.params.dataItem.name)},"selCustomerId": ${JSON.stringify(this.props.route.params.dataItem.orgid)},"selStartDateNum": ${time},"selEndDateNum": ${time},"fetchDataSource": "report-runtime-data","timeoffset": 330}`
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
          console.log(JSON.stringify(responseData))
          let totaltechCount=0;
           totaltechCount+=Number(responseData.white.techCount);
           totaltechCount+=Number(responseData.black.techCount);
           totaltechCount+=Number(responseData.red.techCount);
           totaltechCount+=Number(responseData.yellow.techCount);
           totaltechCount+=Number(responseData.green.techCount);
           console.log('total tech count',responseData.white.techItems);
           console.log('total tech count',totaltechCount);
           let whiteValue=(responseData.white.techCount/totaltechCount)*100;
           this.setState({whitetechCount:responseData.white.techItems,dispwhitetechCount:responseData.white.techCount});
           let blackValue=(responseData.black.techCount/totaltechCount)*100;
           this.setState({blacktechCount:responseData.black.techItems,dispblacktechCount:responseData.black.techCount});
           let redValue=(responseData.red.techCount/totaltechCount)*100;
           this.setState({redtechCount:responseData.red.techItems,dispredtechCount:responseData.red.techCount});
           let yellowValue=(responseData.yellow.techCount/totaltechCount)*100;
           this.setState({yellowtechCount:responseData.yellow.techItems,dispyellowtechCount:responseData.yellow.techCount});
           let greenValue=(responseData.green.techCount/totaltechCount)*100;
           this.setState({greentechCount:responseData.green.techItems,dispgreentechCount:responseData.green.techCount});
           let pie= {
            title: 'Favorite Food in Jogja',
            detail: { 
              time_value_list: [2017],
              legend_list: ['White', 'Black', 'Red','Yellow','Green'],
              dataset: {
                White: { '2017': whiteValue },
                Black: { '2017': blackValue },
                Red: { '2017': redValue},
                Yellow: { '2017': yellowValue},
                Green: { '2017': greenValue},
              }
            }
          }
          this.setState({pie:pie});
          let totaleconCount=0;
          totaleconCount+=Number(responseData.white.econCount);
          totaleconCount+=Number(responseData.black.econCount);
          totaleconCount+=Number(responseData.red.econCount);
          totaleconCount+=Number(responseData.yellow.econCount);
          totaleconCount+=Number(responseData.green.econCount);
          console.log('total tech count',totaleconCount);
          let whiteEconValue=(responseData.white.econCount/totaleconCount)*100;
          this.setState({whiteeconCount:responseData.white.econItems,dispwhiteeconCount:responseData.white.econCount});
          let blackEconValue=(responseData.black.econCount/totaleconCount)*100;
          this.setState({blackeconCount:responseData.black.econItems,dispblackeconCount:responseData.black.econCount});
          let redEconValue=(responseData.red.econCount/totaleconCount)*100;
          this.setState({redeconCount:responseData.red.econItems,dispredeconCount:responseData.red.econCount});
          let yellowEconValue=(responseData.yellow.econCount/totaleconCount)*100;
          this.setState({yelloweconCount:responseData.yellow.econItems,dispyelloweconCount:responseData.yellow.econCount});
          let greenEconValue=(responseData.green.econCount/totaleconCount)*100;
          this.setState({greeneconCount:responseData.green.econItems,dispgreeneconCount:responseData.green.econCount});
          let pieSecond= {
            title: 'Favorite Food in Jogja',
            detail: { 
              time_value_list: [2017],
              legend_list: ['White', 'Black', 'Red','Yellow','Green'],
              dataset: {
                White: { '2017': whiteEconValue },
                Black: { '2017': blackEconValue },
                Red: { '2017': redEconValue},
                Yellow:{ '2017': yellowEconValue},
                Green:{ '2017': greenEconValue},
              }
            }
          }
          this.setState({pieSecond:pieSecond,dataLoaded:true});
          this.hideLoading();
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
        // console.log('contact list response object:', JSON.stringify(responseData))
      })
      .catch(error => {
         this.hideLoading();
        this.checkInternet()
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
logout=()=>{
  this.props.navigation.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{name: 'Login'}],
    }),
  ) 
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
  listHeader=()=>{
    return(<View style={{marginTop:8,marginBottom:5,marginLeft:5,}}>
      {this.state.tableData!=''?<View>
        <View style={{justifyContent:'center',alignItems:'center',marginBottom:10}}> 
          <Text style={{color:this.state.colortext,fontSize:18,fontWeight:'bold'}}>{this.state.DispType} {this.state.displaycount}</Text>
        </View>
    {!this.state.NoData?<View style={{flexDirection:'row',}}>
    <View style={{width:wp(200),alignSelf:'flex-start'}}>
    <Text style={{fontWeight:'bold',textAlign:'left'}}>Description</Text></View>
    <View style={{width:wp(120),alignSelf:'flex-start'}}>
    <Text style={{fontWeight:'bold',textAlign:'left'}}>Item Code</Text></View>
    </View>:null}
    </View>:null}
</View>)
  }
  secondPie=()=>{
    const time = this.state.pieSecond.detail.time_value_list
    const legend = this.state.pieSecond.detail.legend_list
    const dataset = this.state.pieSecond.detail.dataset
    var dataSetsValue = []
    var dataStyle = {}
    var legendStyle = {}
    var descStyle = {}
    var xAxisStyle = {}
    var chooseStyle = {}
    var valueLegend = []
    var colorLegend = []
    legend.map((legendValue) => {
        time.map((timeValue) => {
          const datasetValue = dataset[legendValue]
          const datasetTimeValue = datasetValue[timeValue]
  
          valueLegend.push({ value: parseInt(datasetTimeValue),marker: legendValue,})
        })
        colorLegend.push(processColor('lightgray',));
        colorLegend.push(processColor('black'));
        colorLegend.push(processColor('red'))
        colorLegend.push(processColor('yellow'))
        colorLegend.push(processColor('green'))
      })
      const datasetObject = {
        values: valueLegend,
        label: '',
        config: {
        
          colors: colorLegend,
          valueTextSize: 20,
          valueTextColor: processColor('orange'),
          sliceSpace: 5,
          selectionShift: 13
        }
      }
      dataSetsValue.push(datasetObject)
  
      legendStyle = {
        enabled: false,
        textSize: 12,
        form: 'CIRCLE',
        position: 'BELOW_CHART_RIGHT',
        wordWrapEnabled: true
      }
      dataStyle = {
        dataSets: dataSetsValue,
      }
    descStyle = {
        text: '',
        textSize: 15,
        textColor: processColor('darkgray')
      }
      return(
        <PieChart
        style={{width:width*0.8,height:hp(350)}}
        chartDescription={descStyle}
        data={dataStyle}
        legend={legendStyle}
        onSelect={this.handleSelectOne.bind(this)}
        highlights={[{ x: 2 }]} />
      )
  }
  handleSelectOne(event) {
    const obj = event.nativeEvent;
    if(JSON.stringify(obj)!=JSON.stringify({})){
    if(obj.data.marker=="White" && obj.value!==1){
     this.setState({tableData:this.state.whiteeconCount,displaycount:this.state.dispwhiteeconCount,colortext:'gray',DispType:'Economic Penetration'},()=>{
      this.myScroll.scrollTo({x:0, y:this.state.yAxis});
    });
  }
    if(obj.data.marker=="Black" && obj.value!==1){
     this.setState({tableData:this.state.blackeconCount,displaycount:this.state.dispblackeconCount,colortext:'black',DispType:'Economic Penetration'},()=>{
      this.myScroll.scrollTo({x:0, y:this.state.yAxis}); 
     });
    }
    if(obj.data.marker=="Red" && obj.value!==1){
     this.setState({tableData:this.state.redeconCount,displaycount:this.state.dispredeconCount,colortext:'red',DispType:'Economic Penetration'},()=>{
      this.myScroll.scrollTo({x:0, y:this.state.yAxis});
     });
    }
    if(obj.data.marker=="Yellow" && obj.value!==1) {
     this.setState({tableData:this.state.yelloweconCount,displaycount:this.state.dispyelloweconCount,colortext:'yellow',DispType:'Economic Penetration'},()=>{
      this.myScroll.scrollTo({x:0, y:this.state.yAxis});
     });
    }
    if(obj.data.marker=="Green" && obj.value!==1){
   this.setState({tableData:this.state.greeneconCount,displaycount:this.state.dispgreeneconCount,colortext:'green',DispType:'Economic Penetration'},()=>{
    this.myScroll.scrollTo({x:0, y:this.state.yAxis}); 
   })
    }
    }
    console.log('obj',obj);
  }
  handleSelect(event) {
    const obj = event.nativeEvent;
    if(JSON.stringify(obj)!=JSON.stringify({})){     
    if(obj.data.marker=="White" && obj.value!==1) {
    this.setState({tableData:this.state.whitetechCount,displaycount:this.state.dispwhitetechCount,colortext:'gray',DispType:'Tech Penetration'},()=>{
      this.myScroll.scrollTo({x:0, y:this.state.yAxis});
    });
    }
    if(obj.data.marker=="Black" && obj.value!==1){
       this.setState({tableData:this.state.blacktechCount,displaycount:this.state.dispblacktechCount,colortext:'black',DispType:'Tech Penetration'},()=>{
        this.myScroll.scrollTo({x:0, y:this.state.yAxis});
       });
    }
       if(obj.data.marker=="Red" && obj.value!==1) {
      this.setState({tableData:this.state.redtechCount,displaycount:this.state.dispredtechCount,colortext:'red',DispType:'Tech Penetration'},()=>{
            this.myScroll.scrollTo({x:0, y:this.state.yAxis});
          });
       }
    if(obj.data.marker=="Yellow" && obj.value!==1){
  this.setState({tableData:this.state.yellowtechCount,displaycount:this.state.dispyellowtechCount,colortext:'yellow',DispType:'Tech Penetration'},()=>{
      this.myScroll.scrollTo({x:0, y:this.state.yAxis});
    });
    }
    if(obj.data.marker=="Green" && obj.value!==1){
   this.setState({tableData:this.state.greentechCount,displaycount:this.state.dispgreentechCount,colortext:'green',DispType:'Tech Penetration'},()=>{
        this.myScroll.scrollTo({x:0, y:this.state.yAxis});
      });
    }
    console.log('obj',obj);
  }
}
measureLoadingBar = ({nativeEvent}) => {
  console.log('native event',nativeEvent.layout.y);
  this.setState({yAxis:nativeEvent.layout.y})
}
render(){
  if(!this.state.connected){
    return(<OfflineUserScreen onTry={this.checkInternet} />)
       }
    const time = this.state.pie.detail.time_value_list
    const legend = this.state.pie.detail.legend_list
    const dataset = this.state.pie.detail.dataset

    var dataSetsValue = []
    var dataStyle = {}
    var legendStyle = {}
    var descStyle = {}
    var xAxisStyle = {}
    var chooseStyle = {}
    var valueLegend = []
    var colorLegend = []
    legend.map((legendValue) => {
        time.map((timeValue) => {
          const datasetValue = dataset[legendValue]
          const datasetTimeValue = datasetValue[timeValue]
          valueLegend.push({ value: parseInt(datasetTimeValue),marker: legendValue});
        })
        colorLegend.push(processColor('lightgray',));
        colorLegend.push(processColor('black'));
        colorLegend.push(processColor('red'));
        colorLegend.push(processColor('yellow'));
        colorLegend.push(processColor('green'));
      })
      const datasetObject = {
        values: valueLegend,
        label: '',
        config: {
          colors: colorLegend,
          valueTextSize: 20,
          valueTextColor: processColor('orange'),
          sliceSpace: 5,
          selectionShift: 13,
          
        }
      }
      dataSetsValue.push(datasetObject)
  
      legendStyle = {
        enabled: false,
        textSize: 12,
        form: 'CIRCLE',
        position: 'BELOW_CHART_RIGHT',
        wordWrapEnabled: true
      }
      dataStyle = {
        dataSets: dataSetsValue
      }
    descStyle = {
        text: '',
        textSize: 15,
        textColor: processColor('darkgray')
      }
    return(
        <View style={styles.container}>
          <Spinner
          visible={this.state.spinner}
          color='#1976D2'
        />
           <View style={styles.headerView}>
          <View style={styles.BackButtonContainer}>
           
              <Icon name="arrow-back" size={25} color={"#fff"} onPress={()=>{this.props.navigation.goBack()}} />
           
          </View>
          <View style={styles.TitleContainer}>
            <View>
              <Text style={styles.TitleStyle}>{this.props.route.params.dataItem.name}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.SearchContainer}
            onPress={()=>{this.props.navigation.navigate('DashBoardScreen')}}>
               <Icon name="home"  size={25} color={"#fff"} onPress={()=>{this.props.navigation.navigate('DashBoardScreen')}} />
          </TouchableOpacity>
        </View>
        <ScrollView ref={(ref) => {
            this.myScroll = ref// !!
          }}
          >
        {this.state.dataLoaded?<View>
        {!this.state.NoData?<View>
        <View style={{marginLeft:10,justifyContent:'center',alignItems:'center'}}>
            {/* <ScrollView horizontal={true}> */}
            <View style={{justifyContent:'center',alignItems:'center',marginTop:5}}>
              <Text style={{fontSize:17,fontWeight:'bold'}}>Economic Penetration</Text>
            </View>
            {this.secondPie()}
            <View style={{justifyContent:'center',alignItems:'center'}}>
              <Text style={{fontSize:17,fontWeight:'bold'}}>Tech Penetration</Text>
            </View>
        <PieChart
        style={{width:width*0.8,height:hp(350),}}
        chartDescription={descStyle}
        data={dataStyle}
        onSelect={this.handleSelect.bind(this)}
        legend={legendStyle}
        highlights={[{ x: 2 }]} />
        {/* </ScrollView> */}
        </View>
        <View onLayout={this.measureLoadingBar}>
         <FlatList
         keyExtractor={(item, index) => index.toString()} 
         data={this.state.tableData}
         initialNumToRender={20}
         maxToRenderPerBatch={20}
         numColumns={1}
         ListHeaderComponent={this.listHeader}
         renderItem={this.renderItem}
          />
          </View>
          </View>
          :<View style={{justifyContent:'center',alignItems:'center'}}> 
            <Text style={{fontSize:18}}>No Data Found</Text>
</View>}
</View>:null}
</ScrollView>
      </View>
    )
}
}
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor:'#fff'},
    head: { height: 40, backgroundColor: '#f1f8ff' },
    text: { margin: 6 },
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
        flex: 0.2,
      marginRight:10,
      backgroundColor: '#1976D2',
    },
    TitleContainer: {
      flexDirection: 'row',
      flex: 0.57,
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