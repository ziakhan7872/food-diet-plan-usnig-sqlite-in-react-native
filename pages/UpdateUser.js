import React from 'react';
import { View, ScrollView, KeyboardAvoidingView, Alert, } from 'react-native';
import Mytextinput from './components/Mytextinput';
import Mybutton from './components/Mybutton';
import { openDatabase } from 'react-native-sqlite-storage';
var db = openDatabase({ name: 'Dietplanproject.db', createFromLocation : 1});
console.disableYellowBox = true;
 
export default class UpdateUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Planid: '',
      Title: '',
      Calories: '',
      ActiveStatus: '',
      TotalDays: '',
    };
  }
  searchPlan = () => {
    const {Planid} =this.state;
    console.log(this.state.Planid);
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM Plan where Planid = ?',
        [Planid],
        (tx, results) => {
          var len = results.rows.length;
          console.log('len',len);
          if (len > 0) {
            console.log(results.rows.item(0).Calories);
            this.setState({
            Title:results.rows.item(0).Title,
            });
            this.setState({
             Calories:results.rows.item(0).Calories,
            });
            this.setState({
              ActiveStatus:results.rows.item(0).ActiveStatus,
            });
            this.setState({
              TotalDays:results.rows.item(0).TotalDays,
             });
          }else{
            alert('No Plan found');
            this.setState({
              Title:'',
              Calories:'',
              ActiveStatus:'',
              TotalDays:'',
            });
          }
        }
      );
    });
  };
  updatePlan = () => {
    var that=this;
    const { Planid } = this.state;
    const {Title } = this.state;
    const { Calories } = this.state;
    const { ActiveStatus } = this.state;
    const { TotalDays } = this.state;
    if (Title){
      if (Calories){
        if (ActiveStatus){
          if (TotalDays){
            db.transaction((tx)=> {
              tx.executeSql(
                'UPDATE Plan set Title=?, Calories=? , ActiveStatus=?,TotalDays=? where Planid=?',
                [Title, Calories,ActiveStatus, TotalDays, Planid],
                (tx, results) => {
                  console.log('Results',results.rowsAffected);
                  if(results.rowsAffected>0){
                    Alert.alert( 'Success', 'Plan updated successfully',
                      [
                        {text: 'Ok', onPress: () => that.props.navigation.navigate('HomeScreen')},
                      ],
                      { cancelable: false }
                    );
                  }else{
                    alert('Updation Failed');
                  }
                }
              );
            });
          }else{
            alert('Please fill TotalDays');
          }
        }else{
          alert('Please fill ActiveStatus');
        }
      }else{
        alert('Please fill Calories');
      }
    }else{
      alert('Please fill Title');
    }
  };
 
  render() {
    return (
      <View style={{ backgroundColor: 'white', flex: 1 }}>
        <ScrollView keyboardShouldPersistTaps="handled">
          <KeyboardAvoidingView
            behavior="padding"
            style={{ flex: 1, justifyContent: 'space-between' }}>
            <Mytextinput
              placeholder="Enter Plan Id"
              style={{ padding:10 }}
              onChangeText={Planid => this.setState({ Planid })}
            />
            <Mybutton
              title="Search Plan"
              customClick={this.searchPlan.bind(this)}
            />
            <Mytextinput
              placeholder="Enter Title"
              value={this.state.Title}
              style={{ padding:10 }}
              onChangeText={Title => this.setState({Title })}
            />
            <Mytextinput
              placeholder="Enter Calories"
              value={''+ this.state.Calories}
              onChangeText={Calories => this.setState({ Calories })}
              maxLength={10}
              style={{ padding:10 }}
              keyboardType="numeric"
            />
           <Mytextinput
              placeholder="Enter Status"
              value={''+ this.state.ActiveStatus}
              onChangeText={ActiveStatus => this.setState({ ActiveStatus })}
              maxLength={10}
              style={{ padding:10 }}
              keyboardType="numeric"
            />
            <Mytextinput
              placeholder="Enter Days"
              value={''+ this.state.TotalDays}
              onChangeText={TotalDays => this.setState({ TotalDays })}
              maxLength={10}
              style={{ padding:10 }}
              keyboardType="numeric"
            />
            <Mybutton
              title="Update Plan"
              customClick={this.updatePlan.bind(this)}
            />
          </KeyboardAvoidingView>
        </ScrollView>
      </View>
    );
  }
}