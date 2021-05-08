let leaderboardHTML = `<table class="initial-table">
<tr>
    <th>Rank</th>
    <th>Username</th>
    <th style="width: 28%;">COVICoins earned</th>
    <th style="width: 28%;">Verified Leads</th>
    <th>Streak</th>
</tr>
</table>`

fetch('/leaderboard/data').then(response => {
    response.json().then(res => {
        res.forEach((user, index) => {
            leaderboardHTML += `<table class="second-table">
                <tr>
                    <th style="width: 9%;">${index+1}</th>
                    <th style="width: 23%;"><a href="https://twitter.com/${user.username}" target="_blank">@${user.username}<a></th>
                    <th style="width: 18%;">${user.covicoins}</th>
                    <th style="width: 40%;">${user.leads}</th>
                    <th>${user.streak} days</th>
                </tr>
            </table>`
        })
        document.getElementById('leaderboard-inflate').innerHTML = leaderboardHTML
    })
})