import express from "express"
import ejs from "ejs"
import axios from "axios";

const SERVER_PORT = 3000;

var app = express();

app.set("view engine", ejs);

// Middleware stuff
app.use(express.static("public"))
app.use(express.json());
app.use(express.urlencoded({ extended:true }));

app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.post("/submit", async (req, res) => {
    console.log(req.body);
    const job_title = req.body.job_Title;
    const job_country = req.body.job_Country;

    try {
        const result = await axios.get(`https://api.adzuna.com/v1/api/jobs/${job_country}/search/1`, {
            params: {
                app_id: "3b3f62bc",
                app_key: "88faf6ea39c17d6e714c4ae6f70c2f4d",
                what: job_title
            }
        });
        console.log(result.data)
    } catch (error) {
        console.log(error.message)
    }
});

app.listen(SERVER_PORT, () => {
    console.log("Server listening on port " + SERVER_PORT);
});