import axios from "axios";

const buildClient = ({ req }) => {
    if(typeof window === 'undefined') {
        return axios.create({
            baseURL: 'https://ticketing-shop-staging.xyz/',
            headers: req.headers
        });
    } else {
        return axios.create({
            //This is a client side fallback, so headers will be applied automatically
            baseURL: '/'
        })
    }
};

export default buildClient;