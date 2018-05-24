import React, { Component } from 'react'
import Template from './index'

export default class extends Component {
    render() {
        return (
            <div>
                <Template title="运营数据" dmp={ true } dev_id="A4.1-1.1" eventtype="jump" template="/html/help/datadisclose-two.html" />
            </div>
        )
    }
}