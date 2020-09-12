/*
Customizeable button component
Accepted Props:
	type - one of 'text', 'outline', or 'contained'
	buttonSize - one of the available spacing sizes (string)
	extraWidth - extra horizontal spacing if the word is two big (defined from our wording sheet)
	fontSize - one of the available font sizes (string)
	content - text to put in the button (string)
	color - one of the available colors (string)
	icon - name of the icon (string)
	iconLocation - one of 'left' or 'right'
	opacity -
	onPress - function called when button is presed
*/

// Import components from React and React Native
import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Dimensions} from 'react-native';

// Import elements from separate Node modules
import { Icon } from 'react-native-elements';

// Import local styles
import { Colors, Font, Spacing } from './StyleGuide';

export default class OxoButton extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			//width: undefined,
			//updated: false,
		};
	}

	viewStyle(){

    const extraWidth = this.props.extraWidth ? this.props.extraWidth : 0;
    const buttonSize = this.props.buttonSize ? this.props.buttonSize : 'large';

		let style = {
			height: Spacing[this.props.buttonSize],
			width: (3*Spacing[buttonSize] + extraWidth),
			borderRadius: Spacing.buttonRadius,
			flexDirection: 'row',
			justifyContent: 'center',
			alignItems: 'center',
		};
        if (this.props.paddingHorizontal) {
			style.width = Dimensions.get('window').width - (2*this.props.paddingHorizontal);
            style.paddingHorizontal = this.props.paddingHorizontal;
        }
		if(this.props.type === 'outline'){
			style.borderWidth = Spacing.lineWidth;
			style.borderColor = Colors[this.props.color];
		} else if(this.props.type === 'contained'){
			style.backgroundColor = Colors[this.props.color];
		}
		return(style);
	}

	textStyle(){
		let style = {
			fontSize: Font[this.props.fontSize],
		};
		if(this.props.type === 'contained'){
			style.color = Colors.white;
		} else {
			style.color = Colors[this.props.color];
		}
		if(this.props.icon && this.props.iconLocation === 'left'){
			style.paddingRight = Spacing.tiny;
		} else if(this.props.icon && this.props.iconLocation === 'right'){
			style.paddingLeft = Spacing.tiny;
		}
		return(style);
	}

	fillButton(){
		if(this.props.icon){
			if(this.props.iconLocation === 'left'){
				return(
					<View style={this.viewStyle()}>
						<Icon
							name={this.props.icon}
							size={Font[this.props.fontSize]}
							color={(this.props.type === 'contained') ? Colors.white : Colors[this.props.color]}
							style={{marginRight: Spacing.tiny}}
						/>
						<Text style={this.textStyle()}>{this.props.content}</Text>
					</View>
				);

			} else {
				return(
					<View style={this.viewStyle()}>
						<Text style={this.textStyle()}>{this.props.content}</Text>
						<Icon
							name={this.props.icon}
							size={Font[this.props.fontSize]}
							color={(this.props.type === 'contained') ? Colors.white : Colors[this.props.color]}
							iconStyle={{marginLeft: Spacing.tiny}}
						/>
					</View>
				);
			}
		}
		return(
			<View style={this.viewStyle()}>
				<Text style={this.textStyle()}>{this.props.content}</Text>
			</View>
		);
	}

	render(){
		return(
			<TouchableOpacity
				activeOpacity={this.props.opacity}
				style={{borderRadius: Spacing.buttonRadius}}
				onPress={this.props.onPress}
			>
				{this.fillButton()}
			</TouchableOpacity>
		);
	}
}


const styles = StyleSheet.create({});

/*
	// Could add some more spacing values to style guide to get rid of hard coded numbers here
	// but hard coded numbers come from Google Material standards for buttons
	updateDimensions(event){
		//console.log(event.nativeEvent.layout);
		//console.log(event.nativeEvent.layout.width + 24);
		//console.log(3*Spacing[this.props.buttonSize]);

		if(this.props.icon && !this.state.updated){
			if(this.props.type === 'contained' || this.props.type === 'outlined'){
				if((event.nativeEvent.layout.width+24) <= (3*Spacing[this.props.buttonSize])){
					this.setState({width: (3*Spacing[this.props.buttonSize]), updated: true})
				} else {
					this.setState({width: (event.nativeEvent.layout.width+24), updated: true})
				}
			} else {
				if((event.nativeEvent.layout.width+8) <= (3*Spacing[this.props.buttonSize])){
					this.setState({width: (3*Spacing[this.props.buttonSize]), updated: true})
				} else {
					this.setState({width: (event.nativeEvent.layout.width+8), updated: true})
				}
			}
		} else if(!this.props.icon && !this.state.updated){
			if(this.props.type === 'contained' || this.props.type === 'outlined'){
				if((event.nativeEvent.layout.width+32) <= (3*Spacing[this.props.buttonSize])){
					this.setState({width: (3*Spacing[this.props.buttonSize]), updated: true})
				} else {
					this.setState({width: (event.nativeEvent.layout.width+32), updated: true})
				}
			} else {
				if((event.nativeEvent.layout.width+16) <= (3*Spacing[this.props.buttonSize])){
					this.setState({width: (3*Spacing[this.props.buttonSize]), updated: true})
				} else {
					this.setState({width: (event.nativeEvent.layout.width+16), updated: true})
				}
			}
		}
	}
*/
