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
            data: {},
            isShow: false
        }
    }
    async componentDidMount() {
        let id = ''
        const hotData = await Api.hotFinancial()
        for(let i=0; i<hotData.length; i++){
            if(hotData[i].productType == 4){
                id = hotData[i].productId
            }
        }
        const context = {
            id: id,
            type: 4,
        }
        const data = await Api.financialDetail(context)
        if(!data || JSON.stringify(data) == '{}'){
            await this.setState({
                data: {
                    productDetail:{},
                }
            })
        }else{
            await this.setState({
                data
            })
        }
    }
    openApps = () => {
        openApp()
    }
    change = () => {
        this.setState({
            isShow: !this.state.isShow
        })
    }
    render() {
        const { productDetail } = this.state.data
        if(!productDetail){
            return (
                <div>
                    <Head>
                        <link rel='stylesheet' type='text/css' href="/static/mods/financial/_.css" />
                        <title>月进斗金_出借产品_出借服务-新新贷</title>
                        <meta name="keywords" content="月进斗金,出借产品,出借服务,P2P理财,投资理财" />
                        <meta name="description" content="月进斗金是新新贷推出的31天期出借计划，历史年化收益12%，当日起息。出借产品可以在每天10点、20点限时发售，成功出借本产品之日起31天（含加入当日及节假日）后，系统通过债权转让退出的方式将资金返回到您的新新贷账户，详情请登录新新贷官网。" />
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
                    <title>月进斗金_出借产品_出借服务-新新贷</title>
                    <meta name="keywords" content="月进斗金,出借产品,出借服务,P2P理财,投资理财" />
                    <meta name="description" content="月进斗金是新新贷推出的31天期出借计划，历史年化收益12%，当日起息。出借产品可以在每天10点、20点限时发售，成功出借本产品之日起31天（含加入当日及节假日）后，系统通过债权转让退出的方式将资金返回到您的新新贷账户，详情请登录新新贷官网。" />
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
                                    <span>限时秒杀</span>
                                </p>
                            </div>
                        </div>
                        <ul className="xxd-common-list list-wrapper">
                            <li className="list-item">
                                <span className="item-txt">起投金额</span>
                                <span className="item-right-txt">{productDetail.leastInvestAmount}元</span>
                            </li>
                            <li className="list-item">
                                <span className="item-txt">加入上限</span>
                                <span className="item-right-txt">{productDetail.mostInvestAmount}元</span>
                            </li>
                            <li className="list-item">
                                <span className="item-txt">起息时间</span>
                                <span className="item-right-txt">募集成功后开始计息</span>
                            </li>
                            <li className="list-item">
                                <span className="item-txt">服务期</span>
                                <span className="item-right-txt">{productDetail.leastPeriod}{productDetail.leastPeriodUnit}</span>
                            </li>
                        </ul>
                
                        <ul className="intro-list">
                            <li>
                                <p className="content-tit dmp-click"><span className="dmp-click">计划示意图</span></p>
                                <div className='content show'><img src="/static/html/product/imgs/newmonth.jpg" /></div>
                            </li>
                            <Tab title="服务介绍" show={ true }>
                                <p>月进斗金是新新贷推出的一种限时发售计划，每日10：00、20：00限时发售，售完即止。</p>
                                <p>该服务计划在用户认可的标的范围内，对符合要求的标的进行自动投标，服务期结束后，用户可申请债权转让退出，债权转让完成资金将返至您新新贷账户的“可用余额”。</p>
                                <p>服务期结束至债权转让成功期间，该服务计划不计息。</p>
                                <p>该服务计划{productDetail.leastInvestAmount}元起投，并以{productDetail.leastInvestAmount}元递增，单账户加入额度{productDetail.mostInvestAmount}元。不限加入次数，如果加入金额达到上限，可等待服务期结束申请退出后，资金回到新新贷账户中，个人可加入额度释放，继续加入。</p>
                            </Tab>
                            <Tab title="收益如何计算" show={ false }>
                                历史收益=<span className="notice">加入金额×{productDetail.plannedAnnualRate  }%/360×31</span>
                            </Tab>
                            <Tab title="退出方式" show={ false }>
                                服务期内不支持提前退出。服务期结束后，用户可申请债权转让退出，成功转让后资金返至出借人账户中，并可在新新贷账户的“可用余额”查询。债权转让时间由债权转让交易撮合情况而定，历史平均转让成功时间为1-3个工作日。
                            </Tab>
                        </ul>
                        <ul className="main-list xxd-common-list">
                            <li className="list-item faq-item">
                                <p onClick={ this.change }>
                                    <span className="item-txt">常见问题</span>
                                    <span className="arrow-down-icon" className={ this.state.isShow ? 'arrow-down-icon up-icon' : 'arrow-down-icon' }></span>
                                </p>
                                <ul className="content" className={ this.state.isShow ? 'content show' : 'content' }>
                                    <li>
                                        <p className="question">1、月进斗金如何退出？</p>
                                        <div className="answer">
                                            月进斗金服务期内不支持提前退出。您的出借在服务期结束后，可通过债权转让退出，债权转让时间由债权转让交易撮合情况而定，历史平均转让成功时间为1-3个工作日。成功转让后资金返至您的新新贷账户中，并可在账户的“可用余额”查询。
                                        </div>
                                    </li>
                                    <li>
                                        <p className="question">2、我已经加入了月进斗金1000元，还能继续加入吗？</p>
                                        <div className="answer">
                                            可以，月进斗金单账户加入上限为3000元，可以加入多次。如果加入金额达到上限，可等待服务期结束申请退出后，资金回到新新贷账户中，个人可加入额度释放，继续加入。
                                        </div>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                        <ProBottom />
                    </div>
                
                    <div className="div-bottom-btn">
                        <button className="xxd-xl-btn dmp-click" dev_id="A8.3-1.1" eventtype="jump" onClick={ this.openApps }>心动了吗？赶紧前往新新贷APP吧</button>
                    </div>
                
                    <HomeIco />
                </div>
            </div>
        )
    }
}