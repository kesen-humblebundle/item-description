Description Service for HumbleBundle item page clone

[![Build Status](https://travis-ci.org/KichiUeda/Rane-app-description-service.svg?branch=master)](https://travis-ci.org/KichiUeda/Rane-app-description-service)

Trello board: https://trello.com/b/jXtaAGh1/description-service

### Endpoints

base url: http://ec2-54-224-38-115.compute-1.amazonaws.com:5150/
<br>
<br>
<br>

---

GET `/description/:product_id`\
product_id\
&ensp; Number\
&ensp; Identifies the id number of the product being requested

Returns a `JSON object` with the product_id, title, descriptions, and genres.

```JSON
{
    "product_id": 1,
    "title": "Cool Game",
    "description": "This is a cool game about a cool gal who does cool stuff",
    "genre": ["action", "RPG"]
}
```

---

GET `description/title/:product_id`\
product_id\
&ensp; Number\
&ensp; Identifies the id number of the product being requested

Returns a `string` containing the title for the game with `product_id`

---
