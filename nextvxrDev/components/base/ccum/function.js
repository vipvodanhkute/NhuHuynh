async function getAPICCUM(){
    const result = await fetch('http://ddragon.leagueoflegends.com/cdn/6.24.1/data/vn_VN/champion.json')
    const data = await result.json()
    return data
}
export default getAPICCUM;