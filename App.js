import React from 'react';
import {StatusBar} from 'react-native';
import {Root} from 'native-base';
import Routing from './app/routes/Routing';

export default class App extends Component {
  render() {
    return (
      <Root>
        <StatusBar backgroundColor="#2B6544" barStyle="light-content" />
        <Provider store={Store}>
          <Routing/>
        </Provider>
      </Root>
    );
  }
}
