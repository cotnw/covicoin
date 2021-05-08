let user = {}

fetch(`/profile/details?token=${localStorage.getItem('token')}`).then(response => {
    console.log(response)
    response.json().then(res => {
        user = res
        console.log(res)
        document.getElementById('name').innerHTML = user.name
        document.getElementById('username').innerHTML = `@${user.username}`
        document.getElementById('covicoins-count').innerHTML = user.covicoins
        document.getElementById('all-leads-count').innerHTML = user.leads_total
        document.getElementById('today-leads-count').innerHTML = user.leads_total_today
        document.getElementById('daily-limit-left').innerHTML = user.daily_limit_left
        document.getElementById('streak').innerHTML = user.streak
    })
})