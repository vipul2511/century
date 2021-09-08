import React, { Component } from 'react';
import { wp, hp } from '../utils/heightWidthRatio';
import { TextInput, View, Dimensions, TouchableOpacity,UIManager, LayoutAnimation,Text, ScrollView, StyleSheet, FlatList, BackHandler, Modal, ActivityIndicator } from 'react-native';
let width=Dimensions.get('window').width;
let height=Dimensions.get('window').height;
import Ionicons from 'react-native-vector-icons/Ionicons';
class Search extends Component{

    searchFilterFunction = (text) => {
        if (text) {
          db.searchInStockTable(text).then(succ=>{
            console.log('data from db on screeen',succ);
          })
          // this.setState({ tableData: newData });
        } else {
          // this.setState({ tableData: this.state.masterlist });
        }
      };
    render(){
    return(
        <View style={{flex:1,backgroundColor:'#fff'}}>
            <View style={{flexDirection:'row'}}>
            <View style={{marginTop:hp(20),width:wp(40),marginLeft:wp(20)}}>
            <Ionicons name="arrow-back" size={25} color={"black"} onPress={() => { this.props.navigation.navigate('DashBoardScreen') }} />
            </View>
            <View style={{width:width-90, height: hp(50),marginTop:20}}>
             <View style={{borderWidth:1,borderColor:'black'}}>
              <TextInput autoFocus={true} placeholder="Search" style={{backgroundColor:'#fff'}} onChangeText={(text) => { this.searchFilterFunction(text) }} />
            </View>
            </View>
            </View>
            
        </View>
    )
    }
}
export default Search;