import React, {PureComponent, createElement} from 'react'


class PreWraper extends PureComponent{

    componentDidMount(){
        if(this.props.getRect){
            const rect = this.wraper.getBoundingClientRect()
            this.props.getRect(rect.width, rect.height, this.props.index)
        }
    }

    render(){
        const {width, children, item, data} = this.props
        const height = width/data.dimensions.width * data.dimensions.height
        data.dimensions={height:height,width:width}
        const child = createElement(item, data)
        return(<div ref={ wraper => this.wraper = wraper } style={{width:width}}>
          {child}
        </div>)
    }
}
export default PreWraper
