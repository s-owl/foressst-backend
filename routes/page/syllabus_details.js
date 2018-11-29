const utils = require("../utils");

const run = function(req, res, next){
	console.log("POST /page/syllabus_details");
	console.log("REMOTE IP : " + req.ip);
	console.log("REMOTE IPS : " + req.ips);

	// 요청으로 넘겨받은 URL 을 사용하여 파싱
	const url = req.body.url;
	console.log(url);

	utils.get(req, res, next, url, true)
		.then((window, rawData) => {

			// 강의 기본정보 파싱
			const about_nav = "table#txtKey > tbody >";
			const about = {
				"year_semester" : window.$(about_nav + "tr:eq(0) > td:eq(1)").text(),
				"subject" : window.$(about_nav + "tr:eq(0) > td:eq(3)").text(),
				"code_clas" : window.$(about_nav + "tr:eq(1) > td:eq(1)").text(),
				"type" : window.$(about_nav + "tr:eq(1) > td:eq(3)").text(),
				"credits" : utils.trim(window.$(about_nav + "tr:eq(1) > td:eq(5)").text()),
				"profesor" : window.$(about_nav + "tr:eq(2) > td:eq(1)").text(),
				"location" : window.$(about_nav + "tr:eq(2) > td:eq(3)").text(),
				"time" : window.$(about_nav + "tr:eq(2) > td:eq(5)").text(),
				"grade_type" : window.$(about_nav + "tr:eq(3) > td:eq(1)").text()
			};

			// 강의 상세정보 파싱
			const info_nav = "table#txtInput > tbody >";
			const info = {
				"lab" : utils.trim(window.$(info_nav + "tr:eq(0) > td:eq(1)").text()),
				"lab_phone" : utils.trim(window.$(info_nav + "tr:eq(0) > td:eq(3)").text()),
				"email" : utils.trim(window.$(info_nav + "tr:eq(0) > td:eq(5)").text()),
				"phone" : utils.trim(window.$(info_nav + "tr:eq(1) > td:eq(1)").text()),
				"homepage" : utils.trim(window.$(info_nav + "tr:eq(1) > td:eq(3)").text()),
				"available_time" : window.$(info_nav + "tr:eq(2) > td:eq(1)").text(),
				"goal" : window.$(info_nav + "tr:eq(3) > td:eq(1)").text(),
				"lecture_manner" : {
					"outline" : window.$(info_nav + "tr:eq(4) > td:eq(2)").text(),
					"manner" : window.$(info_nav + "tr:eq(5) > td:eq(1)").text(),
					"devices" : window.$(info_nav + "tr:eq(6) > td:eq(1)").text()
				},
				"evaluation_criteria" : window.$(info_nav + "tr:eq(7) > td:eq(1)").text(),
				"materials" : window.$(info_nav + "tr:eq(8) > td:eq(1)").text(),
				"note" : window.$(info_nav + "tr:eq(9) > td:eq(1)").text()
			};

			// 강의 주별진도 파싱
			const details = [];
			window.$("#txtInput2 > tbody > tr")
				.each((index, element) => {
					details.push({
						"week" : window.$( element ).children("td:eq(0)").text(),
						"details" : window.$( element ).children("td:eq(1)").text()
					});
				});

			// JSON 으로 처리하여 클라이언트에 응답.
			res.send(JSON.stringify({
				"about" : about,
				"info" : info,
				"details" : details
			}));
		});
};
module.exports = run;
