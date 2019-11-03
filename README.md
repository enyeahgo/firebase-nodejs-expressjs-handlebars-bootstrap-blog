# firebase-nodejs-expressjs-handlebars-bootstrap-blog
Good day Mate! This is my personal blog I created from exploring the feature-packed Firebase platform and integrating NodeJs, ExpressJs, Handlebars and Bootstrap with it.

Features:
<ul>
  <li><u><strong>Lightning Fast</strong></u> - one very popular feature of Firebase is its ability to <code>Cache-Control</code> programatically and Google being one of the top IT Companies in the world, you can take advantage of its regional-based and global content-delivery network (CDN) which I promise you will deliver your contents to your audience with a blink of an eye wherever they are in the world. <a href="https://firebase.google.com/docs/hosting/quickstart">Learn More</a></li>
  <li><u><strong>Organized and Structured</strong></u> - by using the NodeJs, ExpressJs, Handlebars and Bootstrap fullstack, this simple blog platform definitely prides itself in terms of organization and structure.</li>
  <li><u><strong>SEO-Ready</strong></u> - Via the magic of Handlebars integrated with this blog platform, your search engine optimization (SEO) cravings will surely be satisfied with ease and automation. No need to explicitly or manually set your meta tags, Handlebars <code>handled</code> it for you so you can focus more on creating rich and engaging blog entries and contents.</li>
</ul>

<hr>

On the onset, we assume that you already have the necessary grasp of knowledge about operating Firebase via your terminal. If not, we highly recommend following this simple <a href="https://firebase.google.com/docs/cli">tutorials</a> on how to use the tools for managing, viewing, and deploying your Firebase projects before proceeding.

Now, let's get on with it. You will need to create your new Firebase project, get its service account json and place it inside <code>/functions</code> folder. Make sure to change the filename of the service account accordingly on your <code>/functions/index.js</code>.

On your Firebase Realtime-database we need to create entries for the following:
<ul>
  <li>Blogs</li>
  <li>Blogs/all</li>
  <li>Blogs/featured</li>
  <li>Blogs/top1</li>
  <li>Blogs/top2</li>
  <li>Resources</li>
  <li>Counters</li>
  <li>Sitemaps</li>
  <li>Tweets</li>
</ul>

A single blog entry we put inside our <code>Blog/all</code>, <code>Blog/featured</code>, <code>Blog/top1</code> or  <code>Blog/top2</code> in our database must include (at a minimum) these data:
<ul>
  <li>author</li>
  <li>avatar</li>
  <li>bid</li>
  <li>category</li>
  <li>catid</li>
  <li>content</li>
  <li>imageURL</li>
  <li>link</li>
  <li>preface</li>
  <li>pubdate</li>
  <li>taglines</li>
  <li>title</li>
  <li>tweetURL</li>
  <li>type</li>
  <li>typeIcon</li>
</ul>

We need to include these keys on every blog entry (json) because the <code>Handlebars</code> template relies highly on the data provided by these keys. Here is an example blog entry as a json object which you can <code>Import</code> for example into your <code>Blogs/all</code> database node.

```
{
  "author" : "THEAUTHOR",
  "avatar" : "/img/techguy.png",
  "bid" : 1,
  "category" : "Websites for Businesses",
  "catid" : "wfb",
  "content" : "<Enter your blog content here. Note that you can include html tags here just make sure to delete empty, trailing and leading spaces so that the content data is a whole compact string.>",
  "imageURL" : "https://images.unsplash.com/photo-1481487196290-c152efe083f5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjkyODE0fQ?fit=crop&w=800&h=600&crop=edges",
  "link" : "/blog/before-you-decide-choosing-your-webhosting-service-provider-in-the-philippines",
  "preface" : "On the hosting side, one thing I should note is that you should select the hosting company that is reliable and loyal to their customers, so that if your domain name is close to end they would try to contact you by all means and NOT let that your domain end and go to private vendue, and you end up paying more than just the reclamation price cost.",
  "pubdate" : "Oct 30, 2019 02:40 PM",
  "taglines" : "domain free, design online, dubai, design online free, domain name free, database, desktop shortcut firefox, easy, earn money, easily, email, ecommerce, easy and free, example, export html, ecommerce free, earn money advertising, email, create e commerce website, create e learning website, create e learning website wordpress, create e-commerce website online, create e commerce website in asp.net, create e business website, create free ecommerce website, create e-commerce website php, free, for free online, for business, for free with free domain name, for my facebook page, free google site, free india, google free, godaddy, google sites, google sites free, github, game, google domain, graphics, g suite",
  "title" : "Before You Decide Choosing Your Webhosting Service Provider in the Philippines",
  "tweetURL" : "https://mobile.twitter.com/mychilisauce/status/1190837439981486081",
  "type" : "New Post",
  "typeIcon" : "ui-2_like"
}
```
