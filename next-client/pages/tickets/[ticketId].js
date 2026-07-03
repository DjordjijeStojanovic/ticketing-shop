import useRequest from "../../hooks/useRequest";
import Router from 'next/router';

const TicketShow = ({ ticket }) => {
    const { handleRequest, errors } = useRequest({
        url: '/api/orders',
        method: 'post',
        reqBody: {
            ticketId: ticket.ticket.id
        },
        onSuccess: (order) => Router.push('/orders/[orderId]', `/orders/${order.order.id}`)
    });

    return (
        <>
            <div className="container">
                <h1>Ticket</h1>
                <h3>Name:</h3>
                <p>{ticket.ticket.title}</p>
                <h3>Price:</h3>
                <p>{ticket.ticket.price}</p>
                {errors}
                <button
                    className="btn btn-primary"
                    onClick={handleRequest}>
                    Purchase
                </button>
            </div>
        </>
    )
};

TicketShow.getInitialProps = async (ctx, client) => {
    const { ticketId } = ctx.query;
    const { data } = await client.get(`/api/tickets/${ticketId}`);

    return { ticket: data };
};

export default TicketShow;