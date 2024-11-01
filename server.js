/*********************************************************************************
*  WEB422 – Assignment 2
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Luwam Goitom-Worre Student ID: 156652224 Date: 10/18/2024
*  Cyclic Link: https://movies-api-git-master-luwams-projects.vercel.app/
*
********************************************************************************/ 


const path = require('path');
const express = require('express'); // "require" the Express module
const cors = require('cors');
const dotenv = require('dotenv');
const MoviesDB = require("./modules/moviesDB")
const db = new MoviesDB();
const app = express(); // obtain the "app" object
const HTTP_PORT = process.env.PORT || 3000; // assign a port

app.use(cors());
dotenv.config();
app.use(express.json());
// start the server on the port and output a confirmation to the console
//app.listen(HTTP_PORT, () => console.log(`server listening on: ${HTTP_PORT}`));

//app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{
    
    console.log("Initialized");
    
    app.post('/api/movies', async (req, res) => {
        
        try{
            const newMovie = await db.addNewMovie(req.body);
            res.status(201).json(newMovie);
            
            
        }
        catch (error){
            console.error(error);
            res.status(500).json({message: "Movie could not be added"});
        }
        
    });
    
    app.get('/api/movies', async (req, res) => {
        const {page, perPage, title} = req.query;
        
        try{
            const movies = await db.getAllMovies(page, perPage, title);
            res.status(200).json(movies);
        }
        catch (error){
            console.error(error);
            res.status(500).json({message: "movies could not be retrieved"});
        }
    });
    
    app.get('/api/movies/:id', async (req, res) => {
        //const {page, perPage, title} = req.query;
        
        try{
            const movie = await db.getMovieById(req.params.id);
            
            if(movie){
                res.status(200).json(movie);
                
            } else {
                res.status(404).json({message: "movie not found"});
            }
        }
        catch (error){
            console.error(error);
            res.status(500).json({message: "movie could not be retrieved"});
        }
    });
    
    app.put('/api/movies/:id', async (req, res) => {
        try{
            const updated = await db.updateMovieById(req.body, req.params.id);
            
            if (updated.nModified > 0){
                res.status(204).send();
            } else {
                res.status(404).json({message: "movie not found"});
            }
        }
        catch (error){
            console.error(error);
            res.status(500).json({message: "movie could not be retrieved"});
        }
    });
    
    app.delete('/api/movies/:id', async(req, res) => {
        try {
            const result = await db.deleteMovieById(req.params.id);
            
            if (result.deletedCount > 0){
                res.status(204).send();
            } else {
                res.status(404).json({message: "movie not found"});
            }
        }
        catch (error){
            console.error(error);
            res.status(500).json({message: "movie could not be deleted"});
        }
    });
    
    app.listen(HTTP_PORT, ()=>{
        console.log(`server listening on: ${HTTP_PORT}`);
    });
    
}).catch((err)=>{
    console.error("database could not be initialized", err);
});
