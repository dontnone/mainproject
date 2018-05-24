import React, { Component } from 'react'
import Head from 'next/head'
import Header from '../../components/header/index'
import { openApp } from '../../common/Util'

export default class extends Component {
    constructor(props) {
        super(props)
    }
    downLoadApp = () => {
        openApp()
    }
    render() {
        return (
            <div>
                <Head>
                    <link rel='stylesheet' type='text/css' href="/static/mods/contactus/_.css" />
                </Head>
                <div className="contactus-box">
                    <Header title="联系我们" dmp={ true }  dev_id="A5.1-1.1" eventtype="jump" />
                    <div className="contactus-container">
                        <div className="logo-wrapper"></div>
                        <ul className="contact-list">
                            <li className="contact-list-item">
                                <span className="item-left wx-icon">官方微信</span>
                                <span className="item-right item-value">xin_xin_dai</span>
                            </li>
                            <li className="contact-list-item">
                                <span className="item-left wb-icon">官方微博</span>
                                <span className="item-right item-value">新新贷</span>
                            </li>
                            <li className="contact-list-item">
                                <span className="item-left telephone-icon">客服电话</span>
                                <span className="item-right item-value">4000 169 521（工作日9:00-18:00)</span>
                            </li>
                            <li className="contact-list-item">
                                <span className="item-left qq-icon">在线客服QQ</span>
                                <span className="item-right item-value">4000 169 521（工作日9:00-18:00)</span>
                            </li>
                            <li className="contact-list-item">
                                <span className="item-left qq-group-icon">官方用户QQ群</span>
                                <span className="item-right item-value">306188025</span>
                            </li>
                            <li className="contact-list-item">
                                <span className="item-left email-icon">邮箱</span>
                                <span className="item-right item-value">services@xinxindai.com</span>
                            </li>
                        </ul>
                        <div className="ad-wrapper dmp-click" dev_id="A5.1-1.2" eventtype="jump" onClick={ this.downLoadApp } ></div>
                    </div>
                </div>
                
            </div>
        )
    }
}

