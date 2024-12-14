let correctAnswers = [];
let userScore = 0;

const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

const resetQuiz = () => {
    correctAnswers = [];
    userScore = 0;
    giveQuestions();
};

const checkAnswers = () => {
    userScore = 0;
    const questions = document.querySelectorAll('.question-container');
    
    questions.forEach((question, index) => {
        const selectedAnswer = question.querySelector(`input[name="question${index}"]:checked`)?.nextElementSibling?.textContent;
        if (selectedAnswer === correctAnswers[index]) {
            userScore++;
            question.classList.add('bg-green-100');
        } else {
            question.classList.add('bg-red-100');
        }
    });

     document.getElementById('score').textContent = `Sizning natijangiz: ${userScore}/${correctAnswers.length}`;
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
            // generatedQuestions.innerHTML = ""; 
            // giveQuestions()

            correctAnswers = res.data.results.map(question => question.correct_answer);

            res.data.results.forEach((result, index) => {
                const allAnswers = [...result.incorrect_answers, result.correct_answer];
                const shuffledAnswers = shuffleArray([...allAnswers]);

                generatedQuestions.innerHTML += `
                <div class="question-container bg-white p-6 rounded-lg shadow-md mb-4">
                    <h3 class="text-xl font-semibold text-gray-800 mb-4">Savol ${index + 1}</h3>
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

             generatedQuestions.innerHTML += `
                <div class="mt-6 flex gap-4">
                    <button id="checkAnswers" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                        Result
                    </button>
                    <button id="playAgain" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        New Game
                    </button>
                </div>
                <div id="score" class="mt-4 text-xl font-bold"></div>`;

             document.getElementById("checkAnswers")?.addEventListener("click", checkAnswers);
            document.getElementById("playAgain")?.addEventListener("click", resetQuiz);
        })
        .catch((err) => {
            console.error(err);
            alert("Savollarni yuklashda xatolik yuz berdi. Qayta urinib ko'ring.");
        });
};

document.addEventListener("DOMContentLoaded", () => {
    const generateButton = document.getElementById("generateQuestions");
    if (generateButton) {
        generateButton.addEventListener("click", giveQuestions);
    }
});