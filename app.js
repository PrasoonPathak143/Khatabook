const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get("/", (req,res) => {
    fs.readdir(`./files`, function(err, files){
        res.render("index", {files});
    })
});

app.get("/edit/:filename", (req,res) => {
    fs.readFile(`./files/${req.params.filename}`, "utf-8", function(err, data){
        if(err){
            res.send("Somehting went wrong");
        }
        else{
            res.render("edit", {data, filename: req.params.filename});
        }
    })
});

app.post("/update/:filename", (req,res) => {
    fs.writeFile(`./files/${req.params.filename}`, req.body.filedata, function(err){
        if(err){
            res.send("Somehting went wrong");
        }
        else{
            res.redirect("/");
        }
    })
});

app.get("/delete/:filename", (req,res) => {
    fs.unlink(`./files/${req.params.filename}`, function(err){
        if(err){
            res.send("Somehting went wrong");
        }
        else{
            res.redirect("/");
        }
    })
});

app.get("/create", (req, res) => {
    const today = new Date();

    // Extract the day, month, and year
    const day = String(today.getDate()).padStart(2, '0'); // Ensure two digits
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = today.getFullYear();
    const data = "";

    const fn = `${day}-${month}-${year}`;
    fs.writeFile(`./files/${fn}.txt`, "", function(err){
        if(err){
            return res.send("something went wrong");
        }
        else{
            res.render(`edit`,  {data, filename: `${fn}.txt`});
        }
    })

})

app.listen(3000);