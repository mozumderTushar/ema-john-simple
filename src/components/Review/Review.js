import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { getDatabaseCart, removeFromDatabaseCart, processOrder } from '../../utilities/databaseManager';
import fakeData from '../../fakeData';
import ReviewItems from '../ReviewItems/ReviewItems';
import Cart from '../Cart/Cart';
import happyImage from '../../images/giphy.gif'
import { useHistory } from 'react-router-dom';

const Review = () => {
    const [cart, setCart] = useState([])
    const [placeOrder, setPlaceOrder] = useState(false)
    const history = useHistory()

    const handleProceedCheckout = () =>{
        // setCart([])
        // setPlaceOrder(true)
        // processOrder()
        history.push('/shipment')

    }

    const removeProduct = (productKey) => {
        console.log('remove clicked',productKey);
        const newCart = cart.filter(pd => pd.key !== productKey);
        setCart(newCart);
        removeFromDatabaseCart(productKey)
    }

    useEffect(()=>{
        const savedCart = getDatabaseCart();
        const productKeys = Object.keys(savedCart)
        
        fetch('https://pure-garden-17520.herokuapp.com/productsByKeys', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(productKeys)
        })
        .then(response => response.json())
        .then(data => setCart(data))
    },[]);

    let thankyou;
    if(placeOrder){
        thankyou =  <img src={happyImage} alt=""/>
    }

    return (
        <div className="shop-container">
          <div className="product-container">
          {
                cart.map(pd => <ReviewItems 
                    product={pd} 
                    key={pd.key} 
                    removeProduct={removeProduct}></ReviewItems>)        
            }
           {thankyou}
          </div>
         
          <div className="cart-container">
                <Cart cart={cart}>
                    <button onClick={handleProceedCheckout} className="main-button">Proceed Checkout</button>
                </Cart>
            </div>
        </div>
    );
};

export default Review;