import React, { Component } from 'react'
import Template from './index'
import { getQueryString } from '../../common/Util'

export default class extends Component {
    constructor(props) {
        super(props)
        this.state = {
            productId: '',
            productCode: 'BID',
            clientTime: ''
        }
    }
    componentDidMount() {
        if(getQueryString('productId') == 'xyd'){
            this.setState({
                productCode: getQueryString('productId'),
            })
        }
        this.setState({
            productId: getQueryString('productId') || '',
            clientTime: getQueryString('clientTime') || ''
        })
    }
    render() {
        return (
            <div>
                <Template title="安全保障" template={ "/html/borrow/repaymentGuaranteeApp.html?productId=" + this.state.productId + '&productCode=' + this.state.productCode + '&clientTime=' + this.state.clientTime } />
            </div>
        )
    }
}