# firebase-nodejs-expressjs-handlebars-bootstrap-blog
Hello. This is my personal blog I created from exploring the feature-packed Firebase platform and integrating NodeJs, ExpressJs, Handlebars and Bootstrap with it.

You will need to create your new Firebase project, get its service account json and place it inside <code>/functions</code> folder. Make sure to change the filename of the service account accordingly on your <code>/functions/index.js</code>.

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

A single blog entry must in the database must include (at a minimum) these data:
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

We need to include these keys on every blog entry (json) because the handlebars templates relies highly on the data provided by these keys.
