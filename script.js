const body = document.querySelector('body')
const menuBtn = document.querySelector('.top-menu-button');
const header = document.querySelector('header');
const nav = document.querySelector('nav');
const cartBtn = document.querySelector('.top-cart');
const incartContainer = document.querySelector('.cart-container'); 
const incartItems = document.querySelector('.incart');
const categoryQuanity = document.querySelector('.top-cart #total-category-incart');
const totalAmountIncart = document.querySelector('#total-amount-incart');
const totalPriceIncart = document.querySelector('#total-price-incart');
const addToCartBtn = document.querySelectorAll('.add-to-cart');
const checkoutBtn = document.querySelector('.check-out-button');

const INCART_ITEM_KEY = 'incart.items';
var items;

function render(){
    updateCategoryQuantity();
    clearIncartElements();
    updateIncartInterface();
    addDeleteEvent();
    addInputChangeEvent();
}

menuBtn.addEventListener('click', function(){
    nav.classList.toggle('nav-show');
    menuBtn.classList.toggle('white');
    body.classList.toggle('disable-scroll');
});

for(let i = 0; i<addToCartBtn.length; i++){
    let btn = addToCartBtn[i];
    getIncartItemsFromStorage();
    btn.addEventListener('click', e => {
        const item = e.target.parentElement.parentElement;
        let index = null;
        for(let i = 0; i<items.length; i++){
            if(items[i].id === item.id){
                index = i;
            }
        }
        if(index != null){
            alert('This item is already in yout cart');
            return;
        }
        else{
            const newItemIncartDetail = createIncartItem(item);
            items.push(newItemIncartDetail);
            save();
            render();
        }
    });
}

function addDeleteEvent(){
    const deleteBtn = incartItems.querySelectorAll('.delete-incart-item');
    getIncartItemsFromStorage();
    deleteBtn.forEach(btn => {
        btn.addEventListener('click', e => {
            let selectedId = e.target.parentElement.id;
            e.target.parentElement.remove();
            items = items.filter(item => item.id != selectedId);
            save();
            render();
        })
    })
}

function addInputChangeEvent(){
    getIncartItemsFromStorage();
    const inputs = incartItems.querySelectorAll('#amount-input');
    for(let i = 0; i<inputs.length; i++){
        let input = inputs[i];
        input.addEventListener('change', e => {
            if(input.value <= 0 || input.value === NaN){
                input.value = 1;
            }
            let selectedId = e.target.parentElement.parentElement.id;
            let selectedItem = items.filter(item => item.id == selectedId)[0];
            selectedItem.quantity = input.value;
            let itemsIncart = document.querySelectorAll('.incart-item');
            for(let i = 0; i<itemsIncart.length; i++){
                let thatSelectedItem = itemsIncart[i];
                if(thatSelectedItem.id === selectedId){
                    thatSelectedItem.querySelector('.incart-price').innerHTML = '$' + selectedItem.price * selectedItem.quantity;
                }
            }
            save();
            getIncartItemsFromStorage();
            updateTotalItemQuantity();
            updateTotalItemPrice();
        });
    };
}

function getIncartItemsFromStorage(){
    items = JSON.parse(localStorage.getItem(INCART_ITEM_KEY));
    if(items === null) items = [];
}

function clearIncartElements(){
    while(incartItems.firstChild){
        incartItems.removeChild(incartItems.firstChild);
    }
}

function updateCategoryQuantity(){
    getIncartItemsFromStorage();
    categoryQuanity.innerHTML = (items.length > 0) ? items.length : '';
}

function updateIncartInterface(){
    getIncartItemsFromStorage();
    if(items.length == 0){
        incartContainer.style.display = 'none';
        let h3 = document.createElement('h3');
        h3.innerHTML = "Nothing's in cart now.";
        body.appendChild(h3);
    }
    else{
        items.forEach(item => appendNewItemElement(item));
        updateTotalItemQuantity();
        updateTotalItemPrice();
    }
}

function createIncartItem(item){
    let id = item.id;
    let src = item.querySelector('.item-img img').src;
    let title = item.querySelector('.item-title').innerText;
    let price = item.querySelector('.item-price').innerText;
    return {id: id, title: title, src: src, price: price.substring(1, price.length), quantity: 1}
}

function save(){
    localStorage.setItem(INCART_ITEM_KEY, JSON.stringify(items));
}

function appendNewItemElement(item){
    const newItemIncart = document.createElement('div');
    newItemIncart.classList.add('incart-item');
    const newItemContent = 
    `<i class="fa fa-times delete-incart-item"></i>
    <div class="incart-img">
        <img src="${item.src}" alt="">
    </div>
    <div class="incart-title">${item.title}</div>
    <div class="incart-amount-input">
        <input type="number" name="" id="amount-input" value="${item.quantity}" min="1">
    </div>
    <div class="incart-price">$${Math.round((item.quantity * item.price * 100))/100}</div>`;
    newItemIncart.id = item.id;
    newItemIncart.innerHTML = newItemContent;
    incartItems.appendChild(newItemIncart);
}

function updateTotalItemQuantity(){
    let total = 0;
    for(let i = 0; i<items.length; i++){
        total += parseInt(items[i].quantity);
    }
    totalAmountIncart.innerHTML = total;
}

function updateTotalItemPrice(){
    let total = 0;
    let prices = incartItems.querySelectorAll('.incart-price');
    for(let i = 0; i<prices.length; i++){
        let priceString = prices[i].innerHTML;
        total += parseFloat(priceString.substring(1, priceString.length));
    }
    totalPriceIncart.innerHTML = '$' + Math.round((total * 100))/100; // round 2 number after dot
}

checkoutBtn.onclick = function(){
    alert('Thanks for your purchase <3');
    items = [];
    save();
    render();
}

render();