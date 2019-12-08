
import {
    getFromToAreaFromRedis, findFromToArea,
} from './areaService'
import siteMapOptionsVI from '../configs/siteMapOptions/vi-VN';
import siteMapOptionsEN from '../configs/siteMapOptions/en-US';
import { set } from '../utils/progress'
import {
    makeUrlCommon,
} from '../utils/urlUtil';
import { writeResult, writeResultCategory } from '../services/ioService'



const MAX_PROMISE_FROM_TO_AREAS = 500;
const MAX_PROMISE_MAKE_FILE_CHILD = 200;

const REGEX = {
    'vi-VN': (name) => new RegExp(`tu-${name}-di`, 'g'),
    'en-US': (name) => new RegExp(`from-${name}-to`, 'g')
}

export const generateSiteMap2 = async (allOfArea, areas) => {
    let fromToAreas = []
    let promiseArr = []
    for (var i = 0; i < areas.length; i++) {
        promiseArr.push(getFromToAreaFromRedis(areas[i][0].Id))
        if (promiseArr.length > MAX_PROMISE_FROM_TO_AREAS || i == areas.length - 1) {
            let values = await Promise.all(promiseArr)
            values.forEach(element => {
                if (element != null) {
                    fromToAreas.push(...element)
                }
            });
            promiseArr = []
            set('FROM_TO_AREAS', i / areas.length * 80)
        }

    }


    promiseArr = []
    fromToAreas.forEach(fromToArea => {
        promiseArr.push(findFromToArea(fromToArea, allOfArea))
    });
    fromToAreas = await Promise.all(promiseArr)
    fromToAreas = fromToAreas.filter(fromTo => fromTo !== null)
    console.log('fromToAres', fromToAreas.length)
    set('FROM_TO_AREAS', 100)
    return fromToAreas
}


export const genCommonSite = async (fromToAreas) => {
    return new Promise(async (rs) => {
        let arrKeyViCommon = Object.keys(siteMapOptionsVI["routes-common"]);
        let arrKeyEnCommon = Object.keys(siteMapOptionsEN["routes-common"]);
        //VI
        let files = []
        for (var i = 0; i < arrKeyViCommon.length; i++) {
            let url = await genCommonSiteByTemplate(arrKeyViCommon[i], fromToAreas, 'vi-VN')
            files.push(url)
            set('GEN_COMMON_SITE', i / (arrKeyViCommon.length - 1) * 50)
        }

        //US
        for (var i = 0; i < arrKeyEnCommon.length; i++) {
            let url = await genCommonSiteByTemplate(arrKeyEnCommon[i], fromToAreas, 'en-US')
            files.push(url)
            set('GEN_COMMON_SITE', 50 + i / (arrKeyEnCommon.length - 1) * 100)
        }
        rs(files)
    })

}

const genCommonSiteByTemplate = async (template, fromToAreas, language) => {
    return new Promise(async (rs) => {
        let arrFrom = [];
        let URLs = [];
        fromToAreas.forEach(({ from, to }) => {
            URLs.push(makeUrlCommon({ from, to }, template, language));
            if (!arrFrom.find(element => element.Id == from.Id)) {
                arrFrom.push(from)
            }
        })

        let arrPromiseMakeFile = [];
        let arrFiles = []

        for (var j = 0; j < arrFrom.length; j++) {
            let regex = REGEX[language](arrFrom[j].Name)
            let URLsInFile = URLs.filter(url => url.match(regex));
            let dir = `./public/sitemap/${template}`;
            let fileName = `${template}-${arrFrom[j].Name}-${arrFrom[j].Id}`
            arrPromiseMakeFile.push(writeResult(dir, URLsInFile, fileName));
            if (arrPromiseMakeFile.length > MAX_PROMISE_MAKE_FILE_CHILD || j == arrFrom.length - 1) {
                let files = await Promise.all(arrPromiseMakeFile);
                arrFiles.push(...files)
                arrPromiseMakeFile = [];
            }
        }
        // ghi file muc luc
        rs(await writeResultCategory('./public/sitemap', arrFiles, template))
    })

}