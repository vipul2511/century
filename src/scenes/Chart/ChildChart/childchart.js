import React from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  processColor,
  ScrollView,
  Dimensions,
  Alert,
  TouchableOpacity
} from 'react-native';
import RNSpeedometer from 'react-native-speedometer';
import { CommonActions } from '@react-navigation/native';
import {LineChart,PieChart,BarChart} from 'react-native-charts-wrapper';
import {ProgressChart} from 'react-native-chart-kit';
import { wp, hp } from '../../../utils/heightWidthRatio';
import resp from 'rn-responsive-font';
import Spinner from 'react-native-loading-spinner-overlay';
import Ionicons from 'react-native-vector-icons/Ionicons';
import firebase from '../../../utils/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL} from '../../../utils/BaseUrl';
let width=Dimensions.get('window').width;
let height=Dimensions.get('window').height;
export default class ChildChart extends React.Component {
  constructor(props){
      super(props);
      this.state={
        zoneid:'',
        orgId:'',
        token:'',
        NoData:false,
        spinner:false,
        fastsalesItem:'',
        mediumSalesItem:'',
        salesfirst:'',
        salessecond:'',
        salesthird:'',
        saleItemSlow:'',
        value: 0,
        valueAvailability:88,
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
          lineValue:[
            { y: 0,},
        ],
        barvalue:false,
        legend: {
          enabled: false,
          textSize: 14,
          form: 'SQUARE',
          formSize: 14,
          xEntrySpace: 10,
          yEntrySpace: 5,
          formToTextSpace: 5,
          wordWrapEnabled: true,
          maxSizePercent: 0.5
        },
        data: {
          dataSets: [{
            values: [{y: 0}],
            // label: 'Bar dataSet',
            config: {
              color: processColor('teal'),
              barShadowColor: processColor('lightgrey'),
              highlightAlpha: 90,
              highlightColor: processColor('red'),
            }
          }],
  
          config: {
            barWidth: 0.2,
          }
        },
        highlights: [{x: 3}, {x: 6}],
        xAxis: {
          valueFormatter: ['Jan'],
          granularityEnabled: true,
          granularity : 1,
        }
         
      
         
      }
  }
  componentDidMount(){
    AsyncStorage.getItem('@loginToken').then(succ=>{
      if(succ){
     this.setState({token:succ});
     console.log('login token in chat',this.state.token); 
     console.log('the props of child chart',JSON.stringify(this.props));
      this.millsecond()
      }
    });
  }
  showLoading () {
    this.setState({spinner: true})
  }

  hideLoading () {
    this.setState({spinner: false})
  }
  dataFetching=(startdate,enddate)=>{
      // console.log('zone id ',this.props.route.params.dataItem.zoneid,'org id',this.props.route.params.dataItem.orgid);
      let zoneid=JSON.stringify(this.props.route.params.dataItem.zoneid);
      let orgid=JSON.stringify(this.props.route.params.dataItem.orgid);
      let type=JSON.stringify(this.props.route.params.dataItem.typecus);
    let startDate=JSON.stringify(startdate);
    let endDate=JSON.stringify(enddate);
    console.log('start date',startDate,'end date',endDate);
    var EditProfileUrl = `${BASE_URL}/dms-demo/DmsCommonReport?logintoken=${this.state.token}&sourcetype=AndroidSalesPersonApp&reportDataSource=mobile-entity-dashboard-fetch&reportInputFieldsData={"AllHierarchyFlag" : "false" , "movertype" : "All" , "selEndDateNum" : ${endDate} , "selCustomerId" : ${orgid} , "timeoffset" : "330" , "selStartDateNum" : ${startDate} , "selZoneId" : ${zoneid} , "selEntityType" : ${type} , "childZoneFlag" : "true" , "selEntityId" : ${orgid} , "fetchDataSource" : "report-runtime-data" , "selCustomerType" : "All" , "dashboardReportFields" : [ "reach-range-chart" , "slow-fast-movers-report" , "sales-report"]}`
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
              let slowArr=responseData.slowFastMoverData.length;
              let dialRangeGraph=responseData.reachrangeData.length;
              console.log('slow arr',slowArr,'dial range graph',Array.isArray(responseData.reachrangeData));
              console.log('slow arr',responseData);
              if(Array.isArray(responseData.reachrangeData)==false){
                console.log('the data is coming ',responseData.reachrangeData.rangePercentage)
                this.setState({value:responseData.reachrangeData.rangePercentage})
              }
              if (slowArr!=0) {
                // console.log(JSON.stringify(responseData));
                let salesGraphData=responseData.entitySalesData;
                let salesmonth1=0;
                let salesmonth2=0;
                let salesmonth3=0;
                let nameArray=[]
                let valuesDate=[]
                salesGraphData.map((itemData,index)=>{
                  nameArray.push(itemData.month);
                  let obj={
                    y:Math.floor(itemData.salesAmount),
                    month:itemData.month
                  }
                  valuesDate.push(obj);
                 console.log(nameArray);
                       if(itemData.month=="December"){
                        salesmonth1=Math.floor(itemData.salesAmount);
                       
                        this.setState({salesfirst:itemData})
                       }
                       if(itemData.month=="January"){
                        salesmonth2=Math.floor(itemData.salesAmount);
                      
                        this.setState({salessecond:itemData})
                       }
                       if(itemData.month=="February"){
                        salesmonth3=Math.floor(itemData.salesAmount);
                        this.setState({salesthird:itemData})
                       }
                      
                     
                });
                // console.log('data value',valuesDate);
                let data= {
                  dataSets: [{
                    values:valuesDate ,
                    // label: 'Bar dataSet',
                    config: {
                      color: processColor('teal'),
                      barShadowColor: processColor('lightgrey'),
                      highlightAlpha: 90,
                      valueTextSize: 20,
                      highlightColor: processColor('red'),
                    }
                  }],
          
                  config: {
                    barWidth: 0.3,
                  }
                }
                this.setState({data:data})
                // console.log(nameArray);
                let xAxis= {
                  valueFormatter: nameArray,
                  granularityEnabled: true,
                  granularity : 1,
                  textSize: 15,
                }
                this.setState({xAxis:xAxis});
              }else{
                this.setState({NoData:true}) 
              }
          if(slowArr!=0){
            let totalCount=0;
            let dataofPieChart=responseData.slowFastMoverData;
            let saleItemSlow='';
            let mediumSalesItem='';
            let fastsalesItem='';
            dataofPieChart.map((item,index)=>{
              totalCount=totalCount+item.itemsCount;
            });
            // console.log('item of pie chart',totalCount)
            let finalValue;
            let mediumValue;
            let slowvalue;
            dataofPieChart.map((items,index)=>{
              if(items.type=="Fast-Movers"){
                let value=items.itemsCount/totalCount*100;
                fastsalesItem=items.salesItems;
                finalValue=value.toFixed(2);
                // console.log('item of pie chart',finalValue);
              }
              if(items.type=="Medium-Movers"){
                let value=items.itemsCount/totalCount*100;
                mediumValue=value.toFixed(2);
                mediumSalesItem=items.salesItems;
                // console.log('item of pie chart',mediumValue);
              }
              if(items.type=="Slow-Movers"){
                let value=items.itemsCount/totalCount*100;
                saleItemSlow=items.salesItems;
                slowvalue=value.toFixed(2);
                // console.log('item of pie chart',slowvalue);
              }
            });
            this.setState({fastsalesItem:fastsalesItem,mediumSalesItem:mediumSalesItem,saleItemSlow:saleItemSlow})
            if(finalValue==0.00){
              let pie= {
                title: 'Favorite Food in Jogja',
                detail: { 
                  time_value_list: [2017],
                  legend_list: ['Medium', 'Slow'],
                  dataset: {
                    Medium: { '2017': mediumValue },
                    Slow: { '2017': slowvalue },
                    
                  }
                }
              };
              this.setState({pie:pie})
            }else if(mediumValue==0.00){
               let pie= {
                  title: 'Favorite Food in Jogja',
                  detail: { 
                    time_value_list: [2017],
                    legend_list: ['Fast', 'Slow'],
                    dataset: {
                      Fast: { '2017': finalValue },
                     Slow: { '2017': slowvalue},
                    }
                  }
                };
                this.setState({pie:pie})
            }
            else if(slowvalue==0.00){
              let pie= {
                title: 'Favorite Food in Jogja',
                detail: { 
                  time_value_list: [2017],
                  legend_list: ['Fast', 'Medium',],
                  dataset: {
                    Fast: { '2017': finalValue },
                    Medium: { '2017': mediumValue },
                    
                    
                  }
                }
              };
              this.setState({pie:pie})
            }else{
              let pie= {
                title: 'Favorite Food in Jogja',
                detail: { 
                  time_value_list: [2017],
                  legend_list: ['Fast', 'Medium','Slow'],
                  dataset: {
                    Fast: { '2017': finalValue },
                    Medium: { '2017': mediumValue },
                    Slow:{'2017':slowvalue}
                    
                  }
                }
              };
              this.setState({pie:pie}) 
            }
          }else{
            this.setState({NoData:true}) 
          }
         this.hideLoading();
        } 

        else {
          this.hideLoading();
          this.setState({NoData:true})
         console.log(responseData);
        }
      }
      }else{
        this.hideLoading();
        this.createTwoButtonAlert()
      }
        // console.log('contact list response object:', JSON.stringify(responseData))
      })
      .catch(error => {
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
    millsecond=()=>{
      this.showLoading();
      var d = new Date();
console.log(d.toLocaleDateString());
d.setMonth(d.getMonth() - 6);
console.log(d.toLocaleDateString());
let timebeforemonth = new Date(d.toLocaleDateString()).getTime(); 
let timebefore3month=JSON.stringify(timebeforemonth);
console.log('3 before current millsecond',timebefore3month);
let timemonth=new Date().getTime(); 
let time3month=JSON.stringify(timemonth);
console.log('current millsecond',time3month);
   this.dataFetching(timebefore3month,time3month);  
    }
    logout=()=>{
              this.props.navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{name: 'Login'}],
                }),
              ) 
    }
    renderBar () {
      return ( 
        <View>
        <BarChart
        style={{width:width,height:hp(350)}}
        data={this.state.data}
        chartDescription={{ text: '' }}
        xAxis={this.state.xAxis}
        animation={{durationX: 2000}}
        legend={this.state.legend}
        gridBackgroundColor={processColor('#ffffff')}
        visibleRange={{x: { min: 0, max: 3 }}}
        drawBarShadow={false}
        drawValueAboveBar={true}
        drawHighlightArrow={true}
        onSelect={this.handleBarGraph.bind(this)}
        highlights={this.state.highlights}
        onChange={(event) => console.log(event.nativeEvent)}
      />
      </View>
     
      )
    }
  handleBarGraph=(event)=>{
    const obj = event.nativeEvent;
    let value =obj.x;
    value=Math.floor(value);
    console.log(value)
    console.log('obj',obj);
    if(JSON.stringify(obj)!=JSON.stringify({})){
      console.log('working');
      this.props.navigation.navigate('ChildDataGraph',{name:obj.data.month,data:this.state.salesfirst,zoneid:JSON.stringify(this.props.route.params.dataItem.zoneid),token:this.state.token,DataItem:this.props.route.params.dataItem,dataMonth:"Last 3 months",childVar:'From Child'});
    }
  }
  handleSelect(event) {
    const obj = event.nativeEvent;
    if(obj.label=="Slow" && obj.value!==1) this.props.navigation.navigate('PieChartData',{name:'Slow Mover Data',data:this.state.saleItemSlow});
    if(obj.label=="Fast" && obj.value!==1) this.props.navigation.navigate('PieChartData',{name:'Fast Mover Data',data:this.state.fastsalesItem});
    if(obj.label=="Medium" && obj.value!==1) this.props.navigation.navigate('PieChartData',{name:'Medium Mover Data',data:this.state.mediumSalesItem});
    console.log('obj',obj);
  }
  render() {
    const data = {
        labels: ["Nov", "Dec", "Jan","Feb"], // optional
        data: [0.4, 0.6, 0.8,0.2]
      };
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
     
    return (
       
      <View style={{flex: 1}}>
          <Spinner
          visible={this.state.spinner}
          color='#1976D2'
        />
          <View style={styles.headerView}>
          <View style={styles.BackButtonContainer}>
           
          <Ionicons name="arrow-back"  size={25} color={"#fff"} onPress={()=>{this.props.navigation.goBack()}} />
           
          </View>
          <View style={styles.TitleContainer}>
            <View
              style={{alignItems: 'center', justifyContent: 'center'}}>
              <Text style={styles.TitleStyle}>{this.props.route.params.dataItem.name}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.SearchContainer}
            onPress={() => {
              this.props.navigation.navigate('DashBoardScreen')
            }}>
             <Ionicons name="home"  size={25} color={"#fff"} onPress={()=>{this.props.navigation.navigate('DashBoardScreen')}} />
          </TouchableOpacity>
        </View>
        <ScrollView>
        <View style={{justifyContent:'center',alignItems:'center',marginTop:25,marginBottom:10}}>
                <TouchableOpacity style={{backgroundColor:'#1976D2',width:200,height:45,justifyContent:'center',alignItems:'center',borderRadius:10}}
                 onPress={()=>{this.props.navigation.navigate('CustomerGrid',{dataItem:this.props.route.params.dataItem})}}>
                     <Text style={{color:'#fff',fontSize:18}}>View Details</Text>
                     </TouchableOpacity>
            </View>
           {this.state.NoData==false?(<View>
          <View style={{justifyContent:'center',alignItems:'center'}}>
            <Text style={{fontWeight:'bold',fontSize:17}}>Sales</Text>
            </View>
        <View style={styles.container}>
          {this.renderBar()}
        </View>
        <View style={{justifyContent:'center',alignItems:'center',marginTop:10}}>
            <Text style={{fontWeight:'bold',fontSize:17}}>Slow-Fast Mover Report Data</Text>
            </View>
        <PieChart
        style={{width:width,height:hp(350)}}
        chartDescription={descStyle}
        data={dataStyle}
        legend={legendStyle}
        onSelect={this.handleSelect.bind(this)}
        highlights={[{ x: 2 }]} />
        <View style={{justifyContent:'center',alignItems:'center',marginTop:10,marginBottom:10}}>
            <Text style={{fontWeight:'bold',fontSize:17}}>Range</Text>
            </View>
            <View style={{justifyContent:'center',alignItems:'center',width:wp(350),height:hp(150),marginBottom:30}}>
            <RNSpeedometer value={this.state.value} size={200}  />
            <Text style={{marginLeft:wp(45),marginTop:2,fontWeight:'bold',fontSize:25}}>%</Text>
            </View>
            <View style={{justifyContent:'center',alignItems:'center',marginTop:10,marginBottom:10}}>
            <Text style={{fontWeight:'bold',fontSize:17}}>Availability</Text>
            </View>
            <View style={{justifyContent:'center',alignItems:'center',width:wp(350),height:hp(150),marginBottom:30}}>
            <RNSpeedometer value={this.state.valueAvailability} size={200}  />
            <Text style={{marginLeft:wp(45),marginTop:2,fontWeight:'bold',fontSize:25}}>%</Text>
            </View>
            </View>):<View style={{justifyContent:'center',alignItems:'center',marginTop:50}}>
        <Text style={{fontWeight:'bold'}}>
          No Data Found
        </Text>
      </View>}
        {/* {this.renderBar()} */}
        {/* <View style={{justifyContent:'center',alignItems:'center',marginTop:10,marginBottom:10}}>
            <Text>Progress Graph</Text>
            </View>
        <View>
        <ProgressChart
  data={data}
  width={width}
  height={220}
  strokeWidth={16}
  radius={32}
  chartConfig={chartConfig}
  hideLegend={false}
/>
        </View> */}
       </ScrollView>
        </View>
      


    );
  }
}
const chartConfig = {
    backgroundGradientFrom: "#1E2923",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#08130D",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false // optional
  };
const styles = StyleSheet.create({
  container: {
      marginTop:10,
    flex: 0.2,
    backgroundColor: '#F5FCFF'
  },
  chart: {
    flex: 1
  },
  card:{
      marginTop:12,
      width:wp(350),
      backgroundColor:'#fff',
      elevation:3,
      height:hp(140),
      marginBottom:10,
      marginLeft:10,
      marginRight:10
  },
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
    margin: 10,
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