// Import components from React and React Native
import React from 'react';

import {StyleSheet, TouchableOpacity, View} from 'react-native';

// Import elements from separate Node modules
import { FormLabel, Input, FormValidationMessage } from 'react-native-elements'
import { Colors, Font, Spacing } from '../../Library/Native/StyleGuide';

export default class EditInput extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            hidden: true
        }
    }

    componentDidMount() {
        this.input.focus();
    }

    errorMessage() {
      if (!this.props.hideError) {
            return(this.props.errorMessage)
        }
    }

    formLabel() {
        if (this.props.displayLabel) {
            return this.props.label
        }
        return ' '
    }


    render(){
        return(
            <View style={styles.inputContainer}>
                <Input
                    label={this.formLabel()}
                    editable={!this.state.hidden}
                    labelStyle={this.props.labelStyle}
                    placeholderTextColor={this.props.placeholderTextColor}
                    placeholder={this.props.placeholder}
                    multiline={false}
                    keyboardType={this.props.pad}
                    containerStyle={styles.valueContainer}
                    inputStyle={this.props.inputStyle}
                    ref={input => this.input = input}
                    selectionColor={this.props.selectionColor}
                    onChangeText={(value) => {this.props.onChangeText(value)}}
                    errorMessage={this.errorMessage()}
                    errorStyle={styles.labelText}
                    caretHidden={this.state.hidden}
                    onTouchStart={()=>  this.setState({hidden: false})}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    labelText: {
        fontSize: Font.regular,
        color: Colors.error,
    },
    valueText: {
        fontSize: Font.title_3,
        color: Colors.white,
    },
    labelContainer: {
        // flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
        // paddingLeft: Spacing.small,
        // paddingRight: Spacing.small,
    },
    valueContainer: {
        // flex: 0,
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
        paddingLeft: '5%',
        paddingRight: '5%',
    },
});
