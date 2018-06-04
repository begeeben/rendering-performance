const consoleDom = document.getElementById('console');

function log(str) {
    console.log(str);
    const consoleDom = document.getElementById('console');
    const p = document.createElement('p');
    p.appendChild(document.createTextNode((new Date()).toISOString().substring(11, 23) + '\n'));
    p.appendChild(document.createTextNode(str));
    consoleDom.appendChild(p);
}
