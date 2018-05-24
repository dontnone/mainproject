import React, { Component } from 'react'
import Ceil from '../../components/ceiling/index'
import Head from 'next/head'
import HomeIco from './components/homeico'
import ProBottom from './components/probottom'
import Tab from './components/tab'
import { getQueryString, openApp } from '../../common/Util'
import Loading from '../../common/Loading'

import Api from '../../components/api/financial'

export default class extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data : {},
            eachNew: {}
        }
    }
    async componentDidMount() {
        const xyb = await Api.hotFinancialOther({type: 5})
        const context = {
            id: xyb[0].items[0].productId,
            type: 5,
        }
        const eachNew = await Api.getEachNew()
        const data = await Api.financialDetail(context)
        this.setState({
            data,
            eachNew
        })
    }
    openApps = () => {
        openApp()
    }
    compute = ( month, apr, floatApr ) => {
        const num = apr * 0.01
        const float = floatApr * 0.01
        let startMoney, endMoney, startResult, endResult, allResult = 0
        startMoney = 10000 * num / 12 * month
        startResult = Math.floor(startMoney * 100) / 100
        endMoney = 10000 * float / 12 * month
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
                        <title>新元宝_出借产品_多种期限出借服务-新新贷</title>
                        <meta name="keywords" content="新元宝，出借，出借服务，定期理财，投资理财" />
                        <meta name="description" content="新元宝是新新贷推出的自动投标计划，所有加入新元宝的资金将由系统优先匹配优质债权，出借资金不站岗！详情请登录新新贷官网。" />
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
                    <title>新元宝_出借产品_多种期限出借服务-新新贷</title>
                    <meta name="keywords" content="新元宝，出借，出借服务，定期理财，投资理财" />
                    <meta name="description" content="新元宝是新新贷推出的自动投标计划，所有加入新元宝的资金将由系统优先匹配优质债权，出借资金不站岗！详情请登录新新贷官网。" />
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
                                    <p className="rate">{ productDetail.plannedAnnualRate + '%' }<span>{ productDetail.floatingRate > 0 ? '+' + productDetail.floatingRate + '%' : ''   }<i className={ productDetail.floatingRate > 0 ? 'toast' : '' }>{ productDetail.floatingRate > 0 ? '限时加息' : '' }</i></span></p>
                                    <p className="txt">历史年化收益</p>
                                </div>
                                <p className="require-tips">
                                    <span>APP专享</span>
                                    <span>多种期限选择</span>
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
                                <span className="item-right-txt">{ productDetail.leastPeriod } { productDetail.leastPeriodUnit }</span>
                            </li>
                            <li className="list-item">
                                <span className="item-txt">起息时间</span>
                                <span className="item-right-txt">募集成功后次日起息</span>
                            </li>
                        </ul>
                
                        <ul className="intro-list">
                            <li>
                                <p className="content-tit dmp-click"><span className="dmp-click">计划示意图</span></p>
                                {
                                    productDetail.leastPeriod == 1 ? <div className='content show'><img src="/static/html/product/imgs/newthirty.jpg" /></div> :
                                    <div className='content show'>
                                    <span></span><img src="/static/html/product/imgs/newplan.jpg" /></div>
                                }
                            </li>
                            <Tab title="服务介绍" show={ true }>
                                <p>新元宝是新新贷推出的便捷高效的自动投标工具。新元宝在用户认可的标的范围内，对符合要求的标的进行自动投标，且回款本息在相应期限内自动复投，服务期结束后，用户可申请债权转让退出。债权转让完成资金将返至您新新贷账户的“可用余额”。</p>
                                <p>服务期结束至债权转让成功期间，该服务计划不计息。</p>
                            </Tab>
                            <Tab title="收益计算" show={ false }>
                                <p>历史收益=<span className="notice">加入金额×{productDetail.plannedAnnualRate}/12×{productDetail.leastPeriod}</span></p> 
                            </Tab>
                            <Tab title="退出方式" show={ false }>
                            {
                                productDetail.leastPeriod == '1' ? 
                                <div>
                                    <p>服务期内不支持提前退出。</p>
                                    <p>服务期结束后，用户可申请债权转让退出，成功转让后资金返至出借人账户中，并可在新新贷账户的“可用余额”查询。债权转让时间由债权转让交易撮合情况而定，历史平均转让成功时间为1-3个工作日。</p>
                                </div> :
                                <div>
                                    <p>服务期内持有30天后支持债权转让，并收取本金*{productDetail.forfeitPercent + '%'}手续费。</p>
                                    <p>服务期结束后，用户可免费申请债权转让退出。债权成功转让后资金返至出借人账户中，并可在新新贷账户的“可用余额”查询。债权转让时间由债权转让交易撮合情况而定，历史平均转让成功时间为1-3个工作日。</p>
                                </div>
                            }
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