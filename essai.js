     /* let stocks = [];
        let selectedStock = null;
        let priceChart = null;
        let profitLossChart = null;

        // Charger les données au démarrage
        window.addEventListener('load', () => {
            loadStocks();
            updateDisplay();
        });

        // Formulaire d'ajout
        document.getElementById('addStockForm').addEventListener('submit', (e) => {
            e.preventDefault();
            addStock();
        });

        function addStock() {
            const ticker = document.getElementById('ticker').value.trim().toUpperCase();
            const quantity = parseFloat(document.getElementById('quantity').value);
            const buyPrice = parseFloat(document.getElementById('buyPrice').value);

            if (!ticker || !quantity || !buyPrice) {
                alert('Veuillez remplir tous les champs');
                return;
            }

            const stock = {
                id: Date.now(),
                ticker: ticker,
                quantity: quantity,
                buyPrice: buyPrice,
                currentPrice: buyPrice,
                history: [{
                    date: new Date().toISOString(),
                    price: buyPrice
                }]
            };

            stocks.push(stock);
            saveStocks();
            updateDisplay();

            // Réinitialiser le formulaire
            document.getElementById('addStockForm').reset();
            alert(`Action ${ticker} ajoutée avec succès !`);
        }

        function deleteStock(id) {
            if (confirm('Êtes-vous sûr de vouloir supprimer cette action ?')) {
                stocks = stocks.filter(s => s.id !== id);
                if (selectedStock && selectedStock.id === id) {
                    selectedStock = null;
                    document.getElementById('chartContainer').style.display = 'none';
                }
                saveStocks();
                updateDisplay();
            }
        }

        function updatePrice(id, newPrice) {
            const stock = stocks.find(s => s.id === id);
            if (stock && newPrice > 0) {
                stock.currentPrice = parseFloat(newPrice);
                stock.history.push({
                    date: new Date().toISOString(),
                    price: parseFloat(newPrice)
                });
                saveStocks();
                updateDisplay();
            }
        }

        function showChart(id) {
            selectedStock = stocks.find(s => s.id === id);
            if (!selectedStock) return;

            document.getElementById('chartContainer').style.display = 'block';
            document.getElementById('chartTitle').textContent = selectedStock.ticker;

            const ctx = document.getElementById('priceChart').getContext('2d');
            
            // Prendre les 10 derniers points
            const historyData = selectedStock.history.slice(-10);
            const labels = historyData.map(h => new Date(h.date).toLocaleDateString('fr-FR'));
            const prices = historyData.map(h => h.price);

            if (priceChart) {
                priceChart.destroy();
            }

            priceChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Prix (€)',
                        data: prices,
                        borderColor: '#667eea',
                        backgroundColor: 'rgba(102, 126, 234, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: false
                        }
                    }
                }
            });

            // Scroll vers le graphique
            document.getElementById('chartContainer').scrollIntoView({ behavior: 'smooth' });
        }

        function calculateProfitLoss() {
            const startDate = document.getElementById('startDate').value;
            const endDate = document.getElementById('endDate').value;

            if (!startDate || !endDate) {
                alert('Veuillez sélectionner les deux dates');
                return;
            }

            const start = new Date(startDate);
            const end = new Date(endDate);
            const data = {};

            stocks.forEach(stock => {
                stock.history.forEach(entry => {
                    const date = new Date(entry.date);
                    if (date >= start && date <= end) {
                        const dateStr = date.toLocaleDateString('fr-FR');
                        const profit = (entry.price - stock.buyPrice) * stock.quantity;
                        
                        if (!data[dateStr]) {
                            data[dateStr] = 0;
                        }
                        data[dateStr] += profit;
                    }
                });
            });

            const sortedDates = Object.keys(data).sort((a, b) => 
                new Date(a.split('/').reverse().join('-')) - new Date(b.split('/').reverse().join('-'))
            );

            if (sortedDates.length === 0) {
                alert('Aucune donnée pour cette période');
                return;
            }

            const labels = sortedDates;
            const profits = sortedDates.map(date => data[date]);

            document.getElementById('profitLossChartContainer').style.display = 'block';
            const ctx = document.getElementById('profitLossChart').getContext('2d');

            if (profitLossChart) {
                profitLossChart.destroy();
            }

            profitLossChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Profit/Loss (€)',
                        data: profits,
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });

            document.getElementById('profitLossChartContainer').scrollIntoView({ behavior: 'smooth' });
        }

        function updateDisplay() {
            updateStats();
            updateStockList();
            updateComparison();
        }

        function updateStats() {
            const totalValue = stocks.reduce((sum, s) => sum + (s.currentPrice * s.quantity), 0);
            const totalInvested = stocks.reduce((sum, s) => sum + (s.buyPrice * s.quantity), 0);
            const profitLoss = totalValue - totalInvested;

            document.getElementById('totalValue').textContent = totalValue.toFixed(2) + ' €';
            document.getElementById('totalInvested').textContent = totalInvested.toFixed(2) + ' €';
            document.getElementById('totalProfitLoss').textContent = profitLoss.toFixed(2) + ' €';

            const plCard = document.getElementById('profitLossCard');
            plCard.className = 'stat-card';
            if (profitLoss > 0) {
                plCard.classList.add('positive');
            } else if (profitLoss < 0) {
                plCard.classList.add('negative');
            }
        }

        function updateStockList() {
            const container = document.getElementById('stockList');
            
            if (stocks.length === 0) {
                container.innerHTML = `
                    <p style="text-align: center; color: #999; padding: 50px 0;">
                        Aucune action ajoutée. Commencez par ajouter votre première action !
                    </p>
                `;
                return;
            }

            container.innerHTML = stocks.map(stock => {
                const profit = (stock.currentPrice - stock.buyPrice) * stock.quantity;
                const percentage = ((stock.currentPrice - stock.buyPrice) / stock.buyPrice) * 100;
                const isPositive = profit >= 0;

                return `
                    <div class="stock-item ${selectedStock && selectedStock.id === stock.id ? 'selected' : ''}">
                        <div class="stock-header">
                            <div>
                                <div class="stock-ticker">${stock.ticker}</div>
                                <div class="stock-quantity">${stock.quantity} actions</div>
                            </div>
                        </div>
                        <div class="stock-prices">
                            <div class="price-box">
                                <label>Prix d'achat</label>
                                <input type="text" value="${stock.buyPrice.toFixed(2)} €" readonly>
                            </div>
                            <div class="price-box">
                                <label>Prix actuel</label>
                                <input type="number" step="0.01" value="${stock.currentPrice}" 
                                    onchange="updatePrice(${stock.id}, this.value)">
                            </div>
                        </div>
                        <div class="stock-profit ${isPositive ? 'positive' : 'negative'}">
                            <span class="${isPositive ? 'arrow-up' : 'arrow-down'}">
                                ${profit.toFixed(2)} € (${percentage.toFixed(2)}%)
                            </span>
                        </div>
                        <div class="stock-actions">
                            <button class="btn-small btn-chart" onclick="showChart(${stock.id})">
                                📊 Graphique
                            </button>
                            <button class="btn-small btn-delete" onclick="deleteStock(${stock.id})">
                                🗑️ Supprimer
                            </button>
                        </div>
                    </div>
                `;
            }).join('');
        }

        function updateComparison() {
            const section = document.getElementById('comparisonSection');
            const grid = document.getElementById('comparisonGrid');

            if (stocks.length < 2) {
                section.style.display = 'none';
                return;
            }

            section.style.display = 'block';
            const stock1 = stocks[0];
            const stock2 = stocks[1];

            const perf1 = ((stock1.currentPrice - stock1.buyPrice) / stock1.buyPrice) * 100;
            const perf2 = ((stock2.currentPrice - stock2.buyPrice) / stock2.buyPrice) * 100;

            const winner1 = perf1 > perf2;
            const winner2 = perf2 > perf1;

            grid.innerHTML = `
                <div class="comparison-item ${winner1 ? 'winner' : ''}">
                    <h3>${stock1.ticker}</h3>
                    <div class="percentage ${perf1 >= 0 ? 'arrow-up' : 'arrow-down'}" style="color: ${perf1 >= 0 ? '#10b981' : '#ef4444'}">
                        ${perf1.toFixed(2)}%
                    </div>
                    ${winner1 ? '<p style="color: #10b981; font-weight: bold; margin-top: 10px;">🏆 Meilleure performance</p>' : ''}
                </div>
                <div class="comparison-item ${winner2 ? 'winner' : ''}">
                    <h3>${stock2.ticker}</h3>
                    <div class="percentage ${perf2 >= 0 ? 'arrow-up' : 'arrow-down'}" style="color: ${perf2 >= 0 ? '#10b981' : '#ef4444'}">
                        ${perf2.toFixed(2)}%
                    </div>
                    ${winner2 ? '<p style="color: #10b981; font-weight: bold; margin-top: 10px;">🏆 Meilleure performance</p>' : ''}
                </div>
            `;
        }

        function saveStocks() {
            const data = JSON.stringify(stocks);
            localStorage.setItem('stocks', data);
        }

        function loadStocks() {
            const data = localStorage.getItem('stocks');
            if (data) {
                try {
                    stocks = JSON.parse(data);
                } catch (e) {
                    console.error('Erreur de chargement:', e);
                    stocks = [];
                }
            }
        }

        function exportData() {
            const dataStr = JSON.stringify(stocks, null, 2);
            const blob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'portfolio_' + new Date().toISOString().split('T')[0] + '.json';
            a.click();
            URL.revokeObjectURL(url);
            alert('Données exportées avec succès !');
        }

        function resetData() {
            if (confirm('Êtes-vous sûr de vouloir supprimer toutes les données ?')) {
                stocks = [];
                localStorage.removeItem('stocks');
                updateDisplay();
                document.getElementById('chartContainer').style.display = 'none';
                document.getElementById('profitLossChartContainer').style.display = 'none';
                alert('Toutes les données ont été supprimées');
            }
        }
    </script>
</body>
</html> */