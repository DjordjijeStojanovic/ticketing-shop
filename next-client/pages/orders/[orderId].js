import { useEffect, useState } from "react";
import useRequest from "../../hooks/useRequest";

const OrderShow = ({ order, user }) => {
    const msLeft = new Date(order.expiresAt) - new Date();
    const [timeLeft, setTimeLeft] = useState(0);

    const { handleRequest, errors } = useRequest({
        url: '/api/payments',
        method: 'post',
        reqBody: { orderId: order.id },
        onSuccess: ({ url }) => {
            window.location.href = url;
        }
    });

    useEffect(() => {
        const findTimeLeft = () => {
            const msLeft = new Date(order.expiresAt) - new Date();
            setTimeLeft(Math.round(msLeft / 1000));
        }

        findTimeLeft();
        const timerId = setInterval(findTimeLeft, 1000);

        return () => {
            clearInterval(timerId);
        }
    }, []);

    if(order.status === 'completed') {
        return (
            <>
                <h1>Congratulations on your purchase! The payment went through</h1>
            </>
        );
    }

    if(timeLeft < 1) {
        return (
            <>
                <h1>The 60 seconds have passed and the ticket you were trying to purchase got unlocked.</h1>
            </>
        )
    }

    return (
        <>
            <h1>You're about to place an order.</h1>
            <h2>To ensure fairness for all the visitors, please know that you have {timeLeft} seconds left to finalize a purchase.</h2>
            <button className="btn btn-primaryT" onClick={handleRequest}>
                Purchase
            </button>
            {errors}
        </>
    )
};

OrderShow.getInitialProps = async (ctx, client) => {
    const { orderId } = ctx.query;
    const { data } = await client.get(`/api/orders/${orderId}`);
    return { order: data };
};

export default OrderShow;