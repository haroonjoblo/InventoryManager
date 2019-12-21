import React from 'react';
import {StyleSheet,Text, FlatList, Button,View, TouchableOpacity } from 'react-native';
import Item from '../models/Item';
import {Input} from 'react-native-elements';
import Layout from '../constants/Layout';
import Icon from 'react-native-vector-icons/FontAwesome';
import ExpoScanner from '../components/ExpoScanner';
import ItemDetailsScreen from './ItemDetailsScreen';


class MainScreen extends React.Component {

  state= {
    items:[],
    itemId:0,
    searchText:null,
    barCodeScanScreen:false,
    scannedData:null,
    action:null,
    selectedItem:null,
  }

  readAllData() {
    Item.getAll().then((res) => {
      if (res.result) {
        this.setState({items:res.data});
      }
    }).catch((err) => {
      alert(err);
    });
  }

  componentDidMount() {
    this.readAllData();
  }

  scannedCallBackFunction = (type,data) => {
      this.setState({scannedData: data,barCodeScanScreen:false,searchText:data,itemId:data})
  }

  handleCloseItemDetailsView() {
    this.setState({action:''});
  }

  saveItemHandler = (id,name,description,price,quantity,action) => {
    let item = new Item(id,name,description,quantity,price);
    
    if (action=='new') {
      item.insert().then(res=>{
        if (res.result) {
            let items = this.state.items;
            let items2 = items.concat(res.data);
            this.setState({items:items2,action:'',searchText:item.id});    
        } else {
          alert(res.msg);
        }
      }).catch(err=>{alert(err)});
    } else if (action=='edit') {
      
      item.update([{name:"id",value:item.id}]).then(res=>{
        if (res.result) {
          let items = this.state.items;
          let index= items.findIndex(it=> it.id==item.id);
          items.splice(index, 1, res.data);
            this.setState({items:items,action:''});    
        } else {
          alert(res.msg);
        }
      }).catch(err=>{alert(err)});;
    } else if (action=='delete') {

      item.delete([{name:"id",value:item.id}]).then(res=>{
        if (res.result) {
          let items = this.state.items;
          let index= items.findIndex(it=> it.id==item.id);
          items.splice(index, 1);
          this.setState({items:items,action:''});         
        }
      });
    }

  }
  render() {
     if (this.state.action=='new' || this.state.action=='edit') {
      return (
        <ItemDetailsScreen action={this.state.action} handleCloseItemDetailsViewAction={()=>{this.handleCloseItemDetailsView()}} itemId={this.state.itemId} saveItemAction={this.saveItemHandler} item={this.state.selectedItem}/>
      );
     }
    if (this.state.barCodeScanScreen) {
      return (
        <ExpoScanner scannedCallBack = {this.scannedCallBackFunction} scannedCancelCallBack={()=>{this.setState({barCodeScanScreen:false})}}/>
      )
    }
    else {
      return (
        <View style={{marginTop:25}}>
          <View style={{flexDirection:'row',alignContent:"flex-start",width:Layout.window.width}}>
            <Input
              rightIcon={
                <Icon
                  onPress={()=>{
                    this.setState({barCodeScanScreen:true})
                  }}
                  name='barcode'
                  size={50}
                  style={{marginRight:5,marginBottom:3}}
                  color='black'
                />
              }
              inputContainerStyle={{borderBottomWidth:1,...styles.inputContainerStyle,height:styles.inputContainerStyle.height}}
              inputStyle={styles.inputStyle}
              placeholder='Scan BarCode to search, or type in name'
              onChangeText={text=>{
                  this.setState({itemId:text});
              }}
              value={this.state.itemId} 
            />
          </View>
          


         <FlatList
            style={{margin:10,marginBottom:45}}
            keyExtractor={item => item.id}
            data={( this.state.itemId!=0?this.state.items.filter(item=>item.id==this.state.itemId):(this.state.searchText==null?this.state.items:this.state.items.filter(item=>item.name.includes(this.state.searchText))))}
            ListEmptyComponent={()=>(
              <View>
                {(
                  <View>
                    <Text>This barcode you scanned {this.state.itemId} is not available, would you like to create it?</Text>
                    <Button
                      title={'Yes, Create new one'}
                      onPress={() => this.setState({ action:'new' })}
                    />
                  </View>
                )}
              </View> 
            )}
            renderItem={({item}) => (
               <TouchableOpacity style={{borderRadius:5}}  onPress={()=>{this.setState({ action:'edit',selectedItem:item})}}>
                  <View style={{marginBottom:5,...styles.itemView}}>
                  
                    <Text style={{fontWeight:"bold", fontSize:16,}}>
                      {item.id}
                    </Text>
                    <Text style={{fontSize:14,}}>
                      {item.name}
                    </Text>
                    <Text style={{fontSize:14,}}>
                      price: {item.price} :: quantity: {item.quantity}
                    </Text>                
                  </View>
                </TouchableOpacity>
            )}
    />         
        </View>
      )
    }
  }

}



const styles = StyleSheet.create({
    itemView:{
      padding:10,
      borderWidth:1,
      borderColor:'silver'
    },
    inputContainerStyle: {
        borderColor:'#181C32',
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


        

export default MainScreen;
  