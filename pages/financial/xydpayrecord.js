import React, { Component } from 'react'
import Head from 'next/head'
import Header from '../../components/header/index'
import Api from '../../components/api/financial'
import moment from 'moment'
import { PullToRefresh, ListView, Button, Toast } from 'antd-mobile'
import { getQueryString } from '../../common/Util'

export default class extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        }
    }
    async componentDidMount() {
        const context = {
            bidCode: getQueryString('borrowId')
        }
        const data = await Api.xydPayRecord(context)
        console.log(data)
        this.setState({
            data
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
        return(
            <div>
                <Head>
                    <link rel='stylesheet' type='text/css' href="/static/mods/mypurse/investmenthistory/_.css" />
                </Head>
                <div className="xxb-box position-a">
                    <Header title="还款记录" />
                    <div className="history-container position-a">
                        <ul className="payment-content">
                        {
                            !this.state.data || this.state.data.length == 0 ? 
                            <div className="text-center">
                                <p>暂无还款记录！</p>
                            </div> :
                            this.state.data.map((item, index)=> {
                                return (
                                    <li key={ index }>
                                        <p className="tit">第{ item.porder }期</p>
                                        <div className="dis-flex-row">
                                            <div className="detail-li">
                                                <p className="txt">待还日期</p>
                                                <p className="count">{ moment(Number(item.dueRepaymentDate)).format('YYYY-MM-DD') }</p>
                                            </div>
                                            <div className="detail-li">
                                                <p className="txt">已还金额</p>
                                                <p className="count">{ this.changeMoney(item.actualRepaymentPayedAmount) || '0.0' }</p>
                        
                                            </div>
                                            <div className="detail-li">
                                                <p className="txt">待还金额</p>
                                                <p className="count">{ this.changeMoney(item.dueRepaymentAmount) }</p>
                                            </div>
                                            <div className="detail-li">
                                                <p className="txt">状态</p>
                                                <p className="count status">{ item.status.message }</p>
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
        )
    }
}