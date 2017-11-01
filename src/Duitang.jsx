import React, {PureComponent} from 'react'


/* const Duitang = (props) => {
 *     return <div style={{width:'100%'}}>
 *         <img style={{width:'100%',background:'#f5f5f5'}} src={'http://localhost:8888/' + props.img } />
 *         <p>say: {props.value}</p>
 *     </div>
 * }*/
class Duitang extends PureComponent{

    render(){
        return <div style={{width:'100%'}}>
            <img width={this.props.dimensions.width} height={this.props.dimensions.height} style={{background:'#f5f5f5'}} src={'http://localhost:8886/' + this.props.img } />
            <p>say: {this.props.value}</p>
        </div>
    }
}
export default Duitang
