// Inicjalizacja Firebase
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
var answersRef = db.collection("answers");
let playerName = "player1";

let round = 1;
let realround = 1;
const answerArray = [];
let questionIndex = 0;



  
const questionElement = document.getElementById("question");
const answerInput = document.getElementById("answerInput");
const noAnswersElement = document.getElementById("noAnswers");
let question = true;


function sendButton() {
  console.log('sendbutton');
    if (answerInput.value != "") {
      noAnswersElement.textContent = ""
      next_question();
      sendData();
    }
    else
    {
      noAnswersElement.textContent = "Nie możesz zostawić pola bez odpowiedzi!"
    }
}

if (window.location.href.includes('main.html')) {
  document.getElementById('sendButton').addEventListener('click', sendButton);
}






  function next_question() {
    if (realround <= 12) {
      if (question) {
        const answer = answerInput.value;
        answerArray.push(answer);
        answerInput.value = "";
  
        const currentQuestion = shuffledQuestions[questionIndex];
        questionIndex++;
        questionElement.textContent = round + ". " + currentQuestion;
        question = false;
        round++;
        realround++;
        answerInput.placeholder = "Wpisz swoje pytanie";
      } else {
        question = true;
        realround++;
        const answer = answerInput.value;
        answerArray.push(answer);
        answerInput.value = "";
        answerInput.placeholder = "Wpisz swoją odpowiedź";
      }
    }
  }  



  function sendData() {
    // 5 rund ( (ilość rund * 2)+2 )
    if (realround <= 12) {
      // Usuwanie dokumentu o nazwie playerName
      answersRef.doc(playerName).delete()
        .then(() => {
          console.log("Dokument pytań usunięty z bazy danych Firestore");
          // Tworzenie nowego dokumentu o nazwie playerName i dodawanie tablicy answerArray
          answersRef.doc(playerName).set({
            answers: answerArray,
          })
            .then(() => {
              console.log("Dokument pytań utworzony i odpowiedzi dodane w bazie danych Firestore");
            })
            .catch((error) => {
              console.error("Błąd podczas tworzenia dokumentu:", error);
            });
        })
        .catch((error) => {
          console.error("Błąd podczas usuwania dokumentu:", error);
        });
    }
  }
  
  
