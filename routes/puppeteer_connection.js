module.exports = {
	roundRobin: 0,
	openConnection: async()=>{
		const puppeteer = require("puppeteer-core");
		const addr = process.env.PUPPETEER_REMOTE_URL;

		let url;
		if (addr.startsWith("ws://")) {
			url = addr;
		} else {
			const { Resolver } = require("dns").promises;
			const resolver = new Resolver();
			const query = await resolver.resolveSrv(addr);
			if (roundRobin >= query.length) {
				roundRobin = 0;
			}
			url = "ws://" + query[roundRobin].name + ":" + query[roundRobin].port;
			roundRobin++;
		}
		return await puppeteer.connect({ignoreHTTPSErrors: true,
			browserWSEndpoint: url});
	},
	credentialStringToCookieArray: (credentialStr)=>{
		const credentialArray = [];
		const credentialItems=credentialStr.split(";");
		for(const item of credentialItems){
			const splited=item.split(/=(.+)/);
			const obj = {
				"name":String(splited[0]).trim(),
				"value":String(splited[1]).trim(),
				"domain":"forest.skhu.ac.kr"};
			if(splited[0] != "" && splited[1] != undefined){
				credentialArray.push(obj);
			}
		}
		return credentialArray;
	},
	setAbortCoreSecurityJs: async(page)=>{
		await page.setRequestInterception(true);
		page.on("request", interceptedRequest => {
			// 요청 URL 이 CoreSecurity.js 로 끝나면
			if (interceptedRequest.url().endsWith("CoreSecurity.js")){
				interceptedRequest.abort(); // 요청 탈취하야 취소 처리
			}else{
				interceptedRequest.continue(); // 그 외에는 그대로 진행
			}
		});
	},
};

exports.openConnection = async()=>{
	const puppeteer = require("puppeteer-core");
	const connection = await puppeteer.connect({ignoreHTTPSErrors: true,
		browserWSEndpoint: process.env.PUPPETEER_REMOTE_URL});
	return connection;
};
