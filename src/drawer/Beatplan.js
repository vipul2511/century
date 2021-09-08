import React, { Component } from 'react';
import {TextInput,View,TouchableOpacity,Text,StyleSheet,FlatList, Alert,ScrollView} from 'react-native';
import resp from 'rn-responsive-font';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Picker} from '@react-native-picker/picker';
import { Table, TableWrapper, Row, Cell } from 'react-native-table-component';
import { CommonActions } from '@react-navigation/native';
import { hp, wp } from '../utils/heightWidthRatio';
import DatePicker from 'react-native-datepicker';
import moment from 'moment';
import {BASE_URL} from '../utils/BaseUrl';
export default class BeatPlan extends Component{
    constructor(props){
        super(props);
        this.state={
            text:"",
            ReportData:[],
            token:'',
            orgId:'',
            language: 'java',
            checkstartDate:'',
            username:'',
            zoneid:'',
            type:'',
            Nodata:false,
            startDates:false,
            startDate:'',
            endDate:false,
            startDateValue:'',
            endDateValue:'',
            tenantName:'',
            startmillsecond:'',
            endmillsecond:'',
            tableHead: ['Head', 'Head2'],
            // tableData: [
            //     [{name:'1'}, {name:'2'}],
            //     [{name:'5'}, {name:'j'}],
            //     [{name:'r'}, {name:'u'}],
            //     [{name:'w'}, {name:'t'}]
            //   ]
            tableData: [
               
            ],
        }
    }

componentDidMount(){
    AsyncStorage.getItem('@loginToken').then(succ=>{
        if(succ){
       this.setState({token:succ});
       this.setState({startDateValue:new Date(),endDateValue:new Date(),checkstartDate:moment().format('L')})
        }
      });
      AsyncStorage.getItem('@username').then(id=>{
        if(id){
         this.setState({username:JSON.stringify(id)});
         console.log('username',id)
        }
      });
      AsyncStorage.getItem('@zone_id').then(id=>{
        if(id){
         this.setState({zoneid:JSON.stringify(id)});
         console.log('zone id',id)
        }
      });
      AsyncStorage.getItem('@type').then(id=>{
        if(id){
         this.setState({type:JSON.stringify(id)});
         console.log('type',id)
        }
      });
      AsyncStorage.getItem('@orgid').then(id=>{
        if(id){
         this.setState({orgId:JSON.stringify(id)});
         console.log('org id',id)
        }
      });
      AsyncStorage.getItem('@tenantName').then(succ=>{
        if(succ){
          this.setState({tenantName:succ});
          this.millsecond();
        }
      });
   console.log('props in daily report',JSON.stringify(this.props))
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
dataFetchStockItem=(enddates)=>{
    let startdate=JSON.stringify(this.state.startdate);
    let enddate=JSON.stringify(enddates);
    console.log('start date',startdate,'end date',enddate);
  var EditProfileUrl = `${BASE_URL}/dms-demo/DmsCommonReport?logintoken=${this.state.token}&sourcetype=AndroidSalesPersonApp&selEntityType=${this.state.type}&reportDataSource=salesperson-beat-plan-fetch&reportInputFieldsData={"selEndDateNum" : ${enddate} , "timeoffset" : "330" , "selStartDateNum" :${startdate} ,"userLoginId":${this.state.username}}`
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
      if (responseData !== 'No Beat plan data found' ) {
        let objArr=responseData;
        this.setState({tableData:objArr});
        console.log('table ',this.state.tableData);
        // console.log(JSON.stringify(responseData));
      } else {
      this.setState({Nodata:true,tableData:[]})
      }
    }
    }else{
      this.createTwoButtonAlert()
    }
      console.log('contact list response object:', JSON.stringify(responseData))
    })
    .catch(error => {
      //  this.hideLoading();
      console.error('error coming',error)
    })
    .done()
}
_alertIndex(index) {
    Alert.alert(`This is row ${index + 1}`);
  }
  millsecond=()=>{
   let tomorrow= new Date().toLocaleDateString();
   let time=new Date(tomorrow).getTime();
    this.setState({startdate:JSON.stringify(time)},()=>{
        this.dataFetchStockItem(JSON.stringify(time));
    });
    console.log('today mill',time);
  }
renderItem = ({ item,index }) => (
    <View key={index}>
     <TouchableOpacity style={{flexDirection:'row',height:'auto',justifyContent:'center',alignItems:'center'}} >
     <View style={{width:wp(150),alignSelf:'center',flexDirection:'row',justifyContent:'flex-start',alignItems:'flex-start'}}>
     <Text style={{fontSize:15,marginLeft:15,flexWrap:'wrap',marginBottom:10,textAlign:'left',}}>{item.customername}</Text>
     </View>
     {/* <View style={{borderWidth:1,borderColor:'red'}}></View> */}
     <View style={{width:wp(100),alignSelf:'center',}}>
     <Text style={{fontSize:15,marginBottom:10,textAlign:'left'}}>{item.customertypename}</Text>
     </View>
     <View style={{width:wp(120),alignSelf:'flex-end',marginRight:wp(10)}}>
     <Text style={{fontSize:15,marginBottom:10,textAlign:'right',marginRight:wp(10)}}>{item.visitdate}</Text>
     </View>
     <View style={{width:wp(120),alignSelf:'flex-end',marginRight:wp(10)}}>
     <Text style={{fontSize:15,marginBottom:10,textAlign:'right',marginRight:wp(10)}}>{item.linvdt}</Text>
     </View>
     {/* <Text style={{fontSize:13,marginLeft:20}}>{item.contact}</Text> */}
     {/* <Text style={{fontSize:13,marginLeft:20,}}>{item.city}</Text> */}
    
     </TouchableOpacity>
     <View style={{borderWidth:0.5,backgroundColor:'black'}}></View>
    </View>
  );
  ListHeader = () => {
    //View to set in Header
    return (
        <View style={{marginBottom:5,marginLeft:5,zIndex:2,backgroundColor:'#fff',}}>
       {this.state.Nodata==false?<View style={{flexDirection:'row'}}>
        <View style={{ width:wp(150), alignSelf: 'center' }} >
        <Text style={{fontWeight:'bold',}}>Customer Name</Text>
        </View>
        <View style={{  width:wp(90), alignSelf: 'center' }} >
        <Text style={{fontWeight:'bold',}}>Customer Type</Text>
        </View>
        <View style={{ width:wp(120), alignSelf: 'flex-end',marginRight:wp(10) }} >
        <Text style={{fontWeight:'bold',textAlign:'right',marginRight:wp(10)}}>Visit Date </Text>
        </View>
        <View style={{ width:wp(120), alignSelf: 'flex-end',marginRight:wp(10) }} >
        <Text style={{fontWeight:'bold',textAlign:'right',marginRight:wp(10)}}> Last Invoice Date </Text>
        </View>
        </View>:null}
    </View>
    );
  };
  nodata=()=>{
     return(<View style={{marginTop:hp(45),marginLeft:wp(120)}}>
         {this.state.Nodata?
         <View>
         <Text>No Beat plan data found</Text>
         </View>
         :null}
      </View>
     )
  }
  searchfun=()=>{
      if(this.state.startmillsecond!='' && this.state.endmillsecond!=''){
          this.setState({startDate:JSON.stringify(this.state.startmillsecond)});
          this.dataFetchStockItem(JSON.stringify(this.state.endmillsecond))
      }else{
        alert('Please select the date');
      }
  }
render(){
    const state = this.state;
    const element = (data, index) => (
      <TouchableOpacity onPress={() => this._alertIndex(index)}>
        <View style={styles.btn}>
          <Text style={styles.btnText}>button</Text>
        </View>
      </TouchableOpacity>
    );
    return(
        <View style={{flex:1,backgroundColor:'#fff',}}>
           <View style={styles.headerView}>
          <View style={styles.BackButtonContainer}>
           
          <Ionicons name="arrow-back"  size={25} color={"#fff"} onPress={()=>{this.props.navigation.goBack()}} />
           
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
             
              // this.props.navigation.navigate('Login')
            }}>
             
          </TouchableOpacity>
        </View>
        <View style={{justifyContent:'center',alignItems:'center',marginLeft:35,marginTop:35,marginRight:35,marginBottom:25}}>
        <View style={{width:wp(300),justifyContent:"center",alignItems:'center',borderWidth:1,borderColor:'gray',backgroundColor:'#F7F7F7'}}>
        <Picker
  selectedValue={this.state.language}
  style={{height: 50, width: 300,}}
  onValueChange={(itemValue, itemIndex) =>{
    let tomorrow;
      if(itemValue=="Tomorrow"){
         tomorrow = new Date();
    tomorrow.setDate(new Date().getDate()+1);
     tomorrow.toLocaleDateString();
    let tomorrowData=JSON.stringify(tomorrow.getTime());
    console.log('tomorrow',tomorrowData);  
    this.dataFetchStockItem(tomorrowData);
      }else if(itemValue=="Today"){
        let tomorrow= new Date().toLocaleDateString();
        let time=new Date(tomorrow).getTime();
             this.dataFetchStockItem(JSON.stringify(time));
      }
      else if(itemValue=="Next 3 days"){
        tomorrow = new Date();
        tomorrow.setDate(new Date().getDate()+3);
         tomorrow.toLocaleDateString();
        let tomorrowData=tomorrow.getTime();
        let time=JSON.stringify(tomorrowData)
        this.dataFetchStockItem(time);
        console.log('tomorrow',time);
      }else if(itemValue=="Next 5 days"){
        tomorrow = new Date();
        tomorrow.setDate(new Date().getDate()+5);
         tomorrow.toLocaleDateString();
         let tomorrowData=tomorrow.getTime();
         let time=JSON.stringify(tomorrowData)
         this.dataFetchStockItem(time);
         console.log('tomorrow',time);
      }else if(itemValue=="Next week"){
        tomorrow = new Date();
        tomorrow.setDate(new Date().getDate()+7);
         tomorrow.toLocaleDateString();
         let tomorrowData=tomorrow.getTime();
         let time=JSON.stringify(tomorrowData)
         this.dataFetchStockItem(time);
         console.log('tomorrow',time);
      }
      else if(itemValue=="Next fort night"){
        tomorrow = new Date();
        tomorrow.setDate(new Date().getDate()+15);
         tomorrow.toLocaleDateString();
         let tomorrowData=tomorrow.getTime();
         let time=JSON.stringify(tomorrowData)
         this.dataFetchStockItem(time);
         console.log('tomorrow',time);
      } else if(itemValue=="Next month"){
        let d = new Date();
        d.setMonth(d.getMonth()+1);
        console.log(d.toLocaleDateString());
        let timebeforemonth = new Date(d.toLocaleDateString()).getTime(); 
        let timebefore3month=JSON.stringify(timebeforemonth);
        console.log('item value',timebefore3month);
        this.dataFetchStockItem(timebefore3month)
      }else if(itemValue=="Test Data"){
          this.setState({startdate:1605551400000},()=>{
            this.dataFetchStockItem(1613759400000);
          });
        
      }
    //   console.log('item value',itemValue);
    this.setState({language: itemValue})
  }
    
  }>
  <Picker.Item label="Today" value="Today" />
  <Picker.Item label="Tomorrow " value="Tomorrow" />
  <Picker.Item label="Next 3 days " value="Next 3 days" />
  <Picker.Item label="Next 5 days" value="Next 5 days" />
  <Picker.Item label="Next week " value="Next week" />
  <Picker.Item label="Next fort night " value="Next fort night" />
  <Picker.Item label="Next month " value="Next month" />
  <Picker.Item label="User defined date from and to date " value="User defined date from and to date" />

</Picker>
        </View>
        </View>
        {/* <View style={styles.container}>
          <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
          <Row data={state.tableHead} style={styles.head} textStyle={styles.text}/>
          {
            state.tableData.map((rowData, index) => (
              <TableWrapper key={index} style={styles.row}>
                {
                  rowData.map((cellData, cellIndex) => (
                    <Cell key={cellIndex} data={cellData.name} textStyle={styles.text}/>
                  ))
                }
              </TableWrapper>
            ))
          }
        </Table>
      </View> */}
     {this.state.language=="User defined date from and to date"?<View style={{flexDirection:'row'}}>
      <TouchableOpacity onPress={()=>{this.setState({startDates:true})}} style={{marginBottom:hp(10),height:hp(35),justifyContent:'center',alignItems:'center',marginLeft:wp(10),borderColor:'black',borderWidth:1,width:wp(120)}}>
          <Text>Choose Start Date</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={()=>{this.setState({endDate:true})}} style={{marginBottom:hp(10),height:hp(35),justifyContent:'center',alignItems:'center',marginLeft:wp(10),borderColor:'black',borderWidth:1,width:wp(120)}}>
          <Text>Choose End Date</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={()=>{this.searchfun()}} style={{marginBottom:hp(10),height:hp(35),justifyContent:'center',alignItems:'center',marginLeft:wp(10),borderColor:'black',backgroundColor:'#1976D2',borderWidth:1,width:wp(80)}}>
          <Text style={{color:'#fff',fontSize:15,fontWeight:'bold'}}>Search</Text>
      </TouchableOpacity>
      </View>:null }
      <View style={{flexDirection:'row'}}>
        {this.state.startDates? <View style={{marginLeft:wp(10),marginBottom:hp(10),}}>
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
         {this.state.endDate? <View>
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
         <ScrollView horizontal={true}>
       <FlatList
         keyExtractor={(item, index) => index.toString()} 
         style={{flex:0.2}}
         data={this.state.tableData}
         initialNumToRender={20}
         maxToRenderPerBatch={20}
         ListHeaderComponent={this.ListHeader}
         ListEmptyComponent={this.nodata}
        //  onEndReachedThreshold={0.1}
        //  onMomentumScrollBegin = {() => {this.onEndReached = false;}}
         numColumns={1}
         renderItem={this.renderItem}
        
          />
          </ScrollView>  
        </View>
    )
}
}
const styles = StyleSheet.create({
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
      container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  head: { height: 40, backgroundColor: '#f1f8ff' },
  text: { margin: 6 },
      row: { flexDirection: 'row', },
      btn: { width: 58, height: 18, backgroundColor: '#78B7BB',  borderRadius: 2 },
      btnText: { textAlign: 'center', color: '#fff' }
});