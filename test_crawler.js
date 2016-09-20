var http = require('http');
var cheerio = require('cheerio');
var baseUrl = 'http://tieba.baidu.com/f?kw=%E9%87%91%E6%B3%B0%E5%A6%8D&ie=utf-8&pn=';
var pageNumber = [0, 50, 100];

function filterFunc(html) {
	var $ = cheerio.load(html);
	var items = $('.j_thread_list');
	var filterData = [];

	items.each(function(i){
		var item = $(this);
		var comments = item.find('.j_threadlist_li_left span').text();
		var title = item.find('.j_threadlist_li_right .threadlist_title a').text();
		var aData = {
			comments: comments,
			title: title
		}
		// 含有匹配'泰妍'的title
		if(/\u6cf0\u598d/.test(aData.title)){
			filterData.push(aData);
		}
	});

	return filterData;
}

function formatFunc(filterData) {
	filterData.forEach( function(aData,i) {
		if(i === 0 ){
			console.log('=============================\n含有“泰妍”字眼的标题，根据评论数排序如下\n\n('+aData.comments+') '+aData.title+'\n');
		} else {
			console.log('('+aData.comments+') '+aData.title+'\n');
		}
	});
}

function eachPageCrawler(url) {
	return new Promise(function(resolve,reject) {
		http.get(url, function(res){
			var html = '';
			res.on('data', function(data){
				html += data;
			});
			res.on('end', function(){
				resolve(html);
			});
		}).on('error', function(e){
			reject(e);
			console.log('出错！')
		});
	});
}

var htmls = [];

pageNumber.forEach(function(pn){
	htmls.push(eachPageCrawler(baseUrl+pn));
	console.log('crawler for' + baseUrl + pn);
});

Promise
	.all(htmls)
	.then(function(htmls) {
		var filterDatas = [];
		htmls.forEach( function(html) {
			var filterData = filterFunc(html);
			filterDatas = filterDatas.concat(filterData);
		});
		var temp;
		for(var i=0; i<filterDatas.length; i++) {
			for(var j=0; j<filterDatas.length-i-1; j++) {
				if(parseInt(filterDatas[j].comments) < parseInt(filterDatas[j+1].comments)){
					temp = filterDatas[j];
					filterDatas[j] = filterDatas[j+1];
					filterDatas[j+1] = temp;
				}
			}
		}
		formatFunc(filterDatas);
	});