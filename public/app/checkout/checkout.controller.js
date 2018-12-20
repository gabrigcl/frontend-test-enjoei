var checkoutData = null;
var checkoutId = 6544;
var currentCoupon = 'not_use';

var alertMsgs = {
    confirm: {
        iconColor: 'green',
        title: 'compra confirmada',
        text: 'enviaremos atualizações sobre o pedido para o seu email'
    },
    cancel: {
        iconColor: 'orange',
        title: 'compra cancelada',
        text: 'o pedido não foi enviado e você não será cobrado'
    }
}

var alert = function(type){
    var alertOverlay = document.querySelector('.overlay');
    var alertWindow = document.querySelector('.alert');
    var alertMsg = alertMsgs[type];
    document.querySelector('#alert-ic-chk').style.color = alertMsg.iconColor;
    document.querySelector('#alert-title-chk').textContent = alertMsg.title;
    document.querySelector('#alert-txt-chk').textContent = alertMsg.text;
    alertOverlay.classList.remove('alert-hide');
    alertWindow.classList.remove('alert-hide');
    var alertWindowClientWidth = alertWindow.getBoundingClientRect().width;
    var half = alertWindowClientWidth/2;
    var left = window.innerWidth/2 - half;
    alertWindow.style.left = left + 'px';
    if(!alertOverlay.onclick){
        alertOverlay.onclick = (function(alertOverlay, alertWindow){
            return function(o){
                alertOverlay.classList.add('alert-hide');
                alertWindow.classList.add('alert-hide');
            }
        })(alertOverlay, alertWindow);
    }
}

var formatNumber = function(number){
    var format = { minimumFractionDigits: 2 , style: 'currency', currency: 'BRL' }
    return number.toLocaleString('pt-BR', format);
}

window.onload = function(){
    getCheckout(checkoutId, null);
}

var getCheckout = function(checkoutId, couponId){
    CheckoutService.getCheckout(checkoutId, couponId,
        function(res){
            var data = JSON.parse(res);
            if(checkoutData === null){
                checkoutData = data;
                loadCheckout();
            }
            else{
                checkoutData = data;
                updateCheckout();
            }
        }, 
        function(err){
            console.log(err);
        }
    );
};

var confirmCheckout = function(checkoutId){
    CheckoutService.confirmCheckout(checkoutId,
        function(res){
            alert('confirm');
        }, 
        function(err){
            console.log(err);
        }
    );
};

var loadCheckout = function(){
    document.querySelector('#product-img').setAttribute('src', checkoutData.product.image);
    var couponsSection = document.querySelector('#cupons');
    checkoutData.checkout.availableCoupons.forEach(function(c){
        var coupon = `
        <div class="cupon-input">
            <input type="radio" name="cupons" id="cp-${c.id}" value="${c.id}">
            <label for="cp-${c.id}">
            <span class="cupon-title">${c.title}</span>
            <span class="cupon-discount value debit-value">- ${formatNumber(c.discount)}</span>
            </label>
        </div>`;
        var couponEl = $(coupon);
        couponsSection.appendChild(couponEl[0]);
    });
    document.querySelector('#cev-value').textContent = formatNumber(checkoutData.product.price);
    document.querySelector('#cev-cupon').textContent = formatNumber(0);
    document.querySelector('#cev-frete').textContent = formatNumber(checkoutData.checkout.shippingPrice);
    document.querySelector('#cev-total').textContent = formatNumber(checkoutData.checkout.totalPrice);

    document.querySelectorAll('input[name="cupons"]').forEach(function(coupon){
        coupon.onclick = function(e){
            if(currentCoupon != e.target.value){
                currentCoupon = e.target.value;
                if(e.target.value == 'not_use'){
                    document.querySelector('#cev-cupon').textContent = '- ' + formatNumber(0);
                    getCheckout(checkoutId, null);
                }
                else{
                    var discount = checkoutData.checkout.availableCoupons.find(function(c){
                        return c.id == e.target.value;
                    });
                    document.querySelector('#cev-cupon').textContent = '- ' + formatNumber(discount.discount);
                    getCheckout(checkoutId, discount.id);
                }
            }
        }
    });

    document.querySelector('#cancel-checkout-bt').onclick = function(bt){
        alert('cancel');
    };
    document.querySelector('#confirm-checkout-bt').onclick = function(bt){
        confirmCheckout(checkoutId);
    };
};

var updateCheckout = function(){
    document.querySelector('#cev-total').textContent = formatNumber(checkoutData.checkout.totalPrice);
};