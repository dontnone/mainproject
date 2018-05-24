import React, { Component } from 'react'
import Template from './index'

export default class extends Component {
    render() {
        return (
            <div>
                <Template title="用户授权协议" template="/html/help/licensingAgreement.html" />
            </div>
        )
    }
}