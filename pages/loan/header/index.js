import React, { Component } from 'react'

import Head from 'next/head'

export default class Header extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <div>
                <Head>
                    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no, minimal-ui" />
                    <link rel='stylesheet' type='text/css' href="/static/mods/loan/_.css" />
                </Head>
                <div>
                    { this.props.children }
                </div>
            </div>
        )
    }
}