// Import components from React and React Native
import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Dimensions, Keyboard } from 'react-native';
import {Icon} from 'react-native-elements';

// Import elements from separate Node modules
import { Spacing, Colors, Font, Icons } from '../../Library/Native/StyleGuide';

export default class ButtonLeft extends React.Component {
    constructor(props) {
        super(props);
        this._keyboardDidShow = this._keyboardDidShow.bind(this);
        this._keyboardDidHide = this._keyboardDidHide.bind(this);
        var height = Dimensions.get('window').height
        this.state = {
            buttonPosition: height - height*.07 - Spacing.small
        }
    }

    componentDidMount() {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    _keyboardDidShow(e) {
        var height = Dimensions.get('window').height;
        this.setState({
            buttonPosition: height - height*.07 - (e.endCoordinates.height + 10)
        });
    }

    _keyboardDidHide(e) {
        var height = Dimensions.get('window').height;
        this.setState({
            buttonPosition: height - height*.07 - 10
        });
    }

    render(){
        return(
            <View opacity={this.props.opacity} style={[styles.buttonContainer, this.props.relative ? { backgroundColor: this.props.color, marginVertical: Spacing.small} : { backgroundColor: this.props.color, position: 'absolute', top: this.state.buttonPosition } ]}>
                <TouchableOpacity
                    style={styles.touchableContainer}
                    onPress={() => this.props._callBack()}
                >
                    <Text style={styles.title}>{this.props.title}</Text>
                    <Icon
                        name={this.props.icon}
                        size={Icons.medium} color={Colors.white}
                    />
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    touchableContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    buttonContainer: {
        marginLeft: Spacing.small,
        width: Dimensions.get('window').width - 2*Spacing.small,
        height: Spacing.large,
        borderRadius: Spacing.buttonRadius,
    },
    title: {
        paddingRight: Spacing.small,
        color: Colors.white,
        fontSize: Font.title_3,
    }
});
