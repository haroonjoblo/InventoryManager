import React from "react";
import { StyleSheet } from "react-native";
import {Input} from 'react-native-elements';

export default ({value,onChangeText,rightIcon,leftIcon,placeholder,keyboardType, autoFocus}) => (
					<Input
						rightIcon={rightIcon}
						leftIcon={leftIcon}
						inputContainerStyle={{borderBottomWidth:1,...styles.inputContainerStyle,height:styles.inputContainerStyle.height}}
						inputStyle={{...styles.inputStyle}} 
						placeholder={placeholder}
						onChangeText={text=>{
							onChangeText(text);
						}}
						autoFocus={autoFocus}
						value={value}
						keyboardType={keyboardType}
					/>
);


const styles = StyleSheet.create({
	container:{
		margin:20,
		marginTop:35,
		backgroundColor:'#f5f0f0',
		flex:1,
		flexDirection:'column',
		borderColor:'black',
		borderWidth:1,
		borderRadius:10,
	},
    inputContainerStyle: {
        borderColor:'silver',
        borderWidth:1,
        backgroundColor:'white',
        height:50,
    },
    inputStyle:{
        fontSize:16,
        color:'#303665',
        padding:5,
    }	
})
