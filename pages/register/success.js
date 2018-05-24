import React, { Component } from 'react'
import moment from 'moment' 
import Header from '../../components/header/index'
import Footer from '../../components/footer/index'
import Head from 'next/head'
import Api from '../../components/api/home'


export default class RegisterSuccess extends Component {
    constructor(props) {
        super(props)
        this.state = {
            items: []
        }
    }
    async componentDidMount() {
        //  请求红包列表
        const res = await Api.redPackage()
        this.setState({
            items: res.items
        })
        // console.log(moment(1506326643000).format('YYYY-MM-DD'))
    }
    openAccount = () => {
        location = '/mypurse/openaccount'
    }
    render() {
        return (
            <div>
                <Head>
                    <link rel='stylesheet' type='text/css' href="/static/mods/register/_.css" />
                </Head>
                <div className="register-success-box">
                    <Header title="注册成功" back="false" />
                    <div className="register-success-container">
                    <div className="main-tit">
                        <p className="success-txt">恭喜你，注册成功！</p>
                        <p className="red-type"><i className="red-line"></i>新用户专享 现金红包<i className="red-line"></i></p>
                    </div>
                    <div className="red-list-wrapper">
                        <ul className="red-list">
                            {
                                this.state.items.map((item)=>{
                                    return (
                                        <li className={ item.canUse == '1' ? 'red-list-item' : 'red-list-item overdue-red-item' } key={item.id}>
                                            <div className="item-left red-amount">
                                                <p className="red-packet">{ item.amount }元</p>
                                                <p className="reduction-range">满{ item.amountLimit }使用</p>
                                            </div>
                                            <div className="item-right red-detail">
                                                <p className="red-name">{ item.title }</p>
                                                <p className="red-range mg-25">适用范围：{ item.productRange }</p>
                                                <p className="expiration-date">有效日期：{ moment(Number(item.startDate)).format('YYYY-MM-DD') }至{ moment(Number(item.validDate)).format('YYYY-MM-DD') }</p>
                                            </div>
                                        </li>
                                    )
                                })
                            }
                            
                        </ul>
                        <div className="div-btn">
                            <button type="button" className="dmp-click" dev_id="D2.1-1" eventtype="jump" onClick={ this.openAccount }>存管开户用红包</button>
                        </div>
                    </div>
                </div>
                </div>
                <Footer />
            </div>
        )
    }
}