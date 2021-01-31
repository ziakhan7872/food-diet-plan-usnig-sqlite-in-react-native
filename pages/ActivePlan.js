import React from 'react';
import { FlatList, Text, View, StyleSheet, ScrollView } from 'react-native';
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
      tx.executeSql('SELECT * FROM Plan where ActiveStatus =1', [], (tx, results) => {
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
      <View style={{ height: 0.2, backgroundColor: '#000' }} />
    );
  };
  render() {
    return (
      <ScrollView>
        <View style={{ backgroundColor: '#fafafa' }}>
          <FlatList
            style={{ backgroundColor: '#757575', margin: 2, }}
            data={this.state.FlatListItems}
            ItemSeparatorComponent={this.ListViewItemSeparator}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <Card>
                <Text style={styles.id}>{item.PlanId}</Text>
                <View style={{ flexDirection: "row" }}>
                  <View>
                    <View key={item.PlanId}>
                      <Text style={styles.title}>Plan Name:{' '} {item.Title}</Text>
                      <Text style={styles.title}>Calories:{' '} {item.Calories} </Text>
                      <Text style={styles.title}>TotalDays:{' '} {item.TotalDays} </Text>
                    </View>
                  </View>
                </View>
              </Card>
            )}
          />
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  title: {

    textAlign: 'left',
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 40,
    color: '#000000',
    fontStyle: 'italic'
  },
  id: {

    textAlign: 'center',
    fontSize: 18,
    fontWeight: "bold",
    color: 'white',
    backgroundColor: '#a30000',
    width: 30,
    height: 30,
    borderRadius: 60,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
    fontStyle: 'italic'
  },
});
