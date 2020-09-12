// Import components from React and React Native
import React from 'react';
import { StyleSheet, View, Text, Dimensions, TouchableOpacity } from 'react-native';

// Import helpers
import { textIcon, timeDifference, openMaps } from '../../Dash/Native/MatchFoundHelpers';

// Import library components
import { Spacing, Colors, Font } from '../../Library/Native/StyleGuide';
import { convert } from '../../Dash/Native/EditAvailabilityHelpers';

export default class LocationDetails extends React.Component{
    constructor(props){
        super(props);
        this.state = {timeLeft: timeDifference(new Date(), this.props.data.dropoffTime)};
    }

    componentDidMount() {
        this.timerID = setInterval(
            () => this.tick(),
            1000
        );
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    tick() {
        this.setState({
            timeLeft: timeDifference(new Date(), this.props.data.dropoffTime)
        });
    }

    render(){
        return(
            <View style={styles.container}>

                {/*<View style={styles.firstRow}>*/}
                    {/*{textIcon(*/}
                        {/*timeDifference(this.props.data.pickupTime, this.props.data.dropoffTime),*/}
                        {/*'timer'*/}
                    {/*)}*/}
                {/*</View>*/}

                { (this.props.data.status === 'Live') ?
                    <View style={styles.middleRowLive}>
                        {textIcon(this.state.timeLeft + ' remaining', 'hourglass-full')}
                    </View>
                    :
                    <View style={styles.middleRow}>
                        {textIcon(convert(this.props.data.pickupTime), 'hourglass-full')}
                        <Text style={{fontSize: Font.large, color: Colors.primary}}>to</Text>
                        {textIcon(convert(this.props.data.dropoffTime), 'hourglass-empty', true)}
                    </View>
                }

                <TouchableOpacity
                    style={styles.lastRow}
                    activeOpacity={Colors.touchedOpacity}
                    onPress={() => {
                        if (this.props.data.status === "Confirmed") {
                            openMaps(this.props.data.pickupLocation.street, this.props.data.pickupLocation.locale)
                        } if (this.props.data.status === "Live" || this.props.data.status === "Complete") {
                            openMaps(this.props.data.dropoffLocation.street, this.props.data.dropoffLocation.locale)
                        }
                    }}
                >
                    {this.props.data.status === "Confirmed" ?
                        textIcon(
                            this.props.data.pickupLocation.street+',\n'+this.props.data.pickupLocation.locale,
                            'location-on'
                        ) :
                        textIcon(
                            this.props.data.dropoffLocation.street+',\n'+this.props.data.dropoffLocation.locale,
                            'location-on'
                        )
                    }
                </TouchableOpacity>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 5,
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },
    firstRow: {
        width: Dimensions.get('window').width - (2*Spacing.small),
        paddingHorizontal: Spacing.small,
    },
    middleRow: {
        width: Dimensions.get('window').width - (2*Spacing.small),
        paddingHorizontal: Spacing.small,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    middleRowLive: {
        width: Dimensions.get('window').width - (2*Spacing.small),
        paddingHorizontal: Spacing.small,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    lastRow: {
        width: Dimensions.get('window').width - (2*Spacing.small),
        paddingHorizontal: Spacing.small,
        borderWidth: Spacing.lineWidth,
        borderColor: Colors.primary,
        borderRadius: Spacing.buttonRadius,
    }
});