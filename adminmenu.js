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

const questions = ["Dlaczego?", "Co?", "Jak?", "Kto?", "Po co?", "Kiedy?", "Gdzie?", "Z kim?", "Kogo?"];
let lessQuestions = [...questions]; // Inicjalizacja tablicy przetasowanych pytań
shuffledQuestions = [];

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
    }
  
    const checkboxes = [];

    const NotEnoughtQuestions = document.getElementById("not-enought-questions");

  
  answersRef.get()
    .then((querySnapshot) => {
      let highestPlayerId = 0; 
      NotEnoughtQuestions.textContent = ""
  
      querySnapshot.forEach((doc) => {
        const playerId = parseInt(doc.id.substring(6));
        
        if (playerId > highestPlayerId) {
          highestPlayerId = playerId;
          playerName = doc.id;
        }
      });
      // generowanie pytań
      if (highestPlayerId === 0) {
  
        const startbutton = () => {
        
          checkboxes.length = 0;

          for (let i = 1; i <= 9; i++) {
            const checkbox = document.getElementById(`checkbox${i}`);
            checkboxes.push(checkbox.checked);
          }
        
          let lessQuestions = [...questions];
          let notchecked = 0

          console.log(checkboxes);
          for (let i = checkboxes.length - 1; i >= 0; i--) {
            if (checkboxes[i] === false) {
              lessQuestions.splice(i, 1);
              notchecked++;
            }
          }

          if (notchecked <= 6) {
            NotEnoughtQuestions.textContent = ""
            shuffledQuestions = shuffleArray([...lessQuestions]);
            console.log(shuffledQuestions);
            addShuffledQuestionsToFirestore();
          }
          else {
            NotEnoughtQuestions.textContent = "Za mało pytań! (minimum 3)"
          }
        };
        
        if (window.location.href.includes('AdminMenu.html')) {
          document.getElementById('start-button').addEventListener('click', startbutton);
        }
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