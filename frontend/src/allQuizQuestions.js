import { timeWorkQuizQuestions } from './timeWorkQuizData';
import { generatedQuizQuestions } from './generatedQuizQuestions';

// Map existing timeWorkQuizQuestions to have a 'topic' property.
// Items containing "pipe", "leak", or "cistern" are assigned to 'pipes-cisterns'.
// All others are assigned to 'time-work'.
const mappedTimeWorkQuestions = timeWorkQuizQuestions.map(q => {
  const isPipe = (q.category || '').toLowerCase().includes('pipe') || 
                 (q.category || '').toLowerCase().includes('leak') || 
                 (q.category || '').toLowerCase().includes('cistern');
  return {
    ...q,
    topic: isPipe ? 'pipes-cisterns' : 'time-work'
  };
});

const otherQuestions = [
  // === AVERAGES ===
  {
    id: 101,
    topic: "averages",
    difficulty: "easy",
    category: "Basic Average",
    q: "The average of 5 numbers is 20. If each number is multiplied by 3, what is the new average?",
    options: ["A) 20", "B) 40", "C) 60", "D) 100"],
    answer: "C) 60",
    explanation: "If each observation is multiplied by a constant k, the average also gets multiplied by k. New average = 20 * 3 = 60.",
    shortcut: "New Average = Old Average * Multiplier = 20 * 3 = 60.",
    company: "TCS, Wipro"
  },
  {
    id: 102,
    topic: "averages",
    difficulty: "easy",
    category: "Natural Numbers",
    q: "Find the average of the first 50 natural numbers.",
    options: ["A) 25", "B) 25.5", "C) 26", "D) 24.5"],
    answer: "B) 25.5",
    explanation: "Average of first n natural numbers = (n + 1) / 2. Here n = 50, so Average = (50 + 1) / 2 = 25.5.",
    shortcut: "Average = (1 + 50) / 2 = 25.5.",
    company: "Infosys"
  },
  {
    id: 103,
    topic: "averages",
    difficulty: "medium",
    category: "Replacement",
    q: "The average weight of 8 persons increases by 2.5 kg when a new person comes in place of one of them weighing 65 kg. What is the weight of the new person?",
    options: ["A) 70 kg", "B) 75 kg", "C) 80 kg", "D) 85 kg"],
    answer: "D) 85 kg",
    explanation: "Total weight increased = 8 * 2.5 = 20 kg. Weight of the new person = Weight of the replaced person + Total weight increased = 65 + 20 = 85 kg.",
    shortcut: "New Weight = Replaced Weight + (n * Increase) = 65 + (8 * 2.5) = 85.",
    company: "Cognizant, Accenture"
  },
  {
    id: 104,
    topic: "averages",
    difficulty: "medium",
    category: "Cricketer Average",
    q: "A cricketer has a certain average for 10 innings. In the 11th inning, he scores 108 runs, thereby increasing his average by 6 runs. What is his new average?",
    options: ["A) 42", "B) 48", "C) 44", "D) 52"],
    answer: "B) 48",
    explanation: "Let the old average be x. Total runs in 10 innings = 10x. Total runs in 11 innings = 10x + 108. New average = x + 6. Equation: (10x + 108)/11 = x + 6 => 10x + 108 = 11x + 66 => x = 42. New average = 42 + 6 = 48.",
    shortcut: "New Average = Runs - (Old Innings * Increase) = 108 - (10 * 6) = 48.",
    company: "TCS, Mindtree"
  },
  {
    id: 105,
    topic: "averages",
    difficulty: "hard",
    category: "Age Word Problems",
    q: "The average age of a class of 30 students is 15 years. If the teacher's age is included, the average increases by 1 year. What is the teacher's age?",
    options: ["A) 45 years", "B) 46 years", "C) 40 years", "D) 50 years"],
    answer: "B) 46 years",
    explanation: "Total age of 30 students = 30 * 15 = 450 years. Total age including teacher (31 people) = 31 * 16 = 496 years. Teacher's age = 496 - 450 = 46 years.",
    shortcut: "Teacher's Age = New Average + (Old n * Increase) = 16 + (30 * 1) = 46.",
    company: "Capgemini, Deloitte"
  },

  // === PROFIT & LOSS ===
  {
    id: 106,
    topic: "profit-loss",
    difficulty: "easy",
    category: "Basic Profit",
    q: "A toy is bought for ₹150 and sold for ₹180. Find the profit percentage.",
    options: ["A) 10%", "B) 15%", "C) 20%", "D) 25%"],
    answer: "C) 20%",
    explanation: "Profit = SP - CP = 180 - 150 = ₹30. Profit % = (Profit / CP) * 100 = (30 / 150) * 100 = 20%.",
    shortcut: "(30/150) * 100 = 1/5 = 20%.",
    company: "Wipro"
  },
  {
    id: 107,
    topic: "profit-loss",
    difficulty: "easy",
    category: "Basic Loss",
    q: "By selling a watch for ₹1440, a man loses 10%. At what price should he sell it to gain 10%?",
    options: ["A) ₹1600", "B) ₹1760", "C) ₹1500", "D) ₹1800"],
    answer: "B) ₹1760",
    explanation: "SP = ₹1440 at 10% loss => CP = 1440 / 0.9 = ₹1600. To gain 10%, SP = 1600 * 1.1 = ₹1760.",
    shortcut: "New SP = Old SP * (100 + Gain%) / (100 - Loss%) = 1440 * 110 / 90 = 16 * 110 = ₹1760.",
    company: "TCS"
  },
  {
    id: 108,
    topic: "profit-loss",
    difficulty: "medium",
    category: "Markup & Discount",
    q: "A shopkeeper marks his goods 20% above cost price and allows a discount of 10%. What is his gain percent?",
    options: ["A) 8%", "B) 10%", "C) 12%", "D) 6%"],
    answer: "A) 8%",
    explanation: "Let CP = 100. MP = 120. Discount = 10% of 120 = 12. SP = MP - Discount = 120 - 12 = 108. Gain % = 108 - 100 = 8%.",
    shortcut: "Net Gain% = Markup - Discount - (Markup * Discount)/100 = 20 - 10 - (200)/100 = 8%.",
    company: "Infosys"
  },
  {
    id: 109,
    topic: "profit-loss",
    difficulty: "medium",
    category: "Cost/Selling Quantities",
    q: "If the cost price of 15 articles is equal to the selling price of 12 articles, what is the profit percentage?",
    options: ["A) 20%", "B) 25%", "C) 16.67%", "D) 15%"],
    answer: "B) 25%",
    explanation: "Let CP of 1 article = ₹1. CP of 12 articles = ₹12. SP of 12 articles = CP of 15 articles = ₹15. Profit on 12 articles = 15 - 12 = ₹3. Profit % = (3 / 12) * 100 = 25%.",
    shortcut: "Profit% = (Goods Left / Goods Sold) * 100 = (3 / 12) * 100 = 25%.",
    company: "Accenture"
  },
  {
    id: 110,
    topic: "profit-loss",
    difficulty: "hard",
    category: "Equal SP Transactions",
    q: "A dealer sells two machines for ₹12000 each. On one he gains 20% and on the other he loses 20%. What is his net gain or loss percentage?",
    options: ["A) 4% gain", "B) 4% loss", "C) No gain, no loss", "D) 2% loss"],
    answer: "B) 4% loss",
    explanation: "When two identical selling price transactions occur with equal gain% and loss%, there is always a loss. Loss % = (Common Loss or Gain % / 10)^2 = (20 / 10)^2 = 4%.",
    shortcut: "Loss% = x^2 / 100 = 20^2 / 100 = 4% loss.",
    company: "Cognizant, Tech Mahindra"
  },

  // === PERCENTAGES ===
  {
    id: 111,
    topic: "percentages",
    difficulty: "easy",
    category: "Fractions",
    q: "Express 3/8 as a percentage.",
    options: ["A) 37.5%", "B) 35%", "C) 33.33%", "D) 40%"],
    answer: "A) 37.5%",
    explanation: "To convert a fraction into a percentage, multiply by 100. (3/8) * 100 = 300/8 = 37.5%.",
    shortcut: "Since 1/8 = 12.5%, 3/8 = 3 * 12.5% = 37.5%.",
    company: "Infosys"
  },
  {
    id: 112,
    topic: "percentages",
    difficulty: "easy",
    category: "Compounded Percentages",
    q: "What is 15% of 34% of 10000?",
    options: ["A) 500", "B) 510", "C) 480", "D) 600"],
    answer: "B) 510",
    explanation: "Value = (15 / 100) * (34 / 100) * 10000 = 15 * 34 = 510.",
    shortcut: "15 * 34 = 15 * 30 + 15 * 4 = 450 + 60 = 510.",
    company: "TCS"
  },
  {
    id: 113,
    topic: "percentages",
    difficulty: "medium",
    category: "Salary Comparison",
    q: "If A's salary is 25% more than B's salary, then B's salary is how much percent less than A's salary?",
    options: ["A) 20%", "B) 25%", "C) 16.67%", "D) 30%"],
    answer: "A) 20%",
    explanation: "Let B's salary = 100. A's salary = 125. B's salary is less than A by 25. Percentage less = (25 / 125) * 100 = 20%.",
    shortcut: "[r / (100 + r)] * 100 = [25 / 125] * 100 = 20%.",
    company: "Wipro, Capgemini"
  },
  {
    id: 114,
    topic: "percentages",
    difficulty: "medium",
    category: "Exam Marks",
    q: "In an exam, a student gets 30% marks and fails by 20 marks. Another student gets 40% marks and gets 10 marks more than the passing marks. Find the passing marks.",
    options: ["A) 90", "B) 100", "C) 110", "D) 120"],
    answer: "C) 110",
    explanation: "Difference in percentage = 40% - 30% = 10%. Difference in marks = 10 - (-20) = 30 marks. So, 10% of total marks = 30 => Total marks = 300. Passing marks = 30% of 300 + 20 = 90 + 20 = 110 marks.",
    shortcut: "10% = 30 => 30% = 90. Passing = 90 + 20 = 110.",
    company: "Accenture"
  },
  {
    id: 115,
    topic: "percentages",
    difficulty: "hard",
    category: "Price Consumption",
    q: "Due to a 20% reduction in the price of sugar, a man can buy 5 kg more sugar for ₹600. Find the original price of sugar per kg.",
    options: ["A) ₹30/kg", "B) ₹24/kg", "C) ₹32/kg", "D) ₹36/kg"],
    answer: "A) ₹30/kg",
    explanation: "Money saved due to 20% reduction = 20% of 600 = ₹120. With this ₹120, he buys 5 kg sugar. Reduced price = 120 / 5 = ₹24/kg. Reduced price is 80% of original price (since 20% reduction). Original price = 24 / 0.8 = ₹30/kg.",
    shortcut: "Original Price = (Reduction% * Amount) / ((100 - Reduction%) * Extra Qty) = (20 * 600) / (80 * 5) = 12000 / 400 = ₹30.",
    company: "Tata Motors, HCL"
  },

  // === RATIO & PROPORTION ===
  {
    id: 116,
    topic: "ratio-proportion",
    difficulty: "easy",
    category: "Combined Ratios",
    q: "If A:B = 2:3 and B:C = 4:5, find A:B:C.",
    options: ["A) 8:12:15", "B) 2:4:5", "C) 8:10:15", "D) 6:9:15"],
    answer: "A) 8:12:15",
    explanation: "Multiply first ratio by 4 (the B term in second ratio) and second ratio by 3 (the B term in first ratio). A:B = 8:12. B:C = 12:15. Combined = 8:12:15.",
    shortcut: "A:B:C = (2*4) : (3*4) : (3*5) = 8 : 12 : 15.",
    company: "Infosys"
  },
  {
    id: 117,
    topic: "ratio-proportion",
    difficulty: "easy",
    category: "Simple Share",
    q: "Two numbers are in the ratio 3:5. If their sum is 80, find the larger number.",
    options: ["A) 30", "B) 50", "C) 40", "D) 60"],
    answer: "B) 50",
    explanation: "Total parts = 3 + 5 = 8 parts. 8 parts = 80 => 1 part = 10. Larger number = 5 parts = 5 * 10 = 50.",
    shortcut: "Larger = 80 * 5/8 = 50.",
    company: "TCS"
  },
  {
    id: 118,
    topic: "ratio-proportion",
    difficulty: "medium",
    category: "Division",
    q: "A sum of ₹3000 is divided among A, B, and C in the ratio 2:3:5. Find C's share.",
    options: ["A) ₹600", "B) ₹900", "C) ₹1500", "D) ₹1200"],
    answer: "C) ₹1500",
    explanation: "Total parts = 2 + 3 + 5 = 10 parts. 10 parts = ₹3000 => 1 part = ₹300. C's share = 5 parts = 5 * 300 = ₹1500.",
    shortcut: "C's share = 3000 * 5/10 = 1500.",
    company: "Cognizant"
  },
  {
    id: 119,
    topic: "ratio-proportion",
    difficulty: "medium",
    category: "Proportional Numbers",
    q: "What least number must be added to each of 6, 7, 15, and 17 so that the resulting numbers are in proportion?",
    options: ["A) 1", "B) 2", "C) 3", "D) 4"],
    answer: "C) 3",
    explanation: "Let the number added be x. (6 + x) / (7 + x) = (15 + x) / (17 + x) => (6 + x)(17 + x) = (15 + x)(7 + x) => 102 + 23x + x^2 = 105 + 22x + x^2 => x = 3.",
    shortcut: "Test options. Adding 3: 9/10 and 18/20. Since 18/20 = 9/10, they are proportional.",
    company: "Wipro"
  },
  {
    id: 120,
    topic: "ratio-proportion",
    difficulty: "hard",
    category: "Mixtures",
    q: "In a mixture of 60 liters, the ratio of milk and water is 2:1. What amount of water must be added to make the ratio 1:2?",
    options: ["A) 30 liters", "B) 40 liters", "C) 60 liters", "D) 20 liters"],
    answer: "C) 60 liters",
    explanation: "Initial milk = 60 * 2/3 = 40 liters. Initial water = 20 liters. Let added water be x. Milk : Water = 40 : (20 + x) = 1 : 2 => 80 = 20 + x => x = 60 liters.",
    shortcut: "To double the water proportion relative to fixed milk, water must increase from 1 part (20L) to 4 parts (80L), so add 60L.",
    company: "Google, Amazon"
  },

  // === SQUARE NUMBERS ===
  {
    id: 121,
    topic: "squares",
    difficulty: "easy",
    category: "Multiplication",
    q: "What is the square of 17?",
    options: ["A) 256", "B) 289", "C) 324", "D) 279"],
    answer: "B) 289",
    explanation: "17 * 17 = 289.",
    shortcut: "Learn squares up to 30.",
    company: "Infosys"
  },
  {
    id: 122,
    topic: "squares",
    difficulty: "easy",
    category: "Square Roots",
    q: "Find the square root of 625.",
    options: ["A) 15", "B) 25", "C) 35", "D) 20"],
    answer: "B) 25",
    explanation: "25 * 25 = 625, hence square root is 25.",
    shortcut: "Ends in 25, so root ends in 5. Since 2*3 = 6, root is 25.",
    company: "TCS"
  },
  {
    id: 123,
    topic: "squares",
    difficulty: "medium",
    category: "Speed Tricks",
    q: "What is the square of 95?",
    options: ["A) 9025", "B) 9125", "C) 8925", "D) 9035"],
    answer: "A) 9025",
    explanation: "95 * 95 = 9025.",
    shortcut: "For numbers ending in 5: Multiply the tens digit (9) by its successor (10) to get 90, and append 25. Result: 9025.",
    company: "Wipro"
  },
  {
    id: 124,
    topic: "squares",
    difficulty: "medium",
    category: "Geometry Links",
    q: "The area of a square plot is 1024 sq meters. Find its perimeter.",
    options: ["A) 64m", "B) 96m", "C) 112m", "D) 128m"],
    answer: "D) 128m",
    explanation: "Area of square = side^2 = 1024 => side = √1024 = 32m. Perimeter = 4 * side = 4 * 32 = 128m.",
    shortcut: "side = √1024 = 32. Perimeter = 32 * 4 = 128.",
    company: "Accenture"
  },
  {
    id: 125,
    topic: "squares",
    difficulty: "hard",
    category: "Number Theory",
    q: "Find the smallest perfect square number that is divisible by each of the numbers 4, 9, and 10.",
    options: ["A) 400", "B) 900", "C) 1600", "D) 3600"],
    answer: "B) 900",
    explanation: "LCM of 4, 9, 10: 4 = 2^2, 9 = 3^2, 10 = 2*5. LCM = 2^2 * 3^2 * 5 = 180. To make 180 a perfect square, multiply by the unpaired factor (5). Perfect square = 180 * 5 = 900.",
    shortcut: "Test options. 400 not divisible by 9. 900 is divisible by 4, 9, 10 and is a square of 30.",
    company: "HCL, TCS Digital"
  },

  // === PROBABILITY ===
  {
    id: 126,
    topic: "probability",
    difficulty: "easy",
    category: "Coins",
    q: "A coin is tossed twice. Find the probability of getting at least one head.",
    options: ["A) 1/4", "B) 1/2", "C) 3/4", "D) 1"],
    answer: "C) 3/4",
    explanation: "Sample space S = {HH, HT, TH, TT}. Favourable outcomes = {HH, HT, TH} (3 outcomes). Probability = 3/4.",
    shortcut: "Probability of at least one head = 1 - P(no heads, i.e. TT) = 1 - 1/4 = 3/4.",
    company: "Infosys"
  },
  {
    id: 127,
    topic: "probability",
    difficulty: "easy",
    category: "Cards",
    q: "A card is drawn from a pack of 52 cards. What is the probability that it is a King?",
    options: ["A) 1/52", "B) 1/13", "C) 4/13", "D) 2/13"],
    answer: "B) 1/13",
    explanation: "Total Kings in a deck = 4. Total cards = 52. Probability = 4 / 52 = 1 / 13.",
    shortcut: "4/52 = 1/13.",
    company: "TCS"
  },
  {
    id: 128,
    topic: "probability",
    difficulty: "medium",
    category: "Dice",
    q: "Two dice are thrown together. Find the probability that the sum of the numbers on the two faces is 7.",
    options: ["A) 1/12", "B) 1/6", "C) 1/9", "D) 5/36"],
    answer: "B) 1/6",
    explanation: "Total outcomes = 36. Favourable outcomes for sum 7: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) (6 outcomes). Probability = 6 / 36 = 1/6.",
    shortcut: "Sum of 7 always has 6 combinations. P = 6/36 = 1/6.",
    company: "Cognizant"
  },
  {
    id: 129,
    topic: "probability",
    difficulty: "medium",
    category: "Ball Drawings",
    q: "A bag contains 5 red and 3 blue balls. If two balls are drawn at random, find the probability that both are red.",
    options: ["A) 5/14", "B) 10/28", "C) 5/8", "D) 15/56"],
    answer: "A) 5/14",
    explanation: "Total balls = 8. Ways to draw 2 balls = 8C2 = (8*7)/(2*1) = 28. Ways to draw 2 red balls = 5C2 = (5*4)/(2*1) = 10. Probability = 10/28 = 5/14.",
    shortcut: "First draw P(Red) = 5/8. Second draw P(Red) = 4/7. Combined = (5/8) * (4/7) = 20/56 = 5/14.",
    company: "Accenture"
  },
  {
    id: 130,
    topic: "probability",
    difficulty: "hard",
    category: "Three Coins",
    q: "Three coins are tossed. What is the probability of getting at most two heads?",
    options: ["A) 7/8", "B) 1/8", "C) 3/8", "D) 1/2"],
    answer: "A) 7/8",
    explanation: "Total outcomes = 2^3 = 8. 'At most 2 heads' means all outcomes except 'exactly 3 heads' (HHH). P(HHH) = 1/8. Probability = 1 - 1/8 = 7/8.",
    shortcut: "At most 2 heads = 1 - P(3 heads) = 1 - 1/8 = 7/8.",
    company: "Amazon, Adobe"
  },

  // === INTEREST ===
  {
    id: 131,
    topic: "interest",
    difficulty: "easy",
    category: "Simple Interest",
    q: "Find the simple interest on ₹5000 at 10% per annum for 2 years.",
    options: ["A) ₹500", "B) ₹800", "C) ₹1000", "D) ₹1500"],
    answer: "C) ₹1000",
    explanation: "SI = (P * R * T) / 100 = (5000 * 10 * 2) / 100 = ₹1000.",
    shortcut: "10% for 2 years is 20%. 20% of 5000 = 1000.",
    company: "Infosys"
  },
  {
    id: 132,
    topic: "interest",
    difficulty: "easy",
    category: "SI Double Timeline",
    q: "In how many years will a sum of money double itself at 12.5% per annum simple interest?",
    options: ["A) 6 years", "B) 8 years", "C) 10 years", "D) 12 years"],
    answer: "B) 8 years",
    explanation: "To double itself, Interest must equal Principal (I = P). Formula: P = (P * 12.5 * T)/100 => T = 100 / 12.5 = 8 years.",
    shortcut: "T = 100 / R = 100 / 12.5 = 8 years.",
    company: "TCS"
  },
  {
    id: 133,
    topic: "interest",
    difficulty: "medium",
    category: "Compound Interest",
    q: "What will be the compound interest on ₹10000 at 10% per annum compounded annually for 2 years?",
    options: ["A) ₹2000", "B) ₹2100", "C) ₹1900", "D) ₹2200"],
    answer: "B) ₹2100",
    explanation: "Amount A = P(1 + R/100)^T = 10000 * (1.1)^2 = 10000 * 1.21 = ₹12100. CI = A - P = 12100 - 10000 = ₹2100.",
    shortcut: "Effective CI rate for 2 years at 10% = 10 + 10 + (10*10)/100 = 21%. 21% of 10000 = 2100.",
    company: "Wipro"
  },
  {
    id: 134,
    topic: "interest",
    difficulty: "medium",
    category: "CI/SI Differences",
    q: "The difference between simple and compound interest on a sum of money for 2 years at 10% per annum is ₹25. Find the principal sum.",
    options: ["A) ₹2000", "B) ₹2500", "C) ₹3000", "D) ₹1500"],
    answer: "B) ₹2500",
    explanation: "For 2 years, Difference (D) = P * (R/100)^2. Here, 25 = P * (10/100)^2 => 25 = P * 1/100 => P = ₹2500.",
    shortcut: "P = Difference * (100/R)^2 = 25 * 10^2 = 2500.",
    company: "Accenture"
  },
  {
    id: 135,
    topic: "interest",
    difficulty: "hard",
    category: "CI Multiples",
    q: "A sum of money doubles itself in 4 years under compound interest. In how many years will it become 8 times itself?",
    options: ["A) 8 years", "B) 10 years", "C) 12 years", "D) 16 years"],
    answer: "C) 12 years",
    explanation: "If money becomes 2 times in 4 years, it will become 2^k times in k * T years. Here 8 times = 2^3 times, so new time = 3 * 4 = 12 years.",
    shortcut: "2x = 4 yrs. 4x = 8 yrs. 8x = 12 yrs. (compounding exponent: 2^3 means 3 cycles of 4 yrs = 12 yrs).",
    company: "Deloitte, Goldman Sachs"
  },

  // === NUMBER SYSTEM ===
  {
    id: 136,
    topic: "number-system",
    difficulty: "easy",
    category: "Prime Numbers",
    q: "Which of the following is a prime number?",
    options: ["A) 2", "B) 4", "C) 9", "D) 15"],
    answer: "A) 2",
    explanation: "A prime number is a number that has exactly two factors: 1 and itself. 2 is prime (and the only even prime). 4, 9, 15 have more than two factors.",
    shortcut: "2 is the smallest and only even prime number.",
    company: "Infosys"
  },
  {
    id: 137,
    topic: "number-system",
    difficulty: "easy",
    category: "Unit Digits",
    q: "Find the unit digit of the expression 7^105.",
    options: ["A) 1", "B) 3", "C) 7", "D) 9"],
    answer: "C) 7",
    explanation: "Cyclicity of 7 is 4. Divide power 105 by 4: remainder is 1. Unit digit of 7^105 = 7^1 = 7.",
    shortcut: "105 mod 4 = 1 => 7^1 = 7.",
    company: "TCS"
  },
  {
    id: 138,
    topic: "number-system",
    difficulty: "medium",
    category: "HCF/LCM",
    q: "What is the HCF of 12 and 18?",
    options: ["A) 2", "B) 3", "C) 6", "D) 12"],
    answer: "C) 6",
    explanation: "Factors of 12 = 1, 2, 3, 4, 6, 12. Factors of 18 = 1, 2, 3, 6, 9, 18. Greatest common factor is 6.",
    shortcut: "HCF is the largest number dividing both. 6 divides both 12 and 18.",
    company: "Wipro"
  },
  {
    id: 139,
    topic: "number-system",
    difficulty: "medium",
    category: "Remainders",
    q: "Find the remainder when 2^31 is divided by 5.",
    options: ["A) 1", "B) 2", "C) 3", "D) 4"],
    answer: "C) 3",
    explanation: "Using cyclicity of remainders for powers of 2 mod 5: 2^1 mod 5 = 2; 2^2 mod 5 = 4; 2^3 mod 5 = 3; 2^4 mod 5 = 1. The remainder repeats in a cycle of 4. Power 31 mod 4 = 3, so remainder matches 2^3 mod 5 = 3.",
    shortcut: "2^31 = 2^3 * (2^4)^7 = 8 * 16^7. Mod 5: 16 ≡ 1 => 8 * 1 ≡ 3.",
    company: "Accenture"
  },
  {
    id: 140,
    topic: "number-system",
    difficulty: "hard",
    category: "LCM Word Problems",
    q: "What is the smallest number which when divided by 6, 7, 8, 9, and 12 leaves a remainder of 1 in each case?",
    options: ["A) 253", "B) 504", "C) 505", "D) 252"],
    answer: "C) 505",
    explanation: "Required number = LCM(6, 7, 8, 9, 12) + remainder. LCM of 6, 7, 8, 9, 12 is 504. Number = 504 + 1 = 505.",
    shortcut: "LCM(6,7,8,9,12) = 504. Result = 504 + 1 = 505.",
    company: "Cognizant, TCS Digital"
  }
];

export const allAptitudeQuestions = [...mappedTimeWorkQuestions, ...generatedQuizQuestions];
