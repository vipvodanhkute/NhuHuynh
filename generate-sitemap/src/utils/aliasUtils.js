export const addSaiGonArea = (fromToAreas) => {
    let fromSaigonAreas = fromToAreas.filter(({ from }) => {
        return from.Name.includes('ho-chi-minh')
    })
    fromSaigonAreas = fromSaigonAreas.map(({ from, to, ...others }) => ({
        from: {
            ...from,
            Name: 'sai-gon',
        },
        to,
        ...others
    }))
    let toSaigonAreas = fromToAreas.filter(({ to }) => {
        return to.Name.includes('ho-chi-minh')
    })
    toSaigonAreas = toSaigonAreas.map(({ from, to, ...others }) => ({
        from,
        to: {
            ...to,
            Name: 'sai-gon'
        },
        ...others,
    }))
    return [...fromToAreas, ...fromSaigonAreas, ...toSaigonAreas]
}
