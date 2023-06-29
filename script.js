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
      const questionsRef = db.collection("Questions").doc("Questions");

       questionsRef.get()
         .then((doc) => {
           if (doc.exists) {
             const data = doc.data();
             shuffledQuestions = data.shuffledQuestions;
             console.log("Pobrano tablicę shuffledQuestions:", shuffledQuestions);
            // Możesz tutaj wykorzystać pobraną tablicę shuffledQuestions do dalszej obróbki
         } else {
        console.log("Dokument Questions nie istnieje");
            }
          })
          .catch((error) => {
            console.error("Błąd podczas pobierania tablicy shuffledQuestions:", error);
          });
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
  
  
