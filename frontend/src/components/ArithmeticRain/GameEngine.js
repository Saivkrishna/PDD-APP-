/**
 * GameEngine.js
 * Handles arithmetic question generation and seeded random number logic.
 */

export class SeededRandom {
  constructor(seed) {
    this.seed = seed;
  }

  // Returns a pseudo-random value between 0 (inclusive) and 1 (exclusive)
  next() {
    const x = Math.sin(this.seed++) * 10000;
    return x - Math.floor(x);
  }

  // Returns a random integer between min and max (inclusive)
  nextInt(min, max) {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  // Selects a random item from an array
  choice(arr) {
    return arr[Math.floor(this.next() * arr.length)];
  }
}

export const getSeedFromDate = (dateStr) => {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = dateStr.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
};

export const generateQuestion = (score, prng = null) => {
  const operators = ['+', '-', '*', '/'];
  const op = prng ? prng.choice(operators) : operators[Math.floor(Math.random() * operators.length)];

  let num1, num2, answer, text;

  // Determine difficulty level based on current score
  let level = 1;
  if (score >= 500) {
    level = 4;
  } else if (score >= 250) {
    level = 3;
  } else if (score >= 100) {
    level = 2;
  }

  const randInt = (min, max) => {
    return prng ? prng.nextInt(min, max) : Math.floor(Math.random() * (max - min + 1)) + min;
  };

  switch (op) {
    case '+':
      if (level === 1) {
        num1 = randInt(1, 15);
        num2 = randInt(1, 15);
      } else if (level === 2) {
        num1 = randInt(10, 50);
        num2 = randInt(5, 40);
      } else if (level === 3) {
        num1 = randInt(30, 150);
        num2 = randInt(10, 100);
      } else {
        num1 = randInt(100, 999);
        num2 = randInt(10, 500);
      }
      answer = num1 + num2;
      text = `${num1} + ${num2}`;
      break;

    case '-':
      if (level === 1) {
        num1 = randInt(5, 20);
        num2 = randInt(1, num1); // Positive answers only for Level 1
      } else if (level === 2) {
        num1 = randInt(20, 80);
        num2 = randInt(1, num1);
      } else if (level === 3) {
        num1 = randInt(50, 200);
        num2 = randInt(10, num1);
      } else {
        num1 = randInt(100, 999);
        num2 = randInt(50, num1);
      }
      answer = num1 - num2;
      text = `${num1} - ${num2}`;
      break;

    case '*':
      if (level === 1) {
        num1 = randInt(2, 5);
        num2 = randInt(1, 10);
      } else if (level === 2) {
        num1 = randInt(2, 9);
        num2 = randInt(2, 10);
      } else if (level === 3) {
        num1 = randInt(3, 12);
        num2 = randInt(3, 12);
      } else {
        num1 = randInt(4, 20);
        num2 = randInt(3, 15);
      }
      answer = num1 * num2;
      text = `${num1} × ${num2}`;
      break;

    case '/':
      // Division must have whole-number answers: num1 / num2 = answer => num1 = num2 * answer
      if (level === 1) {
        answer = randInt(1, 10); // Quotient (the answer)
        num2 = randInt(2, 5);    // Divisor
      } else if (level === 2) {
        answer = randInt(2, 12);
        num2 = randInt(2, 9);
      } else if (level === 3) {
        answer = randInt(3, 15);
        num2 = randInt(2, 12);
      } else {
        answer = randInt(5, 25);
        num2 = randInt(3, 20);
      }
      num1 = num2 * answer;      // Dividend
      text = `${num1} ÷ ${num2}`;
      break;

    default:
      text = '1 + 1';
      answer = 2;
  }

  return {
    id: Math.random().toString(36).substring(2, 9),
    text,
    answer,
    operator: op
  };
};

export const getSpeedMultiplier = (score) => {
  // Speed is constant and does not increase when answering questions
  return 1.0;
};
