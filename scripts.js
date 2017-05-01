"use strict";//JS 1.0 -> Ecmascript 1.0 -> ES7.0 -> ES.Next(8.0) | ES5 | ES6
//TODO: Change speed during runtime
//TODO: Run step by step the animation
//TODO: Pause animation during runtime
//TODO: Choose a new array without cleaning the data
//TODO: Run all the sorts at the same time -> Change from Combobox to checkboxes
//TODO: Add notification when the sort is done
//TODO: Takeout all javascript calls from HTML
//TODO: Beautify the code
//TODO: Make speed a non global variable
//TODO: Check why CPU is not 0 after sort is complete
//TODO: Go over the entire code and fix codiding convention
//TODO: function "makeArr" should only create an array, function "makeInputs" should create all the inputs
//TODO: fix scrolling bug http://stackoverflow.com/questions/25630035/javascript-getboundingclientrect-changes-while-scrolling

// http://jsfiddle.net/Noseratio/r56Vb/5	// yield delay
//https://developer.mozilla.org/en-US/docs/Web/Events/DOMContentLoaded
// <script src="https://gist.githubusercontent.com/KenCorbettJr/4691882/raw/979cc6d3dd86c7c68802d35bec67c2ef7f135563/Javascript%2520Quicksort"></script>
//https://github.com/jo/JSColor - color polyfill
//http://phrogz.net/SVG/animation_on_a_curve.html

// יצירת מערך
/*
ניתן להגדיר צבעים, כמות תאים וכן לקבוע ערכים באופן ידני או רנדומלי
לאחר לחיצה על כפתור "צור מערך" האפשרויות הללו נחסמות
ונפתחות אפשרות בחירת סוג המיון ומהירות הצגתו
input המערך עשוי מתאי
*/
function makeArr() {
    // חסימת הגדרות מאפייני מערך ופתיחת הגדרות מאפייני מיון
    disableElem("fieldset1", true);
    disableElem("fieldset2", false);

    document.getElementById("btnCreateArray").className = "button";
    document.getElementById("btnSort").className = "button aqua";

    let arr = [];
    let arrSize = Number(document.getElementById("inputsNum").value);
    let arrElem = document.getElementById("arr"); // <div id="arr">
    let color = document.getElementById("inputsColor2").value; // צבע הגופן
    let backgroundColor = document.getElementById("inputsColor1").value;

    for (let i = 0, pos = 0; i < arrSize; i++) {
        let input = document.createElement("input"); // input כל תא מוגדר בשדה טקסט מסוג 
        input.className = "cell";
        input.style.color = color; // צבע גופן
        input.style.backgroundColor = backgroundColor; // צבע רקע
        input.type = "number"; // הקלט מסוג מספר

        //input.onchange = 
        input.onkeyup = function () { this.style.width = ((this.value.length + 3) * 8) + 'px' }; // שינוי אוטומטי של רוחב התא בהתאם להגדלת/הקטנת הערך ע"י החיצים או בהקלדה

        if (document.getElementById("random").checked) {
            let min = Number(document.getElementById("min").value); // ערך מינימלי להגרלה
            let max = Number(document.getElementById("max").value); // ערך מקסימלי להגרלה
            let point = Number(document.getElementById("point").value); // כמות ספרות אחרי הנקודה להגרלה
            let value = Number((Math.random() * (max - min) + min).toFixed(point)); // הגרלת ערך
            input.value = value;
            //	input.style.width = ((max.toString().length + point + 3) * 8).toString() + "px"; // כל התאים ברוחב זהה - רוחב הערך המקסימלי האפשרי
        }

        input.style.width = ((input.value.length + 3) * 8) + "px"; // רוחב כל תא בהתאם לתכנו
        arrElem.appendChild(input); // html הצגת התא בדף ה
        arr.push(input);
    }

    //Start: Added by Ohad
    let myArr = [4, 5, 2, 1, 3, 9, 5000, 4, 700, 6];
    for (let i = 0; i < arr.length; i++) {
        arr[i].value = myArr[i];
        arr[i].style.width = ((arr[i].value.length + 3) * 8) + "px"; // רוחב כל תא בהתאם לתכנו
    }
    //End: Added by Ohad

    return arr;
}

// הפעלת/חסימת אלמנט
function disableElem(elemId, disabled) {
    document.getElementById(elemId).disabled = disabled;
}

// בחירת מיון
let speed; // מהירות המיון
function sort(arr) {

    // חסימת הגדרות מאפייני מיון
    disableElem("fieldset2", true);

    // ה 1 + כי לא ניתן להריץ את האנימציה במהירות 0
    // ה 40 * כי האמצע של הסקלה זה 50 ו 2000 = 50 * 40
    // האנימציה מוצגת במהירות נוכה לצפיה כאשר היא מכוונת על 2000 שזה 2 שניות
    // ה 2000 מתייחס לאנימציה של ההשוואה בין שני תאים. לפי זה מחושבת האנימציה של ההחלפה בין שני תאים
    speed = (100 - (Number(document.getElementById("speed").value)) + 1) * 40;

    //debugger;
    // בפונקציה הנ"ל יש באג, שהמיקום החדש לא מדויק, לא הבנתי מה ההבדל בין כל הסוגים הבאים
    // arr[i].getBoundingClientRect().left
    // arr[i].offsetLeft
    // arr[i].style.left

    // relative אחד שמוגדר כ div וכולם מוגדרים בתוך absolute מוגדר כ input כדי שהאנימציה תוכל לפעול, כל
    // גורם לתאים לאבד את מיקומם. מטרת הלולאה להתגבר על באג זה absolute קיים באג שבהגדרת
    // הבעיה היא שהצורה הזו גורמת לכך שכשתא אחד מתעדכן בערך רחב יותר שאר התאים לא זזים
    // for (let i = 0; i < arr.length; i++) {
    //     let left = arr[i].offsetLeft;
    //     //console.log("left = " + left);
    //     //arr[i].style.position = "absolute";
    //     arr[i].style.left = left + "px";
    //     //console.log("left = " + left);
    //     //alert("left = " + left);	
    // }

    let e = document.getElementById("selectSort").value;

	switch (e) {
		case "bubble": bubbleSort(arr); break;
		case "selection": selectionSort(arr); break;
		case "insertion": insertionSort(arr); break;
		case "merge": mergeSort(arr); break;
		case "quick": quickSort(arr); break;
		case "all": {
			let arrBubble = copyInputs(arr, "arrBubble");
			let arrSelection = copyInputs(arr, "arrSelection");
			bubbleSort(arrBubble, "compBubble", "swapBubble");
			selectionSort(arrSelection, "compSelection", "swapSelection");
			} break;
	}
}

// הסבר של כל מיון
function sortExplanation() {
	document.getElementById("bubbleExplanation").style.display = "none";
	document.getElementById("selectionExplanation").style.display = "none";
	document.getElementById("insertionExplanation").style.display = "none";
	document.getElementById("mergeExplanation").style.display = "none";
	document.getElementById("quickExplanation").style.display = "none";

	let selectSort = document.getElementById("selectSort").value;
	if (selectSort != "all")
		document.getElementById(selectSort + "Explanation").style.display = "block";
}

// מיון בועות
function bubbleSort(arrI, compId = "comp", swapId = "swap") {

	let arr = [];
	for(let i = 0; i < arrI.length; i++)
		arr[i] = Number(arrI[i].value);

	let steps = 0;
	let sorted = false;
	for (let i = 0; i < arr.length - 1; i++) {
		sorted = true;
		setTimeout(function() {onArrow (arrI[arr.length - 1 - i]);}, (steps++) * speed);
        for (let j = 0; j < arr.length - 1 - i; j++) {
			document.getElementById(compId).textContent = Number(document.getElementById(compId).textContent) + 1; // הגדלת מונה ההשוואות
			setTimeout(function() {compareAnimation(arrI[j] , arrI[j + 1]);}, (steps++) * speed); // אנימציה של השוואה
			if (arr[j] > arr[j + 1]) {
				sorted = false;
				document.getElementById(swapId).textContent = Number(document.getElementById(swapId).textContent) + 1; // הגדלת מונה החלפת הערכים
				setTimeout(function() {swapAnimation(arrI[j], arrI[j + 1]);}, (steps++) * speed); // אנימציה של החלפה
				let tmp = arr[j];
				arr[j] = arr[j + 1];
				arr[j + 1] = tmp;
			}
		}
		setTimeout(function() {offArrow (arrI[arr.length - 1 - i]);}, (steps) * speed);
		if (sorted) break;
	}
}

/*
function bubbleSort(arr, compId = "comp", swapId = "swap") {
    let steps = 0;
    let sorted = false,
        finish;
    for (let i = 0; i < arr.length - 1; i++) {
        for (let j = 0; j < arr.length - 1 - i; j++) {
            setTimeout(function (j, end) {
                if (finish) return;
                if (j == 0) sorted = true;
                document.getElementById(compId).textContent = Number(document.getElementById(compId).textContent) + 1; // הגדלת מונה ההשוואות
                if (compareAnimation(arr[j], arr[j + 1]) == 1) {
                    sorted = false;
                    document.getElementById(swapId).textContent = Number(document.getElementById(swapId).textContent) + 1; // הגדלת מונה החלפת הערכים
                    swapAnimation(arr[j], arr[j + 1]);
                }
                if (sorted && j === end) finish = true;
            }, (steps++) * speed * 1.05, j, arr.length - 2 - i);
        }
    }	
}
*/

// מיון בחירה
function selectionSort (arrI, compId = "comp", swapId = "swap") {
	
	let arr = [];
	for (let i = 0; i < arrI.length; i++)
		arr[i] = Number(arrI[i].value);

	let steps = 0;
	for (let i = 0; i < arr.length - 1; i++) {
		let min = i;
		setTimeout(function() {onArrow (arrI[i]);}, (steps++) * speed);
		for (let j = i + 1; j < arr.length; j++) {
			document.getElementById(compId).textContent = Number(document.getElementById(compId).textContent) + 1; // הגדלת מונה ההשוואות
			setTimeout(function(j, min) {compareAnimation(arrI[j] , arrI[min]);}, (steps++) * speed, j, min); // אנימציה של השוואה
			if (arr[j] < arr[min])
				min = j;
		}
		if (i != min) {
			document.getElementById(swapId).textContent = Number(document.getElementById(swapId).textContent) + 1; // הגדלת מונה החלפת הערכים
			setTimeout(function(i, min) {swapAnimation(arrI[i], arrI[min]);}, (steps++) * speed, i, min); // אנימציה של החלפה
			let tmp = arr[i];
			arr[i] = arr[min];
			arr[min] = tmp;
		}
		setTimeout(function() {offArrow (arrI[i]);}, (steps) * speed);
	}
}

/*
function selectionSort(arr, compId = "comp", swapId = "swap") {
    let steps = 0;

    for (let i = 0, min = 0; i < arr.length - 1; i++) {
        for (let j = i + 1; j < arr.length; j++) {
            setTimeout(function (i, j) {
                if (j == i + 1) min = i;
                document.getElementById(compId).textContent = Number(document.getElementById(compId).textContent) + 1; // הגדלת מונה ההשוואות
                if (compareAnimation(arr[min], arr[j]) == 1)
                    min = j;

                if (j == arr.length - 1 && i != min) {
                    document.getElementById(swapId).textContent = Number(document.getElementById(swapId).textContent) + 1; // הגדלת מונה החלפת הערכים
                    swapAnimation(arr[i], arr[min]);
                }

            }, (steps++) * speed * 1.05, i, j);
        }
    }
}
*/

// מיון הכנסה
function insertionSort (arrI, compId = "comp", swapId = "swap") {

	let arr = [];
	for(let i = 0; i < arrI.length; i++)
		arr[i] = Number(arrI[i].value);
	
	let steps = 0;
	for (let i = 1; i < arr.length; i++) {
		setTimeout(function() {onArrow (arrI[i]);}, (steps++) * speed);
		for (let j = i - 1; j >= 0; j--) {
				setTimeout(function() {compareAnimation(arrI[j] , arrI[j + 1]);}, (steps++) * speed); // אנימציה של השוואה
				if (arr[j] > arr[j + 1]) {
					setTimeout(function() {swapAnimation(arrI[j], arrI[j + 1]);}, (steps++) * speed); // אנימציה של החלפה
					let tmp = arr[j];
					arr[j] = arr[j + 1];
					arr[j + 1] = tmp;
				}
				else
					break;
		}
		setTimeout(function() {offArrow (arrI[i - 1]);}, (steps) * speed);
	}
	console.log (arr + " " + comp + " " +  swap);
}

function compareAnimation(value1, value2) {
    // אנימציה
    value1.style.borderColor = value2.style.borderColor = document.getElementById("inputsColor3").value;

    // הגדלת מונה ההשוואות
    //  document.getElementById('comp').textContent = Number(document.getElementById('comp').textContent) + 1;

    // החזרת המראה הגרפי לפני האנימציה
    setTimeout(function () {
        value1.style.borderColor = value2.style.borderColor = "DarkGray";
    }, speed / 1.1);
}

function insertAfter(el, referenceNode) {
    referenceNode.parentNode.insertBefore(el, referenceNode.nextSibling);
}

// הצגת חץ
function onArrow(elem) {

	let arrI = document.getElementById("arr");
	let arrow = document.createElement("div");
	arrow.id = "arrow";
	arrow.innerHTML = String.fromCodePoint(0x1F847);
	arrow.style = "-webkit-text-fill-color: Lime; -webkit-text-stroke-width: 1px; font-size: 21px;";

	arrow.style.position = "absolute";
	arrow.style.left = elem.offsetLeft + (elem.offsetWidth / 2) - 7 + "px";
	arrow.style.top = elem.offsetTop - 30 + "px";
	arrI.appendChild(arrow);

}

// הסרת חץ
function offArrow(elem) {
	let arrow = document.getElementById("arrow");
	arrow.parentNode.removeChild(arrow);

}

/*
// רק כשהאיבר הנבחר הגיע למקומו, במקום לבצע החלפה בין כל איברים צמודים tmp גירסה מעט יותר יעילה, כי משתמשת ב
// compareAnimation, swapAnimation אבל בגלל זה לא ניתן להציגה באמצעות
function insertionSort (arrI, compId = "comp", swapId = "swap") {
	
	let arr = [];
	for(let i = 0; i < arrI.length; i++)
		arr[i] = Number(arrI[i].value);
	
	let steps = 0;
	for (let i = 1; i < arr.length; i++) {
		let tmp, j;
		for (j = i - 1, tmp = arr[i]; j >= 0; j--) {
			if (arr[j] > tmp)
				arr[j + 1] = arr[j];
			else
				break;
		}
		arr[j + 1] = tmp;
	}
}
*/

/*
function insertionSort(arr) {
    function sort(start, shift) {
        if (start === arr.length) return;
        if (compareAnimation(arr[start - shift - 1], arr[start - shift]) == 1) {
            swapAnimation(arr[start - shift - 1], arr[start - shift]);
            setTimeout(function () {
                if (shift == start - 1) {
                    sort(start + 1, 0);
                } else {
                    sort(start, shift + 1);
                }
            }, speed * 1.05);
        } else {
            setTimeout(function () {
                sort(start + 1, 0);
            }, speed * 1.05);
        }
    }
    sort(1, 0);
}
*/

// מיון מהיר
function quickSort(arrI) {
    let arr = [];
    for (let i = 0; i < arrI.length; i++) {
        arr[i] = Number(arrI[i].value);
    }
    Quicksort.sort(arr, arrI, 0, arr.length - 1);
}

let Quicksort = (function () {

    let steps = 0;
    function partition(arr, arrI, left, right) {
        let i = left - 1, j = right + 1;
		
		setTimeout (function() {onArrow (arrI[left]);}, (steps++) * speed);
		
        while (true) {
            do {
                i++;
                setTimeout (function (left, i) {compareAnimation (arrI[left], arrI[i]);}, (steps++) * speed, left, i); // אנימציה של השוואה
            } while (arr[left] > arr[i]) // pivot = arr[left]

            do {
                j--;
				setTimeout (function (j, left) {compareAnimation (arrI[j], arrI[left]);}, (steps++) * speed, j, left); // אנימציה של השוואה
            } while (arr[j] > arr[left]);
            if (i >= j) {
				setTimeout (function() {offArrow (arrI[left]);}, (steps++) * speed);
				return j;
			}
            
			setTimeout (function (i, j) {swapAnimation(arrI[i], arrI[j]);}, (steps++) * speed, i, j); // אנימציה של החלפה
            let tmp = arr[i];
            arr[i] = arr[j];
            arr[j] = tmp;
        }
    }

    function quickSort(arr, arrI, left, right) {
        if (left < right) {
	
            let pivot = partition(arr, arrI, left, right);
            quickSort(arr, arrI, left, pivot);
            quickSort(arr, arrI, pivot + 1, right);
        }
    }

    return {
        sort: quickSort
    };

})();

/*function QuickSort2(origArr){
	function partition (arr, left, right)
	{
		let i = left - 1, j = right + 1;
		while (true)
		{
			do{
			i++; 
			}while (compareAnimation (arr[left], arr[i]) == 1); // pivot = arr[left]
			do{
				j--; 
			}while (compareAnimation (arr[j], arr[left]) == 1);
			if (i >= j)			{		
				return j;
			}
			swapAnimation (arr[i], arr[j]);
		}
	}

	function quickSort(arr, left, right)
	{
		if (left < right)
		{
			let p = partition (arr, left, right);
			quickSort (arr, left, p);
			quickSort (arr, p + 1, right);
		}
	}
	
	quickSort(origArr,0,origArr.length-1);
}*/

// מיון מיזוג
function mergeSort(arr) {
    let start = 0;
    let end = arr.length - 1;
    let step = 0;
    (function buildTree(start, end, callback) {
        if (start != end) {
            bold(start, end, (speed * 1.05) / 2);
            if (start == end - 1) {
                if (compareAnimation(arr[start], arr[end]) == 1) {
                    swapAnimation(arr[start], arr[end])
                }
                setTimeout(callback, speed * 1.05);
            } else {
                setTimeout(function () {
                    buildTree(start, Math.floor((end + start) / 2), function () {
                        buildTree(Math.floor((end + start) / 2) + 1, end, function () {
                            callback();
                        });
                    });
                }, speed * 1.05);
            }
        } else setTimeout(callback, speed * 1.05);
    })(start, end, function () { });
}

function bold(start, end, time) {
    for (let i = start; i <= end; i++) {
        arr[i].style.borderColor = document.getElementById("inputsColor4").value;
    }
    setTimeout(function () {
        for (let i = start; i <= end; i++) {
            arr[i].style.borderColor = "DarkGray";
        }
    }, time);
}

function copyInputs(arr, id) {
    // let color = document.getElementById("inputsColor2").value;
    // let backgroundColor = document.getElementById("inputsColor1").value;
    // for (let i = 0; i < arr.length; i++) {
    // 	let input = document.createElement("input");
    // 	input.className = "cell";
    // 	input.style.color = color;
    //     input.style.backgroundColor = backgroundColor;
    //     input.type = "number";
    // 	input.value = arr[i].value;
    // 	input.style.width = ((input.value.toString().length + 3) * 8).toString() + "px";
    // 	input.onchange = input.onkeyup = function () { this.style.width = ((this.value.length + 3) * 8) + 'px' };
    // 	document.getElementById("arrSelection").appendChild(input);
    // }
    let clone = document.getElementById("arr").cloneNode(true);
    document.getElementById(id).appendChild(clone);

    let newArr = [];
    for (let i = 0; i < arr.length; i++) {
        clone.childNodes[i].addEventListener("keyup", function () {
            this.style.width = ((this.value.length + 3) * 8) + 'px';
        });
        newArr.push(clone.childNodes[i]);
    }
    return newArr;
}


////////////////////////// אנימציית השוואה בין 2 תאים /////////////////////////
/*function compareAnimation(value1, value2) {
    compareAnimation2(value1, value2);

    if (Number(value1.value) < Number(value2.value))
        return -1;
    if (Number(value1.value) == Number(value2.value))
        return 0;
    if (Number(value1.value) > Number(value2.value))
        return 1;
}
*/

///////////////////////// אנימציית החלפה בין 2 תאים /////////////////////////
/*
arr[i] הוא i של תא id המייצג את מיקומו במערך, כלומר ה id ויש לו input מכיוון שכל אחד מהתאים עשוי מ
בכדי לשמור על הסדר, לא נחליף בין שני תאים, אלא נסתיר את שניהם, נחליף ביניהם את הערכים, נשכפל אותם לתאים זמניים שניצור
נבצע את אנימציית ההחלפה על התאים הזמניים ובסיומה נמחק את התאים הזמניים ונציג שוב את המקוריים
*/
/**
 * Swaps two values in the heap
 *
 * @param {int} indexA Index of the first item to be swapped
 * @param {int} indexB Index of the second item to be swapped
 */
function swap(arr, i, j) {
    let tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
    //b = [a, a = b][0];
}

//  let first1= true;
//     let first2= true;

/*
function swapAnimation(elem1, elem2)
{
	let tmp = elem1.value;
	elem1.value = elem2.value;
	elem2.value = tmp;
	
	tmp = elem1.style.width;
	elem1.style.width = elem2.style.width;
	elem2.style.width = tmp;
}
*/

function swapAnimation(elem1, elem2) {//value1 == inputElement

let old = false;
/*
    let t, e2, e1 = elem1.value;
    t = e1;
    elem1.value = e2 = elem2.value;
    elem2.value = t;

    
    
    if (old) {

        let copy;
        // יצירת העתק של תא שמאל
        copy = document.createElement("input");
        copy.style.cssText = elem1.style.cssText;
        copy.style.position = "absolute";
        copy.type = elem1.type;
        copy.value = elem1.value;
        document.getElementById("arr").appendChild(copy);

        // הסתרת התאים המקוריים
        elem1.style.visibility = elem2.style.visibility = "hidden";

        // קביעת האורכים רק לאחר החלפת הערכים, למקרה שהתאים המוחלפים באורכים שונים
        o1.style.left = elem1.getBoundingClientRect().left + "px";
        o2.style.left = elem2.getBoundingClientRect().left + "px";
    }

	
			 // מחיקת ההעתקים והצגת התאים המקוריים לאחר סיום האנימציה
        if (old) {
            if (elem1.getBoundingClientRect().left == elem1toX) {             
                elem1.style.visibility = "visible"; // החזרת התאים המקוריים
                elem1.parentNode.removeChild(elem1); // הסרת העתקיי התאים
            }
        }
		
        if (old) {
            if (elem2.getBoundingClientRect().left == elem2toX) {
                elem2.style.visibility = "visible"; // החזרת התאים המקוריים             
                elem2.parentNode.removeChild(elem2); // הסרת העתקיי התאים
            }
        }


    // החלפת הערכים
    elem1.style.width = o2.style.width;
    elem2.style.width = o1.style.width;

    o1 = elem1;
    o2 = elem2;


    // הגדלת מונה החלפת הערכים
	document.getElementById('swap').textContent = Number(document.getElementById('swap').textContent) + 1;
 
	var childPos = elem1.offset();
	var parentPos = elem1.parent().offset();
	var childOffset = {
		top: childPos.top - parentPos.top,
		left: childPos.left - parentPos.left
	}
  
  
	console.log("elem1.offsetLeft " + elem1.offsetLeft);
	console.log("elem1.offsetParent.left " + elem1.offsetParent.offsetLeft);
	console.log("elem1.getBoundingClientRect().left " + elem1.getBoundingClientRect().left);
    console.log("elem1.style.left " + elem1.style.left);
  
	let left = elem1.offsetLeft;
	elem1.style.left = left.toString + "px";


	left = elem2.offsetLeft;
	elem2.style.left = left.toString + "px";
*/

  /*
	let w = elem1.style.width;
	elem1.style.width = elem2.style.width;
	elem2.style.width = w;
   */

	// ולא על מערך המספרים. החלפה זו חייבת להתבצע לפני האנימציה input החלפה זו משפיעה רק על מערך תאי ה   
//	let tmp;
	
//	tmp = elem1;
//	elem1 = elem2;
//	elem2 = tmp
	
//	tmp = elem1.value;
//	elem1.value = elem2.value;
//  elem2.value = tmp;
   
    let elem1fromX = 0; // elem1.offsetLeft; // מוצא בפיקסלים משמאל
    let elem1fromY = elem1.offsetTop; // מוצא בפיקסלים מלמעלה
    let elem1from = [elem1fromX, elem1fromY]; // מוצא בפיקסלים

    let elem1toX = elem2.offsetLeft - elem1.offsetLeft; // יעד בפיקסלים משמאל
	if (elem1.offsetWidth != elem2.offsetWidth) elem1toX += - elem1.offsetWidth + elem2.offsetWidth; // במקרה ששני התאים לא באותו אורך
    let elem1toY = elem2.offsetTop; // יעד בפיקסלים מלמעלה
    let elem1to = [elem1toX, elem1toY]; // יעד בפיקסלים

    let elem1height = 25; // גובה הקשת
    let elem1begingingControlPoint = [elem1fromX + 10, elem1fromY - elem1height];
    let elem1endControlPoint = [elem1toX - 10, elem1toY - elem1height];

    let curve1 = new CurveAnimator(elem1from, elem1to, elem1begingingControlPoint, elem1endControlPoint);

    let elem2fromX = 0; // elem2.offsetLeft; // מוצא בפיקסלים משמאל
    let elem2fromY = elem2.offsetTop; // מוצא בפיקסלים מלמעלה
	let elem2from = [elem2fromX, elem2fromY]; // מוצא בפיקסלים
	
	let elem2toX = elem1.offsetLeft - elem2.offsetLeft; // יעד בפיקסלים משמאל
//	if (elem1.offsetWidth != elem2.offsetWidth) elem2toX += elem1.offsetWidth - elem2.offsetWidth; // במקרה ששני התאים לא באותו אורך
    let elem2toY = elem1.offsetTop; // יעד בפיקסלים מלמעלה
    let elem2to = [elem2toX, elem2toY]; // יעד בפיקסלים  
	
	let elem2height = -25; // גובה הקשת
	let elem2begingingControlPoint = [elem2fromX - 10, elem2fromY - elem2height];
    let elem2endControlPoint = [elem2toX + 10, elem2toY - elem2height];

    let curve2 = new CurveAnimator(elem2from, elem2to, elem2begingingControlPoint, elem2endControlPoint);
 
	let it = 0;
 
	curve1.animate(2, function (point) {
	
		elem1.style.left = point.x + "px";
		elem1.style.top = point.y + "px";
		
	
		if (it == 0)
		{
			elem1.style.transition = "";
			elem2.style.transition = "";
			elem1.style.position = "relative";
			elem2.style.position = "relative";
		}
		if (it == 1)
		{
		}
		
		it++;
			
	
		// לאחר סיום האנימציה
		
		if (point.y == 1)
		{
			// האטת תזוזת התאים שבין התאים המוחלפים
			elem1.style.transition = "all 1s";
			elem2.style.transition = "all 1s";
			
			// החזרת כל תא למקומו
			elem1.style.position = "initial";
			elem2.style.position = "initial";
				
			// החלפת הערכים
			let tmp;
		//	tmp = elem1;
		//	elem1 = elem2;
		//	elem2 = tmp;
			
			tmp = elem1.value;
			elem1.value = elem2.value;
			elem2.value = tmp;
		
			// החלפה בין האורכים
			tmp = elem1.style.width;
			elem1.style.width = elem2.style.width;
			elem2.style.width = tmp;
		}
    });

    curve2.animate(2, function (point) {

        elem2.style.left = point.x + "px";
        elem2.style.top = point.y + "px";
    });
}

//////////////////////////////////////////////////////////// BEGIN CurveAnimator /////////////////////////////////////////////////////
function CurveAnimator(from, to, c1, c2) {
    this.path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    this.path.setAttribute('d', 'M' + from.join(',') + 'C' + c1.join(',') + ' ' + c2.join(',') + ' ' + to.join(','));
    this.updatePath();
}

CurveAnimator.prototype.animate = function (duration, callback, delay) {
	
    let curveAnim = this;
    clearInterval(curveAnim.animTimer);
    let startTime = new Date;
    curveAnim.animTimer = setInterval(function () {
        let now = new Date;
        let elapsed = (now - startTime) / (speed / 4);
        let percent = elapsed / duration;
        if (percent >= 1) {
            percent = 1;
            clearInterval(curveAnim.animTimer);
        }
        let rotateDegree = 0; // Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI
        callback(curveAnim.pointAt(percent), rotateDegree);
    });
};

// הפונקציה הזו אף פעם לא מתבצעת
/*
CurveAnimator.prototype.stop = function () {
    clearInterval(this.animTimer);
};
*/

CurveAnimator.prototype.pointAt = function (percent) {
    return this.path.getPointAtLength(this.len * percent);
};

CurveAnimator.prototype.updatePath = function () {
    this.len = this.path.getTotalLength();
};
//////////////////////////////////////////////////////////// END CurveAnimator /////////////////////////////////////////////////////

document.addEventListener("DOMContentLoaded", function (event) {
    console.log("DOM fully loaded and parsed");
    let arr;

    // document.getElementById("btnCreateArray").addEventListener("click",function (e) {
    //     debugger;
    //     arr = makeArr();
    // });
    document.getElementById("btnCreateArray").onclick = function (e) {
        arr = makeArr();
    };


    // document.getElementById("btnSort").addEventListener("click",function (e) {
    // sort(arr);
    // });

    document.getElementById("btnSort").onclick = function (e) {
        sort(arr);
    };
});