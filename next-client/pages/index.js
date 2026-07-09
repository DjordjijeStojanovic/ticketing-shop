import Link from "next/link";
import { Button } from 'react-bootstrap';
import styles from '../styles/index.module.css'
import Modal from '../components/modal';
import { useState } from "react";
import NewTicket from "./tickets/new"; 

const Main = ({ user, tickets }) => {
    const [showModal, setShowModal] = useState(false);

    const ticketList = tickets.map((ticket) => (
        <div className={styles.cardDiv}>
            <h3 className={styles.cardTitle}>{ticket.title}</h3>
            <h4 className={styles.cardPrice}>Price: ${ticket.price}</h4>
            <Button className={styles.submitBtn}>
                <Link
                    className={styles.linkNav}
                    href='/tickets/[ticketId]'
                    as={`/tickets/${ticket.id}`}>View</Link>
            </Button>
        </div>
    )); 

    if (!tickets.length) {
        return (
            <>
                <div className={`container ${styles.mainContainer}`}>
                    <h1 className={styles.indexHeader}>No active tickets at the moment. <br />Be the first one to create it!</h1>
                    <Button className={styles.submitBtn} onClick={() => setShowModal(true)}>Create a new ticket</Button>
                    <Modal
                        show={showModal}
                        onClose={() => setShowModal(false)}
                        onSubmit={() => setShowModal(false)}
                        title='Craft a ticket'>
                        <NewTicket 
                            onSuccess={() => setShowModal(false)} />
                    </Modal>
                </div>
            </>
        )
    }

    return (
        <>
            <h1 className={styles.cardsH1}>Available Tickets</h1>
            <section className="table">
                <div className={styles.cardNav}>
                    {ticketList}
                </div>
            </section>
            <Modal
                show={showModal}
                onClose={() => setShowModal(false)}
                onSubmit={() => setShowModal(false)}
                title='Craft a ticket'>
                <NewTicket 
                    onSuccess={() => setShowModal(false)} />
            </Modal>
        </>
    )
};

Main.getInitialProps = async (ctx, client, user) => {
    const { data } = await client.get('/api/tickets');
    return { tickets: data };
}

export default Main;