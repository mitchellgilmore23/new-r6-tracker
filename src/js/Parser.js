const cheerio = require('cheerio');
const moment = require('moment');
const matchHistoryRankImgUrl = (cheerioData,arr) => cheerioData(arr).children().eq(3).children().attr('src') || "undefined"
const mainFetchRecordMMrAttr = (cheerioData) => cheerioData("#profile > div.trn-scont.trn-scont--swap > div.trn-scont__aside > div:nth-child(3) > div > div:nth-child(1) > div.r6-quickseason__image > img").attr()
const mainFetchRecordPointAttr = (cheerioData) => cheerioData("#profile > div.trn-scont.trn-scont--swap > div.trn-scont__aside > div:nth-child(2) > div > div:nth-child(1) > div.r6-quickseason__image > img").attr()

export default function () {
 	function main(array,response){
		var cheerioLoad = cheerio.load(array.axiosData.main)
		array.cheerioData.main = []
		cheerioLoad('#profile .trn-card').each((i,arr) => {
			array.cheerioData.main[i] = cheerioLoad(arr).text().replace(/(\n){1,}/gm,'\n').trim().split('\n')
			array.cheerioData.main.forEach((arr,arrI) => arr.forEach((val,valI) =>  {
				array.cheerioData.main[arrI][valI] = val.replace(/^ | $/g,'');
				if (val.length < 1 || val == ' ' || val == '') array.cheerioData.main[arrI].splice(valI,1);
			}))
		})
		array.cheerioData.main[7].unshift(mainFetchRecordMMrAttr(cheerioLoad))
		array.cheerioData.main[6].unshift(mainFetchRecordPointAttr(cheerioLoad))
		array.cheerioData.main.shift()
		array.cheerioData.main[0].unshift(cheerioLoad('.trn-profile-header__name').text().replace(/\n/g,''))
		array.cheerioData.main[0].unshift(response.request.responseURL)
		array.cheerioData.main[0][0] = array.cheerioData.main[0][0].replace('https://tracker-proxy.herokuapp.com/','')
		return array;
	}
	function matches(array) {
		var cheerioLoad = cheerio.load(array.axiosData.matchHistory)
		array.cheerioData.matchHistory = []
		cheerioLoad('tbody > .trn-table__row').each((i,arr) => {
			array.cheerioData.matchHistory[i] = cheerioLoad(arr).text().replace(/(\n){1,}/gm,'\n').trim().split('\n')
			array.cheerioData.matchHistory[i].push(matchHistoryRankImgUrl(cheerioLoad,arr)) //push match history rank img url
			array.cheerioData.matchHistory[i].push(matchHistoryUTCTime(cheerioLoad,arr))// push match history utc time
			array.cheerioData.matchHistory[i].push(moment.utc(matchHistoryUTCTime(cheerioLoad,arr)).fromNow()) //push match history readable time
		})
		array.cheerioData.matchHistory.forEach((arr,arrI) => arr.forEach((val,valI) =>  {
			array.cheerioData.matchHistory[arrI][valI] = val.replace(/^ | $/g,'')
			if (val.length < 1 || val == ' ' || val == '') array.cheerioData.matchHistory[arrI].splice(valI,1)
		}))
		array.cheerioData.matchHistory.shift()
		return array;
	}
 	function seasons(array) { 
	var cheerioLoad = cheerio.load(array.axiosData.seasonsHistory)
	array.cheerioData.seasons = []
	cheerioLoad('#profile .trn-card').each((i,arr) => {
		array.cheerioData.seasons[i] = cheerioLoad(arr).text().replace(/(\n){1,}/gm,'\n').trim().split('\n')
		array.cheerioData.seasons.forEach((arr,arrI) => arr.forEach((val,valI) =>  {
		array.cheerioData.seasons[arrI][valI] = val.replace(/^ | $/g,'')
		if (val.length < 1 || val == ' ' || val == '') array.cheerioData.seasons[arrI].splice(valI,1)
		}))
	})
	array.cheerioData.seasons.shift()
	return array;
	}
	return {main,matches,seasons}
}

function matchHistoryUTCTime(cheerioData,arr) {
	if (cheerioData(arr).children().children().eq(0).attr('v-human-time')) {
		return cheerioData(arr).children().children().eq(0).attr('v-human-time').replaceAll("'",'')
	} else return "undefined"
}
