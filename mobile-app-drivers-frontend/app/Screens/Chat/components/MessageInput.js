import React from 'react';
import { View, TextInput, Dimensions, Platform } from 'react-native';
import { Icon } from 'react-native-elements';
import {Spacing, Font, Colors, Icons} from "../../Library/Native/StyleGuide";

const { width } = Dimensions.get('window');

const MessageInput = (props) => {
  console.log('Using a message input');
  return (
    <View style={styles.containerStyle}>
      {/*<Icon*/}
      {/*containerStyle={{marginLeft: 10}}*/}
      {/*iconStyle={{margin: 0, padding: 0}}*/}
      {/*name='plus'*/}
      {/*type='font-awesome'*/}
      {/*color={'#494e57'}*/}
      {/*size={20}*/}
      {/*onPress={props.onLeftPress}*/}
      {/*/>*/}
      <TextInput
        style={{
          flex: 1,
          color: '#000',
          minHeight: Font.regular,
          paddingTop: Spacing.small/2,
          paddingBottom: Spacing.small/2,
          textAlignVertical: 'center',
          paddingRight: props.placeholder ? Spacing.small : 0
        }}
        multiline={true}
        fontSize={Font.regular}
        autogrow={true}
        maxHeight={props.maxHeight ? props.maxHeight : 70}
        placeholder={props.placeholder ? props.placeholder : 'Your message'}
        autoCapitalize='none'
        selectionColor={'#001970'}
        underlineColorAndroid='transparent'
        value={props.textMessage}
        onChangeText={props.onChangeText}
        returnKeyType='done'
        blurOnSubmit={true}
        />
      {!props.noSendButton && <Icon
        containerStyle={{}}
        iconStyle={{margin: 0, padding: 0}}
        name='arrow-circle-up'
        type='font-awesome'
        color={props.textMessage.length > 0 ? Colors.primary : Colors.dark}
        size={Icons.medium}
        onPress={props.onRightPress}
        />}
      </View>
    )
  }

  const styles = {
    containerStyle: {
      flexDirection: 'row',
      backgroundColor:Colors.white,
      marginBottom: Spacing.tiny,
      marginLeft:Spacing.small,
      marginRight:Spacing.small,
      borderWidth: 0.5,
      borderRadius: Spacing.small,
      borderColor:Colors.primary,
      paddingLeft: Spacing.small,
      paddingRight: Spacing.micro,
    },
  }

  export { MessageInput }
