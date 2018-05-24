import React, { Component } from 'react'
import Head from 'next/head'
import Header from '../../../components/header/index'
import Tab from './components/tab'
import HomeIco from '../../financial/components/homeico'

export default class extends Component {
    constructor(props) {
        super(props)
        this.state = {
            show: false
        }
    }
    hideShow = async () => {
        await this.setState({
            show: false
        })
    }
    render() {
        return (
            <div>
                <Head>
                    <link rel='stylesheet' type='text/css' href="/static/mods/mypurse/helpcenter/_.css" />
                </Head>
                <div className="xxb-box position-a">
                    <Header title="帮助中心" dmp={ true } dev_id="D7.1-1" eventtype="jump" />
                    <div className="help-container position-a">
                        <div className="tab-content">
                            <div className="list-content">
                                <p className="list-tit">常见问题</p>
                                <ul>
                                    <Tab title="什么是银行存管？" show={ this.state.show || true } hideShow={ this.hideShow }>
                                        银行存管是指P2P平台不直接经手客户资金，出借人出借成功后，资金将直接进入借款人对应的银行存管账户，资金的流通和结算被严格区隔，避免平台自建“资金池”，实现资金全存管。
                                    </Tab>
                                    <Tab title="为什么要开通银行存管，有什么用？" show={ this.state.show } hideShow={ this.hideShow }>
                                        1.	对接银行存管后，实现了平台与用户资金有效隔离，资金交易环节均在银行系统中进行，资金划转均由用户授权操作，平台无法触碰。<br />
                                        2.	银行全面监督，用户资金流向透明。<br />
                                        3.	真正符合了监管要求，挪用、资金池、卷款跑路等顾虑不复存在。
                                    </Tab>
                                    <Tab title="账号被锁定怎么办？" show={ this.state.show } hideShow={ this.hideShow }>
                                        为了更好的保障用户账户安全，当账户登录密码输入错误5次会被锁定，24小时后会自动解锁。如急需使用账户，请联系客服并提供手持本人身份证正面照片申请进行解锁。
                                    </Tab>
                                    <Tab title="为什么账户有可用余额但不能提现？" show={ this.state.show } hideShow={ this.hideShow }>
                                        分为两种情况：<br />
                                        1.	账户信息不完善：为了保障账户安全，提现前需通过手机和实名认证并开通银行存管账户。<br />
                                        2.	账户可用余额不足5元：提现时单笔提现金额必须大于5元。
                                    </Tab>
                                    <Tab title="新新币是什么？" show={ this.state.show } hideShow={ this.hideShow }>
                                        新新币是新新贷网站的一种虚拟币。新新币兑换人民币的比例为50:1，即50个新新币可兑换1元人民币。目前新新币的获取渠道为新新贷平台不定期推出的各项权益活动，详情见活动说明。
                                    </Tab>
                                    <Tab title="网上银行已经扣款，但新新贷账户余额没有增加？" show={ this.state.show } hideShow={ this.hideShow }>
                                        这是因为银行的数据没有即时传输给我们，我们会在第二个工作日与银行对账后给予确认，请再耐心等待一下。
                                    </Tab>
                                    <Tab title="在官网和手机端充值有区别吗？区别是什么？" show={ this.state.show } hideShow={ this.hideShow }>
                                        新新贷官网支持快捷充值和网银充值两种方式，手机端仅支持快捷充值。一般来说，快捷支付上限充值额度有限制，且每个银行的限额不一样。而网银充值一般额度很高，适合大额充值。
                                    </Tab>
                                </ul>
                            </div>
                            <div className="list-content">
                                <p className="list-tit">注册认证</p>
                                <ul>
                                    <Tab title="密码丢失该怎样找回？" show={ this.state.show } hideShow={ this.hideShow }>
                                        您可以在PC或APP通过找回密码收取手机验证码进行密码找回、重置。如手机未绑定或手机丢失、注销等，则需要手持身份证与客服进行视频认证方可重置密码。重置后客服会将新密码给予您。
                                    </Tab>
                                    <Tab title="手机号码怎样解绑和更换？" show={ this.state.show } hideShow={ this.hideShow }>
                                        如果您的老手机号还在用，可以在PC和APP中通过验证码更换绑定手机。如果您的老手机号或注销不用了，在账户有实名制的情况下，需要手持身份证与客服进行视频认证即可解绑。在没有实名制的情况下还需要提供运营商的账号证明自己身份。
                                    </Tab>
                                    <Tab title="注册时手机收不到验证码怎么办？" show={ this.state.show } hideShow={ this.hideShow }>
                                        1.	确认短信是否被手机软件拦截或过滤；<br />
                                        2.	确认手机是否能正常接收短信（信号问题、欠费、停机等）；<br />
                                        3.	短信收发过程中可能会有延时，请耐心等候；<br />
                                        4.	可以点击获取语音验证码，或直接联系客服为您服务。<br />
                                    </Tab>
                                </ul>
                            </div>
                            <div className="list-content">
                                <p className="list-tit">充值提现</p>
                                <ul>
                                    <Tab title="关于充值" show={ this.state.show } hideShow={ this.hideShow }>
                                        充值一般实时到账，用户在开通上海华瑞银行存管账户后，可以通过PC官网、移动端进行充值。充值免收手续费。
                                    </Tab>
                                    <Tab title="提现什么时候到账？" show={ this.state.show } hideShow={ this.hideShow }>
                                        如需提现，请至PC官网及APP进行操作。提现到账时间：0-3个工作日，最快当日到账（遇双休日或法定节假日顺延到下一个工作日处理）。用户资金到账具体时间视银行结算时间而定。如果有任何提现问题，请联系客服4000-169-521（9:00-18:00工作日）。
                                    </Tab>
                                    <Tab title="怎样修改绑定的银行卡？" show={ this.state.show } hideShow={ this.hideShow }>
                                        登录PC官网，进入我的新新贷，选择左侧菜单【个人资料—银行设置】，点击【更换】按钮，填写相关资料等待审核。
                                    </Tab>
                                </ul>
                            </div>
                            <div className="list-content">
                                <p className="list-tit">安全保障</p>
                                <ul>
                                    <Tab title="实名认证银行卡" show={ this.state.show } hideShow={ this.hideShow }>
                                        新新贷的所有账户交易前，都必须通过实名认证，用户真实身份被核实无误之后才能进行出借。
                                    </Tab>
                                    <Tab title="个人账户资金安全保障" show={ this.state.show } hideShow={ this.hideShow }>
                                        新新贷对接银行存管后，实现了平台与用户资金有效隔离，资金交易环节均在银行系统中进行，资金划转均由用户授权操作，平台无法触碰，挪用、资金池、卷款跑路等顾虑不复存在。
                                    </Tab>
                                </ul>
                            </div>
                            <HomeIco dev_id="D7.1-2" />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}