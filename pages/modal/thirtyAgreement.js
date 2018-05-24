import React, { Component } from 'react'
import Template from './index'
import { getCookie, getQueryString } from '../../common/Util'

export default class extends Component {
    static async getInitialProps(ctx) {
        const params = {
            productId: ctx.req.query.productId,
            productCode: ctx.req.query.productCode,
            productJoinId: ctx.req.query.productJoinId,
            token: ctx.req.query.token,
            clientTime: ctx.req.query.clientTime,
        }
        return {
            params
        }
    }
    render() {
        const { productId, productCode, productJoinId, token, clientTime } = this.props.params
        return (
            <div>
                <Template title="新元宝（新手专享）服务协议" template={ "/html/products/thirtyProduct/agreement-template.html?productId=" + productId + '&productCode=' + productCode + '&productJoinId=' + productJoinId + '&token=' + token + '&clientTime=' + clientTime } />
            </div>
        )
    }
}