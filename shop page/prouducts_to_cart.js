
const products = document.getElementById('products');

products.addEventListener('click',(event)=>{
    const product = event.target.id;
    //const product_name=document.getElementById(product).firstElementChild.innerHTML
    //console.log(product_name);

    const all_details=document.getElementById(product).children;

    const product_name=all_details[0].innerHTML;
    const product_cost=all_details[2].innerHTML;
    let product_qty=1;

    //if the product is already exits then removeItem from local storage and update it by incrementing its qty
    if(localStorage.getItem(product_name)){
        product_qty += JSON.parse(localStorage.getItem(product_name)).qty;
        localStorage.removeItem(product_name);
    }
    console.log(product_name,product_cost);
    const str=JSON.stringify({name:product_name,cost:product_cost, qty:product_qty});

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


//displaying the cart model
const cart = document.getElementById('cart_btn');
const close=document.getElementById('close');
const cart_container= document.getElementById('cart_container');

cart.addEventListener('click',(e)=>{
    
    display();

    cart_container.classList.add('active');
});

close.addEventListener('click',(e)=>{
    e.preventDefault();
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
    
    //accessing all the data stored in local storage and creating the elements in cart model
    const values= Object.values(localStorage);  // it returns the array of all keys in local storage

    const parent=document.getElementById('cart_items_list');
    let ele;

    values.forEach((value) =>{

        //extracting the value into object form via prase method from json formate
        //console.log(JSON.parse(value).name);
        const name=JSON.parse(value).name;
        const cost=JSON.parse(value).cost;
        const qty=JSON.parse(value).qty;


        ele += `<div class=fxd_heading id=${name}>
                        <p> ${name}</p>
                        <p>cost: ${cost}</p>
                        <p>quantity: ${qty}</p>
                        <button type="button" id= ${name}>Remove</button>
                    </div>`;
                    
    })
    parent.innerHTML=ele; 

}

