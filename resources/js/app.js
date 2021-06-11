
import axios from 'axios';
import Noty from 'noty';

let addToCart = document.querySelectorAll('.add-to-cart');
let cartCounter = document.querySelector('#cartCounter');
function updateCart(burger){
    axios.post('/update-cart',burger).then((res)=>{
        cartCounter.innerText = res.data.totalQty;
        new Noty({
            type: 'success',
            timeout: 1000,
            text: "Item added to cart",
            progressBar: false
        }).show();

    }).catch(err=> {
        new Noty({
            type: 'error',
            timeout: 1000,
            text: "Something Went Wrong!!",
            progressBar: false
        }).show();

    })

}
addToCart.forEach((btn)=>{
    btn.addEventListener('click',(e)=>{
        let burger = JSON.parse(btn.dataset.burger)
        updateCart(burger)

    })

})