import { sequelize, Sequelize } from './dbService';
import CompanyRoute from '../models/CompanyRoute'
import { findFromToArea } from './areaService'
import Company from '../models/Company';
import { change_alias } from '../utils/stringUtil';
import { set } from '../utils/progress'


const MAX_PROMISE = 3
const MAX_PROMISE_OPERATOR_BRANCH = 1000

export const getCompanyRoutesByCompId = async (allAreas, compId) => {
    return new Promise((rs) => {
        sequelize.query(`
        SELECT c.Id, c.Name, c.BusOperatorId, t.id AS TripId, rd.BusStopId
        FROM company AS c LEFT JOIN trip AS t ON c.id = t.compid  
            LEFT JOIN routedetail AS rd ON t.id = rd.routeid
        WHERE c.isprgstatus = 1 AND c.type = 1 AND t.type = 1 AND rd.status = 1 AND c.id = ${compId}
        `, {
                type: sequelize.QueryTypes.SELECT,
                modal: CompanyRoute,
                logging: false,
            })
            .then(async results => {
                if (results.length < 2) rs(null)
              
                let uniqueBusStopId = []
                let company = {
                    ...results[0],
                    Name: change_alias(results[0].Name)
                }
                results.forEach(element => {
                    if (!uniqueBusStopId.includes(element.BusStopId)) {
                        uniqueBusStopId.push(element.BusStopId)
                    }
                });
                let companyRoutes = []
                let promiseArr = []
                for (let i = 0; i < uniqueBusStopId.length; i++) {
                    for (let j = 0; j < uniqueBusStopId.length; j++) {
                        if (i !== j) {
                            promiseArr.push(findFromToArea({ fromId: uniqueBusStopId[i], toId: uniqueBusStopId[j] }, allAreas))
                        }
                    }
                }
                let values = await Promise.all(promiseArr)
                values.forEach(fromTo => {
                    if (fromTo) {
                        const { from, to } = fromTo
                        companyRoutes.push({ company, from, to })
                    }
                });
                rs(companyRoutes)
            })
    })

}

export const getCompanyRoutes = async (allAreas) => {
    let companies = await getAllCompany();
    companies = companies.slice(0, 10)
    let promiseArr = []
    let companyRoutes = []
    for (let i = 0; i < companies.length; i++) {
        promiseArr.push(getCompanyRoutesByCompId(allAreas, companies[i].Id))
        if (promiseArr.length > MAX_PROMISE || i == companies.length - 1) {
            let rs = await Promise.all(promiseArr)
            rs.forEach(routes => {
                if (routes) {
                    companyRoutes.push(...routes)
                }
            });
            promiseArr = []
            set('GET_COMPANY_ROUTES', i / (companies.length - 1) * 100)
        }
    }

    return companyRoutes;
}

export const getAllCompany = async () => {
    const Op = Sequelize.Op;
    let companies = await Company.findAll(
        {
            attributes: ['Id', 'Type', 'Name', 'UrlInfo'],
            where: { IsPrgStatus: 1, Type: 1, UrlInfo: { [Op.ne]: null } },
        }
    ).map(item => item.toJSON());

    companies = companies.filter(x => x.Name)    

    console.log('companies.length', companies.length)
    return companies;
}

export const getCompanyBranch = async (company) => {
    return new Promise((rs) => {
        sequelize.query(`
        SELECT c.Id, c.Name as BranchName, c.BusOperatorId
        FROM company AS c
        LEFT JOIN area AS a
        ON c.stateid = a.id
        WHERE c.type = 2 AND c.isprgstatus = 1 AND c.baseid = ${company.Id}
        `, {
                type: sequelize.QueryTypes.SELECT,
                logging: false,
            })
            .then(async results => {
                results = results.map(r => ({
                    company,
                    type: 3,
                    branchName: r.BranchName,
                    busOperatorId: r.BusOperatorId || r.Id
                }))
                rs(results)
            })
    })
}

export const getCompanyBranchState = async (company) => {
    return new Promise((rs) => {
        sequelize.query(`
        SELECT  DISTINCT (a.name) AS BranchName, a.Id as BusOperatorId
        FROM company AS c
        LEFT JOIN area AS a
        ON c.stateid = a.id
        WHERE c.isprgstatus = 1 AND c.type = 2 AND a.id IS NOT NULL AND  c.baseId = ${company.Id}
        `, {
                type: sequelize.QueryTypes.SELECT,
                logging: false,
            })
            .then(async results => {
                results = results.map(r => ({
                    company,
                    type: 1,
                    branchName: r.BranchName,
                    busOperatorId: r.BusOperatorId
                }))
                rs(results)
            })
    })
}

export const getAllCompanyBranch = async (companies) => {
    let promiseArr = []
    let companyBranchs = []
    for(let i = 0; i < companies.length; i++){
        promiseArr.push(getCompanyBranch(companies[i]))
        promiseArr.push(getCompanyBranchState(companies[i]))
        if(promiseArr.length > MAX_PROMISE_OPERATOR_BRANCH || i == companies.length - 1){
            let values = await Promise.all(promiseArr)
            values.forEach(value=>{
                companyBranchs.push(...value)
            })
            promiseArr = []
            set('GET_COMPANY_BRANCH', i/(companies.length-1) * 100)
        }
      
    }
    return companyBranchs
}
