Array.prototype.forEach.call(document.getElementsByClassName('token'), function(element) {
    element.href += `?token=${localStorage.getItem('token')}`
});