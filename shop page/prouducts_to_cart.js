
const products = document.getElementById('products');

products.addEventListener('click',(event)=>{
    const product = event.target.id;
    //const product_name=document.getElementById(product).firstElementChild.innerHTML
    //console.log(product_name);

    const all_details=document.getElementById(product).children;

    const product_name=all_details[0].innerHTML;
    const product_cost=all_details[2].innerHTML;

    console.log(product_name,product_cost);
    const str=JSON.stringify({name:product_name,cost:product_cost});

    // storing the data in local storage
    localStorage.setItem(product_name,str);
    
    
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
});



const cart = document.getElementById('cart_btn');
const close=document.getElementById('close');
const cart_container= document.getElementById('cart_container');

cart.addEventListener('click',(e)=>{
    
    //accessing all the data stored in local storage and creating the elements in cart model
    const values= Object.values(localStorage);  // it returns the array of all keys in local storage

    const parent=document.getElementById('cart_items_list');
    let ele;

    values.forEach((value) =>{

        //extracting the value into object form via prase method from json formate
        //console.log(JSON.parse(value).name);
        const name=JSON.parse(value).name;
        const cost=JSON.parse(value).cost;

        ele += `<div class=fxd_heading>
                        <p> ${name}</p>
                        <p>${cost}</p>
                        <p>1</p>
                        <button type="button">Remove</button>
                    </div>`;
                    
    })
    parent.innerHTML=ele; 


    cart_container.classList.add('active');
});

close.addEventListener('click',(e)=>{
    e.preventDefault();
    cart_container.classList.remove('active');
});

