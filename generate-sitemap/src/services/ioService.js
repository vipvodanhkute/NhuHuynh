
import builder from 'xmlbuilder';
import fs, { writeFile } from 'fs';

export const writeResult = (dir, URLs, key) => {
    return new Promise((rs) => {
        const date = new Date();
        // const { arrURL } = rs;

        console.log("Build xml ", key);

        let root = builder.create('urlset')
            .att('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9')
            .att('xmlns:xsi', 'http://www.w3.org/2001/XMLSchema-instance')
            .att('xsi:schemaLocation', 'http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd')

        URLs.forEach(url => {
            root.ele('url')
                .ele('loc', url)
                .up()
                .ele('lastmod', date.toISOString().slice(0, 10))
                .up()
                .ele('changefeq', 'weekly')
                .up()
                .ele('priority', 0.5)
        })

        root.root().end({ pretty: true });

        console.log("Writing file ", key);


        if (!fs.existsSync('./public')) {
            fs.mkdirSync('./public');
        }


        if (!fs.existsSync('./public/sitemap')) {
            fs.mkdirSync('./public/sitemap');
        }

        if (!fs.existsSync(`${dir}`)) {
            fs.mkdirSync(`${dir}`);
        }

        // let dir = `./public/${folderName}/${key}.xml`
        fs.writeFile(`${dir}/${key}.xml`, root, (err) => {
            if (err) {
                console.log(err);
                rs(err)
            }
            console.log('Saved!', key);
            rs(`${dir}/${key}.xml`.replace('./public', 'https://vexere.com'))
        })
    })
}

export const writeResultCategory = (dir, files, fileName) => {
    return new Promise((rs) => {
        const date = new Date();

        let root = builder.create('sitemapindex')
            .att('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9')
        files.forEach(file => {
            root.ele('sitemap')
                .ele('loc', `${file}`)
                .up()
                .ele('lastmod', date.toISOString().slice(0, 10))
        })

        root.root().end({ pretty: true });

        if (!fs.existsSync(`${dir}`)) {
            fs.mkdirSync(`${dir}`);
        }


        fs.writeFile(`${dir}/${fileName}.xml`, root, (err) => {
            if (err) {
                console.log(err);
            }
            console.log('Saved!', `${dir}/${fileName}.xml`);
            rs(`${dir}/${fileName}.xml`.replace('./public', 'https://vexere.com'))
        })
    })
}