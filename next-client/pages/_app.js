import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/buildClient';
import Header from '../components/header';


const AppComponent = ({ Component, pageProps, user }) => {
    return (
        <>
            <Header user={user}/>
            <Component {...pageProps}></Component>
        </>
    )
};

AppComponent.getInitialProps = async (appCtx) => {
    console.log(appCtx);
    const client = buildClient(appCtx.ctx);
    const { data } = await client.get('/api/users/me');
    let renderedComponentProps = {};
    if(appCtx.Component.getInitialProps) {
        renderedComponentProps = await appCtx.Component.getInitialProps(appCtx.ctx);
    }
    console.log(renderedComponentProps);
    return {
        pageProps: renderedComponentProps,
        ...data
    };
}

export default AppComponent;