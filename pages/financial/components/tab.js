import React, { Component } from 'react'

export default class extends Component {
    constructor(props) {
        super(props)
        this.state = {
            show: this.props.show
        }
    }
    change = () => {
        this.setState({
            show: !this.state.show
        })
    }
    render() {
        return (
            <li>
                <p  onClick={ this.change } className="content-tit dmp-click" dev_id={ this.props.dev_id } eventtype={ this.state.show ? this.props.eventtype : this.props.eventtypehide }><span className="dmp-click" dev_id={ this.props.dev_id } eventtype={ this.state.show ? this.props.eventtype : this.props.eventtypehide }>{ this.props.title }</span><span className={ this.state.show ? 'arrow-right show dmp-click' : 'arrow-right dmp-click' } dev_id={ this.props.dev_id } eventtype={ this.state.show ? this.props.eventtype : this.props.eventtypehide }>{ this.state.show ? '收起' : '展开' }</span></p>
                <div className={ this.state.show ? 'content show' : 'content' }>{ this.props.children }</div>
            </li>
        )
    }
}