import React, { Component } from "react";
import Head from "next/head";
import Header from "../../../components/header/index";
import Api from "../../../components/api/purse";
import { desensitization, spaceJoin } from "../../../common/Util";
import bankConfig from "../../../common/bankConfig";

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userAccounts: {},
      userName: "",
      idCode: "",
      bankCardName: "",
      bankCardNumber: "",
      bankImg: "",
      bankImgBg: "",
      carInit: 0
    };
  }
  async componentDidMount() {
    const res = await Api.userAccounts();
    const cardStatus = await Api.rechargeInit();
    for (let i = 0; i < bankConfig.length; i++) {
      if (res.bankCardCode == bankConfig[i].bankCardCode) {
        this.setState({
          bankImg: bankConfig[i].bankCardImg,
          bankImgBg: bankConfig[i].bankCardImgBg
        });
      }
    }
    this.setState({
      userAccounts: res,
      userName: res.userName,
      idCode: desensitization(res.userIdCard),
      bankCardName: res.bankCardName,
      bankCardNumber: spaceJoin(res.bankCardNumber),
      carInit: cardStatus.cardStatus
    });
  }
  render() {
    const { userAccounts } = this.state;
    return (
      <div>
        <Head>
          <link
            rel="stylesheet"
            type="text/css"
            href="/static/mods/mypurse/openaccount/_.css"
          />
        </Head>
        <div className="account-box">
          <Header title="银行存管开户" />
          <div className="identity-review-container account-container">
            <div className="div-input-wrapper">
              <span className="input-left">姓名</span>
              <input type="text" value={this.state.userName} disabled />
            </div>
            <div className="div-input-wrapper">
              <span className="input-left">身份证号</span>
              <input type="text" value={this.state.idCode} disabled />
            </div>

            <div className="card-wrapper">
              <div className="bank-card-border clearfix">
                <div className="zIndex-wrapper">
                  <div className="bank-logo">
                    <img
                      src={
                        this.state.bankImg ||
                        "/static/html/openaccount/imgs/xin.png"
                      }
                    />
                  </div>
                  <div className="bank-card">
                    <p className="bank-name">
                      {this.state.bankCardName}
                      <span className="card-status">
                        {this.state.carInit == "1" ? "(换卡申请中)" : ""}
                      </span>
                    </p>
                    <p className="bank-card-number">
                      {this.state.bankCardNumber}
                    </p>
                  </div>
                </div>
                <img
                  src={this.state.bankImgBg || ""}
                  alt=""
                  className="bank-bg position-a"
                />
              </div>
              <p className="bank-card-tips">
                <span>*</span>如需更换银行卡，请至新新贷官网操作
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
