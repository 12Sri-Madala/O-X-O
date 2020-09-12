/*
Renders a scrollable calendar header containing information about the match
status of the next 14 days.
Accepted Props:
	week - array of names of days (monday, tuesday, etc.)
	index - index of the currently selected day
	data - array of 14 match objects
	_changePage - callback to update selected page
*/

// Import components from React and React Native
import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableHighlight } from 'react-native';
import { connect } from 'react-redux';

// Import library components

import { Colors, Font, Spacing, Icons, Logo } from '../../Library/Native/StyleGuide.js';


// Import Redux Actions
import {
	calChange,
} from '../Redux/actions.js';
import { Dash } from '../../Library/Native/LanguageGuide.js';


class CalendarHeader extends React.Component {
	constructor(props){
		super(props);
		this.state ={
			week: 0,
		};
	}

	/*
    Description: Gets the information about the day that needs to be displayed in the calendar
    Arguments: date - string from matchesDB describing a day in JavaScript Date object friendly notation
    Returns: {name: name of the day(string), num: number of the day}
	*/
	getInfo(date){
		let d = new Date(date);
		return({
			month: Dash.General.months[d.getMonth()],
			day: Dash.General.week[d.getDay()].slice(0,3),
			num: d.getDate()
		});
	}

	/*
    Description: Automatically scrolls the header to the first or last week if the newly selected day gets changed to
    a day in a different week
    Arguments: N/A
	Returns: N/A
	*/
	componentDidUpdate(){
		if(this.props.selected >= 7 && this.state.week === 0){
			this.scroller.scrollToEnd({animated: true});
			this.setState({week: 1});
		} else if(this.props.selected < 7 && this.state.week === 1){
			this.scroller.scrollTo({x:0, y:0, animated:true});
			this.setState({week: 0});
		}
	}


	conditionalStyle(status, index){
		if(this.props.selected === index){
			switch(status){
				case 'Unavailable':
					return {
						dateColor: Colors.light,
						borderColor: Colors.white,
						borderWidth: 0,
						textColor: Colors.white
					}
				case 'Available':
					return {
						dateColor: Colors.primary,
						borderColor: Colors.white,
						borderWidth: 0,
						textColor: Colors.white
					}
				case 'Matched':
					return {
						dateColor: Colors.primary,
						borderColor: Colors.primary,
						borderWidth: Spacing.lineWidth,
						textColor: Colors.white
					}
				case 'Confirmed':
				case 'Live':
				case 'Complete':
					return {
						dateColor: Colors.secondary,
						borderColor: Colors.white,
						borderWidth: 0,
						textColor: Colors.white
					}
				default:
					return {
						dateColor: 'black',
						borderColor: Colors.light,
						borderWidth: 0,
						textColor: Colors.white
					}
			}
		} else {
			switch(status){
				case 'Unavailable':
					return {
						dateColor: Colors.white,
						borderColor: Colors.white,
						borderWidth: 0,
						textColor: Colors.light
					}
				case 'Available':
					return {
						dateColor: Colors.white,
						borderColor: Colors.white,
						borderWidth: 0,
						textColor: Colors.primary
					}
				case 'Matched':
					return {
						dateColor: Colors.white,
						borderColor: Colors.primary,
						borderWidth: Spacing.lineWidth,
						textColor: Colors.primary
					}
				case 'Confirmed':
				case 'Live':
				case 'Complete':
					return {
						dateColor: Colors.white,
						borderColor: Colors.white,
						borderWidth: 0,
						textColor: Colors.secondary
					}
				default:
					return {
						dateColor: Colors.white,
						borderColor: Colors.white,
						borderWidth: 0,
						textColor: 'black'
					}
			}
		}
	}

	update(index){
		this.props.dispatchCalChange(index);
		this.props.scroll(index);
	}

	/*
    Description: Mapping function to fill scrollview with 14 days worth of calendar day items
    Arguments: N/A
    Returns: Array of 14 calendar day items
	*/
	populateScrollView(){
		// console.log(this.props.matches);
		if(this.props.matches){
			return(
				this.props.matches.map((match, index) => {
					let info = this.getInfo(match.date);
					let style = this.conditionalStyle(match.status, index);
					return(
						<View key={index}>
							<TouchableHighlight
								style={{
									...StyleSheet.flatten(styles.dateContainer),
								}}
								underlayColor={Colors.white}
								onPress={() => this.update(index)}
							>
								<View style={{
									alignItems: 'center',
									paddingHorizontal: Spacing.tiny,
									marginHorizontal: Spacing.tiny/2,
									borderRadius: Spacing.buttonRadius,
									backgroundColor: style.dateColor,
									borderColor: style.borderColor,
									borderWidth: style.borderWidth
								}}>
									<Text style={{
										fontSize: Font.regular,
										color: style.textColor
									}}>
										{info.month}
									</Text>
									<Text style={{
										fontSize: Font.title_3,
										color: style.textColor
									}}>
										{info.num}
									</Text>
									<Text style={{
										fontSize: Font.regular,
										color: style.textColor
									}}>
										{info.day}
									</Text>
								</View>
							</TouchableHighlight>
							{match.status === 'Matched' &&
								<View style={{
									...StyleSheet.flatten(styles.dot),
									backgroundColor: Colors.secondary
								}}></View>
							}
						</View>
					)
				})
			);
		}

	}

	render(){
		return(
			<View style={styles.container}>
				<View style={styles.scroller}>
					<ScrollView horizontal ref={(ref) => this.scroller = ref}>
						{this.populateScrollView()}
					</ScrollView>
				</View>
			</View>
		);
	}
}

const mapStateToProps = state => {
	return {
		matches: state.dash.matches,
		selected: state.dash.selected
	}
}

const mapDispatchToProps = dispatch => {
	return {
		dispatchCalChange: (index, swiper) => dispatch(calChange(index, swiper)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(CalendarHeader);

const styles = StyleSheet.create({
	container: {
		flex: 1.5,
		width: '100%',
		justifyContent: 'center',
		alignItems: 'center',
		borderBottomWidth: Spacing.lineWidth,
		borderColor: Colors.light,
	},
	scroller: {
		width: '100%'
	},
	dateContainer: {
		flexDirection: 'column',
		justifyContent: 'center',
		flexDirection: 'row',
		justifyContent: 'center',
		borderRadius: Spacing.buttonRadius,
	},
	dot: {
		height: Spacing.tiny,
		width: Spacing.tiny,
		position: 'absolute',
		left: Icons.large,
		borderRadius: Logo.medium,
		zIndex: 100
	}
});
