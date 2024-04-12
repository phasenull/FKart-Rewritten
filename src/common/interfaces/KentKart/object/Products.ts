export interface IProducts {
	"InventoryArray": [

        {
            "transaction_type": "5",
            "product_code": "11-1",
            "product_name": "Mobil Kart",
            "desc": "QR E-wallet",
            "product_type": "0",
            
            "price": {
                "product_price": "0",
                "max_charge_amount": 500,
                "min_charge_amount": 0.5,
                "card_max_balance": 1000,
                "predefined_amount": [
                    {
                        "type": 10,
                        "amount": 50
                    },
                    {
                        "type": 19,
                        "amount": 100
                    },
                    {
                        "type": 16,
                        "amount": 200
                    },
                    {
                        "type": 24,
                        "amount": 300
                    },
                    {
                        "type": 51,
                        "amount": 500
                    }
                ],
                "firstDeposit": "30"
            },
            "media_type": "33",
            "passenger_type": "01",
            "process_type": "CS",
            
           
            
            "recharge_status": "1",
            "sale_status": "1",
            "checkNfcTransfer": "1",
            "commission": {
                "1": {
                    "commissionRate": 0.05,
                    "commissionPerTransaction": 0,
                    "maxCommissionAmount": 25
                },
                "13": {
                    "commissionRate": 0.05,
                    "commissionPerTransaction": 0,
                    "maxCommissionAmount": 25
                },
                "15": {
                    "commissionRate": 0.05,
                    "commissionPerTransaction": 0,
                    "maxCommissionAmount": 25
                },
                "21": {
                    "commissionRate": 0.05,
                    "commissionPerTransaction": 0,
                    "maxCommissionAmount": 25
                }
            },
            "notifyKey": "QR",
            "checkDeposit": true,
            "ticketSupport": "0",
            "odSupport": "0",
            "control_params": {},
            "parent_products": []
        },
        {
            "transaction_type": "1",
            "product_code": "10-1",
            "product_name": "RF-Card",
            "desc": "RF-Card",
            "product_type": "0",
            
            "price": {
                "product_price": "0",
                "max_charge_amount": 500,
                "min_charge_amount": 0.5,
                "card_max_balance": 1000,
                "predefined_amount": [
                    {
                        "type": 10,
                        "amount": 50
                    },
                    {
                        "type": 19,
                        "amount": 100
                    },
                    {
                        "type": 16,
                        "amount": 200
                    },
                    {
                        "type": 24,
                        "amount": 300
                    },
                    {
                        "type": 51,
                        "amount": 500
                    }
                ]
            },
            "media_type": "00",
            "passenger_type": "01",
            "process_type": "RT",
            "recharge_status": "1",
            "sale_status": "0",
            "checkNfcTransfer": "0",
            "commission": {
                "1": {
                    "commissionRate": 0.05,
                    "commissionPerTransaction": 0,
                    "maxCommissionAmount": 25
                },
                "13": {
                    "commissionRate": 0.05,
                    "commissionPerTransaction": 0,
                    "maxCommissionAmount": 25
                },
                "15": {
                    "commissionRate": 0.05,
                    "commissionPerTransaction": 0,
                    "maxCommissionAmount": 25
                },
                "21": {
                    "commissionRate": 0.05,
                    "commissionPerTransaction": 0,
                    "maxCommissionAmount": 25
                }
            },
            "notifyKey": "RF",
            "checkDeposit": false,
            "ticketSupport": "0",
            "odSupport": "0",
            "control_params": {},
            "parent_products": []
        },
        {
            "transaction_type": "5",
            "product_code": "49-1",
            "product_name": "QR STR",
            "desc": "QR E-wallet",
            "product_type": "12",
            "price": {
                "product_price": "125",
                "max_charge_amount": 500,
                "min_charge_amount": 10,
                "card_max_balance": 500,
                "credit_count": 500,
                "valid_day": 30
            },
            "media_type": "33",
            "passenger_type": "01",
            "process_type": "STS",
            "recharge_status": "0",
            "sale_status": "1",
            "checkNfcTransfer": "0",
            "commission": {
                "1": {
                    "commissionRate": 0,
                    "commissionPerTransaction": 6.25,
                    "maxCommissionAmount": 20
                },
                "13": {
                    "commissionRate": 0,
                    "commissionPerTransaction": 6.25,
                    "maxCommissionAmount": 20
                },
                "15": {
                    "commissionRate": 0,
                    "commissionPerTransaction": 6.25,
                    "maxCommissionAmount": 20
                },
                "21": {
                    "commissionRate": 0,
                    "commissionPerTransaction": 6.25,
                    "maxCommissionAmount": 20
                }
            },
            "notifyKey": "ABT",
            "checkDeposit": false,
            "ticketSupport": "0",
            "odSupport": "0",
            "control_params": {
                "checkParentType": true,
                "checkPassengerType": true,
                "checkPassengerList": [
                    "04",
                    "05",
                    "06"
                ],
                "sendTicketExpireDate": true,
                "ticketExpireDateTerm": "days",
                "ticketExpireDatePeriod": 30
            },
            "parent_products": [
                "11-1"
            ]
        },
        {
            "transaction_type": "5",
            "product_code": "50-1",
            "product_name": "QR STR",
            "desc": "QR E-wallet",
            "product_type": "12",
            
            "price": {
                "product_price": "250",
                "max_charge_amount": 500,
                "min_charge_amount": 10,
                "card_max_balance": 500,
                "credit_count": 1000,
                "valid_day": 30
            },
            "media_type": "33",
            "passenger_type": "01",
            "process_type": "STS",
            "recharge_status": "0",
            "sale_status": "1",
            "checkNfcTransfer": "0",
            "commission": {
                "1": {
                    "commissionRate": 0,
                    "commissionPerTransaction": 12.5,
                    "maxCommissionAmount": 20
                },
                "13": {
                    "commissionRate": 0,
                    "commissionPerTransaction": 12.5,
                    "maxCommissionAmount": 20
                },
                "15": {
                    "commissionRate": 0,
                    "commissionPerTransaction": 12.5,
                    "maxCommissionAmount": 20
                },
                "21": {
                    "commissionRate": 0,
                    "commissionPerTransaction": 12.5,
                    "maxCommissionAmount": 20
                }
            },
            "notifyKey": "ABT",
            "checkDeposit": false,
            "ticketSupport": "0",
            "odSupport": "0",
            "control_params": {
                "checkParentType": true,
                "checkPassengerType": true,
                "checkPassengerList": [
                    "04",
                    "05",
                    "06"
                ],
                "sendTicketExpireDate": true,
                "ticketExpireDateTerm": "days",
                "ticketExpireDatePeriod": 30
            },
            "parent_products": [
                "11-1"
            ]
        },
        {
            "transaction_type": "5",
            "product_code": "51-1",
            "product_name": "QR STR",
            "desc": "QR E-wallet",
            "product_type": "12",
            
            "price": {
                "product_price": "375",
                "max_charge_amount": 500,
                "min_charge_amount": 10,
                "card_max_balance": 500,
                "credit_count": 1500,
                "valid_day": 30
            },
            "media_type": "33",
            "passenger_type": "01",
            "process_type": "STS",
            
           
            
            "recharge_status": "0",
            "sale_status": "1",
            "checkNfcTransfer": "0",
            "commission": {
                "1": {
                    "commissionRate": 0,
                    "commissionPerTransaction": 18.75,
                    "maxCommissionAmount": 20
                },
                "13": {
                    "commissionRate": 0,
                    "commissionPerTransaction": 18.75,
                    "maxCommissionAmount": 20
                },
                "15": {
                    "commissionRate": 0,
                    "commissionPerTransaction": 18.75,
                    "maxCommissionAmount": 20
                },
                "21": {
                    "commissionRate": 0,
                    "commissionPerTransaction": 18.75,
                    "maxCommissionAmount": 20
                }
            },
            "notifyKey": "ABT",
            "checkDeposit": false,
            "ticketSupport": "0",
            "odSupport": "0",
            "control_params": {
                "checkParentType": true,
                "checkPassengerType": true,
                "checkPassengerList": [
                    "04",
                    "05",
                    "06"
                ],
                "sendTicketExpireDate": true,
                "ticketExpireDateTerm": "days",
                "ticketExpireDatePeriod": 30
            },
            "parent_products": [
                "11-1"
            ]
        }
    ]
}