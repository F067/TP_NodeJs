const http = require('http');
const fs = require('fs');
const url = require('url');
const querystring = require('querystring');
const dotenv = require('dotenv');
const utils = require('./core/utils');

dotenv.config();

const PORT = process.env.APP_PORT || 3000;

// Chargement des données des étudiants
utils.loadData();

// Création du serveur HTTP
const server = http.createServer((req, res) => {
  const { pathname } = url.parse(req.url);

  if (pathname === '/') {
    // Page principale (formulaire d'ajout d'un utilisateur)
    if (req.method === 'GET') {
      fs.readFile('./views/home.html', 'utf8', (err, data) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Internal Server Error');
        } else {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(data);
        }
      });
    } else if (req.method === 'POST') {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk;
      });

      req.on('end', () => {
        const { name, birth } = querystring.parse(body);
        utils.addStudent(name, birth);

        res.writeHead(302, { Location: '/users' });
        res.end();
      });
    }
  } else if (pathname === '/users') {
    // Page affichant les utilisateurs
    if (req.method === 'GET') {
      const students = utils.getStudents();
      let userList = '';

      students.forEach((student) => {
        userList += `<li>${student.name} - ${utils.formatDate(student.birth)} <button onclick="deleteUser(${student.id})">Supprimer</button></li>`;
      });

      fs.readFile('./views/users.html', 'utf8', (err, data) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Internal Server Error');
        } else {
          const content = data.replace('{{userList}}', userList);
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(content);
        }
      });
    } else if (req.method === 'POST') {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk;
      });

      req.on('end', () => {
        const { id } = querystring.parse(body);
        utils.deleteStudent(parseInt(id));

        res.writeHead(302, { Location: '/users' });
        res.end();
      });
    }
  } else if (pathname === '/calculator') {
    // Page de la calculatrice avec mémoire
    if (req.method === 'GET') {
      fs.readFile('./views/calculator.html', 'utf8', (err, data) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Internal Server Error');
        } else {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(data);
        }
      });
    } else if (req.method === 'POST') {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk;
      });

      req.on('end', () => {
        const { number1, number2, operation } = querystring.parse(body);
        let result = '';

        if (operation === 'add') {
          result = utils.add(parseFloat(number1), parseFloat(number2));
        } else if (operation === 'multiply') {
          result = utils.multiply(parseFloat(number1), parseFloat(number2));
        }

        fs.readFile('./views/calculator.html', 'utf8', (err, data) => {
          if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
          } else {
            let content = data.replace('{{result}}', result.toString());
            if (!result) {
              content = content.replace('{{result}}', '0');
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content);
          }
        });
      });
    }
    else if (pathname === '/results') {
      if (req.method === 'GET') {
        const allResults = utils.getAllResults();

        fs.readFile('./views/results.html', 'utf8', (err, data) => {
          if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
          } else {
            const content = data.replace('{{allResults}}', allResults);
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content);
          }
        });
      }
    }
  } else if (pathname === '/assets/css/style.css') {
    // Fichier CSS statique
    fs.readFile('./assets/css/style.css', 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/css' });
        res.end(data);
      }
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

// Démarrage du serveur
server.listen(PORT, () => {
  console.log(`Server running on http://${process.env.APP_LOCALHOST}:${PORT}`);
});
