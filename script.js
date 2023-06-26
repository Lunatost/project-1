var questions = [
  "Kto...",
  "Dlaczego...",
  "Z kim...",
  "Po co...",
  "Kiedy...",
  "Gdzie..."
];

var pytanie = false

function wyświetlTekst() {  
  if (pytanie)
  {    
    var randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    var questionElements = document.querySelectorAll("h1");
    questionElements[0].textContent = randomQuestion;
    questionElements[1].textContent = randomQuestion;
    pytanie = !pytanie
  }
  else
  {
    pytanie=!pytanie
  }
  
  
}
