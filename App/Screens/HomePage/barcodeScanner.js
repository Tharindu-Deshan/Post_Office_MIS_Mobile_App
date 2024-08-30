import React, { useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { RNCamera } from 'react-native-camera';

const BarcodeScanner = () => {
  const [barcode, setBarcode] = useState(null);

  const onBarCodeRead = (e) => {
    setBarcode(e.data);
  };

  return (
    <View style={styles.container}>
      <RNCamera
        style={styles.preview}
        onBarCodeRead={onBarCodeRead}
        captureAudio={false}
      />
      {barcode && (
        <View style={styles.barcodeTextContainer}>
          <Text style={styles.barcodeText}>Barcode: {barcode}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  barcodeTextContainer: {
    position: 'absolute',
    bottom: 50,
    left: 50,
    right: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  barcodeText: {
    color: 'white',
    fontSize: 20,
  },
});

export default BarcodeScanner;
