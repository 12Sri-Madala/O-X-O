// Import components from React and React Native
import React from 'react';
import { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  AsyncStorage,
  TouchableOpacity,
  Image,
  CameraRoll,
} from 'react-native';
import { connect } from 'react-redux';

// Import components from separate Node modules
import { Icon } from 'react-native-elements';
import OxoButton from '../../Library/Native/OxoButton';
import Header from '../../Library/Native/Header';
import DocumentModal from '../../Library/Native/DocumentModal'


// Import library components
import {
  Colors,
  Icons,
  Spacing,
  Font,
} from '../../Library/Native/StyleGuide';


// Import helpers
// import { contact, message } from './MatchFoundHelpers';
import { messageOwner } from '../Redux/actions';
// import {sbGetChannelTitle} from "../../Chat/sendbirdActions";

class OwnerInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: null,
      token: null,
      documentsModal: false,
    };

    const regex = /(?:[A-Za-z0-9+\/]{4}\\n?)*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=)/;
    this.regex = regex;
    this.download = this.download.bind(this);
  }

  async componentDidMount() {
    const id = await AsyncStorage.getItem('id');
    const token = await AsyncStorage.getItem('token');
    this.setState({ id, token });
  }

  modalVisible = () => {
    this.setState({ documentsModal: true });
  }

  modalClose = () => {
    this.setState({ documentsModal: false });
  }

  download() {
    if (!this.props.car.inspectionImage || !this.regex.test(this.props.car.inspectionImage)) {
      this.setState({ documentsModal: false });
      console.log('Inspection Image is either not provided or is not a base64 image, image: ', this.props.car.inspectionImage)
      return
    } else {
      CameraRoll.saveToCameraRoll(this.props.car.inspectionImage)
        .then((res) => {
          console.log('Save to camera roll response Inspection Image: ', res);
        })
        .catch((err) => {
          console.log('Save to camera roll error: ', err);
        });
    }
    if (!this.props.car.insuranceImage || !this.regex.test(this.props.car.insuranceImage)) {
      this.setState({ documentsModal: false });
      console.log('Insurance Image is either not provided or is not a base64 image, image: ', this.props.car.insuranceImage)
      return
    } else {
      CameraRoll.saveToCameraRoll(this.props.car.insuranceImage)
        .then((res) => {
          console.log('Save to camera roll response Insurance Image: ', res);
        })
        .catch((err) => {
          console.log('Save to camera roll error: ', err);
        });
    }

    this.setState({ documentsModal: false });
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          activeOpacity={1/*Colors.touchedOpacity */}
          onPress={() => { }}
          style={{
            ...StyleSheet.flatten(styles.block),
            justifyContent: 'flex-start',
            marginLeft: Spacing.base,
          }}
        >
          {this.props.owner.profileImage
            ? (<View style={styles.imageContainer}>
              <Image
                source={{ uri: this.props.owner.profileImage }}
                style={{
                  height: 2 * Icons.large,
                  width: 2 * Icons.large,
                  borderRadius: Icons.large,
                }}
              />
            </View>)
            : (
              <View style={styles.imageStandIn}>
                <Icon name="person" size={Icons.large} color={Colors.primary} />
              </View>
            )}

          <Text style={{ color: Colors.primary, fontSize: Font.large, marginLeft: Icons.large / 2 }}>
            {`${this.props.owner.firstName} ${this.props.owner.lastName[0]}.`}
          </Text>
        </TouchableOpacity>
        <View style={{ flexDirection: 'column', marginTop: Spacing.large }}>
          <View style={styles.screenButtons}>
            <OxoButton
              type="contained"
              buttonSize="large"
              fontSize="large"
              content="DOCUMENTS"
              color="secondary"
              key="one"
              onPress={this.modalVisible}
              width2height={5}
            />
          </View>
          <View style={styles.screenButtons}>
            <OxoButton
              type="outline"
              buttonSize="large"
              fontSize="large"
              content="MESSAGE"
              color="secondary"
              onPress={() => { this.props.dispatchMessageOwner(this.props.owner.id); }}
              width2height={5}
            />
          </View>
          <DocumentModal
            visible={this.state.documentsModal}
            close={this.modalClose}
            carMake={this.props.car.make}
            carModel={this.props.car.model}
            carYear={this.props.car.year}
            download={this.download}
          >
          </DocumentModal>
        </View>
      </View>
    );
  }
}

// const mapStateToProps = state => {
//     return {
//         channel: state.dash.channel
//     }
// }

const mapDispatchToProps = dispatch => ({
  dispatchMessageOwner: id => dispatch(messageOwner(id))
});

export default connect(null, mapDispatchToProps)(OwnerInfo);

const styles = StyleSheet.create({
  screenContainer: {
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },
  container: {
    flex: 3,
    width: Dimensions.get('window').width - (2 * Spacing.small),
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: Spacing.small,
  },
  block: {
    flex: 1,
    height: '100%',
  },
  imageContainer: {
    overflow: 'hidden',
    height: 2 * Icons.large,
    width: 2 * Icons.large,
    borderRadius: Icons.large,
  },
  imageStandIn: {
    height: 2 * Icons.large,
    width: 2 * Icons.large,
    borderWidth: Spacing.lineWidth,
    borderColor: Colors.primary,
    borderRadius: 100,
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: Spacing.tiny,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalHeader: {
    borderTopLeftRadius: Spacing.tiny,
    borderTopRightRadius: Spacing.tiny,
    width: '100%',
    backgroundColor: Colors.primary,
  },
  documentsHeader: {
    color: Colors.white,
    fontSize: Font.title_3,
    marginLeft: Spacing.small,
    marginTop: Spacing.small,
    marginBottom: Spacing.small,
  },
  modalButton: {
    alignItems: 'center',
    padding: Spacing.base,
  },
  documentsText: {
    color: Colors.primary,
    fontSize: Font.large,
    paddingTop: Spacing.small,
    paddingHorizontal: Spacing.small,
  },
  documentsCar: {
    color: Colors.primary,
    fontSize: Font.title_3,
    paddingTop: Spacing.small,
    paddingHorizontal: Spacing.small,
  },
  screenButtons: {
    paddingTop: Spacing.small,
    paddingRight: Spacing.base,
  },
});
