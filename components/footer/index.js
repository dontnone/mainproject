import React, { Component } from 'react'
import { Toast } from 'antd-mobile'
import { getCookie } from '../../common/Util'
import Api from '../../components/api/home'

export default class extends Component {
    constructor(props) {
        super(props)
    }
    componentDidMount() {
    }
    changePage = key => async () => {
        const hostUrl = window.location.href
        if(key == 'home' && hostUrl.indexOf(key) == -1){
            window.location.href = '/home'
        }else if(key == 'financial' && hostUrl.indexOf(key) == -1){
            window.location.href = '/financial'
        }else if(key == 'mypurse' && hostUrl.indexOf(key) == -1){
            const res = await Api.isLogin()
            if(res){
                location = '/mypurse'
            }else{
                Toast.info('请先登录', 1)
                sessionStorage.setItem('loginType', '/mypurse')
                setTimeout(()=> {
                    location = '/login'
                }, 1000)
            }
        }
    }
    render() {
        return (
            <div className="footer">
                <ul className="footer-tab">
                    <li className={ this.props.type == 'home' ? 'tab-link tab-link-act dmp-click' : 'tab-link dmp-click' } dev_id="A2.1-14" eventtype="jump" onClick={ this.changePage('home') }>
                        <span className="tab-link-icon tab-home dmp-click" dev_id="A2.1-14" eventtype="jump"></span>
                        <span className="tab-link-txt dmp-click" dev_id="A2.1-14" eventtype="jump">首页</span>
                    </li>
                    <li className={ this.props.type == 'financial' ? 'tab-link tab-link-act dmp-click' : 'tab-link dmp-click' } dev_id="A2.1-13" eventtype="jump" onClick={ this.changePage('financial') }>
                        <span className="tab-link-icon tab-financial dmp-click" dev_id="A2.1-13" eventtype="jump"></span>
                        <span className="tab-link-txt dmp-click" dev_id="A2.1-13" eventtype="jump">产品列表</span>
                    </li>
                    <li className={ this.props.type == 'mypurse' ? 'tab-link tab-link-act dmp-click' : 'tab-link dmp-click' } dev_id="A2.1-15" eventtype="jump" onClick={ this.changePage('mypurse') }>
                        <span className="tab-link-icon tab-my-xxd dmp-click" dev_id="A2.1-15" eventtype="jump"></span>
                        <span className="tab-link-txt dmp-click" dev_id="A2.1-15" eventtype="jump">我的新钱贷</span>
                    </li>
                </ul>
            </div>
        )
    }
}