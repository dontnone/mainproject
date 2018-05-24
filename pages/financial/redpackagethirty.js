import React, { Component } from 'react'
import Head from 'next/head'
import Header from '../../components/header/index'
import Api from '../../components/api/financial'
import { PullToRefresh, ListView, Button, Toast } from 'antd-mobile'
import moment from 'moment'
import { getQueryString } from '../../common/Util'

let pageIndex = 1
export default class extends Component {
    constructor(props) {
        super(props)
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        this.state = {
            dataSource,
            refreshing: true,
            isLoading: true,
            hasMore: true,
            useBodyScroll: false,
            height: '',
            data: {},
            money: ''
        }
    }
    async componentDidMount() {
        // const res = await Api.redpacketList({status: 0, page: 1})
        typeof window !== "undefined" ? window : this
        const document = window.document
        this.setState({
            height: (document.documentElement.clientHeight - 64) + 'px'
        })

        const money = getQueryString('money')
        const context = { id: getQueryString('id'), type: '10' }
        const data = await Api.financialDetail(context)

        await this.setState({
            data,
            money
        })

        console.log(data)

        this.packageContext = {
            productId: this.state.data.productDetail.productId,
            amount: this.state.money,
            productType: this.state.data.productDetail.productType,
            page: pageIndex
        }

        const res = await Api.packageCanUser(this.packageContext)
        this.rData = res.items
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.rData),
            refreshing: false,
            isLoading: false,
        });
        if(res && res.items.length <= 20){
            this.setState({
                hasMore: false
            })
        }
    }
    onRefresh = async () => {
        pageIndex = 1
        this.packageContext = {
            productId: this.state.data.productDetail.productId,
            amount: this.state.money,
            productType: this.state.data.productDetail.productType,
            page: pageIndex
        }
        this.setState({ refreshing: true, isLoading: true });
        const res = await Api.packageCanUser(this.packageContext)
        this.rData = res.items
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.rData),
            refreshing: false,
            isLoading: false,
        })
    }
    onEndReached = async (event) => {
        this.setState({ isLoading: true });
        ++pageIndex
        this.packageContext = {
            productId: this.state.data.productDetail.productId,
            amount: this.state.money,
            productType: this.state.dataproductDetail.productType,
            page: pageIndex
        }
        const res = await Api.packageCanUser(this.packageContext)
        if(res.totalCount == 0){
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
    noUse = () => {
        history.back()
    }
    useRedPackage = (money, code, type, canuser) => () => {
        if(canuser == '1'){
            const redJson = {
                redNum: money,
                redCode: code,
                redType: type
            }
            sessionStorage.setItem('redJson', JSON.stringify(redJson))
            history.back()
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
                <li onClick={ this.useRedPackage(rowData.amount, rowData.code, rowData.type, rowData.canUse) } dev_id="A9.4-3" eventtype="jump" className={rowData.canUse == '1' ? 'red-list-item dmp-click' :  'red-list-item used-list-wrapper'} key = {rowID}>
                    <div className="dis-flex-row">
                        <div className="item-left red-detail">
                            <p className="red-name">{rowData.title}</p>
                            <p className="expiration-date">有效日期：{moment(Number(rowData.startDate)).format('YYYY-MM-DD')}至{moment(Number(rowData.validDate)).format('YYYY-MM-DD')}</p>
                            <p className="expiration-date">使用平台：{rowData.platform}</p>
                        </div>
                        <div className="item-right red-amount">
                            <p className="red-packet">{rowData.amount}元</p>
                            <p className="reduction-range">满{rowData.amountLimit}使用</p>
                        </div>
                    </div>
                    <p className="red-range">适用范围：{rowData.productRange}</p>
                    <span className="checked-bg"></span>
                </li>
            );
        };
        return (
            <div>
                <Head>
                    <link rel='stylesheet' type='text/css' href="/static/mods/financial/_.css" />
                </Head>
                <div className="redpacket-box">
                    <Header title="使用红包" rightTitle="不使用红包" dmp={ true } dev_id="A9.4-1" eventtype="jump" everyRead={ this.noUse } />
                    <div className="usered-container position-a">
                        <ul className="red-list">
                            {
                                this.rData && this.rData.length == 0 ? 
                                <div className="text-center">
                                    <p>亲，您暂时还没有相关红包哦！</p>
                                </div>
                                :
                                <ListView
                                    key={this.state.useBodyScroll ? '0' : '1'}
                                    ref="lv"
                                    dataSource={this.state.dataSource}
                                    renderFooter={() => (<div style={{ padding: 15, textAlign: 'center' }}>
                                    {this.state.hasMore ? '加载中...' : '已全部加载'}
                                    </div>)}
                                    renderRow={row}
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
                            }
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}