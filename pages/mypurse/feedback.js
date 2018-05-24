import React, { Component } from 'react'
import Head from 'next/head'
import Header from '../../components/header/index'
import Api from '../../components/api/purse'
import { List, TextareaItem, Toast } from 'antd-mobile'
import { onFocus, onBlur } from '../../common/Util'

export default class extends Component {
    constructor(props) {
        super(props)
        this.state = {
            content: '',
            contract: ''
        }
    }
    change = key => (e) => {
        if(key == 'content'){
            this.setState({
                [key]: e
            })
        }else{
            if(e.target.value.length > 50){
                return
            }
            this.setState({
                [key]: e.target.value
            }) 
        }
        
    }
    submitFeedBack = async () => {
        const context = {
            content: this.state.content,
            contract: this.state.contract
        }
        const res = await Api.feedback(context)
        if(res.code == '200000'){
            Toast.info('提交成功，感谢您的反馈！', 2)
            this.setState({
                content: '',
                contract: ''
            })
        }else{
            Toast.info(res.message, 2)
        }
    }
    render() {
        return (
            <div>
                <Head>
                    <link rel='stylesheet' type='text/css' href="/static/mods/mypurse/_.css" />
                </Head>
                <div className="feedback-box">
                    <Header title="意见反馈" dmp={ true } dev_id="D6.1-1" eventtype="jump" />
                    <div className="feedback-container position-a">
                        <TextareaItem
                            placeholder="我们会认真考虑您的意见和反馈，不断自我优化，为您提供更好的服务和体验！反馈内容不少3字且不超过200字"
                            value={ this.state.content }
                            onChange={ this.change('content') }
                            className="dmp-click"
                            dev_id="D6.1-2"
                            eventtype="any_value"
                            dmp_action="write"
                            rows={5}
                            count={200}
                        />
                        <input type="text" className="contact dmp-click" dev_id="D6.1-3" dmp_action="write" eventtype="any_value" value={ this.state.contract } onChange={ this.change('contract') } onFocus={ onFocus() } onBlur={ onBlur('请输入您邮箱/QQ号/手机号，我们会尽快和您联系') } placeholder="请输入您邮箱/QQ号/手机号，我们会尽快和您联系" />
                        <div className="div-btn">
                            <button className="xxd-xl-btn dmp-click" dev_id="D6.1-4" eventtype="open_float_window" onClick={ this.submitFeedBack } disabled={ this.state.content.length < 3 ? true : false }>提交</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}