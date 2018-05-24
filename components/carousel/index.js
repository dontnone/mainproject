import React, { Component } from 'react'
import { Carousel } from 'antd-mobile'

export default class extends Component {
    imgUrl = url => () => {
        location = url || '/home'
    }
    render() {
        return (
            <Carousel
                className="my-carousel"
                infinite
                autoplay={true}
                selectedIndex={1}
                swipeSpeed={35}
            >   
                {this.props.data.map(ii => (
                    <a onClick={ this.imgUrl(ii.url) } key={ii}>
                        <img className="block dmp-click" dev_id={"A2.1-2-" + JSON.stringify(ii) } eventtype="jump" src={ ii.imageUrl } alt="" />
                    </a>
                ))}
            </Carousel>
        )
    }
}