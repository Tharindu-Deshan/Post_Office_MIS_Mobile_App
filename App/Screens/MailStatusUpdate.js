/*import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import Dropdown from '../Components/commonLayout/dropDown'

export default function MailStatusUpdate() {
    return (
        /*<View style={styles.container}>
          <Text style={styles.text}>Set the mail status of delivered mails</Text>
        </View>*/
        /*<View>
            <Text style={{fontWeight: 'bold',paddingTop:50,paddingLeft:50,fontSize:30}}>
                Set the status of the mails  
                {'\n'}   
            </Text>
            <Dropdown 
                label="Select Last Checkpoint : "
                placeholder={{label:'choose the last checkpoint',value:null}}
                items={[
                  { label: "691/B,Ella rd,Elptiya", value: "691/B,Ella rd,Elptiya" },
                  { label: "692/B,Ella rd,Elptiya", value: "692/B,Ella rd,Elptiya" },
                  { label: "696/B,Ella rd,Elptiya", value: "696/B,Ella rd,Elptiya" },
                ]}
            />    

              
              <Text>{'\n'}</Text>
              <Dropdown
                label="Select next Checkpoint : "
                placeholder={{label:'choose the next checkpoint',value:null}}
                items={[
                  { label: "691/B,Ella rd,Elptiya", value: "691/B,Ella rd,Elptiya" },
                  { label: "692/B,Ella rd,Elptiya", value: "692/B,Ella rd,Elptiya" },
                  { label: "696/B,Ella rd,Elptiya", value: "696/B,Ella rd,Elptiya" },
                ]}
              
              />
        </View>
)};*/
    
    /*const styles = StyleSheet.create({
      container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: 20,
      },
      text: {
        color: 'red',
        fontSize: 20,
      },
    });*/
    import { View, Text, StyleSheet } from 'react-native';
    import React, { useState } from 'react';
    import Dropdown from '../Components/commonLayout/dropDown';
    
    export default function MailStatusUpdate() {
      const [firstDropdownValue, setFirstDropdownValue] = useState(null);
    
      return (
        <View style={styles.container}>
          <Text style={styles.title}>
            {'\n'}
            Set the status of the mails    
          </Text>
          <Dropdown 
            label="Select Address  "
            placeholder={{ label: 'select address', value: null }}
            items={[
              { label: "691/B,Ella rd,Elptiya", value: "691/B,Ella rd,Elptiya" },
              { label: "692/B,Ella rd,Elptiya", value: "692/B,Ella rd,Elptiya" },
              { label: "696/B,Ella rd,Elptiya", value: "696/B,Ella rd,Elptiya" },
            ]}
          />
    
          
    
          <Dropdown
            label="Delivery Status of the mail. Delivered? or Undelivered?"
            placeholder={{ label: 'choose an option', value: null }}
            items={[
              { label: "Delivered", value: "Delivered" },
              { label: "Undelivered", value: "Undelivered" },
            ]}
            onValueChange={(value) => setFirstDropdownValue(value)}
          />
    
          {firstDropdownValue === 'Delivered' && (
            <Dropdown
              label="Select an option: "
              placeholder={{ label: 'choose an option', value: null }}
              items={[
                { label: "Option 1", value: "1" },
                { label: "Option 2", value: "2" },
                { label: "Option 3", value: "3" },
                { label: "Option 4", value: "4" },
              ]}
            />
          )}
        </View>
      );
    }
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        padding: 10,
      },
      title: {
        fontWeight: 'bold',
        paddingTop: 20,
        paddingLeft: 50,
        fontSize: 30,
      },
    });
    