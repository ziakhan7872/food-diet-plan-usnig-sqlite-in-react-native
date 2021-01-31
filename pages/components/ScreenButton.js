
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
const ScreenButton = props => {
  return (
    <TouchableOpacity style={styles.button} onPress={props.customClick}>
      <Text style={styles.text}>{props.title}</Text>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
    //backgroundColor:'#255d00',
    padding: 10,
    marginTop: 20,
    marginRight: 35,
    marginLeft:45,
    borderRadius:20,
    marginVertical:30,
    paddingHorizontal:30
    //width:300,
    
   
    
     
  },
  text: {
    color: '#ffffff',
    fontSize:14,
    fontWeight:'bold',
    textTransform:"uppercase",
    includeFontPadding:false
  },
});
export default ScreenButton;