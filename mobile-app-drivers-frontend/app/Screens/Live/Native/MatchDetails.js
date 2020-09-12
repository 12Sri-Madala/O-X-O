/*
Still in early development, will comment after adding all functionality
Accepted Props:
data -
updateMatch -
navigate -
getDayName -
*/

// Import components from React and React Native
import React from 'react';
import { StyleSheet, Text, View, Alert, AsyncStorage } from 'react-native';
import { NavigationEvents } from 'react-navigation';
import { connect } from 'react-redux';
import _ from 'lodash';

// Import local components
import LocationDetails from './LocationDetails';
import OwnerDetails from './OwnerDetails';

// Import helpers
//import {messageOwner} from "../../Dash/Redux/actions";
import { determineButtons } from '../../Dash/Native/MatchFoundHelpers';
import { sbGetChannelTitle } from "../../Chat/sendbirdActions";


// Import library components
import Footer from '../../Library/Native/Footer';
import { Colors, Spacing, Font, Icons, Logo } from '../../Library/Native/StyleGuide';
import { Dash } from '../../Library/Native/LanguageGuide';
import Loader from '../../Library/Native/Loader';

// Import Redux Actions
import { messageOwner, } from '../../Dash/Redux/actions';

import { updateConnectionAndMatch } from '../Redux/actions';

import StarRating from "react-native-star-rating";
import { MessageInput } from "../../Chat/components";
import OxoButton from "../../Library/Native/OxoButton";
import Modal from "react-native-modal";


const OXO_SENDBIRD_ID = 'b7b7697f-e532-467d-aab3-397989aade4c';

class MatchDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isRatingModalVisible: false,
      starCount: 0,
      textMessage: '',
      isIssuesModalVisible: false,
    };
    this.toggleIssues = this.toggleIssues.bind(this);
    this.confirm = this.confirm.bind(this);
  }

  async componentDidMount() {
    const id = await AsyncStorage.getItem("id");
    const token = await AsyncStorage.getItem("token");
    this.setState({
      id: id,
      token: token,
    });
  }

  componentWillUnmount() {
    this.setState({
      isRatingModalVisible: false,
      isIssuesModalVisible: false,
    });
  }

  toggleIssues() {
    this.setState({
      isIssuesModalVisible: !this.state.isIssuesModalVisible
    });
  }

  issuesOXO() {
    this.props.dispatchMessageOwner(OXO_SENDBIRD_ID);
    this.setState({
      isIssuesModalVisible: false
    });
  }

  issuesMessageOwner() {
    this.props.dispatchMessageOwner(this.props.owners.id);
    this.setState({
      isIssuesModalVisible: false
    });
  }

  confirm() {
    if (this.state.isIssuesModalVisible) {
      return;
    }

    if (this.props.connection.status === 'CONFIRMED') {
      this.props.dispatchUpdateConnectionStatus(this.state.id, this.state.token, this.props.connection.id, 'LIVE', null);
    }
    if (this.props.connection.status === 'LIVE') {
      this.props.dispatchUpdateConnectionStatus(this.state.id, this.state.token, this.props.connection.id, 'COMPLETE', null);
    }

    if (this.props.connection.status === 'COMPLETE' && !this.state.isRatingModalVisible) {
      this.setState({
        isRatingModalVisible: true,
      })
    }

    if (this.props.connection.status === 'COMPLETE' && this.state.isRatingModalVisible) {
      fetch(`https://doorbell.io/api/applications/10636/submit?key=Uw4lyXnvngnNRIT6gamN0skHveEm3KXIb2WKXlA6H9EAnjaAptOVv83REBEPVAHK`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: 'allen@joinoxo.com', message: this.state.textMessage, properties: {
            id: this.state.id,
            stars: this.state.starCount
          }
        })
      });
      this.setState({
        isRatingModalVisible: false,
        starCount: 0,
        textMessage: ''
      });
    }
  }

  cancel() {
    if (this.props.connection.status === 'CONFIRMED') {
      Alert.alert(
        'Warning!',
        'Removing your availability within 24 hours of a match will result in a fee.  Do you wish to continue?',
        [
          {
            text: 'Continue',
            onPress: () => this.props.dispatchUpdateConnectionStatus(this.state.id, this.state.token, this.props.connection.id, 'CANCELED', 'Available')
          },
          { text: 'Cancel', onPress: () => { } }
        ]
      );
    } else {
      Alert.alert(
        'Live Match',
        'You can\'t cancel a live match, please contact the vehicle owner or OXO if you need to return the vehicle.',
        [
          { text: 'Close', onPress: () => { } }
        ]
      );
    }
  }

  onStarRatingPress(rating) {
    this.setState({
      starCount: rating
    });
  }

  _onTextMessageChanged = textMessage => {
    this.setState({ textMessage });
  };

  getCar() {
    const vehicle = _.find(this.props.vehicles, (vehicle) => {
      return vehicle.id === this.props.connection.carID
    });
    return vehicle;
  }

  getOwner() {
    const owner = _.find(this.props.owners, (owner) => {
      return owner.id === this.props.connection.ownerID
    });
    return owner;
  }

  getFooterButtons() {
    const issuesButton = {
      type: 'outline',
      buttonSize: 'large',
      fontSize: 'large',
      content: 'Issues',
      color: 'primary',
      onPress: this.toggleIssues
    }

    let nextButton = null;
    switch (this.props.connection.status) {
      case 'CONFIRMED':
        nextButton = {
          type: 'contained',
          buttonSize: 'large',
          fontSize: 'large',
          content: 'Pick up',
          color: 'secondary',
          onPress: this.confirm
        };
        break;
      case 'LIVE':
        nextButton = {
          type: 'contained',
          buttonSize: 'large',
          fontSize: 'large',
          content: 'Drop off',
          color: 'secondary',
          onPress: this.confirm
        };
        break;
      case 'COMPLETE':
        nextButton = {
          type: 'contained',
          buttonSize: 'large',
          fontSize: 'large',
          content: 'Review',
          color: 'secondary',
          onPress: this.confirm
        };
    }
    return [issuesButton, nextButton];
  }

  render() {
    return (
      <View style={styles.container}>

        <Loader loading={this.props.loading} />

        <LocationDetails data={this.props.connection} />

        <OwnerDetails owner={this.props.owners} car={this.props.vehicles} />

        <View style={{
          ...StyleSheet.flatten(styles.footer)
        }}>
          <Footer buttons={this.getFooterButtons()}
          />
        </View>

        <Modal isVisible={this.state.isIssuesModalVisible}>
          <View style={{ ...StyleSheet.flatten(styles.modalContent) }}>
            <Text style={{ color: Colors.secondary, fontSize: Font.title_3 }}>
              <Text>What's Wrong?</Text>
            </Text>
            <View style={{ paddingTop: Spacing.small }}>
              <OxoButton
                type={'outline'}
                buttonSize={'large'}
                fontSize={'large'}
                content={'Contact Team OXO'}
                color={'primary'}
                onPress={this.issuesOXO.bind(this)}
                width2height={5}
              />
            </View>
            <View style={{ paddingTop: Spacing.small }}>
              <OxoButton
                type={'outline'}
                buttonSize={'large'}
                fontSize={'large'}
                content={'Contact Owner'}
                color={'primary'}
                onPress={this.issuesMessageOwner.bind(this)}
                width2height={5}
              />
            </View>
            <View style={{ paddingTop: Spacing.small }}>
              <OxoButton
                type={'outline'}
                buttonSize={'large'}
                fontSize={'large'}
                content={'Cancel Match'}
                color={'primary'}
                onPress={this.cancel.bind(this)}
                width2height={5}
              />
            </View>
            <View style={{ paddingTop: Spacing.small }}>
              <OxoButton
                type={'outline'}
                buttonSize={'large'}
                fontSize={'large'}
                content={'Dismiss'}
                color={'secondary'}
                onPress={this.toggleIssues.bind(this)}
                width2height={5}
              />
            </View>
          </View>
        </Modal>


        <Modal isVisible={this.state.isRatingModalVisible}>
          <View style={{ ...StyleSheet.flatten(styles.modalContent) }}>
            <Text style={{ fontSize: Font.title_3, color: Colors.primary }}>Tell us how your match was!</Text>
            <StarRating
              disabled={false}
              fullStarColor={'#001970'}
              maxStars={5}
              rating={this.state.starCount}
              selectedStar={(rating) => this.onStarRatingPress(rating)}
              starStyle={{
                marginTop: Spacing.small,
                marginLeft: Spacing.small,
                marginRight: Spacing.small, borderColor: '#001970'
              }}
            />
            <View style={{ ...StyleSheet.flatten(styles.messageInput) }}>
              <MessageInput
                textMessage={this.state.textMessage}
                onChangeText={this._onTextMessageChanged}
                noSendButton={true}
                placeholder={'Comments'}
                minHeight={Spacing.x_large}
                maxHeight={Icons.huge}
              />
            </View>
            <View style={{
              marginTop: Spacing.small,
              paddingLeft: Spacing.small,
              paddingRight: Spacing.small
            }}>
              <OxoButton
                type={'outline'}
                buttonSize={'large'}
                fontSize={'large'}
                content={'Submit'}
                color={'secondary'}
                onPress={this.confirm.bind(this)}
              />
            </View>
          </View>
        </Modal>

      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    vehicles: state.live.vehicle,
    loading: state.live.loading,
    owners: state.live.owner,
  };
}

const mapDispatchToProps = dispatch => {
  return {
    dispatchMessageOwner: (id) => dispatch(messageOwner(id)),
    dispatchUpdateConnectionStatus: (userId, token, connectionID, connectionStatus, matchStatus) => dispatch(updateConnectionAndMatch(userId, token, connectionID, connectionStatus, matchStatus))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MatchDetails);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    alignItems: 'center'
  },
  header: {
    width: '100%',
    paddingVertical: Spacing.tiny,
    borderBottomWidth: Spacing.lineWidth,
    borderColor: Colors.light,
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerContent: {
    fontSize: Font.large,
    fontWeight: 'bold',
    color: Colors.secondary
  },
  footer: {
    flex: 2,
    width: '100%',
  },
  modalContent: {
    backgroundColor: Colors.white,
    paddingVertical: Spacing.base,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: Spacing.tiny,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  messageInput: {
    borderRadius: Spacing.tiny,
    width: '100%',
    marginTop: Spacing.small
  }
});
