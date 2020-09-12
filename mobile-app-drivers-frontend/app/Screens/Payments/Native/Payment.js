/*
This page loads the driver's payment information (i.e. credit cards) and
allows them to change the default card as well as link to NewCardPage
where they can add additional payment methods
*/

// Import components from React and React Native
import React from 'react';
import {StyleSheet, Text, View, ScrollView, ImageBackground, StatusBar, Button, Image, TouchableOpacity, TouchableHighlight,
        FlatList, Alert, AsyncStorage } from 'react-native';
import { connect } from 'react-redux';
import { NavigationEvents } from 'react-navigation';
import { Icon } from 'react-native-elements';

// Import local components
import Header from '../../Library/Native/Header';
import Loader from '../../Library/Native/Loader';
import cardIcons from '../Resources/cardIcons';
import withErrorHandling from '../../../Containers/Native/withErrorHandling';

// Import Style Guide and Language Guide
import { Colors, Font, Spacing, Icons } from '../../Library/Native/StyleGuide';
import { Payments } from '../../Library/Native/LanguageGuide';

// Import Redux Actions
import {
  changeDefaultCard,
  makePayment,
  getCustomerID,
  getCards,
  clearError,
} from '../Redux/actions';

class Payment extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      loading: false,
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
    await this.setState({
        id: id,
        token: token,
    });
    const res = await this.props.dispatchGetCustomerID(id, token)
    await this.setState({
        customerID: res.customerID
    });
    if (this.props.customerID !== null){
      await this.props.dispatchGetCards(id, token, this.props.customerID)
    }
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

  /*
  Description: Use card tokens as keys rather than default keys
  Arguments: item => card object which contains {last 4 digits, card type, card token, customer ID}
             index => index in the list of this specific item
  Returns: card token for the item
  */
  keyExtractor = (item, index) => item.token;

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

  /*
  Description: Render the card items in the ScrollView as TouchableOpacities which can update the default card
  Arguments: item => card object which contains {last 4 digits, card type, card token, customer ID}
             index => index in the list of this specific item
  Returns: N/A
  */
  populateScrollView () {
    console.log(this.props.defaultCard);
    console.log(this.props.cards);

    return(
      this.props.cards.map((item, index) => {
        return(
          <TouchableOpacity
            style={styles.cardContainer}
            onPress={() => this.props.navigation.navigate('EditPayment', {cardItem: item, cardIndex: index})}
            key={item.token}
          >
            <Image source={this.pickCardIcon(item)} style={styles.cardIcon}/>
            {this.props.defaultCard === item.token ?
              <View style={styles.checkContainer}>
                <Text style={styles.cardInfo}>
                  {(item.type + "   " + '\u2022\u2022\u2022\u2022' + " " + item.digits)}
                </Text>
                <Icon name={'check-circle'} color={Colors.primary} size={Icons.medium}/>
              </View>
              :
              <Text style={styles.cardInfo}>
                {(item.type + "   " + '\u2022\u2022\u2022\u2022' + " " + item.digits)}
              </Text>}
          </TouchableOpacity>
        )
      })
    );
  }

  render() {
    return (
      <View style={{backgroundColor: Colors.white, height:'100%'}}>
      {this.state.id && this.state.token && <NavigationEvents
          onWillFocus={payload => this.props.dispatchGetCards(this.state.id, this.state.token, this.props.customerID)}
      />}
      <View style={{width: '100%', height: '11%'}}>
        <Header
          title= {"Payments"}
          _call={() => {
           this.props.navigation.navigate('Dashboard');
         }}/>
      </View>
        <View style={{ width: '100%'}}>
          <Text style={styles.title}>
            {'Cards'}
          </Text>
          <ScrollView style={styles.container}>
            {/*List showing the user's payment methods (i.e. credit cards)*/}
            {this.populateScrollView()}
            <TouchableHighlight
              style={styles.touchableContainer}
              onPress={() => this.props.navigation.navigate('NewCardPage')}
              underlayColor={"lightgray"}
            >
              <Text style={{color: Colors.primary, fontSize: Font.large, marginBottom: 10, marginTop: 10}}>{Payments.ButtonText}</Text>
            </TouchableHighlight>
          </ScrollView>
          <Loader loading={this.props.loading} />
        </View>
      </View>
    );
  }
}

{/*<TouchableOpacity
  style={styles.touchableContainer}
  onPress={() => this.props.dispatchMakePayment({ amount: 100, currency: 'usd',
                                                customerID: this.props.customerID, description: 'Test $1 charge'})}
>
  <Text style={{color: '#005BC2', fontSize: 20}}>Donate $1</Text>
</TouchableOpacity>*/}


const mapStateToProps = state => {
  return {
    loading: state.payments.loading,
    customerID: state.payments.customerID,
    cards: state.payments.cards,
    defaultCard: state.payments.defaultCard,
    name: state.payments.name,
    error: state.payments.error,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatchChangeDefaultCard: (item, index, id, token, customerID) => dispatch(changeDefaultCard(item, index, id, token, customerID)),
    dispatchMakePayment: (id, token, paymentInfo) => dispatch(makePayment(id, token, paymentInfo)),
    dispatchGetCustomerID: (userID, token) => dispatch(getCustomerID(userID, token)),
    dispatchGetCards: (id, token, customerID) => dispatch(getCards(id, token, customerID)),
    dispatchClearError: () => dispatch(clearError()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandling(Payment));

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    width: "90%",
    marginLeft: Spacing.base,
  },
  title: {
    fontSize: Font.title_3,
    color: Colors.primary,
    textAlign: 'left',
    margin: Spacing.base,
  },
  touchableContainer: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: 'transparent',
    marginTop: Spacing.small,
  },
  cardInfo: {
    fontSize: Font.regular,
    marginLeft: Spacing.small,
    color: "black",
  },
  checkContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "space-between",
  },
  cardContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.tiny,
    borderColor: Colors.light,
    borderBottomWidth: Spacing.lineWidth,
  },
  cardIcon: {
    resizeMode: 'contain',
    width: '15%',
  }
});
