import React, { Component } from 'react'
import Template from './index'
import Head from 'next/head'
import { setTimeout, setInterval, clearInterval } from 'timers';

export default class extends Component {
    constructor(props) {
        super(props)
        this.timer = undefined
        this.state = {
            min: 5
        }
    }
    componentDidMount() {
        clearInterval(this.timer);
        this.timer = setInterval(() =>{
            if(this.state.min == 1){
                clearInterval(this.timer);
                location = '/home'
            }
            this.setState({
                min: this.state.min - 1
            })
        }, 1000)
    }
    componentWillUnmount() {
        clearInterval(this.timer);
    }
    render() {
        return (
            <div>
                <Head>
                    <link rel='stylesheet' type='text/css' href="/static/mods/home/_.css" />
                </Head>
                <div className="modal-cont">
                    <div className="xxd">
                        <p><span>{ this.state.min }</span>秒后为您跳转至首页</p>
                    </div>
                </div>
            </div>
        )
    }
}