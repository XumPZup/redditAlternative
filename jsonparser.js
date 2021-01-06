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
	document.body.appendChild(div);
	div.appendChild(a);
	br = document.createElement('br');
	div.appendChild(br);
	br = document.createElement('br');
	div.appendChild(auth);
	div.appendChild(br);
	if(!d[i].data.is_self && d[i].data.thumbnail[0] == 'h'){
		try{
			var img = new Image;
			img.setAttribute('referrerpolicy', "no-referrer");
			img.src = d[i].data.thumbnail;
			img.onload = function(){loadImg(d)}
			div.appendChild(img);
		}catch(r){
			console.log(r);
			loadImg();
		}
	}else{loadImg(d)};	
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
		j = data; d=data.data.children;
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