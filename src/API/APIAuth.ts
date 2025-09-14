import axios from "axios";

const APIAuth = axios.create({
  baseURL: "http://localhost:3000/api", 

});

export default APIAuth;