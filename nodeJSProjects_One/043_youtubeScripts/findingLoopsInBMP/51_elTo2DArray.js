let objArr = [];

objArr[0] = ["jack"];
objArr[1] = ["pack"];

// adding new element
var newIndex = objArr.length;
objArr[newIndex] = ["happy"];

// adding element to already available object
for (let i = 0; i < objArr.length; i++) {
    const object = objArr[i];
    for (let j = 0; j < object.length; j++) {
        const el = object[j];
        if(el == "happy"){
            console.log(i);
        }   
    }
}

// console.log(objArr);