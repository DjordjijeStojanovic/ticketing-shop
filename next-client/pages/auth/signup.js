import { useState } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/useRequest';
import styles from '../../styles/auth.module.css';
import CustomForm from '../../components/customForm';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { handleRequest, errors } = useRequest({
        url: '/api/users/signup',
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
            <CustomForm 
                cssClasses={styles}
                onSubmit={onSubmit}
                submitLabel='Sign up'
                heading='Sign Up'
                errors={errors}
                inputFields={[
                    { value: email, placeholder: 'Email', onChange: (event) => setEmail(event.target.value) },
                    { value: password, placeholder: 'Password', type: 'password', onChange: (event) => setPassword(event.target.value) }
                ]}/>
        </>
    )
}

export default Signup;