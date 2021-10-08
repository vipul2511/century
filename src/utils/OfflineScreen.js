/* eslint-disable react-native/no-inline-styles */
import {useNavigation} from '@react-navigation/core';
import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import resp from 'rn-responsive-font';

const OfflineUserScreen = ({onTry}) => {
  const navigation = useNavigation();
  return (
    <View style={styles.parent}>
      <View
        style={{
          backgroundColor: '#fff',
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
       <Image source={require('../assets/image/Dog.jpeg')} style={{width:'100%',height:'65%',resizeMode:'contain'}} />
       
      </View>
      <View style={{marginLeft:'20%'}}>
      <Text style={{color: 'black', fontSize: 24}}>
          OOPS!
        </Text>
        <Text style={{color: 'black', fontSize: 24}}>
          NO INTERNET
        </Text>
        <Text style={{color: 'gray', fontSize: 17,marginTop:'5%'}}>
        Please check your network connection
        </Text>
        </View>
        <TouchableOpacity
          style={{
            alignSelf: 'center',
            marginTop: 24,
            borderRadius: 6,
            paddingHorizontal: 6,
            backgroundColor: '#2196F3',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-evenly',
            width: '60%',
            height:'7%'
          }}
          onPress={onTry}>
          <Text
            style={{color: '#fff', paddingLeft: '8%', fontWeight: 'bold'}}>
            TRY AGAIN
          </Text> 
        </TouchableOpacity>
    </View>
  );
};

export default OfflineUserScreen;

const styles = StyleSheet.create({
  parent: {flex: 1,backgroundColor:'#fff'},
  headerView: {
    flex: 0.1,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    elevation: 20,
  },
  BackButtonContainer: {
    flex: 0.2,
    marginLeft: 10,
    backgroundColor: 'white',
  },
  TitleContainer: {
    flexDirection: 'row',
    flex: 0.6,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  TitleStyle: {
    fontWeight: 'bold',
    color: 'black',
    fontSize: resp(20),
    textAlign: 'center',
  },
  LogoIconStyle: {
    margin: 5,
    height: 30,
    width: 30,
  },
  SearchContainer: {
    flex: 0.2,
    backgroundColor: '#fff',
  },
  backButtonStyle: {
    margin: 10,
    height: 20,
    width: 20,
  },
});
