import React from 'react';
import GenericError from '../../Screens/Error/Native/GenericError';

function withErrorHandling(WrappedComponent) {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        hasError: false,
        error: null,
        errorInfo: null,
      };
      this.getErrorRender = this.getErrorRender.bind(this);
    }

    getErrorRender(error) {
      if (error && error.includes('Unauthorized')) {
        this.props.navigation.navigate('UnauthorizedError');
        return null;
      }
      this.props.navigation.navigate('GenericError');
      return null;
    }

    render() {
      // const error = this.props.error ? this.props.error : this.state.error;
      if (this.props.error) {
        console.log(this.props.error);
        return this.getErrorRender(this.props.error);
      }
      return <WrappedComponent {...this.props} />;
    }
  };
}

export default withErrorHandling;
