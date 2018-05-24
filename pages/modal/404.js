import React, { Component } from 'react'
import Template from './index'
import Head from 'next/head'
import Header from '../../components/header/index'
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
        this.timer = setInterval( () =>{
            if(this.state.min == 1){
                clearInterval(this.timer);
                location = '/home'
            }
            this.setState({
                min: this.state.min - 1
            })
        },1000)
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
                <div>
                    <div className="nofind-container position-a" style={{top: '0'}}>
                        <div className="img-bg"></div>
                        <p>啊，页面逃跑了，<span>{ this.state.min }</span>秒后返回首页</p>
                    </div>
                </div>
            </div>
        )
    }
}