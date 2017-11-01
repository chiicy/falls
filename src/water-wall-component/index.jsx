import React, {Component, Children} from 'react'
import {render, unmountComponentAtNode} from 'react-dom'
import PropTypes from 'prop-types'
import Wraper from './Wraper'
import PreWraper from './PreWraper'

class WaterWall extends Component{

    constructor(props){
        super(props)
        this.componentsCache = []
        this.componentBatch = []
        this.height = 0
        this.currentColumn = 0
        this.columnPosition = []
        this.preStoreLen = 0
        this.currentStoreLen = 0
        this.pre = true
        this.top = 0
        this.state={topIndex:0, bottomIndex:0}
        const columnsNum = this.props.column
        for(var i = 0;i < columnsNum; i ++){
            this.columnPosition[i] = {column: i, top: 0}
        }
    }


    componentWillUpdate(nextProps, nextState, nextContext){
        if(nextProps.store.length===this.props.store.length){
            this.pre = false
            return
        }
        this.preStoreLen = this.props.store.length
        this.currentStoreLen = nextProps.store.length
        this.pre = true
    }
    componentDidUpdate(){

    }
    componentDidMount(){
        window.onscroll = this.extractScreenAble
        this.top = this.container.offsetTop
        console.log(this)
        console.log(this.container)
    }
    preRenderChildren(){
        const {preStoreLen, currentStoreLen} = this
        if(!currentStoreLen) return
        if(!this.pre) return
        const {store, column, item} = this.props
        const preStore = this.props.store
        const width = this.container.clientWidth / column
        const items = []
        let j = 0
        for(let i = preStoreLen; i < currentStoreLen ;i++){
            items[j] = <PreWraper key = {i} index={i} width={width}  getRect={this.getRect} item ={item} data={store[i]}/>
            j++
        }
        this.pre = false
        return items
    }
    renderChildren(){
        if(!this.currentStoreLen) return
        if(this.pre) return
        const items = []
        console.log(this.state.topIndex, this.state.bottomIndex)
        for(let i = this.state.topIndex; i <= this.state.bottomIndex; i++){
            const item = this.componentsCache[i]
            const data = this.props.store[item.index]
            const child =  <Wraper key={i} item={this.props.item}  style={{position:'absolute',left:item.left,top:this.top + item.top,width:item.width,height:item.height }} data={data}></Wraper>
            items.push(child)
        }
        return items
    }

    positionChild(){
        const {column} = this.props
        const {componentBatch, columnPosition} = this
        const width = this.container.clientWidth / column
        componentBatch.sort((pre, next) => {
            return next.height - pre.height
        })

       this.sortColumnPosition()

       for(var i = 0; i < componentBatch.length; i ++){
            const index = i % column

            componentBatch[i].top = columnPosition[index].top
            columnPosition[index].top += componentBatch[i].height
            componentBatch[i].left = columnPosition[index].column * width
            if(index + 1 === column){
                this.sortColumnPosition()
            }
        }
        this.componentsCache = this.componentsCache.concat(componentBatch)
        console.log(this.componentsCache)
        this.sortColumnPosition()


        this.height = this.columnPosition[column - 1].top
        console.log(this)
        /* this.cp.style.height = this.height + 'px'*/
        this.container.style.height = this.height + 'px'
        /*         this.container.style.height = this.height+'px'*/
        this.componentBatch = []

        this.extractScreenAble()
    }


    extractScreenAble = ()=>{
        let topOffset = this.props.topOffset || 1000
        let bottomOffset = this.props.bottomOffset || 1000

        const rect = this.container.getBoundingClientRect()
        const top = this.top - topOffset - rect.top
        const bottom = this.top + window.innerHeight +  bottomOffset - rect.top

        const {column} = this.props
        let rowNum = parseInt(this.componentsCache.length / this.props.column)

        let topIndex = this.search(top , 0, rowNum - 1, column)

        let bottomIndex = this.search(bottom, 0, rowNum - 1, column)
        console.log(topIndex, bottomIndex)
        this.setState({topIndex: topIndex * column, bottomIndex: bottomIndex * column})

    }

    search(value, start, end, column){
        const index = parseInt((end + start) / 2)
        const extract = this.componentsCache[index * column]
        if(end === start + 1) return
        if(value >=  extract.top && value <= extract.top + extract.height) {
            return index
        }else if(value < extract.top){
            if(start + 1 === index) return start
            return this.search(value, start, index, column)
        }else if(value > extract.top + extract.height){
            if(index + 1 === end) return end
            return this.search(value, index, end, column)
        }
    }
    getRect = (childWidth, childHeight, i) => {
        const {preStoreLen, currentStoreLen} = this

        this.componentBatch.push({index:i, width:childWidth, height:childHeight})
        if(i === currentStoreLen - 1){
            this.positionChild()
        }

    }

    sortColumnPosition(){
        this.columnPosition.sort((pre, next) => {
            return pre.top - next.top
        })
    }
    render(){
               return(
            <div ref={cp => this.cp = cp }>
                <div onScroll={this.extractScreenAble}  ref={container => this.container = container}>
                    {this.renderChildren()}
                </div>
                <div id="chi_pre" style={{display:'block', transform:'translateX(-100%)'}} ref={preContainer => this.preContainer = preContainer }>
                    {this.preRenderChildren()}
                </div>
            </div>
        )
    }
}

WaterWall.propTypes = {
    store: PropTypes.array,
    column: PropTypes.number,
    topOffset: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    bottomOffset: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ])
}

export default WaterWall
