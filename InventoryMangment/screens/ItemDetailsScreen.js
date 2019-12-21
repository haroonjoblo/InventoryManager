import React from 'react';
import { StyleSheet, View,Alert} from 'react-native';
import Item from '../models/Item';
import Layout from '../constants/Layout';
import Icon from 'react-native-vector-icons/FontAwesome';
import TextInput from '../components/TextInput';
import { Button } from 'react-native-elements';
import Helper from '../helper/Helper';
import axios from 'axios';
import Config from '../constants/Config';

class ItemDetailsScreen extends React.Component {
	state={
		id:0,
		name:'',
		description:'',
		quantity:'1',
		price:0,
	}

	componentDidMount() {
		this.setState({id:this.props.itemId});
		if (this.props.action=='edit') {
			let selItem=this.props.item;
			this.setState({id:selItem.id,name:selItem.name,description:selItem.description,quantity:selItem.quantity,price:selItem.price});
		}
	}

	save() {
			this.props.saveItemAction(this.state.id,this.state.name,this.state.description,this.state.price,this.state.quantity,this.props.action);
	}

	delete() {
			this.props.saveItemAction(this.state.id,this.state.name,this.state.description,this.state.price,this.state.quantity,"delete");
	}

	findOnEbay() {
		 Helper.timeout(axios.get(Config.ebaySearchURL.replace("???",this.state.id))).then(response=>{
							debugger;
							let prodName="";
							let prodPrice="";
                            try{
								let titletag="<h3 class=\"lvtitle\">";
								let titleTag2="\">";
								let pricetag="<span class=\"s-item__price\">";

                                let bodyText = response.data;
                                let x=bodyText.indexOf(titletag);
								let xx=bodyText.substr(x+titletag.length+1).indexOf(titleTag2);
								let xxx=bodyText.substr(x).substr(xx+titleTag2.length).indexOf("</a>");
								prodName=bodyText.substr(x).substr(xx+titleTag2.length,xxx);
								
								x=bodyText.indexOf(pricetag);
								xx=bodyText.substr(x).indexOf("</span>");
								prodPrice=bodyText.substr(x+pricetag.length,xx);
								
								this.setState({name:prodName,price:prodPrice})
                            } catch(error) {
                                alert('no matches found on ebay');
                            }  
		 });
	}

	render() {
		return(
			<View style={styles.container}>
				<View style={{alignItems:'flex-end', marginBottom:10,}}>
					<Icon 
						onPress={()=>{
							this.props.handleCloseItemDetailsViewAction();
						}}
						name='times'
						size={40}
						style={{marginRight:5,marginBottom:3}}
						color='black'
					/>
				</View>
				<View style={{flexDirection:'column', alignContent:'space-between'}}>
					<TextInput
						rightIcon={
							<Icon
							onPress={()=>{
								this.setState({barCodeScanScreen:true})
							}}
							name='barcode'
							size={50}
							style={{marginRight:5,marginBottom:3}}
							color='black'
							/>} 
						placeholder='BarCode or Item ID'
						onChangeText={text=>{
							this.setState({id:text});
						}}
						value={this.state.id}
					/>
					<View style={{margin:5}}/>
					<TextInput
						placeholder='Item Price'
						onChangeText={text=>{
							this.setState({price:text});
						}}
						value={this.state.price}
						keyboardType='numeric'
						autoFocus={true}
					/>			
					<View style={{margin:5}}/>
					<TextInput
						placeholder='Item Quantity'
						onChangeText={text=>{
							this.setState({quantity:text});
						}}
						value={this.state.quantity} 
						keyboardType='numeric'
					/>		
					<View style={{margin:5}}/>
					<TextInput
						placeholder='Item Name'
						onChangeText={text=>{
							this.setState({name:text});
						}}
						value={this.state.name}
					/>	
					<View style={{margin:5}}/>
					<TextInput
						placeholder='Item Description'
						onChangeText={text=>{
							this.setState({description:text});
						}}
						value={this.state.description}
					/>	
				
					<Button title="Save" onPress={()=>{this.save()}} style={{margin:10}}/>		
					<Button title="Delete" onPress={()=>{
						Alert.alert(
						'Deleting Item',
						'Are you sure you want to delete?',
						[
							{
							text: 'No',
							onPress: () => {},
							},
							{text: 'Yes', onPress: () => this.delete()},
						],
						{cancelable: false},
						);
						}} 
						style={{margin:10, }} buttonStyle={{backgroundColor:'red'}}/>

					<Button title="Find Info on Ebay" onPress={()=>{this.findOnEbay()}} />
				</View>
			</View>
		);
	}
}

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
	}
})

export default ItemDetailsScreen;
