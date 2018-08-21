import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';

class Comment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      author: props.author,
      text: props.text,
      uid: props.uid
    };
  }

  render() {
    return (
      <Typography component="p">
        <b>{this.state.author}:</b>
        <br />
        {this.state.text}
        <br />
      </Typography>
    );
  }

}

export default Comment;