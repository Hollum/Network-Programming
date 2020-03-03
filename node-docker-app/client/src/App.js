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
            output: ""
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        CodeService.test()
            .then(res => console.log(res.data))
            .catch(rej => console.log(rej));
    }

    handleChange(event) {
        this.setState({output: event.target.value});
    }

    handleSubmit(event) {
        alert('A name was submitted: ' + this.state.output);
        event.preventDefault();
    }
    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="code">Skriv inn C++ kode her</label>
                        <textarea className="form-control" id="code" rows="8" value={this.state.output} onChange={this.handleChange}></textarea>
                        <input type="submit" value="Submit"/>
                    </div>
                </form>
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
