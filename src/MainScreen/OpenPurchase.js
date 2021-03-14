import React, { Component } from 'react';
import {TextInput,View,TouchableOpacity,Text,ScrollView,StyleSheet,FlatList, Dimensions,BackHandler,ActivityIndicator,processColor} from 'react-native';
import firebase from '../utils/firebase';
import { Table, Row, Rows } from 'react-native-table-component';
import resp from 'rn-responsive-font';
import Icon from 'react-native-vector-icons/Ionicons'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { wp, hp } from '../utils/heightWidthRatio';
import {PieChart} from 'react-native-charts-wrapper';
let width=Dimensions.get('window').width;
export default class OpenPurchase extends Component{
    constructor(props){
        super(props);
        this.state={
            text:"",
            ReportData:[],
            tableHead: ['Head', 'Head2', 'Head3', 'Head4'],
            pie: {
                title: 'Favorite Food in Jogja',
                detail: { 
                  time_value_list: [2017],
                  legend_list: ['Fast', 'Medium', 'Slow'],
                  dataset: {
                    Fast: { '2017': 1 },
                    Medium: { '2017': 1 },
                    Slow: { '2017': 1},
                    
                  }
                }
              },
              tableData: [
                  {number:1001,date:'1/1/2021',amount:'45,652'},
                  {number:1002,date:'2/1/2021',amount:'34,210'},
                  {number:1003,date:'3/1/2021',amount:'21,641'},
                  {number:1004,date:'4/1/2021',amount:'12,657'},
                  {number:1005,date:'5/1/2021',amount:'34,642'},
                  {number:1006,date:'6/1/2021',amount:'47,478'},
                  {number:1007,date:'7/1/2021',amount:'85,657'},
                  {number:1008,date:'8/1/2021',amount:'78,652'},
                  {number:1009,date:'9/1/2021',amount:'25,852'},
                  {number:1010,date:'10/1/2021',amount:'15,214'},
              ],
              masterlist:'',
              totalCount:'',
              orgId:'',
              token:'',
              loading:false,
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
   AsyncStorage.getItem('@loginToken').then(succ=>{
     if(succ){
    this.setState({token:succ});
     }
   })
  BackHandler.addEventListener('hardwareBackPressed',this.backItems);
}
renderItem = ({ item,index }) => (
    <View key={index}>
     <TouchableOpacity style={{flexDirection:'row',height:'auto',}} >
       <View style={{width:wp(100),alignSelf:'flex-start',flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
     <Text style={{fontSize:13,marginLeft:5,flexWrap:'wrap',marginBottom:10,}}>{item.number}</Text>
     </View>
     <View style={{width:wp(120),alignSelf:'center',flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
     <Text style={{fontSize:13,marginLeft:15,flexWrap:'wrap',marginBottom:10,textAlign:'center'}}>{item.date}</Text>
     </View>
     <View style={{width:wp(120),alignSelf:'flex-end',flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
     <Text style={{fontSize:13,marginLeft:15,flexWrap:'wrap',marginBottom:10,textAlign:'center'}}>{item.amount}</Text>
     </View>
     {/* <Text style={{fontSize:13,marginLeft:20}}>{item.contact}</Text> */}
     {/* <Text style={{fontSize:13,marginLeft:20,}}>{item.city}</Text> */}
    
     </TouchableOpacity>
     <View style={{borderWidth:0.5,backgroundColor:'black'}}></View>

    </View>
  );
  stockDatainDB=(data,count)=>{
    firebase.database().ref('StockMasterTable/').set({data,Totalcount:count}).then((data)=>{
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
          this.stockDatainDB(responseData.customerDetails.data,responseData.customerDetails.totalCount);
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
  
          valueLegend.push({ value: parseInt(datasetTimeValue), label: legendValue })
        })
        colorLegend.push(processColor('red',));
        colorLegend.push(processColor('yellow'));
        colorLegend.push(processColor('orange'))
      })
      const datasetObject = {
        values: valueLegend,
        label: '',
        config: {
          colors: colorLegend,
          valueTextSize: 20,
          valueTextColor: processColor('white'),
          sliceSpace: 5,
          selectionShift: 13
        }
      }
      dataSetsValue.push(datasetObject)
  
      legendStyle = {
        enabled: true,
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
        <View style={{flexDirection:'row',marginLeft:10}}>
            <ScrollView horizontal={true}>
        <PieChart
        style={{width:wp(width/2),height:hp(350)}}
        chartDescription={descStyle}
        data={dataStyle}
        legend={legendStyle}
        highlights={[{ x: 2 }]} />
         <PieChart
        style={{width:wp(width/2),height:hp(350)}}
        chartDescription={descStyle}
        data={dataStyle}
        legend={legendStyle}
        highlights={[{ x: 2 }]} />
        </ScrollView>
        </View>
            <View style={{marginTop:8,marginBottom:5,marginLeft:5,}}>
                <View style={{flexDirection:'row',}}>
                <View style={{width:wp(100),alignSelf:'flex-start'}}>
                <Text style={{fontWeight:'bold',textAlign:'center'}}>Order Number</Text></View>
                <View style={{width:wp(120),alignSelf:'center'}}>
                <Text style={{fontWeight:'bold',textAlign:'center'}}>Order Date</Text></View>
                <View style={{width:wp(120),}}>
                 <Text style={{fontWeight:'bold',textAlign:'center'}}>Order Amount</Text></View>
            
                </View>
            </View>
         <FlatList
         keyExtractor={(item, index) => index.toString()} 
         data={this.state.tableData}
         initialNumToRender={20}
         maxToRenderPerBatch={20}
        //  onEndReachedThreshold={0.1}
        //  onMomentumScrollBegin = {() => {this.onEndReached = false;}}
         numColumns={1}
         renderItem={this.renderItem}
    //      ListFooterComponent={this.BottomView}
    //      onEndReached = {() => {
    //       if (!this.onEndReached) {
    //         console.log('reached')
    //            this.dataFetchStockItem();   // on End reached
    //             this.onEndReached = true;
    //       }
    //     }
    //    }
          />
          {/* <View style={{justifyContent:'center',alignItems:'center',marginTop:10,marginBottom:100}}>
           <TouchableOpacity style={{backgroundColor:'#1976D2',width:200,height:45,justifyContent:'center',alignItems:'center',borderRadius:10}}
                 >
                     <Text style={{color:'#fff',fontSize:18}}>Create Order</Text>
                     </TouchableOpacity>
                     </View> */}
      </View>
    )
}
}
const styles = StyleSheet.create({
    container: { flex: 1, },
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