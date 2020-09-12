/*
This page allows the driver to edit their payment information by
changing the default payment method and removing cards
*/

// Import components from React and React Native
import React from 'react';
import {StyleSheet, Text, View, ScrollView, TouchableOpacity, TouchableHighlight, Image, AsyncStorage } from 'react-native';
import { connect } from 'react-redux';

// Import local components
import Header from '../../Library/Native/Header';
import Loader from '../../Library/Native/Loader';
import cardIcons from '../Resources/cardIcons';
import OxoButton from '../../Library/Native/OxoButton';

// Import Style Guide and Language Guide
import { Colors, Font, Spacing, Icons } from '../../Library/Native/StyleGuide';
import { Payments } from '../../Library/Native/LanguageGuide';

// Import Redux Actions
import {
  changeDefaultCard,
  deleteCard,
  getCustomerID,
  clearError,
} from '../Redux/actions';

class Payment extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      loading: false,
      id: null,
      token: null
    }
  }

  async getItem(key) {
      try {
          //we want to wait for the Promise returned by AsyncStorage.setItem()
          //to be resolved to the actual value before returning the value
          var jsonOfItem = await AsyncStorage.getItem(key);
          return jsonOfItem;
      } catch (error) {
        console.log(error.message);
      }
  }

  async componentDidMount(){
    console.log("Mounted")
    const token = await this.getItem('token');
    const id = await this.getItem('id');
    const res = await this.props.dispatchGetCustomerID(id, token)
    console.log(res.customerID);
    await this.setState({
        id: id,
        token: token,
    });
  }

  componentDidUpdate() {
    if (this.props.error != null) {
      Alert.alert(
        'Error.',
        'Please try again.' + this.props.error,
      );
      this.props.dispatchClearError();
    }
  }

  pickCardIcon(item){
    switch (item.type) {
      case "Visa": return cardIcons.visa;
      case "American Express": return cardIcons.american_express;
      case "MasterCard": return cardIcons.master_card;
      case "Discover": return cardIcons.discover;
      case "JCB": return cardIcons.jcb;
      case "Diners Club": return cardIcons.diners_club;
      default: return cardIcons.placeholder;
    }
  }

  displayCardInfo () {
    const item = this.props.navigation.getParam('cardItem', 'NO-ID');
    if (item === 'NO-ID') {
      return(
        <View>
          <Text>
            Card Information Not Found
          </Text>
        </View>
      );
    } else {
            return(
              <TouchableOpacity
                style={styles.cardContainer}
              >
                <Image source={this.pickCardIcon(item)} style={styles.cardIcon}/>
                  <Text style={styles.cardInfo}>
                    {(item.type + "   " + '\u2022\u2022\u2022\u2022' + " " + item.digits)}
                  </Text>
              </TouchableOpacity>

            )
          }
      }


  makeDefaultAndReturn(item, index, id, token, customerID){
    this.props.dispatchChangeDefaultCard(item, index, id, token, customerID)
    this.props.navigation.navigate("Payment")
  }

  deleteAndReturn(item, index, id, token, customerID){
    this.props.dispatchDeleteCard(item, index, id, token, customerID)
    this.props.navigation.navigate("Payment")
  }

  render() {
    const item = this.props.navigation.getParam('cardItem', 'NO-ID');
    const index = this.props.navigation.getParam('cardIndex', 'NO-INDEX');
    return (
      <View style={{backgroundColor: Colors.white, height:'100%'}}>
      <View style={{width: '100%', flex: 1}}>
        <Header
          icon='chevron-left'
          title='Edit Card'
          _callback={() => this.props.navigation.navigate('Payment')}
          />
      </View>
        <View style={{flex: 8, width: '100%', height: '50%'}}>
          <Text style={styles.title}>
            Credit or Debit Card
          </Text>
          {this.displayCardInfo()}
          <Loader loading={this.props.loading} />
          <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'space-evenly'}}>
          <OxoButton
            type={'outline'}
            buttonSize={'large'}
            fontSize={'medium'}
            content={'Make Default'}
            color={'primary'}
            onPress={()  => this.makeDefaultAndReturn(item, index, this.state.id, this.state.token, this.props.customerID)}
            />
            <OxoButton
              type={'outline'}
              buttonSize={'large'}
              fontSize={'medium'}
              content={'Delete Card'}
              color={'primary'}
              onPress={() => this.deleteAndReturn(item, index, this.state.id, this.state.token, this.props.customerID)}
              />
              </View>
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    loading: state.payments.loading,
    customerID: state.payments.customerID,
    name: state.payments.name,
    error: state.payments.error,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatchChangeDefaultCard: (item, index, id, token, customerID) => dispatch(changeDefaultCard(item, index, id, token, customerID)),
    dispatchDeleteCard: (item, index, id, token, customerID) => dispatch(deleteCard(item, index, id, token, customerID)),
    dispatchGetCustomerID: (userID, token) => dispatch(getCustomerID(userID, token)),
    dispatchClearError: () => dispatch(clearError()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Payment);

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    width: "90%",
    marginLeft: '5%',
  },
  title: {
    fontSize: Font.title_3,
    color: Colors.primary,
    textAlign: 'left',
    margin: Spacing.base,
  },
  touchableContainer: {
    flex: 4,
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: 'transparent',
    marginTop: Spacing.small,
  },
  cardInfo: {
    textAlign: 'center',
    fontSize: Font.regular,
    margin: Spacing.base,
    color: "black",
  },
  checkContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "space-between",
  },
  cardContainer: {
    alignItems: 'center',
  },
  cardIcon: {
    alignItems: 'center',
    resizeMode: 'contain',
    width: '30%',
  }
});
