import React, { Component } from 'react'

export default class extends Component {
    constructor(props) {
        super(props)
        this.state = {
            show: this.props.show
        }
    }
    changeShowHide = async () => {
        const upIcon = document.querySelectorAll('.up-icon')
        const downShow = document.querySelectorAll('.show')
        for(let i=0; i<upIcon.length; i++){
            upIcon[i].className = 'arrow-down-icon'
        }
        for(let j=0; j<downShow.length; j++){
            downShow[j].className = 'answer'
        }
        await this.props.hideShow()
        await this.setState({
            show: false
        })
        this.setState({
            show: !this.state.show
        })
    }
    render() {
        return (
            <li className="question">
                <p onClick={ this.changeShowHide }>
                    <span className="txt">{ this.props.title }</span>
                    <i className={ this.state.show ? 'arrow-down-icon up-icon' : 'arrow-down-icon' }></i>
                </p>
                <div className={ this.state.show ? 'answer show' : 'answer' }>
                    { this.props.children }
                </div>
            </li>
        )
    }
}