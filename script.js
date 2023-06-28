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
const questions = ["Dlaczego?", "Co?", "Jak?", "Kto?", "Po co?", "Kiedy?", "Gdzie?", "Z kim?", "Kogo?"];
let shuffledQuestions = [...questions]; // Inicjalizacja tablicy przetasowanych pytań
const answerArray = [];
let questionIndex = 0;


function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
  }


answersRef.get()
  .then((querySnapshot) => {
    let highestPlayerId = 0;   

    querySnapshot.forEach((doc) => {
      const playerId = parseInt(doc.id.substring(6));
      
      if (playerId > highestPlayerId) {
        highestPlayerId = playerId;
        playerName = doc.id;
      }
    });
    // generowanie pytań
    if (highestPlayerId === 0 && round == 1) {
      shuffledQuestions = shuffleArray([...questions]);
      addShuffledQuestionsToFirestore();
    }
    else {
      console.error("Id higher than one")
    }
    playerName = "player"+(highestPlayerId + 1);
  })
  .catch((error) => {
    console.error("Błąd podczas pobierania dokumentów:", error);
  });


  function addShuffledQuestionsToFirestore() {
    const questionsRef = db.collection("Questions");
  
    // Krok 1: Usuń istniejący dokument "Questions", jeśli istnieje
    questionsRef.doc("Questions").delete()
      .then(() => {
        console.log("Dokument 'Questions' usunięty z bazy danych Firestore");
  
        // Krok 2: Utwórz nowy dokument "Questions"
        questionsRef.doc("Questions").set({})
          .then(() => {
            console.log("Dokument 'Questions' utworzony w bazie danych Firestore");
  
            // Krok 3: Dodaj tablicę "shuffledQuestions" do dokumentu "Questions"
            questionsRef.doc("Questions").update({
              shuffledQuestions: shuffledQuestions,
            })
            .then(() => {
              console.log("Tablica 'shuffledQuestions' dodana do dokumentu 'Questions'");
            })
            .catch((error) => {
              console.error("Błąd podczas dodawania tablicy 'shuffledQuestions':", error);
            });
          })
          .catch((error) => {
            console.error("Błąd podczas tworzenia dokumentu 'Questions':", error);
          });
      })
      .catch((error) => {
        console.error("Błąd podczas usuwania dokumentu 'Questions':", error);
      });
  }
  
const questionElement = document.getElementById("question");
const answerInput = document.getElementById("answerInput");
const sendButton = document.getElementById("sendButton");
const noAnswersElement = document.getElementById("noAnswers");
let question = true;

sendButton.addEventListener("click", () => {
  if (answerInput.value != "") {
    noAnswersElement.textContent = ""
    next_question();
    sendData();
  }
  else
  {
    noAnswersElement.textContent = "Nie możesz zostawić pola bez odpowiedzi!"
  }
});


  function next_question() {
    if (round <= 5) {
      if (question) {
        const answer = answerInput.value;
        answerArray.push(answer);
        answerInput.value = "";
  
        const currentQuestion = shuffledQuestions[questionIndex];
        questionIndex++;
        questionElement.textContent = round + ". " + currentQuestion;
        question = false;
        answerInput.placeholder = "Wpisz swoje pytanie";
        round++;
      } else {
        question = true;
        const answer = answerInput.value;
        answerArray.push(answer);
        answerInput.value = "";
        answerInput.placeholder = "Wpisz swoją odpowiedź";
      }
    }
  }  



function sendData() {
  if (round <= 5){
  answersRef.doc(playerName).get()
  .then((doc) => {
    if (doc.exists) {
      // Dokument istnieje - dodaj odpowiedzi
      const docRef = answersRef.doc(playerName);
      docRef.update({
        answers: firebase.firestore.FieldValue.arrayUnion(...answerArray),
      })
      .then(() => {
        console.log("Odpowiedzi zapisane w bazie danych Firestore");
      })
      .catch((error) => {
        console.error("Błąd podczas zapisu odpowiedzi:", error);
      });
    }
     else {
      // Dokument nie istnieje - utwórz nowy dokument z odpowiedziami
      answersRef.doc(playerName).set({
        answers: [answerArray[round - 2]],
      })
      .then(() => {
        console.log("Dokument utworzony w bazie danych Firestore");
      })
      .catch((error) => {
        console.error("Błąd podczas tworzenia dokumentu:", error);
      });
    }
  })
  .catch((error) => {
    console.error("Błąd podczas sprawdzania dokumentu:", error);
  });
  }
}
