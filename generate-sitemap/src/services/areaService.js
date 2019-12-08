import { Sequelize, checkExistsRedis, redisClient as client } from './dbService';
import Area from '../models/Area';
import { change_alias } from '../utils/stringUtil';
import { set } from '../utils/progress'

const checkRedis = true;
const MAX_ELEMENT = 100000;

export const prepareAreas = async () => {
    set('PREPARE_AREAS', 0)
    let allAreas = await getAllAreas();
    set('PREPARE_AREAS', 25)
    allAreas = getRootAreas(allAreas);
    set('PREPARE_AREAS', 50)
    allAreas = formatName(allAreas)
    set('PREPARE_AREAS', 75)
    const areas = allAreas.slice(0, 1)
    // const areas = allAreas.slice(0, 10)
    set('PREPARE_AREAS', 100)
    return { allAreas, areas }
}

export const getAllAreas = async () => {
    const Op = Sequelize.Op;
    let arrAreas = await Area.findAll(
        {
            attributes: ['Id', 'Type', 'Name', 'baseId', 'stateId', 'CityId', 'URLId', 'IsPrgStatus'],
            where: { IsPrgStatus: 1, baseId: { [Op.ne]: null }, Type: { [Op.in]: [3, 5, 15] } },
            // limit: 75,
        }
    ).map(item => {
        return item.toJSON();
    });
    return arrAreas;
}


export const getRootAreas = (arrAreas) => {
    const arrRootAreas = [];
    for (var i of arrAreas) {
        const eachAreaRoot = [{
            Id: i.Id,
            Name: i.Name,
            Type: i.Type,
            BaseId: i.baseId,
            URLId: i.URLId
        }]
        if (i.baseId === 1926) { // tinh/thanhpho
            arrRootAreas.push({
                Id: i.Id,
                Name: i.Name,
                Type: i.Type,
                BaseId: i.baseId,
                URLId: i.URLId
            });
        }
        else {
            let result = reverse(arrAreas, eachAreaRoot, i.baseId);
            arrRootAreas.push(result);
        }
    }
    return arrRootAreas;
}


// Error Cannot read property of 'Id' of undefined xảy ra có thể do cha nó có type ngoài 3,5,15 nên đã bỏ đi rồi
export const reverse = (arrAreas, eachAreaRoot, baseId) => {
    let nextArea = null;
    let flag = true;
    try {
        while (flag) {
            nextArea = arrAreas.find(item => item.Id == baseId);

            if (nextArea != undefined) {
                eachAreaRoot.push({
                    Id: nextArea.Id,
                    Name: nextArea.Name,
                    Type: nextArea.Type,
                    BaseId: nextArea.baseId,
                    URLId: nextArea.URLId
                })

                if (nextArea.baseId == 1926 || nextArea.baseId == null) {
                    flag = false;
                } else {
                    return reverse(arrAreas, eachAreaRoot, nextArea.baseId);
                }
                flag = false;
            } else {
                flag = false
            }
        }
        return eachAreaRoot;
    } catch (e) {
        console.log(e);
    }
    return eachAreaRoot;
}

export const formatName = (areas) => {
    for (let i = 0; i < areas.length; i++) {
        if (areas[i][0].Type == 5 && areas[i].length > 1) {
            areas[i][0].Name = `${areas[i][0].Name} ${areas[i][areas[i].length - 1].Name}`
        }
    }
    return areas;
}

async function generateSiteMap(allOfArea, areas) {
    let date = new Date();
    let arrCheck = [];
    let promiseArr = []
    console.time()
    for (var i = 0; i < areas.length; i++) {
        for (var j = 0; j < allOfArea.length; j++) {
            if (allOfArea[j] != undefined) {
                if (allOfArea[j][allOfArea[j].length - 1].Id != areas[i][areas[i].length - 1].Id) {
                    let URL = null;
                    if (checkRedis) {
                        promiseArr.push(checkExistsRedis(`Route:${areas[i][0].Id}:${allOfArea[j][0].Id}`, { from: areas[i][0], to: allOfArea[j][0] }))
                    }
                    else {
                        URL = makeUrl(areas[i][0], allOfArea[j][0])
                    }
                }
            }
        }
        if (promiseArr.length > MAX_ELEMENT || i === areas.length - 1) {
            let values = await Promise.all(promiseArr)
            values.forEach(res => {
                if (res) {
                    const { from, to } = res
                    arrURL.push(makeUrl(from, to))
                }
            });
            console.log('percent: ', i / areas.length * 100, '%')
            promiseArr = []
        }

    }
    console.log(arrURL.length);
    console.timeEnd()
    return { arrURL }
}

export const getFromToAreaFromRedis = (id) => {
    return new Promise(function (rs, rj) {
        client.keys(`Route:${id}:*`, function (err, userKeys) {
            if (err) {
                console.log(err)
                rs(null)
            }
            let arr = []
            userKeys.forEach(key => {
                arr.push({ fromId: id, toId: key.split(':')[2] })
            })
            rs(arr)
        })
    })
}

export function findFromToArea({ fromId, toId }, allOfArea) {
    return new Promise(function (rs) {
        let from = allOfArea.find(x => x[0].Id === fromId && [3, 5, 15].includes(x[0].Type))
        let to = allOfArea.find(x => x[0].Id === toId && [3, 5, 15].includes(x[0].Type))
        if (from && to && (from[from.length - 1].Id !== to[to.length - 1].Id)) {
            rs({ from: { ...from[0], Name: change_alias(from[0].Name) }, to: { ...to[0], Name: change_alias(to[0].Name) } })
        } else {
            rs(null)
        }
    })
}


export const solveEndId = (typeId) => {
    if (typeId == 3) return 1;
    if (typeId == 5) return 2;
    else return 3;
}