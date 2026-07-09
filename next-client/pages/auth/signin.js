import { useState } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/useRequest';
import styles from '../../styles/auth.module.css';
import CustomForm from '../../components/customForm';
import Link from 'next/link';

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
            <CustomForm
                cssClasses={styles}
                heading='Sign in'
                submitLabel='Sign In'
                errors={errors}
                onSubmit={onSubmit}
                inputFields={[
                    { value: email, placeholder: 'Email', onChange: (event) => setEmail(event.target.value) },
                    { value: password, placeholder: 'Password', onChange: (event) => setPassword(event.target.value) }
                ]}>
                <div className={styles.signUpReminder}>
                    Need an account?
                    <Link
                        href='/auth/signup'
                        className={styles.signUpLink}> Create it here.</Link>
                </div>
            </CustomForm>
        </>
    )
}

Signin.getInitialProps = async (ctx, client, user) => {
    if (user) {
        if (ctx.req) {
            ctx.res.writeHead(302, { Location: '/' });
            ctx.res.end();
        } else {
            Router.push('/');
        }
    }
}

export default Signin;