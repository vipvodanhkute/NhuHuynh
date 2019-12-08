import { sequelizeFE } from './dbService';

export const getAllNews = async() => {
    return new Promise((rs) => {
        sequelizeFE.query(`
        SELECT c.alias AS prefix, n.alias AS url, n.id
        FROM news AS n
        LEFT JOIN newscategories AS c
        ON n.newscategoryid = c.id
        WHERE n.isdeleted = 0 AND n.notshow = 0 AND c.isdeleted = 0 AND c.alias IS NOT null
        `, {
                type: sequelizeFE.QueryTypes.SELECT,
                logging: false,
            })
            .then(async results => {
                rs(results)
            })
    })
}