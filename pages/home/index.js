import React from 'react';
import Head from 'next/head';
import Ceiling from "../../components/ceiling/index";
import Footer from "../../components/footer/index";
import track from "../../static/merge/track-base";

import Carousel from '../../components/carousel/index'
import Api from '../../components/api/home'
import { Toast } from 'antd-mobile'
import { getCookie, openApp } from '../../common/Util'

export default class extends React.Component {
    // static  async getInitialProps ({ query: { id } }) {
    //     const data = await Api.homeServer()
    //     var _d , wonderfulProduct = data && (_d=data.data) && _d.wonderfulProduct ||{};
    //     var isBuy = data.data.investStatus
    //     var banners = data.data.banners
    //     let {name , productType, plannedAnnualRate , floatingRate , productId, introduction , tipAction , leastPeriod , leastPeriodUnit , accumulatedInvestors} = wonderfulProduct;
    //     return { isBuy, banners, name , productType, plannedAnnualRate , floatingRate , introduction , productId , tipAction , leastPeriod , leastPeriodUnit , accumulatedInvestors , id }
    // }
    constructor(props) {
        super(props)
        this.state = {
            isLogin: false,
            banners: [],
            floatingRate: '0.0',
            navImg: ''
        }
    }
    async componentDidMount () {
        track.init()
        Toast.loading('加载中……', 0)
        const data = await Api.homeServer()
        const res = await Api.isLogin()
        if(res){
            this.setState({
                navImg: '/static/html/home/imgs/ad_login_bg.png'
            })
        }else{
            this.setState({
                navImg: '/static/html/home/imgs/ad_red_packet.png'
            })
        }
        console.log(data)
        var _d , wonderfulProduct = data && (_d=data.data) && _d.wonderfulProduct ||{};
        var isBuy = data.data.investStatus
        var banners = data.data.banners
        let {name , productType, leastInvestAmount, plannedAnnualRate , floatingRate , productId, introduction , tipAction , leastPeriod , leastPeriodUnit , accumulatedInvestors} = wonderfulProduct;
        await this.setState({
            isBuy, banners, name , productType, leastInvestAmount, plannedAnnualRate , floatingRate , introduction , productId , tipAction , leastPeriod , leastPeriodUnit , accumulatedInvestors 
        })
        Toast.hide()
        sessionStorage.clear()
        localStorage.clear()
    }
    getRedPackage = async () => {
        const res = await Api.isLogin()
        if(res){
            this.downLoadApp()
        }else{
            location = '/html/introduceV2/webh5.html'
        }
    }
    downLoadApp = () => {
        openApp()
    }
    transMoney = (val) => {
        var changeMoney = 0
        if(val > 9999){
            var ractMoney = (val/1e4)
            ractMoney = ractMoney + ''
            if(ractMoney.indexOf('.') != -1){
                if(ractMoney.split(".")[1].length == 1){
                    ractMoney = ractMoney + 0.00 + '万'
                }else{
                    ractMoney = Number(ractMoney).toFixed(2) + '万'
                }
            }else{
                ractMoney = Number(ractMoney).toFixed(2) + '万'
            }
            changeMoney = ractMoney.split('.');
            changeMoney[0] = changeMoney[0].replace(/(\d)(?=(\d{3})+$)/g,'$1,');
            changeMoney = changeMoney.join('.');
        }else{
            changeMoney =  val + '人'
        }
        return changeMoney
    }
    toBuy = () => {
       const  { productType, productId } = this.state
       switch (productType){
            case '10':
                location = '/financial/thirtytender'
                break;
            case '5':
                location = '/financial/newplan'
                break;
            case '4':
                location = '/financial/monthgold'
                break;
            case '6':
                location = '/financial/yyp'
                break;
            default:
       }
    }
    render () {
        let { isBuy, banners, productType, leastInvestAmount, name , plannedAnnualRate , floatingRate , introduction , tipAction , leastPeriod , leastPeriodUnit , accumulatedInvestors } = this.state;
        var tagArray = [] , tagString = "";
        if (introduction) {
            tagArray.push(<span key={0}>{introduction}</span>);
        }
        if (tipAction && productType != '5') {
            tagArray.push(<span key={1}>{tipAction}</span>);
        }
        if (leastPeriod && leastPeriodUnit) {
            tagArray.push(<span key={2}>{leastPeriod + leastPeriodUnit}后可转让</span>);
        }
        if(productType == '5'){
            tagArray.push(<span key={3}>{parseInt(leastInvestAmount) + '元起投'}</span>);
            tagArray.push(<span key={4}>持有30天后可转让</span>);
        }
        if (tagArray.length > 0) {
            tagString = <p className="product-require">{tagArray}</p>;
        }
        return (
            <div>
                <Head>
                    <link rel='stylesheet' type='text/css' href="/static/mods/home/_.css" />
                    <title>【新新贷官网】专业透明的网络借贷平台，P2P网贷平台，网上贷款借款、投融资信息中介平台</title>
                    <meta name="keywords" content="新新贷，P2P网贷，P2P理财,投资理财，新新贷理财，网上理财，债权转让，新元宝，月月派，新手专享，投融资,贷款，企业贷款，网上贷款，贷款公司，P2P贷款，无抵押小额贷款，借款" />
                    <meta name="description" content="新新贷是中国专业的互联网金融P2P网络借贷信息中介平台，为出借人和借款人提供省心的互联网金融信息服务。资金银行存管、严格的风控体系、信息披露透明等多重安全保障措施。新手专享14%、新元宝，月月派等优质产品任您选择，投融资，投资理财，P2P理财、P2P贷款、无抵押贷款、信用贷款，就上新新贷！" />
                </Head>
                <Ceiling></Ceiling>
                <div className="home-container">
                    <div className="banner-wrapper">
                        <div className="my-carousel">
                            <Carousel data={ this.state.banners } />
                        </div>
                        
                        <div className="menu-wrapper">
                            <ul className="menu">
                                <li className="menu-item">
                                    <a href="/html/p2p-association/index.html" className="dmp-click" dev_id="A2.1-3" eventtype="jump">
                                        <span className="menu-icon association-icon dmp-click" dev_id="A2.1-3" eventtype="jump"></span>
                                        <span className="menu-txt dmp-click" dev_id="A2.1-3" eventtype="jump">互金协会成员</span>
                                    </a>
                                </li>
                                <li className="menu-item">
                                    <a href="/m/static/html/activity/newStrength/index.html" className="dmp-click" dev_id="A2.1-4" eventtype="jump">
                                        <span className="menu-icon sasac-icon dmp-click" dev_id="A2.1-4" eventtype="jump"></span>
                                        <span className="menu-txt dmp-click" dev_id="A2.1-4" eventtype="jump">国资系新实力</span>
                                    </a>
                                </li>
                                <li className="menu-item">
                                    <a href="/html/storagePage/index.html" className="dmp-click" dev_id="A2.1-5" eventtype="jump">
                                        <span className="menu-icon depository-icon dmp-click" dev_id="A2.1-5" eventtype="jump"></span>
                                        <span className="menu-txt dmp-click" dev_id="A2.1-5" eventtype="jump">资金银行存管</span>
                                    </a>
                                </li>
                                <li className="menu-item">
                                    <a href="/modal/security" className="dmp-click" dev_id="A2.1-6" eventtype="jump">
                                        <span className="menu-icon risk-management-icon dmp-click" dev_id="A2.1-6" eventtype="jump"></span>
                                        <span className="menu-txt dmp-click" dev_id="A2.1-6" eventtype="jump">银行级别风控</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div className="home-main">
                            <div className="product-ad" onClick={ this.getRedPackage }>
                                <img src={ this.state.navImg } className="dmp-click" dev_id="A2.1-7" eventtype="jump" alt=""/>
                            </div>
                            <div className="product-wrapper">
                                <div className="product-content">
                                    <div className="product-tit">
                                        <span className="circle"></span>
                                        <span className="tit-txt">{ isBuy != '0' ? '精选产品' : '新手尝鲜' }</span>
                                        <span className="circle"></span>
                                    </div>
                                    <div className="product-detail">
                                        <p className="product-name">{name}</p>
                                        <div className="product-earnings">
                                            <div className="earnings-apy">
                                                <span className="percentM">{plannedAnnualRate || 0}%</span><span className="percentS">{floatingRate=='' || floatingRate==0?"":"+"+floatingRate+"%"}</span>
                                                <i className={ floatingRate=='' || floatingRate==0? '' : 'toast' }>{ floatingRate=='' || floatingRate==0 ? '' : productType == '10' ? '新手专享加息' : '限时加息'}</i>
                                            </div>
                                            <p>{ productType == '5' ? '历史年化收益' : '历史年化收益' }</p>
                                        </div>
                                        {tagString}
                                        <button className="purchase-btn dmp-click" onClick={ this.toBuy } dev_id="A2.1-8" eventtype="jump">
                                            <span className="purchase-txt dmp-click" dev_id="A2.1-8" eventtype="jump">立即加入</span>
                                            {
                                                productType == '4' ? ''
                                                : <span className="purchase-num dmp-click" dev_id="A2.1-8" eventtype="jump">累计加入：{this.transMoney(accumulatedInvestors || 0)}</span>
                                            }
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="xxd-ad-wrapper">
                                <div className="ad-tit"><span className="big">信</span>息披露</div>
                                <div className="ad-words">始终坚持专业、透明、规范、快乐核心价值观</div>
                                <div>
                                    <button className="find-more-btn dmp-click" dev_id="A2.1-9" eventtype="jump" onClick={ () => location = '/modal/information' }>了解更多</button>
                                </div>

                            </div>
                            <div className="main-bottom">
                                <p className="bottom-link">
                                    <a onClick={ this.downLoadApp } className="dmp-click" dev_id="A2.1-10" eventtype="jump">客户端</a>
                                    <a href="http://www.xinxindai.com?mobile=true" className="dmp-click" dev_id="A2.1-11" eventtype="jump">电脑版</a>
                                    <a href="/contactus" className="dmp-click" dev_id="A2.1-12" eventtype="jump">联系我们</a>
                                </p>
                                <p className="company-name">新新贷（上海）金融信息服务有限公司</p>
                                <p className="company-tips">市场有风险，出借需谨慎</p>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer type="home" />
            </div>
        );
    }
}