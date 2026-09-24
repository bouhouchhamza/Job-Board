const express = require('express');
const app = express();

app.use(express.urlencoded({extended : true}));
app.use((req, res, next)=>{
    console.log("Request received: ", req.method, req.url);
    next();
})
app.post("/admin/offers", (req,res)=>{
    console.log(req.body);
    res.send("Data recue");
})

app.get('/admin/offers/new',(req,res)=>{
    res.send(`
            <form action="/admin/offers" method='POST'>
                <input type="text" name="titre" placeholder="Titre" />
                <input type="text" name="ville" placeholder="Ville" />
                <button type="submit">Ajouter</button>
            </form>
        `);
})
app.get('/',(req,res)=>{
    res.send('Job Board srever in running');
});
app.get('/offer/:id',(req,res)=>{
    console.log(req.params.id);
    res.send(`Offer numéro ${req.params.id}`)
})
app.get('/offers',(req,res)=>{
    console.log(req.query);
    console.log(req.query.ville);
    console.log(req.query.type);
    res.send('List des offers');
})
app.listen(3000,()=>{
    console.log('server is running on port 3000');
});