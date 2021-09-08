import React, { Component } from 'react';
import {TextInput,View,TouchableOpacity,Text,StyleSheet,FlatList, Alert} from 'react-native';
import resp from 'rn-responsive-font';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Picker} from '@react-native-picker/picker';
import { Table, TableWrapper, Row, Cell } from 'react-native-table-component';
import { CommonActions } from '@react-navigation/native';
import { wp } from '../utils/heightWidthRatio';
import {BASE_URL} from '../utils/BaseUrl';
export default class DailyRoute extends Component{
    constructor(props){
        super(props);
        this.state={
            text:"",
            ReportData:[],
            token:'',
            orgId:'',
            language: 'java',
            tenantName:'',
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
      //  this.dataFetchStockItem();
        }
      });
      AsyncStorage.getItem('@orgid').then(id=>{
        if(id){
         this.setState({orgId:id});
         console.log('org id',id)
        }
      });
      AsyncStorage.getItem('@tenantName').then(succ=>{
        if(succ){
          this.setState({tenantName:succ});
          this.dataFetchStockItem();
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
dataFetchStockItem=()=>{
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
      if(responseData!=="Invalid Session"){
        if(responseData!=="No Data Found"){
      if (responseData !== 'Error - Invalid username / password' ) {
        let objArr=this.state.tableData;
        for (let index = 0; index < 6; index++) {
           objArr.push({
          date: responseData.customerDetails.data[index].name,
          number:index,
          amount:index+14
          }); 
        }
        this.setState({tableData:objArr});
        console.log('table ',this.state.tableData);
        // console.log(JSON.stringify(responseData));
      } else {
       alert(responseData);
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
 
renderItem = ({ item,index }) => (
    <View key={index}>
     <TouchableOpacity style={{flexDirection:'row',height:'auto',justifyContent:'center',alignItems:'center'}} >
     <View style={{width:wp(150),alignSelf:'center',flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
     <Text style={{fontSize:15,marginLeft:15,flexWrap:'wrap',marginBottom:10,textAlign:'center',color:item.number==1?'green':item.number==2?'yellow':item.number==3?'red':'black'}}>{item.date}</Text>
     </View>
     {/* <View style={{borderWidth:1,borderColor:'red'}}></View> */}
     <View style={{width:wp(150),alignSelf:'flex-end',flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
     <Text style={{fontSize:15,marginLeft:15,flexWrap:'wrap',marginBottom:10,textAlign:'center'}}>{item.amount}</Text>
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
      <View style={{marginBottom:5,marginLeft:5,zIndex:2,backgroundColor:'#fff',justifyContent:'center',alignItems:'center'}}>
                <View style={{flexDirection:'row'}}>
                <View style={{width:wp(150),alignSelf:'center',flexDirection:'row',justifyContent:'center',alignItems:'center'}} >
                <Text style={{fontWeight:'bold',fontSize:16,marginLeft:15,flexWrap:'wrap',marginBottom:10,textAlign:'center'}}>Customer Name</Text>
                </View>
                <View style={{  width:wp(150),alignSelf:'flex-end',flexDirection:'row',justifyContent:'center',alignItems:'center' }} >
                <Text style={{fontWeight:'bold',fontSize:16,marginLeft:15,flexWrap:'wrap',marginBottom:10,textAlign:'center',color:'red'}}>Last Order with days elasped</Text>
                </View>
                </View>
            </View>
    );
  };
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
  onValueChange={(itemValue, itemIndex) =>
    this.setState({language: itemValue})
  }>
  <Picker.Item label="Monday" value="Monday" />
  <Picker.Item label="Tuesday" value="Tuesday" />
  <Picker.Item label="Wednesday" value="Wednesday" />
  <Picker.Item label="Thursday" value="Thursday" />
  <Picker.Item label="Friday " value="Friday " />
  <Picker.Item label="Saturday" value="Saturday" />
  <Picker.Item label="Sunday" value="Sunday" />
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
      <View style={{flexDirection:'row',margin:10,justifyContent:'center',alignItems:'center'}}>
          <Text style={{padding:15,fontSize:15,color:'red',fontWeight:'bold'}}>Not visisted</Text>
          <Text style={{padding:15,fontSize:15,color:'yellow',fontWeight:'bold'}}>Not Productive</Text>
          <Text style={{padding:15,fontSize:15,color:'green',fontWeight:'bold'}}>Productive</Text>
      </View>
       <FlatList
         keyExtractor={(item, index) => index.toString()} 
         style={{flex:0.2}}
         data={this.state.tableData}
         initialNumToRender={20}
         maxToRenderPerBatch={20}
         ListHeaderComponent={this.ListHeader}
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