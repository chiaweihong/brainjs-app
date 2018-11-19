const brain = require("brain.js");
const dataTrain = require("./dataTrain.json");
const fs = require("browserify-fs");

const network = new brain.recurrent.LSTM();

let newData = {};
let lsDataTrain = [];

document
  .getElementById("verify-category")
  .addEventListener("click", showCategory);

function showCategory() {
  console.log("A aplicação foi executada, aguarde por favor...");

  // Aqui adicionamos ao localStorage caso o arquivo dataTrain.json não seja modificado
  if (localStorage.getItem("dataTrain")) {
    lsDataTrain = [];
    lsDataTrain.push(JSON.parse(localStorage.getItem("dataTrain")));
  } else {
    localStorage.setItem("dataTrain", JSON.stringify(dataTrain));
    lsDataTrain.push(JSON.parse(localStorage.getItem("dataTrain")));
  }

  const verifyText = document.getElementById("text").value;

  console.log(lsDataTrain);
  // Aqui a aplicação recebe o arquivo/localStorage de treinamento
  const trainingData = lsDataTrain[0].map(item => ({
    input: item.text,
    output: item.category
  }));

  // Aqui a aplicação treina baseado no arquivo passado/localStorage
  network.train(trainingData, {
    iterations: 2000
  });

  // Aqui verificamos a categoria do texto digitado, após o treinamento
  const output = network.run(verifyText);

  // A resposta da categoria as vezes pode vir com o texto que ele se baseou do arquivo de treino, para verificar a qual categoria o texto pertence
  // Ex: "Code have bugssoftware"
  // Portanto aqui formatamos a resposta para apenas a categoria em questão
  let category = output.indexOf("hardware");
  if (category === -1) {
    category = "software";
    category2 = "hardware";
    document.getElementById("categoria").innerHTML = category;
    confirmAnswer(category, category2, verifyText);
  } else {
    category = "hardware";
    category2 = "software";
    document.getElementById("categoria").innerHTML = category;
    confirmAnswer(category, category2, verifyText);
  }
}

// Aqui verificamos se a resposta esta certa ou errada
function confirmAnswer(category, category2, verifyText) {
  if (confirm(`A categoria ${category} esta certa?`)) {
    newData = {
      text: verifyText,
      category: category
    };
    writeFileData(newData);
  } else {
    newData = {
      text: verifyText,
      category: category2
    };
    writeFileData(newData);
  }
}

// Aqui adicionamos o resultado ao arquivo de treino, caso o usuário diga se a categoria certa ou errada
function writeFileData(data) {
  dataArr = JSON.parse(localStorage.getItem("dataTrain"));
  dataArr.push(data);
  localStorage.setItem("dataTrain", JSON.stringify(dataArr));
  fs.writeFile("./dataTrain.json", JSON.stringify(dataArr));
}
