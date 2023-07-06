const firebaseConfig = {
  apiKey: "AIzaSyD5CNmHPW3LvYXA1NCibv8mSyrYo1iZvyw",
  authDomain: "project1-38e04.firebaseapp.com",
  projectId: "project1-38e04",
  storageBucket: "project1-38e04.appspot.com",
  messagingSenderId: "1044070528098",
  appId: "1:1044070528098:web:7da2afad2ca88c6c820d3b"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const answersRef = db.collection("answers");
const arr = [];
let num = 0;
const arrm = [];



answersRef.get()
  .then((snapshot) => {
    snapshot.forEach((doc) => {
      const data = doc.data();
      const answerArray = data.answers;
      const modifiedArray = answerArray.slice(1);
      arr.push(modifiedArray);
    });
    mixedAnswers();
  })
  .catch((error) => {
    console.error("Błąd podczas pobierania tablicy answers:", error);
  });

function mixedAnswers() {
for (let i = 0; i < arr.length; i++) {
  arrm[i] = [];
  for (let j = 0; j < arr[0].length; j++) {
    arrm[i].push(arr[(i + j) % arr.length][j]);
  }
}
console.log(arrm);
answerDisplay();
}

const popButton = document.getElementById('pop-button');
const nasButton = document.getElementById('nas-button');

popButton.style.visibility = 'hidden';
popButton.disabled = true;

popButton.addEventListener('click', answerDisplay);
nasButton.addEventListener('click', answerDisplay);


popButton.addEventListener('click', function() {
  if(num>0){
    num--;
    answerDisplay();
  }
});

nasButton.addEventListener('click', function() {
  if(arr.length>num){
  num++;
  if(arr.length == num){
    
    window.location.href = 'https://lunatost.github.io/project-1/end.html';
  }
  else {
    answerDisplay();
  }
  }
});




function answerDisplay() {
  if(num == 0){
    popButton.style.visibility = 'hidden';
    popButton.disabled = true;
  }
  else{
    popButton.style.visibility = 'visible';
    popButton.disabled = false;
  }

  if(num == arr.length - 1){
    nasButton.style.backgroundColor = 'rgb(184, 7, 7)';
    nasButton.style.borderColor = 'rgb(156, 13, 20)';
    nasButton.style.color = 'rgb(0,0,0)'
    nasButton.innerText = 'Koniec';
  }
  else {
    nasButton.style.backgroundColor = 'rgb(7, 184, 7)';
    nasButton.style.color = 'rgb(28, 27, 109)';
    nasButton.style.border = '2px solid rgb(13, 156, 20)';
    nasButton.innerText = 'Następna odpowiedź';
  }

  array = arrm[num]; // Tablica z wartościami

  
    var textarea = document.getElementById("text");
    textarea.value = array.join("\n"); // Łączenie wartości tablicy za pomocą znaku nowej linii
  
    textarea.addEventListener("input", function() {
      array = textarea.value.split("\n"); // Podział wartości na podstawie znaku nowej linii i aktualizacja tablicy
    });
}