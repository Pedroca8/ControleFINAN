// Este é um script para criar ícones básicos
// Para executar, você precisará instalar o pacote canvas com: npm install canvas
// Depois execute: node generate-icon.js

const fs = require('fs');
const { createCanvas } = require('canvas');

// Tamanhos de ícones que precisamos gerar
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Função para criar e salvar ícone
function createIcon(size) {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    
    // Cor de fundo verde
    ctx.fillStyle = '#4CAF50';
    ctx.fillRect(0, 0, size, size);
    
    // Texto 'C' no centro
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `bold ${size * 0.6}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('C', size / 2, size / 2);
    
    // Salvar como PNG
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(`icon-${size}x${size}.png`, buffer);
    
    console.log(`Ícone ${size}x${size} gerado com sucesso!`);
}

// Criar todos os ícones
sizes.forEach(size => createIcon(size));

// Criar também um favicon básico
createIcon(32);
fs.renameSync('icon-32x32.png', 'favicon.ico');
console.log('Favicon gerado com sucesso!'); 