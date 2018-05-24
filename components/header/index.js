import React, { Component } from 'react'
import track from '../../static/merge/track-base'
export default class Header extends Component {
    constructor(props){
        super(props)
    }
    componentDidMount() {
        track.init()
    }
    back = () => {
        if(!this.props.url){
            window.history.back()
        }else{
            location = this.props.url
        }
        // const parentUrl = document.referrer
        // const selfUrlOrigin = location.host
        // history.go(-1);location.reload()
        // if(document.referrer.indexOf('mypurse') == '')
        
    }
    rightBtn = () => {
        this.props.everyRead()
    }
    render() {
        return (
            <div className="login-header common-header">
                <a className={ this.props.back ? 'arrow-left-icon header-left-arrow hide' : this.props.dmp ? 'arrow-left-icon header-left-arrow dmp-click' : 'arrow-left-icon header-left-arrow' } dev_id={ this.props.dev_id || '' } eventtype={ this.props.eventtype || '' } onClick={ this.back }></a>
                <div className={ this.props.weight ? 'common-header-tit bold' : 'common-header-tit' }><h1>{ this.props.title }</h1></div>
                <a className="header-right-btn dmp-click" dev_id={ this.props.rightTitle == '不使用红包' ? 'A9.4-2' : this.props.rightTitle == '兑换记录' ? 'A12.7-2' : this.props.rightTitle == '全部已读' ? 'A13.1-4' : '' } eventtype={ this.props.rightTitle == '全部已读' ? 'refresh' : 'jump' } onClick={ this.rightBtn }>{ this.props.rightTitle }</a>
            </div>
        )
    }
}