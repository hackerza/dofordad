/*global FB*/

import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios'

class App extends Component {

  constructor(props) {
    super(props)

    this.state = {
      message: 0,
      value: ""
    }

    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.getMessage = this.getMessage.bind(this);
    this.setName = this.setName.bind(this);
  }

  componentDidMount() {
    let self = this;

    window.fbAsyncInit = function() {
      FB.init({
        appId      : '2129582177265585',
        cookie     : true,
        xfbml      : true,
        version    : 'v3.2'
      });

      FB.login(function(response) {
        if (response.authResponse) {
          console.log('Welcome!  Fetching your information.... ');
          FB.api('/me', function(response) {
            self.setName(response.name);
            console.log('Good to see you, ' + response.name + '.');
          });
        } else {
          console.log('User cancelled login or did not fully authorize.');
        }
      });
    };

    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "//connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  }

  setName(name){
    this.setState({
      value: name
    });
  }

  async getMessage(res){
    let pixelForm = new FormData();
    pixelForm.append('fb_id', res.id);
    let pixel = await axios.post( "https://cors-anywhere.herokuapp.com/http://dofordad.com/check_status.php", pixelForm);
    let dataForm = new FormData();
    dataForm.append('pixel', pixel.data.id)
    let data = await axios.post( "https://cors-anywhere.herokuapp.com/http://dofordad.com/get_info.php", dataForm);
    this.setState({
      message: data.data.goal
    });
  }

  async handleClick() {
  let self =this;
    FB.api('/me', function(response) {
      self.getMessage(response);
      console.log('Good to see you, ' + response.name + '.');
    });
  }

  handleChange(event) {
    this.setState({
      value: event.target.value
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>Facebook Name</p>
          <input type="text" value={this.state.value} onChange={this.handleChange} /><br/>
          <button type="button" onClick={this.handleClick}>Search</button><br/>
          <p>{this.state.message}</p>
        </header>
      </div>
    );
  }
}

export default App;
