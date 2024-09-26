import DetailCard from './card/DetailCard';
import { useState, useEffect } from 'react';
import Slider from '../components/Slider';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

function HomeBody() {
    const [page, setPage] = useState(1)
    const [pageCount, setPageCount] = useState(0)
    const [pagArray, setPagArray] = useState([2, 3, 4])
    const [products, setProducts] = useState([])
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await axiosPrivate.get(`/products?page=${page}`)
                setProducts(result.data.allProducts)
                if(result.data.pagination.pageCount < 1) {
                    setPageCount(1)
                } else setPageCount(result.data.pagination.pageCount)
            } catch (error) {
                console.log(error)
            }
        }
        fetchData()
    }, [page])

    const handlePrevious = () => {
        if(page > 1) {
            const newArr = pagArray
            newArr.forEach(function(num, i, newArr) {
                newArr[i] = num - 1;
            })
            setPagArray(newArr)
        }
        setPage(page - 1)
    }       

    const handleNext = () => {
        if(page < pageCount) {
            const newArr = pagArray
            newArr.forEach(function(num, i, newArr) {
                newArr[i] = num + 1;
            })
            setPagArray(newArr)
        }
        setPage(page + 1)
    }

    const handleNavigatePag = (e) => {
        setPage(e.target.value)
    }

    return (
        <div className='home_body'>
            <div className='home_quotes'>
                <h2>To become fashionable...</h2>
                <p>
                    <i>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Maecenas porttitor congue massa. Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna.</i>
                </p>
            </div>
            <div className='home_slider'><Slider/></div>
            <div className='body'>
                <h1>Choose your styles</h1>
                <div className='card_group'>
                    {Array.isArray(products) && products.map((product) => (
                        <DetailCard key={product._id} product={product}/>
                    ))}
                </div>
            </div>
            <div className='d-flex justify-content-center align-items-center'>
                <div className='pagination'>
                    <button disabled={page === 1} onClick={handlePrevious}>Prev</button>
                    {
                        (pageCount > 1) && pagArray.map(item => {
                            if(item <= pageCount)
                                return (<button key={item} onClick={handleNavigatePag} value={item}>{item}</button>)
                        })
                    }
                    <button>...</button>
                    <button disabled={page === pageCount} onClick={handleNext}>Next</button>
                </div>
            </div>
        </div>
    );
}

export default HomeBody;