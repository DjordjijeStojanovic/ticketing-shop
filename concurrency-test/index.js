process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

import axios from "axios";

const server = 'https://ticket-shop.docker/api/'

const handleAuth = async () => {
    const response = await axios.post(`${server}users/signup`, {
        "email": "concurrency1@test.com",
        "password": "1234"
    });
    console.log('Auth configured');
    return response.headers.getSetCookie();
}

const cookie = await handleAuth();

const handleRequest = async () => {
    const { data } = await axios.post(`${server}tickets`, {
        title: 'Concurrency test',
        price: 10.0
    }, {
        headers: {
            cookie
        }
    });

    await axios.put(`${server}tickets/${data.ticket.id}`, {
        title: 'Changed title',
        price: 20.0
    }, {
        headers: {
            cookie
        }
    });

    await axios.put(`${server}tickets/${data.ticket.id}`, {
        title: 'Changed title',
        price: 25.0
    }, {
        headers: {
            cookie
        }
    });

    console.log('Concurrency script executed');
}

(async () => {
    for (let i = 0; i < 400.; i++) {
        handleRequest();
    }
})();

