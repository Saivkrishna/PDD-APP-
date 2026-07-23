const aptitudeData = {
  "time-work": {
    title: "Time & Work",
    icon: "⏱️",
    items: [
      {
        id: "tw-basic",
        name: "1. Basic Formula",
        formula: "Work (W) = Rate (r) × Time (t) <br/> Rate (n) = Work / Time",
        note: "Work = Constant (for the same question)"
      },
      {
        id: "tw-lcm",
        name: "2. LCM Method (Most Important)",
        formula: "Commonly used to find combined rates by taking the LCM of individual times as Total Work.",
        example: {
          q: "A can do a work in 10 days, B in 20 days. Find time taken by A + B.",
          steps: [
            "LCM of 10 & 20 = 20 units (Total Work)",
            "A's 1 day work = 20 / 10 = 2 units/day",
            "B's 1 day work = 20 / 20 = 1 unit/day",
            "A + B work per day = 2 + 1 = 3 units/day",
            "Total Time taken = Total Work / Combined Rate = 20 / 3 days"
          ],
          ans: "20/3 days"
        }
      },
      {
        id: "tw-three-person",
        name: "3. Three Person Concept",
        formula: "Extension of LCM method for three working entities.",
        example: {
          q: "A = 15 days, B = 20 days, A+B+C = 8 days. Find C alone.",
          steps: [
            "LCM of 15, 20, 8 = 120 units (Total Work)",
            "A's rate = 120 / 15 = 8 units/day",
            "B's rate = 120 / 20 = 6 units/day",
            "Combined rate of A+B+C = 120 / 8 = 15 units/day",
            "C's rate alone = Combined - A's - B's = 15 - (8 + 6) = 1 unit/day",
            "Time taken by C = 120 / 1 = 120 days"
          ],
          ans: "120 days"
        }
      },
      {
        id: "tw-leaving-midway",
        name: "4. Leaving Midway",
        formula: "Calculate the work completed before departure, then solve for the remaining work.",
        example: {
          q: "A = 10 days, B = 20 days. They work for 4 days, then B leaves. Find remaining time by A.",
          steps: [
            "LCM of 10 & 20 = 20 units (Total Work)",
            "A's rate = 2 units/day, B's rate = 1 unit/day",
            "Combined rate = 3 units/day",
            "Work done in 4 days = 3 units/day × 4 days = 12 units",
            "Remaining work = 20 - 12 = 8 units",
            "Time taken by A to complete remaining = 8 units / 2 units/day = 4 days"
          ],
          ans: "4 days"
        }
      },
      {
        id: "tw-manday",
        name: "5. Man × Day = Work",
        formula: "Men × Days = Constant <br/> M₁D₁ = M₂D₂",
        example: {
          q: "25 men can do a work in 12 days. In how many days can 30 men do it?",
          steps: [
            "Using formula: M₁D₁ = M₂D₂",
            "25 × 12 = 30 × x",
            "x = (25 × 12) / 30 = 300 / 30 = 10 days"
          ],
          ans: "10 days"
        }
      },
      {
        id: "tw-men-women",
        name: "6. Men & Women Problems",
        formula: "Find the work rate of each category based on combined efficiency equations.",
        example: {
          q: "15 men + 20 women take 10 days. 24 men + 32 women take how many days?",
          steps: [
            "Let rate of 1 man = 2 units, 1 woman = 1 unit",
            "Team-1 work rate = (15 × 2 + 20 × 1) = 50 units/day",
            "Team-2 work rate = (24 × 2 + 32 × 1) = 80 units/day",
            "Total Work = Team-1 rate × 10 days = 50 × 10 = 500 units",
            "Days for Team-2 = 500 / 80 = 6.25 days"
          ],
          ans: "6.25 days"
        }
      },
      {
        id: "tw-mdh",
        name: "7. Concept of MDH (Man × Day × Hours)",
        formula: "Work = M × D × H",
        example: {
          q: "A works 6 days, 5 hrs/day. B works 15 days, 3 hrs/day. Find time for A + B.",
          steps: [
            "Total hours for A = 6 × 5 = 30 hours",
            "Total hours for B = 15 × 3 = 45 hours",
            "LCM of 30 & 45 = 90 units (Total Work)",
            "A's rate = 90 / 30 = 3 units/hour",
            "B's rate = 90 / 45 = 2 units/hour",
            "Combined rate = 5 units/hour",
            "Total hours for A + B = 90 / 5 = 18 hours"
          ],
          ans: "18 hours"
        }
      },
      {
        id: "tw-efficiency",
        name: "8. Efficiency Concept",
        formula: "Rate of work is inversely proportional to time taken.",
        note: "If A is 60% more efficient than B: <br/> Rate ratio A : B = 160 : 100 = 8 : 5 <br/> Time ratio A : B = 5 : 8"
      },
      {
        id: "tw-alternate-days",
        name: "9. Alternate Days",
        formula: "Cycle-based rate calculations.",
        example: {
          q: "A = 20 days, B = 30 days. They work on alternate days starting with A. Find total time.",
          steps: [
            "LCM of 20 & 30 = 60 units (Total Work)",
            "A's rate = 3 units/day, B's rate = 2 units/day",
            "1st day (A) = 3 units, 2nd day (B) = 2 units",
            "Work done in 1 cycle (2 days) = 5 units",
            "Cycles needed = 60 / 5 = 12 cycles",
            "Total time = 12 cycles × 2 days/cycle = 24 days"
          ],
          ans: "24 days"
        }
      },
      {
        id: "tw-cats-rats",
        name: "10. Strange Question (Cats & Rats)",
        formula: "Same Ratio yields same time duration under uniform rate.",
        example: {
          q: "If 100 cats kill 100 rats in 100 days, how many days will 10 cats take to kill 10 rats?",
          steps: [
            "Since the ratio of cats to rats remains the same (1:1), and individual efficiency is constant, the time remains the SAME."
          ],
          ans: "100 days"
        }
      }
    ]
  },
  "averages": {
    title: "Average Formulas",
    icon: "📊",
    items: [
      {
        id: "avg-basic",
        name: "1. Average",
        formula: "Average = Sum of all observations / Number of observations"
      },
      {
        id: "avg-first-n-natural",
        name: "2. Average of first n natural numbers",
        formula: "Average = (n + 1) / 2"
      },
      {
        id: "avg-natural-up-to-n",
        name: "3. Average of natural numbers up to n",
        formula: "Average = (n + 1) / 2"
      },
      {
        id: "avg-first-n-even-natural",
        name: "4. Average of first n even natural numbers",
        formula: "Average = n + 1",
        note: "Applies to numbers: 2, 4, 6, ..., 2n"
      },
      {
        id: "avg-first-n-odd-natural",
        name: "5. Average of first n odd natural numbers",
        formula: "Average = (n + 2) / 2",
        note: "Odd natural numbers up to n have formula: (n + 1) / 2"
      },
      {
        id: "avg-first-n-odd",
        name: "6. Average of first n odd numbers",
        formula: "Average = n",
        note: "Applies to numbers: 1, 3, 5, ..., 2n-1"
      },
      {
        id: "avg-first-n-even",
        name: "7. Average of first n even numbers",
        formula: "Average = n + 1"
      },
      {
        id: "avg-squares-first-n",
        name: "8. Average of squares of first n natural numbers",
        formula: "Average = (n + 1)(2n + 1) / 6",
        note: "Sum is n(n + 1)(2n + 1) / 6"
      },
      {
        id: "avg-cubes-first-n",
        name: "9. Average of cubes of first n natural numbers",
        formula: "Average = n(n + 1)² / 4",
        note: "Sum is [n(n + 1) / 2]²"
      },
      {
        id: "avg-even-observations",
        name: "10. If the number of observations is even",
        formula: "Average = (First middle term + Last middle term) / 2"
      },
      {
        id: "avg-change-quantity",
        name: "11. Change in value of a quantity",
        formula: "Change = (New Average × New Number of Observations) - (Old Average × Old Number of Observations)"
      },
      {
        id: "avg-new-avg",
        name: "12. New Average",
        formula: "New Average = New Total Sum / New Number of Observations"
      }
    ]
  },
  "profit-loss": {
    title: "Profit & Loss",
    icon: "💰",
    items: [
      {
        id: "pl-basic-terms",
        name: "1. Basic Terms",
        formula: "CP = Cost Price, SP = Selling Price, MP = Marked Price <br/> Profit = SP - CP <br/> Loss = CP - SP"
      },
      {
        id: "pl-percentages",
        name: "2. Profit & Loss Percentage",
        formula: "Profit % = (Profit / CP) × 100 <br/> Loss % = (Loss / CP) × 100 <br/> SP = CP × (1 + P/100) [for Profit] <br/> SP = CP × (1 - L/100) [for Loss]"
      },
      {
        id: "pl-sp-profit-given",
        name: "3. When SP & Profit % Given",
        example: {
          q: "Profit = 20%, SP = 600. Find CP.",
          steps: [
            "CP = SP × 100 / (100 + P%)",
            "CP = 600 × 100 / 120 = 500"
          ],
          ans: "500"
        }
      },
      {
        id: "pl-cp-loss-given",
        name: "4. When CP & Loss % Given",
        example: {
          q: "Loss = 25%, CP = 800. Find SP.",
          steps: [
            "SP = CP × (100 - L%) / 100",
            "SP = 800 × 75 / 100 = 600"
          ],
          ans: "600"
        }
      },
      {
        id: "pl-mp-discount",
        name: "5. Marked Price & Discount",
        formula: "Discount = MP - SP <br/> Discount % = (Discount / MP) × 100 <br/> SP = MP × (1 - d/100)"
      },
      {
        id: "pl-successive-discount",
        name: "6. Successive Discounts",
        formula: "Net discount % = a + b - ab/100",
        example: {
          q: "Find single equivalent discount for successive discounts of 20% & 10%.",
          steps: [
            "Net discount = 20 + 10 - (20 × 10)/100 = 30 - 2 = 28%"
          ],
          ans: "28%"
        }
      },
      {
        id: "pl-profit-discount",
        name: "7. Profit with Discount (Important)",
        example: {
          q: "MP = 1000, Discount = 20%, Profit = 25%. Find CP.",
          steps: [
            "SP = MP × (100 - D%)/100 = 1000 × 0.8 = 800",
            "CP = SP × 100 / (100 + P%) = 800 × 100 / 125 = 640"
          ],
          ans: "640"
        }
      },
      {
        id: "pl-false-weight",
        name: "8. False Weight Problem",
        formula: "Profit % = (Weight difference / Actual weight) × 100",
        example: {
          q: "A trader uses a false weight of 900g instead of 1kg. Find Profit %.",
          steps: [
            "Weight difference = 1000g - 900g = 100g",
            "Actual weight sold = 900g",
            "Profit % = (100 / 900) × 100 = 100/9 = 11.11%"
          ],
          ans: "11.11% (or 11 1/9 %)"
        }
      },
      {
        id: "pl-gain-loss-same",
        name: "9. Gain & Loss on Same Item",
        formula: "Net Loss % = a² / (100 + a)² × 100",
        note: "If an item is marked up and then discounted by the same percentage, it results in a loss.",
        example: {
          q: "Gain 10% on one transaction, Loss 10% on another equivalent level. Find net result.",
          steps: [
            "Net loss % = 10² / (100 + 10)² × 100 = 100 / 12100 × 100 = 0.83% loss"
          ],
          ans: "0.83% loss"
        }
      },
      {
        id: "pl-equal-sp",
        name: "10. Equal Selling Price Case",
        formula: "Net loss % = a² / 100",
        note: "Always results in a loss when two articles are sold at the same price, one at a% profit and other at a% loss.",
        example: {
          q: "Two articles sold at ₹100 each. One at 20% gain, another at 20% loss. Find net gain/loss.",
          steps: [
            "Net loss % = 20² / 100 = 400 / 100 = 4% loss"
          ],
          ans: "4% loss"
        }
      },
      {
        id: "pl-buy-x-get-y",
        name: "11. Buy x Get y Free",
        formula: "Effective discount % = [y / (x + y)] × 100",
        example: {
          q: "Buy 2 get 1 free. Find the effective discount percentage.",
          steps: [
            "y (free items) = 1, x (paid items) = 2",
            "Total items = 3",
            "Discount % = (1 / 3) × 100 = 33.33%"
          ],
          ans: "33.33% (or 33 1/3 %)"
        }
      },
      {
        id: "pl-above-below-cp",
        name: "12. Selling Above & Below CP",
        example: {
          q: "Selling an item at 20% profit instead of 10% profit yields ₹100 extra. Find CP.",
          steps: [
            "Difference in profit % = 20% - 10% = 10%",
            "10% of CP = 100",
            "CP = 100 × 100 / 10 = 1000"
          ],
          ans: "1000"
        }
      },
      {
        id: "pl-partnership",
        name: "13. Partnership Link (Important)",
        formula: "Profit ∝ Investment × Time <br/> Ratio of profits = I₁T₁ : I₂T₂"
      }
    ]
  },
  "percentages": {
    title: "Percentages",
    icon: "📈",
    note: "Fraction to Percentage Conversions",
    columns: [
      [
        { fraction: "1/3", percentage: "33.33%" },
        { fraction: "2/3", percentage: "66.66%" },
        { fraction: "1/4", percentage: "25%" },
        { fraction: "2/4", percentage: "50%" },
        { fraction: "3/4", percentage: "75%" },
        { fraction: "1/5", percentage: "20%" },
        { fraction: "2/5", percentage: "40%" },
        { fraction: "3/5", percentage: "60%" },
        { fraction: "4/5", percentage: "80%" },
        { fraction: "1/6", percentage: "16.66%" },
        { fraction: "2/6", percentage: "33.33%" },
        { fraction: "3/6", percentage: "50%" },
        { fraction: "4/6", percentage: "66.66%" }
      ],
      [
        { fraction: "5/6", percentage: "83.33%" },
        { fraction: "1/7", percentage: "14.28%" },
        { fraction: "2/7", percentage: "28.56%" },
        { fraction: "3/7", percentage: "42.84%" },
        { fraction: "4/7", percentage: "57.14%" },
        { fraction: "5/7", percentage: "71.42%" },
        { fraction: "6/7", percentage: "85.71%" },
        { fraction: "1/8", percentage: "12.5%" },
        { fraction: "2/8", percentage: "25%" },
        { fraction: "3/8", percentage: "37.5%" },
        { fraction: "4/8", percentage: "50%" },
        { fraction: "5/8", percentage: "62.5%" },
        { fraction: "6/8", percentage: "75%" }
      ],
      [
        { fraction: "7/8", percentage: "87.50%" },
        { fraction: "1/9", percentage: "11.11%" },
        { fraction: "2/9", percentage: "22.22%" },
        { fraction: "3/9", percentage: "33.33%" },
        { fraction: "4/9", percentage: "44.44%" },
        { fraction: "5/9", percentage: "55.55%" },
        { fraction: "6/9", percentage: "66.66%" },
        { fraction: "7/9", percentage: "77.77%" },
        { fraction: "8/9", percentage: "88.88%" },
        { fraction: "1/11", percentage: "9.09%" },
        { fraction: "2/11", percentage: "18.18%" },
        { fraction: "3/11", percentage: "27.27%" },
        { fraction: "4/11", percentage: "36.36%" }
      ],
      [
        { fraction: "5/11", percentage: "45.45%" },
        { fraction: "6/11", percentage: "54.54%" },
        { fraction: "7/11", percentage: "63.63%" },
        { fraction: "8/11", percentage: "72.72%" },
        { fraction: "9/11", percentage: "81.81%" },
        { fraction: "10/11", percentage: "90.90%" },
        { fraction: "1/12", percentage: "8.33%" },
        { fraction: "1/13", percentage: "7.69%" },
        { fraction: "1/14", percentage: "7.14%" },
        { fraction: "1/15", percentage: "6.66%" },
        { fraction: "1/16", percentage: "6.25%" },
        { fraction: "1/24", percentage: "4.16%" },
        { fraction: "1/40", percentage: "2.50%" }
      ]
    ]
  },
  "ratio-proportion": {
    title: "Ratio & Prop",
    icon: "⚖️",
    items: [
      {
        id: "rp-basic-defs",
        name: "1. Basic Definitions",
        formula: "Ratio = Comparison of two quantities of same kind. a : b = a/b <br/> Proportion: a : b :: c : d => a/b = c/d => ad = bc"
      },
      {
        id: "rp-properties",
        name: "2. Properties of Ratio",
        formula: "• a : b = ka : kb <br/> • a : b = a/k : b/k <br/> • a : b = b : a (inverse ratio)"
      },
      {
        id: "rp-continued",
        name: "3. Continued Ratio",
        formula: "a : b = m : n, b : c = p : q => a : b : c = mp : np : nq"
      },
      {
        id: "rp-compound",
        name: "4. Compound Ratio",
        formula: "(a : b) × (c : d) = ac : bd"
      },
      {
        id: "rp-divide-qty",
        name: "5. Dividing a Quantity in a Given Ratio",
        formula: "Sum = S, ratio = a : b <br/> First part = S × a/(a+b) <br/> Second part = S × b/(a+b)",
        example: {
          q: "Divide 300 in ratio 2 : 3.",
          steps: [
            "Total parts = 2 + 3 = 5",
            "1 part value = 300 / 5 = 60",
            "First part = 2 × 60 = 120",
            "Second part = 3 × 60 = 180"
          ],
          ans: "120 & 180"
        }
      },
      {
        id: "rp-diff-given",
        name: "6. When Difference is Given",
        example: {
          q: "a : b = 3 : 5, difference = 20. Find a & b.",
          steps: [
            "Let a = 3x, b = 5x",
            "Difference = 5x - 3x = 20 => 2x = 20 => x = 10",
            "a = 3 × 10 = 30",
            "b = 5 × 10 = 50"
          ],
          ans: "a = 30, b = 50"
        }
      },
      {
        id: "rp-multiple-ratios",
        name: "7. Multiple Ratios",
        example: {
          q: "a : b = 2 : 3, b : c = 4 : 5. Find a : b : c.",
          steps: [
            "LCM of common term b (3 and 4) = 12",
            "Multiply first ratio by 4: a : b = 8 : 12",
            "Multiply second ratio by 3: b : c = 12 : 15",
            "Combined ratio: a : b : c = 8 : 12 : 15"
          ],
          ans: "8 : 12 : 15"
        }
      },
      {
        id: "rp-sum-given-3-terms",
        name: "8. When Sum is Given (3 Terms)",
        example: {
          q: "a : b : c = 3 : 4 : 5, Sum = 240. Find a, b, c.",
          steps: [
            "Total parts = 3 + 4 + 5 = 12",
            "1 part value = 240 / 12 = 20",
            "a = 3 × 20 = 60",
            "b = 4 × 20 = 80",
            "c = 5 × 20 = 100"
          ],
          ans: "a = 60, b = 80, c = 100"
        }
      },
      {
        id: "rp-comparison-type",
        name: "9. Comparison Type",
        example: {
          q: "If a : b = 3 : 2, find (4a + 5b) : (5a - 2b).",
          steps: [
            "Substitute direct ratio values a = 3, b = 2",
            "Numerator = 4(3) + 5(2) = 12 + 10 = 22",
            "Denominator = 5(3) - 2(2) = 15 - 4 = 11",
            "Ratio = 22 / 11 = 2 : 1"
          ],
          ans: "2 : 1"
        }
      },
      {
        id: "rp-proportional-division",
        name: "10. Proportional Division",
        formula: "If x ∝ y => x/y = constant",
        example: {
          q: "If x : y = 5 : 7 and x + y = 144. Find x & y.",
          steps: [
            "Total parts = 5 + 7 = 12",
            "1 part = 144 / 12 = 12",
            "x = 5 × 12 = 60",
            "y = 7 × 12 = 84"
          ],
          ans: "x = 60, y = 84"
        }
      },
      {
        id: "rp-identities",
        name: "11. Important Identities",
        formula: "If a : b = m : n: <br/> • (a + b) : (a - b) = (m + n) : (m - n) <br/> • (a² - b²) : (ab) = (m² - n²) : (mn)"
      },
      {
        id: "rp-mixed-power",
        name: "12. Mixed Power Ratios",
        example: {
          q: "If a : b = 2 : 3. Find a² : b² and √a : √b.",
          steps: [
            "a² : b² = 2² : 3² = 4 : 9",
            "√a : √b = √2 : √3"
          ],
          ans: "4:9 & √2:√3"
        }
      },
      {
        id: "rp-variation",
        name: "13. Variation",
        formula: "Direct Variation: x ∝ y => x = ky <br/> Inverse Variation: x ∝ 1/y => xy = k"
      },
      {
        id: "rp-shortcuts",
        name: "14. Important Shortcuts",
        formula: "• Always convert to same units before setting ratio <br/> • Use direct substitution for homogeneous degree expressions <br/> • If degrees of terms differ, exact ratio cannot be determined directly without absolute values <br/> • The LCM trick is highly effective for chaining multiple individual ratios quickly"
      },
      {
        id: "rp-mistakes",
        name: "15. Common Mistakes",
        formula: "• Ignoring mismatching unit dimensions <br/> • Utilizing standard LCM values incorrectly in chain ratio equations <br/> • Blending sum and difference calculation logic parameters <br/> • Neglecting unit division steps in divisibility tests"
      }
    ]
  },
  "squares": {
    title: "Square Numbers",
    icon: "🔢",
    note: "Perfect Square Values from 1 to 100"
  },
  "probability": {
    title: "Probability",
    icon: "🎲",
    items: [
      {
        id: "prob-basic",
        name: "1. Basic Definition",
        formula: "P(E) = Number of favourable outcomes / Total number of outcomes"
      },
      {
        id: "prob-sample-space",
        name: "2. Sample Space",
        formula: "Sample space (S) → Set of all possible outcomes",
        note: "• Tossing a coin → S = {H, T} <br/> • Rolling a die → S = {1, 2, 3, 4, 5, 6}"
      },
      {
        id: "prob-range",
        name: "3. Range of Probability",
        formula: "0 ≤ P(E) ≤ 1",
        note: "• P(E) = 0 → Impossible event <br/> • P(E) = 1 → Certain event"
      },
      {
        id: "prob-complementary",
        name: "4. Complementary Events",
        formula: "P(E') = 1 - P(E)",
        example: {
          q: "Probability of NOT getting a head in tossing a coin.",
          steps: [
            "P(H) = 1/2",
            "P(Not H) = 1 - P(H) = 1 - 1/2 = 1/2"
          ],
          ans: "1/2"
        }
      },
      {
        id: "prob-addition",
        name: "5. Addition Theorem",
        formula: "P(A ∪ B) = P(A) + P(B) - P(A ∩ B) <br/> Mutually Exclusive Events (A ∩ B = Ø): <br/> P(A ∪ B) = P(A) + P(B)"
      },
      {
        id: "prob-independent",
        name: "6. Independent Events",
        formula: "Two events A and B are independent if: <br/> P(A ∩ B) = P(A) × P(B)",
        example: {
          q: "Probability of getting two heads when tossing two coins.",
          steps: [
            "P(H for coin 1) = 1/2",
            "P(H for coin 2) = 1/2",
            "P(HH) = 1/2 × 1/2 = 1/4"
          ],
          ans: "1/4"
        }
      },
      {
        id: "prob-conditional",
        name: "7. Conditional Probability",
        formula: "P(A|B) = P(A ∩ B) / P(B)",
        note: "Probability of A given B has occurred."
      },
      {
        id: "prob-bayes",
        name: "8. Bayes' Theorem",
        formula: "P(A_i|B) = [P(A_i)P(B|A_i)] / [Σ P(A_j)P(B|A_j)]",
        note: "Always draw a tree diagram for exclusive events"
      },
      {
        id: "prob-cards",
        name: "9. Probability in Cards",
        formula: "Total Cards = 52. Red (26): Hearts 13, Diamonds 13. Black (26): Spades 13, Clubs 13. <br/> Face cards = 12, Kings = 4, Queens = 4, Jacks = 4, Aces = 4",
        example: {
          q: "What is the probability of drawing a King from a well-shuffled deck?",
          steps: [
            "Favourable outcomes (Kings) = 4",
            "Total outcomes = 52",
            "P = 4 / 52 = 1 / 13"
          ],
          ans: "1/13"
        }
      },
      {
        id: "prob-dice",
        name: "10. Probability in Dice",
        formula: "• 1 die → 6 outcomes <br/> • 2 dice → 36 outcomes",
        example: {
          q: "In rolling two dice, find the probability that the sum of the faces is 7.",
          steps: [
            "Total outcomes = 36",
            "Favourable outcomes for sum 7: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1)",
            "Number of favourable outcomes = 6",
            "P = 6 / 36 = 1 / 6"
          ],
          ans: "1/6"
        }
      },
      {
        id: "prob-coins",
        name: "11. Probability in Coins",
        formula: "• 1 coin → 2 outcomes <br/> • 2 coins → 4 outcomes <br/> • 3 coins → 8 outcomes",
        example: {
          q: "What is the probability of getting exactly 2 heads in 3 tosses of a coin?",
          steps: [
            "Total outcomes = 8: {HHH, HHT, HTH, HTT, THH, THT, TTH, TTT}",
            "Favourable outcomes (exactly 2 heads): {HHT, HTH, THH}",
            "P = 3 / 8"
          ],
          ans: "3/8"
        }
      },
      {
        id: "prob-least-most",
        name: "12. At Least / At Most Concept",
        formula: '\"At least one\" = 1 - P(None)',
        example: {
          q: "Find the probability of getting at least one head in 2 coin tosses.",
          steps: [
            "At least one head = 1 - P(No heads, i.e. TT)",
            "P(TT) = 1/4",
            "P = 1 - 1/4 = 3/4"
          ],
          ans: "3/4"
        }
      },
      {
        id: "prob-shortcuts",
        name: "13. Important Shortcuts",
        formula: "• Use complement logic for \"at least\" queries <br/> • Independent events require multiplication of individual probabilities <br/> • Mutually exclusive outcomes require addition <br/> • Always write down the sample space diagram for minor sets"
      },
      {
        id: "prob-mistakes",
        name: "14. Common Mistakes",
        formula: "• Forgetting to account for total outcomes <br/> • Confusing independent and mutually exclusive characteristics <br/> • Failing to subtract the intersection when calculating the union"
      }
    ]
  },
  "interest": {
    title: "Interest (SI/CI)",
    icon: "📈",
    items: [
      {
        id: "int-basic",
        name: "1. Basic Terms",
        formula: "P = Principal, R = Rate of Interest (% p.a.), T = Time (yrs) <br/> SI = Simple Interest, CI = Compound Interest, A = Amount"
      },
      {
        id: "int-si",
        name: "2. Simple Interest (SI)",
        formula: "SI = (P × R × T) / 100 <br/> Amount (A) = P + SI",
        example: {
          q: "P = ₹1000, R = 10%, T = 2 years. Find SI and Amount.",
          steps: [
            "SI = (1000 × 10 × 2) / 100 = 200",
            "Amount = 1000 + 200 = 1200"
          ],
          ans: "SI = 200, Amount = 1200"
        }
      },
      {
        id: "int-si-shortcut",
        name: "3. Shortcut Method (SI)",
        formula: "Interest for 1 year = R% of P <br/> Interest for T years = T × (R% of P)"
      },
      {
        id: "int-amount-diff-times",
        name: "4. When Amount Given at Different Times (SI)",
        example: {
          q: "Amount after 3 yrs = ₹900, Amount after 6 yrs = ₹1200. Find P & R.",
          steps: [
            "Interest for 3 yrs = 1200 - 900 = ₹300",
            "Interest for 1 yr = 300 / 3 = ₹100",
            "Principal P = Amount (3 yrs) - Interest (3 yrs) = 900 - (3 × 100) = ₹600",
            "Rate R = (Interest for 1 yr / P) × 100 = (100 / 600) × 100 = 16.66%"
          ],
          ans: "P = 600, R = 16 2/3 %"
        }
      },
      {
        id: "int-double-si",
        name: "5. Time for Money to Double (SI)",
        formula: "T = 100 / R"
      },
      {
        id: "int-ci",
        name: "6. Compound Interest (CI)",
        formula: "Amount (A) = P × (1 + R/100)^T <br/> CI = A - P",
        example: {
          q: "P = 1000, R = 10%, T = 2. Find CI.",
          steps: [
            "A = 1000 × (1 + 10/100)² = 1000 × (1.1)² = 1210",
            "CI = 1210 - 1000 = 210"
          ],
          ans: "210"
        }
      },
      {
        id: "int-half-quarter",
        name: "7. Half-Yearly / Quarterly Compounding",
        formula: "• Half-Yearly: Rate = R/2, Time = 2T => A = P × (1 + R/200)^(2T) <br/> • Quarterly: Rate = R/4, Time = 4T => A = P × (1 + R/400)^(4T)"
      },
      {
        id: "int-diff-cisi",
        name: "8. Difference between CI & SI (Important)",
        formula: "For 2 years: CI - SI = P × (R/100)²",
        example: {
          q: "Difference for 2 years = ₹25, R = 10%. Find P.",
          steps: [
            "P = [Difference × 100²] / R²",
            "P = [25 × 10000] / 100 = 2500"
          ],
          ans: "2500"
        }
      },
      {
        id: "int-multiple-ci",
        name: "9. When Money Becomes Multiple Times (CI)",
        formula: "If money doubles (2P) in T years, it becomes 2^k times in k × T years.",
        example: {
          q: "If money doubles in T years, how long does it take to become 8 times?",
          steps: [
            "8 times = 2³ times",
            "Using formula: new time = 3 × T"
          ],
          ans: "3 × T"
        }
      },
      {
        id: "int-comp",
        name: "10. Comparison: SI vs CI",
        formula: "• CI > SI (always, except T = 1 year where they are equal) <br/> • The difference between CI and SI increases as time increases <br/> • CI grows exponentially, whereas SI grows linearly"
      },
      {
        id: "int-shortcuts",
        name: "11. Important Shortcuts",
        formula: "• SI yields linear growth, CI yields exponential growth <br/> • Use difference formulas for 2-year questions to save calculations <br/> • Ensure months are carefully converted to years (e.g. 9 months = 3/4 year)"
      }
    ]
  },
  "number-system": {
    title: "Number System",
    icon: "🔢",
    items: [
      {
        id: "num-types",
        name: "1. Types of Numbers",
        formula: "• Natural (N): 1, 2, 3... <br/> • Whole (W): 0, 1, 2, 3... <br/> • Integers (Z): ...-3, -2, -1, 0, 1, 2... <br/> • Rational (Q): P/q, q ≠ 0 <br/> • Irrational: √2, √3, π <br/> • Real (R): Rational + Irrational"
      },
      {
        id: "num-even-odd",
        name: "2. Even & Odd Numbers",
        formula: "Even = 2n, Odd = 2n + 1",
        note: "• Even + Even = Even <br/> • Odd + Odd = Even <br/> • Even + Odd = Odd <br/> • Odd × Odd = Odd <br/> • Even × Any = Even"
      },
      {
        id: "num-prime-comp",
        name: "3. Prime & Composite Numbers",
        formula: "• Prime → Exactly 2 factors (1 and itself) <br/> • Composite → More than 2 factors",
        note: "Smallest prime = 2, only even prime = 2"
      },
      {
        id: "num-factors",
        name: "4. Factors & Multiples",
        formula: "If n = p^a × q^b × r^c (prime factorization): <br/> Total factors = (a + 1)(b + 1)(c + 1)"
      },
      {
        id: "num-hcf-lcm",
        name: "5. HCF & LCM",
        formula: "HCF = Lowest power of common primes <br/> LCM = Highest power of all primes <br/> HCF × LCM = Product of two numbers",
        example: {
          q: "If HCF = 12, LCM = 360, and numbers are 12x, 12y. Solve xy relationship.",
          steps: [
            "We know: 12x × 12y = 12 × 360",
            "144xy = 4320",
            "xy = 30"
          ],
          ans: "xy = 30"
        }
      },
      {
        id: "num-divisibility",
        name: "6. Divisibility Rules",
        formula: "• 2: Last digit even <br/> • 3: Sum of digits divisible by 3 <br/> • 4: Last 2 digits divisible by 4 <br/> • 5: Last digit 0 or 5 <br/> • 6: Divisible by 2 & 3 <br/> • 8: Last 3 digits divisible by 8 <br/> • 9: Sum of digits divisible by 9 <br/> • 11: (Sum of odd place - Sum of even place) is divisible by 11"
      },
      {
        id: "num-remainder",
        name: "7. Remainder Theorem",
        formula: "If n divided by d gives remainder r: n = dq + r",
        example: {
          q: "Find remainder when 7^25 is divided by 6.",
          steps: [
            "Write 7 as 6 + 1",
            "7 ≡ 1 (mod 6)",
            "7^25 ≡ 1^25 ≡ 1 (mod 6)",
            "Remainder = 1"
          ],
          ans: "1"
        }
      },
      {
        id: "num-cyclicity",
        name: "8. Cyclicity (Last Digit)",
        formula: "Last digits repeat in cycles of 4: <br/> • 2 → 2, 4, 8, 6 <br/> • 3 → 3, 9, 7, 1 <br/> • 7 → 7, 9, 3, 1",
        example: {
          q: "Find last digit of 7^101.",
          steps: [
            "Divide power 101 by 4: remainder is 1",
            "Last digit = 7¹ = 7"
          ],
          ans: "7"
        }
      },
      {
        id: "num-find-hcflcm",
        name: "9. Finding Number using HCF & LCM",
        example: {
          q: "Two numbers have HCF = 6. If one number = 30 and LCM = 180. Find other.",
          steps: [
            "Using: Num1 × Num2 = HCF × LCM",
            "30 × Other = 6 × 180",
            "Other = (6 × 180) / 30 = 36"
          ],
          ans: "36"
        }
      },
      {
        id: "num-dec-to-frac",
        name: "10. Decimal to Fraction",
        example: {
          q: "Convert x = 0.333... to a fraction.",
          steps: [
            "Let x = 0.333...",
            "10x = 3.333...",
            "Subtract: 9x = 3",
            "x = 3/9 = 1/3"
          ],
          ans: "1/3"
        }
      },
      {
        id: "num-fractions",
        name: "11. Fractions",
        formula: "• Proper: numerator < denominator <br/> • Improper: numerator ≥ denominator <br/> • Mixed to Improper: a b/c = (ac + b) / c"
      },
      {
        id: "num-surds",
        name: "12. Surds",
        formula: "• √a × √b = √ab <br/> • √a / √b = √(a/b)"
      },
      {
        id: "num-simplification",
        name: "13. Simplification Tricks",
        formula: "• Always follow BODMAS rule order <br/> • Simplify decimal values to standard fraction ratios"
      }
    ]
  },
  "pipes-cisterns": {
    title: "Pipes & Cisterns",
    icon: "🚰",
    items: [
      {
        id: "pc-basic",
        name: "1. Basic Concept",
        formula: "Pipes & Cisterns is a Time & Work problem. <br/> • Tank Capacity = Work (W) <br/> • Filling pipe → Positive (+) <br/> • Emptying pipe → Negative (-) <br/> • Rate = Work / Time"
      },
      {
        id: "pc-unit",
        name: "2. Unit Method (Most Important)",
        example: {
          q: "Pipe A fills a tank in 10 hrs, B fills in 20 hrs. Find time together.",
          steps: [
            "LCM of 10 & 20 = 20 units (Total Capacity)",
            "A's rate = 20 / 10 = +2 units/hour",
            "B's rate = 20 / 20 = +1 unit/hour",
            "Combined rate = +3 units/hour",
            "Time = 20 / 3 hours"
          ],
          ans: "20/3 hours"
        }
      },
      {
        id: "pc-inlet-outlet",
        name: "3. Inlet & Outlet Together",
        example: {
          q: "A fills a tank in 10 hrs, B empties in 40 hrs. Find time together.",
          steps: [
            "LCM of 10 & 40 = 40 units (Total Capacity)",
            "A's rate = +4 units/hour, B's rate = -1 unit/hour",
            "Net rate = +3 units/hour",
            "Time = 40 / 3 hours"
          ],
          ans: "40/3 hours"
        }
      },
      {
        id: "pc-leak",
        name: "4. Leak in the Tank",
        example: {
          q: "A pipe fills a tank in 12 hrs, but due to a leak it takes 15 hrs. Find time to empty full tank.",
          steps: [
            "LCM of 12 & 15 = 60 units (Total Capacity)",
            "Normal rate = +5 units/hour",
            "Rate with leak = +4 units/hour",
            "Leak rate = 5 - 4 = 1 unit/hour (emptying)",
            "Time to empty = 60 / 1 = 60 hours"
          ],
          ans: "60 hours"
        }
      },
      {
        id: "pc-alternate",
        name: "5. Alternate Opening of Pipes",
        example: {
          q: "Pipe A fills in 10 hrs, B empties in 20 hrs. Opened alternately starting with A. Find total time.",
          steps: [
            "LCM of 10 & 20 = 20 units (Total Capacity)",
            "A = +2 units/hour, B = -1 unit/hour",
            "In 1 cycle (2 hours) = +1 unit filled",
            "Cycles required = 20 cycles",
            "Total time = 20 cycles × 2 hours/cycle = 40 cycles = 80 hours"
          ],
          ans: "80 hours"
        }
      },
      {
        id: "pc-two-fill-one-empty",
        name: "6. Two Pipes Filling, One Emptying",
        example: {
          q: "A fills in 10 hrs, B fills in 15 hrs, C empties in 30 hrs. Find time together.",
          steps: [
            "LCM of 10, 15, 30 = 30 units (Total Capacity)",
            "A's rate = +3 units/hour, B's rate = +2 units/hour, C's rate = -1 unit/hour",
            "Net combined rate = 3 + 2 - 1 = +4 units/hour",
            "Time = 30 / 4 = 7.5 hours"
          ],
          ans: "7.5 hours"
        }
      },
      {
        id: "pc-partial",
        name: "7. Partial Filling & Emptying",
        example: {
          q: "Tank filled in 8 hrs, but empties in 12 hrs. Find time to empty when half full.",
          steps: [
            "LCM of 8 & 12 = 24 units",
            "Half tank capacity = 12 units",
            "Emptying rate = 24 / 12 = 2 units/hour",
            "Time to empty = 12 / 2 = 6 hours"
          ],
          ans: "6 hours"
        }
      },
      {
        id: "pc-fractional",
        name: "8. Fractional Part Problems",
        example: {
          q: "A pipe fills 1/3 tank per hour, another empties 1/6 tank per hour. Find net time.",
          steps: [
            "Net rate = 1/3 - 1/6 = 1/6 tank/hour",
            "Time = 6 hours"
          ],
          ans: "6 hours"
        }
      },
      {
        id: "pc-shortcuts",
        name: "9. Shortcut Rules",
        formula: "• If filling rate > emptying rate → Tank fills <br/> • If emptying rate > filling rate → Tank never fills <br/> • Always define Total Capacity as LCM of times <br/> • Use negative sign for emptying / outlet rates"
      },
      {
        id: "pc-mistakes",
        name: "10. Common Mistakes",
        formula: "• Forgetting negative signs for outlet pipes <br/> • Mixing time values directly instead of using rates <br/> • Failing to use LCM methods for complex flows <br/> • Wrong unit conversions between hours/minutes"
      }
    ]
  }
};

export default aptitudeData;
