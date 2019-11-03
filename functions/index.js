// Firebase-NodeJs-ExpressJs-Handlebars-Bootstrap Blog Platform
// Author: Inigo Orosco II
// Github: https://github.com/enyeahgo
// Twitter: https://mobile.twitter.com/mychilisauce

const functions = require('firebase-functions');
const firebase = require('firebase-admin');
const serviceAccount = require("./service-account-filename.json");
const path = require('path');
const express = require('express');
const hbs = require('handlebars');
const engines = require('consolidate');
const datetime = require('helper-date');
const fs = require('fs');
const request = require('request');

const firebaseapp = firebase.initializeApp({
	credential: firebase.credential.cert(serviceAccount),
	databaseURL: "https://firebase-project-name.firebaseio.com"
});

const app = express();
const blog = express();
const blogcategory = express();

///// blog
blog.engine('hbs', engines.handlebars);
blog.set('views', './views');
blog.set('view engine', 'hbs');

blog.get('/blog/:blogid', (req, res) => {
	res.set('Cache-Control','public, max-age=300, s-max-age=600');
	
	blog_id = req.params.blogid;
	
	getBlog(blog_id).then(data => {
		getHitCounters().then(hit => {
			getSubsCounters().then(subs => {
				getTweets3().then(tweets => {
					res.render('blog', {
						title:data.title,
						preface:data.preface,
						category:data.category,
						link:data.link,
						tags:data.taglines,
						pubdate:data.pubdate,
						type:data.type,
						typeIcon:data.typeIcon,
						imageURL:data.imageURL,
						avatarURL:data.avatar,
						author:data.author,
						tweetURL:data.tweetURL,
						content:data.content,
						shorttweets: tweets,
						hitcount: hit.count,
						subscount: subs.count
					});
					var oldhit = hit.count;
					var newhit = oldhit+1;
					firebaseapp.database().ref('Counters/hitcount/count').set(newhit);
				})
			});
		});
	});
});

// GET BLOG DATA
function getBlog(blogid){
	const ref = firebaseapp.database().ref('Blogs/all/'+blogid);
	return ref.once('value').then(snap => snap.val());
}

///// END OF blog

///// app
app.engine('hbs', engines.handlebars);
app.set('views', './views');
app.set('view engine', 'hbs');

// app
app.get('/', (req, res) => {
	res.set('Cache-Control', 'public, max-age=300, s-max-age=600');
	let bgURL = getBgUrl();
	let mainTitle = getMainPageTitle();
	let wisequote = getWiseQuote();
	
	getTop1().then(res1 => {
		getTop2().then(res2 => {
			getFeaturedBlogs().then(res3 => {
				getHitCounters().then(hit => {
					getSubsCounters().then(subs => {
						getTweets10().then(thetweets => {
							getTweets3().then(shorttweets => {
								res.render('index', {
									top1:res1,
									top2:res2,
									featured:res3,
									hitcount: hit.count,
									subscount: subs.count,
									maintitle: mainTitle,
									bgURL: bgURL,
									quote: wisequote,
									thetweets: thetweets,
									shorttweets: shorttweets
								});
								var oldhit = hit.count;
								var newhit = oldhit+1;
								firebaseapp.database().ref('Counters/hitcount/count').set(newhit);
							});
						});
					});
				});
			});
		});
	});
});

// TOP BLOGS
function getTop1(){
	const ref = firebaseapp.database().ref('Blogs/top1');
	return ref.once('value').then(snap => snap.val());
}
function getTop2(){
	const ref = firebaseapp.database().ref('Blogs/top2');
	return ref.once('value').then(snap => snap.val());
}
function getFeaturedBlogs(){
	const ref = firebaseapp.database().ref('Blogs/featured');
	return ref.orderByKey().once('value').then(snap => snap.val());
}

// RESOURCES ELEMENTS
app.get('/resources/:rid', (req, res) => {
	res.set('Cache-Control', 'public, max-age=300, s-max-age=600');
	r_id = req.params.rid;
	let imageURL = getBgUrl();
	
	getResourceData(r_id).then(data => {
		getHitCounters().then(hit => {
			getSubsCounters().then(subs => {
				getTweets3().then(tweets => {
					res.render('resources', {
						title:r_id,
						imageURL: imageURL,
						data: data,
						hitcount: hit.count,
						subscount: subs.count,
						shorttweets: tweets
					});
					var oldhit = hit.count;
					var newhit = oldhit+1;
					firebaseapp.database().ref('Counters/hitcount/count').set(newhit);
				});
			});
		});
	});
	
});

function getResourceData(rid){
	const ref = firebaseapp.database().ref('Resources');
	return ref.orderByChild('rid').equalTo(rid).once('value').then(snap => snap.val());
}

// SUBSCRIBED
app.get('/subscribed/:email', (req, res) => {
	email = req.params.email;
	res.render('subscribed', {
		email:email
	});
});

// SITEMAP
app.get('/sitemap', (req, res) => {
	getSitemaps().then(sitemaps => {
		res.contentType('application/xml');
		res.render('sitemap', {
			sitemaps:sitemaps
		});
	});
});
function getSitemaps(){
	const ref = firebaseapp.database().ref('Sitemaps');
	return ref.once('value').then(snap => snap.val());
}

///// END OF app

///// blogcategory
blogcategory.engine('hbs', engines.handlebars);
blogcategory.set('views', './views');
blogcategory.set('view engine', 'hbs');

// GET blogcategory title
let getCategoryTitle = (cat_id) => {
	if(cat_id=='wfb'){
		return "Websites for Businesses";
	} else if(cat_id=='seo'){
		return "Search Engine Optimization";
	}  else if(cat_id=='bwd'){
		return "Basic Website Design";
	}  else if(cat_id=='dm'){
		return "Digital Marketing";
	}  else if(cat_id=='ko'){
		return "Keywords Optimization";
	} else {
		return "Category";
	}
}

blogcategory.get('/blogcategory/:catid', (req, res) => {
	res.set('Cache-Control', 'public, max-age=300, s-max-age=600');
	cat_id = req.params.catid;
	let imageURL = getBgUrl();
	
	let category = getCategoryTitle(cat_id);
	
	getBlogsOfCategory(cat_id).then(data => {
		getHitCounters().then(hit => {
			getSubsCounters().then(subs => {
				getTweets3().then(tweets => {
					res.render('blogcategory', {
						data: data,
						hitcount: hit.count,
						subscount: subs.count,
						shorttweets: tweets,
						category:category,
						catid:cat_id,
						imageURL: imageURL
					});
					var oldhit = hit.count;
					var newhit = oldhit+1;
					firebaseapp.database().ref('Counters/hitcount/count').set(newhit);
				});
			});
		});
	});
});

function getBlogsOfCategory(catId){
	const ref = firebaseapp.database().ref('Blogs/all');
	return ref.orderByChild('catid').equalTo(catId).once('value').then(snap => snap.val());
}
///// END OF blogcategory

///// GET COUNTERS
function getHitCounters(){
	const ref = firebaseapp.database().ref('Counters/hitcount');
	return ref.once('value').then(snap => snap.val());
}
function getSubsCounters(){
	const ref = firebaseapp.database().ref('Counters/subscount');
	return ref.once('value').then(snap => snap.val());
}
///// GET TWEETS
function getTweets10(){
	const ref = firebaseapp.database().ref('Tweets/last10');
	return ref.orderByKey().once('value').then(snap => snap.val());
}
function getTweets3(){
	const ref = firebaseapp.database().ref('Tweets/last3');
	return ref.once('value').then(snap => snap.val());
}

// HANDLEBAR HELPERS
hbs.registerHelper('substring', function( string, start, end ) {
    var theString = string.substring( start ,end );
    if( string.length > end ) {
      theString += '';
    }
    return new hbs.SafeString(theString);
});

// LOGIC OPERATORS
hbs.registerHelper('ifeq', function (a, b, options) {
    if (a == b) { return options.fn(this); }
    return options.inverse(this);
});

hbs.registerHelper('ifnoteq', function (a, b, options) {
    if (a != b) { return options.fn(this); }
    return options.inverse(this);
});

// DATE
hbs.registerHelper('date', require('helper-date'));

// SIZE OF ARRAY
hbs.registerHelper('sizeof', function(viewer){
	return viewer.length;
});
// DEBUGGER
hbs.registerHelper('debug', function (context) {
  return new hbs.SafeString(
    '<div class="debug">' + JSON.stringify(context) + '</div>'
  );
});
hbs.registerHelper('toupper', function(str) {
  return str.toUpperCase();
});

///// END OF HANDLEBAR HELPERS

// MY PRESET BACKGROUND IMAGE URLS FROM UNSPLASH
let getBgUrl = () => {
	let bgs = [
		'https://images.unsplash.com/photo-1526415634669-2f8899c7b517?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjkyODE0fQ?fit=crop&w=800&h=600&crop=edges',
		'https://images.unsplash.com/photo-1562534352-3a9f3c8b9698?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjkyODE0fQ?fit=crop&w=800&h=600&crop=edges',
		'https://images.unsplash.com/photo-1543966888-6e858b90d30d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjkyODE0fQ?fit=crop&w=800&h=600&crop=edges',
		'https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjkyODE0fQ?fit=crop&w=800&h=600&crop=edges',
		'https://images.unsplash.com/photo-1514559127497-120ad02d917c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjkyODE0fQ?fit=crop&w=800&h=600&crop=edges',
		'https://images.unsplash.com/photo-1502882705085-fd1fd2ecefd0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjkyODE0fQ?fit=crop&w=800&h=600&crop=edges',
		'https://images.unsplash.com/photo-1518448828347-28e2cf0d6e28?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjkyODE0fQ?fit=crop&w=800&h=600&crop=edges',
		'https://images.unsplash.com/photo-1501620179241-af8dc008d34c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjkyODE0fQ?fit=crop&w=800&h=600&crop=edges',
		'https://images.unsplash.com/photo-1455139960217-3de50ca3bc8c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjkyODE0fQ?fit=crop&w=800&h=600&crop=edges',
		'https://images.unsplash.com/17/unsplash_525f012329589_1.JPG?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjkyODE0fQ?fit=crop&w=800&h=600&crop=edges',
		'https://images.unsplash.com/photo-1423784346385-c1d4dac9893a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjkyODE0fQ?fit=crop&w=800&h=600&crop=edges',
		'https://images.unsplash.com/photo-1532550943366-2b5e0759c233?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjkyODE0fQ?fit=crop&w=800&h=600&crop=edges',
		'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjkyODE0fQ?fit=crop&w=800&h=600&crop=edges',
		'https://images.unsplash.com/photo-1453928582365-b6ad33cbcf64?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjkyODE0fQ?fit=crop&w=800&h=600&crop=edges',
		'https://images.unsplash.com/photo-1417733403748-83bbc7c05140?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjkyODE0fQ?fit=crop&w=800&h=600&crop=edges',
		'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjkyODE0fQ?fit=crop&w=800&h=600&crop=edges',
		'https://images.unsplash.com/19/desktop.JPG?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjkyODE0fQ?fit=crop&w=800&h=600&crop=edges',
		'https://images.unsplash.com/photo-1457305237443-44c3d5a30b89?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjkyODE0fQ?fit=crop&w=800&h=600&crop=edges',
		'https://images.unsplash.com/photo-1558459654-c430be5b0a44?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjkyODE0fQ?fit=crop&w=800&h=600&crop=edges',
		'https://images.unsplash.com/photo-1533709752211-118fcaf03312?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjkyODE0fQ?fit=crop&w=800&h=600&crop=edges',
		'https://images.unsplash.com/photo-1544105263-534f1b0a4d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjkyODE0fQ?fit=crop&w=800&h=600&crop=edges',
		'https://images.unsplash.com/photo-1565360805465-62345562c8ec?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjkyODE0fQ?fit=crop&w=800&h=600&crop=edges',
		'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjkyODE0fQ?fit=crop&w=800&h=600&crop=edges',
		'https://images.unsplash.com/photo-1549031246-69b96df24876?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjkyODE0fQ?fit=crop&w=800&h=600&crop=edges'
		];
	let rand = Math.floor(Math.random() * Math.floor(bgs.length));
	return bgs[rand];
};

// GET TITLE FOR appPAGE
let getMainPageTitle = () => {
	let titles = [
		'Build Your Next Website Here',
		'Expand Your Market',
		'Build Your Business Online Profile',
		'Create Your Website Easily',
		'Evolve With the Trend',
		'Search Engine Optimization',
		'Search Engine Marketing',
		'Business Website Should Not be that Expensive',
		'Be Heard. Be Seen. Be Felt.',
		'Rank Up on Search Engines and Expect Positive Results',
		'Need help setting-up your website?',
		'Information is the Key',
		'If you\'re not in the internet, you\'re not in business'
		];
	let rand = Math.floor(Math.random() * Math.floor(titles.length));
	return titles[rand];
};

// GET WISE QUOTE
let getWiseQuote = () => {
	var contents = fs.readFileSync('./quotes.json').toString();
	let quotes = JSON.parse(contents);
	let rand = Math.floor(Math.random() * Math.floor(quotes.length));
	let text = quotes[rand]['quoteText'];
	let author = quotes[rand]['quoteAuthor'];
	return text+' - '+author;
};

exports.blog = functions.https.onRequest(blog);
exports.app = functions.https.onRequest(app);
exports.blogcategory = functions.https.onRequest(blogcategory);
