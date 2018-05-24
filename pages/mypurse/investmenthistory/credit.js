import React, { Component } from 'react'
import Head from 'next/head'
import Header from '../../../components/header/index'
import { PullToRefresh, ListView, Button, Toast } from 'antd-mobile'
import { localItem , removeLocalItem, getQueryString } from '../../../common/Util'
import Api from '../../../components/api/investment'
import userApi from '../../../components/api/purse'
import FinancialApi from '../../../components/api/financial'

let pageIndex = 1
const returnTop = (con)=> {
    if (localItem('creditPosition')) {
        if (!con.refs.lv) return;
        try {
            con.refs.lv.listviewRef.ListViewRef.ScrollViewRef.scrollTop = localItem('creditPosition');
        }
        catch (e) {
            // console.log(e)
        }
        removeLocalItem('creditPosition');
    }
}
export default class extends Component {
    constructor(props) {
        super(props)
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        this.state = {
            dataSource,
            height:'',
            refreshing: true,
            isLoading: true,
            hasMore: true,
            useBodyScroll: false,
            userId: '',
            sign: ''
        }
    }
    async componentWillMount() {
        const userId = await userApi.userInfo()
        const sign = await FinancialApi.getSign({userId: userId.userId})
        this.setState({
            userId: userId.userId,
            sign
        });
    }
    async componentDidMount() {
        typeof window !== "undefined" ? window : this
        const document = window.document
        this.setState({
            height: (document.documentElement.clientHeight - 54) + 'px'
        })
        const context = {
            id: getQueryString('id'),
            page: 1
        }
        let localItems = ''
        if(localItem('creditList')){
            localItems = JSON.parse(localItem('creditList'))
        }
        if(!localItems){
            const res = await Api.investmentCreditList(context)
            if(res.item.length < 20 || res.totalCount == 0){
                this.setState({
                    hasMore: false
                })
            }
            this.rData = res.item
            const cont = {
                page: pageIndex,
                data: this.rData,
                hasMore: this.state.hasMore
            }
            localItem('creditList', JSON.stringify(cont))
            await this.setState({
                dataSource: this.state.dataSource.cloneWithRows(this.rData),
                refreshing: false,
                isLoading: false,
            });
        }else{
            this.rData = localItems.data;
            pageIndex = localItems.page
            await this.setState({
                dataSource: this.state.dataSource.cloneWithRows(this.rData),
                refreshing: false,
                isLoading: false,
                hasMore: localItems.hasMore
            });
        }
        returnTop(this);
    }
    //返回记录滚动位置三件套2-针对浏览器返回按钮情况：
    componentDidUpdate() {
        returnTop(this);
    }
    onRefresh = async () => {
        pageIndex = 1
        this.setState({ refreshing: true, isLoading: true });
        const context = {
            id: getQueryString('id'),
            page: 1
        }
        const res = await Api.investmentCreditList(context)
        if(res.item.length < 20 || res.totalCount == 0){
            this.setState({
                hasMore: false
            })
        }
        this.rData = res.item
        const cont = {
            page: pageIndex,
            data: this.rData,
            hasMore: this.state.hasMore
        }
        localItem('creditList', JSON.stringify(cont))
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.rData),
            refreshing: false,
            isLoading: false,
        })
    }
    onEndReached = async (event) => {
        this.setState({ isLoading: true });
        const context = {
            id: this.joinId,
            page: ++pageIndex
        }
        const res = await Api.investmentCreditList(context)
        if(res.totalCount == 0 || res.item.length == 0){
            this.setState({
                hasMore: false
            })
            return
        }
        this.rData = this.rData.concat(res.item);
        const cont = {
            page: pageIndex,
            data: this.rData,
            hasMore: this.state.hasMore
        }
        localItem('creditList', JSON.stringify(cont))
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.rData),
            isLoading: false,
        });
    };
    contract = row => async () => {
        localItem('creditPosition', this.refs.lv.listviewRef.ListViewRef.ScrollViewRef.scrollTop);
        const sessionParam = {
            borrowId: row.borrowId,
            source: '4',
            uid: this.state.userId,
            sign: this.state.sign.resp,
        }
        await sessionStorage.setItem('contract', JSON.stringify(sessionParam))
        if(row.type != '20' && row.type != '13'){
            location = '/financial/contract?id=' + row.borrowId 
        }
    }
    entryDeatil = rowData => () => {
        localItem('creditPosition', this.refs.lv.listviewRef.ListViewRef.ScrollViewRef.scrollTop);
        if(rowData.type == '20'){
            location = '/financial/creditdetailxyd?id=' + rowData.borrowId
        }else{
            location = '/financial/creditdetail?id=' + rowData.borrowId + '&type=' + rowData.type
        }
    }
    render() {
        const separator = (sectionID, rowID) => (
            <div
              key={`${sectionID}-${rowID}`}
            />
        );
        const row = (rowData, sectionID, rowID) => {
            return (
                <li className="" key={ rowID }>
                    <p className="zq-name">
                        <span>{ rowData.loanName }</span>
                        <a className="zq-btn dmp-click" dev_id={ 'F14.4-2-' + JSON.stringify(rowData) } eventtype="jump" onClick={ this.contract(rowData) }>查看合同</a>
                    </p>
                    <div className="zq-detail dis-flex-row">
                        <div className="detail-li zq-earnings">
                            <p className="count"><span className="month">{ rowData.loanPeriod }</span>{ rowData.loanPeriodUnit }</p>
                            <p className="txt">出借期限</p>
                        </div>
                        <div className="detail-li">
                            <p className="count sum">{ rowData.investAmount }<span>元</span></p>
                            <p className="txt">出借金额</p>
                        </div>
                        <div className="detail-li">
                            <p className="count"><span className="month">{ rowData.loanApr }</span>%</p>
                            <p className="txt">借款利率</p>
                        </div>
                    </div>
                    <p className="p-link"><a className="dmp-click" dev_id={ 'F14.4-3-' + JSON.stringify(rowData) } eventtype="jump" onClick={ this.entryDeatil(rowData) }>查看详情</a></p>
                </li>
            );
        };
        return (
            <div>
                <Head>
                    <link rel='stylesheet' type='text/css' href="/static/mods/mypurse/investmenthistory/_.css" />
                </Head>
                <div className="xxb-box position-a">
                    <Header title="债权列表" dmp={ true } dev_id="A14.4-1" eventtype="jump" />
                    <div className="zq-container position-a">
                        <ul className="zq-list">
                        <ListView
                            key={this.state.useBodyScroll ? '0' : '1'}
                            ref='lv'
                            dataSource={this.state.dataSource}
                            renderFooter={() => (<div style={{ padding: '10px 0 30px', textAlign: 'center' }}>
                            {this.state.hasMore ? '加载中...' : '已全部加载'}
                            </div>)}
                            renderRow={row}
                            initialListSize={ this.rData &&  this.rData.length }
                            renderSeparator={separator}
                            useBodyScroll={this.state.useBodyScroll}
                            style={this.state.useBodyScroll ? {} : {
                            height: this.state.height,
                            margin: '5px 0',
                            }}
                            pullToRefresh={<PullToRefresh
                            refreshing={this.state.refreshing}
                            onRefresh={this.onRefresh}
                            />}
                            onEndReached={this.onEndReached}
                            pageSize={5}
                        />
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}