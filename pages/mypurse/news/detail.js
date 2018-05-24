import React, { Component } from 'react'
import Head from 'next/head'
import Header from '../../../components/header/index'
import Api from '../../../components/api/purse'
import { getQueryString } from '../../../common/Util'
import moment from 'moment'
import Loading from '../../../common/Loading'
import { Toast } from 'antd-mobile'

export default class extends Component {
    constructor(props) {
        super(props)
        this.state = {
            noticeInfo : {}
        }
    }
    async componentDidMount() {
        const id = getQueryString('id')
        if(id){
            const res = await Api.noticeInfo(id)
            const readRes = await Api.readNoticeInfo(id)
            if(readRes.code == '0'){
                this.setState({
                    noticeInfo: res
                })
            }else{
                Toast.info('页面加载失败，请刷新重试！', 2)
            }
        }
    }
    render() {
        const { noticeInfo } = this.state
        if(JSON.stringify(noticeInfo) == "{}"){
            return (
                <div>
                    <Head>
                        <link rel='stylesheet' type='text/css' href="/static/mods/mypurse/news/_.css" />
                    </Head>
                    <div>
                        <Header title="公告详情" />
                        <Loading />
                    </div>
                </div>
            )
        }
        return (
            <div>
                <Head>
                    <link rel='stylesheet' type='text/css' href="/static/mods/mypurse/news/_.css" />
                </Head>
                <div>
                    <Header dmp={ true } dev_id="A13.2-1" eventtype="jump" title="公告详情" />
                    <div className="notice-info">
                        <h2>{noticeInfo.title}</h2>
                        <div className="notice-author">
                            <p>作者：{noticeInfo.author} <span>{ moment(Number(noticeInfo.addTime)).format('YYYY-MM-DD HH:ss:mm') }</span></p>
                        </div>
                        <div dangerouslySetInnerHTML={{__html: noticeInfo.context}}></div>
                    </div>
                </div>
            </div>
        )
    }
}