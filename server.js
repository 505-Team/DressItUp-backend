'use strict';
require('dotenv').config();
const express = require('express');
const server = express();
const cors = require('cors');
server.use(cors());
const axios = require ('axios');
const mongoose = require('mongoose');


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


//MALAK'S WORK
let PaintingModel;
main().catch(err => console.log(err));

async function main() {
  //لازم اغيرها لما اخلص من الاطلس
  await mongoose.connect(process.env.MONGO_URL);

  const paintingSchema = new mongoose.Schema({
    title: String,
    imgUrl: String,
    painter:String,
    description: String,
    status: String,
    artistDisplay: String,
    ownerEmail: String


  });

  PaintingModel = mongoose.model('Paintin', paintingSchema);
  //call one time then commit it to drevent rebited
  // seedData();
}

// async function seedData() {
//   const CentralPark = new PaintingModel({
//     title: 'Central Park',
//     imgUrl: 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1442582252l/26648244._SX318_.jpg',
//     description: 'Alice and Gabriel have no memory of the night before…yet they won’t forget it any­time soon.New York, 8am. Alice, a young Parisian cop and Gabriel, American jazz pianist, wake up on a bench in Central park hand­cuffed to one another. They don’t know each other and have no memory of having met. The night before, Alice was at a party with her girl­friends on the Champs-Elysées and Gabriel was playing piano in a club in Dublin.Impossible? And yet… So many ques­tions leave them con­founded. How did they get them­selves into such a dan­gerous sit­u­a­tion? Whose blood has stained Alice’s shirt? Why is one bullet missing from her gun?Alice and Gabriel are left with no choice but to team up to figure out what is hap­pening to them and get back to their normal lives. What they are going to dis­cover will turn their lives upside down.',
//     status: 'finished,free',
//     painter: 'meso',
//     ownerEmail: 'malakkhasawneh2@gmail.com'
//   });

//   const MonteCristo = new PaintingModel({
//     title: 'The Count of Monte Cristo',
//     imgUrl: 'https://payload.cargocollective.com/1/6/222472/6354649/jhuusko_montecristo_Front_o.jpg',
//     description: 'Thrown in prison for a crime he has not committed, Edmond Dantes is confined to the grim fortress of If. There he learns of a great hoard of treasure hidden on the Isle of Monte Cristo and he becomes determined not only to escape, but also to unearth the treasure and use it to plot the destruction of the three men responsible for his incarceration. Dumas’ epic tale of suffering and retribution, inspired by a real-life case of wrongful imprisonment, was a huge popular success when it was first serialized in the 1840s.',
//     status: 'finished,free',
//     painter: 'meso',

//     ownerEmail: 'malakkhasawneh2@gmail.com'
//   });
//   const SherlockHolmes = new PaintingModel({
//     title: 'A Study in Scarlet',
//     imgUrl: 'https://m.media-amazon.com/images/I/51JdmxJ8b7L.jpg',
//     description: 'A Study in Scarlet" is the first published story of one of the most famous literary detectives of all time, Sherlock Holmes. Here Dr. Watson, who has just returned from a war in Afghanistan, meets Sherlock Holmes for the first time when they become flat-mates at the famous 221 B Baker Street. In "A Study in Scarlet" Sherlock Holmes investigates a murder at Lauriston Gardens as Dr. Watson tags along with Holmes while narratively detailing his amazing deductive abilities.',
//     status: 'finished,free',
//     painter: 'meso',

//     ownerEmail: 'malakkhasawneh2@gmail.com'
//   });


//   await CentralPark.save();
//   await MonteCristo.save();
//   await SherlockHolmes.save();
// }


//Routes

server.get('/getPainting', getPaintingHandler);
server.post('/addPainting', addPaintingHandler);
server.delete('/deletePainting/:id', deletePaintingHandler);
server.put('/updatePainting/:id',updatePaintingHandler);

//Functions Handlers


function getPaintingHandler(req, res) {
  //send fav books list (email)
  const email = req.query.email;
  PaintingModel.find({ ownerEmail: email }, (err, result) => {
    if (err) {
      console.log(err);
    }
    else {
      res.send(result);
    }
  })
}



async function addPaintingHandler(req, res) {
  console.log(req.body);
  const { title,imgUrl,painter, description,artistDisplay, status, ownerEmail } = req.body;
  await PaintingModel.create({
    title: title,
    imgUrl:imgUrl,
    painter:painter,
    description: description,
    artistDisplay:artistDisplay,
    status: status,
    ownerEmail: ownerEmail
  });

  PaintingModel.find({ ownerEmail: ownerEmail }, (err, result) => {
    if (err) {
      console.log(err);
    }
    else {
      res.send(result);
    }
  })

}

function deletePaintingHandler(req, res) {
  const BookId = req.params.id;
  const email = req.query.email;
  PaintingModel.deleteOne({ _id: BookId }, (err, result) => {

    PaintingModel.find({ ownerEmail: email }, (err, result) => {
      if (err) {
        console.log(err);
      }
      else {
        res.send(result);
      }
    })

  })


}



function updatePaintingHandler(req,res){
  const id=req.params.id;
  const {title,imgUrl,painter,description,artistDisplay,email,status}= req.body;
  PaintingModel.findByIdAndUpdate(id,{title,imgUrl,painter,description,artistDisplay,status},(err,result)=>{
    PaintingModel.find({ownerEmail:email},(err,result)=>{
      if(err)
      {
        console.log(err);
      }
      else{
        console.log(result);
        res.send(result)
      }
    })
  })

}

server.get('*', (req, res) => {
    res.status(500).send('Sory , Page Not found');
});

server.listen(PORT, () => {
    console.log(`im listening on ${PORT}`);
});
