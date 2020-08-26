# System Design for Humble Bundle clone's Description service

**Author**: [Christina Wang](https://github.com/cywang117)

**Tickets**: https://trello.com/b/ucesbil9/christina-item-description

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
  - If using Mac, run these commands to seed the database instead:
      ```bash
        sudo npm i -g knex
        npm run seed:internal
      ```
  - If you encounter seeding issues, please ensure that your postgres account as listed in your .env file has superuser privileges.
    - [List PostgreSQL users](https://www.postgresqltutorial.com/postgresql-list-users/)
    - [Alter PostgreSQL user role](https://www.postgresql.org/docs/12/sql-alterrole.html)
    - [Create PostgreSQL user](https://www.postgresql.org/docs/12/sql-createuser.html)

    Note that SQL commands may be executed from within the psql CLI tool:
    ```bash
      psql -U your_username
    ```

## Endpoints

### ~~base url: http://ec2-54-224-38-115.compute-1.amazonaws.com:5150/~~

---

### GET `/description/:product_id`
- product_id\
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

### POST `/description`

- POST body:
  ```javascript
      {
        title: String,
        description: String,
        genres: Array[String]
      }
  ```

Returns a text message (`response.text`) indicating success or failure of POST request.

---

### PUT `/description/:product_id`
- product_id\
&ensp; Number\
&ensp; Identifies the id number of the product being requested

- PUT body:
  ```javascript
  // One or more fields may be sent with the PUT request. Fields that are not included will not be changed (behaves like a PATCH request)
      {
        title: String,
        description: String,
        genres: Array[String]
      }
  ```

Returns a text message (`response.text`) indicating success or failure of PUT request.

---

### DELETE `/description/:product_id`

Note that deleting a product will also delete all its genres in the `games_genres` join table.

- product_id\
&ensp; Number\
&ensp; Identifies the id number of the product being requested

Returns a text message (`response.text`) indicating success or failure of DELETE request.

---

### GET `/description/title/:product_id`

- product_id\
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

### GET `/genre/:product_id`

- product_id\
&ensp; Number\
&ensp; Identifies the id number of the product being requested

Returns an array of genre names for the provided product id.

#### Example output

```javascript
// for /genre/7

[
  "Indie",
  "Racing",
  "RPG"
]
```

---

### GET `/genre/genres`

Returns an array of all valid genres currently available.

#### Example output

```javascript
// /genre/genres

[
  "Indie",
  "Racing",
  "RPG"
]
```

---

### POST `/genre/:product_id`

- product_id\
&ensp; Number\
&ensp; Identifies the id number of the product being requested

- POST body:
  ```javascript
  {
    genre: String
  }
  ```
Returns a message for the following conditions:
- Successful POST
- Invalid product id
- Invalid genre (not in list of all valid genres specified in `/genre/genres` endpoint)

Returns a JSON if valid product id and genre, but genre already exists:
```javascript
// For a game with PID 1 & genres ['Action', 'Adventure']

// POST { genre: 'Action' }

{
  error: 'Genre Action already exists for product id 1.',
  validGenres: [
    'FPS',
    'Indie',
    ... // All valid genres aside from Action or Adventure
  ]
}
```

---

### DELETE `/genre/:product_id`

- product_id\
&ensp; Number\
&ensp; Identifies the id number of the product being requested

Returns a message for the following conditions:
- Successful DELETE
- Invalid product id
- Invalid genre (not in list of all valid genres specified in `/genre/genres` endpoint)

Returns a JSON if valid product id and genre, but genre doesn't exist:
```javascript
// For a game with PID 1 & genres ['Action', 'Adventure']

// DELETE { genre: 'Puzzle' }

{
  error: 'Genre Puzzle doesn\'t exist for product id 1.',
  validGenres: [
    'Action',
    'Adventure'
  ]
}
```

---

## Attributions

Legacy codebase: https://github.com/KichiUeda/Rane-app-description-service

Legacy codebase author: [Rane Wallin](https://github.com/RaneWallin)
