import React from 'react';
import { View, Text } from 'react-native';
import { MessageBubble } from './MessageBubble';
import { Font, Colors, Spacing } from '../../Library/Native/StyleGuide';


const _renderUnreadCount = (readCount) => {
    return readCount ? (
        <Text style={{fontSize: Font.small, color: Colors.secondary}}>{'.'}</Text>
    ) : null;
}

const MessageContainer = (props) => {
    return (
        <View style={{flexDirection: props.isUser ? 'row-reverse' : 'row'}}>
            <MessageBubble
                isShow={props.isShow}
                isUser={props.isUser}
                nickname={props.nickname}
                message={props.message}
                time={props.time}
            />
          <View style={{flexDirection: 'column-reverse', paddingLeft: Spacing.tiny/2, paddingRight: Spacing.tiny/2}}>
            { props.isUser ? _renderUnreadCount(props.readCount) : null }
            </View>
        </View>
    )
}

const styles = {

}

export { MessageContainer };
