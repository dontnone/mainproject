import React, { Component } from 'react'
import Head from 'next/head'
import Header from '../../../components/header/index'
import Api from '../../../components/api/purse'
import moment from 'moment'
import { getQueryString } from '../../../common/Util'

export default class extends Component {
    constructor(props) {
        super(props)
        this.state = {
            reocrd: []
        }
    }
    async componentDidMount() {
        const res = await Api.stepOutRecord({joinId: getQueryString('borrowId')})
        this.setState({
            reocrd: res.stepQuitList
        })
    }
    changeMoney = (val) => {
        if(val){
            var changeMoney = 0
            const ractMoney = Number(val).toFixed(2)
            changeMoney = ractMoney.split('.');
            changeMoney[0] = changeMoney[0].replace(/(\d)(?=(\d{3})+$)/g,'$1,');
            changeMoney = changeMoney.join('.');
            return changeMoney
        }
    }
    render() {
        return (
            <div>
                <Head>
                    <link rel='stylesheet' type='text/css' href="/static/mods/mypurse/investmenthistory/_.css" />
                </Head>
                <div className="xxb-box position-a">
                    <Header title="退出记录" dmp={ true } dev_id="A14.6-1" eventtype="jump" weight={ true } />
                    <div className="history-container join-container position-a">
                        <ul className="tab-wrapper">
                            <li className="tab-link l-flex"><a>退出时间</a></li>
                            <li className="tab-link"><a>退出年化</a></li>
                            <li className="tab-link l-flex"><a>退出本金(元)</a></li>
                            <li className="tab-link l-flex"><a>退出利息(元)</a></li>
                        </ul>
                        <ul className="content">
                            {
                                this.state.reocrd.length == 0 ? 
                                <div className="text-center">
                                    <p>暂无退出记录！</p>
                                </div> :
                                this.state.reocrd.map((item, index)=> {
                                    return (
                                        <li className="dis-flex-row" key={index}>
                                            <span className="l-flex">{ moment(Number(item.quitDate)).format('YYYY-MM-DD') }<br />{ moment(Number(item.quitDate)).format('HH:mm:ss') }</span>
                                            <span>{ item.quitApr }%</span>
                                            <span className="l-flex">{ this.changeMoney(item.quitCapital) }</span>
                                            <span className="l-flex">{ this.changeMoney(item.quitInterest) }</span>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}