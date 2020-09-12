import React, { Component } from "react";
import { Platform, View, FlatList, Text, Alert, AsyncStorage, BackHandler, Keyboard, KeyboardAvoidingView, Dimensions } from "react-native";
import { NavigationActions } from "react-navigation";
import Permissions from 'react-native-permissions';
import { connect } from "react-redux";
import {
//  openChannelProgress,
  groupChannelProgress,
  initChatScreen,
  getChannelTitle,
  createChatHandler,
  onSendButtonPress,
  getPrevMessageList,
  onUserBlockPress,
  onFileButtonPress,
  typingStart,
  typingEnd,
  channelExit
} from "../actions";
import { Button, TextItem, FileItem, ImageItem, MessageInput, Message, AdminMessage } from "../components";
import { BarIndicator } from "react-native-indicators";
import ImagePicker from "react-native-image-picker";
import { sbGetGroupChannel, sbGetOpenChannel, sbCreatePreviousMessageListQuery, sbAdjustMessageList, sbIsImageMessage, sbMarkAsRead } from "../sendbirdActions";
import appStateChangeHandler from '../appStateChangeHandler'
import {Spacing, Font} from "../../Library/Native/StyleGuide";
import Header from "../../Library/Native/Header";
import Loader from "../../Library/Native/Loader";
import withErrorHandling from '../../../Containers/Native/withErrorHandling';

class Chat extends Component {

  constructor(props) {
    super(props);
    this.flatList = null;
    this.state = {
      channel: null,
      isLoading: false,
      previousMessageListQuery: null,
      textMessage: "",
    };
  }

  componentDidMount() {
    this.willFocusSubsription = this.props.navigation.addListener('willFocus', () => {
      this._init()
    })
    this.appStateHandler = appStateChangeHandler.getInstance().addCallback('CHAT', () => {
      this._init()
    })
    this.props.navigation.setParams({ handleHeaderLeft: this._onBackButtonPress });
    BackHandler.addEventListener('hardwareBackPress', this._onBackButtonPress);
  }
  componentWillUnmount() {
    this.appStateHandler();
    this.willFocusSubsription.remove();
    BackHandler.removeEventListener('hardwareBackPress', this._onBackButtonPress);
  }

  _init = () => {
    this.props.initChatScreen();
    const { channelUrl, isOpenChannel } = this.props.navigation.state.params;
    if (isOpenChannel) {
      sbGetOpenChannel(channelUrl).then(channel => this.setState({ channel }, () => this._componentInit()));
    } else {
      sbGetGroupChannel(channelUrl).then(channel => this.setState({ channel }, () => this._componentInit()));
    }
  }

  _componentInit = () => {
    const { channelUrl, isOpenChannel } = this.props.navigation.state.params;
    //this.props.openChannelProgress(false);
    this.props.groupChannelProgress(false);
    this.props.getChannelTitle(channelUrl, isOpenChannel);
    this.props.createChatHandler(channelUrl, isOpenChannel);
    this._getMessageList(true);
    if (!isOpenChannel) {
      sbMarkAsRead({ channelUrl });
    }
  };

  componentDidUpdate() {
    const { channelUrl, isOpenChannel } = this.props.navigation.state.params;
    if (!isOpenChannel) {
      this.state.textMessage ? this.props.typingStart(channelUrl) : this.props.typingEnd(channelUrl);
    }
  }

  _onBackButtonPress = () => {
    const { channelUrl, isOpenChannel, _initListState } = this.props.navigation.state.params;
    if (_initListState) _initListState();
    this.setState({ isLoading: true }, () => {
      this.props.channelExit(channelUrl, isOpenChannel);
    });
    return true;
  };

  componentWillReceiveProps(props) {
    const { title, memberCount, list, exit } = props;
    const { channelUrl, isOpenChannel } = this.props.navigation.state.params;

    if (memberCount !== this.props.memberCount || title !== this.props.title) {
      const setParamsAction = NavigationActions.setParams({
        params: { memberCount, title },
        key: this.props.navigation.state.key
      });
      this.props.navigation.dispatch(setParamsAction);
    }

    if (list !== this.props.list) {
      this.setState({ isLoading: false });
    }

    if (exit) {
      this.setState({ isLoading: false }, () => {
        this.props.navigation.goBack();
      });
    }
  }

  _onTextMessageChanged = textMessage => {
    this.setState({ textMessage });
  };

  _onUserBlockPress = userId => {
    Alert.alert("User Block", "Are you sure want to block user?", [{ text: "Cancel" }, { text: "OK", onPress: () => this.props.onUserBlockPress(userId) }]);
  };

  _getMessageList = init => {
    if (!this.state.previousMessageListQuery && !init) {
      return;
    }
    const { channelUrl, isOpenChannel } = this.props.navigation.state.params;
    this.setState({ isLoading: true }, () => {
      if (init) {
        sbCreatePreviousMessageListQuery(channelUrl, isOpenChannel)
          .then(previousMessageListQuery => {
            this.setState({ previousMessageListQuery }, () => {
              this.props.getPrevMessageList(this.state.previousMessageListQuery);
            });
          })
          .catch(error => this.props.navigation.goBack());
      } else {
        this.props.getPrevMessageList(this.state.previousMessageListQuery);
      }
    });
  };

  _onSendButtonPress = () => {
    if (this.state.textMessage) {
      const { channelUrl, isOpenChannel } = this.props.navigation.state.params;
      const { textMessage } = this.state;
      this.setState({ textMessage: "" }, () => {
        this.props.onSendButtonPress(channelUrl, isOpenChannel, textMessage);
        if(this.props && this.props.list && this.props.list.length > 0) {
          this.flatList.scrollToIndex({
            index: 0,
            viewOffset: 0
          });
        }
      });
    }
  };

  _onPhotoAddPress = () => {
    const { channelUrl, isOpenChannel } = this.props.navigation.state.params;
    Permissions.checkMultiple([ 'photo' ]).then(response => {
      if(response.photo === 'authorized') {
        ImagePicker.showImagePicker(
          {
            title: "Select Image File To Send",
            mediaType: "photo",
            noData: true
          },
          response => {
            if (!response.didCancel && !response.error && !response.customButton) {
              let source = { uri: response.uri };
              if (response.name) {
                source["name"] = response.fileName;
              } else {
                paths = response.uri.split("/");
                source["name"] = paths[paths.length - 1];
              }
              if (response.type) {
                source["type"] = response.type;
              } else {
                /** For react-native-image-picker library doesn't return type in iOS,
                 *  it is necessary to force the type to be an image/jpeg (or whatever you're intended to be).
                */
                if (Platform.OS === "ios") {
                  source["type"] = 'image/jpeg';
                }
              }
              this.props.onFileButtonPress(channelUrl, isOpenChannel, source);
            }
          }
        );
      } else if(response.photo === 'undetermined') {
        Permissions.request('photo').then(response => {
          this._onPhotoAddPress();
        });
      } else {
        Alert.alert('Permission denied',
          'You declined the permission to access to your photo.',
          [ { text: 'OK' } ],
          { cancelable: false });
      }
    });
  };

  _renderFileMessageItem = rowData => {
    const message = rowData.item;
    if (message.isUserMessage()) {
      return <TextItem isUser={message.isUser} message={message.message} />;
    } else if (sbIsImageMessage(message)) {
      return <ImageItem isUser={message.isUser} message={message.url.replace("http://", "https://")} />;
    } else {
      return <FileItem isUser={message.isUser} message={message.name} />;
    }
  };

  _renderList = rowData => {
    const message = rowData.item;
    const { isOpenChannel } = this.props.navigation.state.params;
    const { channel } = this.state;
      if (message.isUserMessage() || message.isFileMessage()) {
      return (
        <Message
          key={message.messageId ? message.messageId : message.reqId}
          isShow={message.sender.isShow}
          isUser={message.isUser}
          // profileUrl={message.sender.profileUrl.replace("http://", "https://")}
          onPress={() => {}}
          nickname={message.sender.nickname}
          time={message.time}
          readCount={isOpenChannel || !channel ? 0 : channel.getReadReceipt(message)}
          message={this._renderFileMessageItem(rowData)}
        />
      );
    } else if (message.isAdminMessage()) {
      return <AdminMessage message={message.message} />;
    } else {
      return <View />;
    }
  };

  _renderTyping = () => {
    const { isOpenChannel } = this.props.navigation.state.params;
    return isOpenChannel ? null : (
      <View style={styles.renderTypingViewStyle}>
        <View style={{ opacity: this.props.typing ? 1 : 0, marginRight: Spacing.tiny,  }}>
          <BarIndicator count={Spacing.micro} size={10} animationDuration={900} color={Colors.primary} />
        </View>
        <Text style={{ color: Colors.lightGrey, fontSize: Font.small }}>{this.props.typing}</Text>
      </View>
    );
  };

  render() {
    // console.log(this.props.list);
    return (
      <View style={styles.containerViewStyle}>
        <View style={{height: '11%'}}>
        <View style={{height: Spacing.small, flex: 1}}>
            <Header
                icon='arrow-back'
                title={this.props.title}
                _callback={() => {this.props.navigation.state.params.handleHeaderLeft()}}
            />
        </View>
        </View>
            {/*<View style={{flex: 8, marginBottom: this.state.keyboardHeight}}>*/}


                <KeyboardAvoidingView style={{flex: 8}} behavior="height" enabled>
                    <View style={styles.messageListViewStyle}>
                        <FlatList
                            ref={elem => this.flatList = elem}
                            renderItem={this._renderList}
                            data={this.props.list}
                            extraData={this.state}
                            keyExtractor={(item, index) => item.messageId + ''}
                            onEndReached={() => this._getMessageList(false)}
                            onEndReachedThreshold={0}
                        />
                    </View>
                    {/*<View style={styles.messageInputViewStyle}>*/}
                    {/*{this._renderTyping()}*/}

                    <MessageInput
                        onRightPress={this._onSendButtonPress}
                        textMessage={this.state.textMessage}
                        onChangeText={this._onTextMessageChanged}
                    />
                    {/*</View>*/}
                </KeyboardAvoidingView>

            {/*</View>*/}

      </View>
    );
  }
}

function mapStateToProps({ chat }) {
  let { title, memberCount, list, exit, typing } = chat;
  list = sbAdjustMessageList(list);
  return { title, memberCount, list, exit, typing };
}

export default connect(mapStateToProps, {
  // openChannelProgress,
  groupChannelProgress,
  initChatScreen,
  getChannelTitle,
  createChatHandler,
  onSendButtonPress,
  getPrevMessageList,
  onUserBlockPress,
  onFileButtonPress,
  typingStart,
  typingEnd,
  channelExit
})(withErrorHandling(Chat));

const styles = {
  renderTypingViewStyle: {
    flexDirection: "row",
    marginLeft: Spacing.small,
    marginRight: Spacing.small,
    marginTop: Spacing.micro,
    marginBottom: 0,
    paddingBottom: 0,
    height: 14
  },
  containerViewStyle: {
    backgroundColor: '#fff',
    flex: 1
  },
  messageListViewStyle: {
    flex: 1,
    transform: [{ scaleY: -1 }],
    marginBottom: Spacing.small
  },
  messageInputViewStyle: {
    backgroundColor:'#fff',
    // flexDirection: "column",
    // justifyContent: 'space-between'
  }
};
