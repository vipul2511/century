import React, { Component } from 'react';
import {TextInput,View,TouchableOpacity,Text,ScrollView,StyleSheet,FlatList, Dimensions,BackHandler,ActivityIndicator} from 'react-native';
import firebase from '../../../utils/firebase';
import { Table, Row, Rows } from 'react-native-table-component';
import resp from 'rn-responsive-font';
import Icon from 'react-native-vector-icons/Ionicons'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { wp, hp } from '../../../utils/heightWidthRatio';
let width=Dimensions.get('window').width;
export default class PieChartData extends Component{
    constructor(props){
        super(props);
        this.state={
            text:"",
            ReportData:[],
            tableHead: ['Head', 'Head2', 'Head3', 'Head4'],
              tableData: [
                  {number:0,date:'0',amount:'0'},
               
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
// getCustomerData=()=>{
//     firebase.database().ref('StockMasterTable/Totalcount').once('value',(snap)=>{
//         this.setState({totalCount:snap.val()});
//         console.log(snap.val())
//       })
//   firebase.database().ref('StockMasterTable/data/').on('value',(snap) =>{
//     let items =this.state.tableData;
//     snap.forEach((child)=>{
//       items.push({
//         city:child.val().city,
//         type:child.val().orgtypename,
//         name:child.val().name,
//         orggroup:child.val().orggroup,
//         orgid:child.val().orgid,
//         loginid:child.val().loginid,
//       });
//     });
//     console.log(items);
//     this.setState({masterlist:items});
//     this.setState({tableData:items});
//     this.setState({loading:false});
//     console.log('report',this.state.tableData.length)
//   });
// }
componentDidMount(){
    console.log('daat',this.props.route.params.data);
   AsyncStorage.getItem('@loginToken').then(succ=>{
     if(succ){
    this.setState({token:succ});
    this.setState({tableData:this.props.route.params.data,masterlist:this.props.route.params.data})
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
          const itemData = item.itemdescription
            ? item.itemdescription.toUpperCase()
            : ''.toUpperCase();
            const itemgroup=item.pkgunit
              ?item.pkgunit.toUpperCase()
                          :''.toUpperCase();
                          const itemUnit=item.billedqtypkgunits
                          ?item.billedqtypkgunits.toUpperCase()
                                      :''.toUpperCase();
                                      const billedqty=item.billqtyamount
                          ?item.billqtyamount.toUpperCase()
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
renderItem = ({ item,index }) => (
    <View key={index}>
     <TouchableOpacity style={{flexDirection:'row',height:'auto',}} >
       <View style={{width:wp(120),alignSelf:'flex-start',flexDirection:'row'}}>
     <Text style={{fontSize:13,marginLeft:5,flexWrap:'wrap',marginBottom:10,textAlign:'left'}}>{item.itemdescription}</Text>
     </View>
     <View style={{width:wp(60),alignSelf:'center',flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
     <Text style={{fontSize:13,marginLeft:15,flexWrap:'wrap',marginBottom:10,textAlign:'center'}}>{item.pkgunit}</Text>
     </View>
     <View style={{width:wp(60),alignSelf:'flex-end',flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
     <Text style={{fontSize:13,marginLeft:15,flexWrap:'wrap',marginBottom:10,textAlign:'center'}}>{item.billedqtypkgunits}</Text>
     </View>
     <View style={{width:wp(100),alignSelf:'flex-end',flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
     <Text style={{fontSize:13,marginLeft:15,flexWrap:'wrap',marginBottom:10,textAlign:'center'}}>{item.billqtyamount}</Text>
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
           
              <Icon name="arrow-back" size={25} color={"#fff"} onPress={()=>{this.props.navigation.goBack()}} />
           
          </View>
          <View style={styles.TitleContainer}>
            <View
              >
               <TextInput placeholder="Search" style={{backgroundColor:'#fff',width:wp(250),height:hp(50)}} onChangeText={(text)=>{this.searchFilterFunction(text)}}    />
              {/* <TextInput placeholder="Search" style={{backgroundColor:'#fff',width:wp(300),height:hp(50)}} onChangeText={(text)=>{this.searchFilterFunction(text)}}    /> */}
            </View>
          </View>
          <TouchableOpacity
            style={styles.SearchContainer}
            onPress={()=>{this.props.navigation.navigate('DashBoardScreen')}}
            >
               <Icon name="home"  size={25} color={"#fff"} onPress={()=>{this.props.navigation.navigate('DashBoardScreen')}} />
          </TouchableOpacity>
        </View>
        <View>
        <View style={{justifyContent:'center',alignItems:'center'}}>
     
          <Text style={{fontSize:15,fontWeight:'bold'}}>{this.props.route.params.name}</Text>
          
      
        </View>
        </View>
            <View style={{marginTop:8,marginBottom:5,marginLeft:5,}}>
                <View style={{flexDirection:'row',}}>
                <View style={{width:wp(120),alignSelf:'flex-start'}}>
                <Text style={{fontWeight:'bold',textAlign:'left'}}>Item Description</Text></View>
                <View style={{width:wp(60)}}>
                <Text style={{fontWeight:'bold',textAlign:'center'}}>Unit</Text></View>
                <View style={{width:wp(60)}}>
                 <Text style={{fontWeight:'bold',textAlign:'center'}}>Quantity</Text></View>
                 <View style={{width:wp(100)}}>
                 <Text style={{fontWeight:'bold',textAlign:'center'}}>Amount</Text></View>
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