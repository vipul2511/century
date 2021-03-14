import React, {Component} from 'react';  
import {Platform, StyleSheet, Text, View, Animated} from 'react-native';  
  
export default class ProgessBar extends Component {  
    state={  
        progressStatus: 0,  
    }  
    anim = new Animated.Value(0);  
    componentDidMount(){  
        this.onAnimate();  
    }  
    onAnimate = () =>{  
        this.anim.addListener(({value})=> {  
            this.setState({progressStatus: parseInt(value,10)});  
        });  
        Animated.timing(this.anim,{  
             toValue: 100,  
             duration: 5000,  
             useNativeDriver: true 
        }).start();  
    }  
  render() {  

    return ( 
        <View>
      <View style={styles.container}>  
            <Animated.View  
                style={[  
                    styles.inner,{width: this.state.progressStatus +"%"},  
                ]}  
            />   
      </View>  
      <Animated.Text style={styles.label}>  
                    {this.state.progressStatus }%  
            </Animated.Text>  
            {this.state.progressStatus===100? <Text>hello</Text>:null}
      </View> 
    );  
  }  
}  
const styles = StyleSheet.create({  
    container: {  
    width: "100%",  
    height: 40,  
    padding: 1,  
    borderColor: "black",  
    borderWidth: 3,  
    borderRadius: 5,  
    marginTop: 200,  
    justifyContent: "center",  
  },  
  inner:{  
    width: "100%",  
    height: 30,  
    borderRadius: 5,  
    backgroundColor:"#1976D2",  
  },  
  label:{  
    fontSize:23,  
    color: "black",  
    // position: "absolute",  
    // zIndex: 1,  
    alignSelf: "center",  
  }  
});  