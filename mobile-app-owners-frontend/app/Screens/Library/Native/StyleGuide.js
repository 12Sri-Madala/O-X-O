import {  Dimensions} from 'react-native';

//Calculating REM
let remScale = 380;
const width = Dimensions.get('window').width;
if (width > 600){
  remScale = 480;
}
const Rem = Dimensions.get('window').width / remScale;

const Colors = {
	primary: '#001970',
	secondary: '#ff5252',
	dark: '#484848',
	light: '#767676',
  lightGrey: '#e6e9f0',
	white: '#fafafa',
	disabled: '#E5E5E5',
	error:'#C50E29',
	disabledOpacity: '80%',
	touchedOpacity: 0.3,
};

const Font = {
	title_1: 44 * Rem,
	title_2: 32 * Rem,
	title_3: 24 * Rem,
	large: 19*Rem,
	regular: 17*Rem,
	small: 14*Rem,
	micro: 8*Rem,
};

const Spacing = {
	magnificent: 300 * Rem,
	x_large: 64 * Rem,
	larger: 54*Rem,
	large: 48 * Rem,
	base: 24 * Rem,
	small: 16 * Rem,
	tiny: 8 * Rem,
	micro: 4 * Rem,
	buttonRadius: 8 * Rem,
	lineWidth: 1 * Rem,
};

const Icons = {
	huge: 128 * Rem,
	x_large: 64 * Rem,
	large: 48 * Rem,
	medium: 36 * Rem,
	small: 24 * Rem,
}

const Logo = {
	large: 65 * Rem,
	medium: 50* Rem
}



export { Colors, Font, Spacing, Icons, Logo, Rem };
