import axios from "axios";

export class CodeService {
    static sendInput(code){
        return axios.post('http://localhost:8888/run/code', {input : code});
    }

}