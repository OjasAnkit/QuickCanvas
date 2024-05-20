// document is an object that the browser provides. This basically represents your webpage;
console.log(document);

// in queryselector, it will fetch any element that we pass to it
// fetch the h2 element from my JS page, and then fetch it's inner text
let h2Element = document.querySelector("h2");
console.log(h2Element.innerText);

let ulElement = document.querySelector("ul");
// create child element
let liElement1 = document.createElement("li");
liElement1.innerText = "I am li 1 :D!";
// remove child
ulElement.appendChild(liElement1);
// delete child
ulElement.removeChild(liElement1);
// delete element
