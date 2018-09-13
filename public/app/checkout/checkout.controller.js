
window.onload = function(){
    CheckoutService.getCheckout(6544, null,
        function(res){
            var data = JSON.parse(res);
            document.querySelector('#product-img').setAttribute('src', data.product.image);
            var couponsSection = document.querySelector('#cupons');
            data.checkout.availableCoupons.forEach(function(c){
                var coupon = `
                <div class="cupon-input">
                    <input type="radio" name="cupons" id="cp-${c.id}" value="${c.id}">
                    <label for="cp-${c.id}">
                    <span class="cupon-title">${c.title}</span>
                    <span class="cupon-discount value debit-value">- R$ ${c.discount}</span>
                    </label>
                </div>`;
                var couponEl = $(coupon);
                couponsSection.appendChild(couponEl[0]);
            });
            
        }, 
        function(err){
            console.log(err);
        }
    );
}