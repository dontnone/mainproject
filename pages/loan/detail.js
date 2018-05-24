import React, { Component } from 'react'

import Head from './header/index'

import { Toast } from 'antd-mobile'

import { getQueryString } from '../../common/Util'

import { cFetch } from '../../common/Promise'

import urlPath from './api'

class LoanDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            productHome: {},
            productNext: {},
            repayType: ''
        }
    }
    async componentDidMount() {
        if(!getQueryString('productId')){
            return Toast.info('产品不存在！')
        }
        const productId = getQueryString('productId')
        const res = await cFetch(urlPath.loanProduct + productId, {
            data:{}
        })
        if(res && res.code == '200000'){
            this.setState({
                productHome: res.data
            })
        }
        const resJson = await cFetch(urlPath.loanNext + productId, {
            data: {}
        })
        if(resJson && resJson.code == '200000'){
            switch(resJson.data.items[0].repayType) {
                case '001':
                    this.setState({repayType: '等额本息'})
                    break
                case '002':
                    this.setState({repayType: '等额本金'})
                    break
                case '003':
                    this.setState({repayType: '等本等息'})
                    break
                case '004':
                    this.setState({repayType: '按期还息到期通过债权转让退出'})
                    break
                case '005':
                    this.setState({repayType: '砍头收息到期换本'})
                    break
                case '006':
                    this.setState({repayType: '利随本清'})
                    break
                case '007':
                    this.setState({repayType: '随借随还'})
                    break
                default:
                    this.setState({repayType: ''})
            }
            this.setState({
                productNext: resJson.data.items[0]
            })
        }
    }
    render() {
        if(JSON.stringify(this.state.productNext) == "{}"){
            return (
                <Head>
                    <div className='d_container'>
                        <div>
                            <h2>&nbsp;</h2>
                            <h5>还款方式</h5>
                            <span>&nbsp;</span>
                            <h5>借款期限</h5>
                            <span>&nbsp;</span>
                            <h5>年化利率</h5>
                            <span>&nbsp;</span>
                            <h5>借款金额范围</h5>
                            <span>&nbsp;</span>
                        </div>
                        <div className='describe'>
                            <h3>产品描述</h3>
                            <div className='info'>
                                <p>&nbsp;</p>
                            </div>
                        </div>
                    </div> 
                </Head>
            )
        }
        var ractSum = ''
        const Lilv = this.state.productNext.periodList
        if(Lilv.length > 1){
            ractSum = Lilv[0].interestRate + '% ~ ' + Lilv[Lilv.length-1].interestRate + '%'
        }else if(Lilv.length == 1){
            ractSum = Lilv[0].interestRate + '%'
        }
        return (
            <Head>
                <div className='d_container'>
                    <div>
                        <h2>{this.state.productHome.productName}</h2>
                        <h5>还款方式</h5>
                        <span>{this.state.repayType}</span>
                        <h5>借款期限</h5>
                        <span>
                        {
                            this.state.productNext.periodList.map((item, index)=> {
                                if(this.state.productNext.periodList.length == index + 1){
                                    switch(item.periodType){
                                        case "YEAR":
                                            item.periodType = '年'
                                            break
                                        case "MONTH":
                                            item.periodType = '月'
                                            break
                                        case "DAY":
                                            item.periodType = '天'
                                            break
                                        default:

                                    }
                                    return item.periodValue + item.periodType
                                }else{
                                    return item.periodValue + ','
                                }
                                
                            })
                            
                        }
                        </span>
                        <h5>年化利率</h5>
                        <span>{ractSum}</span>
                        <h5>借款金额范围</h5>
                        <span>{this.state.productHome.amountDown} - { this.state.productHome.amountUp } 元</span>
                    </div>
                    <div className='describe'>
                        <h3>产品描述</h3>
                        <div className='info'>
                            <p>{this.state.productHome.productDesc}</p>
                        </div> 
                    </div>
                </div> 
            </Head>
        )
    }
}

export default LoanDetail
