const comciInternalBaseURL = "http://comci.kr:4082"
const comciInternalURL = comciInternalBaseURL + "/st"

chrome.runtime.onMessage.addListener((request, sender, respond) => {
    if (request.action == "comci-parse") {
        console.log("init")
        let schoolName = request.schoolName
        let grade = request.grade
        let clas = request.clas
        chrome.storage.local.get(items => {
            schoolName = request.schoolName || items['schoolName']
            grade = request.grade || items['grade']
            clas = request.class || items['clas']
            console.log(schoolName, grade, clas)

            console.log('internet check')
            internetConnectionCheck().catch(why => {
                console.warn(why)
                respond(why)
                return
            })
            console.log('getting timetable')
            var tt = new Timetable();
            tt.init().then(
                () => tt.setSchool(schoolName)
            ).then(
                () => tt.getTimetable()
            ).then(
                time => {
                    console.log(time)
                    respond(time)
                }
            ).catch(
                e => {
                    console.warn(e)
                    respond(e)
                }
            )
        })

        return true
        //        if (schoolName == null || schoolName == "" || schoolName == undefined) {
        //            chrome.storage.local.get("schoolName", (items) => {
        //                schoolName = items['schoolName']
        //            })
        //        }
        //        if (grade == null || grade == "" || grade == undefined) {
        //           chrome.storage.local.get("grade", (items) => {
        //                grade = items['grade']
        //            })
        //        }
        //        if (clas == null || clas == "" || clas == undefined) {
        //          chrome.storage.local.get("clas", (items) => {
        //                clas = items['clas']
        //            })
        //        }
    }
});