/* 
	Lib: Infographic SVG
	Author: Luiz Cruz 
	Year: 2015
*/

function doGraph(t,e,o,c,r){var i,l,n,s="",h=0;itens=t;var d=1,g=1;for(countColor=1,indexCount=0;itens>0;)resto=d%(e+1),0==resto&&(g++,d=1),select=o[indexCount][0]/100*t,console.log(select),countColor<select?(colorCode=o[indexCount][1],s=colorCode,countColor++):(countColor=1,indexCount++),"humans"==c&&(n=20*d,h=30*g,i+=' <g transform="translate('+n+","+h+')" fill="'+s+'"><circle cx="0" cy="-3" r="3"></circle><rect x="-5" y="1" width="10" height="10" rx="2.5" ry="2.5"></rect><rect x="-3" y="1" width="6" height="18" rx="1.5" ry="1.5"></rect></g>'),"box"==c&&(n=25*d,h=30*g,i+=' <rect x="'+n+'" y="'+h+'" width="20" height="20" style="fill:'+s+';stroke:black;stroke-width:1;fill-opacity:0.6;stroke-opacity:.1"></rect>'),"circle"==c&&(n=30*d,h=30*g,i+='<circle cx="'+n+'" cy="'+h+'" r="10" stroke="black" stroke-width="2" fill-opacity="0.6" stroke-opacity="0.1" fill="'+s+'"></circle>'),itens--,d++;"humans"==c&&(l='<svg width="'+12*t+'" height="'+4*t+'">'+i+"</svg>"),"box"==c&&(l='<svg width="'+7*t+'" height="'+4*t+'">'+i+"</svg>"),"circle"==c&&(l='<svg width="'+12*t+'" height="'+5*t+'">'+i+"</svg>"),document.getElementById(r).innerHTML=l}
