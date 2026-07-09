import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/buildClient';
import Header from '../components/header';
import '../styles/global.css'

const AppComponent = ({ Component, pageProps, user }) => {
    return (
        <>
            <Header key={user?.id} user={user} />
            <div className='container'>
                <Component {...pageProps} user={user}></Component>
            </div>
        </>
    )
};

AppComponent.getInitialProps = async (appCtx) => {
    const client = buildClient(appCtx.ctx);
    const { data } = await client.get('/api/users/me');

    let renderedComponentProps = {};

    if (appCtx.Component.getInitialProps) {
        renderedComponentProps = await appCtx.Component.getInitialProps(appCtx.ctx, client, data.user);
    }
    return {
        pageProps: renderedComponentProps,
        ...data
    };
}

export default AppComponent;