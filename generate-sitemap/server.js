

import express from 'express';
import fs from 'fs';
import bodyParser from 'body-parser';
var path = require('path');
import {
    generateAllSitemap, generateCompanyContact, generateNews, generateCommonSite,
    generateOperatorSite
} from './src/index';
import { get } from './src/utils/progress'
const app = express();
const PORT = process.env.PORT || 4000;

if (!fs.existsSync(`${__dirname}/public`)) {
    fs.mkdirSync(`${__dirname}/public`);
}

app.use(express.static('./public'));
app.use('/frontend', express.static('./src/views'));

app.set('views', path.join(__dirname + '/src', 'views'));
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    res.render('index');
})

app.get('/show', function (req, res) {
    res.render('show')
})

app.get('/api/generateallsitemap', async (req, res) => {
    generateAllSitemap();
    res.send(200)
})

app.get('/api/status', async (req, res) => {
    let job = get('GENERATE_ALL_SITE_MAP');
    res.send({
        data: {
            progress: job.percent,
            executionTime: job.percent != -1 ? ((new Date()).getTime() - job.executionTime) / 1000 : job.executionTime
        }
    })
})


app.get('/api/getDirectory', async (req, res) => {
    let path = req.query.path || '/';
    console.log(req.query.path)
    const serverPath = `${__dirname}/public${path}`;
    console.log('getDirectory', path)
    if (fs.existsSync(serverPath)) {
      
        let files = await fs.readdirSync(serverPath)

       
            let results = []
            for(let i = 0; i< files.length; i++){
                let file = files[i]
                var isDirectory = fs.lstatSync(serverPath + file).isDirectory()
                results.push( await new Promise(async(rs)=>{
                    fs.stat(serverPath + file, function(err,stats){
                        rs({
                            name: file,
                            isDirectory: isDirectory,
                            lastModified:stats.mtime,
                            readFile:path+file,
                            breadcrumb:path,
                            path: isDirectory ? `/api/getDirectory?path=${path}${file}/` : `/api/downloadFile?path=${path}/${file}`
                        }) 
                    });
                }))
              
            }
      
          

   
        res.send(JSON.stringify(results))
    } else {
        res.sendStatus(404)
    }


})



app.get('/api/downloadFile', async (req, res) => {
    const { query: { path } } = req
    if (path) {
        console.log(path)
        const serverPath = `${__dirname}/public${path}`;
        try {
            if (fs.existsSync(serverPath)) {
                res.download(serverPath);
                // res.sendStatus(200)
            } else {
                res.sendStatus(404)
            }
        } catch (err) {
            console.error(err)
            res.sendStatus(404)
        }
    } else {
        res.sendStatus(404)
    }

})

app.get('/api/files', async (req, res) => {
    const path = `${__dirname}/public/`;
    let rs = []
    fs.readdirSync(path).forEach(file => {
        console.log(file)
        var stats = fs.statSync(path + file);
        rs.push({
            name: file,
            lastModified: stats.mtime,
            path: `/api/file/${file}`
        })
    });
    res.send(JSON.stringify(rs))
})

app.get('/api/generateCommonSite', async (req, res) => {
    generateCommonSite()
    res.sendStatus(200)
})

app.get('/api/generateOperatorSite', async (req, res) => {
    generateOperatorSite()
    res.sendStatus(200)
})

app.get('/api/generateCompanyContact', async (req, res) => {
    generateCompanyContact();
    res.sendStatus(200)
})

app.get('/api/generateNews', async (req, res) => {
    generateNews();
    res.sendStatus(200)
})

app.listen(PORT, () => {
    console.log("Server is running at port", PORT);
})