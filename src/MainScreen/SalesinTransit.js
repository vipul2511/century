import React, { Component } from 'react';
import { TextInput, View, TouchableOpacity, Alert, Text, ScrollView, StyleSheet, FlatList, Dimensions, BackHandler, ActivityIndicator } from 'react-native';
import firebase from '../utils/firebase';
import { Picker } from '@react-native-picker/picker';
import resp from 'rn-responsive-font';
import Icon from 'react-native-vector-icons/Ionicons'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';
import { wp, hp } from '../utils/heightWidthRatio';
import { CommonActions } from '@react-navigation/native';
import CheckBox from 'react-native-check-box';
import Toast from 'react-native-simple-toast';
import {BASE_URL} from '../utils/BaseUrl';
import NetInfo from "@react-native-community/netinfo";
import OfflineUserScreen from '../utils/OfflineScreen';
let width = Dimensions.get('window').width;
export default class SalesinTransit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      ReportData: [],
      tableHead: ['Head', 'Head2', 'Head3', 'Head4'],
      tableData: [],
      masterlist: '',
      totalCount: '',
      orgId: '',
      token: '',
      zoneid: '',
      NoData: false,
      type: '',
      loading: false,
      spinner: false,
      isChecked: false,
      toids: [],
      connected:true
    }
    let onEndReached = false;
    this.backItems = this.backItems.bind(this);
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPressed', this.backItems);
  }
  backItems() {
    if (this.props.navigation.isFocused()) {
      // console.log('working')
      this.props.navigation.goBack();
      return true;
    }
  }
  searchFilterFunction = (text) => {
    // console.log('name', text);
    if (text) {
      this.onEndReached = true
      let combineArray = this.state.tableData
      const newData = combineArray.filter(
        function (item) {
          const itemData = item.name
            ? item.name.toUpperCase()
            : ''.toUpperCase();
          const itemgroup = item.item_description
            ? item.item_description.toUpperCase()
            : ''.toUpperCase();
          const itemUnit = item.reorderlevel
            ? item.reorderlevel.toUpperCase()
            : ''.toUpperCase();
          const itemStock = item.instockqty
            ? item.instockqty.toUpperCase()
            : ''.toUpperCase();
          const textData = text.toUpperCase();
          return (
            itemData.indexOf(textData) > -1 ||
            itemgroup.indexOf(textData) > -1 ||
            itemUnit.indexOf(textData) > -1 ||
            itemStock.indexOf(textData) > -1
          )
        });
      this.setState({ tableData: newData });
    } else {
      this.setState({ tableData: this.state.masterlist });
      this.onEndReached = true
    }
  };
  componentDidMount() {
    this.checkInternet();
    AsyncStorage.getItem('@loginToken').then(succ => {
      if (succ) {
        this.setState({ token: succ });
      }
    })
    AsyncStorage.getItem('@orgid').then(succ => {
      if (succ) {
        this.setState({ orgId: succ });
      }
    })
    AsyncStorage.getItem('@zone_id').then(succ => {
      if (succ) {
        this.setState({ zoneid: succ });
      }
    })
    AsyncStorage.getItem('@type').then(succ => {
      console.log('succ',succ);
        
        this.setState({ type: succ });
        this.customerReorderDataApi()
    })
    BackHandler.addEventListener('hardwareBackPressed', this.backItems);
  }
  updateBillingqty = (text, index) => {
    // console.log('billing', text);
    const newArray = [...this.state.tableData];
    newArray[index].billingQty = text;
    // console.log(newArray);
    this.setState({ tableData: newArray })

  }
  // customerReorder = () => {
  //   this.showLoading();
  //   let dataItem = [];
  //   let responseData = this.state.tableData;
  //   responseData.forEach((child) => {
  //     let obj =
  //     {
  //       itemdescription: child.itemdescription,
  //       bookedqty: child.bookedqty,
  //       reorderlevel: child.reorderlevel,
  //       itemname: child.itemname,
  //       pkgunit: child.pkgunit,
  //       reorderlevel: child.reorderlevel,
  //       instockqty: child.instockqty,
  //       billingQty: child.billingQty
  //     }
  //     if (child.inTransitQty) {
  //       obj.inTransitQty = child.inTransitQty;
  //     }
  //     dataItem.push(obj);
  //   });
  //   console.log(dataItem);
  //   firebase.database().ref('CustomerReorderData/').set({ dataItem }).then((data) => {
  //     console.log('data', data)
  //     Toast.show('Create re-order data is successfully saved', Toast.LONG);
  //     this.getData();
  //     this.hideLoading();
  //   }).catch((err) => {
  //     console.log('error', err);
  //   });
  // }
  customerReorder = () => {
    if(this.state.toids.length>0){
    this.props.navigation.navigate('CreateOrder',{ dataItem: this.props.route.params.dataItem, reorder: this.state.toids });
    }else{
     alert('Please select atleast one checkbox');
    }
  }
  renderItem = ({ item, index }) => {
    const inList = this.state.toids.indexOf(item) !== -1;
    return (
      <View key={index}>
        <View style={{ flexDirection: 'row', height: 'auto', }} >
          <View>
            <CheckBox
              uncheckedCheckBoxColor={'#FB3954'}
              checkedCheckBoxColor={'#FB3954'}
              value={inList ? true : false}
              onValueChange={() => this.setState({ isChecked: !this.state.isChecked })}
              onClick={() => {
                this.setState({ isChecked: !this.state.isChecked }, () => {
                  if (!inList) {
                    this.setState((p) => ({
                      ...p,
                      toids: [...p.toids, item],
                    }));
                  } else {
                    this.setState((p) => ({
                      ...p,
                      toids: p.toids.filter((i) => i !== item),
                    }));
                  }
                });


              }}
              isChecked={inList ? true : false}
            />
          </View>
          <View style={{ width: wp(200), alignSelf: 'center', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{ fontSize: 13, marginLeft: 5, flexWrap: 'wrap', marginBottom: 10, }}>{item.name}</Text>
          </View>
          <View style={{ width: wp(150), alignSelf: 'center', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 13, marginBottom: 10, textAlign: 'center' }}>{item.item_description}</Text>
          </View>
          <View style={{ width: wp(130),flexDirection: 'row', justifyContent: 'center', alignItems: 'center',}}>
            {/* <Text style={{fontSize:13,marginLeft:15,flexWrap:'wrap',marginBottom:10,textAlign:'left'}}>{item.pkgunit}</Text> */}
            {/* <Picker
              selectedValue={item.pkgunit}
              style={{
                height: 20, width: wp(130),transform: [
                  { scaleX: 0.9 },
                  { scaleY: 0.9 },
                ]
              }}
              onValueChange={(itemValue, itemIndex) => {
              }}
            >
              <Picker.Item label={item.pkgunit} value={item.pkgunit} />
            </Picker> */}
            <Text style={{ fontSize: 13, flexWrap: 'wrap', marginBottom: 10, textAlign: 'center' }}>{item.pkgunit}</Text>
          </View>
          {/* <View style={{ width: wp(80), flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 13, marginLeft: 15, flexWrap: 'wrap', marginBottom: 10, textAlign: 'left' }}>{item.instockqty}</Text>
          </View>
          <View style={{ width: wp(80), flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 13, marginLeft: 15, flexWrap: 'wrap', marginBottom: 10, textAlign: 'left' }}>{item.bookedqty}</Text>
          </View>
          <View style={{ width: wp(80),flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{ fontSize: 13, marginLeft: 15, flexWrap: 'wrap', marginBottom: 10, textAlign: 'left' }}>{item.inTransitQty ? item.inTransitQty : 0}</Text>
          </View>
          <View style={{ width: wp(100), flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>
            <Text style={{ fontSize: 13, marginLeft: 15, flexWrap: 'wrap', marginBottom: 10, textAlign: 'left' }}>{item.reorderlevel}</Text>
          </View> */}
          {/* <View style={{ width: wp(130), height: hp(45), flexDirection: 'row', justifyContent: 'center', alignItems: 'center',}}>
            <TextInput
              style={{ width: wp(80), height: hp(40), borderWidth: 1, borderColor: 'black', marginTop: 3,marginLeft:wp(25),justifyContent:'center',alignItems:'center' }}
              keyboardType="numeric"
              onChangeText={(text) => { this.updateBillingqty(text, index) }}
              value={item.billingQty}
            />
          </View> */}
        </View>
        <View style={{ borderWidth: 0.5, backgroundColor: 'black' }}></View>
      </View>
    );
  }
  // customerReorder=(data)=>{
  //   firebase.database().ref('CustomerReorderData/').set({data}).then((data)=>{

  // }).catch((err)=>{
  //     console.log('error',err);
  // })
  // }
  getData = () => {
    firebase.database().ref('CustomerReorderData/dataItem/').on('value', (snap) => {
      let items = [];
      let billingQty = '0';
      let obj;
      snap.forEach((child) => {
        if (Math.sign(child.val().instockqty) == -1) { billingQty = '0'; }
        else {
          if (child.val().reorderlevel != '0' && child.val().inTransitQty && child.val().instockqty != "0") {
            let numId = Number(child.val().reorderlevel) - Number(child.val().inTransitQty) - Number(child.val().instockqty);
            billingQty = JSON.stringify(numId);
          }
          if (child.val().reorderlevel != '0' && child.val().inTransitQty && child.val().instockqty != "0" && child.val().bookedqty != "0") {
            let numIds = Number(child.val().reorderlevel) - Number(child.val().inTransitQty) - Number(child.val().instockqty) - Number(child.val().bookedqty);
            billingQty = JSON.stringify(numIds);
          }
          if (child.val().reorderlevel != '0' && child.val().instockqty != "0") {
            let number = Number(child.val().reorderlevel) - Number(child.val().instockqty);
            billingQty = JSON.stringify(number);
          }
          if (child.val().reorderlevel != '0' && !child.val().inTransitQty && child.val().instockqty == "0" && child.val().bookedqty == "0") {
            billingQty = child.val().reorderlevel;
          }
        }
        obj =
        {
          item_description: child.val().itemdescription,
          inTransitQty: child.val().inTransitQty,
          bookedqty: child.val().bookedqty,
          reorderlevel: child.val().reorderlevel,
          name: child.val().itemname,
          pkgunit: child.val().pkgunit,
          reorderlevel: child.val().reorderlevel,
          instockqty: child.val().instockqty,
          billingQty: child.val().billingQty != '0' ? child.val().billingQty : billingQty,
          itemmasterrowkey: child.val().itemmasterrowkey,
          item_group: child.val().item_group,
          itemschemeflag: child.val().itemschemeflag,
          itemcode: child.val().itemcode,
          pkgunitrate: child.val().pkgunitrate,
          iteminfoflag: child.val().iteminfoflag,
          itemskuflag: child.val().itemskuflag,
          pkgid: child.val().pkgid,
          itemskucode:child.val().itemskucode
        }
        items.push(obj);
      });

      this.setState({ tableData: items });
    });
  }
  checkInternet=()=>{
    NetInfo.fetch().then(state => {
      console.log("Connection type", state.isConnected);
      this.setState({connected:state.isConnected});
    });
  }
  showLoading() {
    this.setState({ spinner: true })
  }
  customerReorderApi = (dataItem) => {
    firebase.database().ref('CustomerReorderData/').set({ dataItem }).then((data) => {
      // console.log('data', data)
      this.getData();
      this.hideLoading();
    }).catch((err) => {
      console.log('error', err);
    });
  }
  customerReorderDataApi = () => {
    this.showLoading();
    // console.log('type',this.props.route.params.dataItem.typecus)
    let orgid = JSON.stringify(this.props.route.params.dataItem.orgid);
    let type = JSON.stringify(this.props.route.params.dataItem.typecus);
    var EditProfileUrl = `${BASE_URL}/dms-demo/mobile-json-data?logintoken=${this.state.token}&sourcetype=AndroidSalesPersonApp&fileDataSource=reorder-invoice-fetch&inputFieldsData={"selEntityId":${JSON.stringify(this.state.orgId)},"selEntityType":${JSON.stringify(this.state.type)},"selZoneId":${JSON.stringify(this.state.zoneid)},"selCustomerType": ${type},"selCustomerId":${orgid},"timeoffset": "330"}`
    console.log('Add product Url:' + EditProfileUrl)
    fetch(EditProfileUrl, {
      method: 'Post',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(responseData => {
        if (responseData !== "Invalid Session") {
          if (responseData !== "No Data Found") {
            if (responseData != "lstDbReportChildEntities is null / empty") {
              if (Object.prototype.toString.call(responseData) === '[object Array]') {
                // this.setState({tableData:responseData,masterlist:responseData});
                let items = [];
                let obj;
                responseData.forEach((child) => {
                  if (Math.sign(child.instockqty) == -1) { billingQty = '0'; }
                  else {
                    if (child.reorderlevel != '0' && child.inTransitQty && child.instockqty != "0") {
                      let numId = Number(child.reorderlevel) - Number(child.inTransitQty) - Number(child.instockqty);
                      billingQty = JSON.stringify(numId);
                    }
                    if (child.reorderlevel != '0' && child.inTransitQty && child.instockqty != "0" && child.bookedqty != "0") {
                      let numIds = Number(child.reorderlevel) - Number(child.inTransitQty) - Number(child.instockqty) - Number(child.bookedqty);
                      billingQty = JSON.stringify(numIds);
                    }
                    if (child.reorderlevel != '0' && child.instockqty != "0") {
                      let number = Number(child.reorderlevel) - Number(child.instockqty);
                      billingQty = JSON.stringify(number);
                    }
                    if (child.reorderlevel != '0' && !child.inTransitQty && child.instockqty == "0" && child.bookedqty == "0") {
                      billingQty = child.reorderlevel;
                    }
                  }
                  obj =
                  {
                    item_description: child.itemdescription,
                    inTransitQty: child.inTransitQty,
                    bookedqty: child.bookedqty,
                    reorderlevel: child.reorderlevel,
                    name: child.itemname,
                    pkgunit: child.pkgunit,
                    reorderlevel: child.reorderlevel,
                    instockqty: child.instockqty,
                    billingQty: child.billingQty != '0' ? child.billingQty : billingQty,
                    itemmasterrowkey: child.itemmasterrowkey,
                    item_group: child.item_group,
                    itemschemeflag: child.itemschemeflag,
                    itemcode: child.itemcode,
                    pkgunitrate: child.pkgunitrate,
                    iteminfoflag: child.iteminfoflag,
                    itemskuflag: child.itemskuflag,
                    pkgid: child.pkgid,
                    itemskucode:child.itemskucode
                  }
                  items.push(obj);
                });
                this.setState({ tableData: items });
                // this.customerReorderApi(items);
                // console.log(JSON.stringify(responseData));
              } else {
                this.hideLoading();
                console.log(responseData)
                this.setState({ NoData: true })
              }
            } else {
              this.hideLoading();
              console.log(responseData)
              this.setState({ NoData: true })
            }
          } else {
            this.hideLoading();
            console.log(responseData)
            this.setState({ NoData: true })
          }
        } else {
          this.hideLoading();
          this.setState({ NoData: true })
          this.createTwoButtonAlert()
          console.log(responseData);
        }
      })
      .catch(error => {
        this.hideLoading();
        this.checkInternet();
        // this.setState({ NoData: true })
        console.error('error coming', error)
      })
      .done()
  }
  hideLoading() {
    this.setState({ spinner: false })
  }
  logout = () => {
    this.props.navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      }),
    )
  }
  createTwoButtonAlert = () =>
    Alert.alert(
      "Invalid Session",
      "Your Session is expired Please login again",
      [

        { text: "OK", onPress: () => { this.logout() } }
      ],
      { cancelable: false }
    );
  nodata = () => {
    return (<View style={{ justifyContent: 'center', alignItems: 'center', marginTop: hp(45) }}>
      {this.state.NoData ? <Text>No Data Found</Text> : null}
    </View>
    )
  }
  bottom = () => {
    return (
      <View style={{ marginTop: 30, justifyContent: 'center', alignItems: 'center' }}>
        <TouchableOpacity style={{ backgroundColor: '#1976D2', width: 200, height: 45, justifyContent: 'center', alignItems: 'center', borderRadius: 10 }} onPress={() => { this.customerReorder() }}>
          <Text style={{ color: '#fff', fontSize: 18 }}>Create Re-Order</Text>
        </TouchableOpacity>
      </View>
    )
  }
  listHeader = () => {
    return (
      <View style={{ marginTop: 8, marginBottom: 5, marginLeft: 5, }}>
        {this.state.NoData == false ? <View style={{ flexDirection: 'row', }}>
          <View style={{ width: wp(200), alignSelf: 'flex-start' }}>
            <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>Name</Text></View>
          <View style={{ width: wp(150), alignSelf: 'center',justifyContent:'center',alignItems:'center', marginLeft: 10}}>
            <Text style={{ fontWeight: 'bold', textAlign: 'center', }}>Description</Text></View>
          <View style={{ width: wp(130),justifyContent:'center',alignItems:'center' }}>
            <Text style={{ fontWeight: 'bold', marginLeft: 15}}>Pkg Unit</Text>
            </View>
          <View style={{ width: wp(80), marginLeft: 10 }}>
            <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>In Stock Qty</Text></View>
          <View style={{ width: wp(80), marginLeft: 10 }}>
            <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>Booked Qty</Text></View>
          <View style={{ width: wp(80), marginLeft: 10 }}>
            <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>In Transit Qty</Text></View>
          <View style={{ width: wp(100), marginLeft: 10 }}>
            <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>Re-order Level</Text></View>
          <View style={{ width: wp(130), marginLeft: 10 }}>
            <Text style={{ fontWeight: 'bold', textAlign: 'left' }}>Billing Qty</Text></View>
        </View> : null}
      </View>
    )
  }
  render() {
    if(!this.state.connected){
      return(<OfflineUserScreen onTry={this.checkInternet} />)
         }
    return (
      <View style={styles.container}>
        <View style={styles.headerView}>
          <View style={styles.BackButtonContainer}>

            <Icon name="arrow-back" size={25} color={"#fff"} onPress={() => { this.props.navigation.goBack() }} />

          </View>
          <View style={styles.TitleContainer}>
            {this.state.NoData == false ? <View>
              <TextInput placeholder="Search" style={{ backgroundColor: '#fff', width: wp(250), height: hp(50) }} onChangeText={(text) => { this.searchFilterFunction(text) }} />
            </View> : <View >
              <Text style={styles.TitleStyle}>{this.props.route.params.dataItem.name}</Text>
            </View>}
          </View>
          <TouchableOpacity
            style={styles.SearchContainer}
            onPress={() => {
              this.customerReorderDataApi()
            }}>
            <Icon name="sync" size={25} color="#fff" style={{ marginLeft: 15 }} onPress={() => { this.customerReorderDataApi() }} />
          </TouchableOpacity>
        </View>
        <View>
          <Spinner
            visible={this.state.spinner}
            color='#1976D2'
          />
        </View>
        {/* <TouchableOpacity onPress={() => { console.log(this.state.toids) }}>
          <Text>he</Text>
        </TouchableOpacity> */}
        <ScrollView horizontal={true}>
          <FlatList
            keyExtractor={(item, index) => index.toString()}
            style={{ flex: 0.2 }}
            data={this.state.tableData}
            initialNumToRender={20}
            maxToRenderPerBatch={20}
            ListEmptyComponent={this.nodata}
            ListHeaderComponent={this.listHeader}
            numColumns={1}
            ListFooterComponent={this.bottom}
            renderItem={this.renderItem}
          />
        </ScrollView>

      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  head: { height: 40, backgroundColor: '#f1f8ff' },
  text: { margin: 6 },
  SearchContainer: {
    // flex: 0.1,
    marginLeft: 15,
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
    // flex: 0.2,
    marginRight: 10,
    backgroundColor: '#1976D2',
  },
  TitleContainer: {
    flexDirection: 'row',
    // flex: 0.57,
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