const form = document.querySelector('form');
const answers = ['c', 'b', 'a', 'a', 'a', 'b', 'c', 'b', 'b', 'b', 'b', 'c'];

form.addEventListener('submit', (e) => {
    e.preventDefault();

    let score = 0;
    const userAnswers = [form.q1.value, form.q2.value, form.q3.value, form.q4.value, form.q5.value, form.q6.value,
        form.q7.value, form.q8.value, form.q9.value, form.q10.value, form.q11.value, form.q12.value];

    userAnswers.forEach((answer, index) => {
        if (answer === answers[index]) {
            score++;
        }
    });

    alert(`You scored ${score} out of ${answers.length}!`);

});