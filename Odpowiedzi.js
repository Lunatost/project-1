

window.addEventListener('DOMContentLoaded', (event) => {
    var array = ["Wartość 1", "Wartość 2", "Wartość 3", "Wartość 4"]; // Tablica z wartościami
  
    var textarea = document.getElementById("text");
    textarea.value = array.join("\n"); // Łączenie wartości tablicy za pomocą znaku nowej linii
  
    textarea.addEventListener("input", function() {
      array = textarea.value.split("\n"); // Podział wartości na podstawie znaku nowej linii i aktualizacja tablicy
      console.log(array);
    });
  });
  