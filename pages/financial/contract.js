import React, { Component } from 'react'
import Head from 'next/head'
import Header from '../../components/header/index'
import Api from '../../components/api/financial'
import { getQueryString } from '../../common/Util'

export default class extends Component {
    constructor(props) {
        super(props)
        this.state = {
            height: '',
            data: {
                productDetail: {}
            }
        }
    }
    async componentDidMount() {
        typeof window !== "undefined" ? window : this
        const document = window.document
        const context = {
            id: getQueryString('id'), 
            type: '7',
        }
        const data = await Api.financialDetail(context)
        this.setState({
            data,
            height: (document.documentElement.clientHeight - 44) + 'px'
        })
    }
    render() {
        const { productDetail } = this.state.data
        const { height } = this.state
        return (
            <div>
                <Head>
                    <link rel='stylesheet' type='text/css' href="/static/mods/financial/_.css" />
                </Head>
                <div>
                    <Header title="合同范本" />
                    <iframe height={ height } className="contract-iframe" src={productDetail.productContractH5url}></iframe>
                </div>
            </div>
        )
    }
}