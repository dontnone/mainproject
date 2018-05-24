import React, { Component } from 'react'
import Ceil from '../../components/ceiling/index'
import Head from 'next/head'
import HomeIco from './components/homeico'
import ProBottom from './components/probottom'
import Tab from './components/tab'
import { getQueryString, openApp } from '../../common/Util'

import Api from '../../components/api/financial'
import Loading from '../../common/Loading'

export default class extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: {}
        }
    }
    openApps = () => {
        openApp()
    }
    async componentDidMount(){
        const yyp = await Api.hotFinancialOther({type: 6})
        const context = {
            id: yyp[0].items[0].productId,
            type: 6,
        }
        const data = await Api.financialDetail(context)
        this.setState({
            data
        })
    }
    compute = () => {
        const { productDetail } = this.state.data
        const num = productDetail.plannedAnnualRate * 0.01
        const float = productDetail.floatingRate * 0.01
        const month = productDetail.leastPeriod
        let startMoney, endMoney, startResult, endResult, allResult = 0
        startMoney = 10000 * num / month
        startResult = Math.floor(startMoney * 100) / 100
        endMoney = 10000 * float / month
        endResult = Math.floor(endMoney * 100) / 100
        allResult = (startResult + endResult).toFixed(2)
        return allResult
    }
    render() {
        const { productDetail } = this.state.data
        if(!productDetail){
            return (
                <div>
                    <Head>
                        <link rel='stylesheet' type='text/css' href="/static/mods/financial/_.css" />
                        <title>月月派_每月付息_出借产品_网络借贷-新新贷</title>
                        <meta name="keywords" content="月月派,出借，网络借贷" />
                        <meta name="description" content="月月派是新新贷推出的便捷高效的自动投标工具。月月派在用户认可的标的范围内，对符合要求的标的进行自动投标，每月派息，到期通过债权转让退出。详情请登录新新贷官网。" />
                    </Head>
                    <div className="product-box position-a">
                        <Ceil />
                        <Loading />
                    </div>
                </div>
            )
        }
        return (
            <div>
                <Head>
                    <link rel='stylesheet' type='text/css' href="/static/mods/financial/_.css" />
                    <title>月月派_每月付息_出借产品_网络借贷-新新贷</title>
                    <meta name="keywords" content="月月派,出借，网络借贷" />
                    <meta name="description" content="月月派是新新贷推出的便捷高效的自动投标工具。月月派在用户认可的标的范围内，对符合要求的标的进行自动投标，每月派息，到期通过债权转让退出。详情请登录新新贷官网。" />
                </Head>
                <div className="product-box position-a">
                    <Ceil />
                    <div className="product—detail-container position-a">
                        <div className="detail-wrapper">
                            <h1 className="product-name">{productDetail.name}</h1>
                            <div className="rate-wrapper-1"></div>
                            <div className="rate-wrapper-2"></div>
                            <div className="rate-wrapper">
                                <div className="wrapper">
                                    <p className="rate">{ productDetail.plannedAnnualRate + '%' }<span>{ productDetail.floatingRate > 0 ? '+' + productDetail.floatingRate : ''   }<i className={ productDetail.floatingRate > 0 ? 'toast' : '' }>{ productDetail.floatingRate > 0 ? '限时加息' : '' }</i></span></p>
                                    <p className="txt">历史年化收益</p>
                                </div>
                                <p className="require-tips">
                                    <span>APP专享</span>
                                    <span>每月收息</span>
                                </p>
                            </div>
                        </div>
                        <ul className="xxd-common-list list-wrapper">
                            <li className="list-item">
                                <span className="item-txt">起投金额</span>
                                <span className="item-right-txt">{ productDetail.leastInvestAmount }元</span>
                            </li>
                            <li className="list-item">
                                <span className="item-txt">服务期</span>
                                <span className="item-right-txt">{productDetail.leastPeriod}{productDetail.leastPeriodUnit}</span>
                            </li>
                            <li className="list-item">
                                <span className="item-txt">起息时间</span>
                                <span className="item-right-txt">募集成功后次日起息</span>
                            </li>
                        </ul>
                
                        <ul className="intro-list">
                            <li>
                                <p className="content-tit dmp-click"><span className="dmp-click">计划示意图</span></p>
                                <div className='content show bgout'>
                                    <div className="yypbg">
                                    </div>
                                </div>
                            </li>
                            <Tab title="服务介绍" show={ true }>
                                <p>月月派是新新贷推出的便捷高效的自动投标工具。月月派在用户认可的标的范围内，对符合要求的标的进行自动投标，根据借款用户还款日期每月收息，服务期结束后，用户可申请债权转让退出。债权转让完成后本金及最后一期利息将返至您新新贷账户的“可用余额”。</p>
                                <p>服务期结束至债权转让成功期间，该服务计划不计息。</p>
                            </Tab>
                            <Tab title="收益计算" show={ false }>
                                <p>历史每月收益=加入金额<span className="notice">×{ productDetail.plannedAnnualRate + '%' }</span>÷{productDetail.leastPeriod}<span className="notice">{ productDetail.floatingRate > 0 ? '+加入金额×' + productDetail.floatingRate + '÷' + productDetail.leastPeriod : '' }</span></p>
                            </Tab>
                            <Tab title="退出方式" show={ false }>
                                <p>服务期内持有30天后支持债权转让，并收取本金*{productDetail.forfeitPercent + '%'}手续费。</p>
                                <p>服务期结束后，用户可免费申请债权转让退出。债权成功转让后本金及最后一期利息返至出借人账户中，并可在新新贷账户的“可用余额”查询。债权转让时间由债权转让交易撮合情况而定，历史平均转让成功时间为1-3个工作日。</p>
                            </Tab>
                        </ul>
                
                        <ProBottom />
                    </div>
                    <div className="div-bottom-btn">
                        <button className="xxd-xl-btn" onClick={ this.openApps }>心动了吗？赶紧前往新新贷APP吧</button>
                    </div>
                    <HomeIco />
                </div>
            </div>
        )
    }
}