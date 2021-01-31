import React from 'react';
import { FlatList, Text, View, StyleSheet, } from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';
import { Card } from 'react-native-elements';
var db = openDatabase({ name: 'Dietplanproject.db', createFromLocation: 1 });
console.disableYellowBox = true;
export default class ViewAllPlan extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      FlatListItems: [],
    };
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM Plan', [], (tx, results) => {
        var temp = [];
        for (let i = 0; i < results.rows.length; ++i) {
          temp.push(results.rows.item(i));
        }
        this.setState({
          FlatListItems: temp,
        });
      });
    });
  }
  ListViewItemSeparator = () => {
    return (
      <View style={{ height: 1, backgroundColor: '#000000', marginLeft: 17, marginBottom:5,marginTop:5, marginRight: 17 }} />
    );
  };
  render() {
    return (
      <View style={{ backgroundColor: '#c1ccc7',flex:1 }}>
        <FlatList
          data={this.state.FlatListItems}
          ItemSeparatorComponent={this.ListViewItemSeparator}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
           
              
              <View key={item.PlanId} style={{ backgroundColor: '#4b636e', padding: 5, borderRadius: 8,margin:10,marginLeft:10 }}>
                <Text style={styles.title}>Name: {item.Title}</Text>
                <Text style={styles.title}>Calories: {item.Calories}</Text>
                <Text style={styles.title}>Days: {item.TotalDays}</Text>
                <Text style={styles.title}>Status: {item.ActiveStatus?'Active':'Inactive'}</Text>

              </View>
            
          )}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    paddingLeft:10,
    backgroundColor: "#fafafa",
  //  textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    //fontStyle: 'italic',
    color: '#000000',
    // borderRadius: 5,
    // textShadowRadius: 1,
    
  }
});
