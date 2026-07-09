import { Modal as BootstrapModal } from 'react-bootstrap';
import styles from './modal.module.css';

const Modal = ({ show, onClose, title, children }) => {
    return (
        <BootstrapModal show={show} onHide={onClose} centered className={styles.customModal}>
            <BootstrapModal.Header closeButton>
                <BootstrapModal.Title>{title}</BootstrapModal.Title>
            </BootstrapModal.Header>
            <BootstrapModal.Body>{children}</BootstrapModal.Body>
        </BootstrapModal>
    )
};

export default Modal;