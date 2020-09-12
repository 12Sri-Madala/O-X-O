import React from 'react';
import { View, Text } from 'react-native';
import { Font, Spacing, Colors } from '../../Library/Native/StyleGuide';


const _renderNickname = (nickname) => {
    return nickname ? (
        <Text style={{fontSize: Font.small, color: Colors.primary, paddingBottom: Spacing.tiny/2}}>{nickname}</Text>
    ) : null;
}

const MessageBubble = (props) => {
    return (
        <View style={{maxWidth: 250, padding: Spacing.tiny, borderRadius: Spacing.tiny,
        backgroundColor: props.isUser ? Colors.primary : Colors.lightGrey}}>
            {/*{ props.isUser || !props.isShow ? null : _renderNickname(props.nickname) }*/}
            <View>
                {props.message}
            </View>
            {/*<View style={{flexDirection: 'row', justifyContent: 'flex-end', paddingLeft: 8}}>*/}
                {/*<Text style={{fontSize: 8, color: props.isUser ? '#E9EBEF' : '#878d99'}}>{props.time}</Text>*/}
            {/*</View>*/}
        </View>
    )
}

const styles = {

}

export { MessageBubble };
