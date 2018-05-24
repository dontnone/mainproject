import React, { Component } from 'react'
import Template from './index'
import Head from 'next/head'
import Header from '../../components/header/index'

export default class extends Component {
    constructor(props) {
        super(props)
        this.state = {
            status: '1'
        }
    }
    componentDidMount() {
        
    }
    echange = key => () => {
        this.setState({
            status: key
        })
    }
    render() {
        return (
            <div>
                <Head>
                    <link rel='stylesheet' type='text/css' href="/static/mods/home/_.css" />
                </Head>
                <div>
                    <div className="security-box position-a">
                        <Header title="安全保障" />
                        <div className="security-container position-a">
                            <ul className="tab-wrapper">
                                <li onClick={ this.echange('1') } className={ this.state.status == '1' ? 'tab-link tab-link-act' : 'tab-link' }><a>账户安全保障</a></li>
                                <li onClick={ this.echange('2') } className={ this.state.status == '2' ? 'tab-link tab-link-act' : 'tab-link' }><a>风险控制体系</a></li>
                                <li onClick={ this.echange('3') } className={ this.state.status == '3' ? 'tab-link tab-link-act' : 'tab-link' }><a>平台合法合规</a></li>
                            </ul>
                    
                            <div className="contain-wrap">
                                <div className={ this.state.status == '1' ? 'tab-contain part1 block' : 'tab-contain part1' }></div>
                                <div className={ this.state.status == '2' ? 'tab-contain part2 block' : 'tab-contain part2' }></div>
                                <div className={ this.state.status == '3' ? 'tab-contain part3 block' : 'tab-contain part3' }></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}