import React, { Component } from 'react';
import { connect } from "react-redux";
import { Text, SafeAreaView, TextInput, StyleSheet  } from 'react-native';
import {  Button } from 'react-native-elements';
import _ from "lodash";
import { changeData } from './redux/actions';
import { bindActionCreators } from 'redux';

class Edit extends Component {

  constructor(props) {
    const { SKU, ProductName, Price, Date } = props.route?.params?.item
    super();
    this.state = {
      sku: SKU,
      productName: ProductName,
      price: Price,
      date: Date,
      data :[],
    }

  }

OnChangeSave =() =>{
  const { sku, productName, price, date  } = this.state
let myArray = this.props.route?.params?.item ;
let newObj  = { ...myArray ,Date: date,Price: price, ProductName: productName,SKU: sku,}
 const updatedItems = this.props.data.map(el => el.id ===  this.props.route?.params?.item?.id ? newObj : el)
 //console.log("updatedItems" ,updatedItems)
 this.props.actions.changeData(updatedItems)
this.props.navigation.navigate("Home")


}
 
  render() {
    const { sku, productName, price, date } = this.state
    return (
      <SafeAreaView>
        <TextInput
          style={styles.input}
          value={sku}
          onChangeText={(sku) => {
            this.setState({ sku: sku })
          }}
          placeholder="SKU"
          placeholderTextColor="gray"
        />
        <TextInput
          style={styles.input}
          value={productName}
          onChangeText={(productName) => {
            this.setState({ productName: productName })
          }}
          placeholder="Product Name"
          placeholderTextColor="gray"
        />
        <TextInput
          style={styles.input}
          value={price.toString()}
          onChangeText={(price) => {
            this.setState({ price })
          }}
          placeholder="Price"
          placeholderTextColor="gray"
        />
        <TextInput
          style={styles.input}
          value={date}
          onChangeText={(date) => {
            this.setState({ date: date })
          }}
          placeholder="Date"
          placeholderTextColor="gray"
        />
<Button
  onPress={this.OnChangeSave}
  title="SAVE"
  color="#841584"
  buttonStyle={styles.button}/>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  button: {
    margin: 20,
    backgroundColor: 'grey',
    borderRadius: 15
}
});
const ActionCreators = Object.assign(
  {},
  {changeData},
);
const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(ActionCreators, dispatch),
});


const mapStateToProps = state => ({
  data: state.data.data,
});

export default connect(mapStateToProps, mapDispatchToProps)(Edit);
