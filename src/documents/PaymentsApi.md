# Payments API
The Payments API allows you to integrate Shekal Payments services into your checkout flow. Shekal provides a single script to be included
to your checkout that creates the button in a container of your choice and provides configuration options for setting and updating 
price and reference codes.

## Getting Started
Explain the basic premise of what integration and usage entails

1. Register for an account
2. Verify your company and user
3. Setup the service
4. Integrate the service


## Payments and Transactions

## The Button
Explain the button functionality and how to integrate it

Testing the code swapping functionality

### Integration

To use the button in your checkout flow you must include the script from Shekal into your checkout page. Requesting the
script requires your `client_id` and `api_key` for the Payments API service, which can be found [here](https://www.shekal.com/app/services).

Include the script into your checkout page before you call the initialization function.

> Include the button script into your checkout page before your initialization code
```html
<script type="text/javascript" src="https://www.shekal.com/apis/payments/resources/button.js?client_id={{client_id}}&key={{key}}"></script>
```

> Initialize the button with a price and reference

```javascript
const shekalButton = new ShekalPaymentButton(
    'shekal-payment-button', 
    1234.56, 
    {reference: 'order-0123456789'}
);
```

> Configuring the button entirely in the page
>
```html
    <!-- In your payment options -->
    <div class="payment-options">                             
        <!-- ... other payment options -->
        <div id="shekal-payment-button"></div>
    </div>
    
    <!-- At the bottom of your page -->
    <script type="text/javascript" src="https://www.shekal.com/apis/payments/resources/button.js?client_id={{client_id}}&key={{key}}"></script>
    
    <script>
        const shekalButton = new ShekalPaymentButton(
            'shekal-payment-button', 
            1234.56, 
            {reference: 'order-0123456789'}
        );
    </script>
    
    </body>
```


|Parameter |Type | Description|
|---|---|---|
|id |String | id of the container element in your page |
|price|Number| amount in USD for this purchase |
|options |Object | Additional options for the purchase |
|options.reference|String | Reference to be used in the webhook for status changes on this purchase |



## Webhooks and Events
Somthing about webhooks and events