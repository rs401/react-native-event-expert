import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ListView,
  Image,
  TouchableOpacity
} from 'react-native';

import config from '../../config';
import Geocoder from 'react-native-geocoder';

const API_KEY = config.API_KEY;
const ROOT_URL = 'https://www.eventbriteapi.com/v3/events/search/';
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1!==r2});

module.exports = React.createClass({

  getInitialState() {
    return({
      dataSource: ds.cloneWithRows([]),
      eventType: '',
      city: ''
    });
  },

  componentDidMount(){
    // this.searchEvents('hackathon', 'San Francisco');
  },

  searchEvents(category, city){
    Geocoder.geocodeAddress(city).then((res)=>{
      let position = res[0].position;
      let locationStr = `&location.latitude=${position.lat}&location.longitude=${position.lng}`;
      let FETCH_URL = `${ROOT_URL}?q=${category}${locationStr}`;

      fetch(FETCH_URL, {
        method: 'GET',
        headers: {
          'Authorization': API_KEY
        }
      })
        .then((response) => response.json())
        .then((responseJSON) => {
          this.setState({dataSource: ds.cloneWithRows(responseJSON.events)});
        });
    });
  },

  detail(rowData){
    this.props.navigator.push({
      name: 'eventDetail',
      title: rowData.name.text,
      description: rowData.description.text,
      url: rowData.url,
      img: rowData.logo.url
    })
  },

  renderRow(rowData){
    const defaultImg = 'http://images.clipartpanda.com/question-clipart-royalty-free-question-mark-clipart-illustration-60294.jpg';
    let img = rowData.logo != null ? rowData.logo.url : defaultImg;

    return(
      <View style={styles.row}>
        <Image
          style={styles.rowLogo}
          source={{uri: img}}
        />
        <View style={styles.rowDetails}>
          <Text>
            {rowData.name.text.length > 30 ?
              `${rowData.name.text.substring(0,30)}...` :
              rowData.name.text
            }
          </Text>
          <TouchableOpacity
            onPress={() => this.detail(rowData)}
          >
            <Text style={styles.link}>
              More Details...
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  },

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Event Expert</Text>
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder='Kind of event...'
            onChangeText={(text) => this.setState({eventType: text})}
          />
          <TextInput
            style={styles.input}
            placeholder='City'
            onChangeText={(text) => this.setState({city: text})}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() => this.searchEvents(this.state.eventType, this.state.city)}
            >
              <Text style={styles.button}>
                Search
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.list}>
          <ListView
            dataSource={this.state.dataSource}
            renderRow={(rowData) => this.renderRow(rowData)}
            enableEmptySections={true}
          />
        </View>
      </View>
    );
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    margin: 20,
    textAlign: 'center',
    fontSize: 20
  },
  form: {
    flex: 2,
  },
  list: {
    flex: 3
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    padding: 5
  },
  rowDetails: {
    flex: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  rowLogo: {
    flex: 1,
    width: 50,
    height: 50,
    borderColor: '#000',
    borderWidth: 1
  },
  input: {
    borderColor: '#000',
    borderRadius: 5,
    borderWidth: 1,
    margin: 5,
    textAlign: 'center'
  },
  button: {
    borderColor: '#0000ff',
    borderRadius: 5,
    borderWidth: 1,
    textAlign: 'center',
    padding: 10,
    color: '#0000ff'
  },
  buttonContainer: {
    flex: 1,
    padding: 5
  },
  link: {
    color: '#0000ff'
  }
});


