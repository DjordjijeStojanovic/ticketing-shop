import useRequest from '../../hooks/useRequest';
import { useEffect } from 'react';
import Router from 'next/router';

const Signout = () => {
    const { handleRequest, errors } = useRequest({
        url: '/api/users/signout',
        method: 'post',
        reqBody: {},
        onSuccess: () => Router.push('/')
    });

    useEffect(() => {
        handleRequest();
    }, []);
};

export default Signout;