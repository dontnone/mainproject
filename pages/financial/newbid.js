import React, { Component } from 'react'
import Head from 'next/head'
import Ceil from '../../components/ceiling/index'
import Api from '../../components/api/financial'
import loginApi from '../../components/api/home'
import userApi from '../../components/api/purse'
import HomeIco from './components/homeico'
import ProBottom from './components/probottom'
import { Modal, Toast } from 'antd-mobile'
import Tab from './components/tab'
import Problem from './components/problem'
import Mask from './components/modal'
import { localItem , removeLocalItem, getQueryString, openApp } from '../../common/Util'

const alert = Modal.alert
export default class extends Component {
    constructor(props) {
        super(props)
        this.state = {
            btnName: '马上加入',
            btnGray: false,
            isGoApp: false,
            isLogin: false,
            month: '',
            datas: {},
            totalCount: ''
        }
    }
    async componentDidMount() {
        Toast.loading('加载中……', 0)
        const month = getQueryString('query')
        const datas = await Api.getNewBid({month: month})
        const recordContext = {
            reglintstId: datas.id,
            currentPage: 1,
        }
        const recode = await Api.newBidRecord(recordContext)

        this.setState({
            month,
            datas,
            totalCount: recode.totalCount
        })


        let localItems = {}
        if(localItem('dataList')){
            localItems = JSON.parse(localItem('dataList'))
        }
        if(sessionStorage.getItem('riskSession')){
            sessionStorage.removeItem('riskSession')
        }
        if(localStorage.getItem('creditList')){
            localStorage.removeItem('creditList')
        }
        const data = await Api.getNewBid({month: month})
        const {isLogin, isPurchasedProduct, status} = data
        await this.setState({
            isLogin
        })
        if(isLogin){
            //  已登录
            if(isPurchasedProduct){
                //  已加入过了其他产品
                await this.setState({
                    btnName: '新手专享，更多优质产品尽在APP',
                    isGoApp: true
                })
            }else{
                this.nameChange(status)
            }
        }else{
            //  未登陆
            this.nameChange(status)
        }

        Toast.hide()
    }
    nameChange = (status) => {
        switch(status) {
            case '1':
                this.setState({
                    btnName: '等待发售',
                    btnGray: true
                })
                break;
            case '2':
                this.setState({
                    btnName: '马上加入'
                })
                break;
            case '3':
                this.setState({
                    btnName: '已售罄',
                    btnGray: true
                })
                break;
            default: 
        }
    }
    buyProduct = async () => {
        const isLogin = this.state.isLogin
        if(this.state.isGoApp){
            openApp()
        }else{
            if(isLogin){
                const res = await userApi.userInfo()
                if(res.openAccountStatus == '1'){
                    //  已开户
                    if(res.riskExamStatus == '1'){
                        if(res.typeName == '保守型'){
                            //  保守型不可以投资
                            alert('提示', '根据您的风险测评结果，您无法在平台进行出借', [
                                { text: '知道了', onPress: () => console.log('cancel') },
                                { text: '重新测评', onPress: () => {
                                    if(res.count == 0){
                                        alert('根据您的风险测评结果，您无法在平台进行出借', '您今年测试评测已达' + res.sumCount + '次上限，'+ res.nextTestTime +'后可重新开始评测，详情可拨打客服电话4000-169-521进行咨询', [
                                            { text: '知道了', onPress: () => console.log('cancel') }
                                        ])
                                    }else{
                                        sessionStorage.setItem('riskSession', location.href)
                                        location = '/mypurse/riskrating'
                                    }
                                }},
                            ])
                        } else{
                            location = '/financial/neworderbuy?id=' + this.state.month
                        }
                        //  已评测
                    }else{
                        //  未评测
                        alert('提示', '您尚未进行风险评测，请先进行风险评测', [
                            { text: '取消', onPress: () => console.log('cancel') },
                            { text: '去评测', onPress: () => {
                                sessionStorage.setItem('riskSession', location.href)
                                location = '/mypurse/riskrating'
                            }},
                        ])
                    }
                }else{
                    //  未开户
                    if(res.mobile){
                        alert('提示', '请先开通存管账户', [
                            { text: '取消', onPress: () => console.log('cancel') },
                            { text: '存管开户', onPress: () => {
                                location = '/mypurse/openaccount'
                            }},
                        ])
                    }else{
                        alert('提示', '您尚未绑定手机号，为了您的账户安全，请前往APP进行绑定手机号后进行开户操作', [
                            { text: '取消', onPress: () => console.log('cancel') },
                            { text: '前往APP', onPress: () => {
                                openApp()
                            }},
                        ])
                    }
                }
            }else{
                Toast.info('请先登录', 2)
                sessionStorage.setItem('loginType', window.location.href)
                setTimeout(()=> {
                    location = '/login'
                }, 2000)
            }
        }
        
    }
    render() {
        const data = this.state.datas
        return (
            <div>
                <Head>
                    <link rel='stylesheet' type='text/css' href="/static/mods/financial/_.css" />
                </Head>
                <div className="product-box position-a">
                    <div className="product—detail-container newbie-container position-a">
                        <div className="detail-wrapper">
                            <h1 className="product-name">{data.name}</h1>
                            <div className="rate-wrapper-1"></div>
                            <div className="rate-wrapper-2"></div>
                            <div className="rate-wrapper">
                                <div className="wrapper">
                                    <p className="rate">{data.apr || 0}%</p>
                                    <p className="txt">历史年化收益</p>
                                </div>
                                <p className="require-tips"><span>限参与1次</span></p>
                            </div>
                        </div>
                        <ul className="xxd-common-list list-wrapper">
                            <li className="list-item">
                                <span className="item-txt">起投金额</span>
                                <span className="item-right-txt">{data.lowestTender}元</span>
                            </li>
                            <li className="list-item">
                                <span className="item-txt">服务期</span>
                                <span className="item-right-txt">{data.period}个月</span>
                            </li>
                            <li className="list-item">
                                <span className="item-txt">起息时间</span>
                                <span className="item-right-txt">募集成功后次日起息</span>
                            </li>
                        </ul>
                
                        <ul className="intro-list">
                            <Tab title="服务介绍" dev_id="A8.1-2" eventtype="close_float_window" eventtypehide="open_float_window" show={ true }>
                                <p>新手标是新元宝计划系列中专门针对新手推出的一种福利计划，未曾在新新贷投标过的用户均有一次机会参与，仅限首次加入。</p>
                                <p>该服务计划在用户认可的标的范围内，对符合要求的标的进行自动投标，服务期结束后，用户可申请债权转让退出，债权转让完成后所获相应本金利息，将返至您新新贷账户的“可用余额”。</p>
                                <p>服务期结束至债权转让成功期间，该服务计划不计息。</p>
                            </Tab>
                            <Tab title="计划示意图" show={ false }>
                                <div>
                                    {
                                        this.state.month == "1" ?
                                        <img src="/static/html/product/imgs/newthirty.jpg" /> :
                                        <img src="/static/html/product/imgs/newbid3.jpg" />
                                    }
                                </div>
                            </Tab>
                            <Tab title="退出方式" show={ false }>
                                <p>服务期内不支持提前退出。服务期结束后，用户可申请债权转让退出，成功转让后资金返至出借人账户中，并可在新新贷账户的“可用余额”查询。债权转让时间由债权转让交易撮合情况而定，历史平均转让成功时间为1-3个工作日。</p>
                            </Tab>
                            <Tab title="费用说明" show={ false }>
                                <p>1、加入费用：0.00%</p>
                                <p>2、到期退出费用：0.00%</p>
                            </Tab>
                        </ul>
                
                        <Problem joinNum={ this.state.totalCount } proId={ this.state.datas.id } />
                
                        <ProBottom show={ true } type="newbid" />
                    </div>
                
                    <div className="div-bottom-btn">
                        <button className="xxd-xl-btn dmp-click" dev_id="A8.1-1" eventtype="jump" onClick={ this.buyProduct } disabled={ this.state.btnGray }>{ this.state.btnName }</button>
                    </div>

                    <HomeIco dev_id="A8.1-7" />
                
                    <Mask show={ this.state.isGoApp } />
                </div>
            </div>
        )
    }
}