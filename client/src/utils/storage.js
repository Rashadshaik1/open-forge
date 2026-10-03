import { parseGvpceRoll } from './parseRollNumber.js';

export const STORAGE_KEY_STUDENTS = 'openforge_registered_students';
export const STORAGE_KEY_CHECKINS = 'openforge_checkins';
export const STORAGE_EVENT_NAME = 'openforge_storage_update';

// Realistic initial dataset for campus demo
const DEFAULT_STUDENTS = [
  {
    id: 1,
    name: 'Rashad Shaik',
    rollNumber: '324103311037',
    email: '324103311037@gvpce.ac.in',
    department: 'Information Technology (IT)',
    year: '2nd Year',
    status: 'Attended',
    checkedInTime: '10:04 AM',
    registeredEvent: 'Sherlock: Next Chapter',
  },
  {
    id: 2,
    name: 'Ananya Sharma',
    rollNumber: '324103310042',
    email: '324103310042@gvpce.ac.in',
    department: 'Computer Science & Engineering (CSE)',
    year: '2nd Year',
    status: 'Attended',
    checkedInTime: '10:12 AM',
    registeredEvent: 'Sherlock: Next Chapter',
  },
  {
    id: 3,
    name: 'Karthik Varma',
    rollNumber: '323103312019',
    email: '323103312019@gvpce.ac.in',
    department: 'Electronics & Communication Engineering (ECE)',
    year: '3rd Year',
    status: 'Attended',
    checkedInTime: '10:15 AM',
    registeredEvent: 'OpenForge Orientation & Club Day',
  },
  {
    id: 4,
    name: 'Priya Nambiar',
    rollNumber: '325103314055',
    email: '325103314055@gvpce.ac.in',
    department: 'Electrical & Electronics Engineering (EEE)',
    year: '1st Year',
    status: 'Registered',
    checkedInTime: null,
    registeredEvent: 'Sherlock: Next Chapter',
  },
  {
    id: 5,
    name: 'Aditya Kumar',
    rollNumber: '324103382023',
    email: '324103382023@gvpce.ac.in',
    department: 'CSE (Artificial Intelligence & Machine Learning)',
    year: '2nd Year',
    status: 'Attended',
    checkedInTime: '10:22 AM',
    registeredEvent: 'Sherlock: Next Chapter',
  },
  {
    id: 6,
    name: 'Sneha Patel',
    rollNumber: '324103383011',
    email: '324103383011@gvpce.ac.in',
    department: 'CSE (Data Science)',
    year: '2nd Year',
    status: 'Registered',
    checkedInTime: null,
    registeredEvent: 'Web Dev Bootcamp',
  },
  {
    id: 7,
    name: 'Rohan Joshi',
    rollNumber: '322103320088',
    email: '322103320088@gvpce.ac.in',
    department: 'Mechanical Engineering',
    year: '4th Year',
    status: 'Attended',
    checkedInTime: '10:28 AM',
    registeredEvent: 'OpenForge Orientation & Club Day',
  },
  {
    id: 8,
    name: 'Meera Nair',
    rollNumber: '324103308005',
    email: '324103308005@gvpce.ac.in',
    department: 'Civil Engineering',
    year: '2nd Year',
    status: 'Registered',
    checkedInTime: null,
    registeredEvent: 'Sherlock: Next Chapter',
  },
  {
    id: 9,
    name: 'Vikram Seth',
    rollNumber: '323103311094',
    email: '323103311094@gvpce.ac.in',
    department: 'Information Technology (IT)',
    year: '3rd Year',
    status: 'Attended',
    checkedInTime: '10:35 AM',
    registeredEvent: 'Sherlock: Next Chapter',
  },
  {
    id: 10,
    name: 'Kavya Reddy',
    rollNumber: '324103312061',
    email: '324103312061@gvpce.ac.in',
    department: 'Electronics & Communication Engineering (ECE)',
    year: '2nd Year',
    status: 'Registered',
    checkedInTime: null,
    registeredEvent: 'Hackathon 2026: AI & Cloud',
  },
];

const DEFAULT_CHECKINS = [
  {
    id: 1,
    name: 'Aditya Kumar',
    rollNumber: '324103382023',
    department: 'CSE (Artificial Intelligence & Machine Learning)',
    timestamp: '10:22 AM',
  },
  {
    id: 2,
    name: 'Karthik Varma',
    rollNumber: '323103312019',
    department: 'Electronics & Communication Engineering (ECE)',
    timestamp: '10:15 AM',
  },
  {
    id: 3,
    name: 'Ananya Sharma',
    rollNumber: '324103310042',
    department: 'Computer Science & Engineering (CSE)',
    timestamp: '10:12 AM',
  },
  {
    id: 4,
    name: 'Rashad Shaik',
    rollNumber: '324103311037',
    department: 'Information Technology (IT)',
    timestamp: '10:04 AM',
  },
];

/**
 * Dispatch storage update event for reactive components in current tab
 */
function emitStorageUpdate(detail) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(STORAGE_EVENT_NAME, { detail }));
  }
}

/**
 * Retrieve all registered students from localStorage (or seed default)
 */
export function getRegisteredStudents() {
  if (typeof window === 'undefined') return DEFAULT_STUDENTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_STUDENTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(DEFAULT_STUDENTS));
      return DEFAULT_STUDENTS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error parsing stored students:', e);
    return DEFAULT_STUDENTS;
  }
}

/**
 * Retrieve recent check-in log entries from localStorage (or seed default)
 */
export function getRecentCheckIns() {
  if (typeof window === 'undefined') return DEFAULT_CHECKINS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CHECKINS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_CHECKINS, JSON.stringify(DEFAULT_CHECKINS));
      return DEFAULT_CHECKINS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error parsing stored check-ins:', e);
    return DEFAULT_CHECKINS;
  }
}

/**
 * Add or update a registered student.
 * If user registers on /register or registers for an event on /dashboard,
 * this function saves their parsed details and notifies listeners.
 */
export function registerStudent(studentInput) {
  const currentStudents = getRegisteredStudents();

  // Try to parse roll number details if not explicitly provided
  const rollSource = studentInput.rollNumber || studentInput.email || '';
  const parsed = parseGvpceRoll(rollSource);

  const rollNumber = parsed.isValid
    ? parsed.rollNumber
    : (studentInput.rollNumber || (studentInput.email ? studentInput.email.split('@')[0] : '324103311099'));

  const department = studentInput.department || (parsed.isValid ? parsed.branch : 'Information Technology (IT)');
  const year = studentInput.year || (parsed.isValid ? parsed.currentYear : '2nd Year');
  const email = studentInput.email || `${rollNumber}@gvpce.ac.in`;
  const name = studentInput.name || 'GVPCE Innovator';
  const registeredEvent = studentInput.eventTitle || studentInput.registeredEvent || 'Sherlock: Next Chapter';

  // Check if student already exists
  const existingIndex = currentStudents.findIndex(
    (s) =>
      s.rollNumber?.toUpperCase() === rollNumber.toUpperCase() ||
      s.email?.toLowerCase() === email.toLowerCase()
  );

  let updatedList;
  let savedStudent;

  if (existingIndex >= 0) {
    // Update existing student
    const existing = currentStudents[existingIndex];
    savedStudent = {
      ...existing,
      name: name || existing.name,
      department: department || existing.department,
      year: year || existing.year,
      registeredEvent: registeredEvent || existing.registeredEvent,
    };
    updatedList = [...currentStudents];
    updatedList[existingIndex] = savedStudent;
  } else {
    // Add new student at top
    savedStudent = {
      id: Date.now(),
      name,
      rollNumber,
      email,
      department,
      year,
      status: studentInput.status || 'Registered',
      checkedInTime: studentInput.checkedInTime || null,
      registeredEvent,
    };
    updatedList = [savedStudent, ...currentStudents];
  }

  try {
    localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(updatedList));
    emitStorageUpdate({ type: 'STUDENT_REGISTERED', student: savedStudent });
  } catch (e) {
    console.error('Failed to write student to localStorage:', e);
  }

  return savedStudent;
}

/**
 * Mark a student as Attended.
 * Updates both the student entry and check-in timeline.
 */
export function markStudentAttended(rollOrEmail, customTime = null) {
  const currentStudents = getRegisteredStudents();
  const searchKey = String(rollOrEmail).trim().toUpperCase();

  const timeString =
    customTime ||
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Match by rollNumber, email, or ticket substring
  let found = false;
  let updatedStudent = null;

  const updatedStudents = currentStudents.map((s) => {
    const sRoll = (s.rollNumber || '').toUpperCase();
    const sEmail = (s.email || '').toUpperCase();

    if (
      sRoll === searchKey ||
      sEmail === searchKey ||
      searchKey.includes(sRoll) ||
      (sRoll && searchKey.endsWith(sRoll.slice(-4)))
    ) {
      found = true;
      updatedStudent = {
        ...s,
        status: 'Attended',
        checkedInTime: s.checkedInTime || timeString,
      };
      return updatedStudent;
    }
    return s;
  });

  // If student was not found in directory, auto-enroll them as Attended using parseGvpceRoll
  if (!found) {
    const parsed = parseGvpceRoll(searchKey);
    const validRoll = parsed.isValid ? parsed.rollNumber : searchKey;
    const branch = parsed.isValid ? parsed.branch : 'Engineering & Technology';
    const yr = parsed.isValid ? parsed.currentYear : '2nd Year';

    updatedStudent = {
      id: Date.now(),
      name: `Student (${validRoll.slice(-4)})`,
      rollNumber: validRoll,
      email: `${validRoll}@gvpce.ac.in`,
      department: branch,
      year: yr,
      status: 'Attended',
      checkedInTime: timeString,
      registeredEvent: 'OpenForge Campus Check-in',
    };
    updatedStudents.unshift(updatedStudent);
  }

  // Update checkins log
  const currentCheckins = getRecentCheckIns();
  const newCheckInEntry = {
    id: Date.now(),
    name: updatedStudent.name,
    rollNumber: updatedStudent.rollNumber,
    department: updatedStudent.department,
    timestamp: timeString,
  };
  const updatedCheckins = [
    newCheckInEntry,
    ...currentCheckins.filter((c) => c.rollNumber !== updatedStudent.rollNumber),
  ].slice(0, 50);

  try {
    localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(updatedStudents));
    localStorage.setItem(STORAGE_KEY_CHECKINS, JSON.stringify(updatedCheckins));

    emitStorageUpdate({
      type: 'STUDENT_CHECKED_IN',
      student: updatedStudent,
      checkIn: newCheckInEntry,
    });
  } catch (e) {
    console.error('Failed to update student checkin in localStorage:', e);
  }

  return { success: true, student: updatedStudent, checkIn: newCheckInEntry };
}

/**
 * Check if a student is marked as Attended
 */
export function getStudentStatus(rollOrEmail) {
  const students = getRegisteredStudents();
  const key = String(rollOrEmail).trim().toUpperCase();
  const found = students.find(
    (s) =>
      (s.rollNumber && s.rollNumber.toUpperCase() === key) ||
      (s.email && s.email.toUpperCase() === key)
  );
  return found ? found.status : 'Not Registered';
}

/**
 * Reactively subscribe to changes in students or checkins across tabs & window
 */
export function subscribeToStorage(callback) {
  if (typeof window === 'undefined') return () => {};

  const handleCustomEvent = (e) => {
    callback(e.detail);
  };

  const handleStorageEvent = (e) => {
    if (e.key === STORAGE_KEY_STUDENTS || e.key === STORAGE_KEY_CHECKINS) {
      callback({ type: 'STORAGE_SYNC', key: e.key });
    }
  };

  window.addEventListener(STORAGE_EVENT_NAME, handleCustomEvent);
  window.addEventListener('storage', handleStorageEvent);

  return () => {
    window.removeEventListener(STORAGE_EVENT_NAME, handleCustomEvent);
    window.removeEventListener('storage', handleStorageEvent);
  };
}

/**
 * Export students attendance sheet to CSV download
 */
export function exportStudentsCsv(studentsList) {
  const list = studentsList || getRegisteredStudents();
  const headers = ['ID', 'Name', 'Roll Number', 'Department', 'Year', 'Status', 'Checked-In Time', 'Event'];

  const rows = list.map((s, idx) => [
    idx + 1,
    `"${(s.name || '').replace(/"/g, '""')}"`,
    `"${s.rollNumber || ''}"`,
    `"${(s.department || '').replace(/"/g, '""')}"`,
    `"${s.year || ''}"`,
    `"${s.status || 'Registered'}"`,
    `"${s.checkedInTime || 'N/A'}"`,
    `"${(s.registeredEvent || 'OpenForge Events').replace(/"/g, '""')}"`,
  ]);

  const csvContent =
    'data:text/csv;charset=utf-8,' +
    [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `openforge_attendance_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Reset registered students and checkins to the pristine demo seed state
 */
export function resetStorageData() {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(DEFAULT_STUDENTS));
  localStorage.setItem(STORAGE_KEY_CHECKINS, JSON.stringify(DEFAULT_CHECKINS));
  emitStorageUpdate({ type: 'RESET_DATA' });
}
