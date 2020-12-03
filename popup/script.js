const comciInternalBaseURL = "http://comci.kr:4082"
const comciInternalURL = comciInternalBaseURL + "/st"

const errNoTab = new Error("No Tab Found"),
    errNoID = new Error("Tab Found but No ID"),
    errInvalidTab = new Error("Selected Invalid Tab");

var xx = null;

function SwitchState() {
    chrome.storage.local.get("isON", items => {
        items['isON'] ? $("#need-to-hide").show() : $("#need-to-hide").hide()
        $("#activate").prop("checked", items['isON'])
    })

    $("#activate").change(() => {
        chrome.storage.local.set({
            isON: $("#activate").prop("checked"),
        }, () => { });
        if ($("#activate").prop("checked")) {
            $("#need-to-hide").show("slow")
        } else {
            $("#need-to-hide").hide("slow")
        }
    })
}

function School() {
    chrome.storage.local.get(items => {
        $("#school").val(items.schoolName)
        $("#grade").val(items.grade)
        $("#clas").val(items.clas)
    })
    $("#school").on("change", e => {
        e.preventDefault()
        console.log("school changed")
        $(".err").remove()
        $("#school").css("border-bottom-color", "white")

        internetConnectionCheck().catch(why => {
            $("#g-c").after($("<p></p>").addClass("err").text(why).css({
                opacity: 0,
                color: "red"
            }).animate({
                opacity: 1
            }, 200))
            return
        })
        let tt = new Timetable()
        tt.init().then(() => {
            tt.setSchool($("#school").val()).then(() => {
                chrome.storage.local.set({
                    schoolName: $("#school").val()
                }, () => { })
            }).catch(why => {
                $("#school").animate({
                    borderBottomColor: "red"
                }, 500)

                $("#g-c").after($("<p></p>").addClass("err").text(why).css({
                    opacity: 0,
                    color: "red"
                }).animate({
                    opacity: 1
                }, 200))
            })
        }).catch(why => {

            $("#g-c").after($("<p></p>").addClass("err").text(why).css({
                opacity: 0,
                color: "red"
            }).animate({
                opacity: 1
            }, 200))
        })
        chrome.storage.local.set({
            schoolName: $("#school").val()
        })
    })
    $("#grade").on("change", e => {
        e.preventDefault()
        chrome.storage.local.set({
            grade: $("#grade").val().toString()
        }, () => { })
    })
    $("#clas").on("change", e => {
        e.preventDefault()
        chrome.storage.local.set({
            clas: $("#clas").val().toString()
        }, () => { })
    })
}

$(document).ready(() => {
    SwitchState();
    School();
})