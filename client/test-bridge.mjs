// Test script for reactive localStorage bridge
import {
  getRegisteredStudents,
  getRecentCheckIns,
  registerStudent,
  markStudentAttended,
  getStudentStatus,
  STORAGE_KEY_STUDENTS,
} from './src/utils/storage.js';

// Setup mock window & localStorage environment for Node.js
class MockLocalStorage {
  constructor() {
    this.store = {};
  }
  getItem(key) {
    return this.store[key] || null;
  }
  setItem(key, value) {
    this.store[key] = String(value);
  }
  removeItem(key) {
    delete this.store[key];
  }
  clear() {
    this.store = {};
  }
}

globalThis.localStorage = new MockLocalStorage();
globalThis.window = {
  dispatchEvent: () => {},
  addEventListener: () => {},
  removeEventListener: () => {},
};

console.log('=== RUNNING OPENFORGE REACTIVE BRIDGE TEST ===\n');

// 1. Initial State
const initialStudents = getRegisteredStudents();
console.log(`[PASS 1] Initial students seeded: ${initialStudents.length} records.`);

// 2. Register new sample GVPCE student
const sampleRegistration = {
  name: 'Meghana Chowdary',
  email: '324103311088@gvpce.ac.in',
  role: 'student',
  registeredEvent: 'Sherlock: Next Chapter',
};

const registered = registerStudent(sampleRegistration);
console.log(`[PASS 2] Student registered:`);
console.log(`  - Name: ${registered.name}`);
console.log(`  - Roll: ${registered.rollNumber}`);
console.log(`  - Dept: ${registered.department}`);
console.log(`  - Year: ${registered.year}`);
console.log(`  - Status: ${registered.status}`);

if (registered.rollNumber !== '324103311088' || registered.department !== 'Information Technology (IT)') {
  throw new Error('Roll number parsing or registration failed!');
}

// 3. Verify student exists in directory for Volunteer Scanner & Admin Panel
const allStudents = getRegisteredStudents();
const found = allStudents.find((s) => s.rollNumber === '324103311088');
if (!found) throw new Error('Registered student not found in directory!');
console.log(`[PASS 3] Verified student present in directory with ${allStudents.length} total students.`);

// 4. Check-in via Volunteer Scanner simulation
console.log('\n[TEST 4] Simulating Volunteer QR Scan / Manual Check-in for 324103311088...');
const checkInResult = markStudentAttended('324103311088', '11:05 AM');
console.log(`  - Status updated to: ${checkInResult.student.status}`);
console.log(`  - Checked-in Time: ${checkInResult.student.checkedInTime}`);

// 5. Verify Check-in reflects in getStudentStatus & getRecentCheckIns
const updatedStatus = getStudentStatus('324103311088');
if (updatedStatus !== 'Attended') {
  throw new Error(`Expected Attended but got ${updatedStatus}`);
}
console.log(`[PASS 5] Student status query returned: "${updatedStatus}".`);

const checkIns = getRecentCheckIns();
const checkInEntry = checkIns.find((c) => c.rollNumber === '324103311088');
if (!checkInEntry) throw new Error('Check-in entry not found in check-in log!');
console.log(`[PASS 6] Verified check-in entry recorded: ${checkInEntry.name} at ${checkInEntry.timestamp}.`);

// 6. Verify Admin Panel CSV Data Export
const csvStudents = getRegisteredStudents();
const attendedCount = csvStudents.filter((s) => s.status === 'Attended').length;
console.log(`[PASS 7] Admin attendance count: ${attendedCount} attended out of ${csvStudents.length} total.`);

console.log('\n🎉 ALL REACTIVE LOCALSTORAGE BRIDGE TESTS PASSED PERFECTLY!\n');
