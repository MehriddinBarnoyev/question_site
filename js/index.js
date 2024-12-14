const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };
  
  const giveQuestions = () => {
    const questionCount = document.getElementById("questionCount").value.toLowerCase();
    const questionDifficulty = document.getElementById("difficulty").value.toLowerCase();
    const questionType = document.getElementById("questionType").value.toLowerCase();
  
    axios
      .get(
        `https://opentdb.com/api.php?amount=${questionCount}&difficulty=${questionDifficulty}&type=${questionType}`
      )
      .then((res) => {
        console.log(res.data.results);
  
        const generatedQuestions = document.getElementById("generatedQuestions");
        generatedQuestions.innerHTML = ""; // Yangi savollarni ko'rsatishdan oldin konteynerni tozalash
  
        res.data.results.forEach((result, index) => {
          const allAnswers = [...result.incorrect_answers, result.correct_answer];
          const shuffledAnswers = shuffleArray(allAnswers);
  
          generatedQuestions.innerHTML += `
         <div class="bg-white p-6 rounded-lg shadow-md mb-4">
           <h3 class="text-xl font-semibold text-gray-800 mb-4">Savol ${
             index + 1
           }</h3>
           <p class="text-gray-600">${result.question}</p>
           ${shuffledAnswers
             .map(
               (answer, answerIndex) => `
               <div class="mt-4">
                 <input type="radio" name="question${index}" id="question${index}Option${answerIndex}" />
                 <label for="question${index}Option${answerIndex}">${answer}</label>
               </div>
             `
             )
             .join("")}
         </div>`;
        });
      })
      .catch((err) => {
        console.error(err);
        alert("Savollarni yuklashda xatolik yuz berdi. Qayta urinib ko'ring.");
      });
  };
  
  document.getElementById("generateQuestions").addEventListener("click", () => {
    giveQuestions();
  });
  