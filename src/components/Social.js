import firebase from '../config/constants';
import React, { Component } from 'react';
import PropTypes from 'prop-types';


class Social extends Component {
    constructor(props){
        super(props)
            this.state= {
                author: props.author,
                uid: props.uid,
                followers: {},
                following: {}

            };
    }




}