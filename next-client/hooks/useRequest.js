import axios from 'axios';
import { useState } from 'react';
import Router from 'next/router';

const useRequest = ({ url, method, reqBody, onSuccess }) => {
    const [errors, setErrors] = useState(null);

    const handleRequest = async () => {
        try {
            setErrors(null);
            const response = await axios[method](url, reqBody);
            if(onSuccess) {
                onSuccess(response.data);
            }
            return response.data
        } catch (error) {
            setErrors(
                <>
                    <div className='alert alert-danger'>
                        <h4>Ooops...</h4>
                        <ul className='my-0'>
                            {error.response.data.errors.map((eachEr) => {
                                return (
                                    <>
                                        <li key={eachEr.message}>{eachEr.message}</li>
                                    </>
                                )
                            })}
                        </ul>
                    </div>
                </>
            );
        }
    }

    return {
        handleRequest, errors
    }
};

export default useRequest;