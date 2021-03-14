/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React,{Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Image,
  ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import resp from 'rn-responsive-font'
 class Splash extends Component{
     constructor(props){
         super(props);
         this.state={
           loading:''
         }
     }
    componentDidMount(){
           this.load();
    }
    showLoading() {
        this.setState({ loading: true });
    }
    load = () => {
        this.showLoading();
        this.timeoutHandle = setTimeout(() => {
            // Add your logic for the transition
            // this.props.navigation.navigate('Login')
            AsyncStorage.getItem('@is_login').then((isLogin) => {
                console.log('login screen',isLogin);
                if (isLogin == undefined || isLogin == "0") {
                    this.props.navigation.navigate('Login')
                } else if (isLogin == "1") {
                   this.props.navigation.navigate('Root')
               }
           });
        }, 2000);  
    }
    componentWillUnmount() {
        clearTimeout(this.timeoutHandle); 
    }
  render(){
    return(
     <View style={styles.container}>
     
          <Image source={require('./assets/image/logo.jpeg')} style={{width:260,height:220}} />
         <Text style={{fontWeight:'bold',fontSize:35,textAlign:'center'}}>i9 Sales Force</Text>
      
         {this.state.loading==true? (
                    <View style={styles.loading}>
                        <ActivityIndicator size="large" color="#1976D2" />
                    </View>
                ):null}
     </View>
    )
  }
}
const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#fff'
    },
    loading: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default Splash;
