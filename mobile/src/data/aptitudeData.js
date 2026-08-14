const aptitudeData = {
  "lcm-hcf": {
    title: "LCM & HCF",
    icon: "🔢",
    items: [
      {
        id: "lh-factors",
        name: "1. Core Concepts (Factors & Multiples)",
        formula: "<b>• HCF (Highest Common Factor) / GCD:</b> The largest number that divides all given numbers exactly.<br/><b>• LCM (Least Common Multiple):</b> The smallest number divisible by all given numbers exactly.<br/><b>• Factors:</b> Divisors of a number (e.g., Factors of 12: 1, 2, 3, 4, 6, 12).<br/><b>• Multiples:</b> Numbers obtained by multiplying (e.g., Multiples of 3: 3, 6, 9, 12...)."
      },
      {
        id: "lh-fundamental-rules",
        name: "2. Important Formulae",
        formula: "<b>• Product Rule (Only for EXACTLY 2 numbers):</b> HCF(a, b) × LCM(a, b) = a × b<br/><b>• HCF of Fractions:</b> HCF of Numerators ÷ LCM of Denominators<br/><b>• LCM of Fractions:</b> LCM of Numerators ÷ HCF of Denominators<br/><b>• If HCF(a, b) = h:</b> Then a = h·p and b = h·q, where p and q are co-prime integers, and LCM = h·p·q.",
        example: {
          q: "The HCF of two numbers is 11 and their LCM is 693. If one of the numbers is 77, find the other.",
          steps: [
            "Apply the Product Rule: Number 1 × Number 2 = HCF × LCM",
            "77 × x = 11 × 693",
            "x = (11 × 693) / 77",
            "x = 693 / 7 = 99"
          ],
          ans: "99"
        }
      },
      {
        id: "lh-remainders",
        name: "3. Remainder & Division Rules",
        formula: "<b>• Greatest number dividing x, y, z leaving remainders r1, r2, r3:</b><br/>&nbsp;&nbsp;&nbsp;&nbsp;Answer = HCF(x − r1, y − r2, z − r3)<br/><b>• Greatest number dividing x, y, z leaving the SAME remainder (r) in each case:</b><br/>&nbsp;&nbsp;&nbsp;&nbsp;Answer = HCF(|x − y|, |y − z|, |x − z|)<br/><b>• Least number divisible by x, y, z leaving remainder r in each case:</b><br/>&nbsp;&nbsp;&nbsp;&nbsp;Answer = LCM(x, y, z) + r<br/><b>• Least number divisible by x, y, z leaving no remainder:</b><br/>&nbsp;&nbsp;&nbsp;&nbsp;Answer = LCM(x, y, z)"
      },
      {
        id: "lh-shortcuts",
        name: "4. Shortcut Tricks",
        formula: "<b>• Euclid's Division Algorithm (Fast HCF):</b> HCF(a, b) = HCF(b, a mod b), repeat until remainder is 0.<br/><b>• Remainder questions:</b> ALWAYS subtract the remainder FIRST, then take HCF/LCM — never take HCF/LCM of raw numbers.<br/><b>• Product and HCF given:</b> LCM is simply Product ÷ HCF (no factorization needed).<br/><b>• Co-prime factor pair counting:</b> If N = p₁^a × p₂^b × p₃^c... (n distinct primes), the number of ways to split N into two co-prime factors is:<br/>&nbsp;&nbsp;&nbsp;&nbsp;- 2ⁿ⁻¹ ways (unordered pairs)<br/>&nbsp;&nbsp;&nbsp;&nbsp;- 2ⁿ ways (ordered pairs)",
        note: "Co-prime numbers are numbers whose HCF is 1 (e.g., 8 and 15 are co-prime, even though neither is a prime number)."
      },
      {
        id: "lh-timelines",
        name: "5. Recurrence & Meeting Problems",
        formula: "<b>• Simultaneous Events:</b> Events with individual periods p, q, r... recur/meet together every <b>LCM(p, q, r...)</b> units of time.<br/><b>• Applications:</b> Toll of bells, traffic light changes, runners on a circular track, meshing gears/rotations.",
        example: {
          q: "Two runners complete one lap of a circular track in 4 minutes and 6 minutes respectively. If they start together, after how long will they meet again at the starting point?",
          steps: [
            "They will meet again at the starting point at a time that is a multiple of both 4 and 6.",
            "Find the Least Common Multiple: LCM(4, 6)",
            "4 = 2², 6 = 2 × 3",
            "LCM = 2² × 3 = 12 minutes."
          ],
          ans: "12 minutes"
        }
      },
      {
        id: "lh-exam-traps",
        name: "6. Exam Tips & Common Mistakes",
        formula: "<b>• HCF vs LCM:</b> Always double-check what is asked — students often swap them under exam pressure.<br/><b>• Gear Rotations:</b> In gear problems, be careful whether the question asks for the rotations of the smaller gear or the larger gear (Rotations = LCM ÷ Teeth of the gear).<br/><b>• Product Rule Trap:</b> Never assume HCF × LCM = Product works for 3 or more numbers. It works <i>only</i> for exactly two numbers.<br/><b>• Keyword Patterns:</b><br/>&nbsp;&nbsp;&nbsp;&nbsp;- 'Greatest/Maximum size/container' → HCF<br/>&nbsp;&nbsp;&nbsp;&nbsp;- 'Least/Minimum time/coincide again' → LCM",
        note: "Practice Euclid's division algorithm for large numbers; TCS/Infosys frequently test HCF of 5 or 6-digit numbers."
      }
    ]
  },
  "divisibility-remainder": {
    title: "Divisibility & Remainder",
    icon: "➗",
    items: [
      {
        id: "dr-basic-rules",
        name: "1. Standard Divisibility Rules",
        formula: "<b>• By 2:</b> Last digit is even.<br/><b>• By 3:</b> Sum of digits is divisible by 3.<br/><b>• By 4:</b> Last two digits form a number divisible by 4.<br/><b>• By 5:</b> Last digit is 0 or 5.<br/><b>• By 6:</b> Divisible by both 2 and 3.<br/><b>• By 8:</b> Last three digits form a number divisible by 8.<br/><b>• By 9:</b> Sum of digits is divisible by 9.<br/><b>• By 10:</b> Last digit is 0.<br/><b>• By 11:</b> |(Sum of odd-position digits) − (Sum of even-position digits)| is 0 or a multiple of 11.<br/><b>• By 25:</b> Last two digits are 00, 25, 50, or 75."
      },
      {
        id: "dr-theorems",
        name: "2. Remainder Theorems",
        formula: "<b>• Fermat's Little Theorem:</b> If p is prime and HCF(a, p) = 1, then: <br/>&nbsp;&nbsp;&nbsp;&nbsp;<b>a^(p-1) ≡ 1 (mod p)</b><br/>&nbsp;&nbsp;&nbsp;&nbsp;Use this to reduce very large exponents mod (p-1).<br/><b>• Wilson's Theorem:</b> If p is prime, then: <br/>&nbsp;&nbsp;&nbsp;&nbsp;<b>(p-1)! ≡ -1 ≡ p-1 (mod p)</b><br/>&nbsp;&nbsp;&nbsp;&nbsp;Use this to instantly find remainders of factorials (e.g., 100! mod 101).",
        example: {
          q: "Find the remainder when 5^100 is divided by 13.",
          steps: [
            "13 is prime and HCF(5, 13) = 1, so Fermat's Little Theorem applies.",
            "5^12 ≡ 1 (mod 13).",
            "Reduce the exponent mod 12: 100 = 12 × 8 + 4.",
            "5^100 ≡ 5^4 (mod 13).",
            "5^4 = 625. Divide 625 by 13: 625 = 13 × 48 + 1. Remainder is 1."
          ],
          ans: "1"
        }
      },
      {
        id: "dr-cyclicity",
        name: "3. Cyclicity & Divisor Properties",
        formula: "<b>• Unit Digit Cyclicity (aⁿ mod 10):</b> Cycles of exponents repeat every 1, 2, or 4 steps:<br/>&nbsp;&nbsp;&nbsp;&nbsp;- Cycle of 1: [0, 1, 5, 6]<br/>&nbsp;&nbsp;&nbsp;&nbsp;- Cycle of 2: [4, 9]<br/>&nbsp;&nbsp;&nbsp;&nbsp;- Cycle of 4: [2, 3, 7, 8]<br/><b>• Number of Divisors:</b> If N = p₁^a × p₂^b × p₃^c..., then number of divisors = <b>(a+1)(b+1)(c+1)...</b><br/><b>• Trailing Zeros in n!:</b> Count factors of 5: <b>⌊n/5⌋ + ⌊n/25⌋ + ⌊n/125⌋ + ...</b>",
        example: {
          q: "Find the number of divisors of 360.",
          steps: [
            "Write the prime factorization: 360 = 2³ × 3² × 5¹.",
            "Apply the divisor formula: (3+1) × (2+1) × (1+1)",
            "Divisors count = 4 × 3 × 2 = 24."
          ],
          ans: "24"
        }
      },
      {
        id: "dr-shortcuts",
        name: "4. Shortcut Tricks",
        formula: "<b>• Binomial Expansion Residue (±1 mod m):</b> Look for bases that are 1 more or 1 less than the divisor. For example, 17 ≡ −1 (mod 18), so 17²³ ≡ (−1)²³ = −1 ≡ 17 (mod 18).<br/><b>• Composite Divisor Split:</b> To find a remainder mod a composite number (like 45 = 9×5), find the remainder mod each prime factor separately, and combine them using Chinese Remainder Theorem logic.<br/><b>• Divisor minus Remainder Pattern:</b> If dividing N by a, b, c leaves remainders (a-k), (b-k), (c-k), then N + k is divisible by LCM(a, b, c).",
        note: "Negative residues are extremely powerful. Convert negative modulo results to positive by adding the divisor (e.g. -1 mod 7 ≡ 6)."
      },
      {
        id: "dr-exam-tips",
        name: "5. Exam Tips & Common Mistakes",
        formula: "<b>• Fermat's Gcd Check:</b> Always double check that a and p are co-prime before using Fermat's theorem. It fails if they share factors.<br/><b>• Base Reduction First:</b> Always reduce a huge base first before checking cyclicity (e.g. for 12²³ mod 5, reduce 12 to 2 first, then compute 2²³ mod 5).<br/><b>• Consecutive Odds Divisibility:</b> Sum of consecutive odds is a multiple of their count, and has special modular behavior.<br/><b>• Factorial Cutoffs:</b> In factorial sum remainder problems, find the cutoff point where the factorial contains all prime factors of the divisor (e.g. 5! and higher are 0 mod 15)."
      }
    ]
  },
  "problems-ages": {
    title: "Problems on Ages",
    icon: "👴",
    items: [
      {
        id: "pa-definition",
        name: "1. Definition & Core Concept",
        formula: "<b>• Definition:</b> 'Problems on Ages' is an aptitude topic dealing with calculation of present, past, or future ages of individuals using linear equations, based on relationships given as ratios, sums, differences, or multiples between people's ages at different points in time.<br/><b>• Core Concept:</b> Always define one unknown (x) and express other ages in terms of it. Remember that the difference between the ages of two people remains CONSTANT over time."
      },
      {
        id: "pa-formulae",
        name: "2. Important Formulae",
        formula: "<b>• Age Shifts:</b> If present age = x, then:<br/>&nbsp;&nbsp;&nbsp;&nbsp;- Age n years ago = (x − n)<br/>&nbsp;&nbsp;&nbsp;&nbsp;- Age n years hence = (x + n)<br/><b>• Ratio Shifts:</b> If ratio of present ages of A and B = m:n, ages can be taken as mk and nk. If after t years the ratio becomes p:q:<br/>&nbsp;&nbsp;&nbsp;&nbsp;(mk + t)/(nk + t) = p/q<br/><b>• Sum of Ages:</b> Sum of ages of two people = S; if one is x, the other = (S − x).<br/><b>• Average Age:</b> Average age = (Sum of ages of all members) ÷ (Number of members)<br/><b>• Replacement Formula:</b> If average age of n people changes by d years after replacement:<br/>&nbsp;&nbsp;&nbsp;&nbsp;New member's age = Old member's age ± (n × d)"
      },
      {
        id: "pa-shortcuts",
        name: "3. Shortcut Tricks",
        formula: "<b>• Constant Difference Trick:</b> If A is always d years older than B, A − B = d at any time.<br/><b>• Ratio-to-multiplier Trick:</b> Convert ratio m:n to mk, nk — reduces two unknowns to one.<br/><b>• Cross-multiplication:</b> Cross-multiply ratio equations immediately instead of expanding both sides.<br/><b>• Sum of Averages:</b> For average-age problems (births/deaths/replacements), always use total age (sum), not average, while forming equations."
      },
      {
        id: "pa-methods",
        name: "4. Quick Calculation Methods & Rules",
        formula: "<b>• Two Ratios:</b> Two ratios at two different times → form two linear equations, solve simultaneously.<br/><b>• Translate Word-by-word:</b> Translate statements carefully:<br/>&nbsp;&nbsp;&nbsp;&nbsp;<i>'A's age after 5 yrs = twice B's age 5 yrs ago'</i> → (A + 5) = 2(B − 5)<br/><b>• Sanity-Check:</b> Present age is never zero or negative.<br/><b>• Multi-person ratio:</b> With 3+ people, ratio form with single multiplier k simplifies algebra greatly."
      },
      {
        id: "pa-remembers-mistakes",
        name: "5. Points to Remember & Mistakes to Avoid",
        formula: "<b>• Birth-time statement:</b> 'At the time of birth of X' means X's age = 0 then, so difference = other person's age at that time.<br/><b>• Trap Check:</b> Always check whose age is being asked (e.g., A's vs. B's, or present vs. past/future age).<br/><b>• Shift Trap:</b> Don't forget to shift the correct number of years for both people in equations.<br/><b>• Multiplier Type:</b> Do not assume the ratio multiplier k must be a whole number; it can be a decimal."
      },
      {
        id: "pa-placement-tips",
        name: "6. Placement Tips & Quick Revision",
        formula: "<b>• Prefer Ratios:</b> Prefer the ratio-multiplier method — faster than two full variables.<br/><b>• Back-Substitution:</b> With options given, back-substitution (testing option values) is often the fastest way to solve.<br/><b>• 1-Page Quick Revision:</b><br/>&nbsp;&nbsp;&nbsp;&nbsp;- Age n years ago: x − n<br/>&nbsp;&nbsp;&nbsp;&nbsp;- Age n years hence: x + n<br/>&nbsp;&nbsp;&nbsp;&nbsp;- Ratio of present ages: mk : nk<br/>&nbsp;&nbsp;&nbsp;&nbsp;- Difference of ages: Constant at all times<br/>&nbsp;&nbsp;&nbsp;&nbsp;- Ratio at two different times: Cross-multiply, solve simultaneously<br/>&nbsp;&nbsp;&nbsp;&nbsp;- Average age: Sum of ages ÷ Number of people<br/>&nbsp;&nbsp;&nbsp;&nbsp;- Replacement problems: Use sum of ages, apply average × count"
      }
    ]
  },
  "probability": {
    title: "Probability",
    icon: "🎲",
    items: [
      {
        id: "prob-definition",
        name: "1. Definition & Core Concept",
        formula: "<b>• Definition:</b> Probability measures the likelihood of an event occurring, expressed as a ratio of favorable outcomes to total possible outcomes, ranging from 0 (impossible) to 1 (certain).<br/><b>• Concepts:</b><br/>&nbsp;&nbsp;&nbsp;&nbsp;- Sample space (S) = set of all possible outcomes.<br/>&nbsp;&nbsp;&nbsp;&nbsp;- Event (E) = subset of the sample space.<br/>&nbsp;&nbsp;&nbsp;&nbsp;- Two dice → 36 total outcomes; one die → 6; two coins → 4; three coins → 8."
      },
      {
        id: "prob-formulae",
        name: "2. Important Formulae",
        formula: "<b>1. Basic Probability:</b> P(E) = Number of favorable outcomes ÷ Total number of outcomes<br/><b>2. Addition Rule (not mutually exclusive):</b> P(A∪B) = P(A) + P(B) − P(A∩B)<br/><b>3. Addition Rule (mutually exclusive):</b> P(A∪B) = P(A) + P(B)<br/><b>4. Complement Rule:</b> P(not A) = 1 − P(A)<br/><b>5. Independent Events:</b> P(A∩B) = P(A) × P(B)<br/><b>6. Conditional Probability:</b> P(A|B) = P(A∩B) ÷ P(B)<br/><b>7. Combinations:</b> ⁿCᵣ = n! ÷ [r!(n−r)!]<br/><b>8. 'At least one' (independent):</b> P = 1 − P(none happens) = 1 − [(1−p₁)(1−p₂)...(1−pₙ)]<br/><b>9. Contradiction:</b> P(contradict) = P(A true)×P(B false) + P(A false)×P(B true)"
      },
      {
        id: "prob-shortcuts",
        name: "3. Shortcut Tricks",
        formula: "<b>• Complement Logic:</b> For 'at least one' problems, always compute via the complement: 1 − P(none).<br/><b>• Card Facts:</b> Memorize: 52 cards, 4 suits × 13 cards, 12 face cards, 4 aces, 4 kings/queens/jacks each.<br/><b>• Dice Sum Table:</b> Memorize the standard sum-frequency table (sum 2→1 way, ..., sum 7→6 ways, ..., sum 12→1 way).<br/><b>• Two-stage Selection:</b> For 'selecting one bag then one ball' problems, multiply by 1/n for each bag, then add the probabilities."
      },
      {
        id: "prob-rules",
        name: "4. Quick Calculation & Rules",
        formula: "<b>• Overlaps:</b> Convert 'or' to addition, and 'and' to multiplication (for independent events).<br/><b>• Leap Year Sunday:</b> 366 days = 52 weeks + 2 extra days; probability of 53 Sundays = 2/7.<br/><b>• Bounds:</b> P(E) always lies between 0 and 1 inclusive. The total probability of a sample space always sums to 1.<br/><b>• Face Cards:</b> Face cards = Jack, Queen, King only (Ace is NOT a face card) = 12 total in a deck."
      },
      {
        id: "prob-mistakes",
        name: "5. Points to Remember & Mistakes to Avoid",
        formula: "<b>• Replacement:</b> Distinguish between 'with replacement' (independent draws) and 'without replacement' (dependent draws, use combinations).<br/><b>• Double-counting:</b> 'Or' problems involving overlapping conditions need the subtraction of the intersection term to avoid double-counting.<br/><b>• Permutations vs Combinations:</b> Do not use permutations when order does not matter.<br/><b>• Ace Trap:</b> Remember that 'face card' excludes the Ace.<br/><b>• Or vs And:</b> Remember 'or' means add, 'and' means multiply (for independent events)."
      },
      {
        id: "prob-placement-tips",
        name: "6. Placement Tips & Quick Revision",
        formula: "<b>• ⁿCᵣ Shortcut:</b> Compute combinations quickly using the shortcut ⁿCᵣ = ⁿCₙ₋ᵣ (e.g., ¹⁵C₁₃ = ¹⁵C₂).<br/><b>• Simplify fractions:</b> Always simplify final fractions to lowest terms.<br/><b>• Quick Revision Table:</b><br/>&nbsp;&nbsp;&nbsp;&nbsp;- Basic probability: Favorable / Total<br/>&nbsp;&nbsp;&nbsp;&nbsp;- Addition rule: P(A) + P(B) − P(A∩B)<br/>&nbsp;&nbsp;&nbsp;&nbsp;- Complement: 1 − P(A)<br/>&nbsp;&nbsp;&nbsp;&nbsp;- Independent events: P(A) × P(B)<br/>&nbsp;&nbsp;&nbsp;&nbsp;- Conditional probability: P(A∩B) ÷ P(B)<br/>&nbsp;&nbsp;&nbsp;&nbsp;- Two dice sample space: 36 total outcomes<br/>&nbsp;&nbsp;&nbsp;&nbsp;- Deck of cards: 52 cards, 4 suits, 12 face cards, 4 aces<br/>&nbsp;&nbsp;&nbsp;&nbsp;- Leap year: 366 days = 52 weeks + 2 days (P(53 Sundays) = 2/7)"
      }
    ]
  },
  "equation": {
    title: "Equations",
    icon: "🟰",
    items: [
      {
        id: "eq-definition",
        name: "1. Definition & Core Concept",
        formula: "<b>• Definition:</b> This topic covers forming and solving linear equations (single or simultaneous) to find unknown numbers, digits, ages, shares, or costs described through word problems.<br/><b>• Core Concept:</b> Word problems must first be translated into algebraic equations before solving — precise translation is the key skill."
      },
      {
        id: "eq-formulae",
        name: "2. Important Formulae",
        formula: "<b>1. Linear equation in one variable:</b> ax + b = c → x = (c − b) / a<br/><b>2. Simultaneous equations:</b> Eliminate one variable by adding/subtracting aligned coefficient equations.<br/><b>3. Two-digit number:</b> If tens digit = x and units digit = y, the number is <b>10x + y</b>; the reversed number is <b>10y + x</b>.<br/><b>4. Digit reversal difference:</b> Original − Reversed = 9(x − y)<br/><b>5. Consecutive integers:</b> n, n + 1, n + 2... (consecutive odds/evens: n, n + 2, n + 4...)<br/><b>6. Ratio-based division:</b> If A:B = m:n, A = [m / (m + n)] * Total, and B = [n / (m + n)] * Total<br/><b>7. Difference of squares:</b> a² − b² = (a + b)(a − b)<br/><b>8. Quadratic form:</b> ax² + bx + c = 0"
      },
      {
        id: "eq-shortcuts",
        name: "3. Shortcut Tricks",
        formula: "<b>• Digit reversal:</b> Original − Reversed = 9(tens digit − units digit).<br/><b>• Sum & Difference:</b> Larger number = (Sum + Difference) / 2; Smaller number = (Sum − Difference) / 2.<br/><b>• Direct elimination:</b> For ax + by = p and ax − by = q, add directly: 2ax = p + q.<br/><b>• Ratio-multiplier:</b> Convert all shares to a single common variable (k) before summing."
      },
      {
        id: "eq-rules",
        name: "4. Quick Calculation & Rules",
        formula: "<b>• Fraction clearing:</b> When equations involve fractions, percentages, or different units (like paise/rupees), convert to standard units first.<br/><b>• Quadratic Splitting:</b> For product of consecutive numbers, use middle-term splitting on ax² + bx + c = 0.<br/><b>• Cost structures:</b> For fixed + variable costs, use two points to solve rate and fixed charge simultaneously.<br/><b>• Sign convention:</b> Check sign conventions carefully in 'less than,' 'more than,' and 'exceeds by' statements."
      },
      {
        id: "eq-mistakes",
        name: "5. Points to Remember & Mistakes to Avoid",
        formula: "<b>• Decreased by %:</b> 'A number decreased by 20% of itself' means x − 0.2x = 0.8x, NOT x − 20.<br/><b>• Units conversion:</b> Do not forget to convert percentages, paise, or decades into standard units.<br/><b>• Reject invalid roots:</b> Reject negative or fractional solutions if the context requires positive integers (digits, ages, counts).<br/><b>• Sum vs Diff:</b> Don't confuse 'sum of two numbers' with 'difference of two numbers'."
      },
      {
        id: "eq-placement-tips",
        name: "6. Placement Tips & Quick Revision",
        formula: "<b>• Back-substitution:</b> In timed tests, use options for back-substitution (plugging option values into equations) to solve complex structures quickly.<br/><b>• Choose elimination:</b> Look for matching coefficients for the fastest elimination path rather than substitution.<br/><b>• Quick Revision Table:</b><br/>&nbsp;&nbsp;&nbsp;&nbsp;- Linear equation: ax + b = c → x = (c − b) / a<br/>&nbsp;&nbsp;&nbsp;&nbsp;- Two-digit number: 10x + y<br/>&nbsp;&nbsp;&nbsp;&nbsp;- Digit reversal difference: 9(x − y)<br/>&nbsp;&nbsp;&nbsp;&nbsp;- Sum & Difference: Larger = (S + D) / 2, Smaller = (S − D) / 2<br/>&nbsp;&nbsp;&nbsp;&nbsp;- Ratio division: Part = [term / sum of terms] * Total<br/>&nbsp;&nbsp;&nbsp;&nbsp;- Difference of squares: a² − b² = (a + b)(a − b)"
      }
    ]
  },
  "series-progression": {
    title: "Series & Progression",
    icon: "📈",
    items: [
      {
        id: "sp-definition",
        name: "1. Definition & Core Concept",
        formula: "<b>• Definition:</b> This topic covers number series (patterns based on arithmetic, geometric, or hybrid rules) and Arithmetic/Geometric Progressions (AP/GP), where a sequence of numbers follows a defined rule, and the task is to identify missing terms, find specific terms, or compute sums.<br/><b>• Core Concept:</b> AP has a constant difference (d) between consecutive terms. GP has a constant ratio (r) between consecutive terms."
      },
      {
        id: "sp-formulae",
        name: "2. Important Formulae",
        formula: "<b>1. nth term of AP:</b> Tₙ = a + (n−1)d<br/><b>2. Sum of n terms of AP:</b> Sₙ = (n/2)[2a + (n−1)d] or Sₙ = (n/2)(first + last)<br/><b>3. nth term of GP:</b> Tₙ = a * rⁿ⁻¹<br/><b>4. Sum of n terms of GP:</b> Sₙ = a(rⁿ−1) / (r−1) (for r≠1)<br/><b>5. Sum of first n natural numbers:</b> n(n+1) / 2<br/><b>6. Sum of squares of first n natural numbers:</b> n(n+1)(2n+1) / 6<br/><b>7. Sum of cubes of first n natural numbers:</b> [n(n+1)/2]²<br/><b>8. AM of a,b:</b> (a+b) / 2<br/><b>9. GM of a,b:</b> √(ab)"
      },
      {
        id: "sp-shortcuts",
        name: "3. Shortcut Tricks",
        formula: "<b>• AP Sum Swap:</b> If sum of p terms = q and sum of q terms = p, then the sum of (p+q) terms is always <b>−(p+q)</b>.<br/><b>• Subtraction trick:</b> For AP problems giving two terms, subtract the equations to eliminate 'a' and solve for 'd' directly.<br/><b>• Interleaved series:</b> Split into odd-position and even-position terms and analyze separately.<br/><b>• Zero Term:</b> If terms cancel via a+(k)d = 0 relationship, solve directly for the term index."
      },
      {
        id: "sp-rules",
        name: "4. Quick Calculation & Rules",
        formula: "<b>• Divisibility within limits:</b> To find multiples of k between limits, treat as AP: first term = smallest multiple ≥ lower limit, last term = largest multiple ≤ upper limit, common difference = k.<br/><b>• Square Differences:</b> If series gaps are 1, 4, 9, 16..., suspect a squared-difference pattern.<br/><b>• Middle term of AP:</b> For an odd number of terms, the middle term equals the average of the progression."
      },
      {
        id: "sp-mistakes",
        name: "5. Points to Remember & Mistakes to Avoid",
        formula: "<b>• Decreasing AP:</b> Remember that d can be negative for a descending progression.<br/><b>• nth vs Sum:</b> Double-check whether 'nth term' or 'sum of n terms' is being asked.<br/><b>• Pattern Verification:</b> Don't assume a pattern too early without verifying it across all given terms."
      },
      {
        id: "sp-placement-tips",
        name: "6. Placement Tips & Quick Revision",
        formula: "<b>• First 3 Terms:</b> Practice spotting AP vs GP vs custom-pattern series within the first 3 terms to save time.<br/><b>• Check alternatives:</b> When a series doesn't fit AP/GP, check squares, cubes, primes, or alternating dual-operation patterns.<br/><b>• Quick Revision Table:</b><br/>&nbsp;&nbsp;&nbsp;&nbsp;- nth term of AP: a + (n−1)d<br/>&nbsp;&nbsp;&nbsp;&nbsp;- Sum of AP: (n/2)[2a + (n−1)d]<br/>&nbsp;&nbsp;&nbsp;&nbsp;- nth term of GP: a * rⁿ⁻¹<br/>&nbsp;&nbsp;&nbsp;&nbsp;- Sum of GP: a(rⁿ−1)/(r−1)<br/>&nbsp;&nbsp;&nbsp;&nbsp;- Sum of first n naturals: n(n+1)/2<br/>&nbsp;&nbsp;&nbsp;&nbsp;- Sum of squares: n(n+1)(2n+1)/6<br/>&nbsp;&nbsp;&nbsp;&nbsp;- Sum of (p+q) terms (when Sₚ=q, S_q=p): −(p+q)"
      }
    ]
  },
  "mensuration": {
    title: "Mensuration",
    icon: "📐",
    items: [
      {
        id: "men-definition",
        name: "1. Definition & Core Concept",
        formula: "<b>• Definition:</b> Mensuration deals with the measurement of geometric figures — their perimeter, area (2D), and volume/surface area (3D) — using standard formulae for shapes like squares, rectangles, circles, triangles, quadrilaterals, cubes, cuboids, cylinders, cones, and spheres.<br/><b>• Recasting Solid:</b> When a solid is melted and recast, its total volume is conserved.<br/><b>• Bending Wire:</b> When a wire/sheet is reshaped, its perimeter/circumference is conserved."
      },
      {
        id: "men-formulae-2d",
        name: "2. Important Formulae (2D)",
        formula: "<b>• Square:</b> Area = side², Perimeter = 4*side, Area from diagonal = d²/2<br/><b>• Rectangle:</b> Area = l*b, Perimeter = 2(l+b)<br/><b>• Triangle:</b> Area = ½ * base * height<br/><b>• Circle:</b> Area = πr², Circumference = 2πr<br/><b>• Rhombus:</b> Area = ½ * d₁ * d₂<br/><b>• Trapezium:</b> Area = ½ * (sum of parallel sides) * height<br/><b>• General quadrilateral:</b> Area = ½ * diagonal * (h₁ + h₂)"
      },
      {
        id: "men-formulae-3d",
        name: "3. Important Formulae (3D)",
        formula: "<b>• Cube:</b> Volume = a³, TSA = 6a², LSA = 4a²<br/><b>• Cuboid:</b> Volume = l*b*h, TSA = 2(lb+bh+hl)<br/><b>• Cylinder:</b> Volume = πr²h, Curved Surface Area (CSA) = 2πrh, TSA = 2πr(h+r)<br/><b>• Cone:</b> Volume = ⅓πr²h, CSA = πrl (slant height l = √(r² + h²)), TSA = πr(l+r)<br/><b>• Sphere:</b> Volume = (4/3)πr³, Surface Area = 4πr²"
      },
      {
        id: "men-shortcuts",
        name: "4. Shortcut Tricks",
        formula: "<b>• Volumes to Surface Areas:</b> Cube root volume ratio to get side ratio, then square it for area ratio.<br/><b>• Floating Object Sink:</b> Mass = Volume displaced * Density of water (1000 kg/m³ for water, with lengths in metres).<br/><b>• Wet Surface of Cistern:</b> Area = 2h(l + b) + l*b (base + 4 walls up to water level).<br/><b>• Open Box from Sheet:</b> New length = original length − 2*(cut square side), new breadth = original breadth − 2*(cut square side), height = cut square side."
      },
      {
        id: "men-rules",
        name: "5. Quick Calculation & Rules",
        formula: "<b>• π = 22/7:</b> Memorize π = 22/7 for problems with radii that are multiples of 7 to avoid decimals.<br/><b>• Hollow Pipe:</b> Material volume = π(R²−r²)*h, where R = external radius, r = internal radius.<br/><b>• Diagonal of Square:</b> d = side * √2, so side = d / √2 and Area = d²/2.<br/><b>• Consistent Units:</b> Always convert all values to the same unit (e.g., cm to m) before using density/mass formulas."
      },
      {
        id: "men-mistakes",
        name: "6. Points to Remember & Mistakes to Avoid",
        formula: "<b>• Perimeter vs Volume:</b> Don't confuse 'perimeter conserved' (wire bending) with 'volume conserved' (melting/recasting).<br/><b>• TSA vs CSA:</b> Curved Surface Area (CSA) excludes the flat top/bottom; Total Surface Area (TSA) includes all faces.<br/><b>• Unit check:</b> Double-check whether the final answer should be in cm², m², cm³, or m³."
      }
    ]
  },
  "geometry-perimeter": {
    title: "Geometry & Perimeter",
    icon: "🟦",
    items: [
      {
        id: "gp-formulae",
        name: "1. Definition & Core Formulae (2D & 3D)",
        formula: "<b>• Square:</b> Area = a²; Perimeter = 4a; Diagonal = a√2<br/><b>• Rectangle:</b> Area = l×b; Perimeter = 2(l+b); Diagonal = √(l²+b²)<br/><b>• Triangle:</b> Area = ½ × base × height; Heron's Area = √[s(s−a)(s−b)(s−c)], where s = (a+b+c)/2<br/><b>• Equilateral Triangle:</b> Area = (√3/4)a²; Height = (√3/2)a<br/><b>• Circle:</b> Area = πr²; Circumference = 2πr<br/><b>• Semicircle:</b> Area = ½πr²; Perimeter = πr + 2r<br/><b>• Sector:</b> Area = (θ/360°)×πr²; Arc length = (θ/360°)×2πr<br/><b>• Rhombus:</b> Area = ½×d₁×d₂; Perimeter = 4×side<br/><b>• Parallelogram:</b> Area = base×height; 2(a²+b²) = d₁²+d₂²<br/><b>• Trapezium:</b> Area = ½×(sum of parallel sides)×height<br/><b>• Regular Polygon:</b> Diagonals = n(n−3)/2; Sum of interior angles = (n−2)×180°<br/><b>• Cuboid:</b> Volume = l×b×h; Surface Area = 2(lb+bh+hl)<br/><b>• Cube:</b> Volume = a³; Surface Area = 6a²<br/><b>• Cylinder:</b> Volume = πr²h; CSA = 2πrh; TSA = 2πr(r+h)<br/><b>• Hollow Cylinder:</b> Volume = πh(R²−r²)<br/><b>• Cone:</b> Volume = ⅓πr²h; Slant height l = √(r²+h²); CSA = πrl<br/><b>• Sphere:</b> Volume = (4/3)πr³; Surface Area = 4πr²<br/><b>• Hemisphere:</b> Volume = (2/3)πr³; CSA = 2πr²<br/><b>• Right-triangle inradius:</b> r = (Perpendicular + Base − Hypotenuse) / 2"
      },
      {
        id: "gp-concepts",
        name: "2. Important Concepts",
        formula: "<b>• Dimensions:</b> Perimeter measures boundary length (1D); Area measures enclosed surface (2D); Volume measures enclosed space (3D).<br/><b>• Parallelogram law:</b> sum of squares of diagonals = 2 × (sum of squares of two adjacent sides).<br/><b>• Congruent division:</b> The diagonal of a rectangle divides it into two congruent right triangles (SSS).<br/><b>• Triangle Inequality:</b> A triangle is valid only if the sum of any two sides is greater than the third.<br/><b>• Outer/Inner Area:</b> For path/border problems: Area = Outer Area − Inner Area.<br/><b>• Tank Level Rise:</b> Volume poured = Base Area × Height risen.<br/><b>• Largest Inscribed Circle:</b> Inscribed in a rectangle has diameter = shorter side of the rectangle.<br/><b>• Right Triangle radii:</b> Inradius = (P+B−H)/2; Circumradius = Hypotenuse/2."
      },
      {
        id: "gp-shortcuts",
        name: "3. Shortcut Tricks",
        formula: "<b>• Multi-height Fence:</b> Compute one circuit's length, then multiply by the number of circuits.<br/><b>• Crossing Center Paths:</b> Area = Lw + Bw − w² (where w = path width).<br/><b>• Recasting/Melting:</b> Always equate VOLUMES, cancel π immediately from both sides.<br/><b>• Diagonals equation:</b> Solve n(n−3)/2 = D as a quadratic in n, discard the negative root.<br/><b>• π Approximation:</b> Use 22/7 only when dimensions are multiples of 7; otherwise use 3.14.<br/><b>• Rectangle Area direct:</b> If perimeter and diagonal are given: (l+b)² = l²+b²+2lb ⟹ Area = lb directly (no need to find l and b individually)."
      },
      {
        id: "gp-calculations",
        name: "4. Quick Calculations & Triples",
        formula: "<b>• Math Powers:</b> Memorize squares up to 30 and cubes up to 15 to speed up volume and Heron's computations.<br/><b>• Pythagorean Triples:</b> Recognize common triples: (3,4,5), (6,8,10), (5,12,13), (7,24,25), (9,12,15), (8,15,17) to skip long square roots.<br/><b>• Unit Uniformity:</b> Convert all dimensions (cm, m, dm, mm) to a single unit before starting calculations."
      },
      {
        id: "gp-mistakes",
        name: "5. Common Mistakes to Avoid",
        formula: "<b>• Double border width:</b> Forgetting to double the width when subtracting a border/path from both length and breadth.<br/><b>• Radius vs Diameter:</b> Confusing radius and diameter in inscribed circle problems.<br/><b>• Pi mismatch:</b> Using the wrong π approximation, causing mismatched MCQ options.<br/><b>• Addition Trap:</b> Adding areas of two circles instead of using volume-equivalence in melting/recasting problems.<br/><b>• Unit neglect:</b> Ignoring unit conversions (m to cm, dm to m) before applying formulas.<br/><b>• Invalid roots:</b> Accepting negative or fractional roots in polygon-side-count problems."
      },
      {
        id: "gp-placement-tips",
        name: "6. Placement Tips & Revision",
        formula: "<b>• Quick Sketch:</b> Draw a quick rough diagram for every geometry word problem.<br/><b>• Region Labelling:</b> Label all sub-regions before computing in path/border problems.<br/><b>• Solid Formula selection:</b> Recognize which volume formula applies within 3 seconds of reading the question.<br/><b>• Time-box:</b> Time-box each question to ~90 seconds; check for a Pythagorean-triple shortcut first."
      }
    ]
  },
  "percentages": {
    title: "Percentage",
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
    ],
    items: [
      {
        id: "pct-definition",
        name: "1. Definition & Core Formulae",
        formula: "<b>• Definition:</b> Percentage means 'per hundred' and expresses a number as a fraction of 100.<br/><b>• Basic Formula:</b> x% of y = (x/100) × y<br/><b>• Fraction to Percentage:</b> (a/b) × 100<br/><b>• Percentage Change:</b> [(New Value − Old Value) / Old Value] × 100<br/><b>• Successive Change:</b> Net % = x + y + (xy/100) (use negative sign for decrease)<br/><b>• Reversals:</b><br/>&nbsp;&nbsp;&nbsp;&nbsp;- If A is x% more than B: B is [x / (100 + x)] × 100 % less than A<br/>&nbsp;&nbsp;&nbsp;&nbsp;- If A is x% less than B: B is [x / (100 − x)] × 100 % more than A<br/><b>• Consumption Reduction:</b> If price rises by x%, reduction in consumption to keep expenditure constant = [x / (100 + x)] × 100 %<br/><b>• Population/Compound Growth:</b> P(1 + r/100)ⁿ (n years ago = P / (1 + r/100)ⁿ)<br/><b>• Election Margin:</b> Winning % − Losing % = (Margin votes / Total votes) × 100"
      },
      {
        id: "pct-concepts",
        name: "2. Important Concepts",
        formula: "<b>• Reference Base:</b> Percentages are always relative to a 'base' — always identify what 100% refers to before starting.<br/><b>• Asymmetry of Changes:</b> 'Increased by x%' then 'decreased by x%' does NOT return to the original value — net change is always a decrease, equal to −x²/100 %.<br/><b>• Percentage Points vs % Change:</b> A rise from 20% to 25% is a 5 percentage-point rise but a 25% percentage increase.<br/><b>• Common Totals:</b> In pass/fail, election, and mixture problems, always convert everything into percentages relative to the SAME total before comparing."
      },
      {
        id: "pct-shortcuts",
        name: "3. Shortcut Tricks & Calculations",
        formula: "<b>• Fraction Equivalents:</b> Memorize equivalents: 1/2=50%, 1/3=33.33%, 1/4=25%, 1/5=20%, 1/6=16.67%, 1/8=12.5%, 1/9=11.11%, 1/10=10%, 1/11=9.09%, 1/12=8.33%.<br/><b>• Successive Discount Shortcut:</b> For successive discounts or changes, always use Net% = x+y+xy/100 instead of computing step-by-step.<br/><b>• Election Margin Short:</b> Remember: (Winning% − Losing%) directly equals the margin as a percentage of total votes."
      },
      {
        id: "pct-rules",
        name: "4. Frequently Used Rules",
        formula: "<b>• Sum of Categories:</b> Total percentage across mutually exclusive categories must sum to 100%.<br/><b>• Venn Diagram (Failed in at least one):</b> Failed in at least one = P(A) + P(B) − P(A ∩ B); Passed both = 100% − Failed at least one.<br/><b>• Depreciation:</b> Depreciation uses the compound formula with a negative rate: P(1 − r/100)ⁿ."
      },
      {
        id: "pct-mistakes",
        name: "5. Common Mistakes to Avoid",
        formula: "<b>• Phrase Meaning:</b> Confusing 'increased by x%' with 'increased to x%'.<br/><b>• Wrong Base:</b> Using the wrong base when comparing 'A is x% more than B' vs 'B is x% less than A'.<br/><b>• Direct Addition Trap:</b> Adding percentages directly across different bases (e.g., 20% of 500 + 30% of 300 ≠ 50% of 800).<br/><b>• Rounding:</b> Rounding intermediate steps instead of the final answer, leading to mismatched options."
      },
      {
        id: "pct-placement-tips",
        name: "6. Placement Tips",
        formula: "<b>• Base Identification:</b> Always write down what the '100%' (base) refers to before setting up the equation — this eliminates the most common source of error.<br/><b>• Mixture/Election:</b> For election, pass/fail, and mixture problems, converting to a common total FIRST speeds up the entire calculation.<br/><b>• Mental Match:</b> Practice recognizing standard fraction–percentage pairs — timed percentage questions are won or lost on mental-math speed."
      }
    ]
  },
  "profit-loss": {
    title: "Profit & Loss",
    icon: "💰",
    items: [
      {
        id: "pl-definition",
        name: "1. Definition & Terminology",
        formula: "<b>• Cost Price (C.P.):</b> Price at which an article is purchased.<br/><b>• Selling Price (S.P.):</b> Price at which an article is sold.<br/><b>• Marked Price (M.P.) / List Price:</b> Price printed/labelled on an article before discount.<br/><b>• Profit (Gain):</b> When S.P. > C.P. ⟹ Profit = S.P. − C.P.<br/><b>• Loss:</b> When C.P. > S.P. ⟹ Loss = C.P. − S.P.<br/><b>• Discount:</b> Reduction given on the Marked Price. Discount = M.P. − S.P."
      },
      {
        id: "pl-formulae",
        name: "2. Important Formulae",
        formula: "<b>• Profit %:</b> (Profit / C.P.) × 100 = [(S.P. − C.P.) / C.P.] × 100<br/><b>• Loss %:</b> (Loss / C.P.) × 100 = [(C.P. − S.P.) / C.P.] × 100<br/><b>• S.P. from Profit %:</b> C.P. × (100 + Profit%) / 100<br/><b>• S.P. from Loss %:</b> C.P. × (100 − Loss%) / 100<br/><b>• C.P. from Profit %:</b> S.P. × 100 / (100 + Profit%)<br/><b>• C.P. from Loss %:</b> S.P. × 100 / (100 − Loss%)<br/><b>• Discount %:</b> (Discount / M.P.) × 100<br/><b>• S.P. from Discount %:</b> M.P. × (100 − Discount%) / 100<br/><b>• M.P. from Discount %:</b> S.P. × 100 / (100 − Discount%)<br/><b>• Successive Discounts:</b> Net single equivalent discount = d₁ + d₂ − (d₁ × d₂) / 100<br/><b>• Successive Profit/Loss:</b> Net effect = p₁ + p₂ + (p₁ × p₂) / 100 (use negative sign for loss)<br/><b>• False Weight:</b> Profit % = [True Weight / False Weight − 1] × 100 = [Error / (True Weight − Error)] × 100<br/><b>• Profit on S.P. to C.P.:</b> Profit % on C.P. = [x / (100 − x)] × 100<br/><b>• Loss on S.P. to C.P.:</b> Loss % on C.P. = [x / (100 + x)] × 100<br/><b>• Equal Selling Price (Same ±p%):</b> Overall Loss % = (p/10)² (always a net loss)<br/><b>• Equal Selling Price (Different %):</b> Calculate C.P.₁ and C.P.₂ individually (no short formula)<br/><b>• Equal Profit/Loss amount:</b> C.P. = (S₁ + S₂) / 2 (given S₁ with profit and S₂ with loss)<br/><b>• Marked Price with Target Profit after Discount:</b> M.P. = C.P. × (100 + Profit%) / (100 − Discount%)"
      },
      {
        id: "pl-concepts",
        name: "3. Important Concepts",
        formula: "<b>• Reference Base:</b> Profit/Loss % is always calculated on C.P. unless stated 'on S.P.'<br/><b>• Discount Base:</b> Discount is always calculated on Marked Price (M.P.), never on C.P.<br/><b>• Pricing Order:</b> Marked Price is set higher than C.P. so that profit remains after discount.<br/><b>• Bulk pricing:</b> Gain of x% on cost price of n articles type questions can be solved using the unitary/fraction method.<br/><b>• Successive chains:</b> Chain/successive changes are not additive — always multiply the factors.<br/><b>• False Weight:</b> In false weight problems, treat 'goods given less' as an increase in effective S.P."
      },
      {
        id: "pl-shortcuts",
        name: "4. Shortcut Tricks",
        formula: "<b>• Successive % Net Change:</b> Net% = a + b + ab/100 (use negative for loss/discount).<br/><b>• Equal price, ±p% each:</b> Always a loss of (p/10)² %.<br/><b>• Percentage to Fraction table:</b> 5%=1/20, 8.33%=1/12, 10%=1/10, 12.5%=1/8, 16.67%=1/6, 20%=1/5, 25%=1/4, 33.33%=1/3, 50%=1/2.<br/><b>• Ratio Method:</b> Convert buy-sell-buy-sell chains to direct ratio factors (e.g. 1.40 × 0.80) to save calculation steps."
      },
      {
        id: "pl-calculations",
        name: "5. Quick Calculation Methods",
        formula: "<b>• Multiplying Factor:</b> Convert +x% ⟹ (100+x)/100 and −x% ⟹ (100−x)/100.<br/><b>• Chain Multiplication:</b> Multiply all chain factors together, then apply to the original C.P.<br/><b>• Comparison Direction:</b> Always express 'X% more/less than Y' as Y × (100 ± X)/100.<br/><b>• Discount + Profit sequence:</b> Compute in order: M.P. ⟹ S.P. ⟹ compare to C.P."
      },
      {
        id: "pl-rules",
        name: "6. Frequently Used Rules",
        formula: "<b>• Base Rule:</b> Profit/Loss on C.P.; Discount on M.P.<br/><b>• Gains C.P. of n:</b> Profit = C.P. of n articles.<br/><b>• Ratio-based CP/SP:</b> Form the ratio S.P./C.P. directly (e.g. C.P. of 12 = S.P. of 10 ⟹ S.P./C.P. = 12/10).<br/><b>• Loss C.P. of k:</b> Loss = C.P. of k articles."
      },
      {
        id: "pl-remember",
        name: "7. Important Points to Remember",
        formula: "<b>• Absolute values:</b> Profit % and Loss % are always positive numbers when reported — direction is stated separately.<br/><b>• MP vs SP:</b> A higher discount % does not mean a lower final price if M.P. differs.<br/><b>• Successive discount sum:</b> Two equal discounts of d% ≠ single discount of 2d% (it is always less).<br/><b>• Assume Base 100:</b> When no actual prices are given, assume C.P. = Rs. 100."
      },
      {
        id: "pl-mistakes",
        name: "8. Common Mistakes to Avoid",
        formula: "<b>• Wrong Base:</b> Calculating profit/loss % on S.P. instead of C.P.<br/><b>• Direct Addition:</b> Adding successive changes directly instead of compounding them.<br/><b>• Base Mix-up:</b> Confusing Marked Price with Cost Price while computing discount.<br/><b>• False Weight signs:</b> Forgetting sign conventions in false-weight calculations.<br/><b>• Trap Wording:</b> Mixing up 'x% more than C.P.' with 'x% of S.P.'<br/><b>• Rounding:</b> Rounding off too early in multi-step chain calculations."
      },
      {
        id: "pl-placement-tips",
        name: "9. Placement Tips",
        formula: "<b>• Base 100 Assumption:</b> Assume C.P. = 100 (or LCM-friendly number) when actual prices are not required.<br/><b>• Option Back-checking:</b> Plug answer options into the formulas when algebra is heavy.<br/><b>• Muliplier Practice:</b> Practice mental multiplication of standard factors (1.20, 0.80, 1.35, etc.).<br/><b>• Watch trap wording:</b> 'Gain on S.P.' vs 'Gain on C.P.' are completely different."
      },
      {
        id: "pl-quick-sheet",
        name: "10. One-Page Quick Revision Sheet",
        formula: "<b>• Profit %:</b> (SP−CP)/CP × 100<br/><b>• Loss %:</b> (CP−SP)/CP × 100<br/><b>• SP (Profit):</b> CP × (100+P)/100<br/><b>• SP (Loss):</b> CP × (100−L)/100<br/><b>• Discount %:</b> (MP−SP)/MP × 100<br/><b>• SP (Discount):</b> MP × (100−D)/100<br/><b>• Successive % change:</b> a+b+ab/100<br/><b>• Equal price, ±p% each:</b> Net Loss = (p/10)² % = (p²/100)%<br/><b>• CP (Equal profit/loss amount):</b> (S₁ + S₂) / 2<br/><b>• False weight profit %:</b> Error / (True − Error) × 100"
      },
      {
        id: "pl-partnership",
        name: "13. Partnership Link (Important)",
        formula: "Profit ∝ Investment × Time <br/> Ratio of profits = I₁T₁ : I₂T₂"
      },
      {
        id: "int-basic",
        name: "14. Simple Interest (SI) Basics",
        formula: "SI = (P × R × T) / 100 <br/> Amount (A) = P + SI"
      },
      {
        id: "int-ci",
        name: "15. Compound Interest (CI) Basics",
        formula: "Amount (A) = P × (1 + R/100)^T <br/> CI = A - P",
        note: "• Half-Yearly: Rate = R/2, Time = 2T<br/>• Quarterly: Rate = R/4, Time = 4T"
      },
      {
        id: "int-diff-cisi",
        name: "16. Difference between CI & SI (For 2 Years)",
        formula: "CI - SI = P × (R / 100)²"
      }
    ]
  },
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
      },
      {
        id: "pc-basic",
        name: "11. Pipes & Cisterns Core Concept",
        formula: "• Filling pipe (Inlet) → Positive efficiency (+)<br/>• Emptying pipe (Outlet/Leak) → Negative efficiency (-)"
      },
      {
        id: "pc-leak-ex",
        name: "12. Leak in the Tank Formula",
        example: {
          q: "A pipe fills a tank in 12 hrs, but due to a leak it takes 15 hrs. Find the time taken by the leak to empty the full tank.",
          steps: [
            "Total Capacity = LCM(12, 15) = 60 units",
            "Normal rate = 60 / 12 = +5 units/hr",
            "Combined rate with leak = 60 / 15 = +4 units/hr",
            "Leak rate = 5 - 4 = 1 unit/hr (emptying)",
            "Time to empty = 60 / 1 = 60 hours"
          ],
          ans: "60 hours"
        }
      }
    ]
  },
  "clocks-calendar": {
    title: "Clocks & Calendar",
    icon: "📅",
    items: [
      {
        id: "cc-definition",
        name: "1. Definition & Scope",
        formula: "<b>• Clocks:</b> Relative motion of hands (hour, minute, second) on a circular dial — angles, coincidences, gains/losses.<br/><b>• Calendar:</b> Days of week, leap year cycles, odd days, repeating date/calendar patterns."
      },
      {
        id: "cc-clocks-formulae",
        name: "2. Clocks Formulae",
        formula: "<b>• Minute Hand Speed:</b> 6° per minute.<br/><b>• Hour Hand Speed:</b> 0.5° per minute.<br/><b>• Relative Speed:</b> 5.5° per minute (minute hand over hour hand).<br/><b>• Angle Between Hands:</b> |(30 × H) − (11/2) × M|<br/><b>• Coincidence Interval:</b> Hands coincide every 65 5/11 minutes (12/11 hours).<br/><b>• Coincidence Frequency:</b> 11 times in 12 hours; 22 times in 24 hours.<br/><b>• Straight Line Frequency:</b> 11 times in 12 hours; 22 times in 24 hours.<br/><b>• Perpendicular Frequency:</b> 22 times in 12 hours; 44 times in 24 hours.<br/><b>• Faulty Clock conversion:</b> (Time shown by faulty clock) / (Correct time) = (60 ± error per hour) / 60"
      },
      {
        id: "cc-calendar-formulae",
        name: "3. Calendar Formulae",
        formula: "<b>• Odd Days:</b> Days left after grouping complete weeks (remainder when total days ÷ 7).<br/><b>• Ordinary Year:</b> 365 days = 52 weeks + 1 odd day ⟹ 1 odd day.<br/><b>• Leap Year:</b> 366 days = 52 weeks + 2 odd days ⟹ 2 odd days.<br/><b>• Leap Century check:</b> Divisible by 400 (divisible by 100 but not 400 is NOT leap).<br/><b>• Century Odd Days:</b> 100 years = 5; 200 years = 3; 300 years = 1; 400 years = 0.<br/><b>• Weekday Mapping:</b> 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat."
      },
      {
        id: "cc-concepts",
        name: "4. Important Concepts",
        formula: "<b>• Date weekday shifts:</b> Ordinary year shifts a date by 1 weekday; leap year shifts by 2 (if Feb 29 is crossed).<br/><b>• 31-day month:</b> Starts on day X ⟹ 5 occurrences of X, X+1, X+2.<br/><b>• 30-day month:</b> Starts on day X ⟹ 5 occurrences of X, X+1.<br/><b>• 28/29-day month:</b> Feb has exactly 4 occurrences of every day in non-leap; 5 of starting day in leap.<br/><b>• Faulty Clock Scaling:</b> Set up a ratio/proportion between elapsed faulty clock time and real time."
      },
      {
        id: "cc-shortcuts",
        name: "5. Shortcut Tricks",
        formula: "<b>• Angle shortcut:</b> Use |30H − 5.5M| directly.<br/><b>• Hands overlap anomaly:</b> Hands overlap 11 times in 12 hours because 11:00 to 1:00 overlap is exactly at 12:00.<br/><b>• Day shifts:</b> For n days after/before weekday, do (Weekday ± n) mod 7.<br/><b>• 53 Sundays Probability:</b> Ordinary year = 1/7; Leap year = 2/7.<br/><b>• Century blocks:</b> Add century odd days (5, 3, 1, 0) to speed up long-term calendar tasks."
      },
      {
        id: "cc-calculations",
        name: "6. Quick Calculation Methods",
        formula: "<b>• Modulo 7:</b> Always reduce days to remainder modulo 7 to work with odd days.<br/><b>• Ratio Setup:</b> Frame faulty clock tasks as (Faulty Time) / (True Time) = constant.<br/><b>• reflex Angle:</b> If angle θ > 180°, reflex/smaller angle = 360° − θ."
      },
      {
        id: "cc-rules",
        name: "7. Frequently Used Rules",
        formula: "<b>• Odd days rules:</b> 1 ordinary = 1 odd; 1 leap = 2 odd.<br/><b>• 100y block:</b> A 100-year block has 5 odd days, so 1st Jan of years 100 years apart are not the same weekday.<br/><b>• Constant interval:</b> The gap between two coincidences is always 65 5/11 minutes."
      },
      {
        id: "cc-remember",
        name: "8. Important Points to Remember",
        formula: "<b>• Divisibility Trap:</b> 2000 is leap, 1900 is not.<br/><b>• Gain vs Loss:</b> Gaining clock runs fast (ahead); losing clock runs slow (behind).<br/><b>• Angle Range:</b> Ensure you find the acute (smaller) angle unless reflex is requested."
      },
      {
        id: "cc-mistakes",
        name: "9. Common Mistakes to Avoid",
        formula: "<b>• 60-min overlap trap:</b> Assuming hands coincide exactly every 60 mins.<br/><b>• Century divisor:</b> Dividing century years only by 4 instead of 400.<br/><b>• Boundary leap days:</b> Adding/subtracting odd days incorrectly near Feb 29 boundaries.<br/><b>• simple addition error:</b> Using simple addition instead of ratios for faulty clocks."
      },
      {
        id: "cc-placement-tips",
        name: "10. Placement Tips",
        formula: "<b>• Base Date:</b> Remember 1st Jan 1 AD = Monday and odd day cycle.<br/><b>• Angle Formula:</b> Instantaneous |30H − 5.5M| usage.<br/><b>• Leap Spans:</b> Watch for leap year range traps in date calculation questions."
      },
      {
        id: "cc-quick-sheet",
        name: "11. One-Page Quick Revision Sheet",
        formula: "<b>• Hands Angle:</b> |30H − 5.5M|<br/><b>• Coincidence Interval:</b> 65 5/11 minutes<br/><b>• 12 hrs occurrences:</b> Coincide=11, Opposite=11, Perpendicular=22<br/><b>• Year Odd Days:</b> Ordinary=1, Leap=2<br/><b>• Century Odd Days:</b> 100y=5, 200y=3, 300y=1, 400y=0<br/><b>• Repetition Cycle:</b> Calendar repeats every 28 years (without century corrections)"
      }
    ]
  },
  "ratio-proportion": {
    title: "Ratio & Proportion",
    icon: "⚖️",
    items: [
      {
        id: "rp-definition",
        name: "1. Definition & Core Terms",
        formula: "<b>• Ratio:</b> Comparison of two quantities of the same kind, expressed as a:b (a/b).<br/><b>• Proportion:</b> Equality of two ratios, expressed as a:b :: c:d (a/b = c/d).<br/><b>• Continued Proportion:</b> a, b, c are in continued proportion if a:b = b:c ⟹ b² = ac (b is the mean proportional).<br/><b>• Mixture/Alligation:</b> Technique to find the mixing ratio of ingredients at different prices/concentrations to get a target blend."
      },
      {
        id: "rp-formulae",
        name: "2. Important Formulae",
        formula: "<b>• Extremes & Means Product:</b> ad = bc (if a:b = c:d).<br/><b>• Fourth Proportional:</b> x = (b × c) / a (if a:b :: c:x).<br/><b>• Third Proportional:</b> x = b² / a (if a:b :: b:x).<br/><b>• Mean Proportional:</b> √(ab) (between a and b).<br/><b>• Componendo-Dividendo:</b> If a/b = c/d ⟹ (a+b)/(a−b) = (c+d)/(c−d).<br/><b>• Ratio Splitting:</b> If sum S is split in ratio a:b, shares are S × a/(a+b) and S × b/(a+b).<br/><b>• Dilution/Replacement:</b> Final quantity = Initial × [1 − (Amount Replaced / Total Volume)]ⁿ.<br/><b>• Combining Ratios:</b> If A:B = m:n and B:C = p:q, scale via LCM of B to get A:B:C = mp : np : nq.<br/><b>• Ratio Types:</b> Duplicate (a²:b²), Sub-duplicate (√a:√b), Triplicate (a³:b³), Compounded (ac:bd)."
      },
      {
        id: "rp-concepts",
        name: "3. Important Concepts",
        formula: "<b>• Pure Number:</b> Ratios have no units; quantities compared must be in identical units.<br/><b>• Term Order:</b> The order of terms in a ratio matters; a:b is distinct from b:a.<br/><b>• Alligation Base:</b> Alligation yields the ratio of quantities, not absolute quantities.<br/><b>• Dilution Check:</b> The direct exponential dilution formula only applies when the replaced volume is constant in each step."
      },
      {
        id: "rp-shortcuts",
        name: "4. Shortcut Tricks",
        formula: "<b>• Value Per Part:</b> Find total sum ÷ sum of ratio terms to get unit part value immediately.<br/><b>• Alligation Cross:</b> Ratio Cheaper:Dearer = (C.P. Dearer − Mean Price) : (Mean Price − C.P. Cheaper).<br/><b>• LCM Trick:</b> Scale ratios sharing common variables using the LCM of the common variable's parts.<br/><b>• Componendo-Dividendo:</b> Instantly simplify equations containing (x+y)/(x-y) patterns."
      },
      {
        id: "rp-calculations",
        name: "5. Quick Calculation Methods",
        formula: "<b>• Simplest Form:</b> Always reduce ratios to their lowest terms first.<br/><b>• Variable Multiplier:</b> Define ratio terms as a·x, b·x, ... to set up easy linear equations.<br/><b>• Unit Uniformity:</b> In currency/coin problems, convert all denominations to paise or rupees upfront."
      },
      {
        id: "rp-rules",
        name: "6. Frequently Used Rules",
        formula: "<b>• Extremes Rule:</b> ad = bc.<br/><b>• Ratio Comparison:</b> Compare ratios by converting to common denominators or using cross-multiplication.<br/><b>• Income-Savings:</b> Set up separate multipliers for Income and Expenditure, then apply Income − Expenditure = Savings."
      },
      {
        id: "rp-remember",
        name: "7. Important Points to Remember",
        formula: "<b>• Order of Terms:</b> Maintain the exact order given in the question.<br/><b>• Mean Proportional:</b> b² = ac only holds when in continued proportion (a, b, c).<br/><b>• Scaling:</b> Alligation ratios represent the proportional quantities, scale with actual values to find exact amounts."
      },
      {
        id: "rp-mistakes",
        name: "8. Common Mistakes to Avoid",
        formula: "<b>• Unit mismatch:</b> Not converting dimensions (e.g. grams vs kilograms) before ratio calculations.<br/><b>• Formula misuse:</b> Using the dilution formula when the replaced volume changes per step.<br/><b>• Cross swap:</b> Swapping Cheaper and Dearer terms in the alligation cross diagram.<br/><b>• early rounding:</b> Rounding fractions too early in chained calculations."
      },
      {
        id: "rp-placement-tips",
        name: "9. Placement Tips",
        formula: "<b>• Unit Part Method:</b> Compute 'value per part' first to solve allocation problems in seconds.<br/><b>• Alligation Versatility:</b> Apply alligation cross to averages, mixtures, and blended profit-loss questions.<br/><b>• Standard Patterns:</b> Master the income-expenditure-savings linear equations and the LCM chaining method."
      },
      {
        id: "rp-quick-sheet",
        name: "10. One-Page Quick Revision Sheet",
        formula: "<b>• Proportion:</b> ad = bc<br/><b>• Fourth Proportional:</b> x = bc/a<br/><b>• Third Proportional:</b> x = b²/a<br/><b>• Mean Proportional:</b> √(ab)<br/><b>• Componendo-Dividendo:</b> (a+b)/(a-b) = (c+d)/(c-d)<br/><b>• Alligation Ratio:</b> (Dearer − Mean) : (Mean − Cheaper)<br/><b>• Replacement:</b> Final = Initial × (1 − replaced/total)ⁿ<br/><b>• Duplicate Ratio:</b> a²:b²"
      }
    ]
  },
  "mixture-alligation": {
    title: "Mixture & Alligation",
    icon: "🧪",
    items: [
      {
        id: "ma-definition",
        name: "1. Definition & Core Terms",
        formula: "<b>• Mixture:</b> A blend of two or more ingredients (different prices, concentrations, or qualities).<br/><b>• Alligation:</b> A rule used to find the ratio in which two or more ingredients at given prices/concentrations must be mixed to produce a mixture at a given (mean) price.<br/><b>• Mean Price:</b> The cost price per unit quantity of the resulting mixture."
      },
      {
        id: "ma-formulae",
        name: "2. Important Formulae",
        formula: "<b>• Alligation Rule:</b> (Quantity of Cheaper) / (Quantity of Dearer) = (C.P. of Dearer − Mean Price) / (Mean Price − C.P. of Cheaper).<br/><b>• Repeated Dilution:</b> Quantity of pure element left after n replacements = P × [1 − (R/P)]ⁿ, where P = initial quantity, R = quantity replaced each time, and n = number of operations.<br/><b>• Weighted Mean Price:</b> (Q₁C₁ + Q₂C₂ + ... + QₙCₙ) / (Q₁ + Q₂ + ... + Qₙ) for mixing n ingredients.<br/><b>• Alligation on % Concentration:</b> Ratio of quantities = (Higher% − Mean%) : (Mean% − Lower%).<br/><b>• Combining Mixtures:</b> Convert compositions to fractions/percentages of the desired component, then apply alligation."
      },
      {
        id: "ma-concepts",
        name: "3. Important Concepts",
        formula: "<b>• Mean Reference:</b> Alligation operates around the mean value, which must lie between the two extremes.<br/><b>• Ratio of Quantities:</b> The result of alligation is always a ratio of the quantities mixed, not absolute amounts.<br/><b>• Dilution Limit:</b> The formula P × (1 − R/P)ⁿ is valid only when the volume replaced each time is constant and total volume stays the same.<br/><b>• Weighted Scenarios:</b> Alligation applies to any linear weighted average context (prices, concentration %, scores, average speed)."
      },
      {
        id: "ma-shortcuts",
        name: "4. Shortcut Tricks",
        formula: "<b>• Alligation Cross:</b> Write Cheaper CP (C.P.₁) and Dearer CP (C.P.₂) at the top, Mean (M) in the center, and subtract diagonally: Ratio = (C.P.₂ − M) : (M − C.P.₁).<br/><b>• Target Ratio of Mixtures:</b> Express each mixture's active ingredient as a percentage of the total, then alligate on these percentages.<br/><b>• Equal Mix Rule:</b> If Mean Price = average of the two extremes, the mixing ratio is exactly 1:1."
      },
      {
        id: "ma-calculations",
        name: "5. Quick Calculation Methods",
        formula: "<b>• Unit Uniformity:</b> Convert all prices/concentrations to a common unit before alligating.<br/><b>• Direct Dilution Setup:</b> Identify initial volume P, removed volume R, and count of operations n, then plug directly into the formula.<br/><b>• Fraction Conversions:</b> Practice converting fractional concentrations to percentages (e.g. 5/6 = 83.33%, 7/9 = 77.78%) to simplify calculations."
      },
      {
        id: "ma-rules",
        name: "6. Frequently Used Rules",
        formula: "<b>• Proximity Rule:</b> The ingredient closer to the mean price will have a larger share in the final ratio.<br/><b>• Water C.P. Rule:</b> In dilution/milk-watering problems, water cost is always taken as Rs. 0/litre.<br/><b>• compounding factor:</b> In successive replacement, multiply the remaining fractions (1 − R/P) for each step."
      },
      {
        id: "ma-remember",
        name: "7. Important Points to Remember",
        formula: "<b>• Ratio Order:</b> Match 'quantity of cheaper' with 'dearer − mean' and 'quantity of dearer' with 'mean − cheaper'.<br/><b>• Linear Average:</b> Alligation only applies to linear averages, not non-linear relationships.<br/><b>• Fraction representation:</b> Convert mixture ratios to single component fractions before mixing calculations."
      },
      {
        id: "ma-mistakes",
        name: "8. Common Mistakes to Avoid",
        formula: "<b>• Swapped ratio:</b> Inverting cheaper and dearer positions in the final cross subtraction.<br/><b>• Formula misuse:</b> Using the dilution formula when the replaced volume changes between steps.<br/><b>• unit mismatch:</b> Mixing paise and rupees or millilitres and litres without conversion.<br/><b>• addition of changes:</b> Adding successive replacement fractions instead of compounding them."
      },
      {
        id: "ma-placement-tips",
        name: "9. Placement Tips",
        formula: "<b>• Diagram First:</b> Always sketch the cross diagram immediately on paper — it is the fastest way to solve pricing mixtures.<br/><b>• Constant Check:</b> Verify if the replacement volume is constant to know if the shortcut dilution formula is applicable.<br/><b>• Weighted Average:</b> For 3+ ingredients mixed in known ratios, set up a simple weighted sum instead of trying multiple alligations."
      },
      {
        id: "ma-quick-sheet",
        name: "10. One-Page Quick Revision Sheet",
        formula: "<b>• Alligation ratio:</b> (Dearer − Mean) : (Mean − Cheaper)<br/><b>• Repeated dilution:</b> P × (1 − R/P)ⁿ<br/><b>• Weighted price:</b> ΣQᵢCᵢ / ΣQᵢ<br/><b>• Water CP:</b> Rs. 0<br/><b>• Mixture-mixture alligation:</b> Convert to % or fraction first"
      }
    ]
  },
  "time-speed-distance": {
    title: "Time, Speed & Distance",
    icon: "🚗",
    items: [
      {
        id: "tsd-definition",
        name: "1. Definition & Core Terms",
        formula: "<b>• Speed:</b> Distance covered per unit time. Speed = Distance / Time.<br/><b>• Relative Speed:</b> Speed of one object as observed from another moving object.<br/><b>&nbsp;&nbsp;- Same Direction:</b> Relative Speed = Speed₁ − Speed₂ (difference)<br/><b>&nbsp;&nbsp;- Opposite Direction:</b> Relative Speed = Speed₁ + Speed₂ (sum)<br/><b>• Average Speed:</b> Total distance / Total time (harmonic mean if distances are equal)."
      },
      {
        id: "tsd-formulae",
        name: "2. Important Formulae",
        formula: "<b>• Basic equations:</b> Speed = D/T; Distance = S × T; Time = D/S.<br/><b>• Unit Conversion:</b> km/hr to m/s ⟹ multiply by 5/18; m/s to km/hr ⟹ multiply by 18/5.<br/><b>• Average Speed (Equal Distances):</b> 2ab / (a+b) (harmonic mean of speeds a and b).<br/><b>• Average Speed (Equal Time):</b> (a+b+c+...) / n (arithmetic mean of speeds).<br/><b>• Time to meet (Opposite direction):</b> Distance / (Speed₁ + Speed₂).<br/><b>• Time to meet (Same direction chase):</b> Distance / (Speed₁ − Speed₂).<br/><b>• Distance from two times:</b> (s₁ × s₂ × |t₁ − t₂|) / |s₁ − s₂|.<br/><b>• Lateness/Fractional Speed:</b> Usual Time = T × a / (b−a) if speed becomes a/b of usual causing delay T."
      },
      {
        id: "tsd-concepts",
        name: "3. Important Concepts",
        formula: "<b>• harmonic Mean Trap:</b> Average speed is never the simple average of speeds when distances are equal but times differ.<br/><b>• Relative distance change:</b> In chase/meeting scenarios, relative distance closes at the sum or difference of speeds.<br/><b>• Constant Distance Invariant:</b> A 'lateness due to slower speed' problem always operates on a constant distance."
      },
      {
        id: "tsd-shortcuts",
        name: "4. Shortcut Tricks",
        formula: "<b>• Extra Distance Meeting:</b> Use d/s₁ = (d + extra)/s₂ to solve for base distance d directly.<br/><b>• Lateness Shortcut:</b> Use T × a/(b−a) directly for speed fraction a/b causing delay T.<br/><b>• Chase head-start:</b> Convert starting time gaps into an equivalent distance already covered before applying the relative speed formula."
      },
      {
        id: "tsd-calculations",
        name: "5. Quick Calculation Methods",
        formula: "<b>• Same Units:</b> Convert all speeds to km/hr or m/s before setting up equations.<br/><b>• Multi-stage tracking:</b> Track total distance and total time separately for trips with halts.<br/><b>• Target Lead/Trail:</b> Use Relative Speed = required gap / time for 'X km ahead/behind' problems."
      },
      {
        id: "tsd-rules",
        name: "6. Frequently Used Rules",
        formula: "<b>• Chase:</b> Time = Head start / (Pursuer Speed − Pursued Speed).<br/><b>• Meeting:</b> Time = Total distance / (Speed₁ + Speed₂).<br/><b>• Staggered Starts:</b> Resolve late starter's head start distance first before relative calculations."
      },
      {
        id: "tsd-remember",
        name: "7. Important Points to Remember",
        formula: "<b>• Average Speed:</b> Use harmonic mean 2ab/(a+b) for equal distance segments.<br/><b>• Invariants:</b> Exploit constant distance to link speed and time equations.<br/><b>• Halt Time:</b> Halt time adds to total elapsed time but contributes 0 to total distance."
      },
      {
        id: "tsd-mistakes",
        name: "8. Common Mistakes to Avoid",
        formula: "<b>• Arithmetic average:</b> Averaging speeds directly instead of using harmonic mean over equal distances.<br/><b>• conversion errors:</b> Forgetting to apply 5/18 or 18/5 factors when units are mixed.<br/><b>• direction swap:</b> Confusing sum (opposite) and difference (same) speeds in relative speed problems.<br/><b>• ignoring halts:</b> Not including halt/rest times in total journey time."
      },
      {
        id: "tsd-placement-tips",
        name: "9. Placement Tips",
        formula: "<b>• Memorize conversions:</b> Keep 5/18 and 18/5 conversion factors handy.<br/><b>• Lateness shortcut:</b> T × a/(b−a) is a highly frequent shortcut in campus placement tests.<br/><b>• Timelines:</b> Draw a quick number line for staggered start times to avoid head-start calculation mistakes."
      },
      {
        id: "tsd-quick-sheet",
        name: "10. One-Page Quick Revision Sheet",
        formula: "<b>• Speed:</b> D/T<br/><b>• km/hr ⟹ m/s:</b> × 5/18<br/><b>• m/s ⟹ km/hr:</b> × 18/5<br/><b>• Average Speed (Equal D):</b> 2ab/(a+b)<br/><b>• Meeting Time:</b> D / (S₁ + S₂)<br/><b>• Chase Time:</b> D / (S₁ − S₂)<br/><b>• Lateness Usual Time:</b> T × a / (b−a)"
      }
    ]
  },
  "permutation-combination": {
    title: "Permutation & Combination",
    icon: "🔀",
    items: [
      {
        id: "pc-definition",
        name: "1. Definition & Core Terms",
        formula: "<b>• Permutation:</b> An arrangement of objects in a specific order (order matters).<br/><b>• Combination:</b> A selection of objects where order does NOT matter.<br/><b>• Factorial (n!):</b> Product of all positive integers up to n. n! = n×(n−1)×...×1; 0! = 1."
      },
      {
        id: "pc-formulae",
        name: "2. Important Formulae",
        formula: "<b>• Permutation:</b> ⁿPᵣ = n! / (n−r)!.<br/><b>• Combination:</b> ⁿCᵣ = n! / [r! × (n−r)!].<br/><b>• Relation:</b> ⁿPᵣ = ⁿCᵣ × r!.<br/><b>• Symmetry:</b> ⁿCᵣ = ⁿC₍ₙ₋ᵣ₎; ⁿC₀ = ⁿCₙ = 1; ⁿC₁ = n.<br/><b>• Fundamental Counting Principle:</b> independent tasks together = m × n ways.<br/><b>• repetition allowed:</b> nʳ ways.<br/><b>• identical items arrangement:</b> n! / (p! × q! × r!).<br/><b>• Circular arrangement:</b> (n−1)!; mirror-identical ⟹ (n−1)! / 2.<br/><b>• subsets selection:</b> 2ⁿ total; non-empty ⟹ 2ⁿ − 1."
      },
      {
        id: "pc-concepts",
        name: "3. Important Concepts",
        formula: "<b>• Selection vs Arrangement:</b> Use combinations when order doesn't matter (teams, committees); permutations when order matters (seating, numbers, ranks).<br/><b>• Two-step processing:</b> Select groups first using combinations, then multiply by factorials to arrange them.<br/><b>• circular vs linear:</b> Circular divides by n because rotating the circle yields identical relative positions."
      },
      {
        id: "pc-shortcuts",
        name: "4. Shortcut Tricks",
        formula: "<b>• Letters together:</b> Treat the grouped items as ONE single block, arrange the block with other items, then multiply by internal block arrangements.<br/><b>• restricted position:</b> Count valid slots, arrange targeted items in those slots, then arrange others in remaining slots.<br/><b>• leading zero:</b> Hand-count leftmost digit restrictions for number formation containing 0."
      },
      {
        id: "pc-calculations",
        name: "5. Quick Calculation Methods",
        formula: "<b>• Factorials:</b> Memorize 1! to 10! for faster evaluation (e.g. 5! = 120, 6! = 720, 7! = 5040).<br/><b>• simplification:</b> Cancel common factors in fractions before computing full values (e.g. ¹⁰C₈ = ¹⁰C₂ = 45).<br/><b>• CRT approach:</b> Check remainders systematically for remainder puzzles."
      },
      {
        id: "pc-rules",
        name: "6. Frequently Used Rules",
        formula: "<b>• block rule:</b> Grouped items count as a single unit for outer arrangement.<br/><b>• sample space:</b> Total outcomes = nʳ (with replacement) or ⁿPᵣ/ⁿCᵣ (without replacement).<br/><b>• unlabelled equal groups:</b> Divide the labelled grouping count by g! where g is the number of equal groups to avoid overcounting."
      },
      {
        id: "pc-remember",
        name: "7. Important Points to Remember",
        formula: "<b>• 0! = 1:</b> Factorial of zero is always 1.<br/><b>• leading digit:</b> A number cannot have 0 as its leftmost digit.<br/><b>• large r symmetry:</b> Simplify ⁿCᵣ to ⁿC₍ₙ₋ᵣ₎ when r > n/2."
      },
      {
        id: "pc-mistakes",
        name: "8. Common Mistakes to Avoid",
        formula: "<b>• Swapped formulae:</b> Using permutations for selection only or combinations for arrangements.<br/><b>• missing arrangement:</b> Forgetting to arrange after selecting components.<br/><b>• duplicated letters:</b> Not dividing by duplicate factorials in word permutations.<br/><b>• circular vs linear:</b> Forgetting to subtract 1 in circular arrangements."
      },
      {
        id: "pc-placement-tips",
        name: "9. Placement Tips",
        formula: "<b>• Category check:</b> Ask if order matters immediately to choose P or C.<br/><b>• duplicates:</b> Count repeated letters first in word permutation questions.<br/><b>• rank word:</b> Systematically cross off letters position by position in rank questions."
      },
      {
        id: "pc-quick-sheet",
        name: "10. One-Page Quick Revision Sheet",
        formula: "<b>• ⁿPᵣ:</b> n!/(n−r)!<br/><b>• ⁿCᵣ:</b> n!/[r!(n−r)!]<br/><b>• Circular:</b> (n−1)!<br/><b>• Flip-symmetric:</b> (n−1)!/2<br/><b>• duplicates:</b> n! / (p!q!...)<br/><b>• subsets:</b> 2ⁿ − 1<br/><b>• fixed order of k:</b> n!/k!"
      }
    ]
  },
  "mean-median-mode": {
    title: "Mean, Median & Mode",
    icon: "📊",
    items: [
      {
        id: "mmm-defs",
        name: "1. Standard Formulas",
        formula: "• Mean = Sum of observations / Number of observations<br/>• Median: Middle value when sorted. (If n is odd: term (n+1)/2. If n is even: average of n/2 and (n/2)+1 terms)<br/>• Mode: Most frequently occurring value in the dataset."
      },
      {
        id: "mmm-relation",
        name: "2. Empirical Relationship",
        formula: "Mode = 3 Median - 2 Mean",
        example: {
          q: "In a dataset, Mean is 15 and Median is 16. Find the Mode.",
          steps: [
            "Using empirical formula: Mode = 3 Median - 2 Mean",
            "Mode = 3(16) - 2(15)",
            "Mode = 48 - 30 = 18"
          ],
          ans: "18"
        }
      }
    ]
  },
  "data-interpretation": {
    title: "Data Interpretation",
    icon: "📉",
    items: [
      {
        id: "di-basics",
        name: "1. Core Strategies",
        formula: "• Identify the units and scales of the axis immediately.<br/>• Focus on percentage differences, ratios, and averages which form the bulk of DI questions."
      }
    ]
  },
  "pie-chart": {
    title: "Pie Chart",
    icon: "⚪",
    items: [
      {
        id: "pc-degrees-percent",
        name: "1. Degrees to Percentages Conversion",
        formula: "• Total Angle = 360° = 100%<br/>• Value = (Angle / 360°) × Total Value<br/>• Angle = (Percentage / 100) × 360°",
        example: {
          q: "An expense sector corresponds to 72° in a pie chart. What percentage of total expense is this?",
          steps: [
            "Using conversion: Percentage = (Angle / 360) × 100",
            "Percentage = (72 / 360) × 100",
            "Percentage = (1 / 5) × 100 = 20%"
          ],
          ans: "20%"
        }
      }
    ]
  },
  "graphical-chart": {
    title: "Graphical Chart",
    icon: "📊",
    items: [
      {
        id: "gc-reading",
        name: "1. Line & Bar Graphs",
        formula: "Read values accurately. Commonly tests Year-on-Year Growth Rate = [(New Value - Old Value) / Old Value] × 100"
      }
    ]
  },
  "simple-arithmetic": {
    title: "Simple Arithmetic",
    icon: "➕",
    items: [
      {
        id: "sa-bodmas",
        name: "1. BODMAS Rule",
        formula: "Order of evaluation: Bracket -> Of -> Division -> Multiplication -> Addition -> Subtraction"
      },
      {
        id: "sa-surds-indices",
        name: "2. Surds & Indices Laws",
        formula: "• a^m × a^n = a^(m+n)<br/>• (a^m)^n = a^(mn)<br/>• a^(-n) = 1 / a^n<br/>• √a × √b = √ab"
      }
    ]
  },
  "averages": {
    title: "Average",
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
  }
};

export default aptitudeData;
