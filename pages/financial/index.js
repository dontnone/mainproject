import React, { Component } from 'react'
import Head from 'next/head'
import Footer from '../../components/footer/index'
import Api from '../../components/api/financial'
import userApi from '../../components/api/home'
import { openApp } from '../../common/Util'
import track from '../../static/merge/track-base'
import { Toast } from 'antd-mobile'

export default class extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLogin: false,
            banner: '/static/html/home/imgs/banner_bg.png',
            data: [],
            yyp: [],
            xyb: []
        }
    }
    async componentDidMount() {
        // console.log(this.props.xyb)
        Toast.loading('加载中……', 0)
        track.init()
        const data = await Api.hotFinancial()
        const yyp = await Api.hotFinancialOther({type: 6})
        const xyb = await Api.hotFinancialOther({type: 5})

        await this.setState({
            data,
            yyp,
            xyb
        })

        localStorage.clear()
        const userRes = await userApi.isLogin()
        if(userRes){
            this.setState({
                banner: '/static/html/product/imgs/login_ad_bg@2x.png'
            })
        }else{
            this.setState({
                banner: '/static/html/product/imgs/register_ad_bg.png'
            })
        }
        this.setState({
            isLogin: userRes
        })

        Toast.hide()
    }
    bannerUrl = () => {
        if(this.state.isLogin){
            openApp()
        }else{
            location = '/html/introduceV2/webh5.html'
        }
    }
    entryDetail = (key, id) => (e) => {
        if(key == '10') {
            location = '/financial/thirtytender'
        }else if(key == '4'){
            location = '/financial/monthgold'
        }else if(key == '5'){
            location = '/financial/newplan'
        }else if(key == '6'){
            location = '/financial/yyp'
        }
    }
    render() {
        const { data } = this.state
        return (
            <div>
                <Head>
                    <link rel='stylesheet' type='text/css' href="/static/mods/financial/_.css" />
                    <title>热门出借产品_热门出借服务_P2P网贷-新新贷</title>
                    <meta name="keywords" content="出借产品,出借服务,P2P网贷,理财,投资理财" />
                    <meta name="description" content="新新贷(m.xinxindai.com)是中国专业的网络借贷信息平台，P2P小额借贷平台。稳健运营六年，值得信赖，新新贷是专业、透明、规范的投融资信息平台。详情请登录新新贷官网。" />
                </Head>
                <div className="product-box position-a">

                    
                   
                    <div className="product-container position-a">
                        <div className="top" onClick={ this.bannerUrl }>
                            <img src={ this.state.banner } alt=""/>
                        </div>
                        {
                            data.map((item)=> {
                                return (
                                    <div className={ item.productType == '10' && item.isHaveValue ? 'product-list-wrapper' : 'product-list-wrapper content-hide' } key={ item.productType }>
                                        <div className="product-tit">新手专享</div>
                                        <ul className="product-list">
                                            <li className="dmp-click" dev_id="A7.1-6.1.1" eventtype="jump" onClick={ () => location = '/financial/thirtytender' }>
                                                <p className="product-name dmp-click" dev_id="A7.1-6.1.1" eventtype="jump">
                                                    <span className="dmp-click" dev_id="A7.1-6.1.1" eventtype="jump">{ item.name }</span>
                                                    <span className="product-require dmp-click" dev_id="A7.1-6.1.1" eventtype="jump">限参与一次</span>
                                                </p>
                                                <div className="product-detail dis-flex-row dmp-click" dev_id="A7.1-6.1.1" eventtype="jump">
                                                    <div className="detail-li product-earnings dmp-click" dev_id="A7.1-6.1.1" eventtype="jump">
                                                        <p className="count fs dmp-click" dev_id="A7.1-6.1.1" eventtype="jump"><span>{ item.plannedAnnualRate + '%' }</span>{ item.floatingRate > 0 ? '+' + item.floatingRate + '%' : ''   }<i className={ item.floatingRate > 0 ? 'toast' : '' }>{ item.floatingRate > 0 ? '新手专享加息' : '' }</i></p>
                                                        <p className="txt dmp-click" dev_id="A7.1-6.1.1" eventtype="jump">历史年化收益</p>
                                                    </div>
                                                    <div className="detail-li dmp-click" dev_id="A7.1-6.1.1" eventtype="jump">
                                                        <p className="count dmp-click" dev_id="A7.1-6.1.1" eventtype="jump">{ item.leastPeriod } { item.leastPeriodUnit }</p>
                                                        <p className="txt dmp-click" dev_id="A7.1-6.1.1" eventtype="jump">后可申请转让</p>
                                                    </div>
                                                    <div className="detail-li">
                                                        <button className="dmp-click" dev_id="A7.1-6.1.1" eventtype="jump">立即加入</button>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                )
                            })
                        }
                        <div className="product-list-wrapper">
                            <div className="product-tit">热门产品</div>
                            <ul className="product-list">
                                {
                                    data.map((item)=> {
                                        return (
                                            <li className={ item.productType == '4' && item.isHaveValue ? 'dmp-click' : 'content-hide' } dev_id="A7.1-6.1.2" eventtype="jump" onClick={ this.entryDetail(item.productType, item.productId) } key={ item.productType }>
                                                <p className="product-name dmp-click" dev_id="A7.1-6.1.2" eventtype="jump">
                                                    <span className="dmp-click" dev_id="A7.1-6.1.2" eventtype="jump">{ item.name }</span>
                                                    <span className="product-require dmp-click" dev_id="A7.1-6.1.2" eventtype="jump">限时秒杀</span>
                                                    <span className="app-vip dmp-click" dev_id="A7.1-6.1.2" eventtype="jump">app专享</span>
                                                </p>
                                                <div className="product-detail dis-flex-row  dmp-click" dev_id="A7.1-6.1.2" eventtype="jump">
                                                    <div className="detail-li product-earnings dmp-click" dev_id="A7.1-6.1.2" eventtype="jump">
                                                        <p className="count fs dmp-click" dev_id="A7.1-6.1.2" eventtype="jump"><span>{ item.plannedAnnualRate + '%' }</span> { item.floatingRate > 0 ? '+' + item.floatingRate + '%' : ''   }<i className={ item.floatingRate > 0 ? 'toast' : '' }>{ item.floatingRate > 0 ? '限时加息' : '' }</i></p>
                                                        <p className="txt dmp-click" dev_id="A7.1-6.1.2" eventtype="jump">历史年化收益</p>
                                                    </div>
                                                    <div className="detail-li dmp-click" dev_id="A7.1-6.1.2" eventtype="jump">
                                                        <p className="count dmp-click" dev_id="A7.1-6.1.2" eventtype="jump">{ item.leastPeriod } { item.leastPeriodUnit }</p>
                                                        <p className="txt dmp-click" dev_id="A7.1-6.1.2" eventtype="jump">后可申请转让</p>
                                                    </div>
                                                    <div className="detail-li dmp-click" dev_id="A7.1-6.1.2" eventtype="jump">
                                                        <p className="count dmp-click" dev_id="A7.1-6.1.2" eventtype="jump">{ item.leastInvestAmount } 元</p>
                                                        <p className="txt dmp-click" dev_id="A7.1-6.1.2" eventtype="jump">起投金额</p>
                                                    </div>
                                                </div>
                                            </li>
                                        )
                                    })
                                }
                                {
                                    this.state.xyb.map((xyb)=>{
                                        return (
                                            <li className={ xyb.isHaveValue ? 'dmp-click' : 'content-hide' } dev_id="A7.1-6.1.3" eventtype="jump" onClick={ this.entryDetail(xyb.productType, xyb.items[0].productId) } key={ xyb.productType }>
                                                <p className="product-name dmp-click" dev_id="A7.1-6.1.3" eventtype="jump">
                                                    <span className="dmp-click" dev_id="A7.1-6.1.3" eventtype="jump">{ xyb.name }</span>
                                                    <span className="product-require dmp-click" dev_id="A7.1-6.1.3" eventtype="jump">多种期限选择</span>
                                                    <span className="app-vip dmp-click" dev_id="A7.1-6.1.3" eventtype="jump">app专享</span>
                                                </p>
                                                <div className="product-detail dis-flex-row dmp-click" dev_id="A7.1-6.1.3" eventtype="jump">
                                                    <div className="detail-li product-earnings dmp-click" dev_id="A7.1-6.1.3" eventtype="jump">
                                                        <p className="count fs dmp-click" dev_id="A7.1-6.1.3" eventtype="jump"><span>{ xyb.items[0].plannedAnnualRate + '%' }</span> { xyb.items[0].floatingRate > 0 ? '+' + xyb.items[0].floatingRate + '%' : ''   }<i className={ xyb.items[0].floatingRate > 0 ? 'toast' : '' }>{ xyb.items[0].floatingRate > 0 ? '限时加息' : '' }</i></p>
                                                        <p className="txt dmp-click" dev_id="A7.1-6.1.3" eventtype="jump">历史年化收益</p>
                                                    </div>
                                                    <div className="detail-li dmp-click" dev_id="A7.1-6.1.3" eventtype="jump">
                                                        <p className="count dmp-click" dev_id="A7.1-6.1.3" eventtype="jump">{ xyb.items[0].leastPeriod } { xyb.items[0].leastPeriodUnit }</p>
                                                        <p className="txt dmp-click" dev_id="A7.1-6.1.3" eventtype="jump">后可免费申请转让</p>
                                                    </div>
                                                    <div className="detail-li dmp-click" dev_id="A7.1-6.1.3" eventtype="jump">
                                                        <p className="count dmp-click" dev_id="A7.1-6.1.3" eventtype="jump">{ xyb.items[0].leastInvestAmount } 元</p>
                                                        <p className="txt dmp-click" dev_id="A7.1-6.1.3" eventtype="jump">起投金额</p>
                                                    </div>
                                                </div>
                                            </li>
                                        )
                                    })
                                }
                                {
                                    this.state.yyp.map((yyp)=>{
                                        return (
                                            <li className={ yyp.isHaveValue ? 'dmp-click' : 'content-hide' } dev_id="A7.1-6.1.4" eventtype="jump" onClick={ this.entryDetail(yyp.productType, yyp.items[0].productId) } key={ yyp.productType }>
                                                <p className="product-name dmp-click" dev_id="A7.1-6.1.4" eventtype="jump">
                                                    <span className="dmp-click" dev_id="A7.1-6.1.4" eventtype="jump">{ yyp.name }</span>
                                                    <span className="product-require dmp-click" dev_id="A7.1-6.1.4" eventtype="jump">每月收息</span>
                                                    <span className="app-vip dmp-click" dev_id="A7.1-6.1.4" eventtype="jump">app专享</span>
                                                </p>
                                                <div className="product-detail dis-flex-row dmp-click" dev_id="A7.1-6.1.4" eventtype="jump">
                                                    <div className="detail-li product-earnings dmp-click" dev_id="A7.1-6.1.4" eventtype="jump">
                                                        <p className="count fs dmp-click" dev_id="A7.1-6.1.4" eventtype="jump"><span>{ yyp.items[0].plannedAnnualRate + '%' }</span> { yyp.items[0].floatingRate > 0 ? '+' + yyp.items[0].floatingRate + '%' : ''   }<i className={ yyp.items[0].floatingRate > 0 ? 'toast' : '' }>{ yyp.items[0].floatingRate > 0 ? '限时加息' : '' }</i></p>
                                                        <p className="txt dmp-click" dev_id="A7.1-6.1.4" eventtype="jump">历史年化收益</p>
                                                    </div>
                                                    <div className="detail-li dmp-click" dev_id="A7.1-6.1.4" eventtype="jump">
                                                        <p className="count dmp-click" dev_id="A7.1-6.1.4" eventtype="jump">{ yyp.items[0].leastPeriod } { yyp.items[0].leastPeriodUnit }</p>
                                                        <p className="txt dmp-click" dev_id="A7.1-6.1.4" eventtype="jump">后可免费申请转让</p>
                                                    </div>
                                                    <div className="detail-li dmp-click" dev_id="A7.1-6.1.4" eventtype="jump">
                                                        <p className="count dmp-click" dev_id="A7.1-6.1.4" eventtype="jump">{ yyp.items[0].leastInvestAmount } 元</p>
                                                        <p className="txt dmp-click" dev_id="A7.1-6.1.4" eventtype="jump">起投金额</p>
                                                    </div>
                                                </div>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        </div>
                    </div>
                </div>
                <Footer type="financial" />
            </div>
        )
    }
}