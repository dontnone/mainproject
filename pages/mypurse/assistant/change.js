import React, { Component } from 'react'
import Head from 'next/head'
import Header from '../../../components/header/index'
import { getQueryString, onFocus, onBlur } from '../../../common/Util'
import { Toast } from 'antd-mobile'
import Api from '../../../components/api/purse'

export default class extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userInfo: {},
            vipCode: '',
            serviceNum: ''
        }
    }
    async componentDidMount(){
        const userRes = await Api.userInfo()
        Toast.hide()
        this.setState({
            userInfo: userRes,
            vipCode: getQueryString('vipid')
        })
    }
    changeService = (e)=> {
        this.setState({
            serviceNum: e.target.value
        })
    }
    bindAssistantOk = async ()=> {
        const context = {
            userId: this.state.userInfo.userId,
            serviceNum: this.state.serviceNum
        }
        if(this.state.serviceNum){
            const res = await Api.submitAssistant(context)
            if(JSON.parse(res.json).code == '0'){
                Toast.info(JSON.parse(res.json).info, 2)
                setTimeout(()=>{
                    location = '/mypurse/personal'
                })
            }else{
                Toast.info(JSON.parse(res.json).info, 2)
            }
        }else{
            Toast.info('请输入财富顾问姓名或编号', 2)
        }
        
    }
    render() {
        return (
            <div>
                <Head>
                    <link rel='stylesheet' type='text/css' href="/static/mods/mypurse/assistant/_.css" />
                </Head>
                <div className="assistant-box position-a">
                    <Header title="更换财富顾问" dmp={ true } dev_id="D5.2-1" eventtype="jump" />
                    <div className="assistant-container position-a">
                        <div className="change-assistant-wrapper">
                            <div className="current-assistant">
                                <span className="input-left">当前财富顾问: {this.state.vipCode}</span>
                            </div>
                            <div className="new-assistant">
                                <span className="input-left">新财富顾问:</span>
                                <input type="text" value={ this.state.serviceNum } onFocus={ onFocus() } onBlur={ onBlur('请输入财富顾问姓名或编号') } placeholder="请输入财富顾问姓名或编号" onChange={ this.changeService } className="change-input" />
                            </div>
                            <div className="div-btn">
                                <button className="xxd-xl-btn dmp-click" dev_id="D5.2-2" eventtype="jump" onClick={ this.bindAssistantOk }>确认更换</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}