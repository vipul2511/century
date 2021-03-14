import React, { Component } from 'react';
import {View,Text,TouchableOpacity,TextInput,StyleSheet,BackHandler,Image} from 'react-native';
import resp from 'rn-responsive-font'
import Icon from 'react-native-vector-icons/Ionicons'
export default class ForgetPassword extends Component {
    constructor(props){
        super(props);
        this.state={
            emailID:''
        }
    }  
    validate = (text) => {
        console.log(text);
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (reg.test(text) === false) {
          alert('Please Enter validate Email ID');
          //console.log("Email is Not Correct");
          this.setState({ emailID: text })
          return false;
        }
        else {
         alert('Reset Password has been sent to the Register email');
        //   this.props.navigation.navigate('DashBoardScreen')
          console.log("Email is Correct");
        }
      }
    CheckTextInput = () => {
        if (this.state.emailID === '') {
          //Check for the Name TextInput
          alert('Please Enter Email ID ');
        }
        else {
          this.validate(this.state.emailID)
            // this.props.navigation.navigate('DashBoardScreen')
        }
      };
    render(){
        return(
            <View style={styles.container}>
              <View style={{marginTop:25,marginLeft:10}}>
                <Icon name="arrow-back" size={25} color="black" onPress={()=>{this.props.navigation.goBack()}}   />
              </View>
                <View style={styles.appName}>
                <Image
             source={require('../../assets/image/logo.jpeg')}
              style={styles.ImageView}
            />
                    <Text style={{fontWeight:'bold',fontSize:25}}>i9 Sales Force</Text>
                </View>
                <View style={{margin:10}}>
                <Text style={{fontWeight:'bold',fontSize:25}}>Forgot Password? </Text> 
                </View>
                <View style={styles.forgotTextInput}> 
                <Text style={styles.emailName}>Email ID</Text>
                <TextInput
                placeholder='Enter Email ID'
                placeholderTextColor='#000'
                underlineColorAndroid='#1976D2'
                style={styles.input}
                onChangeText={emailID => this.setState({ emailID })}
              />
              </View>
              <TouchableOpacity
              style={styles.loginButtonStyle}
              activeOpacity={0.2}
              onPress={() => {
               this.CheckTextInput()
              }}>
              <Text style={styles.buttonWhiteTextStyle}>SUBMIT</Text>
            </TouchableOpacity>
            </View>
        )
    }
}
const styles = StyleSheet.create({
 container:{
     flex:1,
     backgroundColor:'#fff'
 },
 appName:{
     flex:0.5,
     justifyContent:'center',
     alignItems:'center'
 },
 ImageView:{

 },
 emailName:{
    margin:10,fontWeight:"bold",fontSize:14,
 },
 forgotTextInput:{
  margin:10,
  marginTop:55
 },
 input: {
    color: 'black',
    padding: 10,
    textAlign: 'left',
  },
  loginButtonStyle: {
    marginTop: 20,
    width: resp(350),
    height: resp(50),
    padding: 10,
    backgroundColor: '#1976D2',
    borderRadius: 40,
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
  },
  buttonWhiteTextStyle: {
    textAlign: 'center',
    fontSize: resp(16),
    color: 'white',
    alignContent: 'center',
  },
});