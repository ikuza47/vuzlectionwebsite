function onClick(event) {
  let f1 = document.getElementsByName("field1");
  let r = document.getElementById("result");
  let s = document.getElementsByName("select1");
  event.preventDefault();
  const result = f1[0].value * s[0].value;
  alert("Результат: " + result);
}

window.addEventListener('DOMContentLoaded', function (event) {
  console.log("DOM fully loaded and parsed");
  let b = document.getElementById("button1");
  b.addEventListener("click", onClick);
});