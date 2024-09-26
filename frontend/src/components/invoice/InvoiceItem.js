import styles from './InvoiceItem.module.css'

const InvoiceItem = ({item}) => {
    return (
        <div className={`${styles.item_wrapper}`}>
            <div>
                    <p>{item.name}</p>
                    <p>{item.size} - {item.color}</p>
            </div>
            <div>
                <p>{item.quantity}</p>
            </div>
            <div>$ {item.price}</div>
            <div>$ {item.total}</div>
        
        </div>
    )
}

export default InvoiceItem;