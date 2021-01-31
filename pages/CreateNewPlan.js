import React, { Component } from 'react';
import { View, ScrollView, KeyboardAvoidingView, TouchableOpacity, Alert, Switch, FlatList, Text, StyleSheet, Modal, Image } from 'react-native';
import Mytextinput from './components/Mytextinput';
import Mybutton from './components/Mybutton';
import { openDatabase } from 'react-native-sqlite-storage';
import { Tooltip } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { BottomNavigation } from 'react-native-paper';
import { Right } from 'native-base';


var db = openDatabase({ name: 'Dietplanproject.db', createFromLocation: 1 });
console.disableYellowBox = true;

var a;
export default class CreateNewPlan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false, //state of modal default false  
      modalVisible: false,
      Title: '',
      PlanId: '',
      Calories: '',
      ActiveStatus: true,
      Status: '',
      TotalDays: '',
      ViewAllPlan: [],
      datetime: '',
      Day: '',
      daysTill30June2035: '',
      expirydate: '',
      expiryPlan: '',
      isFetching: false
    };
    ////////////======================================================Select Plan=====================================
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM Plan', [], (tx, results) => {
        var temp = [];
        for (let i = 0; i < results.rows.length; ++i) {
          temp.push(results.rows.item(i));
        }
        this.setState({
          ViewAllPlan: temp,
          // datetime: temp[4].datetime,
        });
      });
    });
    ////////////======================================================Date Time=====================================
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

  componentDidMount() {
    this.state.isFetching = false;

  }


  ////////////======================================================Flat list Design=====================================
  ListViewItemSeparator = () => {
    return (
      <View style={{ height: 2, backgroundColor: '#000000', margin: 10 }} />
    );
  };
  ////////////======================================================Toggle button =====================================
  toggleSwitch = (value) => {
    if (value == true) {
      this.setState({ ActiveStatus: value })
    }
    else if (value == false) {
      value = '0'
      this.setState({ ActiveStatus: value })
    }
    else { }

  }
  ////////////======================================================Delete Plan=====================================
  removeItemValue(PlanId) {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM  Plan where PlanId=?',
        [PlanId],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            Alert.alert(
              'Success',
              'Plan deleted successfully',
            );
          }
        }
      );
    });
  };

  onRefresh() {
    this.setState({ isFetching: true }, () => {
      this.componentDidMount();
    });
  }

  switchscreen = () => {

    var that = this;
    that.props.navigation.navigate('Addfooditem')
  }
  ////////////======================================================Create Plan=====================================
  register_plan = () => {
    var that = this;
    const { Title } = this.state;
    const { Calories } = this.state;
    const { ActiveStatus } = this.state;
    const { TotalDays } = this.state;
    var datetime = new Date();
   
    //  alert(date)
    if (Title) {
      if (Calories) {
        if (ActiveStatus) {
          if (TotalDays) {
            //alert('ActiveStatus'+ActiveStatus)
            db.transaction(function (tx) {
              tx.executeSql(
                'INSERT INTO Plan (Title, Calories, ActiveStatus ,TotalDays,datetime) VALUES (?,?,?,?,?)',
                [Title, Calories, ActiveStatus, TotalDays, datetime.toString()],
                (tx, results) => {
                  console.log('Results', results.rowsAffected);
                  if (results.rowsAffected > 0) {
                    Alert.alert(
                      'Success',
                      'Plan Created Successfully',
                      [
                        {
                          text: 'Ok',
                          onPress: () =>
                            that.props.navigation.navigate('Addfooditem'),
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
            alert('Please fill TotalDays');
          }
        } else {
          alert('Please change Status');
        }
      } else {
        alert('Please fill Calories');
      }
    } else {
      alert('Please fill Title');
    }
    //this.props.navigation.navigate('Addfooditem', { today: this.state.Day })
  }
  ////////////======================================================Second mode for status pass by id=====================================
  toggleModal(visible, PlanId) {
    this.setState({ modalVisible: visible });
    this.searchPlan(PlanId)
    // setTimeout(() => this.updatePlan(PlanId), 500)


  }
  ////////////======================================================Pass Id from one Screen to next=====================================
  Addfooditem_plan = (PlanId, ActiveStatus) => {
    if (ActiveStatus === 1) {

      this.props.navigation.navigate('ShowDaybydayMeal', { PlanId: PlanId })
      this.props.navigation.navigate('ShowDaybydayMeal', { today: this.state.Day })
    }
    else {
      Alert.alert(
        'This plan status is Inactive',
        'Tap on status to active plan',
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
  ////////////======================================================Search Plan and show status data=====================================
  searchPlan = (PlanId) => {
    a = PlanId;
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM Plan where Planid = ?',
        [a],
        (tx, results) => {
          var len = results.rows.length;
          console.log('len', len);
          if (len > 0) {
            console.log(results.rows.item(0).Calories);
            this.setState({
              Title: results.rows.item(0).Title,
            });
            this.setState({
              Calories: results.rows.item(0).Calories,
            });
            this.setState({
              ActiveStatus: results.rows.item(0).ActiveStatus,
            });
            this.setState({
              TotalDays: results.rows.item(0).TotalDays,
            });
          } else {
            // alert('No status found');
            this.setState({
              Title: '',
              Calories: '',
              ActiveStatus: '',
              TotalDays: '',
            });
          }
        }
      );
    }

    );
  };
  ////////////======================================================Update Status=====================================

  updatePlan = () => {
    var that = this;
    // const { Title } = this.state;
    // const { Calories } = this.state;
    //const { TotalDays } = this.state;
    const { ActiveStatus } = this.state;


    //    if (TotalDays) {
    if (ActiveStatus) {
      db.transaction((tx) => {
        tx.executeSql(
          'UPDATE Plan set ActiveStatus=? where PlanId=?',
          [ActiveStatus, a],
          (tx, results) => {
            console.log('Results', results.rowsAffected);
            if (results.rowsAffected > 0) {
              Alert.alert('Success', 'Status Change',
                [
                  { text: 'Ok', onPress: () => that.props.navigation.navigate('HomeScreen') },
                ],
                { cancelable: false }
              );
            } else {
              alert('Status Failed');
            }
          }
        );
      });

    } else {
      alert('Please change state');
    }
    //   } else {
    //     alert('Please fill TotalDays');
    //   }
    //   } else {
    //     alert('Please fill Calories');
    //   }
    // } else {
    //   alert('Please fill Title');
    // }
  };
  ////////////======================================================render method =====================================
  render() {

    //alert(this.state.datetime)
    var msDiff = new Date(this.state.datetime).getTime() - new Date().getTime();
    var daysdiff = Math.floor(msDiff / (1000 * 60 * 60 * 24));
    this.state.Day = (-(daysdiff));
   //alert(daysdiff)


    ///////////////============================================================
    var someDate = new Date(this.state.datetime);
    var numberOfDaysToAdd = this.state.expirydate;
    someDate.setDate(someDate.getDate() + numberOfDaysToAdd);
    someDate.setHours(0, 0, 0, 0)
   // console.log('somedate ======' + someDate)

    // var newdate  = new Date("2020-09-20T12:00:00Z")
    var newdate = new Date(new Date());
    newdate.setHours(0, 0, 0, 0)

  //  console.log('newdate=======>' + newdate)
    if (someDate.toJSON() === newdate.toJSON()) {
      Alert.alert(
        'your diet plan is expire',
        'Please use other plan or create new plan',
        [
          {
            text: 'Ok',
            onPress: () => this.props.navigation.navigate('CreateNewPlan')
          },
        ],
      );

      var expireplan = this.state.expiryPlan;

      db.transaction((tx) => {
        tx.executeSql(
          'UPDATE Plan set ActiveStatus=0 where PlanId=?',
          [expireplan],
          (tx, results) => {
            console.log('Results', results.rowsAffected);
            if (results.rowsAffected > 0) {
              Alert.alert('Your plan change', 'Status Change active to inactive',
              [
                { text: 'Ok', onPress: () => that.props.navigation.navigate('HomeScreen') },
              ],
               { cancelable: false }
              );
            } else {
              alert('Status Failed');
            }
          }
        );
        // this.onRefresh()
      });

    }



    // var expiry = this.state.expirydate + parseInt(this.state.datetime)


    return (

      <View style={styles.container}>
        <Modal
          animationType={"fade"}
          transparent={true}
          visible={this.state.isVisible}
          onRequestClose={() => { console.log("Modal has been closed.") }}>
          {

            <View style={{ backgroundColor: '#c1ccc7', flex: 0.95, height: 400, width: 340, margin: 10, marginTop: 20, borderWidth: 5, borderRadius: 10, }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", }}>
                <TouchableOpacity>
                  <Text style={styles.createplan}>CreatePlan</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => {
                  this.setState({ isVisible: !this.state.isVisible })
                }} >

                  <Text style={styles.createplan}><Icon name="close" size={20} /></Text>

                </TouchableOpacity>
              </View>
              <ScrollView keyboardShouldPersistTaps="handled">
                <KeyboardAvoidingView
                  behavior="padding"
                  style={{ flex: 1, justifyContent: 'space-between' }}>
                  <Mytextinput
                    placeholder="Enter Title"
                    onChangeText={Title => this.setState({ Title })}
                    style={{ padding: 10 }}
                  />
                  <Mytextinput
                    placeholder="Enter Calories"
                    onChangeText={Calories => this.setState({ Calories })}
                    maxLength={10}
                    keyboardType="numeric"
                    style={{ padding: 10 }}
                  />
                  <Mytextinput
                    placeholder="Enter Days"
                    onChangeText={TotalDays => this.setState({ TotalDays })}
                    maxLength={10}
                    keyboardType="numeric"
                    style={{ padding: 10 }}
                  />
                  <View style={styles.switchmainmodel}>

                    {/* <Text>{this.state.ActiveStatus ? 'Status Active' : 'Status Deactive'}</Text> */}
                    <Text>Status:</Text>
                    <Switch

                      onValueChange={this.toggleSwitch}
                      value={this.state.ActiveStatus} />
                  </View>



                  <Mybutton
                    title="Next"
                    customClick={this.register_plan.bind(this)}
                  />
                  <Mybutton
                    title="Extra button"
                    customClick={this.switchscreen.bind(this)}
                  />

                </KeyboardAvoidingView>
              </ScrollView>

            </View>

          }

        </Modal>





        <View>
          <Modal animationType={"fade"} transparent={true}
            visible={this.state.modalVisible}
            onRequestClose={() => { console.log("Modal has been closed.") }}>


            <View style={styles.modalsecond}>
              <TouchableOpacity onPress={() => {
                this.toggleModal(!this.state.modalVisible)
              }}>

                <Text style={{ textAlign: "right", marginRight: 20, marginTop: 20 }}><Icon name="close" size={20} color="#900" /></Text>
              </TouchableOpacity>

              <View>
                <ScrollView keyboardShouldPersistTaps="handled">
                  <KeyboardAvoidingView
                    behavior="padding"
                    style={{ flex: 1, justifyContent: 'space-between' }}>
                    {/* <Tooltip popover={<Text>Info here</Text>}>
<Text>Press me</Text>
<Mytextinput
placeholder="Status"
value={'' + this.state.ActiveStatus}
onChangeText={ActiveStatus => this.setState({ ActiveStatus })}
maxLength={1}
style={{ padding: 10 }}
keyboardType="numeric"
/>
</Tooltip> */}
                    <Text style={styles.toggletext}>Use toggle button to change the status</Text>
                    <View style={styles.switch}>

                      {/* <Text>Status:   {this.state.ActiveStatus?'Active':'Inactive'}</Text> */}

                      <Switch
                        onValueChange={this.toggleSwitch}
                        value={this.state.ActiveStatus} />
                    </View>
                    <Mybutton
                      title="OK"
                      customClick={this.updatePlan.bind(this)}
                    />
                  </KeyboardAvoidingView>
                </ScrollView>
              </View>
            </View>
          </Modal>
        </View>

        <ScrollView style={{ backgroundColor: '#c1ccc7' }}>
          {/* <Text style={styles.daystyle}>DAY:{this.state.Day}</Text> */}
          <View style={styles.today}>
            <Text style={styles.daytoday}>DAY {this.state.Day ? this.state.Day : <Icon name="close" size={20} color="#900" />}</Text>
            <Image source={require('./components/Icon/today.png')} style={{ width: 30, height: 30, marginLeft: 15, backgroundColor: '#60ad5e' }} />
          </View>
          <FlatList
            data={this.state.ViewAllPlan}
            ItemSeparatorComponent={this.ListViewItemSeparator}
            keyExtractor={(item, index) => index.toString()}
            onRefresh={this.onRefresh}
            refreshing={this.state.isFetching}
            extraData={this.extraData}
            renderItem={({ item }) => (

              <View key={item.PlanId} style={{ backgroundColor: '#8d8d8d', margin: 10, padding: 3, marginVertical: 5, borderRadius: 8 }}>
                <Text style={styles.title}>{item.Title}</Text>

                {/* <Text style={styles.title}>ID: {item.PlanId}</Text> */}
                <Text style={styles.title}>Calories: {item.Calories}</Text>
                <Text style={styles.title}>TotalDays: {item.TotalDays}</Text>
                <View style={{ flexDirection: "row", backgroundColor: '#f4fffa', justifyContent: 'space-between', paddingLeft: 20 }}>
                  <TouchableOpacity onPress={() => { this.toggleModal(true, item.PlanId) }}>
                    <Text style={styles.status}>Status:{item.ActiveStatus ? <Icon name="check" size={20} color="#003d00" /> : <Icon name="close" size={20} color="#900" />}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => this.removeItemValue(item.PlanId)} style={{ paddingRight: 30 }}>
                    <Icon name="trash" size={20} color="#900" />
                  </TouchableOpacity>
                </View>
                <View>
                  <TouchableOpacity onPress={this.Addfooditem_plan.bind(this, item.PlanId, item.ActiveStatus)} style={styles.addfooditem}>

                    <Text style={styles.addfooditemtxt} >Details</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </ScrollView>
        <View style={styles.btn}>
          <TouchableOpacity
            onPress={() => { this.setState({ isVisible: true }) }} style={styles.button}>
            <Text style={styles.btntext}>+</Text>

          </TouchableOpacity>
        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#c1ccc7',
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#00BCD4",
    height: 300,
    width: '80%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
    marginTop: 80,
    marginLeft: 40,

  },
  modalsecond: {
    backgroundColor: "#c1ccc7",
    height: 300,
    width: '80%',
    borderColor: 'red',
    marginTop: 30,
    marginLeft: 40,
    borderRadius: 10,
    borderWidth: 2,
  },
  btn: {

    marginLeft: 310,
    marginBottom: 10,
    // backgroundColor: '#c1ccc7',
  },
  addfooditem: {
    backgroundColor: '#595a4e',
    borderRadius: 30,
    width: 120,
    marginLeft: 100,

  },
  addfooditemtxt: {
    color: '#fff',
    textAlign: "center"
  },
  text: {
    color: '#3f2949',
    marginTop: 10
  },
  createplan: {
    margin: 10,
    fontSize: 17,
    fontWeight: "bold",

    color: '#000000',
    //backgroundColor: '#255d00',



  },
  switch: {
    flex: 1,
    justifyContent: 'center',
    // alignItems: 'flex-start',
    marginHorizontal: 50,
    marginTop: 10,
    color: '#007FFF',
    fontSize: 15,
    flexDirection: "row"


  },
  switchmainmodel: {
    flex: 1,
    //justifyContent: 'center',
    // alignItems: 'flex-start',
    marginLeft: 40,

    marginTop: 20,
    color: '#007FFF',
    fontSize: 15,
    flexDirection: "row"
  },
  status: {
    alignItems: 'flex-start',
    fontSize: 15,
    fontWeight: "bold",
  },
  title: {
    paddingLeft: 100,
    marginHorizontal: 7,
    backgroundColor: "#f4fffa",
    fontSize: 15,
    fontWeight: "bold",



  },
  button: {
    // marginTop:5,
    backgroundColor: '#9a0007',
    width: 40,
    height: 40,
    borderRadius: 30

  },
  btntext: {
    color: '#ffffff',
    fontSize: 40,
    textAlign: "center",
    bottom: 8
  },
  toggletext: {
    // backgroundColor: 'rgba(52, 52, 52, 0.8)',
    paddingVertical: 10,
    color: '#000000',
    fontSize: 15,
    fontWeight: "bold",
    marginHorizontal: 10,
    textAlign: "center"
  },
  daystyle: {
    fontSize: 16,
    textAlign: "center",
    backgroundColor: '#494949',
    color: '#fafafa',
    marginHorizontal: 120,
    height: 25,
    marginTop: 5,
    borderRadius: 20
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
  daytoday: {
    textAlign: "center",
    backgroundColor: '#60ad5e',
    borderTopLeftRadius: 10,
    borderTopEndRadius: 10

  }
});  