
const products_parent = document.getElementById('products');
const products_list = document.getElementById('itmes_list');
const pagination_div = document.getElementById('pagination_div');
//console.log(pagination_div);
 

var products_length;

window.addEventListener('DOMContentLoaded',() => {

    getDataFromServer();

})

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
        //const product_name=document.getElementById(product).firstElementChild.innerHTML
        //console.log(productId);

        const all_details=document.getElementById(productId).children;
        
        const product_name=all_details[0].innerHTML;
        const product_cost=all_details[2].innerHTML;
        let product_qty=1;

        console.log(product_name,product_cost);
        const str=JSON.stringify({name:product_name,cost:product_cost, qty:product_qty});

        // storing the data in database through axios
        axios.post(`http://localhost:3000/add-to-cart-out/${productId}`)
        .then((res)=> {
            console.log(res)
        })
        .catch(err => console.log(err));
        
        
        // creating the cart notificaation by successfull addintion to cart
        const cart_alrt = document.getElementById('cart_alrt');
        console.log(cart_alrt);

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
const close=document.getElementById('close');
const cart_container= document.getElementById('cart_container');

cart.addEventListener('click',(e)=>{
    
    display();

    cart_container.classList.add('active');
});

close.addEventListener('click',()=>{
    cart_container.classList.remove('active');
});

// removing item when click on remove button in cart model
const remove=document.getElementById('cart_items_list');
//console.log(remove);
remove.addEventListener('click',(e) => {
    const ele_id= e.target.id;
    //console.log(ele_id);
    // if id is not null then remove that item form storage and then form the page too
    if(ele_id){
        localStorage.removeItem(ele_id);
        display();
    }

})

function display(){

    const parent=document.getElementById('cart_items_list');
    let ele;

    axios.get(`http://localhost:3000/cart-out`)
    .then((result) => {
        //console.log(result.data);

        const products = result.data;
        products.forEach((product) =>{

            //extracting the value into object form via prase method from json formate
            //console.log(JSON.parse(value).name);
            const name=product.title;
            const cost=product.price;
            const qty=product.cartItem.quantity;

            //console.log(name,cost,qty);
    
    
            ele += `<div class=fxd_heading id=${name}>
                            <p> ${name}</p>
                            <p>cost: ${cost}</p>
                            <p>quantity: ${qty}</p>
                            <button type="button" id= ${name}>Remove</button>
                    </div>`;
                   
        })
        parent.innerHTML=ele; 
    })
    .catch(err => console.log(err));
}

