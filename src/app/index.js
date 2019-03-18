import React, { Component, Fragment } from 'react';

import Map from '../components/Map';
import Coordinates from '../components/Coordinates';
import Speed from '../components/Speed';

class App extends Component {
  state = {
    loading: true,
    timestamp: null,
    issPosition: {
      longitude: null,
      latitude: null
    },
    errorMessage: null
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
        issPosition: [
          data.iss_position.longitude,
          data.iss_position.latitude
        ],
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
      <Fragment>
        <Map
          issPosition={this.state.issPosition}
        />
      <Coordinates>
        <p>{this.state.timestamp}</p>
        <p>{this.state.issPosition[0]}</p>
        <p>{this.state.issPosition[1]}</p>
      </Coordinates>
      <Speed
        issPosition={this.state.issPosition}
      />
      </Fragment>
    );
  }
}

export default App;
