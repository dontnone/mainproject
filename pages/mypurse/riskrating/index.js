import React, { Component } from 'react'
import Head from 'next/head'
import Header from '../../../components/header/index'
import Api from '../../../components/api/purse'
import { getLocalIP, getQueryString } from '../../../common/Util'
import { Toast } from 'antd-mobile'

export default class extends Component {
    constructor(props) {
        super(props)
        this.state = {
            ip: '',
            answerLength: true,
            topTip: true,
            risk: []
        }

    }
    async componentDidMount() {
        Toast.loading('加载中……', 0)
        const res = await Api.getRiskExam()
        const ipRes = await Api.getBorrowIp()
        const isShow = getQueryString('repeat') == 'false' ? true : false
        this.setState({
            ip: ipRes.origin,
            topTip: isShow,
            risk: res.riskExams
        })
        Toast.hide()
    }
    chooiceAnswer = (e)=> {
        const parentNodes = e.currentTarget.parentElement.childNodes
        for(let i=0; i<parentNodes.length; i++){
            parentNodes[i].children[0].children[0].className = 'radio'
        }
        e.currentTarget.children[0].children[0].className = 'radio checked'
        const checkedLength = document.querySelectorAll('.checked').length
        if(this.state.risk.length == checkedLength){
            this.setState({
                answerLength: false
            })
        }
    }
    submitAnswer = async ()=> {
        const checkAll = document.querySelectorAll('.checked')
        let answers = []
        for(let i=0; i< checkAll.length; i++){
            answers.push({questionId: checkAll[i].id, questionDetailId: checkAll[i].getAttribute('name')})
        }
        const context = {
            answers: answers,
            ip: this.state.ip
        }
        const res = await Api.submitRisk(context)
        if(res && res.status){
            Toast.hide()
            location = '/mypurse/riskrating/result'
        }
    }
    render() {
        return (
            <div>
                <Head>
                    <link rel='stylesheet' type='text/css' href="/static/mods/mypurse/riskrating/_.css" />
                </Head>
                <div className="risk-box position-a">
                    <Header title="风险评测" dmp={ true } dev_id="D3.1-1" eventtype="jump" />
                    <div className="risk-container position-a">
                        <div className={ this.state.topTip ? 'hide' : 'risk-tips' }>您目前尚未完成风险评估测试，完成该测试有利于判断您的加入风险承受能力。</div>
                        <div className="rating-list-wrapper">
                        {
                            this.state.risk.map((item, index)=>
                                <div className="question-wrapper" key={item.id}>
                                    <p className="question-txt">{index + 1 + '.'}{item.topic}</p>
                                    <ul className="answer-list">
                                        {
                                            item.answerOptions.map((reg)=>{
                                                return (
                                                    <li className="answer-li" key={reg.id} onClick={ (e) => { this.chooiceAnswer(e) } }>
                                                        <label htmlFor={reg.id}><span className='radio' id={ item.id } name={ reg.porder }></span><input type="radio" name={reg.questionid} id={reg.id} /></label>
                                                        <p className="answer-txt">{reg.porder + '.' + reg.answeritem}</p>
                                                    </li>
                                                )
                                            })
                                        }
                                    </ul>
                                </div>
                            )
                        }
                        </div>
                
                        <div className="div-btn">
                            <button className="xxd-xl-btn dmp-click" dev_id="D3.1-2" eventtype="jump" disabled={ this.state.answerLength } onClick={ this.submitAnswer }>提交</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
