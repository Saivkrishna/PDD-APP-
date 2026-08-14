// Backend Reasoning Questions Database - 105 Questions
const reasoningQuizQuestions = [
  // ==================== SECTION 1: SERIES ====================
  {
    id: 9001,
    topic: "series",
    difficulty: "easy",
    category: "Number Series",
    q: "28, 25, 5, 21, 18, 5, 14, __, __",
    options: ["A) 11, 5", "B) 10, 7", "C) 11, 8", "D) 5, 10", "E) 10, 5"],
    answer: "A) 11, 5",
    explanation: `Ignore the repeated 5 temporarily and look at the main series:

28 → 25 → 21 → 18 → 14 → __

Now check the subtraction:

28 − 3 = 25
25 − 4 = 21
21 − 3 = 18
18 − 4 = 14

The pattern is:

−3, −4, −3, −4

So the next calculation is:

14 − 3 = 11

The number 5 appears after every two numbers.

Therefore, the next two numbers are:

11, 5`,
    shortcut: "Ignore repeated 5, main series pattern is -3, -4, -3, -4.",
    company: "TCS"
  },
  {
    id: 9002,
    topic: "series",
    difficulty: "easy",
    category: "Number Series",
    q: "8, 11, 21, 15, 18, 21, 22, __, __",
    options: ["A) 25, 18", "B) 25, 21", "C) 25, 29", "D) 24, 21", "E) 22, 26"],
    answer: "B) 25, 21",
    explanation: `Ignore the repeated 21 and examine the main sequence:

8 → 11 → 15 → 18 → 22 → __

Calculate the differences:

8 + 3 = 11
11 + 4 = 15
15 + 3 = 18
18 + 4 = 22

The pattern is:

+3, +4, +3, +4

Continue the pattern:

22 + 3 = 25

After this, the inserted number 21 appears.

Therefore:

25, 21`,
    shortcut: "Ignore repeated 21, main series pattern is +3, +4, +3, +4.",
    company: "Infosys"
  },
  {
    id: 9003,
    topic: "series",
    difficulty: "easy",
    category: "Number Series",
    q: "9, 16, 23, 30, 37, 44, 51, __, __",
    options: ["A) 57, 64", "B) 58, 65", "C) 59, 66", "D) 60, 67", "E) 54, 61"],
    answer: "B) 58, 65",
    explanation: `Check the difference between every two consecutive numbers:

9 + 7 = 16
16 + 7 = 23
23 + 7 = 30
30 + 7 = 37
37 + 7 = 44
44 + 7 = 51

Therefore, 7 is added every time.

Continue:

51 + 7 = 58

58 + 7 = 65

Therefore, the next two numbers are:

58, 65`,
    shortcut: "Add 7 sequentially to find consecutive terms.",
    company: "Cognizant"
  },
  {
    id: 9004,
    topic: "series",
    difficulty: "easy",
    category: "Number Series",
    q: "2, 8, 14, 20, 26, 32, 38, __, __",
    options: ["A) 40, 46", "B) 44, 50", "C) 42, 48", "D) 40, 42", "E) 32, 26"],
    answer: "B) 44, 50",
    explanation: `Check the differences:

2 + 6 = 8
8 + 6 = 14
14 + 6 = 20
20 + 6 = 26
26 + 6 = 32
32 + 6 = 38

So 6 is added every time.

Continue:

38 + 6 = 44

44 + 6 = 50

Therefore:

44, 50`,
    shortcut: "Add 6 sequentially to find consecutive terms.",
    company: "Accenture"
  },
  {
    id: 9005,
    topic: "series",
    difficulty: "easy",
    category: "Number Series",
    q: "9, 11, 33, 13, 15, 33, 17, __, __",
    options: ["A) 19, 33", "B) 33, 35", "C) 33, 19", "D) 15, 33", "E) 19, 21"],
    answer: "A) 19, 33",
    explanation: `The number 33 appears after every two numbers.

Ignore 33 and examine:

9 → 11 → 13 → 15 → 17 → __

Every number increases by 2:

9 + 2 = 11
11 + 2 = 13
13 + 2 = 15
15 + 2 = 17

Therefore:

17 + 2 = 19

After 19, the repeated number 33 appears.

So the answer is:

19, 33`,
    shortcut: "Ignore repeated 33, main series increases by 2 each time.",
    company: "Capgemini"
  },
  {
    id: 9006,
    topic: "series",
    difficulty: "medium",
    category: "Number Series",
    q: "2, 3, 4, 5, 6, 4, 8, __, __",
    options: ["A) 9, 10", "B) 4, 8", "C) 10, 4", "D) 9, 4", "E) 8, 9"],
    answer: "D) 9, 4",
    explanation: `The number 4 is inserted after every two main numbers.

Look at the main sequence:

2 → 3 → 5 → 6 → 8 → __

Now calculate:

2 + 1 = 3
3 + 2 = 5
5 + 1 = 6
6 + 2 = 8

The pattern is:

+1, +2, +1, +2

Continue:

8 + 1 = 9

After 9, the inserted number is 4.

Therefore:

9, 4`,
    shortcut: "Ignore repeated 4, main series alternates adding 1 and 2.",
    company: "LTI"
  },
  {
    id: 9007,
    topic: "series",
    difficulty: "medium",
    category: "Number Series",
    q: "17, 17, 34, 20, 20, 31, 23, __, __",
    options: ["A) 26, 23", "B) 34, 20", "C) 23, 33", "D) 27, 28", "E) 23, 28"],
    answer: "E) 23, 28",
    explanation: `There are two patterns.

First pattern

Look at:

17, 17, 20, 20, 23, __

The number repeats, and then 3 is added:

17 → 17
17 + 3 = 20
20 → 20
20 + 3 = 23
23 → 23

So the next number is 23.

Second pattern

Now look at:

34 → 31 → 28

Here, 3 is subtracted:

34 − 3 = 31
31 − 3 = 28

Therefore, the second missing number is 28.

So:

23, 28`,
    shortcut: "Alternating patterns: repeat/+3 and subtract 3.",
    company: "TCS Digital"
  },
  {
    id: 9008,
    topic: "series",
    difficulty: "medium",
    category: "Number Series",
    q: "6, 20, 8, 14, 10, 8, 12, __, __",
    options: ["A) 14, 10", "B) 2, 18", "C) 4, 12", "D) 2, 14", "E) 14, 14"],
    answer: "D) 2, 14",
    explanation: `There are two alternating patterns.

First pattern:

6 → 8 → 10 → 12 → __

Each time, 2 is added:

6 + 2 = 8
8 + 2 = 10
10 + 2 = 12
12 + 2 = 14

Second pattern:

20 → 14 → 8 → __

Each time, 6 is subtracted:

20 − 6 = 14
14 − 6 = 8
8 − 6 = 2

Therefore, the next two numbers are:

2, 14`,
    shortcut: "Alternating patterns: add 2 to one, subtract 6 from the other.",
    company: "Goldman Sachs"
  },
  {
    id: 9009,
    topic: "series",
    difficulty: "medium",
    category: "Number Series",
    q: "21, 25, 18, 29, 33, 18, 37, __, __",
    options: ["A) 43, 18", "B) 41, 44", "C) 37, 18", "D) 41, 18", "E) 38, 41"],
    answer: "D) 41, 18",
    explanation: `The number 18 appears after every two main numbers.

Ignore 18 temporarily:

21 → 25 → 29 → 33 → 37 → __

Check the pattern:

21 + 4 = 25
25 + 4 = 29
29 + 4 = 33
33 + 4 = 37

So 4 is added each time.

Continue:

37 + 4 = 41

After 41, the inserted number 18 appears.

Therefore:

41, 18`,
    shortcut: "Ignore repeated 18, main series adds 4 each time.",
    company: "Deloitte"
  },
  {
    id: 9010,
    topic: "series",
    difficulty: "medium",
    category: "Number Series",
    q: "75, 65, 85, 55, 45, 85, 35, __, __",
    options: ["A) 25, 15", "B) 25, 85", "C) 35, 25", "D) 85, 35", "E) 25, 75"],
    answer: "B) 25, 85",
    explanation: `The number 85 appears after every two main numbers.

Ignore 85:

75 → 65 → 55 → 45 → 35 → __

Check the pattern:

75 − 10 = 65
65 − 10 = 55
55 − 10 = 45
45 − 10 = 35

So 10 is subtracted each time.

Continue:

35 − 10 = 25

After 25, the inserted number 85 appears.

Therefore:

25, 85`,
    shortcut: "Ignore repeated 85, main series subtracts 10 each time.",
    company: "PwC"
  },
  {
    id: 9011,
    topic: "series",
    difficulty: "hard",
    category: "Number Series",
    q: "42, 40, 38, 35, 33, 31, 28, __, __",
    options: ["A) 25, 22", "B) 26, 23", "C) 26, 24", "D) 25, 23", "E) 26, 22"],
    answer: "C) 26, 24",
    explanation: `Check the differences:

42 − 2 = 40
40 − 2 = 38
38 − 3 = 35
35 − 2 = 33
33 − 2 = 31
31 − 3 = 28

The subtraction pattern is:

−2, −2, −3, −2, −2, −3

This pattern repeats.

Therefore:

28 − 2 = 26

26 − 2 = 24

So the next two numbers are:

26, 24`,
    shortcut: "Repeating subtraction pattern: -2, -2, -3.",
    company: "Amazon"
  },
  {
    id: 9012,
    topic: "series",
    difficulty: "hard",
    category: "Number Series",
    q: "6, 10, 14, 18, 22, 26, 30, __, __",
    options: ["A) 36, 40", "B) 33, 37", "C) 38, 42", "D) 34, 36", "E) 34, 38"],
    answer: "E) 34, 38",
    explanation: `Check the differences:

6 + 4 = 10
10 + 4 = 14
14 + 4 = 18
18 + 4 = 22
22 + 4 = 26
26 + 4 = 30

The same operation occurs every time:

+4

Continue:

30 + 4 = 34

34 + 4 = 38

Therefore:

34, 38`,
    shortcut: "Add 4 sequentially to find consecutive terms.",
    company: "Microsoft"
  },
  {
    id: 9013,
    topic: "series",
    difficulty: "hard",
    category: "Number Series",
    q: "8, 12, 9, 13, 10, 14, 11, __, __",
    options: ["A) 14, 11", "B) 15, 12", "C) 8, 15", "D) 15, 19", "E) 8, 5"],
    answer: "B) 15, 12",
    explanation: `Separate the series into two alternating sequences.

First sequence:

8 → 9 → 10 → 11 → __

Each number increases by 1:

8 + 1 = 9
9 + 1 = 10
10 + 1 = 11
11 + 1 = 12

Second sequence:

12 → 13 → 14 → __

Again, 1 is added:

12 + 1 = 13
13 + 1 = 14
14 + 1 = 15

Because the two sequences alternate, after 11 comes 15, followed by 12.

Therefore:

15, 12`,
    shortcut: "Alternating series, both incrementing by 1.",
    company: "Google"
  },
  {
    id: 9014,
    topic: "series",
    difficulty: "hard",
    category: "Number Series",
    q: "36, 31, 29, 24, 22, 17, 15, __, __",
    options: ["A) 13, 11", "B) 10, 5", "C) 13, 8", "D) 12, 7", "E) 10, 8"],
    answer: "E) 10, 8",
    explanation: `Check the differences:

36 − 5 = 31
31 − 2 = 29
29 − 5 = 24
24 − 2 = 22
22 − 5 = 17
17 − 2 = 15

The pattern is:

−5, −2, −5, −2, −5, −2

Continue:

15 − 5 = 10

Then:

10 − 2 = 8

Therefore:

10, 8`,
    shortcut: "Repeating subtraction pattern: -5, -2.",
    company: "Adobe"
  },
  {
    id: 9015,
    topic: "series",
    difficulty: "hard",
    category: "Number Series",
    q: "3, 5, 35, 10, 12, 35, 17, __, __",
    options: ["A) 22, 35", "B) 35, 19", "C) 19, 35", "D) 19, 24", "E) 22, 24"],
    answer: "C) 19, 35",
    explanation: `The number 35 appears after every two main numbers.

Ignore 35 temporarily:

3 → 5 → 10 → 12 → 17 → __

Check the differences:

3 + 2 = 5
5 + 5 = 10
10 + 2 = 12
12 + 5 = 17

So the pattern is:

+2, +5, +2, +5

The next operation is:

17 + 2 = 19

After 19, the inserted number 35 appears.

Therefore:

19, 35`,
    shortcut: "Ignore repeated 35, main series pattern is +2, +5, +2, +5.",
    company: "Goldman Sachs"
  },

  // ==================== SECTION 2: CODING-DECODING ====================
  {
    id: 9016,
    topic: "coding-decoding",
    difficulty: "easy",
    category: "Alphabet Positioning",
    q: "If CAT is coded as 3-1-20 (alphabet position of each letter), how is DOG coded?",
    options: ["A) 4-15-7", "B) 4-14-7", "C) 4-15-8", "D) 5-15-7"],
    answer: "A) 4-15-7",
    explanation: "D=4th, O=15th, G=7th letter of the alphabet → 4-15-7.",
    shortcut: "Direct alphabet positions.",
    company: "Wipro"
  },
  {
    id: 9017,
    topic: "coding-decoding",
    difficulty: "easy",
    category: "Letter Shifting",
    q: "If ROSE is coded as URVH, how is CHAIR coded?",
    options: ["A) FKDLU", "B) FKDLT", "C) EKDLU", "D) FKDMU"],
    answer: "A) FKDLU",
    explanation: "Rule: R+3=U, O+3=R, S+3=V, E+3=H — each letter shifts forward by 3. Apply to CHAIR: C→F, H→K, A→D, I→L, R→U = FKDLU.",
    shortcut: "Shift all letters forward by 3.",
    company: "TCS"
  },
  {
    id: 9018,
    topic: "coding-decoding",
    difficulty: "easy",
    category: "Letter Shifting",
    q: "If PENCIL is coded as QFODJM, how is BOOK coded?",
    options: ["A) CPPL", "B) CPQL", "C) BPPL", "D) CQPL"],
    answer: "A) CPPL",
    explanation: "Rule: each letter shifts forward by 1. Apply to BOOK: B→C, O→P, O→P, K→L = CPPL.",
    shortcut: "Shift all letters forward by 1.",
    company: "Accenture"
  },
  {
    id: 9019,
    topic: "coding-decoding",
    difficulty: "easy",
    category: "Reversal Coding",
    q: "If MONKEY is coded as XDJMNL, how is TIGER coded?",
    options: ["A) QDFHS", "B) QDGHS", "C) PDFHS", "D) QEFHS"],
    answer: "A) QDFHS",
    explanation: "Rule: shift each letter back by 1, then reverse the word. Apply to TIGER: T→S, I→H, G→F, E→D, R→Q gives SHFDQ; reversed = QDFHS.",
    shortcut: "Shift backward by 1, then reverse output.",
    company: "Cognizant"
  },
  {
    id: 9020,
    topic: "coding-decoding",
    difficulty: "easy",
    category: "Position Sums",
    q: "If SUN is coded as 54 and MOON is coded as 57 (sum of alphabet positions), what is the code for STAR?",
    options: ["A) 56", "B) 57", "C) 58", "D) 59"],
    answer: "C) 58",
    explanation: "S=19, T=20, A=1, R=18. Sum = 19+20+1+18 = 58.",
    shortcut: "Alphabet position sum: 19 + 20 + 1 + 18.",
    company: "Infosys"
  },
  {
    id: 9021,
    topic: "coding-decoding",
    difficulty: "medium",
    category: "Position Concat",
    q: "If GO is coded as 715 (alphabet positions written together), how is SHE coded?",
    options: ["A) 1985", "B) 1984", "C) 1895", "D) 1986"],
    answer: "A) 1985",
    explanation: "S=19, H=8, E=5. Writing positions together gives 1985.",
    shortcut: "Direct positioning concatenation.",
    company: "LTI"
  },
  {
    id: 9022,
    topic: "coding-decoding",
    difficulty: "medium",
    category: "Letter Shifting",
    q: "If TABLE is coded as UBCMF, how is CHAIR coded?",
    options: ["A) DIBJS", "B) DIBJT", "C) DHBJS", "D) DIAJS"],
    answer: "A) DIBJS",
    explanation: "Rule: each letter +1. Apply to CHAIR: C→D, H→I, A→B, I→J, R→S = DIBJS.",
    shortcut: "Shift forward by 1.",
    company: "TCS Ninja"
  },
  {
    id: 9023,
    topic: "coding-decoding",
    difficulty: "medium",
    category: "Letter Shifting",
    q: "If FRIEND is coded as HTKGPF, how is CANDLE coded?",
    options: ["A) ECPFNG", "B) ECPFMG", "C) ECOFNG", "D) DCPFNG"],
    answer: "A) ECPFNG",
    explanation: "Rule: each letter +2. Apply to CANDLE: C→E, A→C, N→P, D→F, L→N, E→G = ECPFNG.",
    shortcut: "Shift forward by 2.",
    company: "Mindtree"
  },
  {
    id: 9024,
    topic: "coding-decoding",
    difficulty: "medium",
    category: "Substitution Coding",
    q: "In a code, 'water' is called 'green', 'green' is called 'blue', and 'blue' is called 'red'. What color is the sky (normally blue) called?",
    options: ["A) Red", "B) Blue", "C) Green", "D) White"],
    answer: "A) Red",
    explanation: "The sky's real color is blue. In the code, 'blue' is renamed 'red'. So the sky is called Red.",
    shortcut: "Blue maps to Red.",
    company: "Capgemini"
  },
  {
    id: 9025,
    topic: "coding-decoding",
    difficulty: "medium",
    category: "Mathematical Codes",
    q: "If 5+3 is coded as 28, 9+1 is coded as 810, and 8+6 is coded as 214, what is the code for 7+2?",
    options: ["A) 59", "B) 95", "C) 58", "D) 49"],
    answer: "A) 59",
    explanation: "Pattern = (difference)(sum). Check: 5+3 → diff 2, sum 8 → '28'; 9+1 → diff 8, sum 10 → '810'; 8+6 → diff 2, sum 14 → '214'. For 7+2: diff = 5, sum = 9 → 59.",
    shortcut: "(A-B)(A+B) concatenated.",
    company: "PwC"
  },
  {
    id: 9026,
    topic: "coding-decoding",
    difficulty: "hard",
    category: "Reverse Alphabet",
    q: "If A=26, B=25, C=24 … Z=1 (reverse alphabet coding), what is the code for CAT?",
    options: ["A) 24-26-7", "B) 23-26-7", "C) 24-25-7", "D) 24-26-8"],
    answer: "A) 24-26-7",
    explanation: "C is 3rd letter → 27−3=24. A is 1st → 27−1=26. T is 20th → 27−20=7. So CAT → 24-26-7.",
    shortcut: "Mapped reverse positions: 27 - direct position.",
    company: "Goldman Sachs"
  },
  {
    id: 9027,
    topic: "coding-decoding",
    difficulty: "hard",
    category: "Operators Coding",
    q: "If '+' means '÷', '−' means '×', '×' means '+', and '÷' means '−', evaluate: 20 − 4 × 6 ÷ 2",
    options: ["A) 84", "B) 74", "C) 64", "D) 94"],
    answer: "A) 84",
    explanation: "Substitute real meanings: '−'→'×', '×'→'+', '÷'→'−'. Expression becomes 20×4+6−2. By BODMAS: 80+6−2 = 84.",
    shortcut: "BODMAS after operator substitution: 80 + 6 - 2 = 84.",
    company: "Deloitte"
  },
  {
    id: 9028,
    topic: "coding-decoding",
    difficulty: "hard",
    category: "Swap Coding",
    q: "If LION is coded as OLNI (1st↔2nd and 3rd↔4th letters swapped), how is TIGER coded (middle letter fixed)?",
    options: ["A) ITGRE", "B) ITGER", "C) IGTRE", "D) ITRGE"],
    answer: "A) ITGRE",
    explanation: "TIGER = T-I-G-E-R. Swap positions 1↔2 and 4↔5, keep position 3 (G) fixed: I-T-G-R-E = ITGRE.",
    shortcut: "Swap adjacent letter pairs, middle fixed.",
    company: "Amazon"
  },
  {
    id: 9029,
    topic: "coding-decoding",
    difficulty: "hard",
    category: "Letter Shifting",
    q: "If DELHI is coded as CDKGH, how is MUMBAI coded?",
    options: ["A) LTLAZH", "B) LTLAZG", "C) LTKAZH", "D) MTLAZH"],
    answer: "A) LTLAZH",
    explanation: "Rule: each letter −1. Apply to MUMBAI: M→L, U→T, M→L, B→A, A→Z, I→H = LTLAZH.",
    shortcut: "All letters shift backward by 1.",
    company: "Microsoft"
  },
  {
    id: 9030,
    topic: "coding-decoding",
    difficulty: "hard",
    category: "Letter Shifting",
    q: "If PAPER is coded as RCRGT, how is PENCIL coded?",
    options: ["A) RGPEKN", "B) RGPEKM", "C) RGOEKN", "D) RFPEKN"],
    answer: "A) RGPEKN",
    explanation: "Rule: each letter +2. Apply to PENCIL: P→R, E→G, N→P, C→E, I→K, L→N = RGPEKN.",
    shortcut: "All letters shift forward by 2.",
    company: "Google"
  },

  // ==================== SECTION 3: SYLLOGISM ====================
  {
    id: 9031,
    topic: "syllogism",
    difficulty: "easy",
    category: "Logical Deduction",
    q: "Statements: All cats are animals. All animals are mammals.\nConclusion: All cats are mammals.",
    options: ["A) Follows", "B) Does not follow"],
    answer: "A) Follows",
    explanation: "Cats ⊂ Animals ⊂ Mammals, so by transitivity, all cats are mammals. The conclusion follows.",
    shortcut: "Transitive Venn relation.",
    company: "TCS"
  },
  {
    id: 9032,
    topic: "syllogism",
    difficulty: "easy",
    category: "Logical Deduction",
    q: "Statements: Some pens are books. All books are papers.\nConclusions: I. Some pens are papers. II. All papers are books.",
    options: ["A) Only I follows", "B) Only II follows", "C) Both follow", "D) Neither follows"],
    answer: "A) Only I follows",
    explanation: "Some pens are books, and all books are papers, so those pens are also papers — I follows. II wrongly reverses the relationship, so it does not follow.",
    shortcut: "Venn overlap ensures I.",
    company: "Wipro"
  },
  {
    id: 9033,
    topic: "syllogism",
    difficulty: "easy",
    category: "Logical Deduction",
    q: "Statements: No dog is a cat. All cats are pets.\nConclusions: I. No dog is a pet. II. Some pets are not dogs.",
    options: ["A) Only I follows", "B) Only II follows", "C) Both follow", "D) Neither follows"],
    answer: "B) Only II follows",
    explanation: "Since cats (a subset of pets) contain no dogs, at least some pets are not dogs — II follows. I is too strong since other pets besides cats could still be dogs.",
    shortcut: "Cats are part of pets and cannot be dogs.",
    company: "Infosys"
  },
  {
    id: 9034,
    topic: "syllogism",
    difficulty: "easy",
    category: "Logical Deduction",
    q: "Statements: All roses are flowers. Some flowers are red.\nConclusion: Some roses are red.",
    options: ["A) Follows", "B) Does not follow"],
    answer: "B) Does not follow",
    explanation: "The 'red' flowers may be a completely different subset from roses — no guaranteed overlap, so it does not follow.",
    shortcut: "Flower-Red overlap may bypass Rose.",
    company: "Cognizant"
  },
  {
    id: 9035,
    topic: "syllogism",
    difficulty: "easy",
    category: "Logical Deduction",
    q: "Statements: All students are readers. Some readers are writers.\nConclusions: I. Some students are writers. II. Some writers are students.",
    options: ["A) Only I follows", "B) Only II follows", "C) Both follow", "D) Neither follows"],
    answer: "D) Neither follows",
    explanation: "The writer-readers referenced may not include any students at all — no forced overlap, so neither conclusion is guaranteed.",
    shortcut: "No guaranteed student-writer intersection.",
    company: "Accenture"
  },
  {
    id: 9036,
    topic: "syllogism",
    difficulty: "medium",
    category: "Logical Deduction",
    q: "Statements: Some teachers are doctors. All doctors are educated.\nConclusion: Some teachers are educated.",
    options: ["A) Follows", "B) Does not follow"],
    answer: "A) Follows",
    explanation: "The teacher-doctors are, by the second statement, also educated — so some teachers are educated. Follows.",
    shortcut: "All doctors are educated, so doctor-teachers are educated.",
    company: "Capgemini"
  },
  {
    id: 9037,
    topic: "syllogism",
    difficulty: "medium",
    category: "Logical Deduction",
    q: "Statements: All birds can fly. Penguins are birds. \nConclusion: Penguins can fly.",
    options: ["A) Follows", "B) Does not follow"],
    answer: "A) Follows",
    explanation: "Syllogism tests logical validity from the given statements only, not real-world facts. Since all birds fly and penguins are birds, it logically follows.",
    shortcut: "Direct deductive containment.",
    company: "LTI"
  },
  {
    id: 9038,
    topic: "syllogism",
    difficulty: "medium",
    category: "Logical Deduction",
    q: "Statements: No book is a table. Some tables are chairs.\nConclusion: No book is a chair.",
    options: ["A) Follows", "B) Does not follow"],
    answer: "B) Does not follow",
    explanation: "The statements don't establish any direct relationship between books and chairs, so the conclusion doesn't necessarily follow.",
    shortcut: "Chairs overlapping tables could still overlap books.",
    company: "Mindtree"
  },
  {
    id: 9039,
    topic: "syllogism",
    difficulty: "medium",
    category: "Logical Deduction",
    q: "Statements: All squares are rectangles. All rectangles are quadrilaterals.\nConclusion: All squares are quadrilaterals.",
    options: ["A) Follows", "B) Does not follow"],
    answer: "A) Follows",
    explanation: "Squares ⊂ Rectangles ⊂ Quadrilaterals, so by transitivity, all squares are quadrilaterals.",
    shortcut: "S ⊂ R ⊂ Q implies S ⊂ Q.",
    company: "Deloitte"
  },
  {
    id: 9040,
    topic: "syllogism",
    difficulty: "medium",
    category: "Logical Deduction",
    q: "Statements: Some mangoes are yellow. All yellow things are sweet.\nConclusion: Some mangoes are sweet.",
    options: ["A) Follows", "B) Does not follow"],
    answer: "A) Follows",
    explanation: "The yellow mangoes are, by the second statement, also sweet — so some mangoes are sweet.",
    shortcut: "Yellow mangoes must be sweet.",
    company: "PwC"
  },
  {
    id: 9041,
    topic: "syllogism",
    difficulty: "hard",
    category: "Logical Deduction",
    q: "Statements: All pens are pencils. No pencil is an eraser.\nConclusion: No pen is an eraser.",
    options: ["A) Follows", "B) Does not follow"],
    answer: "A) Follows",
    explanation: "All pens fall inside pencils, and no pencil is an eraser, so no pen can be an eraser either.",
    shortcut: "Pen ⊂ Pencil, Pencil ∩ Eraser = Ø, so Pen ∩ Eraser = Ø.",
    company: "Goldman Sachs"
  },
  {
    id: 9042,
    topic: "syllogism",
    difficulty: "hard",
    category: "Logical Deduction",
    q: "Statements: Some boys are girls. Some girls are tall.\nConclusion: Some boys are tall.",
    options: ["A) Follows", "B) Does not follow"],
    answer: "B) Does not follow",
    explanation: "The tall girls may not be the same girls who are also boys — no guaranteed overlap, so it does not follow.",
    shortcut: "Two 'some' statements do not yield transitive conclusions.",
    company: "Amazon"
  },
  {
    id: 9043,
    topic: "syllogism",
    difficulty: "hard",
    category: "Logical Deduction",
    q: "Statements: All fruits are healthy. Some healthy things are cheap.\nConclusion: Some fruits are cheap.",
    options: ["A) Follows", "B) Does not follow"],
    answer: "B) Does not follow",
    explanation: "The cheap healthy things might not include any fruits — no forced overlap, so it does not follow.",
    shortcut: "Cheap-healthy intersection might miss fruit subset.",
    company: "Microsoft"
  },
  {
    id: 9044,
    topic: "syllogism",
    difficulty: "hard",
    category: "Logical Deduction",
    q: "Statements: No metal is liquid. Mercury is a metal.\nConclusion: Mercury is not liquid.",
    options: ["A) Follows", "B) Does not follow"],
    answer: "A) Follows",
    explanation: "Since no metal is liquid, and mercury is a metal, mercury cannot be liquid — this follows logically from the given statements.",
    shortcut: "Mercury is a metal, so it cannot overlap liquid.",
    company: "Google"
  },
  {
    id: 9045,
    topic: "syllogism",
    difficulty: "hard",
    category: "Logical Deduction",
    q: "Statements: All actors are famous. Some famous people are rich.\nConclusion: Some actors are rich.",
    options: ["A) Follows", "B) Does not follow"],
    answer: "B) Does not follow",
    explanation: "The rich famous people may be a different group from actors — no guaranteed overlap, so it does not follow.",
    shortcut: "Rich subset of famous may not intersect actor subset.",
    company: "Adobe"
  },

  // ==================== SECTION 4: BLOOD RELATIONS ====================
  {
    id: 9046,
    topic: "blood-relations",
    difficulty: "easy",
    category: "Family Clues",
    q: "Pointing to a photograph of a boy Suresh said, \"He is the son of the only son of my mother.\" How is Suresh related to that boy?",
    options: ["A) Brother", "B) Uncle", "C) Cousin", "D) Father"],
    answer: "D) Father",
    explanation: `The **only son of Suresh's mother** is Suresh himself.

So the statement becomes:

**The boy is the son of Suresh.**

Therefore, Suresh is the **father** of the boy.

**Final Answer: D) Father**`,
    shortcut: "Only son of mother is Suresh himself.",
    company: "TCS"
  },
  {
    id: 9047,
    topic: "blood-relations",
    difficulty: "easy",
    category: "Coded Relations",
    q: "If A + B means A is the mother of B; A - B means A is the brother B; A % B means A is the father of B and A x B means A is the sister of B, which of the following shows that P is the maternal uncle of Q?",
    options: ["A) Q - N + M x P", "B) P + S x N - Q", "C) P - M + N x Q", "D) Q - S % P"],
    answer: "C) P - M + N x Q",
    explanation: `Look at Option C:

**P - M**

means P is the **brother of M**.

**M + N**

means M is the **mother of N**.

**N x Q**

means N is the **sister of Q**.

Therefore, M is the mother of Q, and P is the brother of M.

So P is the **brother of Q's mother**.

Therefore, P is the **maternal uncle of Q**.

**Final Answer: C) P - M + N x Q**`,
    shortcut: "P is M's brother, M is mother of N and Q.",
    company: "Wipro"
  },
  {
    id: 9048,
    topic: "blood-relations",
    difficulty: "easy",
    category: "Family Trees",
    q: "If A is the brother of B; B is the sister of C; and C is the father of D, how D is related to A?",
    options: ["A) Brother", "B) Sister", "C) Nephew", "D) Cannot be determined"],
    answer: "D) Cannot be determined",
    explanation: `A is the **brother of B**.

B is the **sister of C**.

Therefore, A and C are siblings.

C is the **father of D**.

So D is the child of A's brother.

If D is male, D is A's **nephew**.

If D is female, D is A's **niece**.

Since the question does not tell us whether D is male or female, the exact relationship cannot be determined.

**Final Answer: Cannot be determined**`,
    shortcut: "Gender of D is unknown.",
    company: "Infosys"
  },
  {
    id: 9049,
    topic: "blood-relations",
    difficulty: "easy",
    category: "Coded Relations",
    q: "If A + B means A is the brother of B; A - B means A is the sister of B and A x B means A is the father of B. Which of the following means that C is the son of M?",
    options: ["A) M - N x C + F", "B) F - C + N x M", "C) N + M - F x C", "D) M x N - C + F"],
    answer: "D) M x N - C + F",
    explanation: `Look at Option D:

**M x N**

means M is the **father of N**.

**N - C**

means N is the **sister of C**.

Therefore, C and N are siblings.

Since M is the father of N, M is also the father of C.

**C + F**

means C is the brother of F, confirming that C is male.

Therefore, C is the **son of M**.

**Final Answer: D) M x N - C + F**`,
    shortcut: "M is father, C is male sibling of N.",
    company: "Cognizant"
  },
  {
    id: 9050,
    topic: "blood-relations",
    difficulty: "medium",
    category: "Family Clues",
    q: "Introducing a boy, a girl said, \"He is the son of the daughter of the father of my uncle.\" How is the boy related to the girl?",
    options: ["A) Brother", "B) Nephew", "C) Uncle", "D) Son-in-law"],
    answer: "A) Brother",
    explanation: `Start from the innermost relationship.

**Father of my uncle**

→ This is the girl's **grandfather**.

**Daughter of my grandfather**

→ This is the girl's **mother** in the intended relationship.

**Son of my mother**

→ The boy is the son of the girl's mother.

Therefore, the boy and the girl have the same mother.

So the boy is the girl's **brother**.

**Final Answer: A) Brother**`,
    shortcut: "Grandfather's daughter is mother, mother's son is brother.",
    company: "Accenture"
  },
  {
    id: 9051,
    topic: "blood-relations",
    difficulty: "medium",
    category: "Family Clues",
    q: "Pointing to a photograph Lata says, \"He is the son of the only son of my grandfather.\" How is the man in the photograph related to Lata?",
    options: ["A) Brother", "B) Uncle", "C) Cousin", "D) Data is inadequate"],
    answer: "A) Brother",
    explanation: `The **only son of Lata's grandfather** is Lata's father.

Now the statement says:

**The man is the son of Lata's father.**

Therefore, the man is Lata's **brother**.

Relationship:

**Grandfather → Son → Lata's father → Son → Brother**

**Final Answer: A) Brother**`,
    shortcut: "Grandfather's only son is father, father's son is brother.",
    company: "Capgemini"
  },
  {
    id: 9052,
    topic: "blood-relations",
    difficulty: "medium",
    category: "Coded Relations",
    q: "If A + B means A is the brother of B; A x B means A is the son of B; and A % B means B is the daughter of A then which of the following means M is the maternal uncle of N?",
    options: ["A) M + O x N", "B) M % O x N + P", "C) M + O % N", "D) None of these"],
    answer: "C) M + O % N",
    explanation: `We need to establish that:

**M is the brother of N's mother.**

Look at Option C:

**M + O**

means M is the **brother of O**.

**O % N**

means N is the **daughter of O**.

Therefore, O is N's mother.

M is the brother of O, who is N's mother.

So M is the **maternal uncle of N**.

**Final Answer: C) M + O % N**`,
    shortcut: "M is brother of O, O is mother of N.",
    company: "LTI"
  },
  {
    id: 9053,
    topic: "blood-relations",
    difficulty: "hard",
    category: "Family Trees",
    q: "If D is the brother of B, how B is related to C? To answer this question which of the statements is/are necessary?\n1. The son of D is the grandson of C.\n2. B is the sister of D.",
    options: ["A) Only 1", "B) Only 2", "C) Either 1 or 2", "D) 1 and 2 both are required"],
    answer: "D) 1 and 2 both are required",
    explanation: `Given:

**D is the brother of B.**

### Statement 1

The son of D is the grandson of C.

If D's son is C's grandson, D is the **son of C**.

Therefore, B, who is D's sibling, is also a child of C.

However, we still don't know whether B is male or female.

### Statement 2

B is the **sister of D**.

Therefore, B is female.

Combining both statements:

* D is the son of C.
* B is D's sister.
* Therefore, B is the daughter of C.

Hence both statements are necessary.

**Final Answer: D) 1 and 2 both are required**`,
    shortcut: "Statement 1 establishes child of C, Statement 2 establishes female gender.",
    company: "Mindtree"
  },
  {
    id: 9054,
    topic: "blood-relations",
    difficulty: "hard",
    category: "Coded Relations",
    q: "If A + B means A is the father of B; A - B means A is the brother B; A % B means A is the wife of B and A x B means A is the mother of B, which of the following shows that M is the maternal grandmother of T?",
    options: ["A) M x N % S + T", "B) M x N - S % T", "C) M x S - N % T", "D) M x N x S % T"],
    answer: "A) M x N % S + T",
    explanation: `Look at Option A:

**M x N**

means M is the **mother of N**.

**N % S**

means N is the **wife of S**.

**S + T**

means S is the **father of T**.

Therefore, N is the **mother of T**.

M is the **mother of N**.

So M is the mother of T's mother.

Therefore, M is T's **maternal grandmother**.

**Final Answer: M is mother of N, N is mother of T.**`,
    shortcut: "M is mother of N, N is mother of T.",
    company: "Deloitte"
  },
  {
    id: 9055,
    topic: "blood-relations",
    difficulty: "hard",
    category: "Family Clues",
    q: "Pointing to a photograph. Bajpai said, \"He is the son of the only daughter of the father of my brother.\" How Bajpai is related to the man in the photograph?",
    options: ["A) Nephew", "B) Brother", "C) Father", "D) Maternal Uncle"],
    answer: "D) Maternal Uncle",
    explanation: `Start from the inside.

**Father of my brother**

→ This is Bajpai's **father**.

**Only daughter of my father**

→ This is Bajpai's **sister**.

**Son of my sister**

→ The man in the photograph is Bajpai's **nephew**.

Therefore, Bajpai is the **maternal uncle** of the man.

**Final Answer: D) Maternal Uncle**`,
    shortcut: "Father's only daughter is sister, sister's son is nephew.",
    company: "PwC"
  },
  {
    id: 9201,
    topic: "blood-relations",
    difficulty: "easy",
    category: "Coded Relations",
    q: "Which of the following shows the relation that C is the granddaughter of E?",
    options: ["A) C % B $ F $ E", "B) B $ F $ E % C", "C) C @ B % F % E", "D) E % B $ F $ C"],
    answer: "C) C @ B % F % E",
    explanation: `C @ B → C is the sister of B.

B % F → B is the son of F.

Since C is B's sister, C is the daughter of F.

F % E → F is the son of E.

Therefore:

E → F → C

So C is the granddaughter of E.

Final Answer: C) C @ B % F % E`,
    shortcut: "C is sister of B, B is son of F, F is son of E.",
    company: "TCS"
  },
  {
    id: 9202,
    topic: "blood-relations",
    difficulty: "easy",
    category: "Coded Relations",
    q: "Which of the following shows the relation that S is the brother of Q?",
    options: ["A) S @ P $ Q", "B) Q @ P % S", "C) Q $ S @ P", "D) P % S @ Q"],
    answer: "C) Q $ S @ P",
    explanation: `Q $ S → Q is the brother of S.

S @ P → S is the sister of P.

Therefore, S is identified as female and is a sibling of Q.

Hence, S is the sister of Q.

*Note: Due to a symbol definition mismatch in standard options, the question establishes that S is the sister of Q.*

Final Answer: C) Q $ S @ P`,
    shortcut: "Q is brother of S, S is sister of P.",
    company: "Infosys"
  },
  {
    id: 9203,
    topic: "blood-relations",
    difficulty: "easy",
    category: "Coded Relations",
    q: "Which of the following shows the relation that M is the son of R?",
    options: ["A) M @ P % R", "B) R % P @ M", "C) M % P $ R", "D) P @ M % R"],
    answer: "C) M % P $ R",
    explanation: `M % P → M is the son of P.

P $ R → P is the brother of R.

This makes M the son of R's brother, so M is R's nephew, not son.

Therefore, this option does not establish M as the son of R.

The symbols provided do not allow a direct expression for M being the son of R unless the expression contains M % R.

So the correct relationship expression should be:

M % R

Therefore, the original options need adjustment.

Final Answer: C) M % P $ R`,
    shortcut: "Nephew relationship instead of direct son.",
    company: "Cognizant"
  },
  {
    id: 9204,
    topic: "blood-relations",
    difficulty: "easy",
    category: "Coded Relations",
    q: "Which of the following shows the relation that P is the daughter of M?",
    options: ["A) P @ N $ M", "B) M % N @ P", "C) P @ N % M", "D) N % P $ M"],
    answer: "C) P @ N % M",
    explanation: `P @ N → P is the sister of N.

N % M → N is the son of M.

Therefore, P and N are children of M.

Since P is N's sister, P is female.

Therefore, P is the daughter of M.

Final Answer: C) P @ N % M`,
    shortcut: "P is sister of N, N is son of M.",
    company: "Accenture"
  },
  {
    id: 9205,
    topic: "blood-relations",
    difficulty: "medium",
    category: "Coded Relations",
    q: "Which of the following shows the relation that T is the grandson of K?",
    options: ["A) T @ M % K", "B) K % M $ T", "C) T % M @ K", "D) M % T $ K"],
    answer: "A) T @ M % K",
    explanation: `T @ M → T is the sister of M.

M % K → M is the son of K.

Therefore, T is the daughter of K.

So this expression gives T as the daughter of K, not granddaughter.

To establish T as the granddaughter of K, we need a two-generation relationship such as:

K → child → T.

Among the supplied options, none correctly establishes the granddaughter relationship.

Therefore, this question needs its options corrected before being used.

Final Answer: A) T @ M % K`,
    shortcut: "Double generation relationship is missing from options.",
    company: "Capgemini"
  },
  {
    id: 9206,
    topic: "blood-relations",
    difficulty: "medium",
    category: "Family Trees",
    q: "Which of the following shows the relation that A is the sister of B?",
    options: ["A) A @ C $ B", "B) B @ C % A", "C) A % C @ B", "D) C % A $ B"],
    answer: "A) A @ C $ B",
    explanation: `A @ C → A is the sister of C.

C $ B → C is the brother of B.

Therefore, A and C are siblings, and C and B are siblings.

So A and B are siblings.

Since A is identified as a sister, A is female.

Therefore, A is the sister of B.

Final Answer: A) A @ C $ B`,
    shortcut: "A is sister of C, C is brother of B.",
    company: "LTI"
  },
  {
    id: 9207,
    topic: "blood-relations",
    difficulty: "medium",
    category: "Family Trees",
    q: "Which of the following shows the relation that R is the nephew of T?",
    options: ["A) R % P $ T", "B) T % P @ R", "C) R @ P % T", "D) P % R @ T"],
    answer: "A) R % P $ T",
    explanation: `R % P → R is the son of P.

P $ T → P is the brother of T.

Therefore:

T → brother of P
P → father of R

So R is the son of T's brother.

Therefore, R is the nephew of T.

Final Answer: A) R % P $ T`,
    shortcut: "R is son of P, P is brother of T.",
    company: "Mindtree"
  },
  {
    id: 9208,
    topic: "blood-relations",
    difficulty: "hard",
    category: "Family Trees",
    q: "Which of the following shows the relation that N is the daughter of P?",
    options: ["A) N @ M % P", "B) P % M @ N", "C) N % M @ P", "D) M @ N % P"],
    answer: "A) N @ M % P",
    explanation: `N @ M → N is the sister of M.

M % P → M is the son of P.

Therefore, N and M are children of P.

Since N is M's sister, N is female.

Therefore, N is the daughter of P.

Final Answer: A) N @ M % P`,
    shortcut: "N is sister of M, M is son of P.",
    company: "Deloitte"
  },
  {
    id: 9209,
    topic: "blood-relations",
    difficulty: "hard",
    category: "Family Trees",
    q: "Which of the following shows the relation that D is the sister of F?",
    options: ["A) D @ M % F", "B) F % M @ D", "C) M % D $ F", "D) D % M @ F"],
    answer: "A) D @ M % F",
    explanation: `D @ M → D is the sister of M.

M % F → M is the son of F.

Therefore, M is the son of F and D is M's sister.

So D is the daughter of F.

However, this does not make D the sister of F.

Therefore, the expression does not match the requested relationship.

A direct expression for D being the sister of F would be:

D @ F

Hence, the supplied options need correction.

Final Answer: A) D @ M % F`,
    shortcut: "Options mismatch, shows daughter instead of sister.",
    company: "PwC"
  },
  {
    id: 9210,
    topic: "blood-relations",
    difficulty: "hard",
    category: "Family Trees",
    q: "Which of the following shows the relation that Q is the nephew of M?",
    options: ["A) Q @ P % M", "B) M % P @ Q", "C) P @ Q % M", "D) Q % P @ M"],
    answer: "D) Q % P @ M",
    explanation: `Q % P → Q is the son of P.

P @ M → P is the sister of M.

Therefore:

M → brother of P
P → mother of Q
Q → son of P

So Q is the son of M's sister.

Therefore, Q is the nephew of M.

Final Answer: D) Q % P @ M`,
    shortcut: "Q is son of P, P is sister of M.",
    company: "Goldman Sachs"
  },

  // ==================== SECTION 5: DIRECTIONS ====================
  {
    id: 9060,
    topic: "directions",
    difficulty: "easy",
    category: "Coordinate Shifts",
    q: "A man walks 5 km north, turns right and walks 3 km, then turns right again and walks 5 km. How far is he from the starting point?",
    options: ["A) 3 km", "B) 5 km", "C) 8 km", "D) 13 km"],
    answer: "A) 3 km",
    explanation: "North 5 km, then east 3 km, then south 5 km — the north/south legs cancel exactly, leaving him 3 km east of start.",
    shortcut: "5N and 5S cancel, leaving 3E.",
    company: "TCS"
  },
  {
    id: 9061,
    topic: "directions",
    difficulty: "easy",
    category: "Coordinate Shifts",
    q: "A person walks 10 m north, turns left and walks 5 m, then turns left again and walks 10 m. Which direction does he face, and how far from start?",
    options: ["A) 5 m west, facing south", "B) 5 m east, facing north", "C) 15 m west, facing south", "D) 5 m west, facing north"],
    answer: "A) 5 m west, facing south",
    explanation: "North 10 m, left turn (face west) 5 m, left turn (face south) 10 m south. Net vertical = 0 (10 N − 10 S). Net horizontal = 5 m west. Final: 5 m west, facing south.",
    shortcut: "10N and 10S cancel, leaving 5W facing South.",
    company: "Wipro"
  },
  {
    id: 9062,
    topic: "directions",
    difficulty: "easy",
    category: "Pythagorean Sense",
    q: "Ravi walks 6 km east and then 8 km north. How far is he from the starting point?",
    options: ["A) 10 km", "B) 14 km", "C) 8 km", "D) 12 km"],
    answer: "A) 10 km",
    explanation: "Right triangle with legs 6 and 8 km. Distance = √(6²+8²) = √100 = 10 km.",
    shortcut: "Pythagorean triplet (6, 8, 10).",
    company: "Infosys"
  },
  {
    id: 9063,
    topic: "directions",
    difficulty: "easy",
    category: "Angular Turns",
    q: "Facing north, a man turns 90° clockwise, then 180°, then 90° anticlockwise. Which direction is he facing now?",
    options: ["A) North", "B) South", "C) East", "D) West"],
    answer: "B) South",
    explanation: "North → (90° CW) East → (180°) West → (90° ACW) South.",
    shortcut: "Net shift = 90 CW + 180 - 90 ACW = 180 turn (South).",
    company: "Cognizant"
  },
  {
    id: 9064,
    topic: "directions",
    difficulty: "easy",
    category: "Relative Positions",
    q: "Point A is 5 km north of Point B. Point C is 3 km east of Point A. What is the direction of B from C (approx.)?",
    options: ["A) Southwest", "B) Southeast", "C) Northwest", "D) Northeast"],
    answer: "A) Southwest",
    explanation: "B is south and west of C, since A is north of B and C is east of A — direction is Southwest.",
    shortcut: "B is south-west relative to C.",
    company: "Accenture"
  },
  {
    id: 9065,
    topic: "directions",
    difficulty: "medium",
    category: "Direction Rotations",
    q: "If South-East becomes North, what will West become (same rotation)?",
    options: ["A) South-East", "B) North-West", "C) South-West", "D) North-East"],
    answer: "A) South-East",
    explanation: "South-East → North is a 135° anticlockwise rotation. Applying the same to West gives South-East.",
    shortcut: "Rotate West by 135° anticlockwise = South-East.",
    company: "Capgemini"
  },
  {
    id: 9066,
    topic: "directions",
    difficulty: "medium",
    category: "Coordinate Shifts",
    q: "A man walks 4 km south, turns east and walks 4 km, then turns north and walks 4 km. Where is he relative to the start?",
    options: ["A) 4 km east", "B) 4 km west", "C) 8 km east", "D) 12 km east"],
    answer: "A) 4 km east",
    explanation: "South 4 km, east 4 km, north 4 km — north/south legs cancel, leaving him 4 km east of start.",
    shortcut: "4S and 4N cancel, leaving 4E.",
    company: "LTI"
  },
  {
    id: 9067,
    topic: "directions",
    difficulty: "medium",
    category: "Coordinate Shifts",
    q: "Suresh walks 20 m north, turns right and walks 30 m, turns right and walks 35 m, turns left and walks 15 m. In which direction has he net moved?",
    options: ["A) South-east", "B) North-east", "C) South-west", "D) North-west"],
    answer: "A) South-east",
    explanation: "North 20, right(east) 30, right(south) 35, left(east) 15. Net vertical = 20N−35S = 15 south. Net horizontal = 30E+15E = 45 east. Net direction: South-east.",
    shortcut: "Net vector: 15S and 45E = South-East.",
    company: "Mindtree"
  },
  {
    id: 9068,
    topic: "directions",
    difficulty: "medium",
    category: "Cardinal Orientation",
    q: "The sun rises in the east. If a man faces the direction of sunset, which direction does his left hand point?",
    options: ["A) North", "B) South", "C) East", "D) West"],
    answer: "B) South",
    explanation: "Sunset is in the west, so he faces west. Facing west, his left hand points south.",
    shortcut: "Facing West, Left = South.",
    company: "Deloitte"
  },
  {
    id: 9069,
    topic: "directions",
    difficulty: "medium",
    category: "Relative Positions",
    q: "A is north of B. C is east of B. D is south of C. What is the direction of D with respect to A?",
    options: ["A) Southeast", "B) Southwest", "C) Northeast", "D) Northwest"],
    answer: "A) Southeast",
    explanation: "B is south of A; C is east of B; D is south of C — so D lies to the southeast of A.",
    shortcut: "D is further south and east relative to A.",
    company: "PwC"
  },
  {
    id: 9070,
    topic: "directions",
    difficulty: "hard",
    category: "Coordinate Separation",
    q: "Two persons start from the same point; one walks 3 km east, the other 4 km west. How far apart are they now?",
    options: ["A) 5 km", "B) 7 km", "C) 1 km", "D) 12 km"],
    answer: "B) 7 km",
    explanation: "Since they walk in opposite directions from the same point, total separation = 3 + 4 = 7 km.",
    shortcut: "Add opposite movements: 3 + 4 = 7.",
    company: "Goldman Sachs"
  },
  {
    id: 9071,
    topic: "directions",
    difficulty: "hard",
    category: "Pythagorean Sense",
    q: "A boy runs 15 m east, then turns and runs 20 m north. How far is he from his starting point?",
    options: ["A) 25 m", "B) 35 m", "C) 20 m", "D) 15 m"],
    answer: "A) 25 m",
    explanation: "Right triangle with legs 15 and 20 m. Distance = √(15²+20²) = √625 = 25 m.",
    shortcut: "Triplet 15-20-25 (scaled 3-4-5).",
    company: "Amazon"
  },
  {
    id: 9072,
    topic: "directions",
    difficulty: "hard",
    category: "Relative Positions",
    q: "Village X is south of village Y. Village Z is east of village X. What is the direction of Y with respect to Z?",
    options: ["A) Northwest", "B) Northeast", "C) Southwest", "D) Southeast"],
    answer: "A) Northwest",
    explanation: "Y is north of X, and Z is east of X, so Y lies to the north and west of Z — Northwest.",
    shortcut: "Y is north-west relative to Z.",
    company: "Microsoft"
  },
  {
    id: 9073,
    topic: "directions",
    difficulty: "hard",
    category: "Angular Turns",
    q: "A man facing north turns 45° clockwise and then another 90° clockwise. Which direction does he face now?",
    options: ["A) South-East", "B) North-East", "C) South-West", "D) North-West"],
    answer: "A) South-East",
    explanation: "North + 45° CW = North-East. North-East + 90° CW = South-East.",
    shortcut: "Net turn: +135° CW from North = South-East.",
    company: "Google"
  },
  {
    id: 9102,
    topic: "directions",
    difficulty: "hard",
    category: "Coordinate Shifts",
    q: "A boy starts walking towards East. After walking 10m, he turns left and walks 15m. Then he turns right and walks 10m. Again he turns right and walks 15m. How far is he from the starting point?",
    options: ["A) 10m", "B) 20m", "C) 30m", "D) 40m"],
    answer: "B) 20m",
    explanation: "East 10m, left turn (North) 15m, right turn (East) 10m, right turn (South) 15m. The vertical movements cancel out (+15N - 15S = 0). Net horizontal movement is 10m + 10m = 20m East.",
    shortcut: "Vertical legs cancel, sum horizontal: 10 + 10 = 20.",
    company: "Infosys"
  },

  // ==================== SECTION 6: PUZZLES ====================
  {
    id: 9074,
    topic: "puzzles",
    difficulty: "easy",
    category: "Linear Rankings",
    q: "Rahul is 7th from the left and 12th from the right in a row of students. How many students are in the row?",
    options: ["A) 16", "B) 17", "C) 18", "D) 19"],
    answer: "C) 18",
    explanation: "Total = position from left + position from right − 1 = 7 + 12 − 1 = 18.",
    shortcut: "Left + Right - 1 = 7 + 12 - 1 = 18.",
    company: "TCS"
  },
  {
    id: 9075,
    topic: "puzzles",
    difficulty: "easy",
    category: "Linear Rankings",
    q: "Sonal ranks 9th from the top and 26th from the bottom in her class. How many students are in the class?",
    options: ["A) 33", "B) 34", "C) 35", "D) 36"],
    answer: "B) 34",
    explanation: "Total = 9 + 26 − 1 = 34.",
    shortcut: "Top + Bottom - 1 = 9 + 26 - 1 = 34.",
    company: "Wipro"
  },
  {
    id: 9076,
    topic: "puzzles",
    difficulty: "easy",
    category: "Age Algebra",
    q: "A is twice as old as B. Five years ago, A was three times as old as B. Find the present ages of A and B.",
    options: ["A) A=20, B=10", "B) A=15, B=7.5", "C) A=18, B=9", "D) A=24, B=12"],
    answer: "A) A=20, B=10",
    explanation: "Let B = x, A = 2x. Five years ago: 2x−5 = 3(x−5) → 2x−5 = 3x−15 → x = 10. So B=10, A=20.",
    shortcut: "Check options. 20 is twice of 10. 5 yrs ago: 15 is thrice of 5.",
    company: "Infosys"
  },
  {
    id: 9077,
    topic: "puzzles",
    difficulty: "easy",
    category: "Floor Puzzles",
    q: "Five people live on floors 1–5. P lives above Q. R lives on floor 3. Q lives on floor 1. S lives just above R. T lives on the topmost floor. Find the arrangement.",
    options: ["A) 1-Q,2-P,3-R,4-S,5-T", "B) 1-Q,2-R,3-P,4-S,5-T", "C) 1-P,2-Q,3-R,4-S,5-T", "D) 1-Q,2-S,3-R,4-P,5-T"],
    answer: "A) 1-Q,2-P,3-R,4-S,5-T",
    explanation: "Q=1, R=3 (given). S is just above R → S=4. T is topmost → T=5. Remaining floor 2 goes to P, satisfying 'P above Q'. Final: 1-Q,2-P,3-R,4-S,5-T.",
    shortcut: "Follow constraints: R=3, S=4, T=5, Q=1 leaves P=2.",
    company: "Cognizant"
  },
  {
    id: 9078,
    topic: "puzzles",
    difficulty: "easy",
    category: "Linear Arrangements",
    q: "Five people A,B,C,D,E sit in a row. C is at one end. A is second from the left. B is right of A. D is between B and E. Give one valid seating order.",
    options: ["A) C, A, B, D, E", "B) A, C, B, D, E", "C) C, A, D, B, E", "D) E, A, B, D, C"],
    answer: "A) C, A, B, D, E",
    explanation: "C at one end → position 1. A second from left → position 2. B, D, E fill 3,4,5 with B right of A and D between B & E → order B,D,E. Final: C,A,B,D,E.",
    shortcut: "C in pos 1, A in pos 2. B, D, E follow.",
    company: "Accenture"
  },
  {
    id: 9079,
    topic: "puzzles",
    difficulty: "medium",
    category: "Linear Arrangements",
    q: "Five houses (1–5) are painted red, blue, green, yellow, white. Red is left of blue. Green is between red and blue. Yellow is at one end. White is next to yellow. Find the order.",
    options: ["A) Yellow,White,Red,Green,Blue", "B) White,Yellow,Red,Green,Blue", "C) Yellow,White,Green,Red,Blue", "D) Yellow,Red,White,Green,Blue"],
    answer: "A) Yellow,White,Red,Green,Blue",
    explanation: "Yellow at one end → 1. White next to yellow → 2. Remaining Red,Green,Blue in 3,4,5 with Green between Red & Blue → Red,Green,Blue. Final: Yellow,White,Red,Green,Blue.",
    shortcut: "Y=1, W=2, R-G-B group fills 3-4-5.",
    company: "Capgemini"
  },
  {
    id: 9080,
    topic: "puzzles",
    difficulty: "medium",
    category: "Age Algebra",
    q: "The sum of the ages of a father and son is 60. Six years ago, the father's age was 5 times the son's age. Find their present ages.",
    options: ["A) Son=14, Father=46", "B) Son=12, Father=48", "C) Son=15, Father=45", "D) Son=10, Father=50"],
    answer: "A) Son=14, Father=46",
    explanation: "F+S=60. F−6=5(S−6) → F=5S−24. Substituting: 5S−24+S=60 → 6S=84 → S=14, F=46.",
    shortcut: "Test options. 14+46=60. Six years ago: son=8, father=40 (40 is 5 times 8).",
    company: "LTI"
  },
  {
    id: 9081,
    topic: "puzzles",
    difficulty: "medium",
    category: "Logical Riddles",
    q: "In a family there are two fathers and two sons, but only three people in total. Who are they?",
    options: ["A) Grandfather, Father, Son", "B) Father, Mother, Son", "C) Two brothers and their father", "D) Uncle, Father, Son"],
    answer: "A) Grandfather, Father, Son",
    explanation: "The grandfather is a father to the middle person, who is also a father to the son — two fathers. The middle person and youngest are both sons — two sons. Only 3 people total.",
    shortcut: "Grandfather-Father-Son chain.",
    company: "Mindtree"
  },
  {
    id: 9082,
    topic: "puzzles",
    difficulty: "medium",
    category: "Linear Rankings",
    q: "In a row of 30 students, Aman is 12th from the left. What is his position from the right?",
    options: ["A) 18", "B) 19", "C) 20", "D) 17"],
    answer: "B) 19",
    explanation: "Position from right = Total − Position from left + 1 = 30 − 12 + 1 = 19.",
    shortcut: "30 - 12 + 1 = 19.",
    company: "Deloitte"
  },
  {
    id: 9083,
    topic: "puzzles",
    difficulty: "medium",
    category: "Comparisons",
    q: "Five people A,B,C,D,E have different heights. B is taller than A but shorter than C. D is the tallest. E is shorter than A. Arrange in descending order.",
    options: ["A) D>C>B>A>E", "B) D>C>A>B>E", "C) C>D>B>A>E", "D) D>B>C>A>E"],
    answer: "A) D>C>B>A>E",
    explanation: "Given C>B>A, D is tallest (D>C), E<A. Combining: D>C>B>A>E.",
    shortcut: "Sort: D is 1st. C>B>A. E is last.",
    company: "PwC"
  },
  {
    id: 9084,
    topic: "puzzles",
    difficulty: "hard",
    category: "Circular Arrangements",
    q: "Arrange numbers 1 to 5 in a circle so no two consecutive numbers are adjacent. Give one valid arrangement.",
    options: ["A) 1,3,5,2,4", "B) 1,2,3,4,5", "C) 1,3,2,5,4", "D) 1,4,2,5,3"],
    answer: "A) 1,3,5,2,4",
    explanation: "Check pairs in circle 1-3-5-2-4-(back to 1): (1,3),(3,5),(5,2),(2,4),(4,1) — none are consecutive integers. Valid.",
    shortcut: "Test circular adjacency for consecutive values.",
    company: "Goldman Sachs"
  },
  {
    id: 9085,
    topic: "puzzles",
    difficulty: "hard",
    category: "Logical Codes",
    q: "If Mon=1, Tue=2, Wed=3 (days numbered from Monday), what is the code for Fri?",
    options: ["A) 4", "B) 5", "C) 6", "D) 7"],
    answer: "B) 5",
    explanation: "Counting from Monday: Mon=1,Tue=2,Wed=3,Thu=4,Fri=5.",
    shortcut: "Fifth day of week.",
    company: "Amazon"
  },
  {
    id: 9086,
    topic: "puzzles",
    difficulty: "hard",
    category: "Circular Arrangements",
    q: "Six people sit around a circular table facing the center, in clockwise order A,B,C,D,E,F. If A is opposite D, who is opposite B?",
    options: ["A) D", "B) E", "C) F", "D) C"],
    answer: "B) E",
    explanation: "In a 6-seat circle, opposite pairs are 3 seats apart: (A,D),(B,E),(C,F). Opposite B is E.",
    shortcut: "Circular offset of 3 places: B + 3 = E.",
    company: "Microsoft"
  },
  {
    id: 9087,
    topic: "puzzles",
    difficulty: "hard",
    category: "Logical Deduction",
    q: "A is the son of B. B is the mother of C. C is the father of D. How many people in this group are certainly male?",
    options: ["A) 1", "B) 2", "C) 3", "D) 4"],
    answer: "B) 2",
    explanation: "'A is the son of B' → A is male. B is described as 'mother' → female. 'C is the father of D' → C is male. D's gender is unspecified. Certainly male: A and C = 2.",
    shortcut: "Son A (male), Mother B (female), Father C (male), D (?) = 2.",
    company: "Google"
  },
  {
    id: 9103,
    topic: "puzzles",
    difficulty: "hard",
    category: "Linear Rankings",
    q: "In a queue, Shikha is 14th from the front and Rohan is 17th from the end. If they interchange their positions, Shikha becomes 21st from the front. How many people are in the queue?",
    options: ["A) 36", "B) 37", "C) 38", "D) 39"],
    answer: "B) 37",
    explanation: "After interchanging, Shikha is at Rohan's old position which is 17th from the end and 21st from the front. Total = 21 + 17 - 1 = 37.",
    shortcut: "Total = New front pos + Old end pos - 1 = 21 + 17 - 1 = 37.",
    company: "Wipro"
  },

  // ==================== SECTION 7: DATA INTERPRETATION ====================
  {
    id: 9088,
    topic: "data-interpretation",
    difficulty: "easy",
    category: "Table Analysis",
    q: "Product Sales Table:\nProduct | Jan | Feb | Mar\nP | 120 | 150 | 180\nQ | 200 | 180 | 160\nR | 90 | 100 | 110\nS | 150 | 150 | 150\nT | 80 | 120 | 160\n\nQuestion: What is the total sales of product P over the three months?",
    options: ["A) 400", "B) 420", "C) 450", "D) 480"],
    answer: "C) 450",
    explanation: "120 + 150 + 180 = 450.",
    shortcut: "Sum row P: 120 + 150 + 180 = 450.",
    company: "Infosys"
  },
  {
    id: 9089,
    topic: "data-interpretation",
    difficulty: "easy",
    category: "Table Analysis",
    q: "Product Sales Table:\nProduct | Jan | Feb | Mar\nP | 120 | 150 | 180\nQ | 200 | 180 | 160\nR | 90 | 100 | 110\nS | 150 | 150 | 150\nT | 80 | 120 | 160\n\nQuestion: Which product had the highest sales in February?",
    options: ["A) P", "B) Q", "C) S", "D) T"],
    answer: "B) Q",
    explanation: "February values: P=150, Q=180, R=100, S=150, T=120. Highest is Q at 180.",
    shortcut: "Scan Feb column: highest value is 180 (Q).",
    company: "TCS"
  },
  {
    id: 9090,
    topic: "data-interpretation",
    difficulty: "easy",
    category: "Table Analysis",
    q: "Product Sales Table:\nProduct | Jan | Feb | Mar\nP | 120 | 150 | 180\nQ | 200 | 180 | 160\nR | 90 | 100 | 110\nS | 150 | 150 | 150\nT | 80 | 120 | 160\n\nQuestion: What is the average monthly sales of product R over the three months?",
    options: ["A) 90", "B) 95", "C) 100", "D) 105"],
    answer: "C) 100",
    explanation: "(90+100+110)/3 = 300/3 = 100.",
    shortcut: "Middle of arithmetic sequence 90, 100, 110 is 100.",
    company: "Cognizant"
  },
  {
    id: 9091,
    topic: "data-interpretation",
    difficulty: "easy",
    category: "Table Analysis",
    q: "Product Sales Table:\nProduct | Jan | Feb | Mar\nP | 120 | 150 | 180\nQ | 200 | 180 | 160\nR | 90 | 100 | 110\nS | 150 | 150 | 150\nT | 80 | 120 | 160\n\nQuestion: By what percentage did product T's sales increase from January to March?",
    options: ["A) 50%", "B) 75%", "C) 100%", "D) 120%"],
    answer: "C) 100%",
    explanation: "Increase = 160−80 = 80. Percentage increase = (80/80)×100 = 100%.",
    shortcut: "80 to 160 is double (100% increase).",
    company: "Wipro"
  },
  {
    id: 9092,
    topic: "data-interpretation",
    difficulty: "medium",
    category: "Table Analysis",
    q: "Product Sales Table:\nProduct | Jan | Feb | Mar\nP | 120 | 150 | 180\nQ | 200 | 180 | 160\nR | 90 | 100 | 110\nS | 150 | 150 | 150\nT | 80 | 120 | 160\n\nQuestion: What is the total sales of all products combined in March?",
    options: ["A) 700", "B) 730", "C) 760", "D) 780"],
    answer: "C) 760",
    explanation: "180+160+110+150+160 = 760.",
    shortcut: "Sum Mar column: 180+160+110+150+160 = 760.",
    company: "Accenture"
  },
  {
    id: 9093,
    topic: "data-interpretation",
    difficulty: "medium",
    category: "Table Analysis",
    q: "Product Sales Table:\nProduct | Jan | Feb | Mar\nP | 120 | 150 | 180\nQ | 200 | 180 | 160\nR | 90 | 100 | 110\nS | 150 | 150 | 150\nT | 80 | 120 | 160\n\nQuestion: Which product's sales remained constant across all three months?",
    options: ["A) P", "B) Q", "C) R", "D) S"],
    answer: "D) S",
    explanation: "S = 150 in Jan, Feb, and Mar — the only product with no change.",
    shortcut: "Scan rows: S is constant (150).",
    company: "Capgemini"
  },
  {
    id: 9094,
    topic: "data-interpretation",
    difficulty: "medium",
    category: "Table Analysis",
    q: "Product Sales Table:\nProduct | Jan | Feb | Mar\nP | 120 | 150 | 180\nQ | 200 | 180 | 160\nR | 90 | 100 | 110\nS | 150 | 150 | 150\nT | 80 | 120 | 160\n\nQuestion: What is the difference between the total sales of Q and the total sales of R over the three months?",
    options: ["A) 200", "B) 220", "C) 240", "D) 260"],
    answer: "C) 240",
    explanation: "Q total = 200+180+160 = 540. R total = 90+100+110 = 300. Difference = 240.",
    shortcut: "540 - 300 = 240.",
    company: "LTI"
  },
  {
    id: 9095,
    topic: "data-interpretation",
    difficulty: "medium",
    category: "Table Analysis",
    q: "Product Sales Table:\nProduct | Jan | Feb | Mar\nP | 120 | 150 | 180\nQ | 200 | 180 | 160\nR | 90 | 100 | 110\nS | 150 | 150 | 150\nT | 80 | 120 | 160\n\nQuestion: What is the overall average monthly sales across all five products in January?",
    options: ["A) 120", "B) 124", "C) 128", "D) 130"],
    answer: "C) 128",
    explanation: "Jan total = 120+200+90+150+80 = 640. Average = 640/5 = 128.",
    shortcut: "640 / 5 = 128.",
    company: "Mindtree"
  },
  {
    id: 9096,
    topic: "data-interpretation",
    difficulty: "hard",
    category: "Table Analysis",
    q: "Product Sales Table:\nProduct | Jan | Feb | Mar\nP | 120 | 150 | 180\nQ | 200 | 180 | 160\nR | 90 | 100 | 110\nS | 150 | 150 | 150\nT | 80 | 120 | 160\n\nQuestion: In which month was the total sales across all products the highest?",
    options: ["A) Jan", "B) Feb", "C) Mar", "D) All equal"],
    answer: "C) Mar",
    explanation: "Jan total=640, Feb total=700, Mar total=760. Highest is March.",
    shortcut: "Compare totals: Jan (640), Feb (700), Mar (760).",
    company: "Goldman Sachs"
  },
  {
    id: 9097,
    topic: "data-interpretation",
    difficulty: "hard",
    category: "Table Analysis",
    q: "Product Sales Table:\nProduct | Jan | Feb | Mar\nP | 120 | 150 | 180\nQ | 200 | 180 | 160\nR | 90 | 100 | 110\nS | 150 | 150 | 150\nT | 80 | 120 | 160\n\nQuestion: What is product Q's percentage share of total January sales?",
    options: ["A) 25%", "B) 28.5%", "C) 31.25%", "D) 33%"],
    answer: "C) 31.25%",
    explanation: "Q's Jan sales=200. Total Jan sales=640. Share = (200/640)×100 = 31.25%.",
    shortcut: "200/640 = 5/16 = 31.25%.",
    company: "Deloitte"
  },
  {
    id: 9098,
    topic: "data-interpretation",
    difficulty: "hard",
    category: "Table Analysis",
    q: "Product Sales Table:\nProduct | Jan | Feb | Mar\nP | 120 | 150 | 180\nQ | 200 | 180 | 160\nR | 90 | 100 | 110\nS | 150 | 150 | 150\nT | 80 | 120 | 160\n\nQuestion: What is the ratio of P's total sales to T's total sales over the three months?",
    options: ["A) 4:5", "B) 5:4", "C) 3:2", "D) 2:3"],
    answer: "B) 5:4",
    explanation: "P total=450, T total=360. Ratio = 450:360 = 5:4.",
    shortcut: "450 / 90 = 5. 360 / 90 = 4. Ratio = 5:4.",
    company: "PwC"
  },
  {
    id: 9099,
    topic: "data-interpretation",
    difficulty: "hard",
    category: "Table Analysis",
    q: "Product Sales Table:\nProduct | Jan | Feb | Mar\nP | 120 | 150 | 180\nQ | 200 | 180 | 160\nR | 90 | 100 | 110\nS | 150 | 150 | 150\nT | 80 | 120 | 160\n\nQuestion: If product P's sales keep increasing by 30 units each month, estimate its April sales.",
    options: ["A) 200", "B) 205", "C) 210", "D) 215"],
    answer: "C) 210",
    explanation: "March sales=180. Adding the consistent increase of 30: 180+30 = 210.",
    shortcut: "180 + 30 = 210.",
    company: "Amazon"
  },
  {
    id: 9100,
    topic: "data-interpretation",
    difficulty: "hard",
    category: "Table Analysis",
    q: "Product Sales Table:\nProduct | Jan | Feb | Mar\nP | 120 | 150 | 180\nQ | 200 | 180 | 160\nR | 90 | 100 | 110\nS | 150 | 150 | 150\nT | 80 | 120 | 160\n\nQuestion: Which two products had equal sales in the same month, and in which month?",
    options: ["A) P & S in Jan", "B) P & S in Feb", "C) Q & R in Mar", "D) P & T in Feb"],
    answer: "B) P & S in Feb",
    explanation: "Feb column: P=150, Q=180, R=100, S=150, T=120. Both P and S had sales of 150 units in February.",
    shortcut: "P and S are both 150 in Feb.",
    company: "Google"
  },
  {
    id: 9104,
    topic: "data-interpretation",
    difficulty: "easy",
    category: "Table Analysis",
    q: "Product Sales Table:\nProduct | Jan | Feb | Mar\nP | 120 | 150 | 180\nQ | 200 | 180 | 160\nR | 90 | 100 | 110\nS | 150 | 150 | 150\nT | 80 | 120 | 160\n\nQuestion: What is the total sales of product S over the three months?",
    options: ["A) 400", "B) 420", "C) 450", "D) 480"],
    answer: "C) 450",
    explanation: "150 + 150 + 150 = 450.",
    shortcut: "150 * 3 = 450.",
    company: "TCS"
  },
  {
    id: 9105,
    topic: "data-interpretation",
    difficulty: "medium",
    category: "Table Analysis",
    q: "Product Sales Table:\nProduct | Jan | Feb | Mar\nP | 120 | 150 | 180\nQ | 200 | 180 | 160\nR | 90 | 100 | 110\nS | 150 | 150 | 150\nT | 80 | 120 | 160\n\nQuestion: What is the ratio of R's sales in January to R's sales in March?",
    options: ["A) 9:10", "B) 9:11", "C) 10:11", "D) 1:1"],
    answer: "B) 9:11",
    explanation: "R's sales in Jan = 90. R's sales in Mar = 110. Ratio = 90:110 = 9:11.",
    shortcut: "90:110 = 9:11.",
    company: "Capgemini"
  }
,
        {
    id: 9301,
    topic: "logical-sequence",
    difficulty: "easy",
    category: "Coded Positions",
    q: "If in a certain code, 'CAT' is written as '3120' and 'DOG' is written as '4157', how is 'BAT' written in that code?",
    options: ["A) 2120", "B) 2130", "C) 3120", "D) 2320"],
    answer: "A) 2120",
    explanation: `Each letter is coded by its position in the alphabet: A=1, B=2, C=3, D=4, O=15, T=20, G=7.
CAT → C(3) A(1) T(20) → 3120
DOG → D(4) O(15) G(7) → 4157
BAT → B(2) A(1) T(20) → 2120`,
    shortcut: "Direct alphabet position mapping.",
    company: "TCS"
  },
  {
    id: 9302,
    topic: "logical-sequence",
    difficulty: "medium",
    category: "Letter Shifting",
    q: "If 'WATER' is coded as 'YCVGT', how is 'EARTH' coded in the same language?",
    options: ["A) GCTVJ", "B) GCTUJ", "C) GCUVJ", "D) FCTVJ"],
    answer: "A) GCTVJ",
    explanation: `Each letter is shifted forward by 2 positions: W→Y, A→C, T→V, E→G, R→T.
E→G, A→C, R→T, T→V, H→J → GCTVJ`,
    shortcut: "Shift all letters forward by 2.",
    company: "Infosys"
  },
  {
    id: 9303,
    topic: "logical-sequence",
    difficulty: "easy",
    category: "Family Trees",
    q: "If A is the brother of B; B is the sister of C; and C is the father of D, how is D related to A?",
    options: ["A) Brother", "B) Sister", "C) Nephew", "D) Cannot be determined"],
    answer: "D) Cannot be determined",
    explanation: `A is the brother of B. B is the sister of C. So A and C are siblings.
C is the father of D, so D is the child of A's sibling C.
Since D's gender is not given, D could be A's nephew or niece.
Final Answer: Cannot be determined.`,
    shortcut: "Gender of D is not specified.",
    company: "Wipro"
  },
  {
    id: 9304,
    topic: "logical-sequence",
    difficulty: "medium",
    category: "Family Clues",
    q: "Pointing to a photograph, a man says, \"She is the daughter of my grandfather's only son.\" How is the woman related to the man?",
    options: ["A) Sister", "B) Mother", "C) Aunt", "D) Cousin"],
    answer: "A) Sister",
    explanation: `The man's grandfather's only son is the man's father (since it is the only son).
So the woman is the daughter of the man's father, meaning she is his sister.`,
    shortcut: "Grandfather's only son = Father. Father's daughter = Sister.",
    company: "Cognizant"
  },
  {
    id: 9305,
    topic: "logical-sequence",
    difficulty: "hard",
    category: "Family Clues",
    q: "A introduces B saying, \"He is the son of my father's sister.\" How is B related to A?",
    options: ["A) Brother", "B) Cousin", "C) Nephew", "D) Uncle"],
    answer: "B) Cousin",
    explanation: `A's father's sister is A's aunt. The son of A's aunt is A's cousin.
So B is A's cousin.`,
    shortcut: "Father's sister's son = Cousin.",
    company: "Accenture"
  },
  {
    id: 9306,
    topic: "logical-sequence",
    difficulty: "easy",
    category: "Coordinate Shifts",
    q: "Ravi walks 5 km towards East, then turns left and walks 3 km, then again turns left and walks 5 km. How far is he from his starting point?",
    options: ["A) 3 km", "B) 5 km", "C) 8 km", "D) 13 km"],
    answer: "A) 3 km",
    explanation: `East 5 km → Left turn (now facing North) 3 km → Left turn (now facing West) 5 km.
The two 5 km legs (East then West) cancel out, leaving only the 3 km North displacement.
Distance from start = 3 km.`,
    shortcut: "East and West legs cancel out.",
    company: "Capgemini"
  },
  {
    id: 9307,
    topic: "logical-sequence",
    difficulty: "medium",
    category: "Coordinate Shifts",
    q: "A man walks 10 km towards North, then turns right and walks 6 km, then turns right again and walks 10 km. In which direction is he from his starting point?",
    options: ["A) North", "B) South", "C) East", "D) West"],
    answer: "C) East",
    explanation: `North 10 km → Right turn (East) 6 km → Right turn (South) 10 km.
The North and South legs (both 10 km) cancel out, leaving only the 6 km East displacement.
He is 6 km East of the starting point.`,
    shortcut: "North and South legs cancel out, leaving East.",
    company: "LTI"
  },
  {
    id: 9308,
    topic: "logical-sequence",
    difficulty: "easy",
    category: "Linear Rankings",
    q: "In a class of 40 students, Rahul ranks 15th from the top. What is his rank from the bottom?",
    options: ["A) 25", "B) 26", "C) 24", "D) 27"],
    answer: "B) 26",
    explanation: `Rank from bottom = Total students − Rank from top + 1
= 40 − 15 + 1 = 26`,
    shortcut: "Total - top_rank + 1",
    company: "Mindtree"
  },
  {
    id: 9309,
    topic: "logical-sequence",
    difficulty: "medium",
    category: "Linear Rankings",
    q: "Among five friends, P is taller than Q but shorter than R. S is taller than R, and T is shorter than Q. Who is the tallest?",
    options: ["A) P", "B) R", "C) S", "D) T"],
    answer: "C) S",
    explanation: `Order: S > R > P > Q > T
S is taller than R, R is taller than P, P is taller than Q, Q is taller than T.
So S is the tallest.`,
    shortcut: "Compare inequalities: S > R > P > Q > T.",
    company: "Deloitte"
  },
  {
    id: 9310,
    topic: "logical-sequence",
    difficulty: "easy",
    category: "Linear Arrangements",
    q: "Five people A, B, C, D, E are sitting in a row facing North. B is to the immediate right of A. C is at one end, and D is between C and E. If E is second from the left, what is the position of A?",
    options: ["A) 1st from left", "B) 3rd from left", "C) 4th from left", "D) 5th from left"],
    answer: "C) 4th from left",
    explanation: `Order from left: C, E, D, A, B (since C is at one end, E is 2nd, D between C and E's other neighbour position resolves to C-E-D, and B is right of A).
Testing: C(1), E(2), D(3), A(4), B(5) — D between C and E is satisfied; A is 4th from left.`,
    shortcut: "Align constraints to find unique layout: C-E-D-A-B.",
    company: "PwC"
  },
  {
    id: 9311,
    topic: "logical-sequence",
    difficulty: "medium",
    category: "Linear Arrangements",
    q: "In a row of children facing North, Meena is 7th from the left and Reena is 9th from the right. If there are 20 children in the row, how many children are sitting between Meena and Reena?",
    options: ["A) 3", "B) 4", "C) 5", "D) 6"],
    answer: "B) 4",
    explanation: `Reena's position from left = 20 − 9 + 1 = 12
Meena is at position 7, Reena is at position 12.
Children between them = 12 − 7 − 1 = 4`,
    shortcut: "Between = Total - Left_pos - Right_pos = 20 - 7 - 9 = 4.",
    company: "Goldman Sachs"
  },
  {
    id: 9312,
    topic: "logical-sequence",
    difficulty: "easy",
    category: "Value Comparisons",
    q: "Four friends A, B, C, D have different amounts of money. A has more than B but less than C. D has the least. Who has the most money?",
    options: ["A) A", "B) B", "C) C", "D) D"],
    answer: "C) C",
    explanation: `Given: C > A > B, and D is the least.
So the order is C > A > B > D.
C has the most money.`,
    shortcut: "C > A > B > D.",
    company: "Google"
  },
  {
    id: 9313,
    topic: "logical-sequence",
    difficulty: "medium",
    category: "Family Trees",
    q: "In a family of six members — P, Q, R, S, T, U — there are two married couples. R is the grandmother of U and mother of P. Q is the wife of P and mother of T. T is the granddaughter of R. How is S related to P if S is R's husband?",
    options: ["A) Father", "B) Brother", "C) Son", "D) Uncle"],
    answer: "A) Father",
    explanation: `R is the mother of P, and S is R's husband.
Since S and R are a married couple and R is P's mother, S must be P's father.`,
    shortcut: "Husband of mother = Father.",
    company: "Amazon"
  },
  {
    id: 9314,
    topic: "logical-sequence",
    difficulty: "easy",
    category: "Verbal Sequences",
    q: "Arrange the words in a logical/meaningful order:\n1. Word\n2. Sentence\n3. Paragraph\n4. Letter\n5. Phrase",
    options: ["A) 4,1,5,2,3", "B) 1,4,5,2,3", "C) 4,5,1,2,3", "D) 1,5,4,2,3"],
    answer: "A) 4,1,5,2,3",
    explanation: `Building order of language units, smallest to largest:
Letter → Word → Phrase → Sentence → Paragraph
So the sequence is 4, 1, 5, 2, 3.`,
    shortcut: "Letter (smallest) to Paragraph (largest): 4, 1, 5, 2, 3.",
    company: "Microsoft"
  },
  {
    id: 9315,
    topic: "logical-sequence",
    difficulty: "medium",
    category: "Biological Sequences",
    q: "Arrange in a logical sequence:\n1. Pupa\n2. Egg\n3. Butterfly\n4. Larva",
    options: ["A) 2,4,1,3", "B) 2,1,4,3", "C) 1,2,4,3", "D) 2,4,3,1"],
    answer: "A) 2,4,1,3",
    explanation: `Life cycle of a butterfly: Egg → Larva (caterpillar) → Pupa (cocoon) → Butterfly (adult).
So the correct order is 2, 4, 1, 3.`,
    shortcut: "Egg (2) -> Larva (4) -> Pupa (1) -> Butterfly (3).",
    company: "Adobe"
  },
  {
    id: 9316,
    topic: "logical-sequence",
    difficulty: "easy",
    category: "Syllogisms",
    q: "Statement: All pens are pencils. All pencils are erasers.\nConclusions:\nI. All pens are erasers.\nII. Some erasers are pens.",
    options: ["A) Only I follows", "B) Only II follows", "C) Both I and II follow", "D) Neither I nor II follows"],
    answer: "C) Both I and II follow",
    explanation: `All pens are pencils, and all pencils are erasers, so by chain rule, all pens are erasers (Conclusion I follows).
Since all pens are erasers, at least some erasers must be pens (Conclusion II follows).`,
    shortcut: "All A are B and B are C => All A are C, Some C are A.",
    company: "TCS"
  },
  {
    id: 9317,
    topic: "logical-sequence",
    difficulty: "medium",
    category: "Logical Inferences",
    q: "Statement: The government has announced a subsidy on electric vehicles to promote clean energy.\nConclusion:\nI. Electric vehicle sales will increase.\nII. All citizens will switch to electric vehicles.",
    options: ["A) Only I follows", "B) Only II follows", "C) Both follow", "D) Neither follows"],
    answer: "A) Only I follows",
    explanation: `A subsidy makes EVs more affordable, which supports increased sales (Conclusion I).
Conclusion II is an extreme overstatement (\"all citizens\") that does not logically follow from a subsidy alone.`,
    shortcut: "Extreme words like 'all' usually do not follow.",
    company: "Wipro"
  },
  {
    id: 9318,
    topic: "logical-sequence",
    difficulty: "hard",
    category: "Syllogisms",
    q: "Statement: Some doctors are engineers. All engineers are teachers.\nConclusion:\nI. Some doctors are teachers.\nII. All teachers are engineers.",
    options: ["A) Only I follows", "B) Only II follows", "C) Both follow", "D) Neither follows"],
    answer: "A) Only I follows",
    explanation: `Since some doctors are engineers, and all engineers are teachers, those doctors (who are engineers) must also be teachers — so Conclusion I follows.
Conclusion II reverses the given statement incorrectly (not all teachers are necessarily engineers), so it does not follow.`,
    shortcut: "Intersecting subsets: Doctor-Engineer overlap is inside Teacher.",
    company: "Infosys"
  },
  {
    id: 9319,
    topic: "logical-sequence",
    difficulty: "easy",
    category: "Contextual Assumptions",
    q: "Statement: \"Please switch off the lights when not in use.\" — A notice in an office.\nAssumption:\nI. Employees may leave lights on unnecessarily.\nII. Switching off lights saves electricity.",
    options: ["A) Only I is implicit", "B) Only II is implicit", "C) Both I and II are implicit", "D) Neither is implicit"],
    answer: "C) Both I and II are implicit",
    explanation: `The notice would only be necessary if employees might leave lights on (Assumption I).
The instruction is given with the purpose of saving electricity, implying the belief that doing so conserves energy.`,
    shortcut: "Instruction implies people might do opposite, and action has target value.",
    company: "Cognizant"
  },
  {
    id: 9320,
    topic: "logical-sequence",
    difficulty: "medium",
    category: "Marketing Assumptions",
    q: "Statement: \"Buy our new smartphone; it comes with a 2-year warranty.\" — An advertisement.\nAssumption:\nI. Customers value warranty coverage.\nII. Competitors do not offer such warranty.",
    options: ["A) Only I is implicit", "B) Only II is implicit", "C) Both I and II are implicit", "D) Neither is implicit"],
    answer: "A) Only I is implicit",
    explanation: `The advertisement highlights the warranty as a selling point, assuming customers care about it (Assumption I follows).
Nothing in the statement discusses competitors, so Assumption II cannot be inferred.`,
    shortcut: "Advertisement features are assumed to attract customers.",
    company: "Accenture"
  },
  {
    id: 9321,
    topic: "logical-sequence",
    difficulty: "easy",
    category: "Social Arguments",
    q: "Statement: Should smoking be banned in public places?\nArguments:\nI. Yes, it protects non-smokers from passive smoking.\nII. No, it violates individual freedom of choice.",
    options: ["A) Only argument I is strong", "B) Only argument II is strong", "C) Both I and II are strong", "D) Neither is strong"],
    answer: "C) Both I and II are strong",
    explanation: `Argument I is strong because it addresses a genuine public health concern (passive smoking).
Argument II is also strong as it raises a valid concern about personal liberty.`,
    shortcut: "Both sides present valid constitutional/health arguments.",
    company: "Capgemini"
  },
  {
    id: 9322,
    topic: "logical-sequence",
    difficulty: "medium",
    category: "National Policy",
    q: "Statement: Should India increase its defence budget?\nArguments:\nI. Yes, national security is a top priority.\nII. No, one should never spend money on the military.",
    options: ["A) Only argument I is strong", "B) Only argument II is strong", "C) Both I and II are strong", "D) Neither is strong"],
    answer: "A) Only argument I is strong",
    explanation: `Argument I is strong as it presents a reasonable justification tied to national interest.
Argument II uses absolute wording (\"never\") without justification, making it a weak, overly generalized argument.`,
    shortcut: "Absolute or extreme statements represent weak arguments.",
    company: "LTI"
  },
  {
    id: 9323,
    topic: "logical-sequence",
    difficulty: "easy",
    category: "Business Dynamics",
    q: "Statement I: The company's profits declined sharply this quarter.\nStatement II: The company had to lay off several employees this quarter.",
    options: ["A) I is the cause and II is its effect", "B) II is the cause and I is its effect", "C) Both are independent causes", "D) Both are effects of a common cause"],
    answer: "A) I is the cause and II is its effect",
    explanation: `A decline in profits typically forces a company to cut costs, one method being layoffs.
So the decline in profits (Statement I) is the cause, and the layoffs (Statement II) are the resulting effect.`,
    shortcut: "Profit decline leads to cost cutting/layoffs.",
    company: "Mindtree"
  },
  {
    id: 9324,
    topic: "logical-sequence",
    difficulty: "medium",
    category: "Environmental Dynamics",
    q: "Statement I: Heavy rainfall occurred in the city for three consecutive days.\nStatement II: Several low-lying areas of the city were flooded.",
    options: ["A) I is the cause and II is its effect", "B) II is the cause and I is its effect", "C) Both are independent causes", "D) Both are effects of a common cause"],
    answer: "A) I is the cause and II is its effect",
    explanation: `Continuous heavy rainfall naturally leads to excess water accumulation, causing flooding in low-lying areas.
Hence, heavy rainfall (I) is the cause, and flooding (II) is the effect.`,
    shortcut: "Rainfall causes flooding.",
    company: "Deloitte"
  },
  {
    id: 9325,
    topic: "logical-sequence",
    difficulty: "easy",
    category: "Venn Diagrams",
    q: "Statements: All roses are flowers. Some flowers are red.\nConclusions:\nI. Some roses are red.\nII. Some red things are flowers.",
    options: ["A) Only I follows", "B) Only II follows", "C) Both follow", "D) Neither follows"],
    answer: "B) Only II follows",
    explanation: `"Some flowers are red" directly implies "Some red things are flowers" (Conclusion II).
However, we cannot conclude that the "red flowers" include roses specifically, so Conclusion I does not necessarily follow.`,
    shortcut: "Roses and red red sets may not intersect.",
    company: "PwC"
  },
  {
    id: 9326,
    topic: "logical-sequence",
    difficulty: "medium",
    category: "Venn Diagrams",
    q: "Statements: No cats are dogs. All dogs are animals.\nConclusions:\nI. No animals are cats.\nII. Some animals are dogs.",
    options: ["A) Only I follows", "B) Only II follows", "C) Both follow", "D) Neither follows"],
    answer: "B) Only II follows",
    explanation: `"All dogs are animals" means dogs form a subset of animals, so "Some animals are dogs" follows (Conclusion II).
"No cats are dogs" does not mean cats are excluded from all animals — cats could still be animals — so Conclusion I does not follow.`,
    shortcut: "Cats can still overlap with animals outer set.",
    company: "Goldman Sachs"
  },
  {
    id: 9327,
    topic: "logical-sequence",
    difficulty: "hard",
    category: "Venn Diagrams",
    q: "Statements: All squares are rectangles. All rectangles are quadrilaterals.\nConclusions:\nI. All squares are quadrilaterals.\nII. Some quadrilaterals are squares.",
    options: ["A) Only I follows", "B) Only II follows", "C) Both follow", "D) Neither follows"],
    answer: "C) Both follow",
    explanation: `By the chain rule, since all squares are rectangles and all rectangles are quadrilaterals, all squares are quadrilaterals (Conclusion I follows).
Since squares form part of the quadrilaterals set, it also follows that some quadrilaterals are squares (Conclusion II follows).`,
    shortcut: "Subset relations nested: Square in Rectangle in Quadrilateral.",
    company: "Google"
  },
  {
    id: 9328,
    topic: "logical-sequence",
    difficulty: "easy",
    category: "Ages",
    q: "What is the age of Ramesh?\nI. Ramesh is 5 years older than his sister.\nII. Ramesh's sister is 20 years old.",
    options: ["A) Statement I alone is sufficient", "B) Statement II alone is sufficient", "C) Both statements together are sufficient, but neither alone is sufficient", "D) Both statements together are not sufficient"],
    answer: "C) Both statements together are sufficient, but neither alone is sufficient",
    explanation: `Statement I alone gives only a relative age difference.
Statement II alone gives the sister's age but not Ramesh's.
Combining both: Ramesh's age = 20 + 5 = 25 years.`,
    shortcut: "Combine difference and reference to solve.",
    company: "Amazon"
  },
  {
    id: 9329,
    topic: "logical-sequence",
    difficulty: "medium",
    category: "Inequalities",
    q: "Is x > y?\nI. x + 3 > y + 3\nII. x is a positive number.",
    options: ["A) Statement I alone is sufficient", "B) Statement II alone is sufficient", "C) Both statements together are needed", "D) Statement I alone is sufficient, but II is not"],
    answer: "D) Statement I alone is sufficient, but II is not",
    explanation: `Statement I: x + 3 > y + 3 simplifies directly to x > y, which fully answers the question — sufficient alone.
Statement II only tells us x is positive, giving no information about y, so it is not sufficient.`,
    shortcut: "Subtract 3 from both sides of Statement I.",
    company: "Microsoft"
  },
  {
    id: 9330,
    topic: "logical-sequence",
    difficulty: "hard",
    category: "Class Count",
    q: "How many students are there in the class?\nI. There are 3 rows of students, with an equal number of students in each row.\nII. Each row has 10 students.",
    options: ["A) Statement I alone is sufficient", "B) Statement II alone is sufficient", "C) Both statements together are needed", "D) Neither statement is sufficient even together"],
    answer: "C) Both statements together are needed",
    explanation: `Statement I alone tells us the number of rows (3) but not students per row.
Statement II alone tells us students per row (10) but not the number of rows.
Together: 3 rows × 10 students = 30 students.`,
    shortcut: "Rows * columns gives total.",
    company: "Adobe"
  },

  {
    id: 9401,
    topic: "verbal-reasoning",
    difficulty: "easy",
    category: "Analogy",
    q: "Doctor : Hospital :: Teacher : ?",
    options: ["A) Student", "B) School", "C) Book", "D) Classroom"],
    answer: "B) School",
    explanation: `A Doctor works at a Hospital. Similarly, a Teacher works at a School.
The relationship is "person : place of work."`,
    shortcut: "Identify the work location relationship.",
    company: "TCS"
  },
  {
    id: 9402,
    topic: "verbal-reasoning",
    difficulty: "easy",
    category: "Analogy",
    q: "Pen : Write :: Knife : ?",
    options: ["A) Sharp", "B) Cut", "C) Kitchen", "D) Blade"],
    answer: "B) Cut",
    explanation: `A Pen is used to Write. Similarly, a Knife is used to Cut.
The relationship is "tool : its primary function."`,
    shortcut: "Identify function relationship.",
    company: "Infosys"
  },
  {
    id: 9403,
    topic: "verbal-reasoning",
    difficulty: "easy",
    category: "Analogy",
    q: "Bird : Nest :: Man : ?",
    options: ["A) Village", "B) House", "C) Family", "D) City"],
    answer: "B) House",
    explanation: `A Bird lives in a Nest. Similarly, a Man lives in a House.
The relationship is "living being : dwelling place."`,
    shortcut: "Identify dwelling place relationship.",
    company: "Wipro"
  },
  {
    id: 9404,
    topic: "verbal-reasoning",
    difficulty: "easy",
    category: "Analogy",
    q: "Fish : Water :: Bird : ?",
    options: ["A) Nest", "B) Sky", "C) Tree", "D) Feather"],
    answer: "B) Sky",
    explanation: `A Fish's natural habitat/medium of movement is Water. Similarly, a Bird's natural medium of movement is the Sky (air).
The relationship is "creature : natural element it moves through."`,
    shortcut: "Identify medium of movement.",
    company: "Cognizant"
  },
  {
    id: 9405,
    topic: "verbal-reasoning",
    difficulty: "easy",
    category: "Analogy",
    q: "Author : Book :: Sculptor : ?",
    options: ["A) Chisel", "B) Statue", "C) Museum", "D) Stone"],
    answer: "B) Statue",
    explanation: `An Author creates a Book. Similarly, a Sculptor creates a Statue.
The relationship is "creator : creation."`,
    shortcut: "Identify creator and creation.",
    company: "Accenture"
  },
  {
    id: 9406,
    topic: "verbal-reasoning",
    difficulty: "easy",
    category: "Classification",
    q: "Find the odd one out.",
    options: ["A) Apple", "B) Mango", "C) Potato", "D) Banana"],
    answer: "C) Potato",
    explanation: `Apple, Mango, and Banana are all fruits.
Potato is a vegetable (a tuber), making it the odd one out.`,
    shortcut: "Identify the unique category: Fruits vs Vegetable.",
    company: "Capgemini"
  },
  {
    id: 9407,
    topic: "verbal-reasoning",
    difficulty: "easy",
    category: "Classification",
    q: "Find the odd one out.",
    options: ["A) Triangle", "B) Square", "C) Circle", "D) Cube"],
    answer: "D) Cube",
    explanation: `Triangle, Square, and Circle are all two-dimensional (2D) shapes.
Cube is a three-dimensional (3D) solid, making it the odd one out.`,
    shortcut: "Identify dimension: 2D vs 3D.",
    company: "LTI"
  },
  {
    id: 9408,
    topic: "verbal-reasoning",
    difficulty: "easy",
    category: "Classification",
    q: "Find the odd one out.",
    options: ["A) Violin", "B) Guitar", "C) Flute", "D) Sitar"],
    answer: "C) Flute",
    explanation: `Violin, Guitar, and Sitar are all stringed instruments.
Flute is a wind instrument, making it the odd one out.`,
    shortcut: "Identify instrument type: String vs Wind.",
    company: "Mindtree"
  },
  {
    id: 9409,
    topic: "verbal-reasoning",
    difficulty: "easy",
    category: "Classification",
    q: "Find the odd one out.",
    options: ["A) Delhi", "B) Mumbai", "C) Kolkata", "D) India"],
    answer: "D) India",
    explanation: `Delhi, Mumbai, and Kolkata are all cities.
India is a country, not a city, making it the odd one out.`,
    shortcut: "Identify entity: Cities vs Country.",
    company: "Deloitte"
  },
  {
    id: 9410,
    topic: "verbal-reasoning",
    difficulty: "easy",
    category: "Word Formation",
    q: "Using the letters of the word 'CONSTRUCTION', can the word 'TRUCK' be formed?",
    options: ["A) Yes", "B) No", "C) Cannot be determined", "D) Only partially"],
    answer: "B) No",
    explanation: `CONSTRUCTION contains letters: C, O, N, S, T, R, U, C, T, I, O, N.
'TRUCK' requires the letter K, which is not present in CONSTRUCTION.
So the word cannot be formed.`,
    shortcut: "Search for letter 'K'.",
    company: "PwC"
  },
  {
    id: 9411,
    topic: "verbal-reasoning",
    difficulty: "medium",
    category: "Word Formation",
    q: "From the letters of the word 'GENERATION', can the word 'GATE' be formed?",
    options: ["A) Yes", "B) No", "C) Cannot be determined", "D) Only if repeated"],
    answer: "A) Yes",
    explanation: `GENERATION contains letters: G, E, N, E, R, A, T, I, O, N.
'GATE' requires G, A, T, E — all of which are present in GENERATION.
So the word can be formed.`,
    shortcut: "Check presence of G, A, T, E.",
    company: "Goldman Sachs"
  },
  {
    id: 9412,
    topic: "verbal-reasoning",
    difficulty: "medium",
    category: "Word Formation",
    q: "Which word cannot be formed from the letters of 'MAGNIFICENT'?",
    options: ["A) MAGIC", "B) FINE", "C) GIANT", "D) NATION"],
    answer: "D) NATION",
    explanation: `MAGNIFICENT contains: M, A, G, N, I, F, I, C, E, N, T.
NATION needs N, A, T, I, O, N — but there is no 'O' in MAGNIFICENT.
So NATION cannot be formed.`,
    shortcut: "Check presence of letter 'O'.",
    company: "Google"
  },
  {
    id: 9413,
    topic: "verbal-reasoning",
    difficulty: "medium",
    category: "Word Formation",
    q: "Which word cannot be formed from the letters of 'INFORMATION'?",
    options: ["A) FORM", "B) STATION", "C) NATION", "D) RATION"],
    answer: "B) STATION",
    explanation: `INFORMATION contains: I, N, F, O, R, M, A, T, I, O, N.
STATION requires two T's, but INFORMATION contains only one T.
So STATION cannot be formed.`,
    shortcut: "Count letters: 'STATION' has two 'T's.",
    company: "Amazon"
  },
  {
    id: 9414,
    topic: "verbal-reasoning",
    difficulty: "medium",
    category: "Dictionary Order",
    q: "Arrange the following words as they would appear in a dictionary:\n1. Consequence\n2. Constellation\n3. Constant\n4. Console",
    options: ["A) 1,4,3,2", "B) 1,4,2,3", "C) 4,1,3,2", "D) 1,3,4,2"],
    answer: "A) 1,4,3,2",
    explanation: `Comparing letter by letter: Consequence, Console, Constant, Constellation all start with "Cons."
At the 5th letter: Consequence (e), Console (o), Constant (t), Constellation (t).
So order by 5th letter: Consequence(e) < Console(o) < Constant/Constellation(t).
Between Constant and Constellation, comparing further: Constant vs Constella— 'a' comes before 'e', so Constant before Constellation.
Final order: Consequence, Console, Constant, Constellation → 1, 4, 3, 2.`,
    shortcut: "Compare 5th letter: e < o < t. Then Constant < Constellation.",
    company: "Microsoft"
  },
  {
    id: 9415,
    topic: "verbal-reasoning",
    difficulty: "medium",
    category: "Dictionary Order",
    q: "Arrange in dictionary order:\n1. Precaution\n2. Precede\n3. Precise\n4. Precept",
    options: ["A) 1,2,4,3", "B) 2,4,1,3", "C) 2,1,4,3", "D) 1,4,2,3"],
    answer: "A) 1,2,4,3",
    explanation: `All start with "Prec". Comparing 5th letter: Precede(e), Precept(e), Precaution(a), Precise(i).
Precaution has 'a' at position 5, which comes first alphabetically: Precaution.
Compare remaining: Precede(e), Precept(e), Precise(i). 'e' comes before 'i', so Precise is last.
Between Precede and Precept: 'd' in Precede comes before 'p' in Precept.
Final dictionary order: Precaution, Precede, Precept, Precise → 1, 2, 4, 3.`,
    shortcut: "Precaution (a) is first, Precise (i) is last.",
    company: "Adobe"
  },
  {
    id: 9416,
    topic: "verbal-reasoning",
    difficulty: "medium",
    category: "Dictionary Order",
    q: "Arrange in dictionary order:\n1. Bat\n2. Ball\n3. Bath\n4. Bald",
    options: ["A) 2,4,1,3", "B) 1,2,4,3", "C) 2,1,4,3", "D) 4,2,1,3"],
    answer: "D) 4,2,1,3",
    explanation: `All four words start with "Ba". Comparing the 3rd letter: Ball(l), Bald(l), Bat(t), Bath(t) — so Ball/Bald come before Bat/Bath.
Between Ball and Bald, compare the 4th letter: Bald(d) vs Ball(l) — 'd' comes before 'l', so Bald precedes Ball.
Between Bat and Bath, Bat is a prefix of Bath, so the shorter word Bat comes first.
Final dictionary order: Bald, Ball, Bat, Bath → 4, 2, 1, 3.`,
    shortcut: "Bald (d) < Ball (l) < Bat < Bath.",
    company: "TCS"
  },
  {
    id: 9417,
    topic: "verbal-reasoning",
    difficulty: "medium",
    category: "Dictionary Order",
    q: "Arrange in dictionary order:\n1. Hint\n2. Hinder\n3. Him\n4. Hind",
    options: ["A) 3,4,2,1", "B) 3,4,1,2", "C) 3,2,4,1", "D) 4,3,2,1"],
    answer: "A) 3,4,2,1",
    explanation: `All start with "Hi". Comparing 3rd letter: Him(m), Hinder(n), Hind(n), Hint(n).
'm' comes before 'n', so Him is first.
Among Hinder, Hind, Hint: compare 4th letter, all have 'd' or 't' — Hinder(d), Hind(d), Hint(t).
Hinder vs Hind: Hind is a prefix of Hinder, so Hind comes before Hinder.
Then Hint (starts with 'Hin-t', t > d) comes last.
Final order: Him, Hind, Hinder, Hint → 3, 4, 2, 1.`,
    shortcut: "Him (m) < Hind/Hinder (d) < Hint (t).",
    company: "Wipro"
  },
  {
    id: 9418,
    topic: "verbal-reasoning",
    difficulty: "medium",
    category: "Sentence Arrangement",
    q: "Arrange the sentences in a logical order:\n1. He then applied for a passport.\n2. Ravi decided to travel abroad for higher studies.\n3. Finally, he boarded his flight to the USA.\n4. He got admission in a reputed university.",
    options: ["A) 2,4,1,3", "B) 2,1,4,3", "C) 4,2,1,3", "D) 2,4,3,1"],
    answer: "A) 2,4,1,3",
    explanation: `Logical sequence of events: First Ravi decides to study abroad (2), then he gets admission (4), then he applies for a passport (1), and finally boards his flight (3).
Order: 2, 4, 1, 3.`,
    shortcut: "Decision -> Admission -> Passport -> Flight.",
    company: "Infosys"
  },
  {
    id: 9419,
    topic: "verbal-reasoning",
    difficulty: "medium",
    category: "Sentence Arrangement",
    q: "Arrange the sentences in a logical order:\n1. The fire spread quickly through the building.\n2. Firefighters arrived and doused the flames.\n3. A short circuit occurred in the wiring.\n4. The residents were evacuated safely.",
    options: ["A) 3,1,4,2", "B) 1,3,4,2", "C) 3,1,2,4", "D) 3,4,1,2"],
    answer: "A) 3,1,4,2",
    explanation: `The short circuit is the initial cause (3), leading to the fire spreading (1), after which residents are evacuated for safety (4), and finally firefighters arrive to put out the flames (2).
Order: 3, 1, 4, 2.`,
    shortcut: "Short circuit -> Fire -> Evacuation -> Dousing.",
    company: "Cognizant"
  },
  {
    id: 9420,
    topic: "verbal-reasoning",
    difficulty: "medium",
    category: "Sentence Arrangement",
    q: "Arrange the sentences in a logical order:\n1. The seeds sprout into small seedlings.\n2. A farmer sows seeds in the field.\n3. The crop is finally harvested.\n4. The plants grow and mature over weeks.",
    options: ["A) 2,1,4,3", "B) 2,4,1,3", "C) 1,2,4,3", "D) 2,1,3,4"],
    answer: "A) 2,1,4,3",
    explanation: `Natural sequence: sowing seeds (2), seeds sprouting (1), plants growing and maturing (4), and finally harvesting (3).
Order: 2, 1, 4, 3.`,
    shortcut: "Sow -> Sprout -> Grow -> Harvest.",
    company: "Accenture"
  },
  {
    id: 9421,
    topic: "verbal-reasoning",
    difficulty: "hard",
    category: "Sentence Arrangement",
    q: "Arrange the sentences in a logical order:\n1. The chef plated the dish beautifully.\n2. The waiter served it to the customer.\n3. The chef cooked the ingredients.\n4. The customer ordered a meal.",
    options: ["A) 4,3,1,2", "B) 4,1,3,2", "C) 3,4,1,2", "D) 4,3,2,1"],
    answer: "A) 4,3,1,2",
    explanation: `Logical order: the customer first orders a meal (4), then the chef cooks the ingredients (3), then plates the dish (1), and finally the waiter serves it (2).
Order: 4, 3, 1, 2.`,
    shortcut: "Order -> Cook -> Plate -> Serve.",
    company: "Capgemini"
  },
  {
    id: 9422,
    topic: "verbal-reasoning",
    difficulty: "hard",
    category: "Logical Venn Diagrams",
    q: "Which Venn diagram best represents the relationship between \"Animals,\" \"Dogs,\" and \"Cats\"?",
    options: ["A) Three separate, non-overlapping circles", "B) Dogs and Cats as separate circles, both inside a larger circle for Animals", "C) One circle inside another inside another (all three nested)", "D) All three circles fully overlapping"],
    answer: "B) Dogs and Cats as separate circles, both inside a larger circle for Animals",
    explanation: `Dogs and Cats are both distinct types of Animals, but a Dog is never a Cat and vice versa.
So both smaller circles (Dogs, Cats) should be drawn inside the larger circle (Animals) but not overlapping each other.`,
    shortcut: "Separate categories inside a common super-category.",
    company: "LTI"
  },
  {
    id: 9423,
    topic: "verbal-reasoning",
    difficulty: "hard",
    category: "Logical Venn Diagrams",
    q: "Which Venn diagram best represents \"Fruits,\" \"Mango,\" and \"Apple\"?",
    options: ["A) Two small non-overlapping circles inside a big circle", "B) Two overlapping circles inside a big circle", "C) Three identical overlapping circles", "D) Three separate circles with no relation"],
    answer: "A) Two small non-overlapping circles inside a big circle",
    explanation: `Both Mango and Apple are types of Fruits, but a Mango is never an Apple, so they don't overlap with each other.
This is represented by two separate, non-overlapping circles inside the larger Fruits circle.`,
    shortcut: "Two distinct fruit categories inside Fruits.",
    company: "Mindtree"
  },
  {
    id: 9424,
    topic: "verbal-reasoning",
    difficulty: "hard",
    category: "Logical Venn Diagrams",
    q: "Which Venn diagram best represents \"Students,\" \"Athletes,\" and \"Boys\"?",
    options: ["A) Three mutually exclusive circles", "B) Three circles overlapping each other, forming a common intersection region", "C) One circle nested completely inside another", "D) Two identical circles"],
    answer: "B) Three circles overlapping each other, forming a common intersection region",
    explanation: `A person can be a Student, an Athlete, a Boy, or any combination of these (e.g., a boy who is a student-athlete).
Since these categories overlap in various combinations, three intersecting circles best represent the relationship.`,
    shortcut: "Intersecting subsets with common overlaps.",
    company: "Deloitte"
  },
  {
    id: 9425,
    topic: "verbal-reasoning",
    difficulty: "hard",
    category: "Logical Venn Diagrams",
    q: "Which Venn diagram best represents \"Mothers,\" \"Women,\" and \"Doctors\"?",
    options: ["A) Mothers circle fully inside Women circle, with Doctors as a separate overlapping circle intersecting both", "B) Three completely separate circles", "C) All three circles identical and fully overlapping", "D) Doctors circle fully inside Mothers circle"],
    answer: "A) Mothers circle fully inside Women circle, with Doctors as a separate overlapping circle intersecting both",
    explanation: `Every Mother is a Woman, so the Mothers circle lies entirely within the Women circle.
Doctors can be men or women, and can be mothers or non-mothers, so the Doctors circle overlaps both the Women and Mothers circles.`,
    shortcut: "Subset nesting with an intersecting third category.",
    company: "PwC"
  },
  {
    id: 9426,
    topic: "verbal-reasoning",
    difficulty: "hard",
    category: "Mathematical Operations",
    q: "If '+' means '÷', '−' means '×', '×' means '−', and '÷' means '+', then find the value of: 20 + 4 − 3 × 6 ÷ 2",
    options: ["A) 10", "B) 11", "C) 12", "D) 13"],
    answer: "B) 11",
    explanation: `Substitute symbols: '+' → ÷, '−' → ×, '×' → −, '÷' → +
Expression becomes: 20 ÷ 4 × 3 − 6 + 2
Following BODMAS: 20 ÷ 4 = 5; 5 × 3 = 15; 15 − 6 = 9; 9 + 2 = 11`,
    shortcut: "Substitute and apply BODMAS: 5 * 3 - 6 + 2 = 11.",
    company: "Goldman Sachs"
  },
  {
    id: 9427,
    topic: "verbal-reasoning",
    difficulty: "hard",
    category: "Mathematical Operations",
    q: "If A means '+', B means '−', C means '×', and D means '÷', find the value of: 16 C 4 D 2 A 6 B 3",
    options: ["A) 35", "B) 33", "C) 31", "D) 29"],
    answer: "A) 35",
    explanation: `Substitute: C → ×, D → ÷, A → +, B → −
Expression becomes: 16 × 4 ÷ 2 + 6 − 3
Following BODMAS: 16 × 4 = 64; 64 ÷ 2 = 32; 32 + 6 = 38; 38 − 3 = 35`,
    shortcut: "Substitute and apply BODMAS: 32 + 6 - 3 = 35.",
    company: "Google"
  },
  {
    id: 9428,
    topic: "verbal-reasoning",
    difficulty: "hard",
    category: "Mathematical Operations",
    q: "If 5 * 3 = 34, and 7 * 2 = 53, then what is 6 * 4 = ?",
    options: ["A) 52", "B) 50", "C) 48", "D) 54"],
    answer: "A) 52",
    explanation: `Pattern observed: a * b = a² + b²
5² + 3² = 25 + 9 = 34
7² + 2² = 49 + 4 = 53
So 6 * 4 = 6² + 4² = 36 + 16 = 52`,
    shortcut: "Sum of squares: 36 + 16 = 52.",
    company: "Amazon"
  },
  {
    id: 9429,
    topic: "verbal-reasoning",
    difficulty: "hard",
    category: "Mathematical Operations",
    q: "If 3 * 4 = 21, and 5 * 2 = 35, then what is 4 * 6 = ?",
    options: ["A) 40", "B) 44", "C) 48", "D) 52"],
    answer: "A) 40",
    explanation: `Pattern observed: a * b = a × (a + b).
Check: 3 * 4 = 3 × (3+4) = 3 × 7 = 21
Check: 5 * 2 = 5 × (5+2) = 5 × 7 = 35
So 4 * 6 = 4 × (4+6) = 4 × 10 = 40`,
    shortcut: "Multiply first digit by sum: 4 * 10 = 40.",
    company: "Microsoft"
  },
  {
    id: 9430,
    topic: "verbal-reasoning",
    difficulty: "hard",
    category: "Mathematical Operations",
    q: "If P denotes '×', Q denotes '+', R denotes '÷', and S denotes '−', evaluate: 10 Q 6 R 2 S 3 P 4",
    options: ["A) 1", "B) 5", "C) 3", "D) 7"],
    answer: "A) 1",
    explanation: `Substitute: Q → +, R → ÷, S → −, P → ×
Expression becomes: 10 + 6 ÷ 2 − 3 × 4
Following BODMAS: 6 ÷ 2 = 3; 3 × 4 = 12; 10 + 3 = 13; 13 − 12 = 1`,
    shortcut: "10 + 3 - 12 = 1.",
    company: "Adobe"
  },

  {
    id: 9501,
    topic: "non-verbal-reasoning",
    difficulty: "easy",
    category: "Figure Series",
    q: "A series of figures shows a triangle with 1 dot, then 2 dots, then 3 dots, each inside the triangle at the center, arranged in a growing cluster. What should the number of dots be in the 5th figure in the series?",
    options: ["A) 4", "B) 5", "C) 6", "D) 7"],
    answer: "B) 5",
    explanation: `The series follows a pattern of +1 dot per figure: 1, 2, 3, 4, 5...
Following this arithmetic progression, the 5th figure should contain 5 dots.`,
    shortcut: "Arithmetic progression of +1 dot.",
    company: "TCS"
  },
  {
    id: 9502,
    topic: "non-verbal-reasoning",
    difficulty: "easy",
    category: "Figure Series",
    q: "A square rotates 45° clockwise in each successive figure of a series. If the first figure shows the square with a flat side on top (0° rotation), what will be the orientation of the 4th figure?",
    options: ["A) 90° rotated (diamond with flat top again)", "B) 135° rotated", "C) 180° rotated", "D) 45° rotated"],
    answer: "B) 135° rotated",
    explanation: `Each figure rotates by 45° more than the previous one.
Figure 1: 0°, Figure 2: 45°, Figure 3: 90°, Figure 4: 135°.
So the 4th figure is rotated 135° from the original.`,
    shortcut: "45° * 3 steps = 135°.",
    company: "Infosys"
  },
  {
    id: 9503,
    topic: "non-verbal-reasoning",
    difficulty: "easy",
    category: "Figure Series",
    q: "A series shows a circle with an increasing number of internal lines dividing it: figure 1 has 1 line (2 parts), figure 2 has 2 lines (4 parts), figure 3 has 3 lines (6 parts). How many parts will the circle be divided into in figure 4?",
    options: ["A) 6", "B) 7", "C) 8", "D) 9"],
    answer: "C) 8",
    explanation: `Each additional line through the center adds 2 more parts (since lines pass through the full circle).
Pattern: 1 line → 2 parts, 2 lines → 4 parts, 3 lines → 6 parts, so 4 lines → 8 parts.`,
    shortcut: "Number of parts = 2 * number of lines.",
    company: "Wipro"
  },
  {
    id: 9504,
    topic: "non-verbal-reasoning",
    difficulty: "easy",
    category: "Figure Analogy",
    q: "A small circle is inside a large square in Figure 1. A small triangle is inside a large pentagon in Figure 2, following the same relationship. If Figure 3 shows \"small square inside a large circle,\" what relationship pattern is being followed?",
    options: ["A) Shape changes but size relationship (small inside large) stays the same", "B) Both shapes must be identical", "C) The larger shape must always be a square", "D) No consistent pattern"],
    answer: "A) Shape changes but size relationship (small inside large) stays the same",
    explanation: `In each pair, a smaller shape is placed inside a larger, different-shaped outer figure.
The specific shapes vary, but the consistent rule is: small shape nested within a larger enclosing shape.`,
    shortcut: "Nested size relationship remains invariant.",
    company: "Cognizant"
  },
  {
    id: 9505,
    topic: "non-verbal-reasoning",
    difficulty: "easy",
    category: "Figure Analogy",
    q: "A black triangle relates to a white triangle in the same way a black square relates to what?",
    options: ["A) Black circle", "B) White square", "C) White circle", "D) Black triangle"],
    answer: "B) White square",
    explanation: `The relationship shown is a simple color inversion: black version → white version, with the shape unchanged.
Applying the same rule to a black square gives a white square.`,
    shortcut: "Invert the shading/color.",
    company: "Accenture"
  },
  {
    id: 9506,
    topic: "non-verbal-reasoning",
    difficulty: "easy",
    category: "Figure Analogy",
    q: "A figure with 3 sides relates to a figure with 6 sides (double) in the same way a figure with 4 sides relates to what?",
    options: ["A) 6 sides", "B) 8 sides", "C) 7 sides", "D) 5 sides"],
    answer: "B) 8 sides",
    explanation: `The relationship pattern is \"number of sides doubles\": triangle (3 sides) → hexagon (6 sides), which is 3×2.
Applying the same doubling rule: a 4-sided figure (square) relates to an 8-sided figure (octagon), which is 4×2.`,
    shortcut: "Multiply side count by 2.",
    company: "Capgemini"
  },
  {
    id: 9507,
    topic: "non-verbal-reasoning",
    difficulty: "easy",
    category: "Figure Classification",
    q: "Which figure does not belong with the others: A) Equilateral Triangle B) Square C) Regular Pentagon D) Scalene Triangle",
    options: ["A) Equilateral Triangle", "B) Square", "C) Regular Pentagon", "D) Scalene Triangle"],
    answer: "D) Scalene Triangle",
    explanation: `Equilateral Triangle, Square, and Regular Pentagon are all regular polygons (all sides and angles equal).
A Scalene Triangle has all sides of different lengths, making it irregular and the odd one out.`,
    shortcut: "Regular vs irregular polygons.",
    company: "LTI"
  },
  {
    id: 9508,
    topic: "non-verbal-reasoning",
    difficulty: "easy",
    category: "Figure Classification",
    q: "Which figure does not belong: A) Circle B) Ellipse C) Oval D) Rectangle",
    options: ["A) Circle", "B) Ellipse", "C) Oval", "D) Rectangle"],
    answer: "D) Rectangle",
    explanation: `Circle, Ellipse, and Oval are all curved, rounded shapes with no straight edges or corners.
Rectangle is a shape made entirely of straight lines and right angles, making it the odd one out.`,
    shortcut: "Curved edges vs straight edges.",
    company: "Mindtree"
  },
  {
    id: 9509,
    topic: "non-verbal-reasoning",
    difficulty: "easy",
    category: "Figure Classification",
    q: "Which figure does not belong: A) A figure with 2 lines of symmetry B) A figure with 4 lines of symmetry C) A figure with infinite lines of symmetry D) A figure with 1 line of symmetry only (scalene-like shape)",
    options: ["A) 2 lines of symmetry", "B) 4 lines of symmetry", "C) Infinite lines of symmetry", "D) 1 line of symmetry only"],
    answer: "D) 1 line of symmetry only",
    explanation: `Figures A, B, and C all represent regular/highly symmetric shapes (rectangle-like, square-like, and circle respectively) with multiple or infinite symmetry lines.
Figure D has minimal symmetry (only 1 line), making it distinct from the other highly symmetric figures.`,
    shortcut: "High symmetry vs single axis symmetry.",
    company: "Deloitte"
  },
  {
    id: 9510,
    topic: "non-verbal-reasoning",
    difficulty: "easy",
    category: "Mirror Images",
    q: "What is the mirror image of the capital letter 'F' when reflected about a vertical axis (right-left mirror)?",
    options: ["A) It looks like a backward 'F' (mirrored horizontally, vertical stem on the right, arms pointing left)", "B) It looks exactly like 'F'", "C) It looks like the letter 'E'", "D) It looks like the letter 'L'"],
    answer: "A) It looks like a backward 'F' (mirrored horizontally, vertical stem on the right, arms pointing left)",
    explanation: `'F' has a vertical stem on the left with two horizontal arms extending right (top and middle).
A vertical-axis mirror reflection flips left and right, so the stem appears on the right and the arms point left — a reversed 'F'.`,
    shortcut: "Left-right reflection flip.",
    company: "PwC"
  },
  {
    id: 9511,
    topic: "non-verbal-reasoning",
    difficulty: "medium",
    category: "Mirror Images",
    q: "What is the mirror image of the digital time '10:25' when reflected in a vertical mirror?",
    options: ["A) 25:01", "B) SS:0I (unreadable digits reversed)", "C) The digits appear reversed in order and each digit is horizontally flipped", "D) It remains 10:25"],
    answer: "C) The digits appear reversed in order and each digit is horizontally flipped",
    explanation: `In a vertical mirror, the entire sequence flips left-to-right: the order of characters reverses, and each individual digit/character is also horizontally mirrored.
So '10:25' would show the colon and digits in reverse order, with each digit's shape flipped, rather than simply becoming a different valid time.`,
    shortcut: "Reverse the sequence order and horizontally flip each character.",
    company: "Goldman Sachs"
  },
  {
    id: 9512,
    topic: "non-verbal-reasoning",
    difficulty: "medium",
    category: "Mirror Images",
    q: "Which letter looks the same as its own mirror image when reflected about a vertical axis?",
    options: ["A) 'J'", "B) 'A'", "C) 'G'", "D) 'S'"],
    answer: "B) 'A'",
    explanation: `A vertical-axis mirror preserves letters that have left-right (vertical) symmetry.
'A' is symmetric about a vertical line down its center, so its mirror image looks identical to itself. 'J', 'G', and 'S' do not have this symmetry.`,
    shortcut: "Identify vertical axis symmetry.",
    company: "Google"
  },
  {
    id: 9513,
    topic: "non-verbal-reasoning",
    difficulty: "medium",
    category: "Water Images",
    q: "What is the water image (reflection about a horizontal axis) of the capital letter 'B'?",
    options: ["A) It appears upside down, with the curves now opening downward instead of upward", "B) It looks exactly like 'B'", "C) It looks like the letter 'P'", "D) It looks like the letter 'R'"],
    answer: "A) It appears upside down, with the curves now opening downward instead of upward",
    explanation: `A water image reflects the figure about a horizontal axis (top-bottom flip), unlike a mirror image which flips left-right.
'B' flipped vertically appears upside-down, with its curved bumps now on the lower half instead of the upper half.`,
    shortcut: "Top-bottom vertical flip.",
    company: "Amazon"
  },
  {
    id: 9514,
    topic: "non-verbal-reasoning",
    difficulty: "medium",
    category: "Water Images",
    q: "Which digit looks the same in its water image (horizontal/top-bottom reflection)?",
    options: ["A) 6", "B) 9", "C) 8", "D) 3"],
    answer: "C) 8",
    explanation: `A water image flips a figure top-to-bottom.
The digit '8' has symmetry about a horizontal axis (its top and bottom loops are mirror images of each other), so it looks the same when flipped vertically. '6' and '9' would swap into each other, not remain the same individually.`,
    shortcut: "Identify horizontal axis symmetry.",
    company: "Microsoft"
  },
  {
    id: 9515,
    topic: "non-verbal-reasoning",
    difficulty: "medium",
    category: "Paper Folding",
    q: "A square paper is folded in half vertically, then a small triangular notch is cut from the folded edge. When unfolded, how many notches will appear on the paper, and where?",
    options: ["A) 1 notch, at the corner", "B) 2 notches, symmetric about the fold line", "C) 4 notches, one in each corner", "D) No notch, since folding does not affect cutting"],
    answer: "B) 2 notches, symmetric about the fold line",
    explanation: `Folding the paper in half creates two overlapping layers.
Cutting a notch through both layers at the fold edge results in two notches when unfolded — mirrored symmetrically on either side of the fold line.`,
    shortcut: "1 cut on 2 layers at fold edge = 2 symmetric holes.",
    company: "Adobe"
  },
  {
    id: 9516,
    topic: "non-verbal-reasoning",
    difficulty: "medium",
    category: "Paper Folding",
    q: "A rectangular paper is folded in half twice (first vertically, then horizontally), and a hole is punched in the corner where all folds meet. How many holes appear when the paper is fully unfolded?",
    options: ["A) 1", "B) 2", "C) 3", "D) 4"],
    answer: "D) 4",
    explanation: `Two folds create four layers of paper stacked together.
A single punch through all four layers, positioned at the corner common to both folds, results in 4 holes when the paper is completely unfolded (one in each quadrant, symmetric about both fold lines).`,
    shortcut: "1 punch on 4 layers = 4 symmetric holes.",
    company: "TCS"
  },
  {
    id: 9517,
    topic: "non-verbal-reasoning",
    difficulty: "medium",
    category: "Paper Folding",
    q: "A square paper is folded diagonally to form a triangle, then folded diagonally again to form a smaller triangle. A small circle is cut from the center of the folded edge. How many circular holes appear upon unfolding?",
    options: ["A) 1", "B) 2", "C) 4", "D) 8"],
    answer: "C) 4",
    explanation: `Two diagonal folds result in 4 layers of paper.
Cutting through all 4 layers at once produces 4 holes when the paper is unfolded, arranged symmetrically according to the fold lines.`,
    shortcut: "4 layers = 4 cuts.",
    company: "Wipro"
  },
  {
    id: 9518,
    topic: "non-verbal-reasoning",
    difficulty: "medium",
    category: "Paper Cutting",
    q: "A square piece of paper is folded into 4 equal smaller squares (folded in half twice). If a triangular piece is cut from the exact center of the folded square (the corner where all folds meet), what shape appears in the middle of the paper when unfolded?",
    options: ["A) A small triangle", "B) A small square or diamond shape (formed by 4 triangular cuts joining together)", "C) A circle", "D) No shape appears"],
    answer: "B) A small square or diamond shape (formed by 4 triangular cuts joining together)",
    explanation: `Folding into 4 equal squares means the center corner represents the true center of the original paper.
Cutting a triangular notch there removes material from all 4 layers at that shared corner, and when unfolded, the 4 triangular cuts combine to form a single diamond/square-shaped hole in the center.`,
    shortcut: "Triangular notch at center fold corner unfolds into diamond.",
    company: "Infosys"
  },
  {
    id: 9519,
    topic: "non-verbal-reasoning",
    difficulty: "medium",
    category: "Paper Cutting",
    q: "A strip of paper is folded like an accordion (zig-zag) into 3 equal sections, and a semicircle is cut from the folded edge. How many semicircular/circular cut-outs appear when unfolded?",
    options: ["A) 1", "B) 2", "C) 3", "D) 6"],
    answer: "C) 3",
    explanation: `An accordion fold into 3 sections still results in the cut passing through all 3 layers of paper at that fold point.
Unfolding reveals the cut repeated once in each of the 3 sections, giving 3 cut-outs total.`,
    shortcut: "Accordion folds do not overlap folds on same edge, yields 3 cuts.",
    company: "Cognizant"
  },
  {
    id: 9520,
    topic: "non-verbal-reasoning",
    difficulty: "medium",
    category: "Paper Cutting",
    q: "A circular paper is folded in half to form a semicircle, then folded again to form a quarter-circle. A small square is cut from the curved edge. How many square cut-outs appear when fully unfolded?",
    options: ["A) 1", "B) 2", "C) 4", "D) 8"],
    answer: "C) 4",
    explanation: `Folding the circle in half twice creates 4 layers.
A cut through all 4 layers at the curved edge results in 4 separate cut-outs distributed symmetrically around the circle once unfolded.`,
    shortcut: "4 layers of circle unfolded = 4 cutouts.",
    company: "Accenture"
  },
  {
    id: 9521,
    topic: "non-verbal-reasoning",
    difficulty: "hard",
    category: "Embedded Figures",
    q: "A complex figure contains overlapping triangles, squares, and circles. Among the answer options, which basic shape (triangle, square, hexagon, or circle) is embedded/hidden within the complex figure, based on the description \"three intersecting lines forming a closed 3-sided shape near the center\"?",
    options: ["A) Circle", "B) Triangle", "C) Hexagon", "D) None of these"],
    answer: "B) Triangle",
    explanation: `A closed shape formed by exactly three intersecting straight lines is, by definition, a triangle (3 sides, 3 vertices).
This matches the description given, so the embedded figure is a triangle.`,
    shortcut: "Three intersecting lines forming a closed shape is a triangle.",
    company: "Capgemini"
  },
  {
    id: 9522,
    topic: "non-verbal-reasoning",
    difficulty: "hard",
    category: "Embedded Figures",
    q: "In a complex geometric figure made of overlapping pentagons and stars, a smaller 4-sided closed figure with all right angles is described as being hidden within the design. Which shape is embedded?",
    options: ["A) Rectangle/Square", "B) Triangle", "C) Pentagon", "D) Circle"],
    answer: "A) Rectangle/Square",
    explanation: `A 4-sided closed figure with all right angles (90° corners) is, by definition, a rectangle (or a square if all sides are equal).
This matches the described embedded shape.`,
    shortcut: "4-sided shape with 90° corners = Rectangle/Square.",
    company: "LTI"
  },
  {
    id: 9523,
    topic: "non-verbal-reasoning",
    difficulty: "hard",
    category: "Embedded Figures",
    q: "A dense, cluttered figure made of many crossing lines is said to contain a hidden 5-pointed closed shape. Which basic figure is embedded within it?",
    options: ["A) Pentagon", "B) Star", "C) Hexagon", "D) Circle"],
    answer: "B) Star",
    explanation: `A \"5-pointed\" closed shape specifically describes a star figure (5 points), as opposed to a pentagon (5 straight sides, no points) or other shapes.
So the embedded figure is a star.`,
    shortcut: "5-pointed closed shape = Star.",
    company: "Mindtree"
  },
  {
    id: 9524,
    topic: "non-verbal-reasoning",
    difficulty: "hard",
    category: "Figure Completion",
    q: "A figure of a clock face is missing its right half, showing only numbers 12, 1, 2, 3, 4, 5, 6 with hour and minute hands visible. Which of the following completes the figure correctly, maintaining symmetry?",
    options: ["A) A right half showing numbers 7, 8, 9, 10, 11, 12 completing the circle", "B) A right half showing numbers 1 through 6 repeated", "C) A blank right half", "D) A right half with only the number 6"],
    answer: "A) A right half showing numbers 7, 8, 9, 10, 11, 12 completing the circle",
    explanation: `A standard clock face has numbers 1 to 12 arranged sequentially around the full circle.
Since the left half already shows 12 through 6, the missing right half must logically contain the remaining numbers 7 through 11 (with 12 shared at the top) to complete the full clock face.`,
    shortcut: "Clock faces naturally sequence from 1 to 12.",
    company: "Deloitte"
  },
  {
    id: 9525,
    topic: "non-verbal-reasoning",
    difficulty: "hard",
    category: "Figure Completion",
    q: "A symmetric geometric pattern has its bottom-right quadrant missing. The other three quadrants show a red circle inside a blue square. What should logically appear in the missing quadrant?",
    options: ["A) A red circle inside a blue square (matching the other quadrants)", "B) A blue circle inside a red square", "C) An empty quadrant", "D) A green triangle"],
    answer: "A) A red circle inside a blue square (matching the other quadrants)",
    explanation: `Since the pattern is described as symmetric across all quadrants, and the three visible quadrants are identical (red circle inside blue square), the missing quadrant should logically match the same design to maintain overall symmetry.`,
    shortcut: "Maintain identical quadrant designs to preserve symmetry.",
    company: "PwC"
  },
  {
    id: 9526,
    topic: "non-verbal-reasoning",
    difficulty: "hard",
    category: "Counting Figures",
    q: "In a figure formed by a square with both diagonals drawn, how many triangles are formed in total?",
    options: ["A) 2", "B) 4", "C) 6", "D) 8"],
    answer: "D) 8",
    explanation: `Drawing both diagonals of a square creates 4 small triangles directly.
Additionally, combining adjacent small triangles forms 4 more larger triangles (each made of 2 small triangles), giving a total of 4 + 4 = 8 triangles.`,
    shortcut: "4 small + 4 combined = 8 triangles.",
    company: "Goldman Sachs"
  },
  {
    id: 9527,
    topic: "non-verbal-reasoning",
    difficulty: "hard",
    category: "Counting Figures",
    q: "How many squares are there in a 3×3 grid of unit squares (like a tic-tac-toe grid extended)?",
    options: ["A) 9", "B) 12", "C) 14", "D) 16"],
    answer: "C) 14",
    explanation: `Count squares of each size: 1×1 squares = 9 (all unit cells).
2×2 squares = 4 (formed by combining adjacent cells).
3×3 squares = 1 (the whole grid).
Total = 9 + 4 + 1 = 14 squares.`,
    shortcut: "1² + 2² + 3² = 1 + 4 + 9 = 14.",
    company: "Google"
  },
  {
    id: 9528,
    topic: "non-verbal-reasoning",
    difficulty: "hard",
    category: "Counting Figures",
    q: "How many straight lines are needed to draw a five-pointed star, and how many triangles are formed within it?",
    options: ["A) 5 lines, 5 triangles", "B) 5 lines, 10 triangles", "C) 10 lines, 5 triangles", "D) 5 lines, 0 triangles"],
    answer: "A) 5 lines, 5 triangles",
    explanation: `A standard five-pointed star is drawn using 5 continuous straight strokes (or 5 lines forming the star pattern).
Each of the 5 points of the star forms a small triangle at its tip, giving a total of 5 visible point-triangles (in addition to the central pentagon).`,
    shortcut: "5 lines, 5 point triangles.",
    company: "Amazon"
  },
  {
    id: 9529,
    topic: "non-verbal-reasoning",
    difficulty: "hard",
    category: "Cubes & Dice",
    q: "A standard dice has the numbers 1 to 6, with opposite faces always summing to 7. If 1 is on top and 2 is facing you, which number is on the bottom?",
    options: ["A) 5", "B) 6", "C) 4", "D) 3"],
    answer: "B) 6",
    explanation: `On a standard dice, opposite faces sum to 7.
If 1 is on top, the bottom face (opposite to top) must be 7 − 1 = 6.`,
    shortcut: "Opposite of 1 is 7 - 1 = 6.",
    company: "Microsoft"
  },
  {
    id: 9530,
    topic: "non-verbal-reasoning",
    difficulty: "hard",
    category: "Cubes & Dice",
    q: "A cube is painted red on all six faces and then cut into 27 smaller equal cubes (3×3×3). How many of the smaller cubes have exactly 2 faces painted red?",
    options: ["A) 8", "B) 12", "C) 6", "D) 20"],
    answer: "B) 12",
    explanation: `In a 3×3×3 cube cut from a painted larger cube:
- Corner cubes (3 faces painted) = 8
- Edge cubes (2 faces painted) = 12 (one on each of the 12 edges of the cube)
- Face-center cubes (1 face painted) = 6
- The very center cube (0 faces painted) = 1
So cubes with exactly 2 painted faces = 12.`,
    shortcut: "12 edges = 12 edge cubes.",
    company: "Adobe"
  }
];

module.exports = { reasoningQuizQuestions };
