$(document).ready(() => {
    reload();
    generateSiteMap();
    $('#button').click(onClick)
})

async function getAPI() {
    const data = await fetch("/api/getDirectory")
    const dataJson = await data.json()
    return dataJson
}

function generateSiteMap() {
    $('#tbody').html('');
    getAPI().then(data => {
        showTable(data)
    })
        .catch(err => console.log(err));
}

async function getStatus() {
    const status = await fetch('/api/status')
    const statusJson = status.json();
    return statusJson
}

async function action() {
    await fetch('/api/generateallsitemap')
}

function reload() {
    getStatus()
        .then(status => {
            if (status.data.progress !== -1) {
                progress()
            }
        })
        .catch(err => console.log(err))
}

function progress() {
    var Interval = setInterval(() => {
        getStatus()
            .then((status) => {
                if (status.data.progress >= 0 && status.data.progress <= 100) {
                    $('#button').addClass('disabled')
                    $('#progressbar').css('width', Math.ceil(status.data.progress) + '%')
                    $('#progressbar').html(Math.ceil(status.data.progress) + '%')
                    $('#time').html(`Đã chạy đươc: ${Math.ceil(status.data.executionTime)} s `)
                } else {
                    clearInterval(Interval)
                    $('#progressbar').css('width', '100%')
                    $('#time').html(`Thời gian thực thi lần trước: ${Math.ceil(status.data.executionTime)} s `)
                    $('#progressbar').css('width', '100%')
                    setTimeout(() => {
                        $('#progressbar').css('width', '0%')
                        $('#button').removeClass('disabled')
                    }, 500)
                    generateSiteMap()
                }
            })
    }, 1000)
}
function onClick() {
    action()
        .then(() => progress())
        .catch(err => console.log(err))
}

async function getDirectory(url = '/api/getDirectory') {
    const data = await fetch(url)
    const dataJson = await data.json()
    return dataJson
}
function showFolder(url) {
    $('#tbody').html('')
    $('.breadcrumb').html('')
    getDirectory(url)
        .then(data => {
            breadcrumb(url)
            showTable(data)
        })
}
function readFile(url){
    window.open(url)
}
function showTable(data){
    data.forEach((item, index) => {
        var date = new Date(item.lastModified);
        var month = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
        var seconds = [];
        for (i = 0; i < 60; i++) {
            if (i < 10) {
                seconds[i] = '0' + i
            } else {
                seconds[i] = i
            }
        }
        lastDate = `${date.getDate()}-${month[date.getMonth()]}-${date.getFullYear()} ${date.getHours()}:${seconds[date.getMinutes()]}:${seconds[date.getSeconds()]}`
        $('#tbody').append(`
        <tr ${item.isDirectory ? `onClick= "showFolder('${item.path}')"` : `onClick="readFile('${item.readFile}')"`} href=${item.isDirectory ? "#" : item.readFile }>
        <td>${index + 1}</td>
        <td>${item.isDirectory ? "<i class='fas fa-folder'></i>" :"<i class='fas fa-file-word'></i>"} ${item.name}</td>
        <td>${lastDate}</td>
        <td><a  href=${item.isDirectory ? "#" : item.path}>${item.isDirectory ? " " : "Download"}</a></td>
        </tr>`)
    })
}
function breadcrumb(url){
    num=url.indexOf("=");
            var breadcrumb=url.substring(num+1,url.length).split('/');
            var href="/"
            $('.breadcrumb').append(`
            <li class="breadcrumb-item"><a href="#" onClick="showFolder('/api/getDirectory?path=/')">Home Page</a></li>
            `)
            for(let i=1;i<breadcrumb.length-1;i++){
                href += breadcrumb[i]+"/"
                $('.breadcrumb').append(`
                <li class="breadcrumb-item"><a href="#" onClick="showFolder('/api/getDirectory?path=${href}')">${breadcrumb[i]}</a></li>
                `)
            }
}