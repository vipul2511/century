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
} from 'react-native';
import MainNavigator from './src/navigation/mainavigation';
class App extends Component{
  componentDidMount(){

  }
  render(){
    return <MainNavigator />
  }
}

const styles = StyleSheet.create({
 
});

export default App;
