

let cart = [];
let modalKey = 0;
let modalQt = 1;

let abrefecha = false;
$(function(){
 	init();
 	var actionContainer = $("#actionmenu");
 	window.addEventListener('message',function(event){
 		var item = event.data;
 		if (item.showmenu){
            ResetMenu()
            cart = [];
            updateCart();
 			actionContainer.show();
             $('.haxxWindowArea').css('display','none');
             c('.cart').innerHTML = '';
             $('.models').css('display','none');
             $('#carrinho').css('display','block');
             $('#quanti').val('1');
             $('.menu-closer').css('display','none');
             c('.total span:last-child').innerHTML = `--`;
 		}
 		if (item.hidemenu){
 			actionContainer.hide();
 		}
     });


     function ResetMenu(){
         $("div").each(function(i,obj){
             var element = $(this);
  
             if (element.attr("data-parent")){
                 element.hide();
             } else {
                 element.show();
             }
         });
     }
  
     function init() {
         $(".menuoption").each(function(i,obj){
  
             if ($(this).attr("data-action")){
                 $(this).click(function(){
                     var data = $(this).data("action"); 
                     sendData("ButtonClick",data); 
                 })
             }
  
             if ($(this).attr("data-sub")){
                 var menu = $(this).data("sub");
                 var element = $("#"+menu);
  
                 $(this).click(function(){
                     element.show();
                     $(this).parent().hide();
                 })
             }
         });
     }

     
     const c = (el)=>document.querySelector(el);
     const cs = (el)=>document.querySelectorAll(el);
     
     // Listagem das haxxs
     haxxJson.map((item, index)=>{
         let haxxItem = c('.models .haxx-item').cloneNode(true);
         
         haxxItem.setAttribute('data-key', index);
         haxxItem.querySelector('.haxx-item--img img').src = item.img;
         haxxItem.querySelector('.haxx-item--price').innerHTML = `$ ${item.price.toLocaleString()}`;
         haxxItem.querySelector('.haxx-item--name').innerHTML = item.name;
        //  haxxItem.querySelector('.haxx-item--desc').innerHTML = item.description;
         
         haxxItem.querySelector('a').addEventListener('click', (e)=>{
             e.preventDefault();
             let key = e.target.closest('.haxx-item').getAttribute('data-key');
             modalKey = key;

             
             c('.haxxBig img').src = haxxJson[key].img;
             c('.haxxInfo h1').innerHTML = haxxJson[key].name;
             c('.haxxInfo--desc').innerHTML = haxxJson[key].description;
             c('.haxxInfo--actualPrice').innerHTML = `$ ${haxxJson[key].price.toLocaleString()}`;
             
             
     
             c('.haxxWindowArea').style.opacity = 0;
             c('.haxxWindowArea').style.display = 'flex';
             setTimeout(()=>{
                 c('.haxxWindowArea').style.opacity = 1;
             }, 200);
         });
     
         c('.haxx-area').append( haxxItem );
     });
     
     // Eventos do MODAL
     function closeModal() {
         c('.haxxWindowArea').style.opacity = 0;
         setTimeout(()=>{
             c('.haxxWindowArea').style.display = 'none';
         }, 500);
     }
     
     $('#quanti').val('1');
     cs('.haxxInfo--cancelButton, .haxxInfo--cancelMobileButton').forEach((item)=>{
         item.addEventListener('click', closeModal);
     });
     c('.haxxInfo--qtmenos').addEventListener('click', ()=>{
         if(modalQt > 1) {
             modalQt--;
             $('#quanti').val(modalQt);
         }
     });
     c('.haxxInfo--qtmais').addEventListener('click', ()=>{
         modalQt++;
             $('#quanti').val(modalQt);
     });

     c('.haxxInfo--addButton').addEventListener('click', ()=>{
         let identifier = haxxJson[modalKey].id+'@';
         let key = cart.findIndex((item)=>item.identifier == identifier);
         modalQt = modalQt + parseInt($('#quanti').val()) - 1;
         if(key > -1) {
             cart[key].qt += modalQt;
         } else {
             cart.push({
                 identifier,
                 id:haxxJson[modalKey].id,
                 price:haxxJson[modalKey].price,
                 set: haxxJson[modalKey].set,
                 qt:modalQt
             });
         }
         updateCart();
         closeModal();
         carrinho = cart;
     });
     
     c('.menu-openner').addEventListener('click', () => {
         if(cart.length > 0) {
             c('aside').style.left = '0';
         }
     });
     c('.menu-closer').addEventListener('click', ()=>{
         c('aside').style.left = '100vw';
     });
     
     function updateCart() {
         c('.menu-openner span').innerHTML = cart.length;
        modalQt = 1;
         $('#quantidade').html(cart.length);
         if(cart.length > 0) {
             c('aside').classList.add('show');
             c('aside').style.display = 'block';
             $('.menu-closer').css('display','block');
             c('.cart').innerHTML = '';
             let subtotal = 0;
             abrefecha = true;
             let total = 0;
     
             for(let i in cart) {
                 let haxxItem = haxxJson.find((item)=>item.id == cart[i].id);
                 subtotal += haxxItem.price * cart[i].qt;
     
                 let cartItem = c('.models .cart--item').cloneNode(true);
     
                 let haxxName = `${haxxItem.name}`;
     
                 cartItem.querySelector('img').src = haxxItem.img;
                 cartItem.querySelector('.cart--item-nome').innerHTML = haxxName;
                 cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
                 cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{
                     if(cart[i].qt > 1) {
                         cart[i].qt--;
                     } else {
                         cart.splice(i, 1);
                         cart = [];
                         c('.total span:last-child').innerHTML = `--`;
                         c('.cart').innerHTML = '';
                     }
                     updateCart();
                 });
                 cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{
                     cart[i].qt++;
                     updateCart();
                 });
     
                 c('.cart').append(cartItem);
             }
     
             total = subtotal;
             
             c('.total span:last-child').innerHTML = `$ ${total.toLocaleString()}`;
     
         } else {
             c('aside').classList.remove('show');
             c('aside').style.display = 'none';
             abrefecha = false;
             $('.menu-closer').css('display','none');
         }
     }  

 	document.onkeyup = function(data){
 		if (data.which == 27){
            $('aside').css('display', 'none');
            
 			if (actionContainer.is(":visible")){
 				sendData("ButtonClick","fechar")
             }
 		}
 	};
 })

 $('#carrinho').click(()=>{
     if(abrefecha == false){
        abrefecha = true;
        $('aside').css('display', 'block');
     }else {
        abrefecha = false;
        $('aside').css('display', 'none');
     }
 })
$('.menu-closer').click(()=>{
     $('#carrinho').css('display', 'block');
     $('aside').css('display', 'none');
})
$('#finalizando').click(()=>{
    $.post("http://haxx_cmuni/finalizando", JSON.stringify({
        cart:cart,
    }));
})

 function sendData(name,data){
 	$.post("http://haxx_cmuni/"+name,JSON.stringify(data),function(datab){
 		if (datab != "ok"){
 			console.log(datab);
 		}
 	});
 }