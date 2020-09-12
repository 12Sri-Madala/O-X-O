// Import components from React and React Native
import React from 'react';
import {StyleSheet, Text, View, ScrollView, ImageBackground, StatusBar, Button, Image, Linking, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';

// Import local components
import Header from '../../Library/Native/Header';
import {  messageOwner } from '../../Dash/Redux/actions.js';

// Import Style Guide and Language Guide
import { Colors, Font, Spacing, Icons } from '../../Library/Native/StyleGuide.js';

 class FAQ extends React.Component {

  render() {
    return (
      <View style={styles.container}>
        <Header
        title={'FAQ'}
        _call={() => {
         this.props.navigation.navigate('Dashboard');
       }}
        />
        <View style={styles.centeredContainer}>
          <ScrollView style={styles.scroll}>
            <Text style={styles.question}>
                What's the deal with insurance?
            </Text>
            <Text style={styles.answer}>
                You need to maintain your own personal car insurance – so don’t cancel it at any point!{"\n"}{"\n"}
                Renters are covered separately. They are only permitted to use your car for professional purposes – so driving for services like Uber & Lyft. These TNCs (Transport Network Companies) provide insurance. Cover is typically up to $1 Million. {"\n"}{"\n"}
                If interested, you can find more detail here:
            </Text>
            <View>
                <Text style={styles.answer}>
                    Uber Insurance:
                </Text>
                <TouchableOpacity
                    onPress={ ()=>{ Linking.openURL("https://www.uber.com/drive/insurance")}}
                >
                    <Text style={styles.answerLink}>
                        https://www.uber.com/drive/insurance
                    </Text>
                </TouchableOpacity>
                <Text style={styles.answer}>
                    Lyft Insurance:
                </Text>
                <TouchableOpacity
                    onPress={ ()=>{ Linking.openURL("https://help.lyft.com/hc/en-us/articles/115013080548-Insurance-Policy")}}
                >
                    <Text style={styles.answerLink}>
                        https://help.lyft.com/hc/en-us/articles/115013080548-Insurance-Policy
                    </Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.answer}>
                OXO holds additional insurance to fill the gaps – like when drivers need to log out of the Uber/Lyft for a bathroom or lunch break.{"\n"}{"\n"}

                To learn more, contact us at info@joinoxo.com
            </Text>
            <Text style={styles.question}>
                I’m going to be early/late to meet my driver. What do I do?
            </Text>
            <Text style={styles.answer}>
                Meeting your Match for the day is just like meeting a colleague for coffee, or your mom for lunch. Be respectful of their time! If something comes up which means you are going to be early or late, communicate with your Match. They are under no obligation to accommodate any last-minute changes of plans, but will do their best to sort it out.
            </Text>
            <Text style={styles.question}>
                My driver is late to collect my car. What happens?
            </Text>
            <Text style={styles.answer}>
                If you are matched with a driver and they do not arrive at the drop-off point within ten minutes of the scheduled time, firstly, we are so sorry! We will do our best to make it up to you. Feel free to cancel your match for the day and OXO will cover any reasonable parking costs you have to incur.
            </Text>
            <Text style={styles.question}>
                My driver is late returning my car. What happens?
            </Text>
            <Text style={styles.answer}>
                You can always also contact the driver directly. If your driver does not arrive at the agreed pick-up point within ten minutes of the scheduled time, you can also contact us. We get that sometimes you might need to urgently be somewhere. We will cover any reasonable Uber/Lyft/cab costs you have to incur while we get your delayed car back to you.
            </Text>
            <Text style={styles.question}>
                Are there any requirements for me to sign up my car with OXO?
            </Text>
            <Text style={styles.answer}>
                As long as they are safe, most cars meet our requirements!{'\n'}{'\n'}
                For any vehicle to drive on the Uber and Lyft platforms it must meet the vehicle safety requirements listed here:
            </Text>
            <View>
                <Text style={styles.answer}>
                    Uber:
                </Text>
                <TouchableOpacity
                    onPress={ ()=>{ Linking.openURL("https://www.uber.com/drive/san-francisco/vehicle-requirements")}}
                >
                    <Text style={styles.answerLink}>
                        https://www.uber.com/drive/san-francisco/vehicle-requirements
                    </Text>
                </TouchableOpacity>
                <Text style={styles.answer}>
                    Lyft:
                </Text>
                <TouchableOpacity
                    onPress={ ()=>{ Linking.openURL("https://help.lyft.com/hc/en-us/articles/115013080548-Insurance-Policy")}}
                >
                    <Text style={styles.answerLink}>
                        https://help.lyft.com/hc/en-us/articles/115013080548-Insurance-Policy
                    </Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.answer}>
                After completing an owner profile on the OXO mobile app, you will be able to schedule your car’s first day. A representative from OXO will take your vehicle to get it approved for Uber and Lyft. After the short inspection, you will be ready to be matched with a professional driver and start earning!
            </Text>

            <Text style={styles.question}>
                How much money should I expect to make using OXO?
            </Text>
            <Text style={styles.answer}>
                By saving $20 on daily parking and getting paid ~$30 for the rental, you will make around $50 per day which translates to $20,000 a year (probably more than you’d make by selling your car)!
            </Text>
            <Text style={styles.question}>
                How many miles will be added to my car driving with OXO?
            </Text>
            <Text style={styles.answer}>
                You can expect the car to be driven around 100-150 miles per day. The per mile wear and tear on the car is more than covered by the driver rental fee so you don’t have to worry about going net negative.
            </Text>
            <Text style={styles.question}>
              How about gas?
            </Text>
            <Text style={styles.answer}>
                As an owner, we ask that you never drop your car off with a driver with less than a quarter tank of gas. Our promise to you is that the car will always come back with at least as much gas as you left in it. If you select the option, your car can be returned with a full tank of gas each time. We’ll just send you the bill!
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => this.props.dispatchMessageOwner('b7b7697f-e532-467d-aab3-397989aade4c')}
                >
                <Text style={styles.buttonText}>Contact us</Text>
              </TouchableOpacity>
            </View>

          </ScrollView>
        </View>
      </View>
    );
  }
}

const mapDispatchToProps = dispatch => {
    return {
        dispatchMessageOwner: (id) => dispatch(messageOwner(id))
    };
}
export default connect(null, mapDispatchToProps)(FAQ);


const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: Colors.white,
  },
  scroll: {
    backgroundColor: Colors.white,
  },
  centeredContainer: {
    flex: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
  },
  textbutton:{
   color: Colors.secondary,
   fontSize: Font.large,
   margin: Spacing.small
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 9,
    padding: Spacing.small,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.small,
  },
  buttonText: {
    color: Colors.white,
    fontSize: Font.title_3,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  question: {
    fontSize: Font.large,
    color: Colors.primary,
    textAlign: 'left',
    margin: Spacing.tiny,
    marginLeft: Spacing.small,
    marginRight: Spacing.small,
  },
  answer: {
    fontSize: Font.regular,
    color: Colors.light,
    textAlign: 'left',
    margin: Spacing.tiny,
    marginLeft: Spacing.small,
    marginRight: Spacing.small,
  },
  answerLink: {
    fontSize: Font.small,
    color: 'blue',
    textAlign: 'left',
    margin: Spacing.micro,
    marginLeft: Spacing.small,
    marginRight: Spacing.small,
  },
});
