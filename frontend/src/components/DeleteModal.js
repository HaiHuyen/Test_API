import styles from '../components/account/ManageAccount.module.css'
import Button from 'react-bootstrap/esm/Button';

function DeleteModal({ hiddenDialog, setHiddenDialog, handleDelete, type }) {
    return (
        <div className={`${styles.modal} ${hiddenDialog ? styles.none : ''}`}>
            <div className={styles.modal_content}>
                <div className={`${styles.modal_header} d-flex align-items-center`}>
                    <h3>Confirm Delete</h3>
                    <div><span onClick={() => setHiddenDialog(true)} className={`${styles.modal_close}`}>&times;</span></div>
                </div>
                <hr />
                {
                    type === 'order' ? <p>Do you want to cancel this {type}?</p> : <p>Do you want to delete this {type}?</p>
                }
                <div className='mt-4 d-flex justify-content-end align-items-center'>
                    <Button onClick={() => setHiddenDialog(true)} type='submit' className={`${styles.btn_size} me-4`} variant="outline-secondary">Close</Button>
                    <Button onClick={handleDelete} type='submit' className={`${styles.btn_size} btn-dark`}>Confirm</Button>
                </div>
            </div>
        </div>
    );
}

export default DeleteModal;