import nunjucks from 'nunjucks';
import { change_alias } from './stringUtil';
import { solveEndId } from '../services/areaService'
import siteMapOptionsVI from '../configs/siteMapOptions/vi-VN';
import siteMapOptionsEN from '../configs/siteMapOptions/en-US';

const siteMapOptions = {
    'vi-VN': siteMapOptionsVI,
    'en-US': siteMapOptionsEN
}


export function makeUrlOperator({ from, to, company }, templateKey, language) {
    const nameFrom = change_alias(from.Name);
    const nameTo = change_alias(to.Name);
    const endId = `${solveEndId(from.Type)}${from.URLId || from.Id}t${solveEndId(to.Type)}${to.URLId || to.Id}1`;
    let url = '';
    const busName = change_alias(company.Name)
    url = nunjucks.renderString(siteMapOptions[language]["routes-operator"][templateKey], { busName, fromArea: nameFrom, toArea: nameTo, endId: endId, busId: company.BusOperatorId || company.Id });
    return url;
}

export function makeUrlCommon({ from, to }, templateKey, language) { 
    const nameFrom = change_alias(from.Name);
    const nameTo = change_alias(to.Name);
    const endId = `${solveEndId(from.Type)}${from.URLId || from.Id}t${solveEndId(to.Type)}${to.URLId || to.Id}1`;
    let url = '';    
    url = nunjucks.renderString(siteMapOptions[language]["routes-common"][templateKey], { fromArea: nameFrom, toArea: nameTo, endId: endId });    
    return url;
}

export function makeUrlBus(company, templateKey, language) {
    const busName = company.UrlInfo.replace('xe-', '')
    let url = '';
    url = nunjucks.renderString(siteMapOptions[language].operator[templateKey], { busName });

    return url;
}

export function makeUrlVeXeTet(company, templateKey, language) {
    const busName = company.UrlInfo.replace('xe-', '')
    let url = '';
    url = nunjucks.renderString(siteMapOptionsVI.vexetet[templateKey], { busName });
    return url;
}

export function makeUrlOperatorContact({ company, branchName, type, busOperatorId }, templateKey, language) {
    const busName = company.UrlInfo.replace('xe-', '')
    const branchNameFormatted = change_alias(branchName)
    let url = '';
    url = nunjucks.renderString(siteMapOptions[language]['operator-contact'][templateKey], { busName, branchName: branchNameFormatted, type, id: busOperatorId });
    return url;
}

export function makeUrlNews({ prefix, url, id }, templateKey, language) {
    return nunjucks.renderString(siteMapOptions[language]['news'][templateKey], { prefix, url, id });
}

