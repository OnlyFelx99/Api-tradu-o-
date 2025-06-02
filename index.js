import express from 'express';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Dicionários de tradução
const enToPt = {
  "i": "eu",
  "hello": "olá",
  "hi": "oi",
  "you": "você",
  "he": "ele",
  "she": "ela",
  "it": "isso",
  "we": "nós",
  "they": "eles",
  "hello": "olá",
  "goodbye": "adeus",
  "thank you": "obrigado",
  "please": "por favor",
  "yes": "sim",
  "no": "não",
  "what": "o que",
  "when": "quando",
  "where": "onde",
  "why": "por que",
  "how": "como",
  "good": "bom",
  "bad": "ruim",
  "happy": "feliz",
  "sad": "triste",
  "fast": "rápido",
  "slow": "lento",
  "hot": "quente",
  "cold": "frio",
  "i am": "eu sou",
  "you are": "você é",
  "he is": "ele é",
  "she is": "ela é",
  "we are": "nós somos",
  "they are": "eles são",
  "my name is": "meu nome é",
  "see you later": "até logo",
  "i love you": "eu te amo",
  "help me": "me ajude",
  "where is the bathroom": "onde fica o banheiro",
  "can you help me?": "Você pode me ajudar?",
  "how much is this?": "Quanto custa isso?",
  "where is the nearest hospital?": "Onde fica o hospital mais próximo?",
  "i need water": "Eu preciso de água",
  "i don't understand": "Eu não entendo",
  "i'm lost": "Estou perdido",
  "please speak slowly": "Por favor, fale devagar",
  "what's your name?": "Qual é o seu nome?",
  "i don't know": "Eu não sei",
  "excuse me, where is the bus stop?": "Com licença, onde fica o ponto de ônibus?",
  "how are you doing?": "Como você está indo?",
  "it's a beautiful day!": "É um dia bonito!",
  "i’m tired": "Estou cansado",
  "can i help you?": "Posso te ajudar?",
  "nice to meet you": "Prazer em conhecê-lo",
  "i have a question": "Eu tenho uma pergunta",
  "what time is it?": "Que horas são?",
  "where are you from?": "De onde você é?",
  "i’m learning english": "Estou aprendendo inglês",
  "do you speak english?": "Você fala inglês?",
  "i am hungry": "Estou com fome",
  "i am thirsty": "Estou com sede",
  "what is your phone number?": "Qual é o seu número de telefone?",
  "i like pizza": "Eu gosto de pizza",
  "i’m going to sleep": "Eu vou dormir",
  "good morning": "bom dia",
  "good evening": "boa noite",
  "good night": "boa noite",
  "how are you?": "Como vai você?",
  "have a nice day!": "Tenha um bom dia!",
  "what’s up?": "E aí?",
  "goodbye!": "Adeus!",
  "take care": "se cuida",
  "see you soon": "até logo",
  "are you ok?": "Você está bem?",
  "yes, I am": "Sim, eu estou",
  "no, I'm not": "Não, eu não estou",
};

const ptToEn = Object.fromEntries(
  Object.entries(enToPt).map(([en, pt]) => [pt, en])
);

let translationHistory = [];

function normalizar(texto) {
  return texto.trim().toLowerCase();
}

// Endpoint de Tradução
app.post('/translate', (req, res) => {
  const { frase, direcao } = req.body;  // A captura dos parâmetros no corpo da requisição

  if (!frase || !direcao) {
    return res.status(400).json({
      erro: "Campos 'frase' e 'direcao' ('en-pt' ou 'pt-en') são obrigatórios."
    });
  }

  const entrada = normalizar(frase);
  let traducao = null;

  if (direcao === "en-pt") {
    traducao = enToPt[entrada];
  } else if (direcao === "pt-en") {
    traducao = ptToEn[entrada];
  } else {
    return res.status(400).json({ erro: "Direção inválida. Use 'en-pt' ou 'pt-en'." });
  }

  // Armazenar a tradução no histórico
  if (traducao) {
    translationHistory.push({
      original: frase,
      traducao,
      direcao,
      data: new Date().toISOString()
    });

    return res.json({
      original: frase,
      traducao,
      direcao
    });
  } else {
    return res.status(404).json({
      original: frase,
      erro: "Tradução não encontrada.",
      direcao
    });
  }
});

// Endpoint de Histórico de Traduções
app.get('/history', (req, res) => {
  if (translationHistory.length === 0) {
    return res.status(404).json({ mensagem: "Nenhuma tradução registrada no histórico." });
  }
  res.json({
    historico: translationHistory
  });
});

app.listen(port, () => {
  console.log(`🌍 Tradutor API rodando em http://localhost:${port}`);
});
