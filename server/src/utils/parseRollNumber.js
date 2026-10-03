// server/src/utils/parseRollNumber.js

// Standard AU / GVP branch code mapping
const BRANCH_CODES = {
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
  '83': 'Mechanical Robotics(MRB)',
};

export const parseRollNumber = (identifier) => {
  if (!identifier || typeof identifier !== 'string') {
    return {
      isValid: false,
      rollNumber: '',
      department: 'General',
      joiningYear: null,
      currentYear: 'General',
    };
  }

  // Extract roll if full email was supplied (e.g. 324103311051@gvpce.ac.in)
  const raw = identifier.includes('@') ? identifier.split('@')[0] : identifier;
  const roll = raw.trim();

  // Pattern:
  // ^3            -> Starts with 3
  // (\d{2})       -> Group 1: 2 digits joining year (e.g. 24)
  // 1033          -> 4 digits college code
  // (\d{2})       -> Group 2: 2 digits branch code (e.g. 11 for IT, 10 for CSE)
  // (\d{3})$      -> 3 digits student sequence number
  const regex = /^3(\d{2})1033(\d{2})(\d{3})$/;
  const match = roll.match(regex);

  if (!match) {
    return {
      isValid: false,
      rollNumber: roll,
      department: 'Other',
      joiningYear: null,
      currentYear: 'Other',
    };
  }

  const [_, yearDigits, branchCode] = match;
  const joiningYear = 2000 + parseInt(yearDigits, 10);
  const department = BRANCH_CODES[branchCode] || `Engineering (Code ${branchCode})`;

  // Calculate year of study (Academic year turnovers in July)
  const now = new Date();
  const calendarYear = now.getFullYear();
  const academicOffset = (now.getMonth() + 1) >= 7 ? 0 : -1;
  const yearDiff = calendarYear - joiningYear + academicOffset + 1;

  const yearMap = {
    1: '1st Year',
    2: '2nd Year',
    3: '3rd Year',
    4: '4th Year',
  };

  const currentYear = yearMap[yearDiff] || (yearDiff > 4 ? 'Alumni' : '1st Year');

  return {
    isValid: true,
    rollNumber: roll,
    department,
    joiningYear,
    currentYear,
  };
};