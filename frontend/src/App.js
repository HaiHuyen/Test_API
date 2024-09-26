import './App.css';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Home from './views/Home';
import Product from './views/Product';
import Cart from './views/Cart';
import Search from './views/Search';
import HomeBody from './components/HomeBody';
import LogIn from './components/auth/LogIn';
import Account from './views/Account';
import CustomizeProduct from './components/account/CustomizeProduct';
import PersistLogin from './components/auth/PersistLogin';
import Order from './views/Order';
import OrderSuccessfully from './views/OrderSuccessfully';
import Invoice from './views/Invoice';
import 'bootstrap/dist/css/bootstrap.min.css';
import DetailOrder from './components/account/DetailOrder';
import DetailMyOrder from './components/account/DetailMyOrder';
import ForgotPwd from './views/ForgotPwd';
import OTPInput from './components/auth/OTPInput';
import ResetPwd from './views/ResetPwd';

function App() {

  return (
    <Router>
      <div className="App">
        <meta name="favicon" content="none" />
        <Routes>
          <Route path='/login' element={<LogIn/>}/>
          <Route path='/forgotPwd' element={<ForgotPwd />}/>
          <Route path='/verifyOTP' element={<OTPInput />}/>
          <Route path='/resetPwd/:token/:userId' element={<ResetPwd />}/>

          <Route element={<PersistLogin />}>
            <Route path='/' element={<Home children={<HomeBody/>} />}/>

            <Route path='/account' element={<Home children={<Account/>} />}/>
            <Route path='/cart' element={<Home children={<Cart/>} />}/>
            <Route path='/order' element={<Home children={<Order/>} />}/>
            <Route path='/invoice/:id' element={<Home children={<Invoice/>} />}/>
            <Route path='/products/:id' element={<Home children={<Product/>} />}/>
            <Route path='/custom_product/:id' element={<Home children={<CustomizeProduct/>} />}/>
            <Route path='/search' element={<Home children={<Search/>} />}/>

            <Route path='/account/detailOrder/:id' element={<Home children={<Account children={<DetailOrder />}/>} />}/>
            <Route path='/account/myOrder/:id' element={<Home children={<Account children={<DetailMyOrder />}/>} />}/>
          </Route>

          <Route path='/order_success' element={<Home children={<OrderSuccessfully/>} />}/>

        </Routes>
      </div>
    </Router>
  );
}

export default App;
