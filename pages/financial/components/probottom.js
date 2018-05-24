import React, { Component } from 'react'

export default class extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <div className="main-bottom">
                <div className="wrapper dis-flex-row">
                    <div className="slogan">
                        <p className="slogan-icon standard-icon"></p>
                        <p className="slogan-txt">专业规范</p>
                    </div>
                    <div className="slogan">
                        <p className="slogan-icon bank-icon"></p>
                        <p className="slogan-txt">资金银行存管</p>
                    </div>
                    <div className="slogan">
                        <p className="slogan-icon fair-icon"></p>
                        <p className="slogan-txt">公平金融理念</p>
                    </div>
                </div>

                <p className="tips" className={ this.props.show ? 'tips' : 'tips content-hide' }>市场有风险，出借须谨慎。<a className="link-color dmp-click" dev_id={ this.props.type == 'newbid' ? 'A8.1-6' : ''  }  eventtype="jump" onClick={ () => { location = '/modal/risk' } }>查看《风险提示函》</a></p>
            </div>
        )
    }
}