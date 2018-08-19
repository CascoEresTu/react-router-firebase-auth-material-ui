import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import firebase from '../../config/constants';
import { Checkbox, FormControlLabel } from '@material-ui/core';
import Radio from '@material-ui/core/Radio'

const styles = {
  card: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: '56.25%',
  },
};

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: {},
      title: '',
      body: '',
      privacy: 0
    };
  }

  handleSubmit(event) {
    event.preventDefault();

    // build the post
    const newPost = {
      author: this.state.currentUser.username,
      authorPic: this.state.currentUser.profile_picture,
      body: this.state.body,
      starCount: 0,
      title: this.state.title,
      uid: this.state.currentUser.uid,
      privacy: this.state.privacy

    };

    // post to posts and user-posts
    firebase.database().ref('/posts').push(newPost).then((snap) => {
      const key = snap.key;
      const path = '/user-posts/' + this.state.currentUser.uid + '/' + key;
      firebase.database().ref(path).set(newPost);
    });
  };

  handleChange = event =>{this.setState({privacy: event.target.value})}

  render() {

    return (
      <form onSubmit={this.handleSubmit.bind(this)} style={style.container}>
        <h3>NUEVO POST</h3>
        <p>Titulo:</p>
        <TextField
          hinttext="Post title"
          floatinglabeltext="Title"
          onChange={(event) => this.setState({ title: event.target.value })}
        />
        <br />
        <p>Contenido:</p>
        <TextField
          hinttext="Post body"
          floatinglabeltext="Body"
          onChange={(event) => this.setState({ body: event.target.value })}
        />
        <br />
        <br />
        <p>Privado?</p>
        <FormControlLabel
          value="1"
          control={
            <Radio
              name="privado"
              value="1"
              onChange={this.handleChange}
            />
          }
        />


        <br />

        <Button
          style={style.raisedBtn}
          type="submit"
        >Submit</ Button>
      </form>
    );
  }

  setUser(user) {
    // if user not in db: add him
    firebase.database().ref('/users/' + user.uid).on('value', (snap) => {
      if (!snap.val()) {
        firebase.database().ref('/users/' + user.uid).set({
          email: user.email,
          profile_picture: user.photoURL,
          username: user.displayName
        });
      }
    });

    // add user info to state
    this.setState({
      currentUser: {
        uid: user.uid,
        email: user.email,
        profile_picture: user.photoURL,
        username: user.displayName
      }
    });
  }

  componentDidMount() {
    // posts
    this.dbRefPosts = firebase.database().ref('/posts');

    // user-posts
    this.dbRefUserPosts = firebase.database().ref('/user-posts');

    // other verifications
    var user = firebase.auth().currentUser;
    if (user) {
      this.setUser(user);
    }
  }

  componentWillUnmount() {
    // posts
    // this.dbRefPosts.off('value', this.dbCallbackPosts);
    // user-posts
    // this.dbRefUserPosts.off('value', this.dbCallbackUserPosts);
  }
}

const raisedBtn = {
  margin: 15
};

const container = {
  textAlign: 'center'
};

const style = {
  raisedBtn,
  container
};

export default withStyles(styles)(Dashboard);