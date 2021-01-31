import React from 'react';
import { StyleSheet, View, Image, ScrollView, Picker, Text, FlatList, Alert, TouchableOpacity, ImageBackground } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import Mytextinput from '../components/TextinputItemscreen';
import Mybutton from '../components/Mybutton';
import { openDatabase } from 'react-native-sqlite-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Left } from 'native-base';
var db = openDatabase({ name: 'Dietplanproject.db' });
console.disableYellowBox = true;
const options = {
  title: 'Select Image',
  takePhotoButtonTitle: 'Take photo with your camera',
  chooseFromLibraryButtonTitle: 'Choose photo from library',
}


export default class FoodItemScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ItemName: '',
      avatarSource: null,
      Picture: null,
      ItemCategory: '',
      FlatListItems: [],
      Name: '',
      ShowFoodItem: '',
      refreshing: false,
      ItemCalories: '',
      Sugar: '',
      Protien: '',
      Sodium: '',
      Fat: '',
      Carbs: '',

    }
    db.transaction(function (tx) {
      tx.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='FoodItem'",
        [],
        function (tx, res) {
          console.log('item:', res.rows.length);
          if (res.rows.length == 0) {
            tx.executeSql('DROP TABLE IF EXISTS FoodItem', []);
            tx.executeSql(
              'CREATE TABLE IF NOT EXISTS FoodItem(FoodItemid INTEGER PRIMARY KEY AUTOINCREMENT, ItemName VARCHAR(20),ItemCalories VARCHAR(20), Picture BLOB, ItemCategory INTEGER,CONSTRAINT fk_CatId FOREIGN KEY (CatId) REFERENCES FoodCategory(CatId)',
              []
            );
          }
        }
      );
    });
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM FoodCategory', [], (tx, results) => {
        var temp = [];

        for (let i = 0; i < results.rows.length; ++i) {
          temp.push(results.rows.item(i));
        }
        this.setState({
          FlatListItems: temp,

        });

      });
    });
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

  myfun = () => {
    ImagePicker.showImagePicker(options, (Picture) => {
      console.log('Picture = ', Picture);


      if (Picture.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (Picture.error) {
        console.log('Image Picker Error: ', Picture.error);
      }
      else {

        let source = { uri: 'data:image/jpeg;base64,' + Picture.data };
        this.setState({
          avatarSource: source,
          Picture: Picture.data,

        });
      }
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
          marginVertical: 20
        }}
      />
    );
  };

  uploadPic = () => {

    var that = this;
    const { ItemName } = this.state;
    const { Picture } = this.state;
    const { ItemCategory } = this.state;
    const { ItemCalories } = this.state;
    const { Sugar } = this.state;
    const { Protien } = this.state;
    const { Sodium } = this.state;
    const { Fat } = this.state;
    const { Carbs } = this.state;
    console.log('ItemName====>' + ItemName + '===>ItemCategory===>' + ItemCategory + '===>ItemCalories===>' + ItemCalories + '===>Sugar===>' + Sugar
      + '===>Protien===>' + Protien + '===>Sodium===>' + Sodium + '===>Fat===>' + Fat + '===>Carbs===>' + Carbs)



    if (ItemName) {
      if (Picture) {
        if (ItemCategory) {
          if (ItemCalories) {

            db.transaction(function (tx) {
              tx.executeSql(
                'INSERT INTO FoodItem(ItemName,Picture, ItemCategory,ItemCalories,Sugar,Protien,Sodium,Fat,Carbs) VALUES (?,?,?,?,?,?,?,?,?)',
                [ItemName, Picture, ItemCategory, ItemCalories, Sugar, Protien, Sodium, Fat, Carbs],
                (tx, results) => {
                  console.log('Results', results.rowsAffected);
                  if (results.rowsAffected > 0) {
                    Alert.alert(
                      'Success',
                      'Food Item Created Successfully',
                      [
                        {
                          text: 'Ok',
                          onPress: () =>
                            that.props.navigation.navigate('IngredientScreen'),
                        },
                      ],
                      { cancelable: false }
                    );
                  } else {
                    alert('Plan Failed');
                  }
                }
              );
            });
          } else {
            alert('please fill Calories');

          }
        } else {
          alert('Please slect Category');
        }
      } else {
        alert('Please Select Image');
      }
    } else {
      alert('Please fill ItemName');
    }
  }
  render() {

    return (
      <ScrollView style={styles.container}>
        <View>
          <View>
            <Text style={{ fontWeight: 'bold', marginHorizontal: 5, color: '#000000', fontSize: 15 }}>
              Please add food item with all required information as per 100 gram
</Text>
          </View>
          <View>
            <Mytextinput
              placeholder="Item Name"
              onChangeText={ItemName => this.setState({ ItemName })}
              style={{ padding: 10, height: 40 }}
            />
            <View style={{ flexDirection: "row" }}>
              <View style={{ width: 180 }}>
                <Mytextinput
                  placeholder="Calories"
                  onChangeText={ItemCalories => this.setState({ ItemCalories })}
                  maxLength={10}
                  keyboardType="numeric"
                  style={{ paddingHorizontal: 32, height: 40 }}

                />
              </View>
              <View style={{ width: 180 }}>
                <Mytextinput
                  placeholder="Sugar"
                  onChangeText={Sugar => this.setState({ Sugar })}
                  maxLength={10}
                  keyboardType="numeric"
                  style={{ paddingHorizontal: 33, height: 40 }}
                />
              </View>
            </View>
            <View style={{ flexDirection: "row" }}>
              <View style={{ width: 180 }}>
                <Mytextinput
                  placeholder="Protien"
                  onChangeText={Protien => this.setState({ Protien })}
                  maxLength={10}
                  keyboardType="numeric"
                  style={{ paddingHorizontal: 32, height: 40 }}

                />
              </View>
              <View style={{ width: 180 }}>
                <Mytextinput
                  placeholder="Sodium"
                  onChangeText={Sodium => this.setState({ Sodium })}
                  maxLength={10}
                  keyboardType="numeric"
                  style={{ paddingHorizontal: 33, height: 40 }}

                />
              </View>
            </View>
            <View style={{ flexDirection: "row" }}>
              <View style={{ width: 180 }}>
                <Mytextinput
                  placeholder="Fat"
                  onChangeText={Fat => this.setState({ Fat })}
                  maxLength={10}
                  keyboardType="numeric"
                  style={{ paddingHorizontal: 32, height: 40 }}

                />
              </View>
              <View style={{ width: 180 }}>
                <Mytextinput
                  placeholder="Carbs"
                  onChangeText={Carbs => this.setState({ Carbs })}
                  maxLength={10}
                  keyboardType="numeric"
                  style={{ paddingHorizontal: 33, height: 40, }}

                />
              </View>
            </View>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <View style={{ width: 150, marginLeft: 15, backgroundColor: '#fafafa', marginTop: 10, height: 100, borderRadius: 15, borderWidth: 2, borderColor: '#795548' }}>
              <Picker
                selectedValue={this.state.ItemCategory}
                mode="dropdown"
                onValueChange={(itemValue, itemIndex) =>
                  this.setState({ ItemCategory: itemValue })
                }>

                <Picker.Item label="Select One" value="Select One" />
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
            <View style={{ width: 180 }}>
              {/* 
<TouchableOpacity onPress={this.myfun} style={styles.imagestyle}>
<Image source={this.state.avatarSource}
style={{ width: 150, height: 100,marginLeft:15, borderRadius: 20, backgroundColor: '#fafafa', marginTop: 10, borderWidth: 2, borderColor: '#795548' }} />
<Icon name="camera" size={20} color="#757575" style={styles.camera} />
</TouchableOpacity> */}


              <TouchableOpacity onPress={this.myfun} style={{ width: 150, height: 100, marginLeft: 15, borderRadius: 20, backgroundColor: '#fafafa', marginTop: 10, borderWidth: 2, borderColor: '#795548' }}>
                <ImageBackground source={require('../components/Icon/ImageUpload.png')} style={{ width: 80, height: 80, marginLeft: 35 }}>


                  <Image source={this.state.avatarSource} style={{

                    height: 90,
                    width: 90,
                  }} />
                </ImageBackground>
              </TouchableOpacity>

            </View>


          </View>
          <Mybutton
            title="SAVE"
            customClick={this.uploadPic.bind(this)}
          />
        </View>

      </ScrollView>
    );

  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#c1ccc7',
    flex: 1,

  },


  imageView: {
    width: 100,
    height: 100,
    margin: 7,
    borderRadius: 60,
    marginRight: 20

  },

  textView: {
    flex: 1,
    color: 'black',
    fontSize: 15,
    fontWeight: 'bold',
    paddingTop: 2,
    marginVertical: 8,
    flexDirection: "column",
    flexWrap: 'wrap',
    marginRight: 100,



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
  camera: {
    width: 120,

    marginHorizontal: 80,

  },
  delete: {
    //marginLeft:120,
    marginTop: 30,
    right: 0,
    marginLeft: 110,
    marginRight: 20,
    justifyContent: "space-around"

  },
  imagestyle: {

  }
})