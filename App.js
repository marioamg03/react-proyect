import React,{Component} from 'react';
import { AppLoading } from 'expo';
import {StatusBar} from 'react-native';
import {Provider} from 'react-redux';
import Store from './app/redux/store/Store';
import {Root} from 'native-base';
import Routing from './app/routes/Routing';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isReady: false,
    };
  }

  async componentDidMount() {
    await Font.loadAsync({
      Roboto: require('native-base/Fonts/Roboto.ttf'),
      Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
      ...Ionicons.font,
    });
    this.setState({ isReady: true });
  }

  render() {

    if (!this.state.isReady) {
      return <AppLoading />;
    }
    
    return <Root>
              <StatusBar backgroundColor="#0475BC" barStyle="light-content" />
              <Provider store={Store}>
                <Routing/>
              </Provider>
            </Root>
  }
}