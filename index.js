import express from "express"
import ejs from "ejs"
import axios from "axios";
import 'dotenv/config';

const SERVER_PORT = 3000;
const API_KEY = process.env.API_KEY;
const APP_ID = process.env.APP_ID;

console.log(API_KEY);
console.log(APP_ID);

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
    const post_age = req.post_Age;

    try {
        const result = await axios.get(`https://api.adzuna.com/v1/api/jobs/${job_country}/search/1`, {
            params: {
                app_id: APP_ID,
                app_key: API_KEY,
                what: job_title,
                max_days_old: post_age,
                results_per_page: 30
            }
        });

        const job_posts = result.data.results;
        var job_list = [];

        job_posts.forEach(job => {
            const location_str = `${job.location.display_name}, ${job.location.area[1]}, ${job.location.area[0]}`;
            job_list.push({
                "title": job.title,
                "company": job.company.display_name,
                "location": location_str,
                "created": new Date(job.created).toISOString().split('T')[0],
                "description": job.description,
                "redirect_url": job.redirect_url,
            });
        });

        res.render("job_listing.ejs", {listings: job_list});
    } catch (error) {
        console.log(error.message)
    }
});

app.listen(SERVER_PORT, () => {
    console.log("Server listening on port " + SERVER_PORT);
});