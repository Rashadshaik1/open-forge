/**
 * GVPCE Department / Branch Codes Map
 */
export const DEPARTMENT_CODES = {
  '10': 'Computer Science & Engineering (CSE)',
  '11': 'Information Technology (IT)',
  '12': 'Electronics & Communication Engineering (ECE)',
  '14': 'Electrical & Electronics Engineering (EEE)',
  '20': 'Mechanical Engineering',
  '08': 'Civil Engineering',
  '02': 'Chemical Engineering',
  '82': 'CSE (Artificial Intelligence & Machine Learning)',
  '83': 'CSE (Data Science)',
  '37': 'CSE (Cyber Security)',
  '84': 'Mechanical Robotics(MRB)',
};

export const BRANCH_CODES = DEPARTMENT_CODES;

/**
 * Calculates current study year based on joining year:
 * - 2025 joiners -> 1st Year
 * - 2024 joiners -> 2nd Year
 * - 2023 joiners -> 3rd Year
 * - 2022 joiners -> 4th Year
 * - Prior joiners -> Graduated
 *
 * @param {number|null} joiningYear
 * @param {Date} [referenceDate=new Date()]
 * @returns {string}
 */
export function calculateStudyYear(joiningYear, referenceDate = new Date()) {
  if (!joiningYear || typeof joiningYear !== 'number') {
    return '';
  }

  // Explicit study year rules
  const explicitYears = {
    2025: '1st Year',
    2024: '2nd Year',
    2023: '3rd Year',
    2022: '4th Year',
  };

  if (explicitYears[joiningYear]) {
    return explicitYears[joiningYear];
  }

  if (joiningYear < 2022) {
    return 'Graduated';
  }

  // Dynamic fallback for future academic years
  const currentCalendarYear = referenceDate.getFullYear();
  const currentMonth = referenceDate.getMonth();
  const currentAcademicYear =
    currentMonth >= 6 ? currentCalendarYear : currentCalendarYear - 1;

  const yearDiff = currentAcademicYear - joiningYear + 1;

  if (yearDiff === 1) return '1st Year';
  if (yearDiff === 2) return '2nd Year';
  if (yearDiff === 3) return '3rd Year';
  if (yearDiff === 4) return '4th Year';
  if (yearDiff > 4) return 'Graduated';
  return 'Upcoming';
}

/**
 * Parses a 12-digit GVPCE roll number or email.
 *
 * Structure Breakdown (e.g. 324103311037):
 * - '3'     -> University Code
 * - '24'    -> Joining Year (2024)
 * - '1033'  -> College Identifier
 * - '11'    -> Department / Branch Code
 * - '037'   -> Student Unique Number
 *
 * Regex: ^3(\d{2})1033(\d{2})(\d{3})$
 *
 * @param {string} input - Roll number or institutional email
 * @param {Date} [referenceDate=new Date()] - Optional reference date
 * @returns {{
 *   isValid: boolean,
 *   rollNumber: string,
 *   branch: string,
 *   joiningYear: number | null,
 *   currentYear: string
 * }}
 */
export function parseGvpceRoll(input, referenceDate = new Date()) {
  const originalInput = typeof input === 'string' ? input : '';

  if (!originalInput) {
    return {
      isValid: false,
      rollNumber: '',
      branch: '',
      joiningYear: null,
      currentYear: '',
    };
  }

  // Clean input: trim spaces and extract part before '@' if email
  const cleaned = originalInput.trim().split('@')[0];

  // Validate format using exact regex: ^3(\d{2})1033(\d{2})(\d{3})$
  const rollRegex = /^3(\d{2})1033(\d{2})(\d{3})$/;
  const match = cleaned.match(rollRegex);

  if (!match) {
    return {
      isValid: false,
      rollNumber: originalInput,
      branch: '',
      joiningYear: null,
      currentYear: '',
    };
  }

  // Extraction logic:
  // match[1]: Year of joining (e.g. '24' -> 2024)
  // match[2]: Branch code (e.g. '11' -> 'Information Technology (IT)')
  // match[3]: Student unique number (e.g. '037')
  const joiningYear = 2000 + parseInt(match[1], 10);
  const branchCode = match[2];
  const branch = DEPARTMENT_CODES[branchCode] || '';
  const isValid = Boolean(branch);

  const currentYear = isValid ? calculateStudyYear(joiningYear, referenceDate) : '';

  return {
    isValid,
    rollNumber: cleaned,
    branch,
    joiningYear: isValid ? joiningYear : null,
    currentYear,
  };
}

export default parseGvpceRoll;
