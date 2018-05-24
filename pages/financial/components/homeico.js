import React, { Component } from 'react'
import track from '../../../static/merge/track-base'

export default class extends Component {
    componentDidMount() {
        track.init()
    }
    goHome = () => {
        location = '/home'
    }
    render() {
        return (
            <div className="goto-home dmp-click" dev_id={ this.props.dev_id || '' } eventtype="jump" onClick={ this.goHome }></div>
        )
    }
}