import React, { Component } from 'react'
import Head from 'next/head'
import Header from '../../../components/header/index'
import { getQueryString } from '../../../common/Util'
import { ImagePicker, Toast } from 'antd-mobile'
import Api from '../../../components/api/purse'

export default class extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userInfo: {},
            userName: '',
            userId: ''
        }
    }
    async componentDidMount() {
        const res = await Api.userAccounts()
        this.setState({
            userInfo: res,
            userName: res.userName,
            userId: res.userIdCard
        })
        console.log(res)
    }
    render() {
        const { userInfo } = this.state
        return (
            <div>
                <Head>
                    <link rel='stylesheet' type='text/css' href="/static/mods/mypurse/openaccount/_.css" />
                </Head>
                <div className="identity-review-box ">
                    <Header title="银行存管开户" />
                    <div className="open-account-container identity-review-container">
                        <div className="open-account-main">
                            <div className="div-input-wrapper">
                                <div className="input-left"><span>姓名</span></div>
                                <div className="input-border"><input type="text" value={ this.state.userName }  disabled placeholder="请输入您身份证上的真实姓名" /></div>
                            </div>
                            <div className="div-input-wrapper">
                                <div className="input-left"><span>身份证号</span></div>
                                <div className="input-border"><input type="text" value={ this.state.userId }  disabled placeholder="请输入您的身份证号" /></div>
                            </div>
                        </div>
                        <div className="upload-information-wrapper">
                            <p className="upload-tit"></p>
                            <div className="upload-information">
                                <div className="upload-item fl">
                                    <div className="identity-card">
                                        <img src={userInfo.cardFrontUrl} alt="" />
                                    </div>
                                    <span>照片已上传</span>
                                </div>
                                <div className="upload-item pr">
                                    <div className="identity-card">
                                        <img src={userInfo.cardBackUrl} alt="" />
                                    </div>
                                    <span>照片已上传</span>
                                </div>
                            </div>
                            <div className="upload-information-tips">
                                您已成功提交身份信息，请及时与客服<a href="tel:4000169521">4000 169 521</a>联系将加快您的审核进度
                            </div>
                        </div>
                        <div className="div-btn"><button className="xxd-xl-btn" disabled>身份信息审核中</button></div>
                    </div>
                </div>
            </div>
        )
    }
}