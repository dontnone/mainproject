import React, { Component } from 'react'
import Head from 'next/head'
import { getQueryString } from '../../../common/Util'
import track from '../../../static/merge/track-base'

export default class extends Component {
    constructor(props) {
        super(props)
        this.state = {
            status: '',
            msg: ''
        }
    }
    componentDidMount() {
        track.init()
        this.setState({
            status: getQueryString('status'),
            msg: getQueryString('msg')
        })
    }
    render() {
        const { status, msg } = this.state
        return (
            <div>
                <Head>
                    <link rel='stylesheet' type='text/css' href="/static/mods/mypurse/recharge/_.css" />
                </Head>
                <div className="recharge-box recharge-result-container">
                    <div className={status == 0 ? 'recharge-result-top fail-bg' : 'recharge-result-top success-bg'}>
                        <div className={ status == 0 ? 'circle-box fail-box' : 'circle-box success-box' }>
                            <span className="result-txt">{ status == 0 ? '充值失败' : '充值成功' }</span>
                        </div>
                        <div className="wave-bg"></div>
                    </div>
                    <p className={ status == 0 ? 'recharge-result-txt fail-txt' : 'recharge-result-txt success-txt' }>{ status == 0 ? '充值失败！' : '充值成功！' }</p>
                
                    <div className="fail-tips">
                    { status == 0 ? msg : '' }
                    </div>
                
                    <div className={ status == 0 ? 'div-btn success-btn' : 'div-btn success-btn block' } >
                        <button className="onrecharge dmp-click" dev_id="A10.2-2" eventtype="jump" onClick={ ()=> location = '/mypurse/recharge' }>继续充值</button>
                        <button className="investment dmp-click" dev_id="A10.2-3" eventtype="jump" onClick={ ()=> location = '/financial' }>立即出借</button>
                    </div>
                
                   <div className={ status == 0 ? 'div-btn fail-btn block' : 'div-btn fail-btn' }>
                       <button className="xxd-xl-btn onrecharge" onClick={ ()=> location = '/mypurse/recharge' }>继续充值</button>
                   </div>
                
                </div>
            </div>
        )
    }
}