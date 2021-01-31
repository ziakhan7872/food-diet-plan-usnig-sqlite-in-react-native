import React from 'react';
import { FlatList, Text, View, StyleSheet, Image, Picker, ScrollView, Alert, YellowBox, ActivityIndicator, TouchableOpacity, Modal, TextInput } from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';
import Mybutton from './components/ScreenButton';
import { CheckBox, Icon } from 'react-native-elements';
import { Button } from 'react-native-paper';
import Dialog from "react-native-dialog";

console.disableYellowBox = true;
var db = openDatabase({ name: 'Dietplanproject.db', createFromLocation: 1 });

export default class Addfooditem extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      FlatListItems: [],
      TotalDays: "",
      items: '',
      Quant: 1,
      defaultValue: '1',
      MealTime: 0,
      DayNO: '',
      SelectedDay: "",
      Calories: "",
      TotalCalories: "",
      TakenCalories: 0,
      ItemName: "",
      Name: '',
      FCategory: '',
      Ingredient: '',
      Protein: '',
      Carbs: '',
      ids1: [],
      Unit: '',
      isChecked: false,
      PlanId: '',
      Item_Name: [],
      Quantity: [],
      Id: "",
      modalVisible: false,
      itemsIngredients: '',
      ItemCalories: '',
      itemId: '',
      Sugar: '',
      DetailCalories: [],
      DetailPicture: [],
      Picture: '',
      avatarSource: '',
      copyPlan: false,
      temp:[],
      temp1:[],
      temp2:[],
      temp3:[],
      temp4:[],
      temp5:[],
      
    };

    ///=======================================SELECT INGREDIENTS AND SHOW IN FLAT LIST======================================================
    db.transaction(tx => {

      tx.executeSql('SELECT * from Ingredient', [], (tx, results) => {
        var temp = [];
        for (let i = 0; i < results.rows.length; ++i) {
          temp.push(results.rows.item(i));
        }
        this.setState({
          Ingredient: temp,
          Protein: temp[0].Protein,
          Carbs: temp[0].Carbs,
          Unit: temp[0].Unit,
        });
      });
    });
    ///=======================================USED FOR ITEM CATEGORY======================================================
    db.transaction(tx => {
      tx.executeSql('SELECT * from FoodCategory', [], (tx, results) => {
        var categoriesResponse = [];
        for (let i = 0; i < results.rows.length; ++i) {
          categoriesResponse.push(results.rows.item(i));
        }

        this.setState({
          FCategory: categoriesResponse.data.data
          // ItemCalories: temp[0].ItemCalories,
          // ItemName: temp[0].ItemName,
        });
        // console.log('itemItemCalories===>' + this.state.ItemCalories)
      });
    });

    ///=======================================PASSED PLANID FROM PLAN TO ITEM SCREEN======================================================
    db.transaction(tx => {
      //  const { PlanId } = this.props.route.params;
      tx.executeSql('SELECT * FROM Plan WHERE ActiveStatus = 1;', [], (tx, results) => {
        var temp = [];
        for (let i = 0; i < results.rows.length; ++i) {
          temp.push(results.rows.item(i));
        }

        this.setState({
          FlatListItems: temp,
          TotalDays: temp[0].TotalDays,
          Calories: temp[0].Calories,
          PlanId: temp[0].PlanId,

        });
      });
    });
  }

  ///=======================================FLAT LIST DESIGN======================================================
  GetItem(ItemName) {
    Alert.alert(ItemName);
  }
  FlatListItemSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: '100%',
          backgroundColor: '#000000',
        }}
      />
    );
  };

  ///=======================================COUNT CALORIES======================================================
  isChecked1 = (itemId) => {
    const isThere = this.state.ids1.includes(itemId);
    return isThere;

  };
  toggleChecked1 = async (itemId, Picture, Calories, ItemName) => {
    //console.log('picturetestin===============>'+Picture)
    const ids1 = [...this.state.ids1, itemId];
    if (this.isChecked1(itemId)) {
      //Remove
      this.state.TakenCalories = parseInt(this.state.TakenCalories) - (parseInt(Calories)*this.state.Quant);
      this.setState({
        ...this.state,
        ids1: this.state.ids1.filter((id) => id !== itemId),
      });





    } else {
      //Add
      if (parseInt(this.state.Calories*this.state.Quant) >= parseInt(this.state.TakenCalories)) {
        this.state.TakenCalories = parseInt(this.state.TakenCalories) + parseInt(Calories*this.state.Quant);
        this.setState({
          Item_Name: this.state.Item_Name.push(ItemName),
          Quantity: this.state.Quantity.push(this.state.Quant),
          DetailCalories: this.state.DetailCalories.push(Calories),
          DetailPicture: this.state.DetailPicture.push(Picture),
        }, () => console.log('DetailCalories' + this.state.DetailCalories + '======DetailPicture====>' + this.state.DetailPicture)
        );

        this.setState({ ...this.state, ids1, });

      }
      if (parseInt(this.state.TakenCalories) >= parseInt(this.state.Calories)) {

        this.state.TakenCalories = this.state.TakenCalories - Calories;
        console.log(' this.state.TakenCalories' + this.state.TakenCalories)
        //=============================================================
        this.setState({ ...this.state, ids1: this.state.ids1.filter((id) => id !== itemId), });
        this.state.Item_Name.pop();
        this.state.Quantity.pop();
        this.state.DetailCalories.pop();
        this.state.DetailPicture.pop();



        console.log('takencalories======>>' + this.state.TakenCalories + '=======ItemName======>' + this.state.Item_Name +
          '====quantity====>' + this.state.Quantity + 'ItemCalories' + this.state.ItemCalories + '====DetailCalories===>' + this.state.DetailCalories);
        //=============================================================
        Alert.alert(
          'Cannot add more',
          'Calories limit has exceeded',
          [
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            { text: 'OK', onPress: () => console.log('OK Pressed') },
          ]
        );
      }
    }
  }
  ///=======================================INSERT MUTIPLE ITEM======================================================
  View_Item = () => {
    //const { today } = this.props.route.params;
    this.props.navigation.navigate('ShowDaybydayMeal', { PlanId: this.state.PlanId })
  }


  nextday = () => {
   // alert('Item_Name'+this.state.temp1+'=====Quantity=='+this.state.temp4+'=====DetailCalories===='+this.state.temp2)

    var that = this;
    let { DayNO } = this.state;
    const { MealTime } = this.state;
    const { temp1 } = this.state;
    const { temp4 } = this.state;
    const { PlanId } = this.state;
    const { temp3 } = this.state;
    const { temp2 } = this.state;
    
   // alert('Item_Name'+this.state.Item_Name+'=====Quantity=='+this.state.Quantity+'=====DetailCalories===='+this.state.DetailCalories)

    db.transaction(function (tx) {
      tx.executeSql(
        'INSERT INTO PlanDetail (DayNO,MealTime,Item_Name,Quantity,PlanId,DetailPicture,DetailCalories) VALUES (?,?,?,?,?,?,?)',
        [parseInt(DayNO) + 1, MealTime, temp1.join(","), temp4.join(","), PlanId, temp3.join(","), temp2.join(",")],
        (tx, results) => {
          console.log('Results' + 'Item_Name'+this.state.temp1.join(",")+'=====Quantity=='+this.state.temp4+'=====DetailCalories===='+this.state.temp2, results.rowsAffected);

          if (results.rowsAffected > 0) {

          }

          else {
            alert('Plan Failed');
          }

        });
    });
    Alert.alert(
      'Success',
      'second day Added',
      [
        {
          text: 'Ok',
          onPress: () => console.log('Ask me later pressed')
        },
      ],

      { cancelable: false }
    );
    
    this.setState(this.state.temp=[])
    this.setState(this.state.temp1=[])
    this.setState(this.state.temp2=[])
    this.setState(this.state.temp3=[])
    this.setState(this.state.temp4=[])
     
  }

  
  Add_Item = () => {
    var that = this;
    const { DayNO } = this.state;
    const { MealTime } = this.state;
    const { Item_Name } = this.state;
    const { Quantity } = this.state;
    const { PlanId } = this.state;
    const { DetailPicture } = this.state;
    const { DetailCalories } = this.state;
    if (DayNO) {
      if (MealTime) {
        if (Item_Name) {
          if (Quantity) {
            db.transaction(function (tx) {
              tx.executeSql(
                'INSERT INTO PlanDetail (DayNO,MealTime,Item_Name,Quantity,PlanId,DetailPicture,DetailCalories) VALUES (?,?,?,?,?,?,?)',
                [DayNO, MealTime, Item_Name.join(","), Quantity.join(","), PlanId, DetailPicture.join(","), DetailCalories.join(",")],
                (tx, results) => {
                  console.log('Results' + 'zia==DetailPicture==>' + DetailPicture.join(","), results.rowsAffected);

                  if (results.rowsAffected > 0) {

                  }

                  else {
                    alert('Plan Failed');
                  }
                }
              );


            });
            Alert.alert(
              'Success',
              'Do you want to copy this Plan for next day ?',
              [
                {
                  text: 'No',
                  onPress: () => console.log('Do not copy plan')
                },
                {
                  text: 'Yes',
                  onPress: () =>  this.nextday()
                },

              ],

              { cancelable: false }
            );
          }
          else {
            alert('Please  fill Quantity ');
          }
        }
        else {
          alert('Please choose Item');
        }
      } else {
        alert('Please choose MealTime');
      }
    } else {
      alert('Please choose DayNO');
    }
    this.state.temp=this.state.ids1;
    this.state.temp1=this.state.Item_Name;
    this.state.temp2=this.state.DetailCalories;
    this.state.temp3=this.state.DetailPicture;
    this.state.temp4=this.state.Quantity;

   // alert('temp===='+this.state.temp +'====temp1=='+this.state.temp1+'====temp2=='+this.state.temp2+'====temp4=='+this.state.temp4)
     // this.setState(this.state.ids1=[],this.state.Item_Name=[],this.state.DetailCalories=[],this.state.DetailPicture=[],this.state.Quantity=[])
      this.setState(this.state.ids1=[])
      this.setState(this.state.Item_Name=[])
      this.setState(this.state.DetailCalories=[])
      this.setState(this.state.DetailPicture=[])
      this.setState(this.state.Quantity=[])
  }
  ////////===========================================CATEGORY FUNCTION=============================================================
  getFood() {

    const a = this.state.FCategory;
    // console.log('change state A=======>>' + a)
    db.transaction(tx => {
      //  console.log('category testing============>>>' + a)
      tx.executeSql(' SELECT * FROM FoodItem  WHERE ItemCategory= ?; ', [a], (tx, results) => {
        var temp = [];

        for (let i = 0; i < results.rows.length; ++i) {
          temp.push(results.rows.item(i));
        }


        this.setState({
          items: temp,
          Picture: temp[0].Picture

        });
      });
    }
    );
  }
  ///=======================================SHOW INGREDIENTS AND SHOW IN MODEL======================================================
  openModel = (visible, item) => {
    this.setState({ modalVisible: visible });
    this.state.itemId = item.Id
    var b = this.state.itemId
    db.transaction(tx => {
      // console.log('category testing============>>>' + b)
      tx.executeSql(' SELECT * FROM FoodItem  WHERE Id= ?; ', [b], (tx, results) => {
        var temp = [];
        for (let i = 0; i < results.rows.length; ++i) {
          temp.push(results.rows.item(i));
        }
        this.setState({
          itemsIngredients: temp,

        });
      });
    }
    );

  }
  toggleModal(visible) {
    this.setState({ modalVisible: visible });
  }

  ///=======================================RENDER METHOD======================================================
  render() {

    const { onChange } = this.props;
    ///=======================================SHOW DAYS======================================================
    var tempDays = [];
    for (let i = 1; i <= parseInt(this.state.TotalDays); i++) {
      tempDays.push(i.toString());
    }
    let SingleDay = tempDays.map((s, i) => {
      return <Picker.Item key={i} value={parseInt(s)} label={s} />;
    });
    ///=======================================RETURN METHOD======================================================
    return (
      <ScrollView style={{ backgroundColor: '#c1ccc7' }}>
        <View style={styles.MainContainer}>
          <FlatList
            data={this.state.FlatListItems}
            keyExtractor={(item, index) => index.toString()}
            renderItem={
              ({ item }) => (
                <View>
                  <Text style={styles.txt}>Name: {item.Title}{'    '} Calories: {item.Calories}{'      '}Days: {item.TotalDays}</Text>
                  <Text style={styles.TakenCaloriestext}>Taken Calories: {this.state.TakenCalories}</Text>
                  <View style={{ flexDirection: "column", marginLeft: 30, marginRight: 30 }}>
                    <View>
                      <Picker
                        selectedValue={this.state.DayNO}
                        onValueChange={(day) => this.setState({ DayNO: day })}
                      >
                        <Picker.Item label="Select Day" value="1" />
                        {SingleDay}
                      </Picker>
                    </View>
                    <View>
                      <Picker selectedValue={this.state.MealTime}
                        onValueChange={
                          (itemValue, itemIndex) => this.setState({
                            MealTime: itemValue,
                            choosenindex: itemIndex
                          },()=>{this.setState(this.state.ids1=[])})
                        }>
                        <Picker.Item label="MealTime" value="MealTime" />
                        <Picker.Item label="Breakfast" value="Breakfast" />
                        <Picker.Item label="Lunch" value="Lunch" />
                        <Picker.Item label="Dinner" value="Dinner" />

                      </Picker>
                    </View>
                    <View>
                      <Picker
                        selectedValue={this.state.FCategory}
                        mode="dropdown"
                        onValueChange={(itemValue, itemIndex) => {
                          this.setState({ FCategory: itemValue })
                          this.handleTimeout = setTimeout(() => {
                            this.getFood()
                          }, 100)
                        }
                        }>
                        <Picker.Item label="Select One" value="Select One" style={{ fontSize: 40 }} />
                        <Picker.Item label="Fresh Fruit" value="Fresh Fruit" />
                        <Picker.Item label="Vegetable" value="Vegetable" />
                        <Picker.Item label="Beverages" value="Beverages" />
                        <Picker.Item label="Dry Fruits" value="Dry Fruits" />
                        <Picker.Item label="Dairy Products" value="Dairy Products" />
                        <Picker.Item label="Fast Food" value="Fast Food" />
                        <Picker.Item label="Meat,Poultry" value="Meat,Poultry" />
                        <Picker.Item label="Sweets & Desserts" value="Sweet & Desserts" />
                      </Picker>
                    </View>
                  </View>
                </View>
              )}
          />

          <FlatList
            data={this.state.items}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={this.FlatListItemSeparator}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => { this.openModel(true, item) }}>
                <View style={{ flex: 1, flexDirection: 'row' }}>

                  <View style={{ width: '77%', flexDirection: 'row' }}>
                    <View style={{ flexDirection: "row" }}>
                      <View style={{ width: '23%' }}>
                        <CheckBox
                          style={{ marginLeft: 1, flex: 0.02 }}
                          iconType="material"
                          checkedIcon="check-box"
                          uncheckedIcon="check-box-outline-blank"
                          checkedColor="green"
                          uncheckedColor="grey"
                          size={20}
                          checked={this.isChecked1(item.Id)}
                          onPress={() =>
                            this.toggleChecked1(
                              item.Id,
                              item.Picture,
                              item.ItemCalories,
                              item.ItemName,
                              item.Quant,

                            )}
                        />

                      </View>
                      <View style={{ width: '22%' }}>

                        <Image source={{
                          uri: 'data:image/jpeg;base64,' + item.Picture,
                        }} style={styles.imageView} />
                      </View>
                      <View style={{ marginLeft: 20, flexDirection: "row", marginTop: 20 }}>
                        <View>
                          <Text
                            onPress={this.GetItem.bind(this, item.ItemName)}
                            style={styles.textViewname}>
                            {item.ItemName}
                          </Text>
                          <Text style={styles.textView}>Cal: {item.ItemCalories}</Text>
                          <View style={styles.container}>
                            <Modal animationType={"slide"} transparent={true}
                              visible={this.state.modalVisible}
                              onRequestClose={() => { console.log("Modal has been closed.") }}>

                              <View style={styles.modal}>
                                <FlatList
                                  data={this.state.itemsIngredients}

                                  keyExtractor={(item, index) => index.toString()}
                                  renderItem={
                                    ({ item }) => (

                                      <View>


                                        <Text style={styles.ItemNametext}>{item.ItemName}</Text>
                                        {/* <Text style={styles.outertext}>Calories:<Text style={{ color: '#000000', marginHorizontal: 10 }}>{'      '}{item.ItemCalories}g</Text></Text> */}
                                        <Text style={styles.outertext}>Sugar:<Text style={{ color: '#000000', marginHorizontal: 10 }}>{'           '}{item.Sugar}g</Text></Text>
                                        <Text style={styles.outertext}>Protien:<Text style={{ color: '#000000', marginHorizontal: 10 }}>{'         '}{item.Protien}g</Text></Text>
                                        <Text style={styles.outertext}>Sodium:<Text style={{ color: '#000000', marginHorizontal: 10 }}>{'         '}{item.Sodium}g</Text></Text>
                                        <Text style={styles.outertext}>Fat:<Text style={{ color: '#000000', marginHorizontal: 10 }}>{'                 '}{item.Fat}g</Text></Text>
                                        <Text style={styles.outertext}>Carbs:<Text style={{ color: '#000000', marginHorizontal: 10 }}>{'             '}{item.Carbs}g</Text></Text>

                                      </View>
                                    )
                                  }
                                />
                                <TouchableOpacity onPress={() => { this.toggleModal(!this.state.modalVisible) }}>
                                  <Text style={styles.touchableok}>OK</Text>
                                </TouchableOpacity>
                              </View>
                            </Modal>
                          </View>
                        </View>
                      </View>
                    </View>

                  </View>

                  <View style={{ flexDirection: "row", marginRight: 5 }}>
                    <View>
                      <Text style={{ marginTop: 18, fontWeight: "bold" }}>QTY: </Text>
                    </View>
                    <View>
                      <TextInput
                        maxLength={1}
                        defaultValue={this.state.defaultValue}
                        underlineColorAndroid="transparent"
                        keyboardType="numeric"
                        style={styles.borderStyleinput}
                        onChangeText={Quant => this.setState({ Quant })}
                      />
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
        <View style={styles.btndesign}>
          <Mybutton
            title="Done"
            customClick={this.Add_Item.bind(this)}
          />
          <Mybutton
            title="View"
            customClick={this.View_Item.bind(this)}
          />
        </View>

      </ScrollView>
    );
  }
}

///=======================================STYLE SHEET======================================================
const styles = StyleSheet.create({
  MainContainer: {
    justifyContent: 'center',
    flex: 1,
    margin: 5,
    marginTop: 20,
  },
  imageView: {
    width: 60,
    height: 60,
    borderRadius: 60,
    marginTop: 5,
  },
  borderStyleinput: {
    backgroundColor: '#f008',
    borderColor: '#000',
    borderTopLeftRadius: 35,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    width: 35,
    height: 35,
    marginTop: 15,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: "bold",
  },
  textInput: {
    borderRadius: 30,
    marginTop: 30,
  },
  textView: {

    fontWeight: "bold",
    fontSize: 15,
    marginLeft: 5,
    marginTop: 5
  },
  textViewname: {
    width:100,
    fontWeight: "bold",
    fontSize: 15,
   // marginLeft: 5,
    marginTop: 5
  },
  textViewbody: {
    flexDirection: "column",
    padding: 10,
    color: '#000',
    fontSize: 20,
    flexWrap: 'wrap',
    marginHorizontal: 16,
    marginVertical: 8,
    fontFamily: 'Helvetica',
  },
  txt: {
    fontSize: 15,
    fontWeight: "bold"
  },
  container: {

    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
  },
  modal: {

    backgroundColor: "#00701a",
    height: 300,
    width: '60%',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'red',
    marginTop: 100,
    marginLeft: 70

  },
  modelstyle: {
    //width:'100%',
    flex: 1,
    backgroundColor: '#c1ccc7'
  },
  outertext: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 5,
    color: '#fafafa',
    marginLeft: 20
  },
  ItemNametext: {
    fontSize: 20,
    //fontWeight: "bold",
    textAlign: "center",
    backgroundColor: '#000000',
    color: '#fafafa',
    textAlign: "center",
    width: 100,
    height: 30,
    marginLeft: 50,
    marginTop: 20,
    borderRadius: 20,

  },
  TakenCaloriestext: {
    backgroundColor: "#00701a",
    height: 24,
    width: 170,
    textAlign: "center",
    borderRadius: 20,
    color: '#fafafa',
    marginHorizontal: 80,
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold"
  },
  touchableok: {
    fontSize: 18,
    backgroundColor: '#000000',
    width: 60,
    height: 30,
    marginLeft: 80,
    marginBottom: 20,
    borderRadius: 10,
    color: '#fafafa',
    textAlign: "center"
  },
  btndesign: {
    flexDirection: "row",
   // width: 300,
   // marginHorizontal: 50,
   // borderRadius: 10,
  }

});
