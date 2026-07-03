import Link from "next/link";

const Main = ({ user, tickets }) => {
    const ticketList = tickets.map((ticket) => (
        <tr key={ticket.id}>
            <td>{ticket.title}</td>
            <td>{ticket.price}</td>
            <td>
                <Link href='/tickets/[ticketId]' as={`/tickets/${ticket.id}`}>
                    View
                </Link>
            </td>
        </tr>
    ));

    if (!tickets.length) {
        return (
            <>
                <div className="container">
                    <h1>No active tickets at the moment. Be the first one to create it!</h1>
                    <button type="submit" className="btn btn-primary">
                        <Link href="/tickets/new" style={{ color: 'white', textDecoration: 'none' }}>Create a Ticket</Link>
                    </button>
                </div>
            </>
        )
    }

    return (
        <>
            <h1>Tickets</h1>
            <table className="table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Price</th>
                        <th>Link</th>
                    </tr>
                </thead>
                <tbody>
                    {ticketList}
                </tbody>
            </table>
            <button type="submit" className="btn btn-primary">
                <Link href="/tickets/new" style={{ color: 'white', textDecoration: 'none' }}>Create a Ticket</Link>
            </button>
        </>
    )
};

Main.getInitialProps = async (ctx, client, user) => {
    const { data } = await client.get('/api/tickets');
    return { tickets: data };
}

export default Main;