// Import components from React and React Native
import React from 'react';
import {StyleSheet, Text, View, ScrollView, ImageBackground, StatusBar, Button, Image, Linking, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';

// Import local components
import Header from '../../Library/Native/Header';
import {  messageOwner } from '../../Dash/Redux/actions';

// Import Style Guide and Language Guide
import { Colors, Font, Spacing, Icons } from '../../Library/Native/StyleGuide';

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
              I want to drive for Uber / Lyft. Can I use these cars?
            </Text>
            <Text style={styles.answer}>
              Yes! Absolutely. {"\n"}{"\n"}
              In fact, you can only use these cars to drive professionally.  The vehicles are pre-approved to drive on Uber, Lyft and Doordash. If you want to drive for another company - e.g. Postmates or Caviar - get in touch and we can help you out.{"\n"}{"\n"}
              You cannot use these cars for personal use. We’re sorry. No trips to the supermarket, circus, IKEA or the beach.
            </Text>
            <Text style={styles.question}>
              Can anyone drive cars from OXO?
            </Text>
            <Text style={styles.answer}>
              We fight against discrimination of any kind. What matters is that you are aged 21+, safe and reliable.{"\n"}{"\n"}
              Eligibility requirements:{"\n"}{"\n"}
              - You must have a valid driver’s license from the state in which you are driving {"\n"}{"\n"}
              - You must meet all of Uber and Lyft’s requirements. They pretty much overlap... {"\n"}{"\n"}
              - Be aged 21+ (you won’t be drinking hard liquor, but 21 is still the minimum){"\n"}{"\n"}
              - Have had your driving  licence for at least a year (sorry, no total newbies){"\n"}{"\n"}
              - Pass Uber/Lyft’s driving record and criminal record screenings{"\n"}{"\n"}
              Don’t worry about requirements concerning car ownership (you’ll get your wheels through OXO!){"\n"}{"\n"}
              Find Uber and Lyft requirements here:
            </Text>
            <View>
              <Text style={styles.answer}>
                Uber:
              </Text>
              <TouchableOpacity
                onPress={ ()=>{ Linking.openURL("https://www.uber.com/drive/requirements/")}}
              >
                <Text style={styles.answerLink}>
                  https://www.uber.com/drive/requirements/
                </Text>
              </TouchableOpacity>
              <Text style={styles.answer}>
                Lyft:
              </Text>
              <TouchableOpacity
                onPress={ ()=>{ Linking.openURL("https://help.lyft.com/hc/en-us/articles/115012925687-Driver-requirements")}}
              >
                <Text style={styles.answerLink}>
                  https://help.lyft.com/hc/en-us/articles/115012925687-Driver-requirements
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.question}>
              How do I get a car?
            </Text>
            <Text style={styles.answer}>
              Send us your availability - where and when you want a car to drive for Uber, Lyft or Doordash. e.g. Monday 7am - 8pm in San Francisco. {"\n"}{"\n"}
              We will hook you up with the perfect car right where and when you need it. You can schedule this through our Mobile App, by phone, or over text. After you have done it once, it takes only seconds.
            </Text>
            <Text style={styles.question}>
              How does the car collection work?
            </Text>
            <Text style={styles.answer}>
              If you’re lucky to get matched with a car, think of it like a first date or a job interview. They should be trying to impress you too. {"\n"}{"\n"}
              You have agreed the time and place. Be there 10-15 minutes early. You should recognise your match from the photo of them and/or their car. Greet them with good eye contact and a friendly handshake or fist-bump. It goes a long way!
            </Text>
            <Text style={styles.question}>
              What happens if I show up late to drop off the car?
            </Text>
            <Text style={styles.answer}>
              Sometimes things beyond our control make us late. We get it. And the Car Owner you are matched with should too. BUT it’s important not to be late returning a car. {"\n"}{"\n"}

              Being late makes your Match late too. It can make them late to collect their kids from school, or late to a work meeting. Don’t start a domino chain of stress and happiness. Be on time! {"\n"}{"\n"}

              If something comes up, be sure to communicate with your Match.
            </Text>
            <Text style={styles.question}>
              Do I get to keep the bonuses from TNCs like Uber and Lyft?
            </Text>
            <Text style={styles.answer}>
              Unlike many other rideshare vehicle solutions, you are entitled to any bonuses from Uber and/or Lyft. Go get ’em tiger.
            </Text>
            <Text style={styles.question}>
              How does returning the car work?
            </Text>
            <Text style={styles.answer}>
              Returning the car is just like the collection - in reverse. You’ll have agreed the time and place with your Match. You hop out, they hop in.{"\n"}{"\n"}

              Every person we know appreciates it when the car is at least as clean and tidy as when they left it. No one wants the surprise of an empty coffee cup or rotting banana skin under the seat.
            </Text>
            <Text style={styles.question}>
              How about gas?
            </Text>
            <Text style={styles.answer}>
              Don’t leave your Match hanging with an almost-empty tank.
            </Text>
            <Text style={styles.question}>
              What’s the deal with insurance?
            </Text>
            <Text style={styles.answer}>
              Car owners are required to maintain personal car insurance. TNCs (Uber, Lyft etc.) cover you while you’re driving for them. And OXO fills in the gaps. {"\n"}{"\n"}

              To read more, visit:
            </Text>
            <View>
              <TouchableOpacity
                onPress={ ()=>{ Linking.openURL("https://www.uber.com/drive/insurance/")}}
              >
                <Text style={styles.answerLink}>
                  https://www.uber.com/drive/insurance/
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.question}>
              Uber/Lyft deactivated my Driver Account. What do I do?
            </Text>
            <Text style={styles.answer}>
              We are sorry to hear that Uber/Lyft has taken this action. Some people worry this may hit their driver rating and earnings. We care too. Deactivations can happen for a bunch of reasons. Lets investigate what happened and get you back on the road ASAP.
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
  textbutton: {
    color: Colors.secondary,
    fontSize: Font.large,
    margin: Spacing.small,
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
