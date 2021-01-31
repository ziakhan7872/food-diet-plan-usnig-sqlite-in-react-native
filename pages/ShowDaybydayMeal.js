import React from 'react';
import { FlatList, Text, View, StyleSheet, Picker, ScrollView, YellowBox, Button, TouchableOpacity, Image } from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';
import Mybutton from './components/Mybutton';
console.disableYellowBox = true;
var db = openDatabase({ name: 'Dietplanproject.db', createFromLocation: 1 });

export default class ShowDaybydayMeal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      FlatListItems: [],
      TotalDays: "",
      DayNO: '',
      FlatListResult: '',
      Item_Name: '',
      ItemName: [],
      arrayFoods: '',
      arrayQuantity: '',
      flatlistarray: [],
      Breakfast: 'Breakfast',
      Lunch: 'Lunch',
      Dinner: 'Dinner',
      title: 'Vegetarian diet',
      Title: '',
      PlanId: '',
      fooditem: '',
      Sugar: '',
      fooditemlist: '',
      Unit: 'g',
      DetailPicture: '',
      arrayDetailPicture: '',
      arrayDetailCalories: '',
      today: '',
      datetime: '',
      Day: '',
      daysTill30June2035: '',
      expirydate: '',
      expiryPlan: '',
      backgroundColor2: 'black',
      backgroundColor: 'black',
      pressed: false,

    };





    ///=======================================PASSED PLANID FROM PLAN TO ITEM SCREEN======================================================
    db.transaction(tx => {
      const { PlanId } = this.props.route.params;


      tx.executeSql('SELECT * FROM Plan WHERE PlanId =?;', [PlanId], (tx, results) => {
        var temp = [];
        for (let i = 0; i < results.rows.length; ++i) {
          temp.push(results.rows.item(i));
        }
        this.setState({
          FlatListItems: temp,
          TotalDays: temp[0].TotalDays,
          Title: temp[0].Title,
          PlanId: temp[0].PlanId,
        });
      });
    });

    db.transaction(tx => {
      tx.executeSql('SELECT * FROM Plan WHERE ActiveStatus = 1', [], (tx, results) => {
        var temp = [];
        for (let i = 0; i < results.rows.length; ++i) {
          temp.push(results.rows.item(i));
        }
        this.setState({
          datetime: temp[0].datetime,
          expirydate: temp[0].TotalDays,
          expiryPlan: temp[0].PlanId,
        });
      });
    });





  }


  BreakFast = () => {

    var PlanId = this.state.expiryPlan;
    var day = this.state.Day;
    var breakfast = this.state.Breakfast;
    // alert(PlanId+'===='+day+'==='+breakfast)
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM PlanDetail WHERE PlanId=? AND MealTime=? AND DayNO=?;', [PlanId, breakfast, day], (tx, results) => {
        var temp = [];
        for (let i = 0; i < results.rows.length; ++i) {
          temp.push(results.rows.item(i));
          // console.log('DetailPictureDetailPicture'+json.stringify(temp))

        }
        if (temp && temp.length < 1) {
          alert('Breakfast section is empty')
        } else { }
        this.setState({
          FlatListResult: temp,
          arrayFoods: temp[0].Item_Name,
          arrayQuantity: temp[0].Quantity,
          arrayDetailPicture: temp[0].DetailPicture,
          arrayDetailCalories: temp[0].DetailCalories,
        });
      });
    });

  }

  Lunch = () => {
    var PlanId = this.state.expiryPlan;
    var day =  this.state.Day;
    var Lunch = this.state.Lunch;
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM PlanDetail WHERE PlanId=? AND MealTime=? AND DayNO=?;', [PlanId, Lunch, day], (tx, results) => {
        var temp = [];
        for (let i = 0; i < results.rows.length; ++i) {
          temp.push(results.rows.item(i));

        }
        if (temp && temp.length < 1) {
          alert('Lunch section is empty')
        } else { }
        this.setState({
          FlatListResult: temp,
          arrayFoods: temp[0].Item_Name,
          arrayQuantity: temp[0].Quantity,
          arrayDetailPicture: temp[0].DetailPicture,
          arrayDetailCalories: temp[0].DetailCalories,
        });
      });
    });
  }
  Dinner = () => {
    var PlanId = this.state.expiryPlan;
    var day = this.state.Day;
    var Dinner = this.state.Dinner;
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM PlanDetail WHERE PlanId=? AND MealTime=? AND DayNO=?;', [PlanId, Dinner, day], (tx, results) => {
        var temp = [];
        for (let i = 0; i < results.rows.length; ++i) {
          temp.push(results.rows.item(i));
        }
        if (temp && temp.length < 1) {
          alert('Dinner section is empty')
        } else { }
        this.setState({
          FlatListResult: temp,
          arrayFoods: temp[0].Item_Name,
          arrayQuantity: temp[0].Quantity,
          arrayDetailPicture: temp[0].DetailPicture,
          arrayDetailCalories: temp[0].DetailCalories,
        });
        // alert('arrayDetailPicture'+arrayDetailPicture)

      });
    });
  }
  ///=======================================FLAT LIST DESIGN======================================================
  ListViewItemSeparator = () => {
    return (
      <View style={{ height: 2, backgroundColor: '#000000', margin: 10 }} />
    );
  };

  ///=======================================RENDER METHOD======================================================

  render() {
    ////////=====================================
    //alert(this.state.datetime)
    var msDiff = new Date(this.state.datetime).getTime() - new Date().getTime();
    var daysdiff = Math.floor(msDiff / (1000 * 60 * 60 * 24));
    this.state.Day = (-(daysdiff));
   // alert(this.state.Day +' '+this.state.datetime)
   //alert(daysdiff)

    ////////=====================================

    //  const { today } = this.props.route.params;
    let FOODARRAY = [].concat(...this.state.fooditemlist);
    const { onChange } = this.props;
    ///=======================================SHOW DAYS=====================================================

    var tempDays = [];
    for (let i = 1; i <= parseInt(this.state.TotalDays); i++) {
      tempDays.push(i.toString());
    }
    // alert('this.state.SingleDay'+tempDays)
    let SingleDay = tempDays.map((s, i) => {
      return <Picker.Item key={i} value={parseInt(s)} label={s} />;

    });

    ///=======================================SHOW Data of Array in list=====================================================
    let myArray = this.state.arrayFoods.split(',');
    let myArray1 = this.state.arrayQuantity.split(',');
    let myArray2 = this.state.arrayDetailPicture.split(',');
    let myArray3 = this.state.arrayDetailCalories.split(',')
    let flatlistarray = [];

    for (let i = 1; i < myArray.length; i++) {
      const obj = { 'food': (myArray[i]), 'quantity': myArray1[i], 'picture': myArray2[i], 'DetailCal': myArray3[i] };
      
      flatlistarray.push(obj);
    }
    console.log("new arry" + JSON.stringify(flatlistarray));

    ///=======================================RETURN METHOD======================================================
    return (
      <ScrollView style={{ backgroundColor: '#c1ccc7' }}>
        <View style={styles.today}>
          <Text style={styles.daytoday}>DAY  {this.state.Day}</Text>
          <Image source={require('./components/Icon/today.png')} style={{ width: 30, height: 30, marginLeft: 15, backgroundColor: '#60ad5e' }} />
        </View>
        <View style={styles.MainContainer}>
          <FlatList
            data={this.state.FlatListItems}
            keyExtractor={(item, index) => index.toString()}
            renderItem={
              ({ item }) => (
                <View>

                  {/* <Text style={styles.txt}> TOTAL DAYS: {item.TotalDays}</Text> */}
                  {/* <Text style={styles.txt}> Name: {item.Title}</Text>
<Text style={styles.txt}> id: {item.PlanId}</Text> */}

                  {/* <View style={styles.Pickertxt}>
                    <Picker
                      style={styles.Pickerday}
                      selectedValue={this.state.DayNO}
                      onValueChange={(day) => this.setState({ DayNO: day })}
                    >

                      <Picker.Item label="SELECT DAY" value="1" />

                      {SingleDay}

                    </Picker>


                  </View> */}
                  <View style={styles.buttonstyle}>
                   
                    <View style={styles.BreakFast}>
                      <TouchableOpacity onPress={this.BreakFast.bind(this)} style={styles.appButtonContainerbreakfast}>
                        <Text style={styles.BreakFasttext}>BREAkFAST</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.Lunch}>
                      <TouchableOpacity onPress={this.Lunch.bind(this)} style={styles.appButtonContainerlunch}>
                        <Text style={styles.BreakFasttext}>LUNCH</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.Dinner}>
                      <TouchableOpacity onPress={this.Dinner.bind(this)} style={styles.appButtonContainerdinner}>
                        <Text style={styles.BreakFasttext}>DINNER</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                </View>
              )}
          />
          <View>
            <ScrollView style={{ backgroundColor: '#c1ccc7' }}>

              {/**=================================================== */}

              <FlatList
                data={flatlistarray}
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={this.ListViewItemSeparator}
                renderItem={({ item }) => (
                  <View style={{ backgroundColor: '#fafafa', margin: 10, padding: 3, marginVertical: 5, borderRadius: 8,borderWidth:5,borderColor:'#8d8d8d' }}>
                    <View style={{flexDirection:"row"}}>
                      <Image source={{
                        uri: 'data:image/jpeg;base64,' + item.picture,
                      }} style={styles.imageView} />


                      <View style={styles.ItemName}>
                        <Text style={styles.ItemNametextView}> {item.food} </Text>
                      </View>
                      <View style={styles.Ingredient}>
                        <Text style={styles.textView}>Cal:{item.DetailCal}</Text>
                        <Text style={styles.textView}>Qty: {item.quantity}</Text>
                      </View>

                    </View>

                  </View>
                )}
              />


            </ScrollView>
          </View>

        </View>

      </ScrollView>
    );
  }
}
///=======================================STYLE SHEET======================================================
const styles = StyleSheet.create({
  buttonstyle: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    width: '100%',
  },
  BreakFast: {
    borderColor: 'red',
    borderWidth: 2,
    width: 118,
    fontSize: 30,
    fontWeight: "bold",
    marginLeft: 10,
    borderTopLeftRadius: 30,
    borderBottomLeftRadius: 30

  },
  Lunch: {
    borderColor: 'red',
    // borderWidth: 2,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    width: 118,
    fontSize: 30,
    fontWeight: "bold",


  },
  Dinner: {
    borderColor: 'red',
    borderWidth: 2,
    width: 118,
    fontSize: 30,
    fontWeight: "bold",
    marginRight: 10,
    borderTopEndRadius: 30,
    borderBottomEndRadius: 30


  },
  appButtonContainerbreakfast: {
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
    //backgroundColor:this.state.backgroundColor,
    borderTopLeftRadius: 30,
    borderBottomLeftRadius: 30,
    


  },
  appButtonContainerlunch: {
    backgroundColor: 'rgba(52, 52, 52, 0.8)',



  },
  appButtonContainerdinner: {
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
    borderTopEndRadius: 30,
    borderBottomEndRadius: 30


  },
  BreakFasttext: {
    textAlign: "center",
    marginVertical: 5,
    fontSize: 14,
    fontWeight: "bold",
    color: '#ffffff',
  },
  txt: {
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 5,
    width: '35%',
    padding: 10,
    color: '#fafafa',
    backgroundColor: 'green',
    borderRadius: 20, marginLeft: 100, textAlign: "center"
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  title: {
    marginHorizontal: 7,
    backgroundColor: "#f4fffa",
    fontSize: 15,
    fontWeight: "bold",
    marginVertical: 2,
    paddingVertical: 20,
    paddingHorizontal: 10
  },
  Pickertxt: {
    marginHorizontal: 100,
    borderRadius: 20,
    margin: 7,
    borderWidth: 2,
    borderColor: '#2d1703',



  },
  today: {
    marginHorizontal: 150,
    borderRadius: 5,
    textAlign: "center",
    margin: 7,
    height: 50,
    backgroundColor: '#60ad5e',
    borderTopEndRadius: 10

  },
  Pickerday: {
    // fontSize:8,
    // fontWeight:"bold",
  },
  
  imageView: {
    width: 70,
    height: 70,
    margin: 7,
    borderRadius: 60,
    marginRight: 15,
   
  },
  ItemName: {
    width: 80,
    marginTop: 10,

  },
  Ingredient: {
    width: 50,
    flexDirection: "row",

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
    marginTop: 16,
  },
  textView: {
    justifyContent:"space-between",
    width:80,
    marginTop:27,
     fontSize: 16,
     marginLeft:5

  },
  daytoday: {
    textAlign: "center",
    backgroundColor: '#60ad5e',
    borderTopLeftRadius: 10,
    borderTopEndRadius: 10

  }

});
