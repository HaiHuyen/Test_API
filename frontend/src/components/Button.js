function Button({color, size, setColor, setSize}) {
    function handleClickColor(event) {
        const collection = document.getElementsByClassName('border1')
        for(let elem of collection) {
            elem.classList.toggle('border1')
        }
        const elem = event.target
        if(!elem.classList.contains('border1')) {
            elem.classList.add('border1')
        } else {
            elem.classList.remove('border1')
        }
        
        setColor && setColor(event.target.value)
    }

    function handleClickSize(event) {
        const elem = event.target
        const collection = document.getElementsByClassName('border')
        for(let elem of collection) {
            elem.classList.toggle('border')
        }
        if(!elem.classList.contains('border')) {
            elem.classList.add('border')
        } else {
            elem.classList.remove('border')
        }

        setSize && setSize(event.target.value)
    }

    if(color) {
        return (
            <>
                <button 
                    title="color_btn"
                    value={color} 
                    className={`color_btn button`} 
                    onClick={(event) => handleClickColor(event)}>
                {color}</button>
            </>
        )
    } else {
       return (
        <>
            <button 
                title="size_btn"
                value={size} className={`size button`} onClick={(event) => handleClickSize(event)}>
            {size}</button>
        </>
       )
    }
}

export default Button;