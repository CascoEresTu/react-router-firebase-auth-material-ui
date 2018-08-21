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

class Profile extends Component {
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

    render() {
        var result = [];
        if (this.state.posts) {
            for (let key in this.state.posts) {
                let post = this.state.posts[key]
                if (post.uid == firebase.auth().currentUser.uid) {
                    result.push(<Post
                        key={key}
                        classes={this.classes}
                        author={post.author}
                        authorPic={post.authorPic}
                        title={post.title}
                        body={post.body}
                        starCount={post.starCount}
                        privacy={post.privacy}
                    />);
                }
            }

            return result;

        }
        else return result;

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


}

Profile.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Profile);