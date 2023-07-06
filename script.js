// VshFmDoQlh CURElrQh goD roL N.

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
const pagesRef = db.collection("pages").doc("ingame");

pagesRef.get()
  .then((doc) => {
    if (doc.exists) {
      const data = doc.data();
      const boolValue = data[0];

      console.log("Aktualna wartość zmiennej bool:", boolValue);

      // Wykonaj odpowiednie działania w zależności od wartości boolValue
      if (boolValue === true) {
        block();
      } else {
       window.location.href = 'http://127.0.0.1:5500/start.html';
      }
    } else {
      console.log("Dokument 'admin' nie istnieje.");
    }
  })
  .catch((error) => {
    console.error("Błąd podczas pobierania dokumentu 'admin':", error);
  });








let playerName = "player1";
let highestPlayerId = 0;
let round = 1;
let realround = 1;
let maxrealround = 1;
const answerArray = [];
let questionIndex = 0;

let ID = false;

const PlayersRef = db.collection("Players");
PlayersRef.doc("players").get().then((doc) => {
  if (doc.exists) {
    PlayersRef.doc("players").delete()
      .then(() => {
        console.log("Dokument players usunięty z bazy danych Firestore");
        // Tworzenie nowego dokumentu players i dodawanie pola players z wartością playerID
        PlayersRef.doc("players").set({
          players: 2  //2 = in game
        })
    })
  } 
}).catch((error) => {
  console.log("Błąd podczas pobierania dokumentu players: ", error);
});


  
const questionElement = document.getElementById("question");
const answerInput = document.getElementById("answerInput");
const noAnswersElement = document.getElementById("noAnswers");
let question = true;



function sendButton() {
    if (answerInput.value != "") {
      noAnswersElement.textContent = ""
      next_question();
      beforeSendData();
    }
    else
    {
      noAnswersElement.textContent = "Nie możesz zostawić pola bez odpowiedzi!"
    }
}

if (window.location.href.includes('main.html')) {
  document.getElementById('sendButton').addEventListener('click', sendButton);
}


        //pobieranie tablicy
const questionsRef = db.collection("Questions").doc("Questions");
  
questionsRef.get()
  .then((doc) => {
     if (doc.exists) {
      const data1 = doc.data();
      shuffledQuestions = data1.shuffledQuestions;
      console.log("Pobrano tablicę shuffledQuestions:", shuffledQuestions);
      maxrealround = ((shuffledQuestions.length)*2)+1
      next_question();
      // Możesz tutaj wykorzystać pobraną tablicę shuffledQuestions do dalszej obróbki
   } else {
      console.log("Dokument Questions nie istnieje");
    }
  })
  .catch((error) => {
  console.error("Błąd podczas pobierania tablicy shuffledQuestions:", error);
});


  function next_question() {
    if (realround <= maxrealround) {
      realround++
      if (question) {
        const answer = answerInput.value;
        answerArray.push(answer);
        answerInput.value = "";
  
        const currentQuestion = shuffledQuestions[questionIndex];
        questionIndex++;
        if (typeof currentQuestion !== 'undefined') {
          questionElement.textContent = round + ". " + currentQuestion;
          answerInput.placeholder = "Wpisz swoje pytanie";
        } else {
          questionElement.textContent = ""
          answerInput.placeholder = " ";
        }
        question = false;
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

function beforeSendData() {
if (!ID)
ID = true
  answersRef.get()
  .then((querySnapshot) => {  
    querySnapshot.forEach((doc) => {
      const playerId = parseInt(doc.id.substring(6));
      if (playerId > highestPlayerId) {
        highestPlayerId = playerId;
        playerName = doc.id;
      }
    });
    playerName = "player"+(highestPlayerId + 1);
    sendData();
  })
  .catch((error) => {
    console.error("Błąd podczas pobierania dokumentów:", error);
  });

}

  function sendData() {
    if(realround == (shuffledQuestions.length + 1)*2){
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
            checkAnswers();
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

  function checkAnswers() {
    const playersRefe = db.collection("Players").doc("players"); // Zamiast "players" wpisz odpowiedni identyfikator dokumentu
    const answersRef = db.collection("answers");
  
    Promise.all([playersRefe.get(), answersRef.get()])
      .then(([playersSnapshot, answersSnapshot]) => {
        const playersCount = playersSnapshot.data().players;
        const answersCount = answersSnapshot.size;
  
        console.log(playersCount);
        console.log(answersCount);

        if (playersCount === answersCount) {
          window.location.href = 'http://127.0.0.1:5500/odpowiedzi.html';
        }
      })
      .catch((error) => {
        console.error("Błąd podczas pobierania dokumentów:", error);
      })
      .finally(() => {
        setTimeout(checkAnswers, 1000); // Ponowne wywołanie po sekundzie
      });
  }