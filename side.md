pack (front) front: https://clothes-shop-api.onrender.com

//server
const corsOptions = {
    origin: 'https://clothes-shop-fyzl.onrender.com',
    credentials: true
}

//axios
const axiosPrivate = axios.create({
    baseURL: 'https://clothes-shop-api.onrender.com',
    headers: { 'Content-Type': 'application/json'},
    withCredentials: true,
    
})