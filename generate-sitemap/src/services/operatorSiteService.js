import siteMapOptionsVI from '../configs/siteMapOptions/vi-VN';
import siteMapOptionsEN from '../configs/siteMapOptions/en-US';
import {
    makeUrlOperator
} from '../utils/urlUtil';
import { writeResult, writeResultCategory } from '../services/ioService'
import { set } from '../utils/progress'

const MAX_PROMISE_MAKE_FILE_CHILD = 100;
const REGEX = {
    'vi-VN': (name) => new RegExp(`-${name}-tu`, 'g'),
    'en-US': (name) => new RegExp(`-${name}-from`, 'g')
}

export const genOperatorSite = async (companyRoutes) => {
    return new Promise(async (rs) => {
        let arrKeyViOperator = Object.keys(siteMapOptionsVI["routes-operator"]);
        let arrKeyEnOperator = Object.keys(siteMapOptionsEN["routes-operator"]);
        let files = []
        //VI
        for (var i = 0; i < arrKeyViOperator.length; i++) {
            let url = await genOperatorSiteByTemplate(arrKeyViOperator[i], companyRoutes, 'vi-VN')
            files.push(url)
            set('GEN_OPERATER_SITE', i / (arrKeyViOperator.length - 1) * 50)
        }

        //EN
        for (var i = 0; i < arrKeyEnOperator.length; i++) {
            let url = await genOperatorSiteByTemplate(arrKeyEnOperator[i], companyRoutes, 'en-US')
            files.push(url)
            set('GEN_OPERATER_SITE', i / (arrKeyEnOperator.length - 1) * 100)
        }

        rs(files)
    })

}


const genOperatorSiteByTemplate = async (template, companyRoutes, language) => {
    return new Promise(async (rs) => {
        let companies = [];
        let URLs = [];
        companyRoutes.forEach(({ from, to, company }) => {
            URLs.push(makeUrlOperator({ from, to, company }, template, language));
            if (!companies.find(x => x.Id == company.Id)) {
                companies.push(company)
            }
        })
        let arrPromiseMakeFile = [];
        let arrFiles = []
        for (var j = 0; j < companies.length; j++) {
            let regex = REGEX[language](companies[j].Name)
            let URLsInFile = URLs.filter(url => url.match(regex));
            let dir = `./public/sitemap/${template}`;
            let fileName = `${template}-${companies[j].Name}-${companies[j].Id}`
            arrPromiseMakeFile.push(writeResult(dir, URLsInFile, fileName));
            if (arrPromiseMakeFile.length > MAX_PROMISE_MAKE_FILE_CHILD || j == companies.length - 1) {
                let files = await Promise.all(arrPromiseMakeFile);
                arrFiles.push(...files)
                arrPromiseMakeFile = [];
            }
        }
        // ghi file muc luc
        rs(await writeResultCategory('./public/sitemap', arrFiles, template))
    })

}