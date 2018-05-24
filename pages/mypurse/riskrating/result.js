import React, { Component } from 'react'
import Head from 'next/head'
import Header from '../../../components/header/index'
import Api from '../../../components/api/purse'
import { Toast, Popover, Icon } from 'antd-mobile'
import track from '../../../static/merge/track-base'
const Item = Popover.Item;
export default class extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userInfo: {},
            result: '请稍后……',
            btnName: '请稍后……',
            url: '',
            riskNumLost: false,
            visible: false,
            tips: ''
        }
    }
    async componentDidMount() {
        track.init()
        const res = await Api.resultRisk()
        const userInfo = await Api.userInfo()

        if(userInfo.count == 0){
            this.setState({
                riskNumLost: true
            })
        }else{
            this.setState({
                riskNumLost: false
            })
        }
        if(res && userInfo){
            this.setState({
                userInfo,
                result: res.results,
                tips: '单账户每年风险测评次数上限为'+ userInfo.sumCount +'次',
                btnName: userInfo.openAccountStatus == '0' ? '立即开户' : '立即出借'
            })
        }else{
            this.setState({
                userInfo,
                result: '',
            })
        }
        if(!userInfo){
            Toast.info('请先登录', 2)
            setTimeout(()=> {
                location = '/login'
            }, 2000)
        }    
        if(sessionStorage.getItem('riskSession')){
            this.setState({
                url: sessionStorage.getItem('riskSession')
            })
        }else{
            this.setState({
                url: '/mypurse/personal'
            })
        }
    }
    isOpenAccount = ()=> {
        if(this.state.userInfo.openAccountStatus == '0'){
            location = '/mypurse/openaccount'
        }else{
            //  这里是去理财的入口
            if(sessionStorage.getItem('riskSession')){
                location = sessionStorage.getItem('riskSession')
            }else{
                location = '/financial'
            }
        }
    }
    render() {
        const { result, userInfo } = this.state
        return (
            <div>
                <Head>
                    <link rel='stylesheet' type='text/css' href="/static/mods/mypurse/riskrating/_.css" />
                </Head>
                <div className="risk-box position-a">
                    <Header title="风险能力评估结果" url={this.state.url } />
                    <div className="risk-container riskresult-container position-a ">
                        <div className="result-score">
                            <p>您的新新贷出借者风险承受能力与偏好 测试问卷结果</p>
                            <span>{ result.totalScore }分</span>
                        </div>
                        <div className="result-type">
                            <p>属于测试类型</p>
                            <span>{ result.typeName }</span>
                        </div>
                        <div className="result-tips">
                            { result.notes }
                        </div>
                
                        <div className="account-tips" className={ userInfo.openAccountStatus == '0' ? 'account-tips show' : 'account-tips' }>为了您的资金安全，出借前请先开通银行存管账户</div>
                
                        <div className="div-btn">
                            <button className={ userInfo.count == 0 ? "again-risk norisk" : "again-risk dmp-click" } dev_id="D3.2-1" eventtype="jump" disabled={ userInfo.count == 0 ? true : false } onClick={ ()=> location = '/mypurse/riskrating?repeat=false' }>重新测评</button>
                            <button className="investment dmp-click" dev_id={ this.state.userInfo.openAccountStatus == '0' ? 'D3.2-3' : 'D3.2-2' } eventtype="jump" onClick={ this.isOpenAccount }>{ this.state.btnName }</button>
                        </div>
                        {
                            this.state.riskNumLost ? 
                            <div className="risk-text">您今年测评测试已达{userInfo.sumCount}次上限，{userInfo.nextTestTime}后可重新开始测评。详情可拨打客服电话4000-169-521进行咨询。</div> :
                            <div className="risk-text">您今年还可以测试: <span>{userInfo.count}</span>次<Popover
                            placement="bottom"
                            overlay={ this.state.tips }
                            visible={ false }><b className="risk-tip">?</b></Popover></div>
                            
                        }
                    </div>
                </div>
            </div>
        )
    }
}