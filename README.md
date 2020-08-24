# Description Service for HumbleBundle item page clone

Tickets: https://trello.com/b/ucesbil9/christina-item-description

## System requirements

This project uses PostgreSQL. Please ensure PostgreSQL v12 is installed and running prior to complete these steps.

## Environment variables

The environmental variables below are required to run this project. Please set them in your environment or place them in a `.env` file in the root directory. The .env file has been `.gitignore`d for your convenience.

```
PORT=3003
PGDATABASE=desc_service
PGPORT=5432
PGHOST=localhost
PGUSER=your_user
PGPASSWORD=your_password
```

## Installing and running

The following steps should allow you to run this project locally.

1. Clone/download this repo
2. Add the above-mentioned environmental variables
3. Create `desc_service` database using:
```bash
createdb desc_service         # From CLI, or

CREATE DATABASE desc_service  # From psql
```
4. Run install and start scripts

```bash
        npm install         # install dependencies
        npm run seed        # build and seed DB tables

        # For development
        npm run react:dev   # start webpack in watch mode
        npm run server:dev  # start nodemon

        # For production build
        npm run build      # create production build
        npm run start      # start node server
```

## Endpoints

### ~~base url: http://ec2-54-224-38-115.compute-1.amazonaws.com:5150/~~

---

### GET `/description/:product_id`
product_id\
&ensp; Number\
&ensp; Identifies the id number of the product being requested

Returns a `JSON object` with the product_id, title, descriptions, and genres.

#### Example output

```javascript
// for /description/1

{
    "product_id": 1,
    "title": "Cool Game",
    "description": "This is a cool game about a cool gal who does cool stuff",
    "genre": ["action", "RPG"]
}
```

---

### GET `/description/title/:product_id`

product_id\
&ensp; Number\
&ensp; Identifies the id number of the product being requested

Returns a `string` containing the title for the game with `product_id`

#### Example output

```javascript
// for /description/title/21

"Cool Game"
```

---

### GET `/description/title?id=#`

Can include as many id queries as needed with `&` between them

Returns an array of `JSON objects` with the product id and the title for each requested item.

#### Example output

```javascript
// for /description/title?id=1&id=7

[
  {
    "product_id": 1,
    "title": "Quibusdam Eaque Et Cumque Facere"
  },
  {
    "product_id": 7,
    "title": "Commodi Et Nihil Eligendi Dolorem"
  }
]
```

---

### GET `genre/:product_id`

product_id\
&ensp; Number\
&ensp; Identifies the id number of the product being requested

Returns an array of genre names for the provided product id.

#### Example output

```javascript
// for genre/7

[
  "Indie",
  "Racing",
  "RPG"
]
```
