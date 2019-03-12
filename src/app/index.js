import React, { Component } from 'react';

import Coordinates from '../components/Coordinates'
import './css/styles.css';

class App extends Component {
  state = {
    loading: true,
    timestamp: null,
    iss_position: {
      latitude: null,
      longitude: null
    }
  }

  componentDidMount() {
    this.positionUpdateInterval = setInterval(() => this.fetchIssPosition(), 5000);
  }

  componentWillUnmount() {
    clearInterval(this.positionUpdateInterval);
  }

  fetchIssPosition = () => {
    fetch('http://api.open-notify.org/iss-now.json')
    .then(response => {
      if (response.ok) return response.json();
      throw new Error(response.status);
    })
    .then(data => {
      this.setState({
        loading: false,
        timestamp: data.timestamp,
        iss_position: data.iss_position,
        errorMessage: null
      });
    })
    .catch(error => {
      this.setState({
        loading: false,
        errorMessage: error.message
      });
    });
  }

  render() {
    return (
      <Coordinates>
        <p>{this.state.timestamp}</p>
        <p>{this.state.iss_position.latitude}</p>
        <p>{this.state.iss_position.longitude}</p>
      </Coordinates>
    );
  }
}

export default App;
