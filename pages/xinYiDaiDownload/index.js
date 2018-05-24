import React, {Component} from 'react'
import Head from 'next/head'
import Header from '../../components/header/index'
import Link from 'next/link'
import Api from '../../components/api/home'
import md5 from 'md5'
import {Toast, Modal, Button} from 'antd-mobile'
import {cFetch} from '../../common/Promise';
import createBrowserHistory from "history/createBrowserHistory"

import {onFocus, onBlur, getCookie} from '../../common/Util'

export default class xinYiDaiDownload extends Component {
    constructor(props) {
        super(props)
        this.state = {
            utm_source:'',
            xydapp_utm_source:'',
            baseDownloadLink:'https://m.xinxindai.com/jie/download/manifest.html',
            downloadLink:''
        }
    }
    componentDidMount() {
      let  getQueryVariable=(variable)=> {
            var query = window.location.search.substring(1);
            var vars = query.split("&");
            for (var i=0;i<vars.length;i++) {
                var pair = vars[i].split("=");
                if(pair[0] == variable){return pair[1];}
            }
            return(false);
        }
       let utm_source= getQueryVariable('utm_source');
        let xydapp_utm_source= getQueryVariable('xydapp_utm_source');
        let downloadLink = window.location.search
        this.setState({
            utm_source:utm_source,
            xydapp_utm_source:xydapp_utm_source,
            downloadLink:this.state.baseDownloadLink+downloadLink
        });
    }


    regMain = () => {
        return (<div className={this.state.showMain ? 'hide reg-main' : 'show remain'} id='reg'>
            <div className='xy-register-header' id='reg'>
            </div>
            <div className="reg-broadcast">
                <div className='reg-bc-item'>
                    <div className="reg-bc-center">
                        <div className="reg-bc-icon">
                            <img src="/static/mods/xinYiDaiRegister/imgs/time.png"
                                 className='time-icon reg-icon' alt=""/>
                        </div>
                        <div className="reg-bc-text">
                            <h3 className="reg-bc-title">
                                放款快
                            </h3>
                            <h4 className="reg-bc-p">
                                最快10分钟放款
                            </h4>
                        </div>
                    </div>
                </div>
                <div className='reg-bc-item'>
                    <div className="reg-bc-center">
                        <div className="reg-bc-icon">
                            <img src="/static/mods/xinYiDaiRegister/imgs/id.png" className='time-icon reg-icon'
                                 alt=""/>
                        </div>
                        <div className="reg-bc-text reg-bc-text-sp">
                            <h3 className="reg-bc-title">
                                门槛低
                            </h3>
                            <h4 className="reg-bc-p">
                                无抵押、无担保、
                                纯线上操作
                            </h4>
                        </div>
                    </div>
                </div>
                <div className='reg-bc-item'>
                    <div className="reg-bc-center">
                        <div className="reg-bc-icon">
                            <img src="/static/mods/xinYiDaiRegister/imgs/security.png"
                                 className='time-icon reg-icon' alt=""/>
                        </div>
                        <div className="reg-bc-text">
                            <h3 className="reg-bc-title">
                                隐私安全
                            </h3>
                            <h4 className="reg-bc-p">
                                个人信息完全保密
                            </h4>
                        </div>
                    </div>
                </div>
                <div className='reg-bc-item'>
                    <div className="reg-bc-center">
                        <div className="reg-bc-icon">
                            <img src="/static/mods/xinYiDaiRegister/imgs/cash.png"
                                 className='time-icon reg-icon' alt=""/>
                        </div>
                        <div className="reg-bc-text">
                            <h3 className="reg-bc-title">
                                借钱多
                            </h3>
                            <h4 className="reg-bc-p">
                                最高可借20万
                            </h4>
                        </div>
                    </div>
                </div>
            </div>
            <div className="reg-flow">

            </div>
            <div className="reg-info">
                <p className='reg-info-p'>4000-169-521（9:00-18:00工作日）</p>
                <p className='reg-info-p'>总部地址：上海市虹口区四川北路859号中信广场28F</p>
                <p className='reg-info-p'>新新贷（上海）金融信息服务有限公司</p>
                <p className='reg-info-p'>沪ICP备案 12026657号-1</p>
                <p className='reg-info-p'>市场有风险，出借需谨慎</p>
                <p className='reg-info-p'>是否2小时到账，视个人情况而定</p>
            </div>
            <div className="reg-bottom-btn">
                <div className="reg-apply-btn">
                    <a href={this.state.downloadLink}>立即下载</a>
                </div>
            </div>
        </div>)
    }


    render() {
        return (
            <div>
                <Head>
                    <link rel='stylesheet' type='text/css' href="/static/mods/xinYiDaiDownload/_.css"/>
                </Head>
                <this.regMain/>
            </div>
        )
    }
}