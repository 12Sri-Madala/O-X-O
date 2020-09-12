import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { MessageAvatar } from './MessageAvatar';
import { MessageContainer } from './MessageContainer';
import { Font, Colors, Spacing } from '../../Library/Native/StyleGuide';

class Message extends Component {
    constructor(props) {
        super(props);
    }

    _renderMessageAvatar = () => {
        let initials = this.props.nickname.split(' ')[0][0] + this.props.nickname.split(' ')[1][0];
        return this.props.isUser ? null : (

            <MessageAvatar
                isShow={this.props.isShow}
                initials={initials}
                onPress={this.props.onPress}
            />
        )
    }

    render() {
        return (
             <View style={styles.messageViewStyle}>
                <View style={{flexDirection: this.props.isUser ? 'row-reverse' : 'row', paddingLeft: Spacing.small, paddingRight: Spacing.small, paddingTop: Spacing.tiny/2}}>
                    { this._renderMessageAvatar() }
                    <MessageContainer
                        isShow={this.props.isShow}
                        isUser={this.props.isUser}
                        nickname={this.props.nickname}
                        message={this.props.message}
                        time={this.props.time}
                        readCount={this.props.readCount}
                    />
                </View>
            </View>
        )
    }
}

const AdminMessage = (props) => {
    return (
        <View style={[
                styles.messageViewStyle,
                {
                    padding: Spacing.tiny,
                    marginTop: Spacing.tiny,
                    marginBottom: Spacing.tiny,
                    marginLeft: Spacing.small,
                    marginRight: Spacing.small,
                    backgroundColor: Colors.lightGrey,
                },
            ]}>
            <Text>{ props.message }</Text>
        </View>
    )
}

const styles = {
    messageViewStyle: {
        transform: [{ scaleY: -1 }]
    }
};

export { Message, AdminMessage };
