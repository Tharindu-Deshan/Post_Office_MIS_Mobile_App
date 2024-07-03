import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { Table, Row, Rows } from 'react-native-table-component';

export default function TableDisplay({ tableHead, tableData }) {
  return (
    <ScrollView style={styles.container}>
      <Table borderStyle={{ borderWidth: 1, borderColor: '#C1C0B9' }}>
        <Row data={tableHead} style={styles.head} textStyle={styles.text} />
        <Rows data={tableData} textStyle={styles.text} />
      </Table>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  head: {
    height: 50,
    backgroundColor: '#f1f8ff',
  },
  text: {
    margin: 6,
    fontSize: 14, // Adjust the font size for better readability on smaller screens
  },
});
