import React from 'react';
import { View, Text, Linking, Dimensions, Alert } from 'react-native';

// Consider turning this into its own class
import { Icon } from 'react-native-elements';
import { Font, Colors, Icons, Spacing } from '../../Library/Native/StyleGuide';
export function textIcon(text, icon, right, color){
    return(
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {!right &&
                <Icon
                    name={icon}
                    size={Icons.small}
                    color={color ? Colors[color] : Colors.primary}
                />
            }
            <Text style={{
                fontSize: Font.large,
                color: color ? Colors[color] : Colors.primary,
                marginLeft: !right ? Spacing.tiny : 0,
                marginRight: right ? Spacing.tiny : 0
            }}>{text}</Text>
            {right &&
                <Icon
                    name={icon}
                    size={Icons.small}
                    color={color ? Colors[color] : Colors.primary}
                />
            }
        </View>
    );
}

export function timeDifference(pickupTime, dropoffTime){
    let pickup = new Date(pickupTime);
    let dropoff = new Date(dropoffTime);
    let timeDiff = dropoff.getTime() - pickup.getTime();
    if (timeDiff < 0) {
        return '0 hours 0 minutes'
    }
    timeDiff = timeDiff/(1000*3600);
    let hours = Math.floor(timeDiff)
    let minutes = Math.round((timeDiff - hours)*60);
    if(minutes !== 0){
        return(`${hours} hours ${minutes} minutes`);
    }
    return(`${hours} hours`);
}

export function openMaps(street, locale){
	street = street.replace(/ /g, '+');
	//locale = locale.replace(/,/g, '');
	//locale = locale.replace(/ /g, '+');
	//let query = street + '+' + locale;
    Linking.openURL('https://www.google.com/maps/search/?api=1&query='+street);
}

export function determineButtons(status, callbacks, navigate){
    switch(status){
        case 'Matched':
            return([
                {
                    type: 'text',
                    buttonSize: 'large',
                    fontSize: 'large',
                    content: 'REJECT',
                    color: 'primary',
                    onPress: callbacks[0]
                },
                {
                    type: 'contained',
                    buttonSize: 'large',
                    fontSize: 'large',
                    content: 'ACCEPT',
                    color: 'secondary',
                    onPress: callbacks[1]
                }
            ]);
        case 'Live':
        case 'Confirmed':
            return([{
                type: 'text',
                buttonSize: 'large',
                fontSize: 'large',
                content: 'CANCEL',
                color: 'dark',
                onPress: callbacks[0]
            }]);
        case 'Confirmed Live':
            return([
                {
                    type: 'outline',
                    buttonSize: 'large',
                    fontSize: 'large',
                    content: 'Issues',
                    color: 'primary',
                    onPress: callbacks[2]
                },
                {
                    type: 'contained',
                    buttonSize: 'large',
                    fontSize: 'large',
                    content: 'Picked up!',
                    color: 'secondary',
                    onPress: callbacks[1]
                }
            ]);
        case 'Live Live':
            return([
                {
                    type: 'outline',
                    buttonSize: 'large',
                    fontSize: 'large',
                    content: 'Issues',
                    color: 'primary',
                    onPress: callbacks[2]
                },
                {
                    type: 'contained',
                    buttonSize: 'large',
                    fontSize: 'large',
                    content: 'Dropped off!',
                    color: 'secondary',
                    onPress: callbacks[1]
                }
            ]);
        case 'Complete Live':
            return([
                {
                    type: 'outline',
                    buttonSize: 'large',
                    fontSize: 'large',
                    content: 'That match was...',
                    color: 'secondary',
                    paddingHorizontal: Spacing.small,
                    onPress: callbacks[1]
                }
            ]);

        /*case 'Complete':
            return([{
                type: 'text',
                buttonSize: 'large',
                fontSize: 'large',
                content: 'CANCEL',
                color: 'dark'
            }]);*/
        default:
            return([{}]);
    }
}

export function contact(num){
    if (num === null){
        Alert.alert('You may not contact this person at this time.')
    } else{
        Alert.alert('Contact car owner','',[
            {text: 'Call', onPress: () => Linking.openURL(`tel:${num}`).catch(err => console.log('An error occurred', err))},
            {text: 'Text', onPress: () => Linking.openURL(`sms:${num}`).catch(err => console.log('An error occurred', err))},
            {text: 'Cancel', onPress: () => {}}
        ]);
    }
}

export function message(token){
    if (token === null){
        Alert.alert('You may not contact this person at this time.')
    } else{
        console.log(token);
    }
}
