class PropertyCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.initChart();
        this.attachEventListeners();
    }

    render() {
        const projectName = this.getAttribute('project-name');
        const developer = this.getAttribute('developer');
        const imageUrl = this.getAttribute('image-url');
        const recentTransactions = this.getAttribute('recent-transactions');
        const targetMarket = this.getAttribute('target-market');

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    background-color: var(--secondary-color, #2a2a2a);
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 10px 20px rgba(0,0,0,0.3);
                    transition: transform 0.3s ease;
                }
                :host(:hover) {
                    transform: translateY(-5px);
                }
                .card-image img {
                    width: 100%;
                    height: 200px;
                    object-fit: cover;
                }
                .card-content {
                    padding: 1.5rem;
                }
                h3 {
                    margin: 0;
                    font-size: 1.5rem;
                    font-weight: 700;
                }
                p {
                    margin: 0.5rem 0;
                    font-weight: 300;
                }
                .developer {
                    font-weight: 700;
                     color: var(--accent-color, #f0c419);
                }
                .vote-section button {
                    background-color: transparent;
                    color: var(--text-color, #ffffff);
                    border: 1px solid var(--accent-color, #f0c419);
                    padding: 0.5rem 1rem;
                    border-radius: 4px;
                    cursor: pointer;
                    margin-right: 0.5rem;
                }

                .vote-section button:hover {
                    background-color: var(--accent-color, #f0c419);
                    color: var(--primary-color, #1a1a1a);
                }
                .resale-button {
                    margin-top: 1rem;
                    background-color: var(--accent-color, #f0c419);
                    color: var(--primary-color, #1a1a1a);
                    border: none;
                    padding: 0.75rem 1.5rem;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: 700;
                }
                .chart-container {
                    width: 100%;
                    height: 200px;
                    margin-top: 1rem;
                }
            </style>
            <div class="card">
                <div class="card-image">
                    <img src="${imageUrl}" alt="${projectName}">
                </div>
                <div class="card-content">
                    <h3>${projectName}</h3>
                    <p class="developer">by ${developer}</p>
                    <p><strong>Recent Transactions:</strong> ${recentTransactions}</p>
                    <p><strong>Target Market:</strong> ${targetMarket}</p>
                    <div class="vote-section">
                        <button data-vote="good">Good Buy</button>
                        <button data-vote="fair">Fair Buy</button>
                        <button data-vote="bad">Bad Buy</button>
                    </div>
                    <div class="chart-container"></div>
                    <button class="resale-button">View Resale Prices</button>
                </div>
            </div>
        `;
    }

    initChart(votes = { good: 1, fair: 1, bad: 1 }) {
        google.charts.load('current', {packages:['corechart']});
        google.charts.setOnLoadCallback(() => {
            const data = google.visualization.arrayToDataTable([
                ['Sentiment', 'Votes'],
                ['Good Buy', votes.good],
                ['Fair Buy', votes.fair],
                ['Bad Buy', votes.bad],
            ]);

            const options = {
                backgroundColor: 'transparent',
                legend: 'none',
                pieSliceText: 'label',
                pieHole: 0.4,
                 slices: {
                    0: { color: '#4CAF50' },
                    1: { color: '#FFC107' },
                    2: { color: '#F44336' },
                },
                chartArea: { left: 0, top: 10, width: '100%', height: '90%' },
            };

            const chart = new google.visualization.PieChart(this.shadowRoot.querySelector('.chart-container'));
            chart.draw(data, options);
        });
    }

    attachEventListeners() {
        this.shadowRoot.querySelector('.vote-section').addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') {
                const vote = e.target.dataset.vote;
                this.dispatchEvent(new CustomEvent('vote', { 
                    bubbles: true, 
                    composed: true, 
                    detail: { vote, projectName: this.getAttribute('project-name') } 
                }));
            }
        });
    }

}

customElements.define('property-card', PropertyCard);

// Mock Firebase Config
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
} 
const db = firebase.firestore();

const properties = [
    {
        projectName: "The Continuum",
        developer: "Hoi Hup Realty & Sunway Developments",
        imageUrl: "https://source.unsplash.com/400x200/?condo,singapore,architecture,day&seed=13",
        recentTransactions: "$2.1M - $3.2M",
        targetMarket: "District 15",
    },
    {
        projectName: "Terra Hill",
        developer: "Hoi Hup Realty & Sunway Developments",
        imageUrl: "https://source.unsplash.com/400x200/?apartment,asia,exterior,sunny&seed=14",
        recentTransactions: "$1.8M - $2.9M",
        targetMarket: "District 5",
    },
    {
        projectName: "Lentor Hills Residences",
        developer: "GuocoLand, Hong Leong Holdings & TID",
        imageUrl: "https://source.unsplash.com/400x200/?singapore,residence,building,bright&seed=15",
        recentTransactions: "$1.5M - $2.5M",
        targetMarket: "District 26",
    },
    {
        projectName: "Sceneca Residence",
        developer: "MCC Land, Ekovest & The Place Holdings",
        imageUrl: "https://source.unsplash.com/400x200/?condo,asia,architecture,clean&seed=16",
        recentTransactions: "$1.3M - $2.2M",
        targetMarket: "District 16",
    },
    {
        projectName: "The Reserve Residences",
        developer: "Far East Organization & Sino Group",
        imageUrl: "https://source.unsplash.com/400x200/?condo,singapore,exterior,modern&seed=17",
        recentTransactions: "$1.9M - $3.5M",
        targetMarket: "District 21",
    },
    {
        projectName: "Grand Dunman",
        developer: "SingHaiyi Group",
        imageUrl: "https://source.unsplash.com/400x200/?apartment,singapore,pool,luxury&seed=18",
        recentTransactions: "$2.2M - $4.0M",
        targetMarket: "District 15",
    },
    {
        projectName: "Pinetree Hill",
        developer: "UOL Group & Singapore Land Group",
        imageUrl: "https://source.unsplash.com/400x200/?residence,building,asia,green&seed=19",
        recentTransactions: "$1.7M - $2.8M",
        targetMarket: "District 21",
    },
    {
        projectName: "Tembusu Grand",
        developer: "CDL & MCL Land",
        imageUrl: "https://source.unsplash.com/400x200/?singapore,condo,exterior,dusk&seed=20",
        recentTransactions: "$2.0M - $3.1M",
        targetMarket: "District 15",
    },
        {
        projectName: "Blossoms by the Park",
        developer: "EL Development",
        imageUrl: "https://source.unsplash.com/400x200/?apartment,singapore,park,modern&seed=21",
        recentTransactions: "$1.4M - $2.3M",
        targetMarket: "District 5",
    },
    {
        projectName: "The Myst",
        developer: "CDL",
        imageUrl: "https://source.unsplash.com/400x200/?condo,singapore,nature,luxury&seed=22",
        recentTransactions: "$1.6M - $2.7M",
        targetMarket: "District 23",
    },
    {
        projectName: "J'den",
        developer: "CapitaLand Development",
        imageUrl: "https://source.unsplash.com/400x200/?residential,singapore,futuristic&seed=23",
        recentTransactions: "$2.3M - $3.8M",
        targetMarket: "District 22",
    },
    {
        projectName: "Watten House",
        developer: "UOL Group & Singapore Land Group",
        imageUrl: "https://source.unsplash.com/400x200/?condo,singapore,exterior,premium&seed=24",
        recentTransactions: "$3.0M - $5.5M",
        targetMarket: "District 11",
    },
];

const advertisements = [
    { title: 'Expert Property Agents', content: 'Contact us for a free consultation.', button: 'Contact Agent' },
    { title: 'Latest Developments', content: 'Discover your dream home today.', button: 'Learn More' },
    { 
        title: 'Best Mortgage Rates', 
        type: 'calculator',
        content: '', 
        button: 'Calculate' 
    },
    { title: 'Home Services', content: 'Find trusted interior designers, plumbers, and electricians.', button: 'Get a Quote' },
];

const resources = [
    { name: 'Urban Redevelopment Authority (URA)', url: '#' },
    { name: 'Data.gov.sg', url: '#' },
    { name: 'Monetary Authority of Singapore (MAS)', url: '#' },
    { name: 'PropertyGuru.com', url: '#' },
    { name: 'Singapore Government Property Portal', url: '#' },
];

const newLaunchesSection = document.getElementById('new-launches');
const paginationContainer = document.getElementById('pagination-container');
const advertisementsCarousel = document.querySelector('#advertisements .carousel');
const resourcesList = document.querySelector('#resources ul');
const modal = document.getElementById('resale-modal');
const closeModalButton = document.querySelector('.close-button');
const resaleTableContainer = document.getElementById('resale-table-container');

const propertiesPerPage = 6;
let currentPage = 1;

function displayProperties(page) {
    newLaunchesSection.innerHTML = '';
    const startIndex = (page - 1) * propertiesPerPage;
    const endIndex = startIndex + propertiesPerPage;
    const paginatedProperties = properties.slice(startIndex, endIndex);

    paginatedProperties.forEach(prop => {
        const card = document.createElement('property-card');
        card.setAttribute('project-name', prop.projectName);
        card.setAttribute('developer', prop.developer);
        card.setAttribute('image-url', prop.imageUrl);
        card.setAttribute('recent-transactions', prop.recentTransactions);
        card.setAttribute('target-market', prop.targetMarket);
        newLaunchesSection.appendChild(card);
    });
}

function setupPagination() {
    const pageCount = Math.ceil(properties.length / propertiesPerPage);
    paginationContainer.innerHTML = '';

    for (let i = 1; i <= pageCount; i++) {
        const button = document.createElement('button');
        button.classList.add('pagination-button');
        button.innerText = i;
        if (i === currentPage) {
            button.classList.add('active');
        }
        button.addEventListener('click', () => {
            currentPage = i;
            displayProperties(currentPage);
            setupPagination();
        });
        paginationContainer.appendChild(button);
    }
}

function generateSampleTransactions() {
    const transactions = [];
    const numTransactions = Math.floor(Math.random() * 8) + 3; // 3 to 10 transactions
    const types = ['2-bedroom', '3-bedroom', '4-bedroom', 'Penthouse'];

    for (let i = 0; i < numTransactions; i++) {
        const date = new Date(new Date() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const price = (Math.random() * 2 + 1.5).toFixed(2); // Price between 1.5M and 3.5M
        const size = Math.floor(Math.random() * 800) + 800; // Size between 800 and 1600 sqft
        const type = types[Math.floor(Math.random() * types.length)];
        transactions.push({ date, price: `$${price}M`, size, type });
    }
    return transactions;
}

function displayResaleData() {
    const transactions = generateSampleTransactions();
    let tableHTML = `
        <table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Price</th>
                    <th>Size (sqft)</th>
                    <th>Type</th>
                </tr>
            </thead>
            <tbody>
    `;
    transactions.forEach(t => {
        tableHTML += `<tr><td>${t.date}</td><td>${t.price}</td><td>${t.size}</td><td>${t.type}</td></tr>`;
    });
    tableHTML += `
            </tbody>
        </table>
    `;
    resaleTableContainer.innerHTML = tableHTML;
    modal.style.display = 'block';
}

function calculateMortgage(loanAmount, interestRate, loanTerm) {
    const principal = parseFloat(loanAmount);
    const rate = parseFloat(interestRate) / 100 / 12;
    const payments = parseFloat(loanTerm) * 12;

    if (principal > 0 && rate > 0 && payments > 0) {
        const x = Math.pow(1 + rate, payments);
        const monthly = (principal * x * rate) / (x - 1);
        return monthly.toFixed(2);
    }
    return '0.00';
}

displayProperties(currentPage);
setupPagination();

advertisementsCarousel.innerHTML = '';
advertisements.forEach(ad => {
    const adCard = document.createElement('div');
    adCard.className = 'advertisement-card';

    if (ad.type === 'calculator') {
        adCard.innerHTML = `
            <h4>${ad.title}</h4>
            <div class="calculator-inputs">
                <input type="number" id="loanAmount" placeholder="Loan Amount ($)">
                <input type="number" id="interestRate" placeholder="Interest Rate (%)">
                <input type="number" id="loanTerm" placeholder="Loan Term (Years)">
            </div>
            <button id="calculateMortgageBtn">${ad.button}</button>
            <div id="mortgageResult"></div>
        `;
        advertisementsCarousel.appendChild(adCard);

        const calculateBtn = adCard.querySelector('#calculateMortgageBtn');
        calculateBtn.addEventListener('click', () => {
            const loanAmount = adCard.querySelector('#loanAmount').value;
            const interestRate = adCard.querySelector('#interestRate').value;
            const loanTerm = adCard.querySelector('#loanTerm').value;
            const monthlyPayment = calculateMortgage(loanAmount, interestRate, loanTerm);
            const resultDiv = adCard.querySelector('#mortgageResult');
            resultDiv.innerHTML = `<p>Monthly Payment: <strong>$${monthlyPayment}</strong></p>`;
        });

    } else {
         adCard.innerHTML = `
            <h4>${ad.title}</h4>
            <p>${ad.content}</p>
            <button>${ad.button}</button>
        `;
        advertisementsCarousel.appendChild(adCard);
    }
});

resources.forEach(resource => {
    const listItem = document.createElement('li');
    listItem.innerHTML = `<a href="${resource.url}" target="_blank">${resource.name}</a>`;
    resourcesList.appendChild(listItem);
});

newLaunchesSection.addEventListener('click', (e) => {
    if (e.target.shadowRoot.querySelector('.resale-button')) {
        displayResaleData();
    } else if (e.target.classList.contains('resale-button')) {
        displayResaleData();
    }
});

newLaunchesSection.addEventListener('vote', async (e) => {
    const { vote, projectName } = e.detail;
    const docRef = db.collection('property-votes').doc(projectName);
    const doc = await docRef.get();

    if (!doc.exists) {
        await docRef.set({ good: 0, fair: 0, bad: 0 });
    }

    await docRef.update({ [vote]: firebase.firestore.FieldValue.increment(1) });

    const updatedDoc = await docRef.get();
    const votes = updatedDoc.data();

    const card = e.target;
    card.initChart(votes);
});

closeModalButton.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});
