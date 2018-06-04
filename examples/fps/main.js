const input = document.getElementById('domCount');
input.value = 10;
let domCount = 10;

input.addEventListener('change', function (e) {
    domCount = e.target.value;
    updateDom(domCount);
});

const select = document.getElementById('properties');
select.addEventListener('change', function (e) {
    container.className = e.target.value;
});

const container = document.getElementById('container');

function updateDom (count) {
    const fragment = document.createDocumentFragment();
    let div;

    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }

    while (count > 0) {
        div = document.createElement('div');
        fragment.appendChild(div);
        count--;
    }

    container.appendChild(fragment);
}

updateDom(domCount);


