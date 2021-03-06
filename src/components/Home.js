import firebase from '../config/constants';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Post from './Post';

const styles = {
  card: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: '56.25%',
  },
};

class Home extends Component {
  classes = {};

  constructor(props) {
    super(props)
    this.classes = props.classes;
    this.state = {
      currentUser: {},
      posts: {},
      users: {}
    };
  }



  sortByDate(arr) {
    return arr.sort((a, b) => {
      let key1 = a.props.datetime;
      let key2 = b.props.datetime;

      if (key1 < key2) {
        return 1;
      }
      if (key1 > key2) {
        return -1;
      }
      return 0;
    });
  }



  render() {
    var result = [];
    if (this.state.posts) {

      for (let key in this.state.posts) {
        let post = this.state.posts[key]
        if (post.privacy == 0) {
          result.push(
            <div>
              <Post
                key={key}
                postid={key}
                currentUser={this.state.currentUser}
                classes={this.classes}
                privacy={post.privacy}
                //author={post.author}
                //authorPic={post.authorPic}
                //title={post.title}
                body={post.body}
                Likes={post.Likes}
                date={post.serverTime}

              />
              <br/>

            </div>
          );
        }


      }

      return result;

    } else {
      return (
        <div>Be the first one to post on the dashboard!</div>
      );
    }

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
    this.dbCallbackPosts = this.dbRefPosts.on('value', (snap) => {
      this.setState({ posts: snap.val() });
    });

    // users
    this.dbRefUsers = firebase.database().ref('/users');
    this.dbCallbackUsers = this.dbRefUsers.on('value', (snap) => {
      this.setState({ users: snap.val() });
    });

    // other verifications
    var user = firebase.auth().currentUser;
    if (user) {
      this.setUser(user);
    }
  }

  componentWillUnmount() {
    // posts
    this.dbRefPosts.off('value', this.dbCallbackPosts);
    // users
    this.dbRefUsers.off('value', this.dbCallbackUsers);
  }

  /*
  <Card>
    <CardTitle title="Card title" subtitle="Card subtitle" />
    <CardText>
      <TextField
        id = "data"
        hintText="Hint Text"
        floatingLabelText="Floating Label Text"
      />
    </CardText>
    <CardActions>
      <RaisedButton label="Action1" />
      <RaisedButton label="Action2" primary={true} onClick={() => { this.prueba(); }}/>
    </CardActions>
  </Card>
  */
}

Home.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Home);