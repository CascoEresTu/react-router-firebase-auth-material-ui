import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { CardHeader, Avatar, IconButton } from '@material-ui/core';
import firebase from '../config/constants';
import ThumbUpIcon from '@material-ui/icons/ThumbUp'
import Comment from './Comment'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';



class Post extends Component {
    classes = {};

    constructor(props) {
        super(props)
        this.LikeHandler = this.LikeHandler.bind(this);
        this.CommentHandler = this.CommentHandler.bind(this);
        this.FollowerHandler = this.FollowerHandler.bind(this);
        this.isFollowed = this.isFollowed.bind(this);

        this.classes = props.classes;
        this.state = {
            currentUser: props.currentUser,
            key: props.postid,
            author: props.author,
            authorPic: props.authorPic,
            privacy: props.privacy,
            title: props.title,
            body: props.body,
            Likes: props.Likes,
            followers: {},
            //following: {},
            comments: {},
            draft: ''
        };
    }

    LikeHandler(event) {
        var likeContainer = {};

        var dbRef = firebase.database().ref('/posts/' + this.state.key);

        var updates = {
            author: this.state.author,
            authorPic: this.state.authorPic,
            body: this.state.body,
            privacy: this.state.privacy,
            title: this.state.title,
            uid: this.state.currentUser.uid
        }

        if (!this.state.Likes) {
            // sin likes
            likeContainer[this.state.currentUser.uid] = true;
        } else if (!(this.state.Likes[this.state.currentUser.uid])) {
            // likes de otros, pero no del user actual
            likeContainer[this.state.currentUser.uid] = true;
        } else {
            // user da like 
            likeContainer[this.state.currentUser.uid] = !this.state.Likes[this.state.currentUser.uid];
        }
        // actualizacion de DB
        updates.Likes = likeContainer;
        dbRef.update(updates);
        this.setState({ Likes: likeContainer });
    }

    LikeCount() {
        var count = 0;
        for (let key in this.state.Likes) {
            if (this.state.Likes[key]) {
                count += 1;
            }
        }
        return count;
    }

    CommentHandler(event) {
        var updatedComments = this.state.comments || {};

        const newComment = {
            author: this.state.currentUser.username,
            text: this.state.draft,
            uid: this.state.currentUser.uid
        };

        this.dbRefComments.push(newComment).then((snap) => {
            const key = snap.key;
            updatedComments[key] = newComment;
            this.setState(updatedComments);
            this.setState({ draft: '' });
        });
    }

    FollowerHandler(event) {
        var followsYou = {};
        var dbRefFollowers = firebase.database().ref('/posts/' + this.state.key);

        if (!this.state.followers) {
            followsYou[this.state.currentUser.uid] = true;
        } else if (!(this.state.followers[this.state.currentUser.uid])) {
            followsYou = this.state.followers;
            followsYou[this.state.currentUser.uid] = true;
        } else {
            followsYou = this.state.followers;
            followsYou[this.state.currentUser.uid] = !this.state.followers[this.state.currentUser.uid];
        }
        dbRefFollowers.update(followsYou);
        this.setState({ followers: followsYou });

    }
    isFollowed() {
        if (this.state.followers
            && this.state.currentUser.uid in this.state.followers
            && this.state.followers[this.state.currentUser.uid] === true) {

            return 'Dejar de Seguir';
        } else {
            return 'seguir';
        }
    }

    render() {
        var comments = [];
        for (let key in this.state.comments) {
            let comment = this.state.comments[key];
            comments.push(<Comment
                key={key}
                author={comment.author}
                text={comment.text}
                uid={comment.uid}
            />);
        }
        return (
            <div>
                <Card className={this.classes.card}>
                    <CardHeader
                        avatar={
                            <Avatar
                                alt="Remy Sharp"
                                src={
                                    this.state.authorPic}
                                className={this.classes.avatar}
                            />
                        }
                        action={
                            <IconButton onClick={this.LikeHandler}>
                                <ThumbUpIcon />
                            </IconButton>
                        }

                        title={this.state.author}
                        subheader={'Likes: ' + (this.state.Likes ? this.LikeCount() : 0)}
                    />




                    <CardContent>
                        <Typography gutterBottom variant="headline" component="h2">
                            {this.state.title}
                        </Typography>
                        <Typography component="p">
                            {this.state.body}
                        </Typography>

                        {comments}

                        <Typography component="p">
                            Escribe tu comentario aqui:
                        </Typography>
                        <TextField
                            value={this.state.Draft}
                            hinttext="Escribe tu cometario"
                            floatinglabeltext="Hola..."
                            onChange={(event) => this.setState({ draft: event.target.value })}
                        />

                    </CardContent>
                    <CardActions>
                        <Button size="small" color="primary" onClick={this.CommentHandler}>
                            Comentario aqui.
                        </Button>

                        <Button size="small" color="primary" onClick={this.FollowerHandler}>
                            {this.isFollowed()}
                        </Button>
                    </CardActions>
                </Card>
            </div>
        );
    }


    componentDidMount() {

        this.dbRefPost = firebase.database().ref('/posts/' + this.state.key);
        this.dbCallbackPost = this.dbRefPost.on('value', (snap) => {
            this.setState(snap.val());
        });


        this.dbRefUserPost = firebase.database().ref('/user-posts/' + this.state.key);
        this.dbCallbackUserPost = this.dbRefUserPost.on('value', (snap) => {
            this.setState(snap.val());
        });


        this.dbRefComments = firebase.database().ref('/comments/' + this.state.key);
        this.dbCallbackComments = this.dbRefComments.on('value', (snap) => {
            this.setState({ comments: snap.val() });
        });

        this.dbRefFollowers = firebase.database().ref('/followers/' + this.state.uid);
        this.dbCallbackFollowers = this.dbRefFollowers.on('value', (snap) => {
            this.setState({ followers: snap.val() });
        });


    }
/*
    componentWillUnmount() {
        this.dbRefPost.off('value', this.dbCallbackPost);
        this.dbRefUserPost.off('value', this.dbCallbackUserPost);
        this.dbRefFollowers.off('value', this.dbCallbackFollowers);
        this.dbRefComments.off('value', this.dbCallbackComments);

    }*/
}

export default Post;