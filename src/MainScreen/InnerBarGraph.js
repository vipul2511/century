import React, { Component } from 'react';
import {TextInput,View,TouchableOpacity,Text,ScrollView,StyleSheet,FlatList, Dimensions,BackHandler,ActivityIndicator,Alert} from 'react-native';
import { Table, Row, Rows } from 'react-native-table-component';
import resp from 'rn-responsive-font';
import Icon from 'react-native-vector-icons/Ionicons';
import { CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { wp, hp } from '../utils/heightWidthRatio';
import moment from 'moment';
import DatePicker from 'react-native-datepicker';
import {Picker} from '@react-native-picker/picker';
let width=Dimensions.get('window').width;
export default class InnerBarGraph extends Component{
    constructor(props){
        super(props);
        this.state={
            text:"",
            zoneid:'',
            ReportData:[],
            tableHead: ['Head', 'Head2', 'Head3', 'Head4'],
              tableData: [],
              Nodata:false,
              masterlist:'',
              totalCount:'',
              orgId:'',
              token:'',
              loading:false,
              startdate:'',
              startDateValue:'',
              endDateValue:'',
              startmillsecond:'',
              endmillsecond:'',
              checkstartDate:'',
              ChooseStartDate:false,
              ChooseEndDate:false,
              endDate:'',
              defaultValue:" ",
              language:'',
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
// data=()=>{
//   firebase.database().ref('Stock/').push({
//       StockName:this.state.text
//   }).then((data)=>{
//       console.log('data',data)
//   }).catch((err)=>{
//       console.log('error',err);
//   });
// }
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
searchfun=()=>{
  if(this.state.startmillsecond!='' && this.state.endmillsecond!=''){
      // this.setState({startDate:JSON.stringify(this.state.startmillsecond)});
      this.salesReportData(JSON.stringify(this.state.startmillsecond),JSON.stringify(this.state.endmillsecond));
      
  }else{
    alert('Please select the date');
  }
}
salesReportData=(startdate,enddate)=>{
  let month=JSON.stringify(this.props.route.params.month);
  let startDate=JSON.stringify(startdate);
  let endDate=JSON.stringify(enddate);
  let token=JSON.stringify(this.props.route.params.token);
  let zoneid=this.props.route.params.zoneid;
  let customerid=JSON.stringify(this.props.route.params.customerid);
  let type=JSON.stringify(this.props.route.params.data.entityType);
  let entitytype=JSON.stringify(this.props.route.params.data.entity);
  let name=JSON.stringify(this.props.route.params.name);
  console.log('start date',startDate,'end date',endDate);
  var EditProfileUrl = `http://demo.3ptec.com/dms-demo/DmsCommonReport?logintoken=${token}&sourcetype=AndroidSalesPersonApp&reportDataSource=sales-report&reportInputFieldsData={"selZoneId": ${zoneid},"childZoneFlag": "true","AllHierarchyFlag": "false","selCustomerType": ${entitytype},"selCustomerId": ${customerid},"selStartDateNum": ${startDate},"selEndDateNum": ${endDate},"fetchDataSource": "report-table-data","timeoffset": 330,"reportLevel": "DateWise","month": ${month},"year": "2021","entitytypename": ${type},"entityname": ${name}}`
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
          let arr=responseData;
          if(Object.prototype.toString.call(responseData) === '[object Array]'){
            this.setState({Nodata:false})
          console.log(arr.length);
           if(arr.length>0){
             this.setState({tableData:responseData});
           }
          }else{
            this.setState({Nodata:true,tableData:''})
          }
         }
      else {
        this.setState({Nodata:true,tableData:''})
    console.log(responseData);
      }
    }
    }else{
      this.createTwoButtonAlert()
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
createTwoButtonAlert = () =>
Alert.alert(
  "Invalid Session",
  "Your Session is expired Please login again",
  [
    
    { text: "OK", onPress: () => {this.logout()} }
  ],
  { cancelable: false }
);
componentDidMount(){
  this.setState({startDateValue:new Date(),endDateValue:new Date(),checkstartDate:moment().format('L'),defaultValue:this.props.route.params.dataMonth})
    console.log('daat',this.props.route.params.data);
    console.log(this.props.route.params.start,this.props.route.params.enddate);
   AsyncStorage.getItem('@loginToken').then(succ=>{
     if(succ){
    this.setState({token:succ});
     }
   });
   AsyncStorage.getItem('@zone_id').then(id=>{
    if(id){
     this.setState({zoneid:JSON.stringify(id)});
     console.log('zone id in chart',this.state.zoneid); 
     this.salesReportData(this.props.route.params.start,this.props.route.params.enddate)
    }
  });
  BackHandler.addEventListener('hardwareBackPressed',this.backItems);
//   this.getCustomerData();
  
}
searchFilterFunction = (text) => {
    // Check if searched text is not blank
    console.log('name',text);
    if (text) {
      this.onEndReached = true
      let combineArray=this.state.tableData
      const newData = combineArray.filter(
        function (item) {
          const itemData = item.invoicedate
            ? item.invoicedate.toUpperCase()
            : ''.toUpperCase();
            const itemgroup=item.customername
              ?item.customername.toUpperCase()
                          :''.toUpperCase();
                          const itemUnit=item.year
                          ?item.year.toUpperCase()
                                      :''.toUpperCase();
                                      const billedqty=item.salesAmount
                          ?item.salesAmount.toUpperCase()
                                      :''.toUpperCase();
          const textData = text.toUpperCase();
          return (
            itemData.indexOf(textData) > -1 ||
            itemgroup.indexOf(textData) > -1 ||
            itemUnit.indexOf(textData) > -1 ||
            billedqty.indexOf(textData) > -1 
          )
      });
      this.setState({tableData:newData});
    } else {
    this.setState({tableData:this.state.masterlist});
    this.onEndReached = true
    }
  };
renderItem = ({ item,index }) => 
{
  let language='';
  {this.state.language!==''?language=this.state.language:language=this.state.defaultValue}
  return(
    <View key={index}>
     <TouchableOpacity style={{flexDirection:'row',height:'auto',justifyContent:'center',alignItems:'center'}} >
       <TouchableOpacity style={{width:wp(100),alignSelf:'flex-start',flexDirection:'row'}} onPress={()=>{this.props.navigation.navigate('DateWiseReport',{name:item.customername,data:this.props.route.params.data,start:this.props.route.params.start,enddate:this.props.route.params.enddate,month:this.props.route.params.month,zoneid:this.props.route.params.zoneid,token:this.props.route.params.token,customerid:this.props.route.params.customerid,invoiceData:item,dataMonth:language})}}>
     <Text style={{fontSize:15,flexWrap:'wrap',marginBottom:10,textAlign:'left',color:'#1976D2'}}>{item.invoicedate}</Text>
     </TouchableOpacity>
     <TouchableOpacity style={{width:wp(100),alignSelf:'flex-end',flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
     <Text style={{fontSize:15,flexWrap:'wrap',marginBottom:10,textAlign:'center',}}>{item.customername}</Text>
     </TouchableOpacity>
     <View style={{width:wp(120),alignSelf:'flex-end',flexDirection:'row',justifyContent:'flex-end',alignItems:'flex-end'}}>
     <Text style={{fontSize:15,flexWrap:'wrap',marginBottom:10,textAlign:'right'}}>{item.salesAmount}</Text>
     </View>
     </TouchableOpacity>
     <View style={{borderWidth:0.5,backgroundColor:'black'}}></View>

    </View>
  );
}
  stockDatainDB=(data,count)=>{
    firebase.database().ref('StockMasterTable/').set({data,Totalcount:count}).then((data)=>{
      console.log('data',data);
      this.getCustomerData()
  }).catch((err)=>{
      console.log('error',err);
  })
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
  headerList=()=>{
    return(
   <View style={{marginTop:8,marginBottom:5,marginLeft:5,}}>
              {this.state.Nodata==false? <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                <View style={{width:wp(100),alignSelf:'flex-start'}}>
                <Text style={{fontWeight:'bold',textAlign:'left'}}>Invoice Date</Text></View>
                <View style={{width:wp(100)}}>
                 <Text style={{fontWeight:'bold',textAlign:'right'}}>Sales Amount</Text></View>
                 <View style={{width:wp(120)}}>
                 <Text style={{fontWeight:'bold',textAlign:'right'}}>Sales Amount</Text></View>
            </View>:null}
                </View>
    )
  }
  nodata=()=>{
    return(<View style={{justifyContent:'center',alignItems:'center',marginTop:hp(45)}}>
        {this.state.Nodata?  <Text>No Data Found</Text>:null}
     </View>
    )
 }
render(){
    return(
        <View style={styles.container}>
           <View style={styles.headerView}>
          <View style={styles.BackButtonContainer}>
           
              <Icon name="arrow-back" size={25} color={"#fff"} onPress={()=>{this.props.navigation.goBack()}} />
           
          </View>
          <View style={styles.TitleContainer}>
          {this.state.Nodata==false?<View>
               <TextInput placeholder="Search" style={{backgroundColor:'#fff',width:wp(250),height:hp(50)}} onChangeText={(text)=>{this.searchFilterFunction(text)}}    />
            </View>:<View style={{flex:0.6}}>
              <Text style={styles.TitleStyle}>i9 Sales Force</Text>
            </View>}
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
         <FlatList
         keyExtractor={(item, index) => index.toString()} 
         data={this.state.tableData}
         initialNumToRender={20}
         maxToRenderPerBatch={20}
         numColumns={1}
         ListEmptyComponent={this.nodata}
         ListHeaderComponent={this.headerList}
         renderItem={this.renderItem}
          />
         
      </View>
    )
}
}
const styles = StyleSheet.create({
    container: { flex: 1, },
    head: { height: 40, backgroundColor: '#f1f8ff' },
    text: { margin: 6 },
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