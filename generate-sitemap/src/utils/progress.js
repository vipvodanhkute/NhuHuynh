
var TASKS = {
    PREPARE_AREAS: 0,
    FROM_TO_AREAS: 0,
    GEN_COMMON_SITE: 0,
    GET_COMPANY_ROUTES: 0,
    GEN_OPERATER_SITE: 0,
    GEN_BUS: 0,
    GEN_VEXETET: 0,
    GET_COMPANY_BRANCH: 0,
    GEN_OPERATOR_CONTACT: 0,
    GEN_NEWS: 0,
}

var _ = {
    GENERATE_ALL_SITE_MAP: {
        percent: -1,
        executionTime: null,
        tasks: [
            'PREPARE_AREAS',
            'FROM_TO_AREAS',
            'GEN_COMMON_SITE',
            'GET_COMPANY_ROUTES',
            'GEN_OPERATER_SITE',
            'GEN_BUS',
            'GEN_VEXETET',
            'GET_COMPANY_BRANCH',
            'GEN_OPERATOR_CONTACT',
            'GEN_NEWS'
        ]
    },
    GENERATE_COMMON_SITE_MAP: {
        percent: -1,
        executionTime: null,
        tasks: [
            'PREPARE_AREAS',
            'FROM_TO_AREAS',
            'GEN_COMMON_SITE',
        ]
    }
}

export const set = (key, value) => {
    TASKS[key] = value
    console.log(key, value)
    calculateProgress(key)
}

export const get = (key) => {
    if (!key) return _
    return _[key]
}

export const reset = (job) => {
    Object.keys(TASKS).forEach(task => { TASKS[task] = 0 })
    Object.keys(_).forEach(key => { _[key].percent = -1 })

}
export const start = (job) => {
    if (job) {
        _[job].executionTime = (new Date()).getTime();
        console.log('start ',job)
    }
}
export const finish = (job) => {
    if (job) {
        if (_[job].executionTime) {
            _[job].executionTime = ((new Date()).getTime() - _[job].executionTime) / 1000
        } 
        _[job].percent = -1;
        console.log('finish ',job)
    }
}

const calculateProgress = (keyJob) => {
    let keys = Object.keys(_)
    keys.forEach(key => {
        if (_[key].tasks.includes(keyJob)) {
            let percent = 0;
            _[key].tasks.forEach(taskKey => {
                percent += TASKS[taskKey]
            });
            _[key].percent = percent / (_[key].tasks.length * 100) * 100
            console.log('cal ', key, ' ', _[key].percent)
        }
    })
}