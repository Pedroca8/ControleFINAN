// Elementos do DOM
const balanceEl = document.getElementById('balance');
const incomeEl = document.getElementById('income');
const expenseEl = document.getElementById('expense');
const transactionsList = document.getElementById('transactions');
const form = document.getElementById('form');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const dateInput = document.getElementById('date');
const typeInput = document.getElementById('type');
const categoryInput = document.getElementById('category');
const notesInput = document.getElementById('notes');
const periodSelect = document.getElementById('period');
const dateRangeContainer = document.getElementById('dateRangeContainer');
const startDateInput = document.getElementById('startDate');
const endDateInput = document.getElementById('endDate');
const applyFilterBtn = document.getElementById('applyFilter');
const showChartBtn = document.getElementById('showChart');
const exportDataBtn = document.getElementById('exportData');
const chartContainer = document.getElementById('chartContainer');

// Elementos para rendas fixas e despesas fixas
const fixedIncomeList = document.getElementById('fixedIncomeList');
const fixedExpenseList = document.getElementById('fixedExpenseList');
const fixedIncomeTotalEl = document.getElementById('fixedIncomeTotal');
const fixedExpenseTotalEl = document.getElementById('fixedExpenseTotal');
const addFixedIncomeBtn = document.getElementById('addFixedIncome');
const addFixedExpenseBtn = document.getElementById('addFixedExpense');

// Elementos para modais
const fixedIncomeModal = document.getElementById('fixedIncomeModal');
const fixedExpenseModal = document.getElementById('fixedExpenseModal');
const transactionModal = document.getElementById('transactionModal');
const fixedIncomeForm = document.getElementById('fixedIncomeForm');
const fixedExpenseForm = document.getElementById('fixedExpenseForm');
const closeButtons = document.querySelectorAll('.close');

// Elementos para visualização de transações
const displayModeInputs = document.querySelectorAll('input[name="displayMode"]');
const loadMoreTransactionsBtn = document.getElementById('loadMoreTransactions');

// Variáveis globais
let currentDisplayMode = 'compact';
let transactionsPerPage = 10;
let currentPage = 1;

// Configuração inicial
document.addEventListener('DOMContentLoaded', function() {
    // Configurar data atual no input de data
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
    
    // Inicializar data de início como o primeiro dia do mês atual
    const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
    startDateInput.value = firstDayOfMonth;
    
    // Inicializar data de fim como o dia atual
    endDateInput.value = today;
    
    // Carregar dados do localStorage
    loadTransactions();
    loadFixedIncomes();
    loadFixedExpenses();
    
    // Atualizar a UI
    updateValues();
    updateFixedIncomeList();
    updateFixedExpenseList();
    
    // Aplicar filtro inicial (este mês)
    periodSelect.value = 'month';
    applyPeriodFilter();
});

// Local Storage - Transações e Finanças Fixas
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let fixedIncomes = JSON.parse(localStorage.getItem('fixedIncomes')) || [];
let fixedExpenses = JSON.parse(localStorage.getItem('fixedExpenses')) || [];

// Funções para manipulação de dados - Transações
function saveTransactions() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function loadTransactions() {
    transactions = JSON.parse(localStorage.getItem('transactions')) || [];
}

function addTransaction(e) {
    e.preventDefault();
    
    if (descriptionInput.value.trim() === '' || amountInput.value.trim() === '') {
        alert('Por favor, preencha a descrição e o valor');
        return;
    }
    
    const transaction = {
        id: generateID(),
        description: descriptionInput.value,
        amount: parseFloat(amountInput.value),
        date: dateInput.value,
        type: typeInput.value,
        category: categoryInput.value,
        notes: notesInput.value || '',
        createdAt: new Date().toISOString()
    };
    
    transactions.push(transaction);
    
    saveTransactions();
    updateValues();
    displayTransactions();
    
    // Limpar formulário
    descriptionInput.value = '';
    amountInput.value = '';
    notesInput.value = '';
    dateInput.value = new Date().toISOString().split('T')[0];
    typeInput.value = 'income';
    categoryInput.value = 'salary';
}

function removeTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);
    
    saveTransactions();
    updateValues();
    displayTransactions();
}

// Funções para manipulação de dados - Rendas Fixas
function saveFixedIncomes() {
    localStorage.setItem('fixedIncomes', JSON.stringify(fixedIncomes));
}

function loadFixedIncomes() {
    fixedIncomes = JSON.parse(localStorage.getItem('fixedIncomes')) || [];
}

function addFixedIncome(description, amount, day) {
    const newFixedIncome = {
        id: generateID(),
        description,
        amount: parseFloat(amount),
        day: parseInt(day)
    };
    
    fixedIncomes.push(newFixedIncome);
    saveFixedIncomes();
    updateFixedIncomeList();
    updateValues();
}

function removeFixedIncome(id) {
    fixedIncomes = fixedIncomes.filter(income => income.id !== id);
    saveFixedIncomes();
    updateFixedIncomeList();
    updateValues();
}

// Funções para manipulação de dados - Contas Fixas
function saveFixedExpenses() {
    localStorage.setItem('fixedExpenses', JSON.stringify(fixedExpenses));
}

function loadFixedExpenses() {
    fixedExpenses = JSON.parse(localStorage.getItem('fixedExpenses')) || [];
}

function addFixedExpense(description, amount, day, category) {
    const newFixedExpense = {
        id: generateID(),
        description,
        amount: parseFloat(amount),
        day: parseInt(day),
        category
    };
    
    fixedExpenses.push(newFixedExpense);
    saveFixedExpenses();
    updateFixedExpenseList();
    updateValues();
}

function removeFixedExpense(id) {
    fixedExpenses = fixedExpenses.filter(expense => expense.id !== id);
    saveFixedExpenses();
    updateFixedExpenseList();
    updateValues();
}

function generateID() {
    return Math.floor(Math.random() * 1000000000);
}

// Funções de atualização da UI
function updateValues() {
    const incomeTotal = transactions
        .filter(transaction => transaction.type === 'income')
        .reduce((acc, transaction) => acc + transaction.amount, 0);
    
    const expenseTotal = transactions
        .filter(transaction => transaction.type === 'expense')
        .reduce((acc, transaction) => acc + transaction.amount, 0);
    
    const total = incomeTotal - expenseTotal;
    
    balanceEl.textContent = formatCurrency(total);
    incomeEl.textContent = formatCurrency(incomeTotal);
    expenseEl.textContent = formatCurrency(expenseTotal);
}

function updateFixedIncomeList() {
    fixedIncomeList.innerHTML = '';
    
    if (fixedIncomes.length === 0) {
        fixedIncomeList.innerHTML = '<div class="empty-message">Nenhuma renda fixa cadastrada.</div>';
        fixedIncomeTotalEl.textContent = formatCurrency(0);
        return;
    }
    
    // Ordenar por dia de recebimento
    fixedIncomes.sort((a, b) => a.day - b.day).forEach(income => {
        const listItem = document.createElement('li');
        
        listItem.innerHTML = `
            <div class="fixed-item-details">
                <strong>${income.description}</strong>
                <span>${formatCurrency(income.amount)}</span>
            </div>
            <span class="fixed-day">Dia ${income.day}</span>
            <div class="fixed-actions">
                <button class="delete-btn" onclick="removeFixedIncome(${income.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        fixedIncomeList.appendChild(listItem);
    });
    
    // Atualizar total de rendas fixas
    const totalFixedIncome = fixedIncomes.reduce((total, income) => total + income.amount, 0);
    fixedIncomeTotalEl.textContent = formatCurrency(totalFixedIncome);
}

function updateFixedExpenseList() {
    fixedExpenseList.innerHTML = '';
    
    if (fixedExpenses.length === 0) {
        fixedExpenseList.innerHTML = '<div class="empty-message">Nenhuma conta fixa cadastrada.</div>';
        fixedExpenseTotalEl.textContent = formatCurrency(0);
        return;
    }
    
    // Ordenar por dia de vencimento
    fixedExpenses.sort((a, b) => a.day - b.day).forEach(expense => {
        const listItem = document.createElement('li');
        const icon = getCategoryIcon(expense.category);
        
        listItem.innerHTML = `
            <div class="fixed-item-details">
                <strong>${expense.description}</strong>
                <div>
                    <i class="fas ${icon}"></i>
                    <span>${formatCurrency(expense.amount)}</span>
                </div>
            </div>
            <span class="fixed-day">Dia ${expense.day}</span>
            <div class="fixed-actions">
                <button class="delete-btn" onclick="removeFixedExpense(${expense.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        fixedExpenseList.appendChild(listItem);
    });
    
    // Atualizar total de contas fixas
    const totalFixedExpense = fixedExpenses.reduce((total, expense) => total + expense.amount, 0);
    fixedExpenseTotalEl.textContent = formatCurrency(totalFixedExpense);
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(amount);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

function formatDateTime(dateTimeString) {
    const date = new Date(dateTimeString);
    return date.toLocaleString('pt-BR');
}

function getCategoryIcon(category) {
    const icons = {
        'salary': 'fa-money-bill-wave',
        'investment': 'fa-chart-line',
        'food': 'fa-utensils',
        'transport': 'fa-car',
        'home': 'fa-home',
        'leisure': 'fa-gamepad',
        'health': 'fa-heart',
        'education': 'fa-graduation-cap',
        'other': 'fa-receipt'
    };
    
    return icons[category] || 'fa-receipt';
}

// Funções para visualização de transações
function displayTransactions(filteredTransactions = null) {
    const transactionsToDisplay = filteredTransactions || transactions;
    transactionsList.innerHTML = '';
    
    if (transactionsToDisplay.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.textContent = 'Nenhuma transação encontrada no período selecionado.';
        emptyMessage.classList.add('empty-message');
        transactionsList.appendChild(emptyMessage);
        loadMoreTransactionsBtn.style.display = 'none';
        return;
    }
    
    // Ordenar transações por data (mais recente primeiro)
    const sortedTransactions = transactionsToDisplay.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Paginar resultados
    const totalPages = Math.ceil(sortedTransactions.length / transactionsPerPage);
    const start = (currentPage - 1) * transactionsPerPage;
    const end = start + transactionsPerPage;
    const paginatedTransactions = sortedTransactions.slice(start, end);
    
    // Mostrar ou esconder o botão "Ver mais"
    loadMoreTransactionsBtn.style.display = currentPage < totalPages ? 'block' : 'none';
    
    // Renderizar transações
    paginatedTransactions.forEach(transaction => {
        const listItem = document.createElement('li');
        listItem.classList.add('transaction-item');
        listItem.classList.add(transaction.type);
        
        if (currentDisplayMode === 'detailed') {
            listItem.classList.add('detailed');
        }
        
        const icon = getCategoryIcon(transaction.category);
        
        if (currentDisplayMode === 'compact') {
            listItem.innerHTML = `
                <div class="transaction-details">
                    <h4>${transaction.description}</h4>
                    <div class="transaction-meta">
                        <span><i class="fas ${icon}"></i> ${transaction.category}</span>
                        <span><i class="fas fa-calendar"></i> ${formatDate(transaction.date)}</span>
                    </div>
                </div>
                <span class="transaction-amount">${formatCurrency(transaction.amount)}</span>
                <div class="transaction-actions">
                    <button class="view-btn" onclick="showTransactionDetails(${transaction.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="delete-btn" onclick="removeTransaction(${transaction.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
        } else {
            // Modo detalhado
            listItem.innerHTML = `
                <div class="transaction-header">
                    <h4>${transaction.description}</h4>
                    <span class="transaction-amount">${formatCurrency(transaction.amount)}</span>
                </div>
                <div class="transaction-meta">
                    <span><i class="fas ${icon}"></i> ${transaction.category}</span>
                    <span><i class="fas fa-calendar"></i> ${formatDate(transaction.date)}</span>
                    <span><i class="fas fa-clock"></i> Criado em: ${formatDateTime(transaction.createdAt || transaction.date)}</span>
                </div>
                ${transaction.notes ? `<div class="transaction-notes">${transaction.notes}</div>` : ''}
                <div class="transaction-actions">
                    <button class="delete-btn" onclick="removeTransaction(${transaction.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
        }
        
        transactionsList.appendChild(listItem);
    });
}

function loadMoreTransactions() {
    currentPage++;
    applyPeriodFilter();
}

function resetPagination() {
    currentPage = 1;
}

function showTransactionDetails(id) {
    const transaction = transactions.find(t => t.id === id);
    if (!transaction) return;
    
    const detailsHTML = `
        <div class="detail-row">
            <div class="detail-label">Descrição:</div>
            <div class="detail-value">${transaction.description}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Valor:</div>
            <div class="detail-value">${formatCurrency(transaction.amount)}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Data:</div>
            <div class="detail-value">${formatDate(transaction.date)}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Tipo:</div>
            <div class="detail-value">${transaction.type === 'income' ? 'Entrada' : 'Saída'}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Categoria:</div>
            <div class="detail-value">
                <i class="fas ${getCategoryIcon(transaction.category)}"></i>
                ${transaction.category}
            </div>
        </div>
        ${transaction.notes ? `
            <div class="detail-row">
                <div class="detail-label">Observações:</div>
                <div class="detail-value">${transaction.notes}</div>
            </div>
        ` : ''}
        <div class="detail-row">
            <div class="detail-label">Criado em:</div>
            <div class="detail-value">${formatDateTime(transaction.createdAt || transaction.date)}</div>
        </div>
    `;
    
    document.getElementById('transactionDetails').innerHTML = detailsHTML;
    transactionModal.style.display = 'block';
}

// Funções de filtragem
function filterTransactionsByDateRange(startDate, endDate) {
    return transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate >= new Date(startDate) && transactionDate <= new Date(endDate);
    });
}

function applyPeriodFilter() {
    const period = periodSelect.value;
    let filteredTransactions;
    
    const today = new Date();
    
    switch (period) {
        case 'month':
            const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
            filteredTransactions = filterTransactionsByDateRange(
                firstDayOfMonth.toISOString().split('T')[0],
                today.toISOString().split('T')[0]
            );
            dateRangeContainer.style.display = 'none';
            break;
            
        case 'year':
            const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
            filteredTransactions = filterTransactionsByDateRange(
                firstDayOfYear.toISOString().split('T')[0],
                today.toISOString().split('T')[0]
            );
            dateRangeContainer.style.display = 'none';
            break;
            
        case 'custom':
            dateRangeContainer.style.display = 'flex';
            return; // Não aplicar filtro automaticamente, aguardar clique no botão
            
        default: // 'all'
            filteredTransactions = transactions;
            dateRangeContainer.style.display = 'none';
    }
    
    displayTransactions(filteredTransactions);
}

function applyCustomDateFilter() {
    const startDate = startDateInput.value;
    const endDate = endDateInput.value;
    
    if (!startDate || !endDate) {
        alert('Por favor, selecione as datas de início e fim');
        return;
    }
    
    if (new Date(startDate) > new Date(endDate)) {
        alert('A data de início deve ser anterior à data de fim');
        return;
    }
    
    resetPagination();
    const filteredTransactions = filterTransactionsByDateRange(startDate, endDate);
    displayTransactions(filteredTransactions);
}

// Funções para modais
function openFixedIncomeModal() {
    fixedIncomeModal.style.display = 'block';
}

function openFixedExpenseModal() {
    fixedExpenseModal.style.display = 'block';
}

function closeModal(modal) {
    modal.style.display = 'none';
}

// Event Listeners
form.addEventListener('submit', addTransaction);
periodSelect.addEventListener('change', applyPeriodFilter);
applyFilterBtn.addEventListener('click', applyCustomDateFilter);
showChartBtn.addEventListener('click', toggleChartVisibility);
exportDataBtn.addEventListener('click', exportTransactionsData);
loadMoreTransactionsBtn.addEventListener('click', loadMoreTransactions);

// Event listeners para modais
addFixedIncomeBtn.addEventListener('click', openFixedIncomeModal);
addFixedExpenseBtn.addEventListener('click', openFixedExpenseModal);

closeButtons.forEach(btn => {
    btn.addEventListener('click', function() {
        const modal = this.closest('.modal');
        closeModal(modal);
    });
});

// Fechar modal ao clicar fora do conteúdo
window.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        closeModal(e.target);
    }
});

// Event listeners para formulários de finanças fixas
fixedIncomeForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const description = document.getElementById('fixedIncomeDescription').value;
    const amount = document.getElementById('fixedIncomeAmount').value;
    const day = document.getElementById('fixedIncomeDay').value;
    
    if (!description || !amount || !day) {
        alert('Por favor, preencha todos os campos');
        return;
    }
    
    addFixedIncome(description, amount, day);
    
    // Limpar formulário e fechar modal
    fixedIncomeForm.reset();
    closeModal(fixedIncomeModal);
});

fixedExpenseForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const description = document.getElementById('fixedExpenseDescription').value;
    const amount = document.getElementById('fixedExpenseAmount').value;
    const day = document.getElementById('fixedExpenseDay').value;
    const category = document.getElementById('fixedExpenseCategory').value;
    
    if (!description || !amount || !day || !category) {
        alert('Por favor, preencha todos os campos');
        return;
    }
    
    addFixedExpense(description, amount, day, category);
    
    // Limpar formulário e fechar modal
    fixedExpenseForm.reset();
    closeModal(fixedExpenseModal);
});

// Event listeners para opções de visualização
displayModeInputs.forEach(input => {
    input.addEventListener('change', function() {
        currentDisplayMode = this.value;
        resetPagination();
        applyPeriodFilter();
    });
});

// Funções para relatórios
function generateCategoryChart() {
    // Remover gráfico anterior se existir
    if (window.categoryChart) {
        window.categoryChart.destroy();
    }
    
    // Filtrar transações de acordo com o período selecionado
    let filteredTransactions;
    const period = periodSelect.value;
    const today = new Date();
    
    switch (period) {
        case 'month':
            const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
            filteredTransactions = filterTransactionsByDateRange(
                firstDayOfMonth.toISOString().split('T')[0],
                today.toISOString().split('T')[0]
            );
            break;
            
        case 'year':
            const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
            filteredTransactions = filterTransactionsByDateRange(
                firstDayOfYear.toISOString().split('T')[0],
                today.toISOString().split('T')[0]
            );
            break;
            
        case 'custom':
            filteredTransactions = filterTransactionsByDateRange(
                startDateInput.value,
                endDateInput.value
            );
            break;
            
        default: // 'all'
            filteredTransactions = transactions;
    }
    
    // Agrupar despesas por categoria
    const expenseCategories = {};
    filteredTransactions
        .filter(t => t.type === 'expense')
        .forEach(t => {
            if (!expenseCategories[t.category]) {
                expenseCategories[t.category] = 0;
            }
            expenseCategories[t.category] += t.amount;
        });
    
    // Preparar dados para o gráfico
    const categories = Object.keys(expenseCategories);
    const amounts = Object.values(expenseCategories);
    const backgroundColors = [
        '#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6',
        '#1abc9c', '#34495e', '#d35400', '#c0392b', '#16a085'
    ];
    
    // Criar o gráfico
    const ctx = document.getElementById('categoriesChart').getContext('2d');
    window.categoryChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: categories,
            datasets: [{
                data: amounts,
                backgroundColor: backgroundColors.slice(0, categories.length),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        font: {
                            size: 14
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const value = context.raw;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            return `${context.label}: ${formatCurrency(value)} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

function toggleChartVisibility() {
    if (chartContainer.style.display === 'none') {
        chartContainer.style.display = 'block';
        generateCategoryChart();
        showChartBtn.textContent = 'Ocultar Gráfico';
    } else {
        chartContainer.style.display = 'none';
        showChartBtn.textContent = 'Gráfico de Categorias';
    }
}

function exportTransactionsData() {
    let dataToExport;
    const period = periodSelect.value;
    const today = new Date();
    
    switch (period) {
        case 'month':
            const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
            dataToExport = filterTransactionsByDateRange(
                firstDayOfMonth.toISOString().split('T')[0],
                today.toISOString().split('T')[0]
            );
            break;
            
        case 'year':
            const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
            dataToExport = filterTransactionsByDateRange(
                firstDayOfYear.toISOString().split('T')[0],
                today.toISOString().split('T')[0]
            );
            break;
            
        case 'custom':
            dataToExport = filterTransactionsByDateRange(
                startDateInput.value,
                endDateInput.value
            );
            break;
            
        default: // 'all'
            dataToExport = transactions;
    }
    
    if (dataToExport.length === 0) {
        alert('Não há transações para exportar no período selecionado.');
        return;
    }
    
    // Ordenar por data
    dataToExport.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Converter para CSV
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Data,Descrição,Categoria,Tipo,Valor,Observações,Data de Criação\n';
    
    dataToExport.forEach(transaction => {
        const formattedDate = formatDate(transaction.date);
        const formattedAmount = transaction.amount.toString().replace('.', ',');
        const formattedType = transaction.type === 'income' ? 'Entrada' : 'Saída';
        const notes = transaction.notes ? transaction.notes.replace(/,/g, ';') : '';
        const createdAt = formatDateTime(transaction.createdAt || transaction.date);
        
        const row = [
            formattedDate,
            transaction.description,
            transaction.category,
            formattedType,
            formattedAmount,
            notes,
            createdAt
        ].join(',');
        
        csvContent += row + '\n';
    });
    
    // Criar link para download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `transacoes_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    
    // Trigger download e remover link
    link.click();
    document.body.removeChild(link);
}

// Inicialização inicial
displayTransactions();