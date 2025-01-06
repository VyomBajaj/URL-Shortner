const URL = require('../models/url.js')
const shortid = require('shortid');

async function handleGenerateShortURL(req,res){
    const id = shortid()
    const body = req.body;
    if(!body.url){
        return res.status(400).json({error:"No url given"});
    }

    await URL.create({
        shortId:id,
        redirectUrl:body.url,
        visitHistory : []
    })

    return res.render('home',{
        id:id
    })

}

async function handleGetAnalytics(req, res) {
    const shId = req.params.shortId;
    console.log("shortId received:", shId);

    const result = await URL.findOne({ shortId: shId });

    if (!result) {
        return res.status(404).json({ error: "Short URL not found" });
    }

    return res.json({
        clicks: result.visitHistory.length,
        analytics: result.visitHistory
    });
}


module.exports = {
    handleGenerateShortURL,
    handleGetAnalytics
}