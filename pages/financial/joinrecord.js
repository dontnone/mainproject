import React, { Component } from 'react'
import Head from 'next/head'
import Header from '../../components/header/index'
import { PullToRefresh, ListView, Button, Toast } from 'antd-mobile'
import Api from '../../components/api/financial'

let pageIndex = 1
export default class extends Component {
    static async getInitialProps(ctx) {
        return {
            id: ctx.req.query.id,
            type: ctx.req.query.type
        }
    }
    constructor(props) {
        super(props)
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        this.params = {
            productId: this.props.id,
            productType: this.props.type,
            page: pageIndex
        }
        this.state = {
            dataSource,
            height:'',
            refreshing: true,
            isLoading: true,
            hasMore: true,
            useBodyScroll: false,
        }
    }
    async componentDidMount() {
        typeof window !== "undefined" ? window : this
        const document = window.document
        this.setState({
            height: (document.documentElement.clientHeight - 102) + 'px'
        })
        const res = await Api.financialJoinRecord(this.params)
        this.rData = res.items || []
        if(JSON.stringify(res) != "{}" && res.totalCount <= 40 || JSON.stringify(res) != "{}" && res.items.length < 40){
            this.setState({
                hasMore: false
            })
        }
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.rData),
            refreshing: false,
            isLoading: false,
        });
    }
    onRefresh = async () => {
        pageIndex = 1
        this.params = {
            productId: this.props.id,
            productType: this.props.type,
            page: pageIndex
        }
        this.setState({ refreshing: true, isLoading: true });
        const res = await Api.financialJoinRecord(this.params)
        this.rData = res.items || []
        if(JSON.stringify(res) != "{}" && res.totalCount <=20 || JSON.stringify(res) != "{}" && res.items.length < 20){
            this.setState({
                hasMore: false
            })
        }
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.rData),
            refreshing: false,
            isLoading: false,
        })
    }
    
    onEndReached = async (event) => {
        this.setState({ isLoading: true });
        ++pageIndex
        this.params = {
            productId: this.props.id,
            productType: this.props.type,
            page: pageIndex
        }
        const res = await Api.financialJoinRecord(this.params)
        if(res.totalCount <= 40 || res.items.length < 40){
            this.setState({
                hasMore: false
            })
            return
        }
        this.rData = this.rData.concat(res.items);
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.rData),
            isLoading: false,
        });
    };
    changeMoney = (val) => {
        if(val){
            var changeMoney = 0
            const ractMoney = Number(val).toFixed(2)
            changeMoney = ractMoney.split('.');
            changeMoney[0] = changeMoney[0].replace(/(\d)(?=(\d{3})+$)/g,'$1,');
            changeMoney = changeMoney.join('.');
            return changeMoney
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
                <li className="dis-flex-row" key={ rowID }>
                    <span>{ rowData.investor }</span>
                    <span>{ this.changeMoney(rowData.amount) }</span>
                </li>
            );
        };
        return (
            <div>
                <Head>
                    <link rel='stylesheet' type='text/css' href="/static/mods/mypurse/investmenthistory/_.css" />
                </Head>
                <div className="xxb-box position-a">
                    <Header title="加入记录" weight={ true } />
                    <div className="history-container join-container position-a">
                        <ul className="tab-wrapper">
                            <li className="tab-link"><a>出借人</a></li>
                            <li className="tab-link l-flex"><a>出借金额(元)</a></li>
                        </ul>
                        <ul className="content">
                        {
                            this.rData && this.rData.length == 0 ? 
                            <div className="text-center">
                                <p>暂无加入记录！</p>
                            </div>
                            : <ListView
                            key={this.state.useBodyScroll ? '0' : '1'}
                            ref={el => this.lv = el}
                            dataSource={this.state.dataSource}
                            renderFooter={() => (<div style={{ padding: '10px 0 30px', textAlign: 'center' }}>
                            {this.state.hasMore ? '加载中...' : '已全部加载'}
                            </div>)}
                            renderRow={row}
                            renderSeparator={separator}
                            initialListSize={ this.rData &&  this.rData.length }
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
                        }
                            
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}