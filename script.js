document.addEventListener("DOMContentLoaded", function() {
    const allSlotsContainer = document.getElementById('all-slots');
    const topSlotsContainer = document.getElementById('top-slots');
    const totalPlayersElement = document.getElementById('total-players');
    const shuffleBanner = document.getElementById('shuffle-banner');
    let slots = Array.from(allSlotsContainer.getElementsByClassName('slot')).filter(slot => !slot.classList.contains('coming-soon'));

    function assignRandomWinRates() {
        slots.forEach(slot => {
            let winRate = Math.floor(Math.random() * 91) + 10; // Random win rate between 10 and 100
            slot.setAttribute('data-percentage', winRate);
            updateBar(slot);
            updatePlayerCount(slot, winRate);
        });
        updateTotalPlayers();
    }

    function updateSlots() {
        // Sort slots by percentage
        slots.sort((a, b) => {
            const percentageA = parseInt(a.getAttribute('data-percentage'), 10);
            const percentageB = parseInt(b.getAttribute('data-percentage'), 10);
            return percentageB - percentageA;
        });

        // Clear and update top slots container with top 3 slots
        topSlotsContainer.innerHTML = '';
        slots.slice(0, 3).forEach(slot => {
            const clonedSlot = slot.cloneNode(true);
            clonedSlot.querySelector('.progress-bar .fill').style.width = slot.querySelector('.progress-bar .fill').style.width;
            topSlotsContainer.appendChild(clonedSlot);
        });

        // Ensure all slots are re-rendered
        allSlotsContainer.innerHTML = '';
        slots.forEach(slot => {
            allSlotsContainer.appendChild(slot);
        });

        //        // Ensure "Coming Soon" is last
        const comingSoonSlot = allSlotsContainer.querySelector('.coming-soon');
        if (comingSoonSlot) {
            allSlotsContainer.appendChild(comingSoonSlot);
        }
    }

    function updateBar(slot) {
        const bar = slot.querySelector('.progress-bar');
        const currentPercentage = parseInt(slot.getAttribute('data-percentage'), 10);
        const fill = bar.querySelector('.fill');
        const percentageText = bar.querySelector('.percentage');
        fill.style.width = currentPercentage + '%';
        percentageText.textContent = currentPercentage + '%';

        const chanceLabel = slot.querySelector('.chance-label');
        const adviceText = slot.querySelector('.advice');
        const color = getColorAndAdvice(currentPercentage, chanceLabel, adviceText);
        fill.style.background = color;
    }

    function getColorAndAdvice(percentage, chanceLabel, adviceText) {
        if (percentage >= 70) {
            chanceLabel.textContent = "High Chances of Winning";
            adviceText.textContent = "Recommended Bet: 10-15 pesos";
            return 'linear-gradient(to right, #00ff00, #008000)';
        } else if (percentage >= 40) {
            chanceLabel.textContent = "Moderate Chances of Winning";
            adviceText.textContent = "Recommended Bet: 4-9 pesos";
            return 'linear-gradient(to right, #ffbf00, #ffa500)';
        } else {
            chanceLabel.textContent = "Low Chances of Winning";
            adviceText.textContent = "Recommended Bet: 1-3 pesos";
            return 'linear-gradient(to right, #ff0000, #8b0000)';
        }
    }

    function updatePlayerCount(slot, winRate) {
        const playerCountElement = slot.querySelector('.player-count');
        const maxPlayers = 58000; // Max 58K players
        const minPlayers = 10000; // Min 10K players
        const playerCount = maxPlayers - Math.floor((winRate / 100) * (maxPlayers - minPlayers));
        playerCountElement.textContent = `${playerCount.toLocaleString()} Players Playing`;
        return playerCount;
    }

    function updateTotalPlayers() {
        let totalPlayers = 0;
        slots.forEach(slot => {
            const winRate = parseInt(slot.getAttribute('data-percentage'), 10);
            totalPlayers += updatePlayerCount(slot, winRate);
        });
        totalPlayersElement.textContent = `Total Online Players: ${totalPlayers.toLocaleString()}`;
    }

    function fluctuatePercentages() {
        slots.forEach(slot => {
            let currentPercentage = parseInt(slot.getAttribute('data-percentage'), 10);
            const fluctuation = Math.floor(Math.random() * 11) - 5; // Random change between -5 and 5
            let newPercentage = currentPercentage + fluctuation;

            // Clamp the percentage between 0 and 100
            if (newPercentage > 100) newPercentage = 100;
            if (newPercentage < 0) newPercentage = 0;

            slot.setAttribute('data-percentage', newPercentage);
            updateBar(slot);
        });

        updateSlots();
        updateTotalPlayers();
        shuffleUsernames();
    }

    function generateUsernames() {
        const usernames = [];
        const slotNames = ['superace', 'superacedeluxe', 'superaceultimate', 'fortunegems', 'fortunegems2', 'sweetbonanza', 'sweetbonanza1000', 'gatesofolympus', 'moneycoming', 'sugarrush1000', 'goldenempire', 'chinesenewyear2'];
        
        for (let i = 0; i < 1000; i++) {
            const randomSlot = slotNames[Math.floor(Math.random() * slotNames.length)];
            const randomName = Math.random().toString(36).substring(2, 5).toUpperCase() + '***';
            usernames.push({ name: randomName, slot: randomSlot });
        }
        return usernames;
    }

    const usernames = generateUsernames();

    function shuffleUsernames() {
        shuffleBanner.innerHTML = '';
        const numberOfUsernames = Math.floor(Math.random() * 3) + 1; // Display 1 to 3 usernames
        for (let i = 0; i < numberOfUsernames; i++) {
            const randomUser = usernames[Math.floor(Math.random() * usernames.length)];
            const slotImage = document.querySelector(`.slot[data-id="${randomUser.slot}"] .slot-image`).src;
            const playerCount = updatePlayerCount(document.querySelector(`.slot[data-id="${randomUser.slot}"]`), parseInt(document.querySelector(`.slot[data-id="${randomUser.slot}"]`).getAttribute('data-percentage'), 10));
            const userText = document.createElement('div');
            userText.innerHTML = `<img src="${slotImage}" alt="${randomUser.slot}" class="username-slot-image"> ${randomUser.name} ${randomUser.slot.toUpperCase()} ${playerCount.toLocaleString()}`;
            shuffleBanner.appendChild(userText);
        }
    }

    assignRandomWinRates();
    updateSlots();

    // Simulate dynamic percentage changes
    setInterval(fluctuatePercentages, Math.random() * 5000 + 5000); // Random interval between 5 and 10 seconds

    // Display current date and time in the Philippines
    function updateDateTime() {
        const options = {
            timeZone: 'Asia/Manila',
            hour12: true,
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        };
        const now = new Date().toLocaleDateString('en-US', options);
        document.getElementById('datetime').textContent = now;
    }

    setInterval(updateDateTime, 1000);
    updateDateTime();
});
