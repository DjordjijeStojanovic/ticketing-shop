import buildClient from "../api/buildClient";

const Main = ({ user }) => {
    console.log(user);
    return (
        <>
            <h1>Main</h1>
            
        </>
    )
};

Main.getInitialProps = async (ctx) => {
    const client = buildClient(ctx);
    const { data } = await client.get('/api/users/me');
    return data;
}

export default Main;