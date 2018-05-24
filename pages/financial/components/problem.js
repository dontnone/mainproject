import React, { Component } from 'react'

export default class extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isShow: false
        }
    }
    change = () => {
        this.setState({
            isShow: !this.state.isShow
        })
    }
    joinRecord = () => {
        if(this.props.type == 'thirty'){
            location = '/financial/joinrecord?id=' + this.props.proId + '&type=10'
        }else{
            location = '/financial/joinrecordnew?id=' + this.props.proId
        }
    }
    render() {
        return (
            <ul className="main-list xxd-common-list">
                <li className="list-item faq-item">
                    <p onClick={ this.change } className="dmp-click" dev_id={ this.props.type == 'thirty' ? 'A8.2-3.12.1' : 'A8.1-3' } eventtype={ this.state.isShow ? 'close_float_window' : 'open_float_window' }>
                        <span className="item-txt dmp-click" dev_id={ this.props.type == 'thirty' ? 'A8.2-3.12.1' : 'A8.1-3' } eventtype={ this.state.isShow ? 'close_float_window' : 'open_float_window' }>常见问题</span>
                        <span className="arrow-down-icon dmp-click" className={ this.state.isShow ? 'arrow-down-icon up-icon' : 'arrow-down-icon' }  dev_id={ this.props.type == 'thirty' ? 'A8.2-3.12.1' : 'A8.1-3' } eventtype={ this.state.isShow ? 'close_float_window' : 'open_float_window' }></span>
                    </p>
                    {
                        this.props.type == 'thirty' ? 
                        <ul className="content" className={ this.state.isShow ? 'content show' : 'content' }>
                        <li>
                            <p className="question">1. 我为什么无法出借新元宝（新手专享）？</p>
                            <div className="answer">
                            新元宝（新手专享）仅针对未在新新贷平台出借过的新用户，且每位用户只能参与一次。
                            </div>
                        </li>
                        <li>
                            <p className="question">2. 新元宝（新手专享）产品可以使用红包吗？</p>
                            <div className="answer">
                            不可以。红包仅限用于新元宝等普通产品，请详见红包使用说明。
                            </div>
                        </li>
                        <li>
                            <p className="question">3. 新元宝（新手专享）如何退出？</p>
                            <div className="answer">
                                服务期内不支持提前退出。服务期结束后，您可以申请债权转让退出。债权转让时间由债权转让交易撮合情况而定，历史平均转让成功时间为1-3个工作日。成功转让后资金返至您的新新贷账户中，并可在账户的“可用余额”查询。
                            </div>
                        </li>
                    </ul> : 
                    <ul className="content" className={ this.state.isShow ? 'content show' : 'content' }>
                        <li>
                            <p className="question">1、我出借了新手标1个月，还能投新手标3个月吗？</p>
                            <div className="answer">
                                不能，新手标每个账户限购1次。
                            </div>
                        </li>
                        <li>
                            <p className="question">2、出借新手标可以使用新手红包吗？</p>
                            <div className="answer">
                                不可以，新手红包仅限在出借月月派、新元宝产品及散标直投产品（票据贷除外）可用。
                            </div>
                        </li>
                        <li>
                            <p className="question">3、出借新手标服务期内可以退出吗？</p>
                            <div className="answer">
                                不可以，新手标1个月和3个月，服务期限内均不支持提前退出。
                            </div>
                        </li>
                        <li>
                            <p className="question">4、新手标安全吗？</p>
                            <div className="answer">
                                新新贷以严谨负责的态度对每笔借款进行严格筛选。
                            </div>
                        </li>
                    </ul>
                    }
                    
                </li>
                <li className="list-item dmp-click" dev_id={ this.props.type == 'thirty' ? 'A8.2-3.13.1' : 'A8.1-4' } eventtype="jump" onClick={ () => location = '/financial/credit' }>
                    <span className="item-txt dmp-click" dev_id={ this.props.type == 'thirty' ? 'A8.2-3.13.1' : 'A8.1-4' } eventtype="jump">债权列表</span>
                    <span className="arrow-right-icon dmp-click" dev_id={ this.props.type == 'thirty' ? 'A8.2-3.13.1' : 'A8.1-4' } eventtype="jump"></span>
                </li>
                <li className="list-item dmp-click" dev_id={ this.props.type == 'thirty' ? 'A8.2-3.14.1' : 'A8.1-5' } eventtype="jump" onClick={ this.joinRecord }>
                    <span className="item-txt dmp-click" dev_id={ this.props.type == 'thirty' ? 'A8.2-3.14.1' : 'A8.1-5' } eventtype="jump">加入记录</span>
                    <span className="item-right-txt dmp-click" dev_id={ this.props.type == 'thirty' ? 'A8.2-3.14.1' : 'A8.1-5' } eventtype="jump">{ this.props.joinNum }人</span>
                    <span className="arrow-right-icon dmp-click" dev_id={ this.props.type == 'thirty' ? 'A8.2-3.14.1' : 'A8.1-5' } eventtype="jump"></span>
                </li>
            </ul>
        )
    }
}