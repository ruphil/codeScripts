function manageMoney(money, person){
    console.log(money, person);
    let balance = document.getElementById(person).innerText.replace(/,/g, '');
    let newBalance = parseInt(balance) + money;
    console.log(newBalance);
    document.getElementById(person).innerText = newBalance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
