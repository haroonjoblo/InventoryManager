import React, { Component } from 'react';
import { Alert, View, Text, Vibration, StyleSheet, Button } from 'react-native';
import { Camera } from 'expo-camera';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import Icon from 'react-native-vector-icons/FontAwesome';

import { BarCodeScanner } from 'expo-barcode-scanner';

export default class BarcodeScannerExample extends Component {
  state = {
    hasCameraPermission: null,
    scanned: false,
  };

  async componentDidMount() {
    this.getPermissionsAsync();
  }

  getPermissionsAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  render() {
    const { hasCameraPermission, scanned } = this.state;

    if (hasCameraPermission === null) {
      return <Text>Requesting for camera permission</Text>;
    }
    if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    }
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>



        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />

				<View style={{alignItems:'flex-end', marginTop:20,}}>
					<Icon 
						onPress={()=>{
							this.props.scannedCancelCallBack();
						}}
						name='times'
						size={40}
						style={{marginRight:5,marginBottom:3}}
						color='red'
					/>
				</View>


        {scanned && (
          <Button
            title={'Tap to Scan Again'}
            onPress={() => this.setState({ scanned: false })}
          />
        )}
      </View>
    );
  }

  handleBarCodeScanned = ({ type, data }) => {
    this.setState({ scanned: true });
    this.props.scannedCallBack(type,data);
  };
}
