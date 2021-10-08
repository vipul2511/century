import React, { Component } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Dimensions, FlatList, ScrollView, TextInput, Alert } from 'react-native';
import resp from 'rn-responsive-font';
import Icon from 'react-native-vector-icons/Ionicons'
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { wp, hp } from '../utils/heightWidthRatio';
import { Picker } from '@react-native-picker/picker';
import CheckBox from 'react-native-check-box';
import Autocomplete from 'react-native-autocomplete-input';
import Spinner from 'react-native-loading-spinner-overlay';
import firebase from '../utils/firebase';
import { CommonActions } from '@react-navigation/native';
import Toast from 'react-native-simple-toast';
import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoding';
import {BASE_URL} from '../utils/BaseUrl';
Geocoder.init("AIzaSyBgIsfLI2Hp_LsfnxcQ2thDKZLNyESBxiI");
import Database from '../utils/Database';
const db = new Database();
let width = Dimensions.get('window').width;
let height = Dimensions.get('window').height;
export default class CreateOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            language: '',
            isChecked: false,
            masterlist: '',
            tableData: [],
            query: '',
            filteredData: [],
            selectedValue: [],
            enableScrollViewScroll: '',
            gstTable: [],
            comment: '',
            customername: '',
            customerType: '',
            pkgUnitpicker: '',
            qauntity: '',
            orderQty: '1',
            discount: '',
            specialDiscount: '',
            totalamount: 0,
            totalQuantity: 0,
            totalTax: '',
            NetTaxBilling: '',
            taxItem: [{ id: 1, name: 'hello' }],
            username: [],
            spinner: false,
            token: '',
            orgId: '',
            zoneid: '',
            type: '',
            user_id: '',
            reasonArr: '',
            location: '',
            distributor: [],
            retailer: [],
            rmbo: [],
            latitude: 0,
            longitude: 0,
            error: '',
            customerTypefromback: '',
            fromPervious: false,
            Address:''
        }
    }
    componentDidMount() {
        console.log('props data', this.props.route.params.dataItem);
        if (this.props.route.params.reorder) {
            let Arr = this.props.route.params.reorder;
            this.setState({ customername: this.props.route.params.dataItem.name, customerTypefromback: this.props.route.params.dataItem.typecus, fromPervious: true })
            Arr.map((item, index) => {
                this.setDatainTable(item);
            })
            console.log('the re order data', this.props.route.params.reorder);
        }
        Geolocation.getCurrentPosition(
                       (position) => {
                            this.setState({
                                latitude: position.coords.latitude,
                                longitude: position.coords.longitude,
                            });
                            Geocoder.from(position.coords.latitude, position.coords.longitude)
                                .then(json => {
                                    console.log(json);
            var addressComponent = json.results[0].formatted_address;
                              this.setState({
                                       Address: addressComponent
                                    })
                                    console.log(addressComponent);
                                })
                                .catch(error => console.warn(error));
                        },
                        (error) => {
                            // See error code charts below.
                            this.setState({

                                    error: error.message
                                }),
                                console.log(error.code, error.message);
                        },
                        {
                            enableHighAccuracy: false,
                            timeout: 10000,
                            maximumAge: 100000
                        }
                    );
    AsyncStorage.getItem('@loginToken').then(succ => {
        if (succ) {
            this.setState({ token: succ });
        }
        })
AsyncStorage.getItem('@user_id').then(succ => {
    if (succ) {
        let obj = JSON.parse(succ);
        this.setState({ user_id: obj });
        this.setState({ reasonArr: obj.tenantFeatures.Failed_Order_Reason });
        console.log('user_id 1233444', obj.tenantFeatures.Failed_Order_Reason);
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
    if (succ) {
        this.setState({ type: succ });
        //   this.dataFetchStockItem();
    }
})
// firebase.database().ref('StockMaster/data/').on('value', (snap) => {
//     let items = [];
//     snap.forEach((child) => {
//         items.push({
//             name: child.val().name,
//             type: child.val().orgtypename,
//         });
//     });
//     let distributor = this.state.distributor
//     let retailer = this.state.retailer
//     let rmbo = this.state.rmbo
//     items.map((item, index) => {
//         if (item.type == "Distributor") {
//             distributor.push(item);
//         }
//         if (item.type == "Retailer") {
//             retailer.push(item);
//         }
//         if (item.type == "RMBO") {
//             rmbo.push(item);
//         }
//     });
//     //  console.log('distributor',distributor,'retailer',retailer,'rmbo',rmbo);
//     this.setState({ distributor: distributor, retailer: retailer, rmbo: rmbo });
// });
db.retrieveCustomer().then(table=>{
    console.log(' customer table',table);
        let items = [];
            table.forEach((child) => {
                items.push({
                    name: child.name,
                    type: child.orgtypename,
                });
            });
            let distributor = this.state.distributor
            let retailer = this.state.retailer
            let rmbo = this.state.rmbo
            items.map((item, index) => {
                if (item.type == "Distributor") {
                    distributor.push(item);
                }
                if (item.type == "Retailer") {
                    retailer.push(item);
                }
                if (item.type == "RMBO") {
                    rmbo.push(item);
                }
            });
            //  console.log('distributor',distributor,'retailer',retailer,'rmbo',rmbo);
            this.setState({ distributor: distributor, retailer: retailer, rmbo: rmbo });
    });
    db.retrieveStock(0).then(table=>{

    let items = [];
    let objArr = [];
    table.forEach((child) => {
        console.log('chuld',child);
        let obj =
        {
            itemmasterrowkey: child.itemmasterrowkey,
            item_description: child.item_description,
            item_group: child.item_group,
            bookedqty: child.bookedqty,
            reorderlevel: child.reorderlevel,
            updatedate: child.updatedate,
            name: child.name,
            pkgunit: child.pkgunit,
            instockqty: child.instockqty,
            orgid: child.orgid,
            pkgunitrate: child.pkgunitrate?child.pkgunitrate:0,
            itemcode: child.itemcode,
            itemschemeflag: child.itemschemeflag,
            pkgid: child.pkgid,
            itemskuflag: child.itemskuflag,
            iteminfoflag: child.iteminfoflag,
            itemskucode: child.itemskucode
        }
        items.push(obj);
        objArr.push(obj)
    });
    let newArr = [];
    items.map((items, index) => { // here index is the iterator
        if (!newArr.some((item, index) => item.name == items.name)) {
            newArr.push(items);
        }
    });
    this.setState({ tableData: items, masterlist: newArr, loading: false });
    // console.log('report', this.state.tableData.length);
    // console.log('re loaded');
});
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
showLoading() {
    this.setState({ spinner: true })
}

hideLoading() {
    this.setState({ spinner: false })
}
createOrderApi = () => {
            this.showLoading();
            let rawData = JSON.stringify({
                customertype: this.props.route.params.dataItem.typecus,
                customerid: this.props.route.params.dataItem.orgid,
                customername: this.props.route.params.dataItem.name,
                routeid: '',
                routename: '',
                comments: this.state.Address,
                userid: this.state.user_id.userid,
                orgid: this.state.orgId,
                orgname: this.state.user_id.orgName,
                orgtype: "superstockist",
                type: "SalesOrder",
                miscellaneouscharges: {},
                failedorder: JSON.stringify(this.state.isChecked),
                lineitem: this.state.gstTable
            });
            var EditProfileUrl = `${BASE_URL}/dms-demo//mobile-json-data?logintoken=${this.state.token}&sourcetype=AndroidSalesPersonApp&fileDataSource=salesorder-create&inputFieldsData={"selEntityId":${JSON.stringify(this.state.orgId)},"selEntityType":${JSON.stringify(this.state.type)},"timeoffset": "330"}`
            console.log('Add product Url:' + EditProfileUrl, 'raw data', rawData);
            fetch(EditProfileUrl, {
                method: 'Post',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
            
                },
                body: rawData
            })
                // .then(response => response.json())
                .then(responseData => {
                    this.hideLoading();
                    console.log('resposne data',responseData);
                    Toast.show('Sales Order Created successfully.');
                    if (this.state.fromPervious == false) {
                        this.props.navigation.navigate('BPR', { dataItem: this.props.route.params.dataItem });
                    } else {
                        this.props.navigation.navigate('SalesinTransit', { dataItem: this.props.route.params.dataItem });
                    }
                })
                .catch(error => {
                    this.hideLoading();
                    Toast.show('Sales Order Not Created.');
                    // if (this.state.fromPervious == false) {
                    //     this.props.navigation.navigate('BPR', { dataItem: this.props.route.params.dataItem });
                    // } else {
                    //     this.props.navigation.navigate('SalesinTransit', { dataItem: this.props.route.params.dataItem });
                    // }
                    console.error('error coming', error)
                })
                .done()

}
_filterData = (text) => {
    console.log('name', text);
    if (text) {
        this.onEndReached = true
        let combineArray = this.state.tableData;
        const newData = combineArray.filter(
            function (item) {
                const itemData = item.name
                    ? item.name.toUpperCase()
                    : ''.toUpperCase();
                const textData = text.toUpperCase();
                return (
                    itemData.indexOf(textData) > -1
                )
            });
        this.setState({ filteredData: newData });
    } else {
        this.setState({ filteredData: [] });
        this.onEndReached = true
    }
}
setDatainTable = (item) => {
    let gstTableArray = this.state.gstTable;
    console.log('set dtata', item);
    console.log('inital gst table', gstTableArray);
    let obj = {
        itemmasterrowkey: item.itemmasterrowkey,
        itemschemeflag: item.itemschemeflag,
        itemcode: item.itemcode,
        itemname: item.name,
        itemdescription: item.item_description,
        itemgroup: item.item_group,
        pkgunit: item.pkgunit,
        orderqty: item.billingQty?item.billingQty!=0?item.billingQty:'1':'1',
        itemdiscountpercent: '0',
        itemspldiscpercent: '0',
        pkgunitrate: item.pkgunitrate,
        orderamount: (item.pkgunitrate * 1).toString(),
        basepkgflag: 'false',
        iteminfoflag: item.iteminfoflag,
        itemskuflag: item.itemskuflag,
        pkgid: item.pkgid,
        itemskucode: item.itemskucode
    }
    gstTableArray.push(obj);
    let totalvalue = 0;
    let totalamount = 0;
    gstTableArray.map((items, index) => {
        console.log('gst table item', items)
        totalvalue = totalvalue + Number(items.orderqty);
        totalamount = totalamount + Number(items.orderamount);
    })
    console.log('total quantity', totalvalue);
    this.setState({ selectedValue: item, filteredData: [], gstTable: gstTableArray, totalQuantity: totalvalue, totalamount: totalamount.toFixed(3) });
    console.log(this.state.gstTable);
}
ListHeader = () => {
    return (
        <View style={{ marginTop: wp(12) }}>
            <View style={{ borderWidth: 1, backgroundColor: 'black' }}></View>
            <View style={{ flexDirection: 'row' }}>
                <View style={{ marginLeft: 15, width: wp(80) }}>
                    <Text style={{ fontWeight: 'bold' }}>Item Code</Text>
                </View>
                <View style={{ marginLeft: 15, width: wp(100), justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontWeight: 'bold' }}>Item Name</Text>
                </View>
                <View style={{ marginLeft: 15, width: wp(130), justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontWeight: 'bold' }}>Pkg Unit</Text>
                </View>
                <View style={{ marginLeft: 15, width: wp(100), justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontWeight: 'bold' }}>Order Qty</Text>
                </View>
                <View style={{ marginLeft: 15, width: wp(100), justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontWeight: 'bold' }}>Disc %</Text>
                </View>
                <View style={{ marginLeft: 15, width: wp(100), justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontWeight: 'bold' }}>Spl Disc %</Text>
                </View>
                <View style={{ marginLeft: 15, width: wp(100), justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontWeight: 'bold' }}>Rate</Text>
                </View>
                <View style={{ marginLeft: 15, width: wp(150), justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontWeight: 'bold' }}>Amount</Text>
                </View>
            </View>

            <View style={{ borderWidth: 1, backgroundColor: 'black' }}></View>
        </View>
    )
}
BottomView = () => {
    let num = ((this.state.totalamount / 100) * 18).toFixed(2);
    let totalNumber = Number(this.state.totalamount) + Number(num);
    return (
        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
            <View style={{ width: wp(250) }}>
                <Text style={{ fontWeight: 'bold' }}>Total Tax Amount {((this.state.totalamount / 100) * 18).toFixed(2)}</Text>
            </View>
            <View style={{ width: wp(170) }}>
                <Text style={{ fontWeight: 'bold' }}>Net Billing Amount {totalNumber.toFixed(2)}</Text>
            </View>
        </View>
    )
}
bottomTax = () => {
    return (
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
            <View style={{ width: wp(250) }}>
                <Text style={{ fontWeight: 'bold' }}>Total Quantity {this.state.totalQuantity}</Text>
            </View>
            <View style={{ width: wp(180) }}>
                <Text style={{ fontWeight: 'bold' }}>Total Amount {this.state.totalamount}</Text>
            </View>
        </View>
    )
}
totalamount = () => {
    let newArray = [...this.state.gstTable];
    let totalamount = 0;
    newArray.map((items, index) => {
        console.log('gst table item', items)
        totalamount = totalamount + Number(items.orderamount);
    });
    this.setState({ totalamount: totalamount.toFixed(3) });
}
deleteArrayValue = (index) => {
    let newArray = [...this.state.gstTable];
    newArray.splice(index, 1);
    console.log('deleted array', newArray);
    let totalvalue = 0;
    let totalamount = 0;
    newArray.map((items, index) => {
        console.log('gst table item', items)
        totalvalue = totalvalue + Number(items.orderqty);
        totalamount = totalamount + Number(items.orderamount);
    })
    this.setState({ gstTable: newArray, totalQuantity: totalvalue, totalamount: totalamount.toFixed(3) });
}
orderQty = (text, index) => {
    console.log(text);
    if (text == 0 && text != '') {
        const newArray = [...this.state.gstTable];
        newArray[index].orderqty = 0;
        let items = newArray[index].pkgunitrate * Number(text);
        let final = items.toFixed(2);
        newArray[index].orderamount = final;
        let totalvalue = 0;
        let totalamount = 0;
        newArray.map((items, index) => {
            console.log('gst table item', items)
            totalvalue = totalvalue + Number(items.orderqty);
            totalamount = totalamount + Number(items.orderamount);
        })
        this.setState({ gstTable: newArray, totalQuantity: totalvalue, totalamount: totalamount.toFixed(3) });
    } else {
        const newArray = [...this.state.gstTable];
        newArray[index].orderqty = text;
        let items = newArray[index].pkgunitrate * Number(text);
        let final = items.toFixed(2);
        newArray[index].orderamount = final;
        let totalvalue = 0;
        let totalamount = 0;
        newArray.map((items, index) => {
            console.log('gst table item', items)
            totalvalue = totalvalue + Number(items.orderqty);
            totalamount = totalamount + Number(items.orderamount);
        })
        this.setState({ gstTable: newArray, totalQuantity: totalvalue, totalamount: totalamount.toFixed(3) });
    }
}
discountValue = (text, index) => {
    if (Number(text) <= 100) {
        console.log('discount', text);
        const newArray = [...this.state.gstTable];
        newArray[index].itemdiscountpercent = text;
        let totalOrder = newArray[index].pkgunitrate * newArray[index].orderqty;
        let per = totalOrder * Number(text) / 100;
        let finalvalue = totalOrder - per;
        newArray[index].orderamount = finalvalue.toFixed(2);
        console.log('discount item', per, 'final value', finalvalue.toFixed(2));
        this.setState({ gstTable: newArray }, () => {
            this.totalamount();
        });
    } else {
        alert('Please enter a value less than 100');
    }
}
specialDiscount = (text, index) => {
    if (Number(text) <= 100) {
        console.log('discount', text);
        const newArray = [...this.state.gstTable];
        newArray[index].itemspldiscpercent = text;
        let per = newArray[index].orderamount * Number(text) / 100;
        let finalvalue = newArray[index].orderamount - per;
        newArray[index].orderamount = finalvalue.toFixed(2);
        console.log('discount item', per, 'final value', finalvalue.toFixed(2));
        this.setState({ gstTable: newArray }, () => {
            this.totalamount();
        });
    } else {
        alert('Please enter a value less than 100');
    }
}
renderGstBillItem = ({ item, index }) => {
    // this.setState({totalamount:items})
    return (
        <View key={index} style={{ marginTop: wp(12) }}>
            {/* <View style={{ borderWidth: 1, backgroundColor: 'black' }}></View> */}
            <View style={{ flexDirection: 'row' }}>
                <View style={{ marginLeft: 15, width: wp(80),justifyContent: 'center', alignItems: 'center' }}>
                    <Text>{item.itemcode}</Text>
                </View>
                <View style={{ marginLeft: 15, width: wp(100), justifyContent: 'center', alignItems: 'center' }}>
                    <Text>{item.itemname}</Text>
                </View>
                <View style={{ marginLeft: 15, width: wp(130), justifyContent: 'center', alignItems: 'center' }}>
                    <Picker
                        selectedValue={item.pkgunit}
                        style={{ height: 30, width: wp(130) }}
                        onValueChange={(itemValue, itemIndex) => {
                            const newArray = [...this.state.gstTable];
                            newArray[index].pkgunit = itemValue;
                            this.setState({ gstTable: newArray });
                        }}
                    >
                        <Picker.Item label="BOX" value="BOX" />
                        <Picker.Item label="NOS" value="NOS" />
                    </Picker>
                </View>
                <View style={{ marginLeft: 15, width: wp(100) }}>
                    <TextInput onChangeText={(text) => { this.orderQty(text, index) }}
                        keyboardType="numeric"
                        style={{ borderWidth: 1, borderColor: 'black', height: hp(40), marginTop: 2 }}
                        value={item.orderqty} />
                </View>
                <View style={{ marginLeft: 15, width: wp(100) }}>
                    <TextInput
                        onChangeText={(text) => { this.discountValue(text, index) }}
                        keyboardType="numeric"
                        maxLength={3}
                        style={{ borderWidth: 1, borderColor: 'black', height: hp(40), marginTop: 2 }}
                        value={item.itemdiscountpercent}
                    />
                </View>
                <View style={{ marginLeft: 15, width: wp(100), }}>
                    <TextInput onChangeText={(text) => { this.specialDiscount(text, index) }}
                        value={item.itemspldiscpercent}
                        maxLength={3}
                        keyboardType="numeric" style={{ borderWidth: 1, borderColor: 'black', height: hp(40), marginTop: 2 }} />
                </View>
                <View style={{ marginLeft: 15, width: wp(100), justifyContent: 'center', alignItems: 'center' }}>
                    <Text>{item.pkgunitrate}</Text>
                </View>
                <View style={{ marginLeft: 15, width: wp(150), justifyContent: 'center', alignItems: 'center' }}>
                    <Text>{item.orderamount}</Text>
                </View>
                <View style={{ marginLeft: 5, width: wp(50), justifyContent: 'center', alignItems: 'center' }}>
                    <AntDesign name="delete" color="red" size={25} onPress={() => { this.deleteArrayValue(index) }} />
                </View>
            </View>

            <View style={{ borderWidth: 1, backgroundColor: 'black' }}></View>
        </View>
    )
}
listgstTax = () => {
    return (
        <View style={{ marginTop: wp(12) }}>
            <View style={{ borderWidth: 1, backgroundColor: 'black' }}></View>
            <View style={{ flexDirection: 'row' }}>
                <View style={{ marginLeft: 15, width: wp(80) }}>
                    <Text style={{ fontWeight: 'bold' }}>Tax Name</Text>
                </View>
                <View style={{ marginLeft: 15, width: wp(100), justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontWeight: 'bold' }}>Tax Percent</Text>
                </View>
                <View style={{ marginLeft: 15, width: wp(140), justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontWeight: 'bold' }}>Item Net Amount</Text>
                </View>
                <View style={{ marginLeft: 15, width: wp(140), justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontWeight: 'bold' }}>Tax Amount</Text>
                </View>
            </View>

            <View style={{ borderWidth: 1, backgroundColor: 'black' }}></View>
        </View>
    )
}
renderGSTTax = () => {
    return (<View style={{ marginTop: wp(12) }}>
        {/* <View style={{ borderWidth: 1, backgroundColor: 'black' }}></View> */}
        <View style={{ flexDirection: 'row' }}>
            <View style={{ marginLeft: 15, width: wp(80) }}>
                <Text>GST@18%</Text>
            </View>
            <View style={{ marginLeft: 15, width: wp(100), }}>
                <Text style={{ textAlign: 'center' }}>18%</Text>
            </View>
            <View style={{ marginLeft: 15, width: wp(140), }}>
                <Text style={{ textAlign: 'center' }}>{this.state.totalamount}</Text>
            </View>
            <View style={{ marginLeft: 15, width: wp(140) }}>
                <Text style={{ textAlign: 'center' }}>{((this.state.totalamount / 100) * 18).toFixed(2)}</Text>
            </View>
        </View>
        <View style={{ borderWidth: 1, backgroundColor: 'black' }}></View>
    </View>
    )
}
render() {
    return (
        <View style={styles.container}>
            <View style={styles.headerView}>
                <View style={styles.BackButtonContainer}>

                    <Icon name="arrow-back" size={25} color={"#fff"} onPress={() => { this.props.navigation.goBack() }} />

                </View>
                <View style={styles.TitleContainer}>
                    <View style={{ flex: 0.6 }}>
                        <Text style={styles.TitleStyle}>{"Create Order"}</Text>
                    </View>
                </View>
                <TouchableOpacity
                    style={styles.SearchContainer}
                    onPress={() => { this.props.navigation.navigate('DashBoardScreen') }}
                >
                    <Icon name="home" size={25} color={"#fff"} onPress={() => { this.props.navigation.navigate('DashBoardScreen') }} />
                </TouchableOpacity>
            </View>
            <Spinner
                visible={this.state.spinner}
                color='#1976D2'
            />
            <View style={{ flex: 1, marginTop: hp(20) }}>
                <ScrollView style={{ flex: 1 }}>
                    {!this.state.fromPervious ? <View>
                        {/* <View style={{ flexDirection: 'row' }}>
                            <View style={{ marginLeft: 10, height: 40, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ color: '#000000', fontSize: 15 }}>Customer Type *</Text>
                            </View>
                            <View style={{ width: wp(230), justifyContent: "center", right: 10, position: 'absolute', alignItems: 'center', borderWidth: 1, borderColor: 'gray', backgroundColor: '#F7F7F7', marginLeft: 10 }}>
                                <Picker
                                    selectedValue={this.state.customerType}
                                    style={{ height: 40, width: wp(230) }}
                                    onValueChange={(itemValue, itemIndex) => {
                                        this.setState({ customerType: itemValue })
                                    }}
                                >
                                    <Picker.Item label="Select Customer Type" value="Select Customer Type" />
                                    <Picker.Item label="Distributors" value="distributor" />
                                    <Picker.Item label="Retailer" value="retailer" />
                                    <Picker.Item label="RMBO" value="rmbo" />
                                </Picker>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: hp(20) }}>
                            <View style={{ marginLeft: 10, height: 40, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ color: '#000000', fontSize: 15 }}>Customer Name *</Text>
                            </View>
                            <View style={{ width: wp(230), justifyContent: "center", alignItems: 'center', right: 10, position: 'absolute', borderWidth: 1, borderColor: 'gray', backgroundColor: '#F7F7F7', marginLeft: 10 }}>
                                <Picker
                                    selectedValue={this.state.customername}
                                    style={{ height: 40, width: wp(230) }}
                                    onValueChange={(itemValue, itemIndex) => {
                                        this.setState({ customername: itemValue })
                                    }}
                                >
                                    <Picker.Item label="Select Customer Name" value="Select Customer Name" />
                                    {this.state.customerType == "distributor" && this.state.distributor.map((items, index) => {
                                        // console.log('items', items);
                                        return (<Picker.Item label={items.name} value={items.name} key={index} />)
                                    })}
                                    {this.state.customerType == "retailer" && this.state.retailer.map((items, index) => {
                                        // console.log('items', items);
                                        return (<Picker.Item label={items.name} value={items.name} key={index} />)
                                    })}
                                    {this.state.customerType == "rmbo" && this.state.rmbo.map((items, index) => {
                                        // console.log('items', items);
                                        return (<Picker.Item label={items.name} value={items.name} key={index} />)
                                    })}
                                </Picker>
                            </View>
                        </View> */}
                        <View style={{ flexDirection: 'row', }}>
                            <View style={{ marginLeft: 10, height: 40, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ color: 'red', fontSize: 15 }}>Failed Visit</Text>
                            </View>
                            <View style={{ width: wp(230), justifyContent: "flex-start", alignItems: 'flex-start', right: 1, position: 'absolute', marginLeft: 10 }}>
                                <View style={{
                                    flexDirection: 'row',
                                    marginBottom: 15
                                }}>
                                    <CheckBox
                                        uncheckedCheckBoxColor={'#FB3954'}
                                        checkedCheckBoxColor={'#FB3954'}
                                        value={this.state.isChecked}
                                        onValueChange={() => this.setState({ isChecked: !this.state.isChecked })}
                                        onClick={() => {
                                            this.setState({ isChecked: !this.state.isChecked }, () => {
                                                if (this.state.isChecked == true) {

                                                }
                                            });


                                        }}
                                        isChecked={this.state.isChecked}
                                    />
                                    {this.state.isChecked ? <View style={{ width: wp(190),height:40,justifyContent: "center", alignItems: 'center', borderWidth: 1, borderColor: 'gray', backgroundColor: '#F7F7F7', marginLeft: 10 }}>
                                        <Picker
                                            selectedValue={this.state.comment}
                                            style={{ height: 30, width: wp(190),justifyContent:'center',alignItems:'center' }}
                                            onValueChange={(itemValue, itemIndex) => {
                                                this.setState({ comment: itemValue })
                                            }}
                                        >
                                            <Picker.Item label="Select Comment" value="Select Comment" />
                                            {this.state.reasonArr.map((item, index) => {
                                                return (
                                                    <Picker.Item label={item} value={item} key={index} />
                                                )
                                            })}
                                        </Picker>
                                       
                                    </View> 
                                    
                                    : null}

                                </View>
                            </View>
                        </View>
                        {!this.state.isChecked ? <View style={{ flexDirection: 'row', marginTop: hp(20), }}>
                            <View style={{ marginLeft: 10, height: 40, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ color: '#000000', fontSize: 15 }}>Search Item</Text>
                            </View>
                            <View style={{ width: wp(230), justifyContent: "center", alignItems: 'center', left: wp(45), borderWidth: 1, borderColor: 'gray', backgroundColor: '#F7F7F7', }}>
                                <Autocomplete
                                    containerStyle={styles.autocompleteContainer}
                                    keyExtractor={(item, index) => index.toString()}
                                    scrollEnabled={this.state.enableScrollViewScroll}
                                    listStyle={{ maxHeight: 350 }}
                                    onStartShouldSetResponderCapture={() => {
                                        this.setState({ enableScrollViewScroll: true });
                                    }}
                                    data={this.state.filteredData}
                                    defaultValue={JSON.stringify(this.state.selectedValue) === '{}' ?
                                        '' :
                                        this.state.selectedValue.name}
                                    onChangeText={(text) => { this._filterData(text) }}
                                    renderItem={({ item, i }) => (

                                        <TouchableOpacity key={i} style={{ zIndex: 1, }} onPress={() => { this.setDatainTable(item) }}>
                                            <Text>{item.name}</Text>
                                        </TouchableOpacity>
                                    )}
                                />
                            </View>
                        </View> : null}
                    </View> : null}
                    {this.state.gstTable.length > 0 ? <ScrollView horizontal={true} style={{ zIndex: -1 }}>
                        <FlatList
                            keyExtractor={(item, index) => index.toString()}
                            data={this.state.gstTable}
                            initialNumToRender={20}
                            style={{ flex: 1 }}
                            stickyHeaderIndices={[0]}
                            numColumns={1}
                            maxToRenderPerBatch={20}
                            renderItem={this.renderGstBillItem}
                            ListFooterComponent={this.bottomTax}
                            ListHeaderComponent={this.ListHeader}
                        />
                    </ScrollView> : null}
                    {this.state.gstTable.length > 0 ? <ScrollView horizontal={true} style={{ zIndex: -1, marginTop: 20 }}>
                        <FlatList
                            keyExtractor={(item, index) => index.toString()}
                            data={this.state.taxItem}
                            initialNumToRender={20}
                            style={{ flex: 1 }}
                            stickyHeaderIndices={[0]}
                            numColumns={1}
                            maxToRenderPerBatch={20}
                            renderItem={this.renderGSTTax}
                            ListFooterComponent={this.BottomView}
                            ListHeaderComponent={this.listgstTax}
                        />
                    </ScrollView> : null}
                    {this.state.gstTable.length > 0 ? (
                        <View style={{ width: width, marginTop: 25, marginBottom: 20, height: 'auto', borderWidth: 1, borderColor: 'black', zIndex: -1,flexDirection:'row'}}>
                            <Text style={{flexWrap:'wrap',margin:10}}>{this.state.Address}</Text>
                        </View>) : null}


                    {this.state.gstTable.length > 0 || this.state.comment!=''? (<View style={{ width: width, marginTop: 25, marginBottom: 20, justifyContent: 'center', alignItems: 'center', zIndex: -1 }}>
                        <TouchableOpacity style={{ backgroundColor: '#1976D2', width: 200, height: 45, justifyContent: 'center', alignItems: 'center', borderRadius: 10 }} onPress={() => { this.createOrderApi() }}>
                            <Text style={{ color: '#fff', fontSize: 18 }}>Create Order</Text>
                        </TouchableOpacity>
                    </View>) : null}
                </ScrollView>
            </View>

        </View>

    )
}
}
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    SearchContainer: {
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
        marginRight: 10,
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
    autocompleteContainer: {
        width: wp(230),
        zIndex: 5,

    },
    srollViewStyle: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    }
});