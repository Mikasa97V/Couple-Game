const createForm = function(){
    const form = document.createElement('div');
    const inputWrap = document.createElement('div');
    const input = document.createElement('input');
    const label = document.createElement('label');
    const startButton = document.createElement('button');
    const timerBlock = document.createElement('div');

    form.classList.add('form__group', 'field');
    inputWrap.classList.add('input__wrap');
    input.classList.add('form__field');
    label.classList.add('form__label');
    startButton.classList.add('btn-grad');
    timerBlock.classList.add('timer');

    input.setAttribute('name', 'fieldCount');
    input.setAttribute('type', 'text');
    input.setAttribute('id', 'fieldCount');
    input.setAttribute('placeholder', '');
    label.setAttribute('for', 'fieldCount');

    label.innerText = 'Введите размерность поля 2-10';
    startButton.textContent = 'старт';
    timerBlock.textContent = 'Время игры: 60 секунд';

    inputWrap.append(input);
    inputWrap.append(label);
    form.append(inputWrap);
    form.append(startButton);
    form.append(timerBlock);

    return {form, input, label, startButton, timerBlock}
};

const createStatistics = function() {
    const statisticsBlock = document.createElement('div');
    const statisticsScore = document.createElement('div');
    const statisticsClicks = document.createElement('div');
    const statisticsTime = document.createElement('div');
    const statisticsTitle = document.createElement('div');

    statisticsTitle.textContent = 'Статистика';
    statisticsTitle.style.textAlign = 'center';
    statisticsBlock.classList.add('statistics');

    statisticsBlock.append(statisticsTitle);
    statisticsBlock.append(statisticsScore);
    statisticsBlock.append(statisticsClicks);
    statisticsBlock.append(statisticsTime);

    return {statisticsBlock, statisticsScore, statisticsClicks, statisticsTime};
};

const createNotification = function() {
    const notificationBlock = document.createElement('div');
    notificationBlock.classList.add('notification');
    notificationBlock.textContent = 'Вы ввели некорректное значение. Созданно стандартное поле 4*4'

    return notificationBlock;
};

const createGameField = function(fieldsCount) {
    const cardWrap = document.createElement('div');
    let cardSize = null;
    let cardWrapSize = null;
    cardWrap.classList.add('card-wrap');

    switch(fieldsCount) {
        case 2: 
            cardSize = 'card-2';
            cardWrapSize= "card-wrap-2";
            break;
        case 4: 
            cardSize = 'card-4';
            cardWrapSize= "card-wrap-4";
            break;
        case 6: 
            cardSize = 'card-6';
            cardWrapSize= "card-wrap-6";
            break;
        case 8: 
            cardSize = 'card-8';
            cardWrapSize= "card-wrap-8";
            break;
        case 10: 
            cardSize = 'card-10';
            cardWrapSize= "card-wrap-10";
            break;
    };

    cardWrap.classList.add(`${cardWrapSize}`);

    const hashTable = generateCards(fieldsCount);
    const listFromHashTable = transformTableToSortedList(hashTable);

    listFromHashTable.forEach(it => {
        const card = document.createElement('button');
        card.classList.add('card', 'card-close', `${cardSize}`);
        card.innerText = it.key;
        cardWrap.appendChild(card);
    });

    return {cardWrap, listFromHashTable};
};

const transformTableToSortedList = function(hashTable) {
    return Object.entries(hashTable)
        .flatMap(entry => [
            {key: entry[0], number: entry[1][0]},
            {key: entry[0], number: entry[1][1]},
        ])
        .sort((a, b) => a.number - b.number)
};

const clearGameField = function(resetBtnWrap, resultBlock) {
    if (document.querySelector('.card-wrap')) {
        document.querySelector('.card-wrap').remove();
        resetBtnWrap.style.display = 'none';
        resultBlock.style.display = 'none';
        resultBlock.classList.remove('congratulations', 'lose');
    };
};

const clearStatistics = function() {
    if (document.querySelector('.statistics')) document.querySelector('.statistics').remove();
};

const generateCards = function(fieldsCount) {
    const hashTable = {};
    const countCards = Math.pow(fieldsCount, 2); 

    function getRandomInRange(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    for (let i = 1; i <= countCards; i++) {
        const rand = getRandomInRange(1, countCards / 2 );
        if (hashTable[rand] == undefined) {
            hashTable[rand] = [i];
        } else if (hashTable[rand].length == 1) {
            hashTable[rand].push(i);
        } else {
            i--;
        }
    };

    return hashTable;
};

const checkCard = function(card, cardNumber, coupleArray) {
    let checkedCard = {
        couple: false,
        notCouple: false,
    }
    if (coupleArray.length < 2) {
        coupleArray.push({card, cardNumber});
        if ((coupleArray.length == 2)) {
            if (coupleArray[0].card === coupleArray[1].card && coupleArray[0].cardNumber !== coupleArray[1].cardNumber) {
                checkedCard.couple = true;
            } else {
                checkedCard.notCouple = true;
            };
        };
    } else {
        coupleArray = [{card, cardNumber}];
    };

    return checkedCard;
};

const openCards = function(couples, card ) {
    if (couples.length < 2) {
        card.classList.add('card-open');
        couples.push(card);
    };

    return couples;
};

const checkInput = function(input) {
    let value = null;
    if (input >= 2 && input <= 10 && input % 2 === 0) {
        return value = input;
    } else {
        return value = 4;
    }
};

const createApp = function() {
    const wrapper = document.getElementById('wrapper');
    const field = document.getElementById('field');
    const resetBtnWrap = document.getElementById('reset-btn-wrap');
    const statisticsBlockWrap = document.getElementById('statistics');
    const notificationBlockWrap = document.getElementById('notification');
    const notificationBlock = createNotification();

    const resultBlock = document.createElement('div');
    const resetBtn = document.createElement('button');

    const {form, input, startButton, timerBlock} = createForm();
    const {statisticsBlock, statisticsScore, statisticsClicks, statisticsTime} = createStatistics();
    const applicationStartBtns = [startButton, resetBtn];

    let time = 59;
    let score = 0;
    let clicks = 0;
    let IntervalId = null;

    resultBlock.classList.add('result-block');
    resetBtn.classList.add('btn-grad');
    resetBtn.textContent = 'Сыграть еще раз'

    wrapper.append(form);

    input.addEventListener('input', () => {
        startButton.removeAttribute('disabled');
        timerBlock.textContent = 'Время игры: 60 секунд';
        resetBtnWrap.style.display = 'none';
        clearInterval(IntervalId);
        clearGameField(resetBtnWrap, resultBlock);
        clearStatistics();

        if (!input.value.match(/\D/) 
            && ((+input.value > 0) && (+input.value <=10)) 
            && ((input.value.match(/\d+?[0]/)) || (+input.value % 2 === 0)) 
            ) 
        {
            notificationBlock.classList.remove('notification-show'); 
            notificationBlock.classList.add('notification-hidden');
        } else {
            notificationBlockWrap.append(notificationBlock);    
            notificationBlock.classList.remove('notification-hidden');
            notificationBlock.classList.add('notification-show'); 
        };
    });

    applicationStartBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const inputValue = checkInput(+input.value);
        const gameField = createGameField(inputValue);
        const numberOfCards = Math.pow(inputValue, 2);
        let numberOfCouples = 0;
        let coupleArray = [];
        let couples = [];

        time = 59;

        startButton.setAttribute("disabled", "disabled");
        clearGameField(resetBtnWrap, resultBlock);
        clearStatistics();

        field.append(gameField.cardWrap);
        generateCards(inputValue);

        const getResultOfGame = function(result) {
            resultBlock.style.display = 'block';
            resultBlock.classList.add(`${result}`);
            resetBtnWrap.style.display = 'block';
            gameField.cardWrap.style.display = 'none';
            field.append(resultBlock);
            resetBtnWrap.append(resetBtn);
            clearInterval(IntervalId);
            timerBlock.textContent = 'Время игры: 60 секунд';
        };

        const getStatistics = function() {
            statisticsScore.textContent = `Счет: ${score}`;
            statisticsClicks.textContent = `Количество открытий карточек: ${clicks}`;
            statisticsTime.textContent = `Время игры: ${59 - time} сек.`;
            statisticsBlockWrap.append(statisticsBlock);
        };
        
        IntervalId = setInterval(() => {
            timerBlock.textContent = `Осталось: ${time--} сек.`;
            if ((numberOfCouples == numberOfCards) && (time > 0)) {
                getResultOfGame('congratulations');
                getStatistics();
                clicks = 0;
            };
            if (time < 0) {
                getResultOfGame('lose');
                getStatistics();
                clicks = 0;
            };
        }, 1000);

        for (let i = 0; i < gameField.cardWrap.children.length; i++) {
            let cardFromHashTableList = gameField.listFromHashTable[i].key;
            let cardNumber = i;
            // let oneClickOnCard = 0;

            gameField.cardWrap.children[i].addEventListener('click', () => {

                

                let card = gameField.cardWrap.children[i];
                let checkedCard = checkCard(cardFromHashTableList, cardNumber, coupleArray)
                // card.setAttribute("disabled", "disabled");
                clicks++;
                openCards(couples, card);

                const hiddenCards = function() {
                    couples[0].classList.add('card-couple');
                    couples[1].classList.add('card-couple');
                };

                const closeCards = function() {
                    couples[0].classList.remove('card-open');
                    couples[1].classList.remove('card-open');
                    // couples[0].removeAttribute('disabled');
                    // couples[1].removeAttribute('disabled');
                };

                const cardsAction = function(action) {
                    setTimeout(() => {
                        action();
                        couples = [];                        
                        coupleArray = [];
                    }, 1000);
                };

                if (checkedCard.couple) {
                    cardsAction(hiddenCards);
                    numberOfCouples += 2;
                    score += 5;
                };

                if (checkedCard.notCouple) {
                    cardsAction(closeCards);  
                    score -= 2;      
                };
            });
        };
    });
});
};

document.addEventListener('DOMContentLoaded', () => {
    createApp();
});
