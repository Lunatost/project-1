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
const PlayersRef = db.collection("Players");

const pagesRef = db.collection("pages").doc("ingame");

pagesRef.get()
  .then((doc) => {
    if (doc.exists) {
      const data = doc.data();
      const boolValue = data[0];

      console.log("Aktualna wartość zmiennej bool:", boolValue);

      // Wykonaj odpowiednie działania w zależności od wartości boolValue
      if (boolValue !== true) {
        window.location.href = 'https://lunatost.github.io/project-1/ingame.html';
      }
    } else {
      console.log("Dokument 'admin' nie istnieje.");
    }
  })
  .catch((error) => {
    console.error("Błąd podczas pobierania dokumentu 'admin':", error);
  });


let highestID = 0;
let playerID = 1;

PlayersRef.doc("players").get().then((doc) => {
  if (doc.exists) {
    const data = doc.data();
    highestID = data.players; 
    playerID = highestID + 1;

    PlayersRef.doc("players").delete()
      .then(() => {
        console.log("Dokument players usunięty z bazy danych Firestore");
        // Tworzenie nowego dokumentu players i dodawanie pola players z wartością playerID
        PlayersRef.doc("players").set({
          players: playerID
        })
        .then(() => {
          console.log("Dokument players zaktualizowany w bazie danych Firestore");
          console.log(playerID);
          nextpage();
        })
        .catch((error) => {
          console.log("Błąd podczas aktualizacji dokumentu players w bazie danych Firestore: ", error);
        });
      })
      .catch((error) => {
        console.log("Błąd podczas usuwania dokumentu players z bazy danych Firestore: ", error);
      });
  } else {
    console.log("Dokument players nie istnieje.");
  }
}).catch((error) => {
  console.log("Błąd podczas pobierania dokumentu players: ", error);
});

function nextpage(){
    if(playerID == 1 ){
        window.location.href = 'https://lunatost.github.io/project-1/AdminMenu.html';
    }
}

const questionsRef = db.collection("Questions").doc("Questions");

setInterval(() => {
  questionsRef.get().then((doc) => {
    if (doc.exists) {
      const data = doc.data();
      const shuffledQuestions = data.shuffledQuestions;

      if (shuffledQuestions && shuffledQuestions.length > 0) {
        window.location.href = 'https://lunatost.github.io/project-1/main.html';
      }
    } else {
      console.log("Dokument 'Questions' nie istnieje.");
    }
  }).catch((error) => {
    console.error("Błąd podczas pobierania dokumentu 'Questions':", error);
  });
}, 1000); // Sprawdzaj co 1 sekund (możesz dostosować ten interwał)

