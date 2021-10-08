import React, { Component } from 'react';
import { TextInput, View, Dimensions,Animated, TouchableOpacity,UIManager, LayoutAnimation,Text, ScrollView, StyleSheet, FlatList, BackHandler, Modal, ActivityIndicator } from 'react-native';
import firebase from '../utils/firebase';
import resp from 'rn-responsive-font';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import { CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Table, Row, Rows } from 'react-native-table-component';
import { Picker } from '@react-native-picker/picker';
import { wp, hp } from '../utils/heightWidthRatio';
import moment from 'moment';
import Spinner from 'react-native-loading-spinner-overlay';
import {BASE_URL} from '../utils/BaseUrl';
let width = Dimensions.get('window').width;
import Database from '../utils/Database';
const db = new Database();
export default class ViewCustomer extends Component {
  constructor(props) {
    super(props);
    this.getDatafromFirebase = this.getDatafromFirebase.bind(this);
    this.state = {
      text: "",
      ReportData: [],
      tableHead: ['Head', 'Head2', 'Head3', 'Head4'],
      tableData: [],
      masterlist: '',
      totalCount: '',
      openModal: false,
      group: '',
      loading: false,
      orgId: '',
      token: '',
      noMoreLoad: true,
      time: '',
      data: '',
      spinner:false,
      openModalPicker:false,
      pickerdata:'',
      itemData:'',
      indexNum:'',
      stockvalue:'',
      selectedValueItem:'',
      fromApi:false,
      key:0,
      offset:0,
      searchText:'',
      NoDataShow:false,
      showCustomerloader:false,
      syncingText:'Syncing Please wait....',
      callingName:'',
      progressStatus: 0,
    }

    let onEndReached = false;
    this.backItems = this.backItems.bind(this);
  }
  shouldComponentUpdate(nextProps, nextState) {
    if(this.state.openModalPicker !== nextState.openModalPicker){
     this.setState({ openModalPicker: nextState.openModalPicker})
     return false;
    } else return true;
  }
  searchFilterFunction = (event) => {
    console.log('event',event.nativeEvent.text);
    let text=event.nativeEvent.text;
    if (text) {
      // this.showLoading();
      db.searchInStockTable(text).then(succ=>{
        let NoData=false;
        if(succ.length==0) NoData=true
        this.setState({ tableData: succ,noMoreLoad:false,NoDataShow:NoData});
      }).catch(err=>{
      })
    } else {
      this.setState({ tableData: this.state.masterlist,noMoreLoad:true });
      this.onEndReached = true
    }
  };
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPressed', this.backItems)
  }
  backItems() {
    if (this.props.navigation.isFocused()) {
      this.props.navigation.goBack();
      return true;
    }
  }
  nextDataFirebase=()=>{
    this.setState({ loading: true })
    db.retrieveStock(this.state.offset).then(table=>{
      let newArr = [];
      let indexValue = 0;
      let samename = []
      let nox = '';
      table.map((items, index) => { // here index is the iterator
        if (!newArr.some((item, index) => item.data.name == items.name)) {
          newArr.push({ data: items });
        } else {
          samename.push(items);
        }
      });
      samename.map((item, index) => {
        newArr.map((items, indexs) => {
          if (samename[index].name == newArr[indexs].data.name && samename[index].pkgunit !== newArr[indexs].data.pkgunit) {
            newArr[indexs].data.newValue = item.pkgunit;
            newArr[indexs].wholeItem = item;
          }
        })
      })
      let nextitemArr=this.state.tableData;
     let newArrayItem= nextitemArr.concat(newArr);
      console.log('lenght',newArrayItem.length);
      if(newArrayItem.length==this.state.totalCount){
       this.setState({noMoreLoad:false}) 
       console.log('lenght')
      }
      let offsetValue=this.state.offset+800;
      this.setState({ tableData: newArrayItem, masterlist: newArrayItem,loading: false,offset:offsetValue });
        });
  }
  getDatafromFirebase = async() => {
    let bar = new Promise((resolve, reject) => {
      {!this.state.fromApi?this.showLoading():null}
    db.retrieveStockTime().then(succ=>{
      let millTime=succ[0].time;
      let count=succ[0].count;
      let time = moment(Number(millTime)).format('lll');
       this.setState({time:time,totalCount:count})
     console.log('time count',succ);
    })
      let items;
      db.retrieveStock(this.state.offset).then(table=>{
        let NoData=false;
        if(table.length==0) NoData=true
      let newArr = [];
      let indexValue = 0;
      let samename = []
      let nox = '';
      table.map((items, index) => { // here index is the iterator
        if (!newArr.some((item, index) => item.data.name == items.name)) {
          newArr.push({ data: items });
        } else {
          samename.push(items);
        }
      });
      samename.map((item, index) => {
        newArr.map((items, indexs) => {
          if (samename[index].name == newArr[indexs].data.name && samename[index].pkgunit !== newArr[indexs].data.pkgunit) {
            newArr[indexs].data.newValue = item.pkgunit;
            newArr[indexs].wholeItem = item;
          }
        })
      })
      // console.log('new arr', JSON.stringify(newArr));
      let offsetValue=this.state.offset+800;
      
      this.setState({ tableData: newArr, masterlist: newArr,offset:offsetValue,},()=>{
        resolve();
      });
    });
  });
  bar.then((suc) => {
    this.setState({progressStatus:parseInt(100)});
    if(this.state.progressStatus==100) this.setState({showCustomerloader:false,});
    this.hideLoading();
});
bar.catch((error)=>{
  this.setState({showCustomerloader:false,})
this.hideLoading()
})
  }
  componentDidMount() {
    AsyncStorage.getItem('@orgid').then(id => {
      if (id) {
        this.setState({ orgId: id });
      }
    })
    AsyncStorage.getItem('@loginToken').then(succ => {
      if (succ) {
        this.setState({ token: succ });
      }
    })
    BackHandler.addEventListener('hardwareBackPressed', this.backItems);
    this.getDatafromFirebase()

  }
  storeDatainDB =(data, count, time) => {
    firebase.database().ref('CustomerMaster/').set({ data, Totalcount: count, Time: time }).then((data) => {
      this.setState({loading: false,},()=>{
        this.getDatafromFirebase();
      });
    }).catch((err) => {
    })
  }
  showLoading() {
    this.setState({ spinner: true })
  }
  hideLoading() {
    this.setState({ spinner: false })
  }
  dataFetch = () => {
    this.setState({ progressStatus: parseInt(0),offset:0,callingName:'Syncing Item Master Data',showCustomerloader:true })
    var EditProfileUrl = `${BASE_URL}/dms-demo/FetchLoginEntityMasterData?logintoken=${this.state.token}&sourcetype=AndroidSalesPersonApp&startIndex=0&packetSize=1000&selEntityId=${this.state.orgId}&selEntityType=superstockist&reportDataSource=FetchEntityStockItems`
    // console.log('Add product Url:' + EditProfileUrl)
    fetch(EditProfileUrl, {
      method: 'Post',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(responseData => {
        if (responseData !== 'Error - Invalid username / password') {
          console.log('length customer', responseData.stockItems.data.length);
          this.setState({progressStatus: parseInt(50)}); 
        
            db.insertDataStock(responseData.stockItems.data).then((data)=>{
              this.setState({progressStatus: parseInt(70),fromApi:true,syncingText:`Seems like it's taking more than usual time...Please wait`},()=>{
              db.insertDataTimeStock(responseData.stockItems.totalCount,responseData.stockItems.serviceTimeMilliSec).then(succ=>{
                this.getDatafromFirebase();
                // this.setState({progressStatus:parseInt(100)});
               
              });
            });
            });
            // this.storeDatainDB(responseData.stockItems.data, responseData.stockItems.totalCount, responseData.stockItems.serviceTimeMilliSec);


        } else {
          // console.log(responseData);
        }
        // console.log('contact list response object:', JSON.stringify(responseData))
      })
      .catch(error => {
        //  this.hideLoading();
        console.error('error coming', error)
      })
      .done()
  }
  pressData = (data) => {
    this.props.navigation.navigate('ReportScreen', { dataItem: data.orgid })
  }
  setData = (groupData) => {
    // console.log('clicked the view')
    this.setState({ group: groupData, openModal: true })
  }
  renderItem = ({ item, index }) => {
    let objItem
    if(item.data) objItem = item.data;
    else objItem=item;

    return (
      <View key={index}>
         <TouchableOpacity style={{ flexDirection: 'row', height: 'auto', }} onLongPress={() => { this.setData(objItem) }}
        >
          <View style={{ width: 150, alignSelf: 'stretch', flexDirection: 'row' }} >

            <Text style={{ fontSize: 13, marginLeft: 10, flexWrap: 'wrap', marginBottom: 10 }}>{objItem.name}</Text>
          </View>
          <View style={{ width: 80, marginLeft: 10, alignSelf: 'stretch', flexDirection: 'row' }} >
            {/* <Text style={{ fontSize: 13, marginLeft: 10, flexWrap: 'wrap', marginBottom: 10 }}>{objItem.instockqty.substring(0, 7) + ".."}</Text> : */}
              <Text style={{ fontSize: 13, marginLeft: 10, flexWrap: 'wrap', marginBottom: 10 }}>{objItem.instockqty}</Text>
          </View>
          <TouchableOpacity style={{ width: 90, justifyContent:'flex-start',alignItems:'flex-start', flexDirection: 'row' }} onPress={()=>{this.setState({pickerdata:objItem,openModalPicker:true,itemData:item,indexNum:index})}} >
            {objItem.newValue && objItem.newValue != "" ?
            <View style={{flexDirection:'row'}}>
              <Text style={{ fontSize: 13, marginLeft: 10, flexWrap: 'wrap', marginBottom: 10 }}>{objItem.pkgunit}</Text>
              <View style={{marginLeft:8}}>
              <Ionicons name="chevron-down" size={14} style={{marginTop:5}}  />
              </View>
              </View>:<Text style={{ fontSize: 13, marginLeft: 10, flexWrap: 'wrap', marginBottom: 10 }}>{objItem.pkgunit}</Text>
  }
          </TouchableOpacity>
          <View style={{ width: 100, alignSelf: 'stretch', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }} >
            <Text style={{ fontSize: 13, marginLeft: 10, marginBottom: 10, flexWrap: 'wrap', textAlign: 'center' }}>{objItem.reorderlevel}</Text>
          </View>
        </TouchableOpacity>
        <View style={{ borderWidth: 0.5, backgroundColor: 'black' }}></View> 
      </View>
    );
  }
  ListHeader = () => {
    //View to set in Header
    return (
      <View style={{ marginBottom: 5, marginLeft: 5, zIndex: 2, backgroundColor: '#fff', }}>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ width: 150, alignSelf: 'stretch', flexWrap: 'wrap' }} >
            <Text style={{ fontWeight: 'bold', }}>Name</Text>
          </View>
          <View style={{ width: 80, marginLeft: 10, alignSelf: 'stretch' }} >
            <Text style={{ fontWeight: 'bold', }}>Stock</Text>
          </View>
          <View style={{ width: 90, justifyContent:'flex-start',alignItems:'flex-start' }} >
            <Text style={{ fontWeight: 'bold',marginLeft:5}}>UOM</Text>
          </View>
          <View style={{ width: 100, justifyContent:'flex-start',alignItems:'flex-start',flexWrap: 'wrap' }} >
            <Text style={{ fontWeight: 'bold',textAlign:'left' }}>Re-Order Level</Text>
          </View>
        </View>
      </View>
    );
  };

  BottomView = () => {
    return (

      <View style={{ alignSelf: 'flex-start' }}>
        {
          (this.state.loading)
            ?

            <ActivityIndicator size="large" color="#1976D2" style={{ marginLeft: width / 2 - 50 }} />

            :
            null
        }

      </View>


    )
  }
  Nodata=()=>{
    return(
      <View style={{justifyContent:'center',alignItems:'center',marginTop:50}}>
       {this.state.NoDataShow?<Text style={{fontWeight:'bold'}}>
          No Data Found
        </Text>:null}
      </View>
    )
  }
  searchText=(text)=>{
    if(text){
      this.setState({searchText:text}) 
    }else{
      this.searchFilterFunction(text)
    }
  }
  render() {
    let itemValueDisp;
    return (
      <View style={styles.container}>
        <View style={styles.headerView}>
          <View style={styles.BackButtonContainer}>
            <Ionicons name="arrow-back" size={25} color={"#fff"} onPress={() => { this.props.navigation.navigate('DashBoardScreen') }} />
          </View>
          <View style={styles.TitleContainer}>
            <View>
              <TextInput placeholder="Search"  style={{ backgroundColor: '#fff', width: wp(250), height: hp(50) }} onChange={this.searchFilterFunction.bind(this)} />
            </View>
          </View>
          <TouchableOpacity
            style={styles.SearchContainer}
            onPress={() => {
              this.dataFetch()
              // this.searchFilterFunction(this.state.searchText)
            }}>
            <Ionicons name="sync" size={25} color="#fff" style={{ marginLeft: 15 }} onPress={()=>{this.dataFetch()}}  />
          </TouchableOpacity>
        </View>
        <Spinner
          visible={this.state.spinner}
          color='#1976D2'
        />
        {this.state.showCustomerloader?<View style={{flex:1}}>
        <View style={{justifyContent:'center',alignItems:'center',marginTop:190}}>
         <Text style={styles.label}>  
                  {this.state.callingName} 
            </Text> 
            </View>
      <View style={styles.containerAnimation}>  
            <Animated.View  
                style={[  
                    styles.inner,{width: this.state.progressStatus +"%"},  
                ]}  
            />   
      </View>  
      <Animated.Text style={styles.label}>  
                  {this.state.syncingText} {this.state.progressStatus }%  
            </Animated.Text>  
      </View>:
      <>
        <View style={{ flexDirection: 'row', zIndex: 2, backgroundColor: '#ffff' }}>

          <Text style={{ fontSize: 13 }}>Last Refresh- {this.state.time}</Text>
          <Text style={{ position: 'absolute', right: 5, fontWeight: 'bold' }}>Total Count-{this.state.totalCount}</Text>
        </View>
        <ScrollView horizontal={true}>
          <View  >
            {/* <TouchableOpacity onPress={this.nextDataFirebase}>
              <Text>Hello</Text>
            </TouchableOpacity> */}
            <FlatList
              keyExtractor={(item, index) => index.toString()}
              data={this.state.tableData}
              initialNumToRender={200}
              stickyHeaderIndices={[0]}
              numColumns={1}
              maxToRenderPerBatch={60}
              renderItem={this.renderItem}
              onEndReachedThreshold={0.1}
              ListEmptyComponent={this.Nodata}
              onMomentumScrollBegin={() => { this.onEndReached = false; }}
              onEndReached={() => {
                if (!this.onEndReached && this.state.noMoreLoad) {
                  console.log('reached')
                  this.nextDataFirebase();   // on End reached
                  this.onEndReached = true;
                }
              }
              }
              ListFooterComponent={this.BottomView}
              ListHeaderComponent={this.ListHeader}
            />
          </View>
        </ScrollView>

        <Modal animationType='slide' transparent={true} onBackdropPress={() => this.setState({ openModal: false })} visible={this.state.openModal} onRequestClose={() => { this.setState({ openModal: false }) }} >
          <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
            <View style={{ width: 350, height: 450, backgroundColor: "#fff", elevation: 15, borderRadius: 15, }}>
              <TouchableOpacity style={{ alignSelf: 'flex-end' }} onPress={() => { this.setState({ openModal: false }) }}><Entypo name="cross" size={25} style={{ alignSelf: 'flex-end', marginTop: 10, marginRight: 10 }} /></TouchableOpacity>
              <Text style={{ fontWeight: 'bold', marginLeft: 15, marginTop: 8 }}>Name</Text>
              <View style={{ width: 300, height: 'auto', flexDirection: 'row' }}>
                <Text style={{ marginLeft: 15, marginTop: 8, marginBottom: 15, flexWrap: 'wrap' }}>{this.state.group.name}</Text>
              </View>
              <Text style={{ fontWeight: 'bold', marginLeft: 14, marginTop: 8 }}> Description </Text>
              <View style={{ width: 300, height: 'auto', flexDirection: 'row' }}>
                <Text style={{ marginLeft: 15, marginTop: 8, marginBottom: 15, flexWrap: 'wrap' }}>{this.state.group.item_description}</Text>
              </View>
              <Text style={{ fontWeight: 'bold', marginLeft: 15, marginTop: 8, }}>Group</Text>
              <Text style={{ marginLeft: 15, marginTop: 8, marginBottom: 15 }}>{this.state.group.item_group}</Text>
              <Text style={{ fontWeight: 'bold', marginLeft: 15, marginTop: 8, }}> Order in hand</Text>
              <Text style={{ marginLeft: 20, marginTop: 8, marginBottom: 15 }}>{this.state.group.bookedqty}</Text>
              <Text style={{ fontWeight: 'bold', marginLeft: 15, marginTop: 8 }}> Update Date </Text>
              <Text style={{ marginLeft: 15, marginTop: 8, }}>{moment(Number(this.state.group.updatedate)).format('DD/MM/YY')}</Text>
              <Text style={{ marginLeft: 15, marginTop: 4, color: '#1976D2', fontSize: 10 }}>{"(DD/MM/YY)"}</Text>
            </View>
          </View>
        </Modal>
        <Modal useNativeDriver={true}   animationType='slide' transparent={true} onBackdropPress={() => this.setState({ openModalPicker: false })} visible={this.state.openModalPicker} onRequestClose={() => { this.setState({ openModalPicker: false }) }} >
          <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
          <View style={{ width: 300, height: 150, backgroundColor: "#fff", elevation: 15, borderRadius: 15, }}>
          <TouchableOpacity style={{ alignSelf: 'flex-end' }} onPress={() => { this.setState({ openModalPicker: false,selectedValueItem:'',stockvalue:'' }) }}><Entypo name="cross" size={25} style={{ alignSelf: 'flex-end', marginTop: 10, marginRight: 10 }} /></TouchableOpacity>
           <View style={{flexDirection:'row'}}>
           <Picker
              selectedValue={this.state.selectedValueItem}
              style={{
                height: 20, width: wp(180), transform: [
                  { scaleX: 0.9 },
                  { scaleY: 0.9 },
                ]
              }}
              onValueChange={(itemValue, itemIndex) => {
                if(itemValue!=0){
                 if(itemValue==this.state.itemData.wholeItem.pkgunit){
                   this.setState({stockvalue:this.state.itemData.wholeItem.instockqty,selectedValueItem:itemValue});
                 }
                 if(itemValue==this.state.itemData.data.pkgunit){
                  this.setState({stockvalue:this.state.itemData.data.instockqty,selectedValueItem:itemValue});
                 }
                 
              }}
            }
            >
              <Picker.Item label={"Select UOM"} value={0} />
              <Picker.Item label={this.state.pickerdata.pkgunit} value={this.state.pickerdata.pkgunit} />
              <Picker.Item label={this.state.pickerdata.newValue} value={this.state.pickerdata.newValue} />
            </Picker>
            <View style={{justifyContent:'center',alignItems:'center'}}>
              <Text style={{fontWeight:'bold'}}>Stock {this.state.stockvalue}</Text>
            </View>
            </View>
           </View>
          </View>
        </Modal>
        </>}
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  // head: { height: 40, backgroundColor: '#f1f8ff' },
  text: { margin: 6 },

  SearchContainer: {
    // flex: 0.2,
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
    color: '#fff'
  },
  containerAnimation: {  
    width: "100%",  
    height: 40,  
    padding: 1,  
    borderColor: "black",  
    borderWidth: 3,  
    borderRadius: 5,  
    marginTop: 10,  
    justifyContent: "center",  
  },  
  inner:{  
    width: "100%",  
    height: 30,  
    borderRadius: 5,  
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:"#1976D2",  
  },  
  label:{  
    fontSize:18,  
    color: "black",  
    textAlign:'center',
    // position: "absolute",  
    // zIndex: 1,  
    alignSelf: "center",  
  }, 
  headerView: {
    height: 65,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1976D2',
    elevation: 2,
  },
  BackButtonContainer: {
    marginRight: 10,
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