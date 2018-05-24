import React, { Component, PureComponent } from 'react'
import Head from 'next/head'
import moment from 'moment'
import { openApp } from '../../common/Util'
import track from '../../static/merge/track-base'
import { Modal, Toast, Icon } from 'antd-mobile'
import Api from '../../components/api/financial'

const alert = Modal.alert
export default class extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            productName: '',
            createTime: '',
            startDate: '',
            plannedInterest: '',
            expireDate: '',
            amount: ''
        }
    }
    async componentDidMount() {
        
        const res = await Api.inviteActivityTime()
        
        if(res.data.code == 0){
            alert('出借成功！', '参加好礼迎新活动，赢普吉岛浪漫双人游！', [
                { text: '知道了', onPress: () => console.log('cancel') },
                { text: '立即参加', onPress: () => {
                    location.href = '/html/sixthAnniversaryActivity/index.html'
                }},
            ])
        }

        let successInfo = ''
        track.init()
        if(sessionStorage.getItem('successInfo')){
            successInfo = JSON.parse(sessionStorage.getItem('successInfo'))
            this.setState({
                amount: successInfo.amount,
                productName: successInfo.productName,
                createTime: successInfo.createTime,
                startDate: successInfo.startDate,
                plannedInterest: successInfo.plannedInterest,
                expireDate: successInfo.expireDate
            })
        }
    }
    openApps = () => {
        openApp()
    }
    investRecord = () =>{
        location = '/mypurse/investmenthistory'
    }
    // <p>{ this.state.plannedInterest }元</p>
    render() {
        return (
            <div>
                <Head>
                    <link rel='stylesheet' type='text/css' href="/static/mods/financial/_.css" />
                </Head>
                <div className="product—detail-container purchase-success-container position-a">
                    <div className="wrapper">
                        <div className="content-li">
                            <p className="bold-font"><Icon type="check" className="successico" size="xs" />恭喜您成功加入{this.state.productName}</p>
                        </div>
                        <div className="content-li">
                            <p className="bold-font">加入金额: { this.state.amount }元</p>
                            <p>{ moment(Number(this.state.startDate)).format('YYYY-MM-DD HH:ss:mm') }</p>
                        </div>
                    </div>
                    <div className="div-btn">
                        <button className="xxd-xl-btn dmp-click" dev_id="A11.1-1" eventtype="jump" onClick={ this.openApps }>更多产品尽在APP</button>
                        <button className="xxd-xl-btn detail-btn dmp-click" dev_id="A11.1-1.1" eventtype="jump" onClick={ this.investRecord }>查看加入详情</button>
                    </div>
                </div>
            </div>
        )
    }
}