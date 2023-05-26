const fs = require('fs');
const dayjs = require('dayjs');

let students = [];

function loadData() {
  const data = fs.readFileSync('./Data/students.json', 'utf8');
  students = JSON.parse(data);
}

function saveData() {
  fs.writeFileSync('./Data/students.json', JSON.stringify(students), 'utf8');
}

function addStudent(name, birth) {
  students.push({ name, birth });
  saveData();
}

function deleteStudent(index) {
  students.splice(index, 1);
  saveData();
}

function getStudents() {
  return students;
}

function formatDate(date) {
  return dayjs(date).format('DD/MM/YYYY');
}

function add(number1, number2) {
  return number1 + number2;
}

function multiply(number1, number2) {
  return number1 * number2;
}

module.exports = {
  loadData,
  addStudent,
  deleteStudent,
  getStudents,
  formatDate,
  add,
  multiply,
};
