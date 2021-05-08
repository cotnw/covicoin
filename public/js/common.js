Array.prototype.forEach.call(document.getElementsByClassName('token'), function(element) {
    console.log(element.href)
    element.href += `?token=${localStorage.getItem('token')}`
});