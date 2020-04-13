import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

export default class Home extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Hello from home!</Text>

        <Button 
          title="Go To Profile"
          onPress={
            () => this.props.navigation.navigate( 'Splash' )
          }
        />
    
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});