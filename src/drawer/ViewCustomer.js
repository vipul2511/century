import React, { Component } from 'react';
import {TextInput,View,Dimensions,TouchableOpacity,Text,ScrollView,StyleSheet,FlatList,BackHandler,Modal,ActivityIndicator} from 'react-native';
import firebase from '../utils/firebase';
import resp from 'rn-responsive-font';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Table, Row, Rows } from 'react-native-table-component';
import { wp, hp } from '../utils/heightWidthRatio';
import moment from 'moment';
let width=Dimensions.get('window').width;
export default class ViewCustomer extends Component{
    constructor(props){
        super(props);
        this.state={
            text:"",
            ReportData:[],
            tableHead: ['Head', 'Head2', 'Head3', 'Head4'],
              tableData: [],
              masterlist:'',
              totalCount:'',
              openModal:false,
              group:'',
              loading:false,
              orgId:'',
              token:'',
              noMoreLoad:true,
              time:'',
        }
        let onEndReached = false;
        this.backItems= this.backItems.bind(this);
    }
    searchFilterFunction = (text) => {
      // Check if searched text is not blank
      console.log('name',text);
      if (text) {
        this.onEndReached = true
        let combineArray=this.state.tableData;
        const newData = combineArray.filter(
          function (item) {
            const  itemData = item.name
              ? item.name.toUpperCase()
              : ''.toUpperCase(); 
              const itemStock=item.instockqty ? item.instockqty.toUpperCase()
              : ''.toUpperCase();
              const itemunit=item.pkgunit ? item.pkgunit.toUpperCase()
              : ''.toUpperCase();
            const itemRecord=item.reorderlevel?item.reorderlevel.toUpperCase()
            : ''.toUpperCase();
            const textData = text.toUpperCase();
            return (
              itemData.indexOf(textData) > -1 || 
              itemStock.indexOf(textData) >-1 ||
              itemunit.indexOf(textData) >-1  ||
              itemRecord.indexOf(textData) >-1
            )
        });
        this.setState({tableData:newData});
      } else {
      this.setState({tableData:this.state.masterlist});
      this.onEndReached = true
      }
    };
// data=()=>{
//   firebase.database().ref('Stock/').push({
//       StockName:this.state.text
//   }).then((data)=>{
//       console.log('data',data)
//   }).catch((err)=>{
//       console.log('error',err);
//   });
// }
componentWillUnmount(){
  BackHandler.removeEventListener('hardwareBackPressed',this.backItems)
 }
  backItems(){
    if (this.props.navigation.isFocused()) { 
      console.log('working')
      this.props.navigation.goBack();
      return true;
  } 
}
getDatafromFirebase=()=>{ 
  firebase.database().ref('CustomerMaster/data/').on('value',(snap) =>{
    let items =this.state.tableData;
    snap.forEach((child)=>{
      items.push({
        item_description:child.val().itemdescription,
        item_group:child.val().itemgroup,
        bookedqty:child.val().bookedqty,
        reorderlevel:child.val().reorderlevel,
        updatedate:child.val().updatedate,
        name:child.val().itemname,
        pkgunit:child.val().pkgunit,
        instockqty:child.val().instockqty,
        orgid:child.val().orgid
      });
    });
    console.log(items);
    this.setState({masterlist:items});
    this.setState({tableData:items})
    this.setState({loading:false});
    console.log('report',this.state.tableData.length);
    console.log('re loaded');
  });
}
componentDidMount(){
  console.log('props',JSON.stringify(this.props));
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
   firebase.database().ref('CustomerMaster/Totalcount').once('value',(snap)=>{
    this.setState({totalCount:snap.val()});
    console.log(snap.val())
  })
  firebase.database().ref('CustomerMaster/Time').once('value',(snap)=>{
    let mill=snap.val();
    let time=moment(Number(mill)).format('lll');
    this.setState({time:time});
    console.log('the time',time);
  })
  BackHandler.addEventListener('hardwareBackPressed',this.backItems);
  this.getDatafromFirebase()

}
storeDatainDB=(data,count,time)=>{
  firebase.database().ref('CustomerMaster/').set({data,Totalcount:count,Time:time}).then((data)=>{
    console.log('data',data);
    this.getDatafromFirebase()
 
}).catch((err)=>{
    console.log('error',err);
})
  }
dataFetch=()=>{
  this.setState({loading:true})
  var EditProfileUrl = `http://demo.3ptec.com/dms-demo/FetchLoginEntityMasterData?logintoken=${this.state.token}&sourcetype=AndroidSalesPersonApp&startIndex=0&packetSize=100&selEntityId=${this.state.orgId}&selEntityType=superstockist&reportDataSource=FetchEntityStockItems`
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
       console.log('length customer',responseData.stockItems.data.length);
       if(this.state.totalCount!==responseData.stockItems.data.length){
        this.storeDatainDB(responseData.stockItems.data,responseData.stockItems.totalCount,responseData.stockItems.serviceTimeMilliSec);
       }else{
         this.setState({loading:false,noMoreLoad:false})
         console.log('count is equal')
       }
        
      
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
pressData=(data)=>{
  this.props.navigation.navigate('ReportScreen',{dataItem:data.orgid})
}
setData=(groupData)=>{
  console.log('clicked the view')
  this.setState({group:groupData,openModal:true})
}
renderItem = ({ item,index }) => (
    <View key={index}>
     <TouchableOpacity style={{flexDirection:'row',height:'auto',}} onLongPress={()=>{this.setData(item)}}
      // onPress={()=>{this.pressData(item)}}
      >
     <View style={{width:150,alignSelf: 'stretch',flexDirection:'row'  }} >
    
     <Text style={{fontSize:13,marginLeft:10,flexWrap:'wrap',marginBottom:10}}>{item.name}</Text>
     </View>
     <View style={{  width:80,marginLeft:10, alignSelf: 'stretch',flexDirection:'row' }} >
     {item.instockqty.length>7?<Text style={{fontSize:13,marginLeft:10,flexWrap:'wrap',marginBottom:10}}>{item.instockqty.substring(0,7)+".."}</Text>:
    <Text style={{fontSize:13,marginLeft:10,flexWrap:'wrap',marginBottom:10}}>{item.instockqty}</Text>}
     </View>
     <View style={{width:100, alignSelf: 'stretch',flexDirection:'row' }} >
     {item.pkgunit.length>7?<Text style={{fontSize:13,marginLeft:10,flexWrap:'wrap',marginBottom:10}}>{item.pkgunit.substring(0,7)+".."}</Text>:
    <Text style={{fontSize:13,marginLeft:10,flexWrap:'wrap',marginBottom:10}}>{item.pkgunit}</Text>}
     </View>
     {/* <View style={{ width:150, alignSelf: 'stretch',flexDirection:'row'  }} >
    {item.item_description.length>10?<Text style={{fontSize:13,marginLeft:10,flexWrap:'wrap',marginBottom:10}}>{item.item_description.substring(0,10)+".."}</Text>:
    <Text style={{fontSize:13,marginLeft:10,flexWrap:'wrap',marginBottom:10}}>{item.item_description}</Text>}
     </View> */}
      <View style={{  width:100, alignSelf: 'stretch',flexDirection:'row',justifyContent:'center',alignItems:'center' }} >
     <Text style={{fontSize:13,marginLeft:10,marginBottom:10,flexWrap:'wrap',textAlign:'center'}}>{item.reorderlevel}</Text>
     </View>
     {/* <View style={{ width:150, alignSelf: 'stretch',flexDirection:'row' }} >
     <Text style={{fontSize:13,marginLeft:10,flexWrap:'wrap',marginBottom:10,}}>{item.item_group}</Text>
     </View>
     <View style={{  width:100, alignSelf: 'stretch',flexDirection:'row' }} >
     <Text style={{fontSize:13,marginLeft:10,marginBottom:10,flexWrap:'wrap'}}>{''}</Text>
     </View>
     <View style={{  width:100, alignSelf: 'stretch',flexDirection:'row' }} >
     <Text style={{fontSize:13,marginLeft:10,marginBottom:10,flexWrap:'wrap'}}>{''}</Text>
     </View>
     <View style={{  width:100, alignSelf: 'stretch',flexDirection:'row' }} >
     <Text style={{fontSize:13,marginLeft:10,marginBottom:10,flexWrap:'wrap'}}>{''}</Text>
     </View> */}
     </TouchableOpacity>
         <View style={{borderWidth:0.5,backgroundColor:'black'}}></View>
    </View>
  );
 ListHeader = () => {
    //View to set in Header
    return (
      <View style={{marginBottom:5,marginLeft:5,zIndex:2,backgroundColor:'#fff',}}>
                <View style={{flexDirection:'row'}}>
                <View style={{ width:150, alignSelf: 'stretch',flexWrap:'wrap' }} >
                <Text style={{fontWeight:'bold',}}>Name</Text>
                </View>
                <View style={{  width:80,marginLeft:10, alignSelf: 'stretch' }} >
                <Text style={{fontWeight:'bold',}}>Stock</Text>
                </View>
                <View style={{ width:100, alignSelf: 'stretch' }} >
                <Text style={{fontWeight:'bold',}}>UOM</Text>
                </View>
                <View style={{  width:100,  alignSelf: 'stretch',flexWrap:'wrap' }} >
                <Text style={{fontWeight:'bold',}}>Re-Order Level</Text>
                </View>
                {/* <View style={{width:150, alignSelf: 'stretch' }} >
                <Text style={{fontWeight:'bold',}}>Group</Text>
                </View>
                <View style={{ width:120, alignSelf: 'stretch' }} >
                <Text style={{fontWeight:'bold',}}>Order in hand</Text>
                </View>
                <View style={{ width:120, alignSelf: 'stretch' }} >
                <Text style={{fontWeight:'bold',}}>Buffer Level</Text>
                </View>
                <View style={{ width:100, alignSelf: 'stretch' }} >
                <Text style={{fontWeight:'bold',}}>Sync Date</Text>
                </View> */}
                </View>
            </View>
    );
  };
 
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
    return(
        <View style={styles.container}>
           <View style={styles.headerView}>
          <View style={styles.BackButtonContainer}>
           
              <Ionicons name="arrow-back"  size={25} color={"#fff"} onPress={()=>{this.props.navigation.navigate('DashBoardScreen')}} />
           
          </View>
          <View style={styles.TitleContainer}>
            <View
              >
             <TextInput placeholder="Search" style={{backgroundColor:'#fff',width:wp(300),height:hp(50)}} onChangeText={(text)=>{this.searchFilterFunction(text)}}    />
            </View>
          </View>
          {/* <TouchableOpacity
            style={styles.SearchContainer}
            onPress={() => {
              this.props.navigation.navigate('Login')
            }}>
               <Text style={styles.backButtonStyle}>Log Out</Text>
          </TouchableOpacity> */}
        </View>
        <View style={{flexDirection:'row',zIndex:2,backgroundColor:'#ffff'}}>
     
     <Text style={{fontSize:13}}>Last Refresh- {this.state.time}</Text>
     <Text style={{position:'absolute',right:5,fontWeight:'bold'}}>Total Count-{this.state.totalCount}</Text>
   </View>
     <ScrollView horizontal={true}>
            <View  >
         <FlatList
         keyExtractor={(item, index) => index.toString()} 
         data={this.state.tableData}
         initialNumToRender={20}
         stickyHeaderIndices={[0]}
         numColumns={1}
         maxToRenderPerBatch={20}
         renderItem={this.renderItem}
         onEndReachedThreshold={0.1}
         onMomentumScrollBegin = {() => {this.onEndReached = false;}}
         onEndReached = {() => {
          if (!this.onEndReached && this.state.noMoreLoad) {
            console.log('reached')
               this.dataFetch();   // on End reached
                this.onEndReached = true;
          }
        }
       }
         ListFooterComponent={this.BottomView}
         ListHeaderComponent={this.ListHeader}
          />
         </View>
         </ScrollView>
        
         <Modal animationType='slide'  transparent={true} onBackdropPress={() => this.setState({ openModal: false })}   visible={this.state.openModal} onRequestClose={()=>{this.setState({openModal:false})}} >
         <View style={{justifyContent:'center',alignItems:'center',flex:1}}>
          <View style={{width:350,height:450,backgroundColor:"#fff",elevation:15,borderRadius:15,}}>
            <TouchableOpacity style={{alignSelf:'flex-end'}} onPress={()=>{this.setState({openModal:false})}}><Entypo name="cross" size={25} style={{alignSelf:'flex-end',marginTop:10,marginRight:10}} /></TouchableOpacity>
            <Text style={{fontWeight:'bold',marginLeft:15,marginTop:8}}>Name</Text>
            <View style={{width:300,height:'auto',flexDirection:'row'}}>
            <Text style={{marginLeft:15,marginTop:8,marginBottom:15,flexWrap:'wrap'}}>{this.state.group.name}</Text>
            </View> 
            <Text style={{fontWeight:'bold',marginLeft:14,marginTop:8}}> Description </Text>
            <View style={{width:300,height:'auto',flexDirection:'row'}}>
            <Text style={{marginLeft:15,marginTop:8,marginBottom:15,flexWrap:'wrap'}}>{this.state.group.item_description}</Text>
            </View> 
            <Text style={{fontWeight:'bold',marginLeft:15,marginTop:8,}}>Group</Text>
            <Text style={{marginLeft:15,marginTop:8,marginBottom:15}}>{this.state.group.item_group}</Text>
            <Text style={{fontWeight:'bold',marginLeft:15,marginTop:8,}}> Order in hand</Text>
            <Text style={{marginLeft:20,marginTop:8,marginBottom:15}}>{this.state.group.bookedqty}</Text>
            <Text style={{fontWeight:'bold',marginLeft:15,marginTop:8}}> Update Date </Text>
            <Text style={{marginLeft:15,marginTop:8,}}>{moment(Number(this.state.group.updatedate)).format('DD/MM/YY')}</Text>
            <Text style={{marginLeft:15,marginTop:4,color:'#1976D2',fontSize:10}}>{"(DD/MM/YY)"}</Text>
          </View>
          </View>
         </Modal>
        
      </View>
    )
}
}
const styles = StyleSheet.create({
    container: { flex: 1,backgroundColor:'#fff' },
    // head: { height: 40, backgroundColor: '#f1f8ff' },
    text: { margin: 6 },

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
      // flex:0.2,
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
    footer: {
      padding: 10,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    },
    loadMoreBtn: {
      padding: 10,
      backgroundColor: '#800000',
      borderRadius: 4,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    btnText: {
      color: 'white',
      fontSize: 15,
      textAlign: 'center',
    },
  });