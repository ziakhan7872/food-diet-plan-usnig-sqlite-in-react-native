/*Custom TextInput*/
import React from 'react';
import { View, TextInput } from 'react-native';
const TextinputItemscreen = props => {
  return (
    <View
      style={{
        marginLeft: 15,
        marginRight: 15,
        marginTop: 10,
        borderColor: '#795548',
        backgroundColor:'#fafafa',
        borderWidth: 2,
        borderRadius:15,
        
      }}>
      <TextInput
        underlineColorAndroid="transparent"
        placeholder={props.placeholder}
        placeholderTextColor="#000a12"
        keyboardType={props.keyboardType}
        onChangeText={props.onChangeText}
        returnKeyType={props.returnKeyType}
        numberOfLines={props.numberOfLines}
        multiline={props.multiline}
        onSubmitEditing={props.onSubmitEditing}
        style={props.style}
        blurOnSubmit={false}
        value={props.value}
      />
    </View>
  );
};
export default TextinputItemscreen;