import { useState } from "react";
import useRequest from "../../hooks/useRequest";
import styles from '../../styles/ticketNew.module.css'
import CustomForm from "../../components/customForm";
import Router from "next/router";

const NewTicket = ({ onSuccess = () => Router.push('/') }) => {
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');

    const onBlur = () => {
        const value = parseFloat(price);

        if(isNaN(value)) {
            return;
        }

        setPrice(value.toFixed(2));
    };

    const { handleRequest, errors } = useRequest({
        url: '/api/tickets',
        method: 'post',
        reqBody: { title, price },
        onSuccess: () => onSuccess?.()
    });

    const onSubmit = (event) => {
        event.preventDefault();
        handleRequest();
    }

    return (
        <>
            <CustomForm 
                cssClasses={styles} 
                heading='Create a ticket' 
                onSubmit={onSubmit} 
                submitLabel='Submit' 
                errors={errors} 
                inputFields={[
                    { value: title, placeholder: 'Title', onChange: (event) => setTitle(event.target.value) },
                    { value: price, placeholder: 'Price', onBlur: onBlur, onChange: (event) => setPrice(event.target.value) }
                ]}/>
        </>
    )
}

export default NewTicket;