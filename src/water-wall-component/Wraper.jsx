import React, {createElement} from 'react'


const Wraper = props => {
    const {style, item, data} = props
    const child = createElement(item, data)
    return(<div style={style}>
        {child}
    </div>)

}
export default Wraper
