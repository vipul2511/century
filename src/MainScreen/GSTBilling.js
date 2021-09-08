import React, { Component } from 'react';
import {Text,TouchableOpacity,View,FlatList,StyleSheet} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { wp,hp } from '../utils/heightWidthRatio';
export default class GSTBilling extends Component{
    constructor(props){
        super(props);
        this.state={
            tableData:[{s1No:1,Itemcode:'it0045',itemName:'Item 43',Description:'Item43',HSNNo:'4536',PkgUnit:'Box',OrderQty:'8',Disc:'34',splDisc:'0',Rate:'1810',Amount:1813}]
        }
    }
    ListHeader=()=>{
        return(
            <View style={{marginTop:wp(12)}}>
                <View style={{borderWidth:1,backgroundColor:'black'}}></View>
                <View style={{flexDirection:'row'}}>
                <View style={{marginLeft:10,width:wp(40)}}>
                    <Text>SI NO.</Text>
                </View>
                <View style={{marginLeft:15,width:wp(80)}}>
                    <Text>Item Code</Text>
                </View>
                <View style={{marginLeft:15,width:wp(100)}}>
                    <Text>Item Name</Text>
                </View>
                <View style={{marginLeft:15,width:wp(130)}}>
                    <Text>Description</Text>
                </View>
                <View style={{marginLeft:15,width:wp(100)}}>
                    <Text>HSN No</Text>
                </View>
                <View style={{marginLeft:15,width:wp(100)}}>
                    <Text>Pkg Unit</Text>
                </View>
                <View style={{marginLeft:15,width:wp(100)}}>
                    <Text>Order Qty</Text>
                </View>
                <View style={{marginLeft:15,width:wp(100)}}>
                    <Text>Disc %</Text>
                </View>
                <View style={{marginLeft:15,width:wp(100)}}>
                    <Text>Spl Disc %</Text>
                </View>
                <View style={{marginLeft:15,width:wp(140)}}>
                    <Text>Rate</Text>
                </View>
                <View style={{marginLeft:15,width:wp(160)}}>
                    <Text>Amount</Text>
                </View>
                </View>

                <View style={{borderWidth:1,backgroundColor:'black'}}></View>
            </View>
        )
    }
    renderItem=()=>{
        return(
            <View style={{marginTop:wp(12)}}>
                <View style={{borderWidth:1,backgroundColor:'black'}}></View>
                <View style={{flexDirection:'row'}}>
                <View style={{marginLeft:10,width:wp(40)}}>
                    <Text>SI NO.</Text>
                </View>
                <View style={{marginLeft:15,width:wp(80)}}>
                    <Text>Item Code</Text>
                </View>
                <View style={{marginLeft:15,width:wp(100)}}>
                    <Text>Item Name</Text>
                </View>
                <View style={{marginLeft:15,width:wp(130)}}>
                    <Text>Description</Text>
                </View>
                <View style={{marginLeft:15,width:wp(100)}}>
                    <Text>HSN No</Text>
                </View>
                <View style={{marginLeft:15,width:wp(100)}}>
                    <Text>Pkg Unit</Text>
                </View>
                <View style={{marginLeft:15,width:wp(100)}}>
                    <Text>Order Qty</Text>
                </View>
                <View style={{marginLeft:15,width:wp(100)}}>
                    <Text>Disc %</Text>
                </View>
                <View style={{marginLeft:15,width:wp(100)}}>
                    <Text>Spl Disc %</Text>
                </View>
                <View style={{marginLeft:15,width:wp(140)}}>
                    <Text>Rate</Text>
                </View>
                <View style={{marginLeft:15,width:wp(160)}}>
                    <Text>Amount</Text>
                </View>
                </View>

                <View style={{borderWidth:1,backgroundColor:'black'}}></View>
            </View>
        )
    }
    BottomView=()=>{
        return(
            <View style={{flexDirection:'row',justifyContent:'flex-end',alignItems:'flex-end'}}>
                <View style={{width:wp(250)}}>
              <Text>Total Quantity</Text>
              </View>
              <View style={{width:wp(170)}}>
              <Text>Total Amount</Text>
              </View>
            </View>
        )
    }
    render(){
        return(
            <View style={{flex:1,backgroundColor:'#fff'}}>
                <ScrollView horizontal={true}>
                <FlatList
         keyExtractor={(item, index) => index.toString()} 
         data={this.state.tableData}
         initialNumToRender={20}
         style={{flex:1}}
         stickyHeaderIndices={[0]}
         numColumns={1}
         maxToRenderPerBatch={20}
         renderItem={this.renderItem}
         ListFooterComponent={this.BottomView}
         ListHeaderComponent={this.ListHeader}
          />
          </ScrollView>
            </View>
        )
    }
}
const styles = StyleSheet.create({

});