import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Duitang from './Duitang'
import WaterWall from './water-wall-component/index'

class App extends Component {
  constructor(props){
    super(props)
    this.state = {store:[]}
  }

  componentDidMount(){
    fetch('/api/getData').then(response => response.json()).then(data => this.setState({store:data.data}))
  }
  addData = () => {
    fetch('/api/getData').then(response => response.json()).then(data => {
      var store = this.state.store
      store =  store.concat(data.data)
      console.log(store)
      this.setState({store:store})
    })
  }
  render() {

    return (
        <div className="App">
        <div>heheheheh</div>
        <WaterWall store={this.state.store} column={4} item={Duitang} >
        </WaterWall>
        <div style={{position:'fixed', bottom: '10px'}} onClick={this.addData} >add</div>
      </div>
    );

  }
}

export default App;
