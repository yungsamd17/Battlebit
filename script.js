document.addEventListener("DOMContentLoaded", function() {
  // Function to fetch API data
  function retrieveApiData() {
    const url = "https://publicapi.battlebit.cloud/Servers/GetServerList";
    return fetch(url).then(response => response.json());
  }

  // Function to format number with commas
  function formatNumberWithCommas(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  // Function to display player count information
  function displayPlayerCountInfo(apiData) {
    // Calculate total player count
    const totalPlayers = apiData.reduce((sum, server) => sum + server.MaxPlayers, 0);
    document.getElementById("total-players").textContent = formatNumberWithCommas(totalPlayers);

    // Display player count per region
    const playerCountPerRegion = {};
    for (const server of apiData) {
      const region = server.Region;
      const maxPlayers = server.MaxPlayers;
      playerCountPerRegion[region] = (playerCountPerRegion[region] || 0) + maxPlayers;
    }

    const playerCountPerRegionContainer = document.getElementById("player-count-per-region");
    const playerCountPerRegionTable = document.createElement("table");
    const playerCountPerRegionTableHeader = playerCountPerRegionTable.createTHead();
    const playerCountPerRegionTableBody = playerCountPerRegionTable.createTBody();
    const playerCountPerRegionHeaderRow = playerCountPerRegionTableHeader.insertRow();
    const regionHeaderCell = playerCountPerRegionHeaderRow.insertCell();
    const playerCountHeaderCell = playerCountPerRegionHeaderRow.insertCell();
    regionHeaderCell.textContent = "REGION";
    playerCountHeaderCell.textContent = "PLAYER COUNT";

    for (const region in playerCountPerRegion) {
      const row = playerCountPerRegionTableBody.insertRow();
      const regionCell = row.insertCell();
      const playerCountCell = row.insertCell();
      const formattedRegion = region.replace(/_/g, ' '); // Replace underscores with spaces
      regionCell.textContent = formattedRegion;
      playerCountCell.textContent = formatNumberWithCommas(playerCountPerRegion[region]);
    }

    playerCountPerRegionContainer.appendChild(playerCountPerRegionTable);

    // Display map occurrences
    const mapCounts = apiData.reduce((counts, server) => {
      counts[server.Map] = (counts[server.Map] || 0) + 1;
      return counts;
    }, {});

    const mapOccurrencesContainer = document.getElementById("map-occurrences");
    const mapOccurrencesTable = document.createElement("table");
    const mapOccurrencesTableHeader = mapOccurrencesTable.createTHead();
    const mapOccurrencesTableBody = mapOccurrencesTable.createTBody();
    const mapOccurrencesHeaderRow = mapOccurrencesTableHeader.insertRow();
    const mapNameHeaderCell = mapOccurrencesHeaderRow.insertCell();
    const occurrencesHeaderCell = mapOccurrencesHeaderRow.insertCell();
    mapNameHeaderCell.textContent = "MAP NAME";
    occurrencesHeaderCell.textContent = "OCCURRENCES";

    for (const mapName in mapCounts) {
      const row = mapOccurrencesTableBody.insertRow();
      const mapNameCell = row.insertCell();
      const occurrencesCell = row.insertCell();
      mapNameCell.textContent = mapName;
      occurrencesCell.textContent = mapCounts[mapName];
    }

    mapOccurrencesContainer.appendChild(mapOccurrencesTable);

    // Display max player count occurrences
    const maxPlayerCountCounts = apiData.reduce((counts, server) => {
      counts[server.MaxPlayers] = (counts[server.MaxPlayers] || 0) + 1;
      return counts;
    }, {});

    const maxPlayerCountOccurrencesContainer = document.getElementById("max-player-count-occurrences");
    const maxPlayerCountOccurrencesTable = document.createElement("table");
    const maxPlayerCountOccurrencesTableHeader = maxPlayerCountOccurrencesTable.createTHead();
    const maxPlayerCountOccurrencesTableBody = maxPlayerCountOccurrencesTable.createTBody();
    const maxPlayerCountOccurrencesHeaderRow = maxPlayerCountOccurrencesTableHeader.insertRow();
    const maxPlayerCountHeaderCell = maxPlayerCountOccurrencesHeaderRow.insertCell();
    const occurrencesHeaderCell2 = maxPlayerCountOccurrencesHeaderRow.insertCell();
    maxPlayerCountHeaderCell.textContent = "MODE (Players)";
    occurrencesHeaderCell2.textContent = "OCCURRENCES";

    for (const maxPlayers in maxPlayerCountCounts) {
      const row = maxPlayerCountOccurrencesTableBody.insertRow();
      const maxPlayersCell = row.insertCell();
      const occurrencesCell = row.insertCell();
      maxPlayersCell.textContent = maxPlayers;
      occurrencesCell.textContent = maxPlayerCountCounts[maxPlayers];
    }

    maxPlayerCountOccurrencesContainer.appendChild(maxPlayerCountOccurrencesTable);
  }

  // Call the function to retrieve the API data and display player count information
  retrieveApiData()
    .then(apiData => {
      if (apiData) {
        displayPlayerCountInfo(apiData);
      }
    })
    .catch(error => {
      console.error("Error occurred while retrieving API data:", error.message);
    });
});
