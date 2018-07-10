const LIST_HEIGHT = 198;
const ITEM_WIDTH = 258;

const allLists = [];
let xIndex = 0;
let yIndex = 0;

const mainDOM = document.querySelector('#main');

function appendList(list) {
  let container = document.createElement('div');
  container.className = 'list';
  mainDOM.appendChild(container);

  list.forEach(function appendListItem(item) {
    appendItem(item, container);
  });
}

function appendItem(item, container) {
  let block = document.createElement('div');
  block.className = 'item';
  block.tabIndex = -1;
  container.appendChild(block);

  let a = document.createElement('a');
  a.href = '#';
  a.className = 'item-link';
  block.appendChild(a);
  let img = document.createElement('img');
  img.className = 'item-image';
  img.src = item;
  a.appendChild(img);
  let p = document.createElement('p');
  p.className = 'item-title';
  p.textContent = Math.random().toString(36).substring(2, 15);
  a.appendChild(p);

  let closeButton = document.createElement('a');
  closeButton.href = '#';
  closeButton.className = 'close';
  block.appendChild(closeButton);
}

function setListPosition(yIndex) {
  document.querySelectorAll('.list').forEach(function setEachListPosition(node, index) {
    node.style.top = LIST_HEIGHT * ( index - yIndex ) + 'px';
    if (index === yIndex) {
      node.style.opacity = 1;
    } else if (index === yIndex + 1) {
      node.style.opacity = 0.2;
    } else if (index < yIndex) {
      node.style.opacity = 0;
    }
    // if (index < yIndex) {
    //   node.style.visibility = 'hidden';
    // } else {
    //   node.style.visibility = 'visable';
    // }
  });
}

function setItemPosition(xIndex, yIndex) {
  const lists = document.querySelectorAll('.list');
  lists.forEach(function setEachItemPosition(list, y) {
    if (y !== yIndex) {
      list.querySelectorAll('.item').forEach(function setInactiveItemPosition(node, x) {
        node.style.left = ITEM_WIDTH * x + 'px';
      });
    } else {
      list.querySelectorAll('.item').forEach(function setActiveItemPosition(node, x) {
        if (x !== xIndex) {
          node.style.left = ITEM_WIDTH * ( x - xIndex ) + 'px';
        } else {
          node.style.left = ITEM_WIDTH * ( x - xIndex ) - 10 + 'px';
          node.focus();
        }
      });
    }
  });
}

const removeQueue = [];
function removeItem(xIndex, yIndex) {
  const lists = document.querySelectorAll('.list');
  const item = lists[yIndex].childNodes[xIndex];
  item.style.top = item.offsetTop - LIST_HEIGHT + 'px';
  if (xIndex + 1 < lists[yIndex].length) {
    lists[yIndex].childNodes[xIndex + 1].focus();
  }
  lists[yIndex].childNodes.forEach(function shiftLeft(node, index) {
    if (index > xIndex) {
      node.style.left = node.offsetLeft - ITEM_WIDTH + 'px';
    }
  });
  setTimeout(function removeItemAfterTransition() {
    allLists[yIndex].splice(xIndex, 1);
    lists[yIndex].removeChild(item);
    if (!allLists[yIndex].length) {
      allLists.splice(yIndex, 1);
      document.querySelector('.main').removeChild(lists[yIndex]);
      setListPosition(yIndex);
      setItemPosition(xIndex, yIndex);
      setBackground(xIndex, yIndex);
    }
    removeQueue.pop();
    if (removeQueue.length) {
      removeItem(removeQueue[0].x, removeQueue[0].y);
    }
  }, 200);
}

function setBackground(xIndex, yIndex) {
  const background = document.querySelector('.background');
  background.style.backgroundImage = `url(${allLists[yIndex][xIndex]})`;
}

let totalAmount;
function addLists({ total, data }) {
  totalAmount = total;
  const lists = data;
  lists.forEach(function appendEachList(list) {
    allLists.push(list);
    appendList(list, allLists);
  });
  setListPosition(yIndex);
  setItemPosition(xIndex, yIndex);
  setBackground(xIndex, yIndex);
}

API.getLists({ offset: 0, limit: 5 }).then(addLists);

document.body.addEventListener('keydown', function onKeydown(e) {
  // Complete the previous transition
  document.querySelectorAll('.list').forEach(function disableTransition(node) {
    node.classList.add('no-transition');
  });
  document.body.offsetHeight;
  document.querySelectorAll('.list').forEach(function enableTransition(node) {
    node.classList.remove('no-transition');
  });

  switch (e.code) {
    case 'ArrowUp':
      yIndex = yIndex > 0 ? yIndex - 1 : 0;
      xIndex = 0;
      break;
    case 'ArrowDown':
      if (yIndex >= allLists.length - 1) {
        return;
      }
      yIndex = yIndex < allLists.length - 1 ? yIndex + 1 : allLists.length - 1;
      xIndex = 0;
      break;
    case 'ArrowLeft':
      xIndex = xIndex > 0 ? xIndex - 1 : 0;
      break;
    case 'ArrowRight':
      xIndex = xIndex < allLists[yIndex].length - 1 ? xIndex + 1 : allLists[yIndex].length - 1;
      break;
    case 'Enter':
      removeQueue.push({ x: xIndex, y: yIndex });
      if (removeQueue.length < 2) {
        removeItem(xIndex, yIndex);
      }
      return;
    default:
      break;
  }
  if (yIndex >= allLists.length - 1 && yIndex < totalAmount && allLists.length < totalAmount) {
    API.getLists({ offset: yIndex + 1, limit: 5 }).then(addLists);
  }
  setListPosition(yIndex);
  setItemPosition(xIndex, yIndex);
  setBackground(xIndex, yIndex);
});
