import React, { Component } from 'react'
import Head from 'next/head'
import Header from '../../components/header/index'

export default class extends Component {
    constructor(props) {
        super(props)
        this.state = {
            height: '',
            origin: ''
        }
    }
    componentDidMount() {
        typeof window !== "undefined" ? window : this
        const document = window.document
        this.setState({
            height: (document.documentElement.clientHeight - 44) + 'px',
            origin: location.origin
        })
    }
    render() {
        return (
            <div>
                <Head>
                    <link rel='stylesheet' type='text/css' href="/static/mods/financial/_.css" />
                </Head>
                <div>
                    <Header title={ this.props.title } />
                    <iframe height={ this.state.height } className="contract-iframe" src={ this.state.origin + this.props.template}></iframe>
                </div>
            </div>
        )
    }
}