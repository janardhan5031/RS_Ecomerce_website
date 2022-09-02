
// pages changing activity
const shop_btn = document.getElementById('shop_btn');   // shop button in header bar
const cart_btn = document.getElementById('cart_btn');   // cart button in the header bar
const order_btn = document.getElementById('orders_btn');    // order button in header bar

const shop_products_list = document.getElementById('items_list');
const cart_container = document.getElementById('cart_container');
const order_model = document.getElementById('orders_model');    

cart_btn.addEventListener('click', () =>{

    if(order_model.classList.contains('active')){
        order_model.classList.remove('active');
    }
    shop_products_list.style.display = 'none';
    cart_container.classList.add('active');
});

order_btn.addEventListener('click', ()=>{
    if(cart_container.classList.contains('active')){
        cart_container.classList.remove('active');
    }
    shop_products_list.style.display = 'none';
    order_model.classList.add('active');
    showingOrderItems();
})

shop_btn.addEventListener('click', () =>{

    order_model.classList.remove('active');
    cart_container.classList.remove('active');
    shop_products_list.style.display ='flex';
    shop_products_list.style.flexDirection ='column';
})

// header button's actions are complted upto this line

const products_list = document.getElementById('itmes_list');
//console.log(pagination_div);


var products_length;

window.addEventListener('DOMContentLoaded',() => {
    
    getDataFromServer();
    
})

const pagination_div = document.getElementById('pagination_div');

pagination_div.addEventListener('click',(e) => {
    const target_page = parseInt(e.target.innerHTML);
    //console.log(target_page);

    const numPages = Math.ceil(products_length/2);      // round figure the resultant division of number
    //console.log(numPages);
    if(target_page<=numPages){
        const scndEle = pagination_div.children[1].innerHTML;
        if((scndEle < target_page && target_page < numPages) || target_page ==1){
            pagination_div.children[0].value = target_page;
            pagination_div.children[1].innerHTML = target_page;
            pagination_div.children[2].innerHTML = target_page+1;
        }
        else if( target_page>1){
            pagination_div.children[0].value = target_page;
            pagination_div.children[1].innerHTML = target_page-1;
            pagination_div.children[2].innerHTML = target_page;
        } 
    }
    getDataFromServer();
})


const products_parent = document.getElementById('products');

function getDataFromServer(){
    const firstEle = pagination_div.children[0].value;
    console.log('first ele',firstEle);

    axios.get(`http://localhost:3000/get-all-products?page=${firstEle}`)
    .then((products) => {

        products_length = products.data.length;
        
        products_parent.innerHTML =``;
        //console.log(products.data.products);
        products.data.products.forEach((product) =>{
            const ele = 
            `<div class="product" id="${product.id}">
                <p>${product.title}</p>
                <div class="image_container"><img src="${product.imageUrl} " alt=""></div>
                <p>${product.price}</p>
                <button type="button" id="${product.id}" class="add_to_crt_btn">add to cart</button>
            </div>`;
            products_parent.innerHTML += ele;
        })
    })

}


products.addEventListener('click',(event)=>{

    // add to cart event
    if(event.target.className ==='add_to_crt_btn'){     // if target element class matches with add to cart ele class, this process will be done
        const productId = event.target.id;
        const product_name=document.getElementById(productId).children[0].innerHTML
        //console.log(productId);

        // storing the data in database through axios
        axios.post(`http://localhost:3000/add-to-cart-out/${productId}`)
        .then((res)=> {
            //console.log(res)
        })
        .catch(err => console.log(err));
        
        
        // creating the cart notificaation by successfull addintion to cart
        const cart_alrt = document.getElementById('cart_alrt');
        //console.log(cart_alrt);

        const ele=document.createElement('div');
        ele.innerHTML= `This ${product_name} is added to your cart`;
        ele.classList.add('tost');
        cart_alrt.appendChild(ele);
        
        //after few seconds this notification will be removed
        setInterval(()=>{
            ele.remove();   
        },3000)
    }
    
});


//displaying the cart model
const cart = document.getElementById('cart_btn');

// opening the cat model 
cart.addEventListener('click',(e)=>{
    display();            // getting the cart items from the  database and displaying

});


// removing item when click on remove button in cart model
const cart_items_parent = document.getElementById('cart_items_container');

cart_items_parent.addEventListener('click',(e) => {
    let remove_prod_id;
    if(e.target.className ==='crt_rmv_btn'){
        remove_prod_id=e.target.id;
    }
    axios.post('http://localhost:3000/delete-cart-product-out',{id:remove_prod_id})
    .then(result =>{
        //console.log(result.status);
        display();  // refresh the cart model
    })
    .catch(err => console.log(err));
})

// displaying the cart products
function display(){

    const parent = document.getElementById('cart_items_container');

    //console.log(parent, parent.innerText);

    axios.get(`http://localhost:3000/cart-out`)
    .then((result) => {
        //console.log(result.data);

        parent.innerHTML='';    // removing all the elements first from the cart and add into it

        const products = result.data;
        products.forEach((product) =>{

            //console.log(product);
            const productId = product.id;
            const name=product.title;
            const image = product.imageUrl;
            const cost=product.price;
            const qty=product.cartItem.quantity;

            //console.log(name,cost,qty);
            const ele = 
            `<div class="cart_item">
                <div class="product_container">
                    <div class="image_container"><img src=${image} alt=""></div>
                    <div class="product_description">
                        <h4>${name}</h4>
                        <h3>${cost}</h3>
                    </div>
                </div>
                <div class="action_container">
                    <div class="quantity_div">
                        <button type="button">-</button>
                        <input type="text" id="quantity" name="quantity" value=${qty}>
                        <button type="button">+</button>
                    </div>
                    <div class="remove_div">
                        <button type="submit" class="crt_rmv_btn" id=${productId}>Remove</button>
                    </div>
                </div>
            </div>`;
                   
            parent.innerHTML += ele; 
        })
    })
    .catch(err => console.log(err));
};


// ordering the items in cart model
const orderNow = document.getElementById('cart_buy_all');
//console.log(orderNow);
orderNow.addEventListener('click',() => {
    axios.post('http://localhost:3000/order-now')
    .then(res => {
        console.log('order now button clicked');
        console.log(res);

        if(res.status == 200){
            //removing all the elements in the cart model
            document.getElementById('cart_items_container').innerHTML='';

            //displaying the tost msg by successfull posting of product order
            const ele=document.createElement('div');
            ele.innerHTML= `You have successfully placed an order with id ${res.data.orderId}`;
            ele.classList.add('tost');
            cart_alrt.appendChild(ele);
            
            //after few seconds this notification will be removed
            setInterval(()=>{
                ele.remove();   
            },3000)
        }else{
            const ele=document.createElement('div');
            ele.innerHTML= `somthing went wrong`;
            ele.classList.add('tost');
            cart_alrt.appendChild(ele);
            
            //after few seconds this notification will be removed
            setInterval(()=>{
                ele.remove();   
            },3000)
        }
    })
    .catch(err => console.log(err));
});

// showing the orders module
function showingOrderItems(){
    let orderItems_container = document.getElementById('orders_items');
    
    axios.get('http://localhost:3000/get-all-order-items')
    .then(orderItems =>{
        console.log(orderItems);
        orderItems.data.forEach(order =>{
            let ele =
            `<div class="order_item" id=${order.OrderDetails.id}>   
                <div class="image_container">
                    <img src=${order.imageUrl} alt="">
                </div>
                <div class="text_container">
                    <h4>${order.title}</h4>
                    <p>product id is ${order.id}</p>
                </div>
                <div class="item_price">
                    <h4>${order.price}</h4>
                </div>
                <div class="order_status_container">
                    <h4>ordered on jun 16, 2022</h4>
                </div>
            </div>`;

            orderItems_container.innerHTML += ele;
        });
        if(!orderItems.data.length){
            orderItems_container.innerHTML = `<div class="no_orders_div"><h3> YOU HAVE NOT ORDERED ANY PRODUCT</h3></div>`
        }
    })
    .catch(err => console.log(err));
}

