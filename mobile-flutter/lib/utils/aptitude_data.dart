class AptitudeTopicInfo {
  final String id;
  final String title;
  final String icon;
  final List<AptitudeItem> items;

  const AptitudeTopicInfo({
    required this.id,
    required this.title,
    required this.icon,
    required this.items,
  });
}

class AptitudeItem {
  final String id;
  final String name;
  final String formula;
  final String? note;
  final AptitudeExample? example;

  const AptitudeItem({
    required this.id,
    required this.name,
    required this.formula,
    this.note,
    this.example,
  });
}

class AptitudeExample {
  final String question;
  final List<String> steps;
  final String answer;

  const AptitudeExample({
    required this.question,
    required this.steps,
    required this.answer,
  });
}

class AptitudeDataRepository {
  static const List<Map<String, String>> allTopics = [
    {'id': 'lcm-hcf', 'title': 'LCM & HCF', 'icon': '🔢'},
    {'id': 'divisibility-remainder', 'title': 'Divisibility & Remainder', 'icon': '➗'},
    {'id': 'problems-ages', 'title': 'Problems on Ages', 'icon': '👴'},
    {'id': 'probability', 'title': 'Probability', 'icon': '🎲'},
    {'id': 'equation', 'title': 'Equations & Word Problems', 'icon': '🟰'},
    {'id': 'series-progression', 'title': 'Series & Progression (AP/GP)', 'icon': '📈'},
    {'id': 'mensuration', 'title': 'Mensuration 2D & 3D', 'icon': '📐'},
    {'id': 'geometry-perimeter', 'title': 'Geometry & Perimeter', 'icon': '📏'},
    {'id': 'percentages', 'title': 'Percentages', 'icon': '🎯'},
    {'id': 'profit-loss', 'title': 'Profit & Loss', 'icon': '💰'},
    {'id': 'time-work', 'title': 'Time & Work', 'icon': '⏳'},
    {'id': 'clocks-calendar', 'title': 'Clocks & Calendars', 'icon': '⏰'},
    {'id': 'ratio-proportion', 'title': 'Ratio & Proportion', 'icon': '⚖️'},
    {'id': 'mixture-alligation', 'title': 'Mixtures & Alligations', 'icon': '🧪'},
    {'id': 'time-speed-distance', 'title': 'Time, Speed & Distance', 'icon': '🚀'},
    {'id': 'permutation-combination', 'title': 'Permutations & Combinations', 'icon': '🧩'},
    {'id': 'mean-median-mode', 'title': 'Mean, Median & Mode', 'icon': '📊'},
    {'id': 'data-interpretation', 'title': 'Data Interpretation', 'icon': '📋'},
    {'id': 'pie-chart', 'title': 'Pie Charts', 'icon': '🥧'},
    {'id': 'graphical-chart', 'title': 'Bar & Line Charts', 'icon': '📉'},
    {'id': 'simple-arithmetic', 'title': 'Simple Arithmetic', 'icon': '➕'},
    {'id': 'averages', 'title': 'Averages', 'icon': '⚖️'},
  ];

  static Map<String, List<Map<String, dynamic>>> getCheatsheets() {
    return {
      'lcm-hcf': [
        {
          'name': '1. Core Concepts & Properties',
          'formula': '• HCF (GCD): Highest common factor that divides given numbers without remainder.\n• LCM: Smallest positive integer divisible by all given numbers.\n• Product Rule (Only for 2 numbers): HCF(a, b) × LCM(a, b) = a × b\n• HCF of Fractions = (HCF of Numerators) ÷ (LCM of Denominators)\n• LCM of Fractions = (LCM of Numerators) ÷ (HCF of Denominators)',
          'example': 'If HCF is 11 and LCM is 693 for two numbers where one is 77, other = (11 × 693) / 77 = 99.',
          'shortcuts': '• Co-prime numbers always have HCF = 1.\n• Clocks/Bells meeting time: Always compute LCM of individual time periods.'
        },
        {
          'name': '2. Remainder Theorems for HCF/LCM',
          'formula': '• Largest number dividing x, y, z leaving remainders r1, r2, r3: HCF(x - r1, y - r2, z - r3)\n• Largest number leaving SAME remainder r in each case: HCF(|x - y|, |y - z|, |z - x|)\n• Least number divisible leaving remainder r in each case: LCM(x, y, z) + r',
          'shortcuts': 'Subtract remainder BEFORE taking HCF. Add remainder AFTER taking LCM.'
        }
      ],
      'divisibility-remainder': [
        {
          'name': '1. Standard Divisibility Rules',
          'formula': '• By 3/9: Sum of digits is divisible by 3 or 9.\n• By 4: Last 2 digits form a multiple of 4.\n• By 8: Last 3 digits form a multiple of 8.\n• By 11: |(Sum of odd position digits) - (Sum of even position digits)| is 0 or multiple of 11.\n• By 25: Last two digits are 00, 25, 50, or 75.',
          'shortcuts': 'Unit digit cycles repeat every 1, 2, or 4 steps. For aⁿ mod 10, reduce exponent mod 4.'
        },
        {
          'name': '2. Fermat & Wilson Theorems',
          'formula': '• Fermat Little Theorem: If p is prime & gcd(a, p)=1, then a^(p-1) ≡ 1 (mod p).\n• Wilson Theorem: If p is prime, (p-1)! ≡ -1 ≡ (p-1) (mod p).\n• Number of Divisors: If N = p1^a * p2^b * p3^c, total divisors = (a+1)(b+1)(c+1).',
          'example': 'Find 5^100 mod 13: 100 = 12*8 + 4 => 5^4 = 625 = 13*48 + 1 => Remainder is 1.'
        }
      ],
      'problems-ages': [
        {
          'name': '1. Core Age Rules & Shift Equations',
          'formula': '• If present age = x, age n years ago = (x - n), age n years hence = (x + n).\n• Age difference between two individuals remains CONSTANT throughout life.\n• If ratio of ages is a:b, take ages as ak and bk. After t years: (ak + t)/(bk + t) = c/d.',
          'example': 'Father is 3 times son age. After 5 years, ratio is 5:2. (3x+5)/(x+5) = 5/2 => 6x + 10 = 5x + 25 => x = 15. Father = 45, Son = 15.',
          'shortcuts': 'Use cross-multiplication or test option values (back-substitution) to save algebra time.'
        }
      ],
      'probability': [
        {
          'name': '1. Fundamentals & Addition/Multiplication',
          'formula': '• P(E) = Favorable Outcomes ÷ Total Outcomes (Sample Space S)\n• Complement: P(Not E) = 1 - P(E)\n• Independent Events: P(A ∩ B) = P(A) × P(B)\n• At least one event occurs = 1 - P(None occurs) = 1 - (1 - p1)(1 - p2)...(1 - pn)',
          'example': 'Probability of getting sum = 7 with two dice: Favorable = {(1,6),(2,5),(3,4),(4,3),(5,2),(6,1)} = 6. Total = 36. P = 6/36 = 1/6.',
          'shortcuts': 'Deck of cards: 52 total, 4 suits (13 each), 12 Face cards (4 J, 4 Q, 4 K), 4 Aces (Ace is NOT a face card).'
        }
      ],
      'percentages': [
        {
          'name': '1. Base Fractions & Successive Changes',
          'formula': '• 1/2 = 50%, 1/3 = 33.33%, 1/4 = 25%, 1/5 = 20%, 1/6 = 16.67%, 1/8 = 12.5%, 1/9 = 11.11%, 1/12 = 8.33%.\n• Successive % change of a% and b%: Net = [a + b + (ab/100)]%\n• If price increases by r%, consumption must decrease by [r / (100 + r)] × 100% to keep expenditure constant.',
          'example': 'If salary increases by 20% then decreases by 20%, net change = +20 - 20 - (400/100) = -4% (4% loss).',
          'shortcuts': 'Converting percentages to fractions simplifies mental calculation by 4x.'
        }
      ],
      'profit-loss': [
        {
          'name': '1. Gain, Loss, Discount & False Weights',
          'formula': '• Gain% = (Gain / CP) × 100%\n• Loss% = (Loss / CP) × 100%\n• SP = CP × (100 + Gain%) / 100\n• Marked Price (MP): Discount% = (Discount / MP) × 100%\n• False Weight Gain% = [Error / (True Value - Error)] × 100%',
          'example': 'Dishonest shopkeeper uses 900g instead of 1kg: Gain% = [100 / (1000 - 100)] × 100 = 100/900 × 100 = 11.11%.',
          'shortcuts': 'If two items sold at same SP, one at x% gain and other at x% loss, overall is ALWAYS a loss of (x/10)² %.'
        }
      ],
      'time-work': [
        {
          'name': '1. Unitary Work, Efficiency & Pipes',
          'formula': '• If A does work in x days and B in y days, together they take (x × y) / (x + y) days.\n• Man-Days Formula: (M1 × D1 × H1) / W1 = (M2 × D2 × H2) / W2\n• Efficiency ∝ 1 / Time. If A is twice as fast as B, A takes half the time of B.\n• Pipes & Cisterns: Inlet fills at 1/x per hour, outlet empties at 1/y per hour. Net = 1/x - 1/y.',
          'example': '12 men complete work in 10 days working 8 hrs/day. Men needed for 6 days at 10 hrs/day: (12*10*8) = (M2*6*10) => 960 = 60 M2 => M2 = 16 men.'
        }
      ],
      'time-speed-distance': [
        {
          'name': '1. Speed Conversion, Relative Speed & Trains',
          'formula': '• Conversion: 1 km/h = 5/18 m/s; 1 m/s = 18/5 km/h.\n• Average Speed = Total Distance / Total Time. For equal distances at x and y km/h: Avg = 2xy / (x + y).\n• Relative Speed (Same direction) = u - v; (Opposite direction) = u + v.\n• Train crossing platform/bridge of length L: Distance = Length of Train + L.',
          'example': 'Train length 150m at 54 km/h crosses 250m platform. Speed = 54 × 5/18 = 15 m/s. Total dist = 400m. Time = 400/15 = 26.67 sec.'
        }
      ],
      'ratio-proportion': [
        {
          'name': '1. Ratio Rules & Proportions',
          'formula': '• Duplicate ratio of a:b = a²:b²; Sub-duplicate = √a : √b.\n• Fourth proportional to a, b, c = (b × c) / a.\n• Mean proportional between a and b = √(a × b).\n• If A:B = 2:3 and B:C = 4:5, combine via LCM of B: A:B:C = 8:12:15.'
        }
      ],
      'mixture-alligation': [
        {
          'name': '1. Rule of Alligation',
          'formula': '• (Quantity of Cheaper) / (Quantity of Dearer) = (Price of Dearer - Mean Price) / (Mean Price - Price of Cheaper)\n• Replacement Formula: If x units of liquid are replaced by water n times from container with total capacity C:\n  Remaining Liquid = Initial × (1 - x/C)ⁿ',
          'example': 'From 40L milk, 4L removed and replaced with water twice: Remaining milk = 40 × (1 - 4/40)² = 40 × (0.9)² = 32.4 Liters.'
        }
      ],
      'permutation-combination': [
        {
          'name': '1. Counting Principles & Arrangements',
          'formula': '• Permutation (Order matters): ⁿPᵣ = n! / (n - r)!\n• Combination (Selection): ⁿCᵣ = n! / [r! (n - r)!]\n• Circular Permutations: (n - 1)! for distinct objects, (n - 1)! / 2 for necklaces/beads.\n• Handshake formula: n people shaking hands = ⁿC₂ = n(n - 1) / 2.',
          'example': 'Ways to arrange letters of "SUCCESS": Total 7 letters (S=3, C=2, U=1, E=1) => 7! / (3! × 2!) = 5040 / 12 = 420 ways.'
        }
      ],
      'clocks-calendar': [
        {
          'name': '1. Clock Angles & Calendar Odd Days',
          'formula': '• Angle between clock hands at H hours and M minutes: θ = |30H - (11/2)M|\n• Hands coincide 11 times in 12 hours (22 times in 24 hours).\n• Ordinary year = 365 days = 52 weeks + 1 odd day.\n• Leap year = 366 days = 52 weeks + 2 odd days.\n• 100 years = 5 odd days, 200 years = 3, 300 years = 1, 400 years = 0 odd days.',
          'example': 'Angle at 3:30: θ = |30(3) - 5.5(30)| = |90 - 165| = 75°.'
        }
      ],
      'mensuration': [
        {
          'name': '1. 2D Area & 3D Volume Handbooks',
          'formula': '• Circle: Area = πr², Circumference = 2πr\n• Triangle: Area = 1/2 × b × h or √[s(s-a)(s-b)(s-c)] where s = (a+b+c)/2\n• Cylinder: Volume = πr²h, Curved Surface Area = 2πrh, Total Area = 2πr(r + h)\n• Sphere: Volume = (4/3)πr³, Surface Area = 4πr²\n• Cone: Volume = (1/3)πr²h, Slant height l = √(r² + h²)',
          'shortcuts': 'If radius of circle increases by x%, Area increases by [2x + (x²/100)]%.'
        }
      ],
      'geometry-perimeter': [
        {
          'name': '1. Polygon Angles & Pythagoras Theorems',
          'formula': '• Sum of interior angles of n-sided polygon = (n - 2) × 180°\n• Each interior angle of regular polygon = [(n - 2) × 180°] / n\n• Sum of exterior angles of ANY polygon = 360°\n• Number of diagonals in polygon = n(n - 3) / 2\n• Pythagoras Theorem: Hypotenuse² = Base² + Perpendicular² (Triplets: 3,4,5 | 5,12,13 | 8,15,17 | 7,24,25).'
        }
      ],
      'series-progression': [
        {
          'name': '1. AP, GP & Natural Sums',
          'formula': '• AP nth term: Tₙ = a + (n - 1)d\n• AP Sum: Sₙ = (n/2)[2a + (n - 1)d] = (n/2)(first + last)\n• GP nth term: Tₙ = a · rⁿ⁻¹\n• GP Sum: Sₙ = a(rⁿ - 1) / (r - 1)\n• Sum of first n natural numbers = n(n + 1) / 2\n• Sum of first n squares = n(n + 1)(2n + 1) / 6\n• Sum of first n cubes = [n(n + 1) / 2]²'
        }
      ],
      'averages': [
        {
          'name': '1. Average Formulae & Weighting',
          'formula': '• Average = (Sum of all observations) ÷ (Total number of observations)\n• Weighted Average = (w1·x1 + w2·x2 + ... + wn·xn) / (w1 + w2 + ... + wn)\n• Replacement rule: New member age/weight = Excluded + (Number of members × Change in Average)',
          'example': 'Average age of 24 students is 15. If teacher age included, average becomes 16: Teacher age = 15 + 25 × (1) = 40 years.'
        }
      ],
      'equation': [
        {
          'name': '1. Algebraic Word Problems & Simultaneous Systems',
          'formula': '• Two-digit number with tens digit x and units digit y = 10x + y; Reversing digits = 10y + x.\n• Difference between original and reversed two-digit number = 9(x - y).\n• Sum of two numbers S and difference D: Larger = (S + D) / 2; Smaller = (S - D) / 2.',
          'example': 'Sum of 2 numbers is 40 and difference is 12. Larger = (40+12)/2 = 26. Smaller = (40-12)/2 = 14.'
        }
      ],
      'mean-median-mode': [
        {
          'name': '1. Statistical Measures & Empirical Formula',
          'formula': '• Mean: Arithmetic average of all values.\n• Median: Middle value of sorted data. For even n, average of (n/2)th and (n/2 + 1)th items.\n• Mode: Most frequently occurring value in data set.\n• Empirical Relationship: Mode = 3 × Median - 2 × Mean'
        }
      ],
      'data-interpretation': [
        {
          'name': '1. Tables, Line Graphs & Calculation Strategies',
          'formula': '• Percentage Growth YoY = [(Current Year - Base Year) / Base Year] × 100%\n• Ratio calculation: Compare totals before dividing decimals.\n• Approximations: Round numbers to 2 significant digits for rapid elimination of choices.'
        }
      ],
      'pie-chart': [
        {
          'name': '1. Degrees vs Percentages in Pie Charts',
          'formula': '• Total Angle in Pie Chart = 360° = 100%.\n• Conversion: 1% = 3.6°; Angle θ = (% Value / 100) × 360°.\n• Value of Sector = (Central Angle / 360°) × Total Value.'
        }
      ],
      'graphical-chart': [
        {
          'name': '1. Bar Graphs & Frequency Histograms',
          'formula': '• Total Aggregate = Sum of height of all bars.\n• Average per category = Aggregate ÷ Number of categories.\n• Relative share of category X = (Height of X ÷ Total Aggregate) × 100%.'
        }
      ],
      'simple-arithmetic': [
        {
          'name': '1. BODMAS / PEMDAS Order of Operations',
          'formula': '• Brackets > Orders/Exponents > Division & Multiplication (Left to Right) > Addition & Subtraction (Left to Right).\n• Fractions simplification: Cross-multiply fractions to compare: a/b vs c/d -> a*d vs b*c.\n• Decimals: (0.2)³ = 0.008; √0.09 = 0.3; √0.0016 = 0.04.'
        }
      ]
    };
  }
}
