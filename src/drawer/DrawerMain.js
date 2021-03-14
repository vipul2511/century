import React, { Component } from 'react';
import {View,Text,TouchableOpacity,Image,StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default class DrawerMain extends Component{
    constructor(props){
        super(props);
        this.state={
            username:''
        }
    }
    componentDidMount(){
      
        console.log('props',JSON.stringify(this.props));
         AsyncStorage.getItem('@username').then(succ=>{
          if(succ){
            this.setState({username:succ});
            console.log('username inside',succ);
          }
        });
    
    }
    render(){
        return(
            <View>
            <View style={{justifyContent:'center',alignItems:'center',marginTop:25}}>
                <Image source={require('../assets/image/logo.jpeg')}     />
                <Text style={{marginTop:15,fontSize:16,fontWeight:'bold'}}>Hello {this.state.username}</Text>
            </View>
            <TouchableOpacity style={styles.Home} onPress={() => this.props.navigation.navigate('DashBoardScreen')} ><Text style={styles.home_text}>Home</Text></TouchableOpacity>
            <TouchableOpacity style={styles.Home} ><Text style={styles.home_text}>Reports</Text></TouchableOpacity>
          <TouchableOpacity style={styles.Home} onPress={() => this.props.navigation.navigate('ViewCustomer',{value:this.props.navigation})}><Text style={styles.home_text}>My stock</Text></TouchableOpacity>
          <TouchableOpacity style={styles.Home} onPress={() => this.props.navigation.navigate('ViewStock',{value:this.props.navigation})}><Text style={styles.home_text}>My customer</Text></TouchableOpacity>
          <TouchableOpacity style={styles.Home}><Text style={styles.home_text}>My Daily Route</Text></TouchableOpacity>
          <TouchableOpacity style={styles.Home} ><Text style={styles.home_text}>My Favourite</Text></TouchableOpacity>
          {/* <TouchableOpacity style={styles.Home} onPress={() => props.navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'Login'}],
          }),
        )}><Text style={styles.home_text}>Logout</Text></TouchableOpacity> */}
          </View>
        )
    }
}
const styles = StyleSheet.create({
    home_text: {
        color: '#6AADEF',
        fontSize: 18,
        marginLeft: 12,
        marginTop: 5,
        fontFamily: Platform.OS === 'ios' ? 'Gill Sans' : 'sans-serif',
      },
      Home: {
        marginTop: 30,
        backgroundColor: '#DFEFFF',
        height: 40,
        width: 260,
        marginLeft: 10
      },
});