const puppeteer = require('puppeteer');

(async () => {
	const browser = await puppeteer.launch({headless: false});
	const page = await browser.newPage();

	// Main Page
	await page.goto('https://primevideo.com');
	await page.click('#av-nav > div > div > span > span > span > a');

	// Login Page
	await page.waitFor('#ap_email');
	await page.$eval('#ap_email', el => el.value = 'rukmangadan91@gmail.com');
	await page.$eval('#ap_password', el => el.value = 'philosopher');
	await page.click('#signInSubmit');

	// Home Page
	await page.waitFor('#av-nav-main-menu > ul > li:nth-child(2) > a');
	await page.goto('https://www.primevideo.com/search/ref=atv_tv_hom_c_vnu0cq_6_smr?_encoding=UTF8&ie=UTF8&phrase=&query=p_n_entity_type%3DTV%20Show%26search-alias%3Dinstant-video%26index%3Deu-amazon-video-other%26adult-product%3D0%26bq%3D%28and%20sort%3A%27featured-rank%27%20av_primary_genre%3A%27av_genre_drama%27%29%26av_offered_in_territory%3DIN%26qs-av_request_type%3D4%26qs-is-prime-customer%3D2');

	for (var pg = 0; pg < 25; pg++){
		for (var i = 1; i <= 20; i++){
			var selector = '#av-result-cards > li:nth-child(' + i.toString() + ') > div > div:nth-child(1) > h2 > a'
			await page.waitFor(selector);
			await page.click(selector);
			
			// Getting Audio Languages
			await page.waitFor('body > div.av-dp-container > div > section > div.avu-full-width.av-meta-info-wrapper > div');
			const element = await page.$('body > div.av-dp-container > div > section > div.avu-full-width.av-meta-info-wrapper > div');
			const jsHandleData = await element.getProperty('innerText');
			const data = await jsHandleData.jsonValue();
			
			var sects = data.split('Audio Languages\t');
			if (hasHindiCharacters(sects[1])){
				var title = await page.title();
				console.log(title);
			}

			await page.goBack();
		}
		await page.waitFor(selector);
		await page.click('#av-pagination > li.av-pagination-next-page > a');
	}

// 	// await browser.close();
})();

function hasHindiCharacters(str){
  return str.split("").filter( function(char){ 
    var charCode = char.charCodeAt(); return charCode >= 2309 && charCode <=2361;
  }).length > 0;
}
