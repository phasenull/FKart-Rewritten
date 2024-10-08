# PHASENULL'S DIARY

abt card = qr card with tickets subs etc (Account Based Ticket).
qr card = nfc card (not available in some regions)



ERRORS:

ERROR_149: QR card does not belong to authenticated account

ERROR_131: You cannot delete your card / ticket because the expiration date has not passed.

404 returns authType:"" (cant find any controller to go through)
404 (deep routing) returns authType:"4" (cant find any route __IN A CONTROLLER__)

auth types
0 - Anonymous (not logged in)
1 - "kentkart"
2 - Facebook Account (who th uses facebook in 2024???)
3 - (???) labeled "AC3" and "AC16", can't make PIS requests __anymore__ (returns 113), can be shared publicly
4 - passenger information system (PIS) user


JWT payload for authType 3:

eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJrZW50a2FydC5jb20iLCJzdWIiOiJBQzE2IiwiYXVkIjoiYUMxdW4iLCJleHAiOjE3NjcyMTQ4MDAsIm5iZiI6MTY5Mjk2ODY2OSwiaWF0IjoxNjkyOTY4NjY5LCJqdGkiOiJmOWM5MDFmMi1iMTgzLTQ1NjYtYjIwYi1hMGI0YjZiYzM0MjUiLCJzeXN0ZW1faWQiOiIwMDQiLCJzY29wZXMiOltdfQ.V9c4Ud9Vjpc1bzHXnM1aL96xLCgeWQ1B3NejsdMTYow_eHgu8M6FiYFqYu9d56VjYwAJ7eMpFvr7cQPfRKCcAzB4MB0tyJWwS6LZybKlZvpu5XMiVhrh_wDYvvhbLO22oucYL7OIke0LFf92DLE65uhO7bbUv6pG6-RCUND7Ggn-v5B8XjjtYNUGU5-L27vr5iVLH_7pA7-Pw4EPHUQRP1rocxnhQYkVwk5T2I_NIMYOaL3ycDa_Mv_u9SfB0hBgcp9cEVU9PoxvlX8TP24rRjJtGVSlt0ina8EFh-20FzlqBPc8OjFjAbjegaynmOtrPOf3hCcrm80ZgS60o4IpOw

{
  "iss": "kentkart.com",
  "sub": "AC16",
  "aud": "aC1un",
  "exp": 1767214800,
  "nbf": 1692968669,
  "iat": 1692968669,
  "jti": "f9c901f2-b183-4566-b20b-a0b4b6bc3425",
  "system_id": "004",
  "scopes": []
}



{
	"id": "004",
	"name": "Kocaeli",
	"lat": "40.759190",
	"lon": "29.943218",
	"initialRegion": {
		"lat": "40.759190",
		"lng": "29.943218"
	},
	"radius": "10",
	"timezone": "Europe/Moscow",
	"visible": 1,
	"mCharge": "4",
	"supportEmail": [
		"bekir.yesil@kentkart.com.tr",
		"mert.yuceer@kentkart.com.tr",
		"ozgurozden@kocaeli.bel.tr",
		"yavuzfirat@kocaeli.bel.tr"
	],
	"supportCCEmail": [
		"mobile@kentkart.com.tr"
	],
	"bicycleUpdateService": "https://e-komobil.com/services/api.php?process=kobis",
	"tRefreshBicycle": 5,
	"tRefreshCarpark": 5,
	"paymentTypes": {
		"creditCard": true,
		"bkmExpress": false,
		"masterPass": false,
		"sadad": false
	},
	"testdynamicQrEnable": "1",
	"testdynamicQrChangeDuration": "10",
	"disableBusCapacity": true,
	***"cacheFlag": "0",***
	"order": 50,
	"panic": "0",
	"trip": "1",
	"nfc": "0",
	"oCharge": "1"
}