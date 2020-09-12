/*
Renders a customizeable footer containing as many dynamically sized buttons as desired
Accepted Props:
	buttons - array containing as many objects as desired where each object contains style 
	information for that specific button
*/

// Import components from React and React Native
import React from 'react';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';

// Import local components
import OxoButton from './OxoButton.js';

// Import local styles
import { Colors, Font, Spacing } from './StyleGuide.js';

export default class Footer extends React.Component {
	constructor(props){
		super(props);
		this.state = {};
	}

	/* 
    Description: Mapping function to convert every object in props.buttons into a button in the footer
    Arguments: N/A
    Returns: Array with as many JSX button objects as were in the props.buttons array
	*/
	populateView(){
		return(
			this.props.buttons.map((button, index) =>
				<OxoButton
					key={index}
					buttonSize={button.buttonSize}
					fontSize={button.fontSize}
					content={button.content}
					color={button.color}
					paddingHorizontal={button.paddingHorizontal}
					icon={button.icon}
					iconLocation={button.iconLocation}
					type={button.type}
					onPress={button.onPress}
					extraWidth={button.extraWidth}
				/>
			)
		);
	}

	render(){
		return(
			<View style={{
				...StyleSheet.flatten(styles.container),
				backgroundColor: Colors[this.props.color],
			}}>
				{this.populateView()}
			</View>
		);
	}
}



const styles = StyleSheet.create({
	container: {
		width: '100%',
		height: '100%',
		flexDirection: 'row',
		justifyContent: 'space-evenly',
		alignItems: 'center'
	},
});