var CheckoutService = (function(){
    
    var apiHost = 'http://localhost:3000/';

    var getCheckout = function(checkoutId, couponId, success, error){
        var couponPar = (couponId) ? '/?couponId='+couponId : '';
        HttpClient.get(apiHost + 'api/checkouts/' + checkoutId + couponPar, success, error);
    };

    var confirmCheckout = function(checkoutId){
        HttpClient.post(apiHost + 'api/checkouts/' + checkoutId, null, success, error);
    };

    return {
        getCheckout: getCheckout,
        confirmCheckout: confirmCheckout
    };

})();
