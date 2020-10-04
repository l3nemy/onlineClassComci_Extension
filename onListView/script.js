const getType = (target) => {
    return Object.prototype.toString.call(target).slice(8, -1);
}

const comciParse = () => {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({
            action: "comci-parse"
        }, (res) => {
            if (getType(res) == 'Error') {
                reject(res)
            }
            let err = chrome.runtime.lastError
            if (err) {
                reject(err)
            }
            resolve(res)
        });
    })
}

const onListClick = (e) => {
    console.log(e.target)
}

const weekday = {
    "월": 0,
    "화": 1,
    "수": 2,
    "목": 3,
    "금": 4,
    "일": 0,
    "토": 0
}// 토,일 = 0 (다음주 시간표를 표시하기 위함, 토요일만 돼도 지난주 시간표 지워짐 (아마 Not Tested))

const jsDateWeekday = [
    "일",
    "월",
    "화",
    "수",
    "목",
    "금",
    "토"
]

const subject = {
    "기가": ["기술가정", "기술 가정"],
    "창체": ["창의적 체험활동", "창의적체험활동"],
    "스포츠클럽": ["스포", "스포츠"],
    "진로": ["진로와 직업", "진로와직업"],
    "동아리": ["창체"]
}

$(document).ready(() => {
    chrome.storage.local.get((items) => {
        console.log(items)
        let isON = items['isON'],
            school = items['schoolName'],
            grade = items['grade'],
            clas = items['clas']

        console.log(isON, school, grade, clas)
        if (isON && school && grade && clas) {
            var map = new Map(); //<String,HTMLElement>
            $("li.clearfix").each((_, t) => {
                let temp = $(t).find(".tit").text();
                let temp2 = $(t).find(".subject").text();
                temp = `${temp.trim()} ${temp2.trim()}`;
                map[temp] = t;
            });

            console.log(map);

            $("li.clearfix").remove();

            comciParse().then(
                (time) => {
                    console.log(time)
                    // time [학년][반][0~4(월~금 토,일=0)]
                    time[grade][clas][weekday[jsDateWeekday[new Date().getDay()]]]
                        .forEach((c, i) => {
                            let subjects = [];
                            Object.keys(map).forEach((v, ind) => {
                                let res = v.match(c.subject)
                                if (res != null) {
                                    subjects.push(Object.values(map)[ind])
                                }
                            })

                            $("ul.list.al.list_type")
                                .append(subjects)
                        })
                },
                (err) => console.warn(err)
            )
        }
    })
});