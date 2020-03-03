import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {CodeService} from "./service/codeService";


export class Input extends Component{
    constructor(props) {
        super(props);
        this.state = {
            input: "",
            output: ""
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

   /*
    componentDidMount() {
        CodeService.getOutput()
            .then(res => this.setState({output: res.data.output}))
            .catch(rej => console.log(rej));
    }

    */
    handleChange(event) {
        this.setState({input: event.target.value});
    }

    handleSubmit(event) {
        CodeService.sendInput(this.state.input)
            .then(res => this.setState({output: res.data.output}))
            .catch(rej => console.log(rej));
        event.preventDefault();
    }
    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="code">Skriv inn C++ kode her</label>
                        <textarea className="form-control" id="code" rows="8" value={this.state.input} onChange={this.handleChange}></textarea>
                        <input type="submit" value="Submit"/>
                    </div>
                </form>
                <h1>{this.state.output}</h1>
            </div>

        );
    }

}

export class Output extends Component{
    constructor(props) {
        super(props);
        this.state = {
            output: ""
        }
    }
}

function App() {
  return (
   <Container>
       <Input/>
   </Container>
  );
}

export default App;
