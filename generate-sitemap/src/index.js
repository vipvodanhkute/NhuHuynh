import { connect } from './services/dbService';
import fs from 'fs';
import siteMapOptionsVI from './configs/siteMapOptions/vi-VN';
import siteMapOptionsEN from './configs/siteMapOptions/en-US';
import {
    prepareAreas,
} from './services/areaService'
import { writeResult, writeResultCategory } from './services/ioService'
import {
    getCompanyRoutes, getAllCompany,
    getAllCompanyBranch
} from './services/companyService'
import {
    getAllNews
} from './services/newsService'
import { set, reset, start, finish, get } from './utils/progress';
import {
    makeUrlBus, makeUrlVeXeTet,
    makeUrlOperatorContact, makeUrlNews
} from './utils/urlUtil';
import { generateSiteMap2, genCommonSite } from './services/commonSiteService'
import { genOperatorSite } from './services/operatorSiteService'
import { addSaiGonArea } from './utils/aliasUtils'

const MAX_PROMISE_MAKE_FILE_CHILD = 200;
let COMPANY_PERCENT = -1;

connect();

async function generateAllSitemap() {
    try {
        if (get('GENERATE_ALL_SITE_MAP').percent != -1) {
            return
        }
        console.time('GENERATE_ALL_SITE_MAP')
        reset('GENERATE_ALL_SITE_MAP');
        start('GENERATE_ALL_SITE_MAP');

        let categories = []
        let { areas, allAreas } = await prepareAreas();

        // Generate common key
        let fromToAreas = await generateSiteMap2(allAreas, areas);
        // console.log(fromToAreas); 
        fromToAreas = addSaiGonArea(fromToAreas)
        let commonSites = await genCommonSite(fromToAreas);
        categories.push(...commonSites)

        //Generate operator key    
        let companyRoutes = await getCompanyRoutes(allAreas)
        companyRoutes = addSaiGonArea(companyRoutes)
        let operatorSites = await genOperatorSite(companyRoutes);
        categories.push(...operatorSites)

        // //Generate bus key
        let companies = await getAllCompany();
        let busSites = await genBus(companies);
        categories.push(...busSites)

        // //Generate Vexetet key
        let vexetetSites = await genVeXeTet(companies);
        categories.push(...vexetetSites)
        // generate operator contact
        let operatorContacts = await getAllCompanyBranch(companies)
        let operatorContactSites = await genOperatorContact(operatorContacts)
        categories.push(...operatorContactSites)

        let news = await getAllNews()
        let newsSites = await genNews(news)
        categories.push(...newsSites)

        await writeResultCategory('./public', categories, 'sitemap')
        console.log('Saved main category')
        console.timeEnd('GENERATE_ALL_SITE_MAP')
        finish('GENERATE_ALL_SITE_MAP')
    } catch (err) {
        console.log('err', err)
        reset('GENERATE_ALL_SITE_MAP');
        finish('GENERATE_ALL_SITE_MAP');
        console.timeEnd('GENERATE_ALL_SITE_MAP')
    };

}

async function generateCommonSite() {
    try {
        if (get('GENERATE_COMMON_SITE_MAP').percent != -1) {
            return
        }

        reset('GENERATE_COMMON_SITE_MAP');
        start('GENERATE_COMMON_SITE_MAP')
        let { areas, allAreas } = await prepareAreas();

        // Generate common key
        let fromToAreas = await generateSiteMap2(allAreas, areas);
        // console.log(fromToAreas);   
        let commonSites = await genCommonSite(fromToAreas);
        console.log('commonSites', commonSites)

        finish('GENERATE_COMMON_SITE_MAP')
    } catch (err) {
        console.log('err', err)
        reset('GENERATE_COMMON_SITE_MAP');
        finish('GENERATE_COMMON_SITE_MAP')
    };
}

async function generateOperatorSite() {
    let { areas, allAreas } = await prepareAreas();
    //Generate operator key    
    let companyRoutes = await getCompanyRoutes(allAreas)
    let files = await genOperatorSite(companyRoutes);
    console.log('genOperatorSite', files)
}

async function generateCompanyContact() {
    let companies = await getAllCompany()
    let operatorContacts = await getAllCompanyBranch(companies)
    console.log('operatorContacts.length', operatorContacts.length)
    await genOperatorContact(operatorContacts)
}

async function generateNews() {
    let news = await getAllNews()
    console.log('news.length', news.length)
    await genNews(news)
}

async function genBus(companies) {
    return new Promise(async (rs) => {
        let busSites = []
        const keyVi = Object.keys(siteMapOptionsVI.operator)[0], keyUs = Object.keys(siteMapOptionsEN.operator)[0]
        let URLsVi = [], URLsUs = [];
        for (var i = 0; i < companies.length; i++) {
            URLsVi.push(makeUrlBus(companies[i], keyVi, 'vi-VN'))
            URLsUs.push(makeUrlBus(companies[i], keyUs, 'en-US'))
        }
        set('GEN_BUS', 50)
        let dir = `./public/sitemap`;
        busSites.push(await writeResult(dir, URLsVi, keyVi))

        set('GEN_BUS', 75)
        busSites.push(await writeResult(dir, URLsUs, keyUs))
        set('GEN_BUS', 100)
        rs(busSites)
    })

}

async function genVeXeTet(companies) {
    return new Promise(async (rs) => {
        const keyVXT = Object.keys(siteMapOptionsVI.vexetet)[0];
        let URLs = [];
        for (var i = 0; i < companies.length; i++) {
            URLs.push(makeUrlVeXeTet(companies[i], keyVXT, 'vi-VN'))
        }
        set('GEN_VEXETET', 50)
        let dir = `./public/sitemap`;

        let vexetetSite = await writeResult(dir, URLs, keyVXT)
        set('GEN_VEXETET', 100)
        rs([vexetetSite])
    })

}

async function genOperatorContact(operatorContacts) {
    return new Promise(async (rs) => {
        const keyVI = Object.keys(siteMapOptionsVI['operator-contact'])[0];
        const keyEN = Object.keys(siteMapOptionsEN['operator-contact'])[0];
        let URLs = [];
        let operatorContactSites = []
        operatorContacts.forEach(operatorContact => {
            URLs.push(makeUrlOperatorContact(operatorContact, keyVI, 'vi-VN'))
        })
        let dir = `./public/sitemap`;
        operatorContactSites.push(await writeResult(dir, URLs, keyVI))

        set('GEN_OPERATOR_CONTACT', 25)

        URLs = []
        operatorContacts.forEach(operatorContact => {
            URLs.push(makeUrlOperatorContact(operatorContact, keyEN, 'en-US'))
        })
        set('GEN_OPERATOR_CONTACT', 50)

        operatorContactSites.push(await writeResult(dir, URLs, keyEN))
        set('GEN_OPERATOR_CONTACT', 100)
        rs(operatorContactSites)
    })

}


async function genNews(news) {
    return new Promise(async (rs) => {
        const keyNews = Object.keys(siteMapOptionsVI.news)[0];
        let URLs = [];
        news.forEach(element => {
            URLs.push(makeUrlNews(element, keyNews, 'vi-VN'))
        })
        set('GEN_NEWS', 50)
        let dir = `./public/sitemap`;
        let newsSites = await writeResult(dir, URLs, keyNews)
        set('GEN_NEWS', 100)
        rs([newsSites])
    })


}


export const getStatus = () => {
    return COMPANY_PERCENT;
}

// generateAllSitemap()

export {
    generateAllSitemap, COMPANY_PERCENT, generateCompanyContact, generateNews, generateCommonSite,
    generateOperatorSite
};


