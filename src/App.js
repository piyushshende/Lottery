import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import web3 from './web3';
import lottery from './lottery';
class App extends Component {
  constructor(props){
   super(props);
    this.state = {
        manager: '',
        players: [],
        balance: '',
        value: '',
        message:''
    }
    this.onSubmit = this.onSubmit.bind(this);
  }
    async componentDidMount() {
        window.ethereum.enable();
        const manager = await lottery.methods.manager().call();
        const players = await lottery.methods.getPlayers().call();
        const balance = await web3.eth.getBalance(lottery.options.address);
        this.setState({
            manager: manager,
            players: players,
            balance: balance
        });
    }
    onSubmit = async event => {
        event.preventDefault();
        const accounts = await web3.eth.getAccounts();
        this.setState({message:'Waiting for Transaction...'});
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei(this.state.value, 'ether')
        });
        this.setState({message: 'Transaction is successful'});
    };
    onClick = async ()=>{
        const accounts = await web3.eth.getAccounts();
        this.setState({message:'Picking up a winner...'});
        await lottery.methods.pickWinner().send({
            from: accounts[0]
        });
        this.setState({message: 'A winner has been picked'});
    }
    render() {
        return ( 
            <div>
            
            <h1 > Lottery contract </h1> 
            <p> This contract is managed by { this.state.manager }.There are currently { this.state.players.length }
             people entered,
            competing to win { web3.utils.fromWei(this.state.balance, 'ether') }
             ether. 
            </p> 
            <hr/>
            
            <form onSubmit = { this.onSubmit } >
            
            <h2>Want to try your luck </h2> 
            <div >
            
            <label > Amount of Ether to enter </label> 
            <input value = { this.state.value }
            onChange = { event => this.setState({ value: event.target.value }) }
            /> 
            </div> 
            <button> Submit </button> 
            </form> 
            <hr/>
            <h1>{this.state.message}</h1>
                <h2>Ready to pick a winner</h2>
                <button onClick={this.onClick}>Pick a winner</button>
            <hr/>
            </div>
        );
    }
}

export default App;