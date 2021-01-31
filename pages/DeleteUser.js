import React from 'react';
import { Button, Text, View, Alert } from 'react-native';
import Mytextinput from './components/Mytextinput';
import Mybutton from './components/Mybutton';
import { openDatabase } from 'react-native-sqlite-storage';
var db = openDatabase({ name: 'Dietplanproject.db', createFromLocation: 1 });
console.disableYellowBox = true;
export default class DeleteUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input_plan_id: '',
    };
  }
  deleteUser = () => {
    var that = this;
    const { input_plan_id } = this.state;
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM  Plan where Planid=?',
        [input_plan_id],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            Alert.alert(
              'Success',
              'Plan deleted successfully',
              [
                {
                  text: 'Ok',
                  onPress: () => that.props.navigation.navigate('HomeScreen'),
                },
              ],
              { cancelable: false }
            );
          } else {
            alert('Please insert a valid plan Id');
          }
        }
      );
    });
  };
  render() {
    return (
      <View style={{ backgroundColor: 'white', flex: 1 }}>
        <Mytextinput
          placeholder="Enter Plan Id"
          onChangeText={input_plan_id => this.setState({ input_plan_id })}
          style={{ padding: 10 }}
        />
        <Mybutton
          title="Delete Plan"
          customClick={this.deleteUser.bind(this)}
        />
      </View>
    );
  }
}