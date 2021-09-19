'use strict';

require('dotenv').config();
const express = require('express');
const server = express();
const cors = require('cors');
server.use(cors());
const axios = require ('axios');


// to access req.body
server.use(express.json());

const PORT = process.env.PORT;



// http://localhost:3030/
server.get('/', (req, res) => {
    res.send('Hello, welcome at Home page');
});

// http://localhost:3030/art
server.get('/art', artFunction);

function artFunction(req, res) {

    let pageNumber = req.query.pageNumber;

    const requestUrl = `https://api.artic.edu/api/v1/artworks?page=${pageNumber}`;
    // console.log(pageNumber);
    

    axios
        .get(requestUrl)
        .then(result => {
            const arrayOfArts = result.data.data.map(artObject => {
                return new Art(artObject);
                //  console.log(arrayOfArts);
            })
            res.send(arrayOfArts);
            console.log(arrayOfArts);

        })
        .catch(err => {
            res.status(404).send('the page not found');
        })
};

server.get('*', (req, res) => {
    res.status(500).send('Sory , Page Not found');
});


class Art {
    constructor(item) {
        this.id = item.id;
        this.title = item.title;
        this.date_display = item.date_display;
        this.artist_display = item.artist_display;
        this.image_url = `https://www.artic.edu/iiif/2/${item.image_id}/full/843,/0/default.jpg`;
        this.provenance_text=item.provenance_text;
        this.place_of_origin= item.place_of_origin;
        this.medium_display=item.medium_display;
        this.fiscal_year=item.fiscal_year;
        this.colorfulness=item.colorfulness;
    }
}

server.listen(PORT, () => {
    console.log(`im listening on ${PORT}`);
});

