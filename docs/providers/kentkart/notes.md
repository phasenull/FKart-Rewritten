# PHASENULL'S DIARY

abt card = qr card with tickets subs etc (Account Based Ticket).
qr card = nfc card (not available in some regions)



ERRORS:

ERROR_149: QR card does not belong to authenticated account

ERROR_131: You cannot delete your card / ticket because the expiration date has not passed.

404 returns authType:"" (cant find any controller to go through)
404 (deep routing) returns authType:"4" (cant find any route in a controller)

auth types

2 - (
	no proof of its existance other than a huge response time difference in requests
	3 and 4 (along with every other input) takes around 250-300ms to return 33 error with empty token parameter
	while authType 2 takes 400-600ms which could mean it has some type of auth validation other than jwt or more likely, it just validates jwt sessions on every request
)
3 - labeled "AC3" and "AC16", is not "Add Value Machine", can't make PIS requests __anymore__ (returns 113), also can't access GTFS so it cant be "admin", most likely "driver" account
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





https://service.kentkart.com/rl1/web/pathInfo?region=004&displayRouteCode=33&resultType=11111&refresh=-11

for some reason requests take longer when refresh parameter is set to something unique everytime
(37ms to 3.37s)

~~i'd say it has something to do with cacheFlag under city but its set to "0"
maybe its because server sees "0" as true and not 0~~

its kinda acting like a cache system based on a session key
for some reason server returns "code":3,"message":"Sonuç Bulunamadı" when refresh is set to sa

alright it seems they actually did a cache system for /web/pathInfo and used parameters & values as keys so they could serve multiple requests to the same bus more efficiently

passing just & and ending the url also works

or im just completely wrong


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





also /api/route/info

is not
/web/pathInfo

the responses are completely differend and explains why my app wasnt working properly for the last couple days