import React from 'react';
import { FlatList, Text, View, StyleSheet, } from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';
import { Card } from 'react-native-elements';
var db = openDatabase({ name: 'Dietplanproject.db', createFromLocation: 1 });
console.disableYellowBox = true;
export default class ActivePlan extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      FlatListItems: [],
    };
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM Plan where ActiveStatus !=1', [], (tx, results) => {
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
      <View style={{ height: 0.2, width: '100%', backgroundColor: '#808080' }} />
    );
  };
  render() {
    return (
      <View>
        <FlatList
          data={this.state.FlatListItems}
          ItemSeparatorComponent={this.ListViewItemSeparator}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <Card title="List of Diet Plans">
              <View key={item.PlanId} style={{ backgroundColor: '#BCAAA4', padding: 20 }}>


                {/* <Text style={styles.title}>Id: {item.PlanId}</Text> */}
                <Text style={styles.title}>Title: {item.Title}</Text>
                {/* <Text style={styles.title}>Calories: {item.Calories}</Text>
  <Text style={styles.title}>ActiveStatus: {item.ActiveStatus}</Text>
  <Text style={styles.title}>TotalDays: {item.TotalDays}</Text> */}

              </View>
            </Card>
          )}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    marginTop: 10,
    paddingVertical: 8,
    borderWidth: 2,
    borderColor: "#20232a",
    borderRadius: 2,
    backgroundColor: "#EFEBE9",
    color: "#20232a",
    textAlign: "left",
    fontSize: 18,
    fontWeight: "bold",
    paddingLeft: 10,
    borderRadius: 30,
  }
});
