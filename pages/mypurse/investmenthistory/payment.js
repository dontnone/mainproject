import React, { Component } from 'react'
import Head from 'next/head'
import Header from '../../../components/header/index'
import Api from '../../../components/api/financial'
import moment from 'moment'
import { PullToRefresh, ListView, Button, Toast } from 'antd-mobile'
import { getQueryString } from '../../../common/Util'

export default class extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                productDetail: {
                    expctedCollections: []
                }
            }
        }
    }
    async componentDidMount() {
        const context = {
            id: getQueryString('borrowId'),
            type: getQueryString('type')
        }
        const data = await Api.financialDetail(context)
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
        const { expctedCollections } = this.state.data.productDetail
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
                            expctedCollections && expctedCollections.length == 0 ? 
                            <div className="text-center">
                                <p>暂无还款记录！</p>
                            </div> :
                            expctedCollections.map((item, index)=> {
                                return (
                                    <li key={ index }>
                                        <p className="tit">第{ index + 1 }期</p>
                                        <div className="dis-flex-row">
                                            <div className="detail-li">
                                                <p className="txt">待还日期</p>
                                                <p className="count">{ moment(Number(item.paymentDate)).format('YYYY-MM-DD') }</p>
                                            </div>
                                            <div className="detail-li">
                                                <p className="txt">待还本金</p>
                                                <p className="count">{ this.changeMoney(item.repayInterest) }</p>
                        
                                            </div>
                                            <div className="detail-li">
                                                <p className="txt">待还利息</p>
                                                <p className="count">{ this.changeMoney(item.repayCapital) }</p>
                                            </div>
                                            <div className="detail-li">
                                                <p className="txt">状态</p>
                                                <p className="count status">{ item.status ? '已还款' : '未还款' }</p>
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