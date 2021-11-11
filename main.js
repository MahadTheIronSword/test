const MAIN_QUESTION_HOLDER = ['.styles__answersHolder___1tefk-camelCase', '.styles__answersHolder___1mDAA-camelCase'];
const QUESTION_HOLDER = ['.styles__questionText___10zyP-camelCase', '.styles__questionText___1QpGC-camelCase'];

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function getGameData(id) {
    const url = 'https://api.blooket.com/api/games?gameId=' + id;

    const request = await fetch(url, {
        method: 'GET'
    })

    const json = await request.json();

    return json;
}

function getCurrentQuestion() {
    for (let possibleQuestionHolder of QUESTION_HOLDER) {
        const e = document.querySelector(possibleQuestionHolder);

        if (e) {
            return e.childNodes[0].innerHTML;
        }
    }
}

function getHolder() {
    for (let possibleAnswerHolder of MAIN_QUESTION_HOLDER) {
        const e = document.querySelector(possibleAnswerHolder);

        if (e) {
            return e;
        }
    }
}

function findElements(container) {
    let texts = [];
    let buttons = [];

    for (let child of container.children) {
        const button = child.childNodes[0];
        buttons.push(button);

        const text = button.childNodes[0].childNodes[0];
        texts.push(text);
    }

    return {texts, buttons}
}

function findCorrectAnswer(data) {
    const holder = getHolder();

    if (!holder) {return;}

    const element_data = findElements(holder);
    /*
    for (let choice of choices) {
        const element = document.querySelector(choice);

        if (element) {
            for (let question of data['questions']) {
                if (element.textContent === question['correctAnswers'][0]) {
                    element.click();
                }
            }
        }
    }
    */

    for (let question of data['questions']) {
        if (question['question'] == getCurrentQuestion()) {
            for (let i = 0; i < element_data.buttons.length; i++) {
                const element_button = element_data.buttons[i];
                const element_text = element_data.texts[i];
                console.log('Correct: ' + question['correctAnswers'][0], 'Guess: ' + element_text.innerHTML);
                if (element_text.innerHTML == question['correctAnswers'][0]) {
                    element_button.click();
                    return;
                }
            }
        }
        
    }
}

async function main() {
    const session_id = prompt('Game ID?');
    const session_data = await getGameData(session_id);

    document.onkeydown = e => {
        if (e.code === 'KeyT') {
            findCorrectAnswer(session_data);
        }
    }
}

main()
