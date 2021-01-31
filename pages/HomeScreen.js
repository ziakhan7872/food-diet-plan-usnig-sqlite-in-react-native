/*Home Screen With buttons to navigate to different options*/
import React from 'react';
import { View, ImageBackground, StyleSheet, Text, Image, StatusBar,TouchableHighlight, } from 'react-native';
import Mybutton from './components/Mybutton';
import Mytext from './components/Mytext';
import { Card, } from 'react-native-paper';
import { openDatabase } from 'react-native-sqlite-storage';

//import { Card } from 'react-native-elements'
var db = openDatabase({ name: 'Dietplanproject.db', createFromLocation: 1 });
console.disableYellowBox = true;
export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    db.transaction(function (txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='Plan'",
        [],
        function (tx, res) {
          console.log('item:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS Plan', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS Plan(PlanId INTEGER PRIMARY KEY AUTOINCREMENT, Title VARCHAR(20), Calories INT(10), ActiveStatus INT(10), TotalDays INT(10),)',
              []
            );
          }
        }
      );
    });
  }
  render() {
    return (
      <View style={styles.container}>
        <View>
          <StatusBar
            barStyle="light-content"
            // dark-content, light-content and default
            hidden={false}

            backgroundColor="#595a4e"
            translucent={false}
            networkActivityIndicatorVisible={true}
          />
        </View>

        <View style={styles.cardcoverview} >
          <Card style={styles.cardcovertitle}>
         
            <Card.Cover source={require('./components/Icon/harvest.png')} style={styles.cardimagetitle} />
           
          </Card>
        </View>
        <View style={{flexDirection:"row" ,margin:20,marginTop:90,justifyContent:"space-between",backgroundColor:'#EEEEEE'}}>
        <TouchableHighlight>
        <View style={styles.cardcoverViewBtn}>
       
          <Card onPress={() => this.props.navigation.navigate('CreateNewPlan')} style={styles.cardcover}>
            <Card.Cover source={require('./components/Icon/nutrition.png')} style={styles.cardimagefirst} />
            <Text style={styles.cardText}>Create/Active Plan</Text>
          </Card>
         
        </View>
        </TouchableHighlight>



        <TouchableHighlight>
        <View style={styles.cardcoverViewBtn}>
        
          <Card onPress={() => this.props.navigation.navigate('ViewAllPlan')} style={styles.cardcover}>
            <Card.Cover source={require('./components/Icon/checklist1.png')} style={styles.cardimage} />
            <Text style={styles.cardText}>View All Plan</Text>
          </Card>
          
        </View>
        </TouchableHighlight>
        </View>





        {/* <Mybutton
title="Create Plan"
customClick={() => this.props.navigation.navigate('CreateNewPlan')}
/> */}

        {/* <Mybutton
title="Update Plan"
customClick={() => this.props.navigation.navigate('UpdateUser')}
/>  */}
        {/* <Mybutton
title="View Plan"
customClick={() => this.props.navigation.navigate('ViewUser')}
/> */}
        {/* <View style={styles.activeplan}>
<Mybutton
title="Active Plan"
customClick={() => this.props.navigation.navigate('ActivePlan')}
/>
</View>
<View style={styles.viewallplan}>
<Mybutton
title="View All Plan"
customClick={() => this.props.navigation.navigate('ViewAllPlan')}
/>
</View> */}
        {/* <Mybutton
title="Delete Plan"
customClick={() => this.props.navigation.navigate('DeleteUser')}
/> */}
        {/* <Mybutton
title="Plan Detail"
customClick={() => this.props.navigation.navigate('CreatePlanDetail')}
/> */}

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEEEEE',
  },
 

  cardText: {
    textAlign: 'center', fontSize: 15,fontWeight:"bold", color: 'black',
  },

  cardcover: {
  height: 100,
    width: 100,
    backgroundColor: '#EEEEEE',
    borderRadius:60,
    borderTopLeftRadius:60
  },

  cardimage: {
    height: 100,
    width: 100,
    borderRadius:10,
    borderTopLeftRadius:10,
    borderTopRightRadius:10


  },
  cardimagefirst:{
    height: 100,
    width: 100,
    borderRadius:10,
    borderTopLeftRadius:10,
    borderTopRightRadius:10

  },
  cardcoverViewBtn:{
    borderRadius:10,
    marginHorizontal:30,
    borderTopRightRadius:10

  },

  cardcoverview:{
    marginLeft:120,
    marginTop:20,
    // backgroundColor:'#F7F7F7'
    
    
  },
  cardimagetitle:{
    height: 150,
    width: 150,
    borderRadius:30,
   // backgroundColor:'#F7F7F7'
  },
  cardcovertitle:{
    height: 150,
    width: 150,
   // backgroundColor:'#F7F7F7',
    borderRadius:30
  },


});

