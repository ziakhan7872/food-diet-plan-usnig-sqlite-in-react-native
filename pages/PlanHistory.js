import React from 'react';
import { View, ScrollView, TouchableOpacity, Text, StyleSheet, Button } from 'react-native';
import Mytextinput from './components/Mytextinput';
import Mybutton from './components/Mybutton';
import { openDatabase } from 'react-native-sqlite-storage';
var db = openDatabase({ name: 'Dietplanproject.db', createFromLocation: 1 });
import DatePicker from 'react-native-datepicker';
console.disableYellowBox = true;



export default class PlanHistory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: "15-05-2018",
      nextdate: "15-05-2018",
      TotalDays: '',
      PlanId: '',
      counter: 0
    };


    db.transaction(tx => {
      tx.executeSql('SELECT * FROM Plan', [], (tx, results) => {
        var temp = [];
        for (let i = 0; i < results.rows.length; ++i) {
          temp.push(results.rows.item(i));
        }
        this.setState({
          ViewAllPlan: temp,
          PlanId: temp[0].PlanId,
          TotalDays: temp[0].TotalDays,
        });
        // alert(this.state.PlanId)
      });
    });
  }



  nextdate = () => {
    var date = new Date().getDate();
      var month = new Date().getMonth() + 1;
      var year = new Date().getFullYear();

      var date1 = new Date().getDate() +1;
      var month1 = new Date().getMonth() + 1;
      var year1 = new Date().getFullYear();
 
      alert(date + '-' + month + '-' + year);
      if (date + '-' + month + '-' + year == date1 + '-' + month1 + '-' + year1)
      {
        alert('1')
      }
      else if(date + '-' + month + '-' + year < date1 + '-' + month1 + '-' + year1)
      {
        alert('2')
      }
 
  }



  render() {
    const { counter } = this.state
    //counter = new Date()
    //alert(new Date())
    return (
      <View style={styles.container}>

        {/* <DatePicker
          style={{ width: 200 }}
          date={this.state.date} //initial date from state
          mode="date" //The enum of date, datetime and time
          placeholder="select date"
          format="MM-DD-YYYY"
          minDate="01-01-2016"
          maxDate="01-01-2019"
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          customStyles={{
            dateIcon: {
              position: 'absolute',
              left: 0,
              top: 4,
              marginLeft: 0
            },
            dateInput: {
              marginLeft: 36
            }
          }}
          date={new Date()}
          onDateChange={(date) => { this.setState({ date: date }) }}
        /> */}

        {/* <Text>{this.nextdate.bind(this)}</Text> */}
        <TouchableOpacity style={styles.button} onPress={this.nextdate.bind(this)}>
          <Text>Day</Text>
        </TouchableOpacity>



      </View>

    )

  }

}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
    padding: 16
  },
  button: {
    width: 50,
    height: 20
  }
})