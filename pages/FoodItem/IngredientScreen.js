import React, { Component } from 'react';
import { View, ScrollView, Alert, FlatList, Text, StyleSheet, Image } from 'react-native';

import { openDatabase } from 'react-native-sqlite-storage';

var db = openDatabase({ name: 'Dietplanproject.db', createFromLocation: 1 });
console.disableYellowBox = true;


export default class IngredientScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ItemName: '',
      Picture: null,
      ItemCategory: '',
      ShowFoodItem: '',
      ItemCalories: '',
      Sugar: '',
      Protien: '',
      Sodium: '',
      Fat: '',
      Carbs: '',
      Unit:'g'

    };
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM FoodItem', [], (tx, results) => {
        var temp = [];

        for (let i = 0; i < results.rows.length; ++i) {
          temp.push(results.rows.item(i));
        }
        this.setState({
          ShowFoodItem: temp,

        });

      });
    });
  }
  GetItem(ItemName) {
    Alert.alert(ItemName);
  }
  FlatListItemSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: '100%',
          backgroundColor: '#000',
          marginVertical: 10
        }}
      />
    );
  };

  render() {
    return (

      <ScrollView style={styles.container}>
        <FlatList
          data={this.state.ShowFoodItem}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={this.FlatListItemSeparator}
          renderItem={({ item }) => (
            <View style={{ flex: 1, flexDirection: 'row', width: '100%' }}>
              <View style={{ width: '60%', flexDirection: 'row' }}>
                <Image source={{
                  uri: 'data:image/jpeg;base64,' + item.Picture,
                }} style={styles.imageView} />


                <View style={styles.ItemName}>
                  <Text onPress={this.GetItem.bind(this, item.ItemName)} style={styles.ItemNametextView}> {item.ItemName} </Text>
                </View>
                <View style={styles.Ingredient}>

                  <Text style={styles.textViewCategory}><Text style={{ color: 'red',fontSize:16 }}>Category: </Text>{'        '}{item.ItemCategory}</Text>
                  <View style={{flexDirection:"row"}}>
                    <View>
                      <Text style={styles.textView}>Calories:{item.ItemCalories}{this.state.Unit}</Text>
                      <Text style={styles.textView}>Sugar:{item.Sugar}{this.state.Unit}</Text>
                      <Text style={styles.textView}>Protien:{item.Protien}{this.state.Unit}</Text>
                    </View>
                    <View>
                      
                      <Text style={styles.textView}>Sodium:{item.Sodium}{this.state.Unit}</Text>
                      <Text style={styles.textView}>Fat:{item.Fat}{this.state.Unit}</Text>
                      <Text style={styles.textView}>Carbs:{item.Carbs}{this.state.Unit} </Text>
                    </View>
                  </View>

                </View>

              </View>
              {/* <View style={styles.delete}>
                <TouchableOpacity onPress={() => this.removeItemValue(item.CatId)}>
                  <Icon name="trash" size={30} color="#900" />
                </TouchableOpacity>
              </View> */}
            </View>
          )}
        />

      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageView: {
    width: 70,
    height: 70,
    margin: 7,
    borderRadius: 60,
    marginRight: 15

  },
  ItemName: {
    // fontSize:18,
    // fontWeight:"bold",
    marginTop: 20,

  },
  Ingredient: {

    fontSize: 14,

  },
  textViewCategory: {
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 20,
  },
  ItemNametextView: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop:16
  },
  textView: {
    marginLeft: 15,
    fontSize: 16,
    marginRight:5
    
  }
});  