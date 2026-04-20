import { useState } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/useRequest';

const Signin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { handleRequest, errors } = useRequest({ 
        url: '/api/users/signin',
        method: 'post',
        reqBody: { email, password },
        onSuccess: () => Router.push('/')
    });

    const onSubmit = async (event) => {
        event.preventDefault();
        handleRequest();
    }

    return (
        <>
            <form onSubmit={onSubmit}>
                <h1>Sign in!</h1>
                <div className='form-group'>
                    <label>Email Address</label>
                    <input value={email} onChange={(e) => {
                        return setEmail(e.target.value);
                    }} className='form-control' />
                </div>
                <div className='form-group'>
                    <label>Password</label>
                    <input value={password} onChange={(e) => {
                        return setPassword(e.target.value)
                    }} type='password' className='form-control' />
                </div>
                {errors}
                <button className='btn btn-primary'>Sign in!</button>
            </form>
        </>
    )
}

export default Signin;