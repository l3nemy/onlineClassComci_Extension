const getType = target => {
    return Object.prototype.toString.call(target).slice(8, -1);
}

const comciParse = () => {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({
            action: "comci-parse"
        }, res => {
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

const rmallspaces = str => str.replace(/\s/g, "");

const pushLink = (name, subjects) => $("ul.rootul")
    .append($('<li></li>')
        .addClass(["clearfix", "class_tag"])
        .append($('<a></a>')
            .css({ width: "100%" })
            .addClass('link_area')
            .append($('<div></div>')
                .addClass("info")
                .append($('<div></div>')
                    .addClass('head')
                    .append($("<p></p>")
                        .addClass(["tit", "bold"])
                        .css({ cursor: "pointer" })
                        .text(name))))
            .append($("<br />"))
            .append($('<ul></ul>')
                .addClass(["list", "al", "list_type"])
                .append(subjects))
        ))

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
    "기가": ["기술가정"],
    "창체": ["창의적체험활동"],
    "스포": ["스포츠", "스포츠클럽"],
    "진로": ["진로와직업"]
}

$(document).ready(() => {
    matched = window.location.href.match("search")
    if (matched != null) {
        return
    }
    chrome.storage.local.get(items => {
        let isON = items['isON'],
            school = items['schoolName'],
            grade = items['grade'],
            clas = items['clas']

        if (isON && school && grade && clas) {
            var map = new Map(); //<String,HTMLElement>
            $("ul.list.al.list_type").addClass("rootul")
            $("li.clearfix").each((_, t) => {
                let temp = $(t).find(".tit").text();
                let temp2 = $(t).find(".subject").text();
                temp = `${temp.trim()} ${temp2.trim()}`;
                map[temp] = $(t).addClass("classli");
            });

            $("li.clearfix").remove();

            comciParse().then(
                (time) => {
                    // time [학년][반][0~4(월~금 토,일=0)]
                    gradeRes = time[grade][clas][weekday[jsDateWeekday[new Date().getDay()]]]
                    gradeRes
                        .forEach((c, i) => {
                            c.subject = rmallspaces(c.subject)
                            let subjects = [];
                            if (c.subject == "")
                                c.subject = "없음"
                            else {
                                let keys = Object.keys(map)
                                let vals = Object.values(map)

                                keys.forEach((v, vi) => {
                                    v = rmallspaces(v)
                                    matched = v.match(c.subject)
                                    if (matched != null) {
                                        subjects.push(vals[vi])

                                        delete map[keys[vi]]
                                    }
                                    else {
                                        Object.values(subject).forEach((sub, si) => {
                                            m = null
                                            sub.forEach(s => {
                                                matched = s.match(v)
                                                if (matched != null) {
                                                    m = Object.keys(subject)[si]
                                                }
                                            })
                                        })
                                        if (m != null) {
                                            matched = v.match(m)
                                            if (match != null) {
                                                subjects.push(vals[vi])

                                                delete map[keys[vi]]
                                            }
                                        }
                                    }
                                })
                            }
                            pushLink(`${i + 1}교시 : ${c.subject}`, subjects)
                            if (i == gradeRes.length - 1) {
                                pushLink('나머지', Object.values(map))
                            }
                        })
                },
                err => console.warn(err)
            )
        }
    })
});