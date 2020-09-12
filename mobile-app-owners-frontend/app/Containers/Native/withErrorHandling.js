import React from 'react';
import GenericError from '../../Screens/Error/Native/GenericError';
import UnauthorizedError from '../../Screens/Error/Native/UnauthorizedError';

function withErrorHandling(WrappedComponent){
  return class extends React.Component {

    constructor(props){
      super(props);
      this.state = {
        hasError: false,
        error: null,
        errorInfo: null
      }
      this.getErrorRender = this.getErrorRender.bind(this);
    }

    getErrorRender(error){
      console.log('About to log error');
      if(typeof(error) === 'string' && error.includes('Unauthorized')){
        this.props.navigation.navigate('UnauthorizedError');
        return null;
      }
      this.props.navigation.navigate('GenericError');
      return null;
    }

    render(){
      // const error = this.props.error ? this.props.error : this.state.error;
      if(this.props.error){
        console.log(this.props.error);
        return this.getErrorRender(this.props.error);
      }
      return <WrappedComponent {...this.props} />;
    }
  }
}

export default withErrorHandling;
