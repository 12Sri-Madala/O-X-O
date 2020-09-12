import React from 'react';
import { View } from 'react-native';
import { Avatar } from 'react-native-elements';

const _renderAvatar = (isShow, initials, onImagePress) => {
    if (!isShow) {
        initials = '';
    }

    return initials ? (
        <Avatar 
            small
            rounded
            title={ initials }
            onPress={onImagePress}
        />
    ) : null;
}

const MessageAvatar = (props) => {
    return (
        <View style={styles.viewStyle}>
            {_renderAvatar(props.isShow, props.initials, props.onPress)}
        </View>
    )
}

const styles = {
    viewStyle: {
        backgroundColor: 'transparent',
        marginRight: 8,
        width: 34,
        height: 34
    }
}

export { MessageAvatar };
