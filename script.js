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
    playerName = "player"+(highestPlayerId + 1);

  })
  .catch((error) => {
    console.error("Błąd podczas pobierania dokumentów:", error);
  });



  const questions = ["Dlaczego?", "Co?", "Jak?", "Kto?", "Po co?", "Kiedy?", "Gdzie?"];
const answerArray = [];
let questionIndex = 0;

const questionElement = document.getElementById("question");
const answerInput = document.getElementById("answerInput");
const sendButton = document.getElementById("sendButton");
let question = true;
let round = 1;
let shuffledQuestions = [...questions]; // Inicjalizacja tablicy przetasowanych pytań

sendButton.addEventListener("click", next_question);

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
// ...

function next_question() {
  if (round <= 5) {
    if (question) {
      const answer = answerInput.value;
      answerArray.push(answer);
      answerInput.value = "";

      if (round === 1) {
        shuffledQuestions = shuffleArray([...questions]);
      }

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

    if (question && round > 1) {
      // Sprawdź istnienie dokumentu
      answersRef.doc(playerName).get()
        .then((doc) => {
          if (doc.exists) {
            // Aktualizuj istniejący dokument
            answersRef.doc(playerName).update({
              answers: firebase.firestore.FieldValue.arrayUnion(answerArray[round - 2]), // Dodaj kolejną odpowiedź do tablicy
            })
            .then(() => {
              console.log("Dane zaktualizowane w bazie danych Firestore");

              // Odczytaj zaktualizowane dane
              db.collection("answers").doc(playerName).get()
                .then((doc) => {
                  if (doc.exists) {
                    const data = doc.data();
                    console.log("Odczytane dane:", data);

                    // Tutaj możesz przetwarzać odczytane dane

                  } else {
                    console.log("Dokument nie istnieje");
                  }
                })
                .catch((error) => {
                  console.error("Błąd podczas odczytu danych:", error);
                });
            })
            .catch((error) => {
              console.error("Błąd podczas aktualizacji danych:", error);
            });
          } else {
            // Utwórz nowy dokument z początkową tablicą
            answersRef.doc(playerName).set({
              answers: [answerArray[round - 2]], // Utwórz nową tablicę z pierwszą odpowiedzią
            })
            .then(() => {
              console.log("Nowy dokument utworzony w bazie danych Firestore");

              // Odczytaj zapisane dane
              db.collection("answers").doc(playerName).get()
                .then((doc) => {
                  if (doc.exists) {
                    const data = doc.data();
                    console.log("Odczytane dane:", data);

                    // Tutaj możesz przetwarzać odczytane dane

                  } else {
                    console.log("Dokument nie istnieje");
                  }
                })
                .catch((error) => {
                  console.error("Błąd podczas odczytu danych:", error);
                });
            })
            .catch((error) => {
              console.error("Błąd podczas tworzenia nowego dokumentu:", error);
            });
          }
        })
        .catch((error) => {
          console.error("Błąd podczas pobierania dokumentu:", error);
        });
    }
  }
}

// ...



next_question();
