import axios from "axios";

export class CodeService {
    static postCode(code){
        let header = {
            "Content-Type": "application/json",
        };

        axios.post('localhost:8888/code', {
            code : code
        }).catch(error => console.log(error))

    }


    static test(){
        let header = {
            "Content-Type": "application/json",
        };
        return axios.post('localhost:8888/products/1');
    }

    static getCode(callback){
        let header = {
            "Content-Type": "application/json",
        };
        axios.get('localhost:8888/code', {headers: header})
            .then(response => callback(response))
            .catch(error => console.log(error))
    }
}