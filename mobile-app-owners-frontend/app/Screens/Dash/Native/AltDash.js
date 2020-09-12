// Import components from React and React Native
import React from 'react';
import {Text } from 'react-native';




export default class Dashboard extends React.Component {



	render() {
		return(
			<Text>{this.props.status}</Text>
		);
	}
}