import React, { Component } from 'react'
import Template from './index'
import { getCookie } from '../../common/Util'

export default class extends Component {
    constructor(props) {
        super(props)
        this.state = {
            token: ''
        }
    }
    componentDidMount() {
        this.setState({
            token: getCookie('userToken')
        })
    }
    render() {
        return (
            <div>
                <Template title="自动配标委托书" template={ "/html/borrow/proxy.html?token=" + this.state.token } />
            </div>
        )
    }
}