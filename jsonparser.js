var j, d;
var after = '';
var url = 'https://www.reddit.com/r/';
var btn = document.getElementById('fetch_btn');
btn.addEventListener('click', start);
var count = 0;
var i = -1;
var refresh = 1;

function loadImg(d){
	i++;
	if(i == d.length){
		refresh = 0
		return;
	};
	div = document.createElement('div');
	a = document.createElement('a');
	a.href = d[i].data.url;
	a.textContent = d[i].data.title;
	a.setAttribute('class', 'title');
	a.setAttribute('target', '_blank');
	auth = document.createElement('a');
	auth.href = 'https://www.reddit.com/u/' + d[i].data.author;
	auth.textContent = 'by u/' + d[i].data.author;
	auth.setAttribute('class', 'author');
	auth.setAttribute('target', '_blank');
	
	more = document.createElement('span')
	more.setAttribute('class', 'more');
	more.textContent = 'READ MORE';
	more.addEventListener('click', show_more);
	// - appends
	document.body.appendChild(div);
	div.appendChild(a);
	br = document.createElement('br');
	div.appendChild(br);
	br = document.createElement('br');
	div.appendChild(auth);
	div.appendChild(br);
	div.setAttribute('id', d[i].data.id);
	div.setAttribute('sub', d[i].data.subreddit);
	div.setAttribute('class', 'basic');
	// -- div append image
	if(!d[i].data.is_self && d[i].data.thumbnail[0] == 'h'){
		try{
			var img = new Image;
			img.setAttribute('referrerpolicy', "no-referrer");
			img.setAttribute('class', 'thumbnail');
			img.src = d[i].data.thumbnail;
			img.onload = function(){loadImg(d)}
			div.appendChild(img);
			div.appendChild(more);
		}catch(r){
			console.log(r);
			loadImg();
		}
	}else{
		div.appendChild(more);;
		loadImg(d)
		};	
}

function show_more(){
	this.setAttribute('class', 'less');
	this.textContent = 'SHOW LESS';
	this.removeEventListener('click', show_more);
	this.addEventListener('click', show_less);
	
	div = this.parentElement;
	if(div.getElementsByClassName('post_info').length){
		div.getElementsByClassName('post_info')[0].style.display = 'block';
		div.setAttribute('class', 'extended');
		return ;
	};
	post_id = div.getAttribute('id');
	sub = div.getAttribute('sub');
	comments_url = 'https://www.reddit.com/r/' + sub + '/comments/' + post_id + '/.json';
	fetch(comments_url)
	.then((res) => {
		if(res.ok){
			console.log(res.ok);
			return res.json();
			}else{
				throw new Error('Error');}})
	.then(data => {
	read_comments(data, div);})
	.catch((error) => {
		console.log(error);
		alert("Something went wrong, maybe you don't have internet connection!\n(Check the console form more informations about the error)")});
}

function show_less(){
	div = this.parentElement
	div.setAttribute('class', 'basic');
	comments_div = div.getElementsByClassName('post_info')[0];
	comments_div.style.display = 'None'
	this.setAttribute('class', 'more');
	this.textContent = 'SHOW MORE';
	this.removeEventListener('click', show_less);
	this.addEventListener('click', show_more);
}

function read_comments(data, div){
	comments = data[1].data.children;
	this_post = data[0].data.children[0]
	comments_div = document.createElement('div');
	comments_div.setAttribute('class', 'post_info');
	div.appendChild(comments_div);
	div.setAttribute('class', 'extended');
	if(this_post.data.selftext.length){
		p = document.createElement('p');
		p.setAttribute('class', 'selftext');
		p.textContent = this_post.data.selftext
		comments_div.appendChild(p)
	}
	if(!this_post.data.is_self){
		var img = new Image;
		img.setAttribute('referrerpolicy', "no-referrer");
		img.setAttribute('class', 'media');
		img.src = this_post.data.url;
		comments_div.appendChild(img);
	}
	if(comments.length > 6){
		lim = 6
	}else{
		lim = comments.length
	}
	for(var i = 0; i < lim; i++){
		a = document.createElement('a');
		a.textContent = 'by u/' + d[i].data.author;
		a.setAttribute('class', 'author');
		a.setAttribute('target', '_blank');
		a.href = 'https://www.reddit.com/u/' + comments[i].data.author;
		p = document.createElement('p');
		p.textContent = comments[i].data.body;
		comments_div.appendChild(a);
		comments_div.appendChild(p);
	}
}


function start(){
	url = 'https://www.reddit.com/r/';
	sort = document.getElementById('sort').value;
	time = document.getElementById('time').value;
	sub = document.getElementById('subreddit').value;	
	random = document.getElementById('random').checked;
	if(random){
		url += sub + '/' + 'randomrising.json?limit=100&count=' + String(count);
	}
	else{
		if(sort == 'top'){
			url += sub + '/' + sort + '/.json?t=' + time + '&limit=100'
		}else{
			url += sub + '/' + sort + '/.json?limit=100';
		}
	}
	console.log(url);
	if(sub != ''){
		fetchJson(url);
	}else{
		alert('Choose a subreddit');
	}
}


function fetchJson(url){
	fetch(url + '&after=' + after)
	.then((res) => {
		if(res.ok){
			console.log(res.ok);
			return res.json();
			}else{
				url = 'https://www.reddit.com/r/';
				throw new Error('Error');}})
	.then(data => {
		j = data; 
		d=data.data.children;
		after = data.data.after;
		i=-1;
		count+=d.length;
		loadImg(d)})
	.catch((error) => {
		console.log(error);
		alert("Subreddit doesn't exist or you don't have internet connection!\n(Check the console form more informations about the error)")});
}



document.body.onscroll = function(){
	if(window.pageYOffset > document.body.scrollHeight - document.body.offsetHeight - 50 && document.body.scrollHeight > 0 && refresh == 0){
		console.log(window.pageYOffset, document.body.scrollHeight - document.body.offsetHeight);
		refresh = 1;
		fetchJson(url);
	}
}