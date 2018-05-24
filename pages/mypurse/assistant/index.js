import React, { Component } from 'react'
import Head from 'next/head'
import Header from '../../../components/header/index'
import Api from '../../../components/api/purse'
import { Toast } from 'antd-mobile'
import { onFocus, onBlur } from '../../../common/Util'

export default class extends Component {
    constructor(props) {
        super(props)
        this.state = {
            serviceList: [],
            userInfo: {},
            otherService: ''
        }
    }
    async componentDidMount() {
        const res = await Api.bindAssistant()
        const userRes = await Api.userInfo()
        if(JSON.parse(res.json).code == '0'){
            this.setState({
                userInfo: userRes,
                serviceList: JSON.parse(res.json).data
            })
        }
    }
    chooiceAnswer = (e)=> {
        const parentNodes = e.currentTarget.parentElement.childNodes
        for(let i=0; i<parentNodes.length; i++){
            parentNodes[i].children[0].children[0].className = 'radio'
        }
        e.currentTarget.children[0].children[0].className = 'radio checked'
    }
    entryService = (e) => {
        this.setState({
            otherService: e.target.value
        })
    }
    bindAssistantOk = async ()=> {
        const serviceCheck = document.querySelectorAll('.checked')
        const context = {
            userId: this.state.userInfo.userId,
            serviceNum: serviceCheck[0].id
        }
        const res = await Api.submitAssistant(context)
        if(JSON.parse(res.json).code == '0'){
            Toast.info(JSON.parse(res.json).info, 2)
            setTimeout(()=>{
                location = '/mypurse/personal'
            }, 2000)
        }else{
            Toast.info(JSON.parse(res.json).info, 2)
        }
    }

    render() {
        return (
            <div>
                <Head>
                    <link rel='stylesheet' type='text/css' href="/static/mods/mypurse/assistant/_.css" />
                </Head>
                <div className="assistant-box position-a">
                    <Header title="绑定财富顾问" dmp={ true } dev_id="D5.1-1" eventtype="jump" />
                    <div className="assistant-container position-a">
                        <div className="question-wrapper assistant-list-wrapper">
                            <p className="question-txt">选择专属财富顾问</p>
                            <ul className="answer-list">
                                {
                                    this.state.serviceList.map((item)=>{
                                        return (
                                            <li className="answer-li" onClick={ this.chooiceAnswer } key={item.serviceValue}>
                                                <label htmlFor=""><span className="radio"  id={ item.serviceValue }></span><input type="radio" name="answer" /></label>
                                                <p className="answer-txt">{item.serviceNum}</p>
                                            </li>
                                        )
                                    })
                                }
                                <li className="answer-li" onClick={ this.chooiceAnswer }>
                                    <label htmlFor=""><span className="radio checked"  id={ this.state.otherService }></span><input type="radio" name="answer" defaultChecked /></label>
                                    <p className="answer-txt">其他专属财富顾问</p>
                                    <input type="text" className="other-input" value={ this.state.otherService } onChange={ this.entryService } onFocus={ onFocus() } onBlur={ onBlur('请输入财富顾问姓名或编号') } placeholder="请输入财富顾问姓名或编号" />
                                </li>
                            </ul>
                        </div>
                        <div className="div-btn">
                            <button className="xxd-xl-btn dmp-click" dev_id="D5.1-2" eventtype="jump" onClick={ this.bindAssistantOk }>确定</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}