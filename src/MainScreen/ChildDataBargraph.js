import React, { Component } from 'react';
import {View,Text,StyleSheet,Dimensions,processColor,TouchableOpacity,Alert} from 'react-native';
import {BarChart} from 'react-native-charts-wrapper';
import { wp, hp } from '../utils/heightWidthRatio';
import {Picker} from '@react-native-picker/picker';
import DatePicker from 'react-native-datepicker';
import { CommonActions } from '@react-navigation/native';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';
let width=Dimensions.get('window').width;
let height=Dimensions.get('window').height;
import resp from 'rn-responsive-font';
import Icon from 'react-native-vector-icons/Ionicons'
class ChildDataBarGraph extends Component{ 
    constructor(props){
        super(props);
        this.state={
            barvalue:false,
            Nodate:false,
            zoneid:'',
            salesfirst:'',
            language:'',
            salessecond:'',
            startdate:'',
            startDateValue:'',
            endDateValue:'',
            startmillsecond:'',
            spinner:false,
            endmillsecond:'',
            checkstartDate:'',
            ChooseStartDate:false,
            ChooseEndDate:false,
            defaultValue:" ",
            endDate:'',
            salesthird:'',
            token:'',
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
    showLoading () {
      this.setState({spinner: true})
    }
  
    hideLoading () {
      this.setState({spinner: false})
    }
    componentDidMount() {
      this.setState({startDateValue:new Date(),endDateValue:new Date(),checkstartDate:moment().format('L'),defaultValue:this.props.route.params.dataMonth})
        console.log('log id',this.props.route.params.token);
        AsyncStorage.getItem('@zone_id').then(id=>{
          if(id){
           this.setState({zoneid:JSON.stringify(id)});
           console.log('zone id in chart',this.state.zoneid); 
          }
        });
        AsyncStorage.getItem('@loginToken').then(succ=>{
          if(succ){
         this.setState({token:succ});
         console.log('login token in chat',this.state.token); 
          this.millsecond()
          }
        });
      }

      millsecond=()=>{
       
        let name=this.props.route.params.name
        console.log(name)
        let monthNumber=new Date(Date.parse(name +" 1, 2021")).getMonth()+1
        console.log('month',monthNumber);
  let timestartmonth=new Date(monthNumber+"/1/2021").getTime(); 
  let timemillsecmonth=JSON.stringify(timestartmonth);
  let timeend=new Date(monthNumber+"/31/2021").getTime(); 
  let timeendmonth=JSON.stringify(timeend);
  this.setState({startdate:timemillsecmonth,endDate:timeendmonth})
  console.log('current millsecond',timemillsecmonth);
     this.salesReportData(timemillsecmonth,timeendmonth);  
      }
   salesReportData=(startdate,enddate)=>{
    this.showLoading();
    this.setState({startdate:startdate,endDate:enddate});
     let monthName=JSON.stringify(this.props.route.params.name);
     let token=this.props.route.params.token;
     let zoneid=this.props.route.params.zoneid;
      let startDate=JSON.stringify(startdate);
      let endDate=JSON.stringify(enddate);
      let type=JSON.stringify(this.state.type);
      console.log('start date',startDate,'end date',endDate);
      var EditProfileUrl = `http://demo.3ptec.com/dms-demo/DmsCommonReport?logintoken=${token}&sourcetype=AndroidSalesPersonApp&reportDataSource=sales-report&reportInputFieldsData={"selZoneId": ${zoneid},"childZoneFlag": "true","AllHierarchyFlag": "false","selCustomerType": "All","selCustomerId": "All","selStartDateNum": ${startDate},"selEndDateNum": ${endDate},"fetchDataSource": "report-table-data","timeoffset": 330,"reportLevel": "EntityGroup","month": ${monthName},"year": "2021"}`
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
              if(responseData!="lstDbReportChildEntities is null / empty" && responseData!="Periodic Sales Data is null or empty"){ 
                console.log(responseData); 
                this.setState({Nodate:false})
              let arr=responseData;
            if(arr.length>0){
              let salesmonth1=0;
              let salesmonth2=0;
              let salesmonth3=0;
              let nameArray=[]
              let valuesDate=[]
            arr.map((itemData,index)=>{

                  nameArray.push(itemData.entitytypename);
                  let obj={
                    y:Math.floor(itemData.salesAmount),
                    entityType:itemData.entitytypename,
                    entity:itemData.entity
                  }
                  valuesDate.push(obj);
                   if(itemData.entitytypename=="Distributor"){
                    
                    this.setState({salesfirst:itemData})
                   }
                   if(itemData.entitytypename=="Retailer"){
                   
                   
                    this.setState({salessecond:itemData})
                   }
                   if(itemData.entitytypename=="RMBO"){
                   
                    this.setState({salesthird:itemData})
                   }    
            });
            console.log('the value',valuesDate);
            let data= {
              dataSets: [{
                values: valuesDate,
                // label: 'Bar dataSet',
                config: {
                  color: processColor('teal'),
                  // barShadowColor: processColor('lightgrey'),
                  highlightAlpha: 90,
                  valueTextSize: 20,
                  highlightColor: processColor('red'),
                }
              }],
      
              config: {
                barWidth: valuesDate.length>1?0.3:0.1,
              }
            }
            this.setState({data:data});
            let xAxis= {
              valueFormatter: nameArray,
              granularityEnabled: true,
              granularity : 1,
              textSize: 15,
              
            }
            this.setState({xAxis:xAxis});
          }
          this.hideLoading()
        }
          else {
            this.hideLoading()
            this.setState({Nodate:true,})
           console.log(responseData);
          }
        }
        }else{
          this.hideLoading()
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
   logout=()=>{
    this.props.navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'Login'}],
      }),
    ) 

}
searchfun=()=>{
  if(this.state.startmillsecond!='' && this.state.endmillsecond!=''){
      // this.setState({startDate:JSON.stringify(this.state.startmillsecond)});
      this.salesReportData(JSON.stringify(this.state.startmillsecond),JSON.stringify(this.state.endmillsecond));
      
  }else{
    alert('Please select the date');
  }
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
      renderBar () {
  
    
        return (
          
          <BarChart
          style={{width:width,height:hp(350)}}
          data={this.state.data}
          xAxis={this.state.xAxis}
          chartDescription={{ text: '' }}
          animation={{durationX: 2000}}
          legend={this.state.legend}
          gridBackgroundColor={processColor('#ffffff')}
          drawBarShadow={false}
          drawValueAboveBar={true}
          drawHighlightArrow={true}
          onSelect={this.handleBarGraph.bind(this)}
          highlights={this.state.highlights}
          onChange={(event) => console.log(event.nativeEvent)}
        />
       
        )
      }
      handleBarGraph=(event)=>{
        const obj = event.nativeEvent;
        let value =obj.x;
        value=Math.floor(value);
        console.log(value)
        console.log('obj',obj);
        let language='';
        {this.state.language!==''?language=this.state.language:language=this.state.defaultValue}
        if(JSON.stringify(obj)!=JSON.stringify({})){
        this.props.navigation.navigate('BarChildGraph',{name:obj.data.entityType,data:obj.data,start:this.state.startdate,enddate:this.state.endDate,month:this.props.route.params.name,zoneid:this.props.route.params.zoneid,token:this.props.route.params.token,dataMonth:language});
        }
       
      }
render(){
    return(
        <View style={{flex:1}}>
            <Spinner
          visible={this.state.spinner}
          color='#1976D2'
        />
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
        <View style={{justifyContent:'center',alignItems:'center',marginLeft:35,marginTop:35,marginRight:35,marginBottom:25}}>
        <View style={{width:wp(300),justifyContent:"center",alignItems:'center',borderWidth:1,borderColor:'gray',backgroundColor:'#F7F7F7'}}>
        <Picker
  selectedValue={this.state.language}
  style={{height: 50, width: 300,}}
  onValueChange={(itemValue, itemIndex) =>{
    let tomorrow;
      if(itemValue=="Previous Day"){
        this.setState({ChooseStartDate:false,ChooseEndDate:false})
         tomorrow = new Date();
    tomorrow.setDate(new Date().getDate()-1);
     tomorrow.toLocaleDateString();
    let tomorrowData=JSON.stringify(tomorrow.getTime());
    let endDate=new Date().getTime();
        let end=JSON.stringify(endDate);
    console.log('Previous',tomorrowData);  
    this.salesReportData(tomorrowData,end)
      }else if(itemValue=="Today"){
        this.setState({ChooseStartDate:false,ChooseEndDate:false})
        let tomorrow= new Date().toLocaleDateString();
        let time=new Date(tomorrow).getTime();
            this.salesReportData(JSON.stringify(time),JSON.stringify(time))
      }
      else if(itemValue=="Last 3 days"){
        this.setState({ChooseStartDate:false,ChooseEndDate:false})
        tomorrow = new Date();
        tomorrow.setDate(new Date().getDate()-3);
         tomorrow.toLocaleDateString();
        let tomorrowData=tomorrow.getTime();
        let time=JSON.stringify(tomorrowData)
        let endDate=new Date().getTime();
        let end=JSON.stringify(endDate);
        this.salesReportData(end,time)
        console.log('Last 3 days',time);
      }else if(itemValue=="Last 5 days"){
        this.setState({ChooseStartDate:false,ChooseEndDate:false})
        tomorrow = new Date();
        tomorrow.setDate(new Date().getDate()-5);
         tomorrow.toLocaleDateString();
         let tomorrowData=tomorrow.getTime();
         let time=JSON.stringify(tomorrowData)
         let endDate=new Date().getTime();
         let end=JSON.stringify(endDate);
         this.salesReportData(time,end)
        //  this.dataFetchStockItem(time);
         console.log('Last 5 days',time);
      }else if(itemValue=="Last week"){
        this.setState({ChooseStartDate:false,ChooseEndDate:false})
        tomorrow = new Date();
        tomorrow.setDate(new Date().getDate()-7);
         tomorrow.toLocaleDateString();
         let tomorrowData=tomorrow.getTime();
         let time=JSON.stringify(tomorrowData)
         let endDate=new Date().getTime();
          let end=JSON.stringify(endDate);
          this.salesReportData(time,end)
        //  this.dataFetchStockItem(time);
         console.log('Last week',time);
      }
      else if(itemValue=="Current month"){
        this.setState({ChooseStartDate:false,ChooseEndDate:false})
        let startOfMonth = moment().clone().startOf('month').format('YYYY-MM-DD hh:mm');
         let start=moment(startOfMonth).valueOf();
        const endOfMonth   = moment().clone().endOf('month').format('YYYY-MM-DD hh:mm');
        let end=moment(endOfMonth).valueOf();
        this.salesReportData(JSON.stringify(end),JSON.stringify(start));
         console.log('current month',startOfMonth,start,end,endOfMonth);
      } else if(itemValue=="Last month"){
        this.setState({ChooseStartDate:false,ChooseEndDate:false})
        let start= moment().subtract(1,'months').startOf('month').format('YYYY-MM-DD');
        let startDate=moment(start).valueOf();
       let end= moment().subtract(1,'months').endOf('month').format('YYYY-MM-DD');
       let endDate=moment(end).valueOf();
       this.salesReportData(JSON.stringify(startDate),JSON.stringify(endDate));
       console.log('last month',end,endDate,startDate,start);
      }else if(itemValue=="Last 3 months"){
        this.setState({ChooseStartDate:false,ChooseEndDate:false})
        let startOfMonth = moment().clone().startOf('month').format('YYYY-MM-DD hh:mm');
         let start=moment(startOfMonth).valueOf();
       let end= moment().subtract(3,'months').startOf('month').format('YYYY-MM-DD');
       let endDate=moment(end).valueOf();
       this.salesReportData(JSON.stringify(endDate),JSON.stringify(start));
       console.log('last 3 month',end,endDate,startOfMonth,start);
      }else if(itemValue=="Last 6 months"){
        this.setState({ChooseStartDate:false,ChooseEndDate:false})
        let startOfMonth = moment().clone().startOf('month').format('YYYY-MM-DD hh:mm');
        let start=moment(startOfMonth).valueOf();
       let end= moment().subtract(6,'months').startOf('month').format('YYYY-MM-DD');
       let endDate=moment(end).valueOf();
       this.salesReportData(JSON.stringify(endDate),JSON.stringify(start));
       console.log('last 6 month',end,endDate,startOfMonth,start);
      }
      else if(itemValue=="Last Quarter"){
        this.setState({ChooseStartDate:false,ChooseEndDate:false})
       let start =moment().quarter(moment().quarter()).startOf('quarter');
       let startQuarter=moment(start).valueOf();
       let end=moment().quarter(moment().quarter()).endOf('quarter');
       let endQuarter=moment(end).valueOf();
       this.salesReportData(JSON.stringify(startQuarter),JSON.stringify(endQuarter));
       console.log('last Quarter',start,startQuarter,end,endQuarter);
      }
    //   console.log('item value',itemValue);
    this.setState({language: itemValue})
  }
    
  }>
    <Picker.Item label={this.state.defaultValue} value={this.state.defaultValue}  />
  {this.state.defaultValue!=="Today"?<Picker.Item label="Today" value="Today" />:null}
  {this.state.defaultValue!=="Previous Day"?<Picker.Item label="Previous Day"  value="Previous Day" />:null}
  {this.state.defaultValue!=="Last 3 days"? <Picker.Item label="Last 3 days" value="Last 3 days" />:null}
  {this.state.defaultValue!=="Last 5 days"?<Picker.Item label="Last 5 days" value="Last 5 days" />:null}
  {this.state.defaultValue!=="Last week"? <Picker.Item label="Last week" value="Last week" />:null}
  {this.state.defaultValue!=="Current month"? <Picker.Item label="Current month" value="Current month" />:null}
  {this.state.defaultValue!=="Last month"? <Picker.Item label="Last month" value="Last month" />:null}
  {this.state.defaultValue!=="Last 3 months"?<Picker.Item label="Last 3 months" value="Last 3 months" />:null}
  {this.state.defaultValue!=="Last Quarter"?<Picker.Item label="Last Quarter" value="Last Quarter" />:null}
  {this.state.defaultValue!=="Last 6 months"? <Picker.Item label="Last 6 months" value="Last 6 months" />:null}
  <Picker.Item label="User defined date from and to date" value="User defined date from and to date" />
</Picker>
</View>
</View>
{this.state.language=="User defined date from and to date"?<View style={{flexDirection:'row'}}>
      <TouchableOpacity onPress={()=>{this.setState({ChooseStartDate:true})}} style={{marginBottom:hp(10),height:hp(35),justifyContent:'center',alignItems:'center',marginLeft:wp(10),borderColor:'black',borderWidth:1,width:wp(120)}}>
          <Text>Choose Start Date</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={()=>{this.setState({ChooseEndDate:true})}} style={{marginBottom:hp(10),height:hp(35),justifyContent:'center',alignItems:'center',marginLeft:wp(10),borderColor:'black',borderWidth:1,width:wp(120)}}>
          <Text>Choose End Date</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={()=>{this.searchfun()}} style={{marginBottom:hp(10),height:hp(35),justifyContent:'center',alignItems:'center',marginLeft:wp(10),borderColor:'black',backgroundColor:'#1976D2',borderWidth:1,width:wp(80)}}>
          <Text style={{color:'#fff',fontSize:15,fontWeight:'bold'}}>Search</Text>
      </TouchableOpacity>
      </View>:null }
      <View style={{flexDirection:'row'}}>
        {this.state.ChooseStartDate? <View style={{marginLeft:wp(10),marginBottom:hp(10),}}>
         <DatePicker
          format='MM/DD/YY'
      date={this.state.startDateValue}
      mode={"date"}
      onDateChange={(date)=>{
        //   let startdate=date.toLocaleDateString();
           let finaldate=new Date(date).getTime();
           console.log('date',date)
           console.log('final date',finaldate);
          this.setState({startDateValue:date,startmillsecond:finaldate,checkstartDate:date})}}
    />
         </View>:null}
         {this.state.ChooseEndDate? <View>
            <DatePicker
      date={this.state.endDateValue}
      mode={"date"}
      format='MM/DD/YY'
      onDateChange={(date)=>{
        //   let enddate=date.toLocaleDateString();
        let startdate=Date.parse(this.state.checkstartDate);
        let enddate=Date.parse(date);
        if(enddate<=startdate){
          alert("End date should be greater than Start date");
        }else{
        console.log('start date',this.state.startDateValue,'end date',date);
           let finaldate=new Date(date).getTime();
           console.log('date',startdate,'parse date',enddate);
           console.log('final date',finaldate);
          this.setState({endDateValue:date,endmillsecond:finaldate})}}
        }
    />
         </View>:null}
         </View>
         {this.state.Nodate==false?<View style={styles.container}>
            {this.renderBar()}
        </View>:<View style={{justifyContent:'center',alignItems:'center'}}>
          <Text style={{fontSize:16}}>No Data Found</Text>
        </View>}
        </View>
    )
}
}
const styles = StyleSheet.create({
    container: {
        marginTop:10,
      backgroundColor: '#F5FCFF'
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
export default ChildDataBarGraph;