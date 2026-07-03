const OrderIndex = ({ orders }) => {
    return (
        <>
            <h1>Your Orders</h1>
            <h3>This is a list of your orders:</h3>
            <ul>
                {orders.map(order => {
                    return (
                        <div className="container ">
                            Order
                            <li key={order.id}>
                                Ticket: {order.ticket.title}
                                <br />
                                Status: {order.status}
                            </li>
                        </div>
                    )
                })}
            </ul>
        </>
    )
};

OrderIndex.getInitialProps = async (ctx, client) => {
    const { data } = await client.get('/api/orders');
    return { orders: data };
};

export default OrderIndex;