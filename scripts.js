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


//https://developer.mozilla.org/en-US/docs/Web/Events/DOMContentLoaded
// <script src="https://gist.githubusercontent.com/KenCorbettJr/4691882/raw/979cc6d3dd86c7c68802d35bec67c2ef7f135563/Javascript%2520Quicksort"></script>
//https://github.com/jo/JSColor - color polyfill
//http://phrogz.net/SVG/animation_on_a_curve.html
///////////////////////// יצירת מערך /////////////////////////
/*
ניתן להגדיר צבעים, כמות תאים וכן לקבוע ערכים באופן ידני או רנדומלי
לאחר לחיצה על כפתור "צור מערך" האפשרויות הללו נחסמות
ונפתחות אפשרות בחירת סוג המיון ומהירות הצגתו
input המערך עשוי מתאי
*/

//let arr;

function Debugger(toDebug) {
    if (toDebug) {
        debugger;
    }
}

function disableElem(elemId, disabled) {
    document.getElementById(elemId).disabled = disabled;
}

function make_arr() {
    // חסימת הגדרות מאפייני מערך ופתיחת הגדרות מאפייני מיון
    disableElem("fieldset1", true);
    disableElem("fieldset2", false);

    document.getElementById("btn_createArray").className = "button";
    document.getElementById("btn_sort").className = "button aqua";

    let arr = [];
    let arrSize = Number(document.getElementById("inputs_num").value);
    let arrElem = document.getElementById("arr"); // <div id="arr">
    let color = document.getElementById("inputs_color2").value; // צבע הגופן
    let backgroundColor = document.getElementById("inputs_color1").value;

//	let place = 0;
	
    for (let i = 0, pos = 0; i < arrSize; i++) {
        let input = document.createElement("input"); // input כל תא מוגדר בשדה טקסט מסוג 
        input.className = "cell";
        input.style.color = color; // צבע גופן
        input.style.backgroundColor = backgroundColor; // צבע רקע
        input.type = "number"; // הקלט מסוג מספר
        
        //pos += Number(input.style.width.replace("px", ""));
        //let width = Number(input.style.width.replace("px", ""));
        //input.style.left = pos + width + "px"; // הזזת תא ימינה בהתאם למיקומו

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
    let myArr = [4000, 5, 2, 1, 3, 9, 5, 4, 700, 6];
    for (let i = 0; i < arr.length; i++) {
        arr[i].value = myArr[i];
		arr[i].style.width = ((arr[i].value.length + 3) * 8) + "px"; // רוחב כל תא בהתאם לתכנו
    }
    //End: Added by Ohad

    return arr;
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
	
	
	// בפונקציה הנ"ל יש באג, שהמיקום החדש לא מדויק, לא הבנתי מה ההבדל בין כל הסוגים הבאים
	// getBoundingClientRect().left
	// arr[i].offsetLeft
	// arr[i].style.left
	
	// relative אחד שמוגדר כ div וכולם מוגדרים בתוך absolute מוגדר כ input כדי שהאנימציה תוכל לפעול, כל
	// גורם לתאים לאבד את מיקומם. מטרת הלולאה להתגבר על באג זה absolute קיים באג שבהגדרת
	// הבעיה היא שהצורה הזו גורמת לכך שכשתא אחד מתעדכן בערך רחב יותר שאר התאים לא זזים
	for (let i = 0; i < arr.length; i++) {
		let left = arr[i].offsetLeft;
		//console.log("left = " + left);
		arr[i].style.position = 'absolute';
		arr[i].style.left = left + "px";
		//console.log("left = " + left);
		//alert("left = " + left);	
    }

    let e = document.getElementById("select_sort").value;
	//TODO: Change the ifs to switch-case
    //let arr = make_arr();
    if (e === "bubble") {
        bubbleSort(arr);
	}

    if (e === "selection")
        selectionSort(arr);

    if (e === "insertion")
        insertionSort(arr);

    if (e === "quick")
        quickSort(arr);

    if (e === "merge")
        mergeSort(arr);

    if (e === "all") {
		let arr_bubble = copyInputs(arr, "arr_bubble");
		let arr_selection = copyInputs(arr, "arr_selection");
        bubbleSort(arr_bubble, "comp_bubble", "swap_bubble");
		selectionSort(arr_selection, "comp_selection", "swap_selection");
	}
}

// הסבר של כל מיון
function sortExplanation() {
    //TODO: Take out the explanations out to the HTML and show/hide using CSS
    let e = document.getElementById("select_sort").value;

    if (e === "bubble")
        document.getElementById("explanation").innerHTML =
            `
<ul>
	<li>משווים כל איבר עם האיבר הבא אחריו. אם מוצאים איבר שגדול מהבא אחריו מחליפים ביניהם</li>
	<li>כל איטרציה דוחפת קדימה למקומו את האיבר הכי גדול ויוצרת מיון מהסוף</li>
	<li>לכן בכל איטרציה נתחיל מהאיבר הראשון עד האיבר במקום האחד לפני המקום שסיימנו לבדוק בפעם הקודמת</li>
	<li>חוזרים על התהליך עד שבאיטרציה שלמה לא נמצאים שני איברים שאחד מהם גדול מהבא אחריו</li>
</ul>
`;

    if (e === "selection")
        document.getElementById("explanation").innerHTML =
            `
<ul>
	<li>מחפשים מהאיבר הראשון עד האחרון את האיבר הקטן ביותר ומחליפים אותו עם האיבר הראשון</li>
	<li>מחפשים מהאיבר השני עד האחרון את האיבר הקטן ביותר ומחליפים אותו עם האיבר השני</li>
	<li>ממשיכים באותה השיטה עד סוף המערך</li>
	<li>כל איטרציה דוחפת אחורה למקומו את האיבר הכי קטן ויוצרת מיון מההתחלה</li>
	<li>לכן בכל איטרציה נתחיל מהאיבר במקום האחד אחרי המקום שממנו התחלנו לבדוק בפעם הקודמת</li>
</ul>
`;

    if (e === "insertion")
        document.getElementById("explanation").innerHTML =
            `
<ul>
	<li>לוקחים את האיבר השני, סורקים אחורה עד שנתקלים באיבר קטן או שווה לו, דוחפים מקום אחד קדימה את כל האיברים שנסרקו ומכניסים אותו לפניהם</li>
	<li>לוקחים את האיבר השלישי, סורקים אחורה עד שנתקלים באיבר קטן או שווה לו, דוחפים מקום אחד קדימה את כל האיברים שנסרקו ומכניסים אותו לפניהם</li>
	<li>ממשיכים באותה השיטה עד סוף המערך</li>
	<li>כל איטרציה דוחפת אחורה למקומו את האיבר שנלקח ויוצרת מיון מההתחלה</li>
	<li>לכן בכל איטרציה נקח את האיבר במקום האחד אחרי המקום שממנו לקחנו בפעם הקודמת ולכן סורקים אחורה רק עד שנתקלים באיבר קטן או שווה</li>
	<li>(אם האיבר שלקחנו קטן מכל אלה שלפניו, הסריקה תגיע עד תחילת המערך, כולם יודחפו והוא יוכנס לפניהם)</li>
	<li>ניתן לשפר את הסריקה ולבצעה בעזרת חיפוש בינארי, אך בגלל הדחיפות סיבוכיות המיון תשאר כפי שהיא</li>
</ul>
`;

    if (e === "quick")
        document.getElementById("explanation").innerHTML =
            `
<ul>
	<li>בוחרים איבר אקראי (מכונה "pivot" ובעברית "ציר")</li>
	<li>מעבירים את כל האיברים הקטנים ממנו לפניו והגדולים ממנו לאחריו (מבלי למיין ביניהם)</li>
	<li>חוזרים על הפעולה הנ"ל באופן רקורסיבי על תת המערך הכולל רק את האיברים שהעברנו כעת לפניו וכן באופן רקורסיבי על תת המערך הכולל רק את האיברים שהעברנו כעת לאחריו</li>
	<li>תנאי עצירה הוא כשלא ניתן לחלק תת מערך כי הוא מכיל רק איבר אחד (איבר אחד הוא ממוין). המיון יסתיים כשלא ניתן לחלק עוד אף מערך</li>
	<li>בניגוד למיונים הלא רקורסיביים, בהם דאגנו להכניס כל איבר למקומו מבלי להתחשב בהזזות מיותרות של איברים אחרים, במיון זה אנו מנסים להתחשב בכל הזזה של כל איבר, לקרב אותו כמה שיותר למקומו ובכך לחסוך הזזות והשוואות מיותרות</li>
</ul>
`;

    if (e === "merge")
        document.getElementById("explanation").innerHTML =
            `
<ul>
	<li>ניתן למזג שני מערכים שכל אחד מהם ממויין, למערך אחד ממויין באופן הבא: כל עוד יש שני מערכים, נשווה בין שני האיברים הראשונים שלהם, נסיר את הקטן מביניהם ונוסיפו למערך הממוזג. אם הרשימות לא היו באותו האורך ונשארה רק רשימה אחת, נוסיף את כולה למערך המוזג</li>
<br />
	<li>מחלקים כל מערך בחצי (במקרה שכמות התאים אי זוגית צד אחד יכלול תא אחד יותר)</li>
	<li>חוזרים על התהליך ברקורסיה. תנאי עצירה הוא כשלא ניתן לחלק תת מערך כי הוא מכיל רק איבר אחד (איבר אחד הוא ממוין)</li>
	<li>בנסיגה לאחור של הרקורסיות, ממזגים כל שני חצאים שחילקנו</li>
	<li>בניגוד למיונים הלא רקורסיביים, בהם דאגנו להכניס כל איבר למקומו מבלי להתחשב בהזזות מיותרות של איברים אחרים, במיון זה אנו מנסים להתחשב בכל הזזה של כל איבר, לקרב אותו כמה שיותר למקומו ובכך לחסוך הזזות והשוואות מיותרות</li>
</ul>
`;
}

/*
yield delay
// http://jsfiddle.net/Noseratio/r56Vb/5
*/

function swapAnimation2(){
	
}

// מיון בועות
function bubbleSort(arrI, comp_id = "comp", swap_id = "swap") {

	let steps = 0;
/*
	setTimeout(function() {swapAnimation(arrI[2], arrI[3]);}, (steps++) * speed * 1.05);
	setTimeout(function() {swapAnimation(arrI[3], arrI[4]);}, (steps++) * speed * 1.05);
	setTimeout(function() {swapAnimation(arrI[5], arrI[6]);}, (steps++) * speed * 1.05);
	setTimeout(function() {swapAnimation(arrI[6], arrI[7]);}, (steps++) * speed * 1.05);
	setTimeout(function() {swapAnimation(arrI[8], arrI[9]);}, (steps++) * speed * 1.05);
	setTimeout(function() {swapAnimation(arrI[0], arrI[1]);}, (steps++) * speed * 1.05);
	setTimeout(function() {swapAnimation(arrI[1], arrI[2]);}, (steps++) * speed * 1.05);
	setTimeout(function() {swapAnimation(arrI[2], arrI[3]);}, (steps++) * speed * 1.05);
	setTimeout(function() {swapAnimation(arrI[5], arrI[6]);}, (steps++) * speed * 1.05);
	setTimeout(function() {swapAnimation(arrI[7], arrI[8]);}, (steps++) * speed * 1.05);
	setTimeout(function() {swapAnimation(arrI[0], arrI[1]);}, (steps++) * speed * 1.05);
	setTimeout(function() {swapAnimation(arrI[4], arrI[5]);}, (steps++) * speed * 1.05);
*/

	let arr = [];
	for(let i = 0; i < arrI.length; i++){
		arr[i] = Number(arrI[i].value);
	}

	

    let sorted = false;
    for (let i = 0; i < arr.length - 1; i++) {
		sorted = true;
        for (let j = 0; j < arr.length - 1 - i; j++) {
            
				document.getElementById(comp_id).textContent = Number(document.getElementById(comp_id).textContent) + 1; // הגדלת מונה ההשוואות
                
				
					// הפעלת אנימציה של השוואה
					setTimeout(
					function() {
						compareAnimation(arrI[j] , arrI[j + 1]);
					}, (steps++) * speed * 1.05);
					
					if (arr[j] > arr[j + 1]) {
                    sorted = false;
					document.getElementById(swap_id).textContent = Number(document.getElementById(swap_id).textContent) + 1; // הגדלת מונה החלפת הערכים
				
					// הפעלת אנימציה של החלפה
					setTimeout(
						function() {
						swapAnimation(arrI[j], arrI[j + 1]);
						
						// צריך להכנס לתוך האנימציה inputs החלפת המערך של ה
						let tmp1 = arrI[j];
						arrI[j] = arrI[j + 1];
						arrI[j + 1] = tmp1;
					
						
					//	console.log(j + " " + (j + 1));
					}, (steps++) * speed * 1.05);
				
					
				//	swap(arr,j, j + 1);
					let tmp = arr[j];
					arr[j] = arr[j + 1];
					arr[j + 1] = tmp;
					}
        }
		if (sorted) break;
    }
	
	console.log(arr);
}

function bubbleSortOLD(arr, comp_id = "comp", swap_id = "swap") {
    let steps = 0;
    let sorted = false,
        finish;
    for (let i = 0; i < arr.length - 1; i++) {
        for (let j = 0; j < arr.length - 1 - i; j++) {
            setTimeout(function (j, end) {
                if (finish) return;
                if (j == 0) sorted = true;
				document.getElementById(comp_id).textContent = Number(document.getElementById(comp_id).textContent) + 1; // הגדלת מונה ההשוואות
                if (compareAnimation(arr[j], arr[j + 1]) == 1) {
                    sorted = false;
					document.getElementById(swap_id).textContent = Number(document.getElementById(swap_id).textContent) + 1; // הגדלת מונה החלפת הערכים
                    swapAnimation(arr[j], arr[j + 1]);
                }
                if (sorted && j === end) finish = true;
            }, (steps++) * speed * 1.05, j, arr.length - 2 - i);
        }
    }
}

// מיון בחירה
function selectionSort(arr, comp_id = "comp", swap_id = "swap") {
    let steps = 0;

    for (let i = 0, min = 0; i < arr.length - 1; i++) {
        for (let j = i + 1; j < arr.length; j++) {
            setTimeout(function (i, j) {
                if (j == i + 1) min = i;
				document.getElementById(comp_id).textContent = Number(document.getElementById(comp_id).textContent) + 1; // הגדלת מונה ההשוואות
                if (compareAnimation(arr[min], arr[j]) == 1)
                    min = j;

                if (j == arr.length - 1 && i != min) {
					document.getElementById(swap_id).textContent = Number(document.getElementById(swap_id).textContent) + 1; // הגדלת מונה החלפת הערכים
                    swapAnimation(arr[i], arr[min]);
				}

            }, (steps++) * speed * 1.05, i, j);
        }
    }
}

// מיון הכנסה
/*function insertionSort() {
	let steps = 0;
	for (let i = 1; i < arr.length; i++) {
		for (let j = i - 1; j >= 0; j--)
			setTimeout (function (j) {
				if (compareAnimation (arr[j], arr[j+1]) == 1)
					swap(arr[j], arr[j+1]);
				else {
					// לא פועל
					// המספר במקומו, אפשר להפסיק את הלולאה הפנימית
					// j=-1;
					// break;
				}	
			}, (steps++) * speed*1.05, j);
	}
}*/
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

// מיון מהיר
function quickSort(arrI) {
	
	let arr = [];
	for(let i = 0; i < arrI.length; i++){
		arr[i] = Number(arrI[i].value);
	}
	
	console.log(arr);
	
    Quicksort.sort(arr, arrI ,0,arr.length - 1);
	
	console.log(arr);
}

/**
 * An implementation for Quicksort. Doesn't
 * perform as well as the native Array.sort
 * and also runs the risk of a stack overflow
 *
 * Tests with:
 *
 * let array = [];
 * for(let i = 0; i < 20; i++) {
 *   array.push(Math.round(Math.random() * 100));
 * }
 *
 * Quicksort.sort(array);
 *
 * @author Itshak Shclissel
 */
let Quicksort = (function () {
	
			

	let steps = 0;
	
	/**
     * Partitions the (sub)array into values less than and greater
     * than the pivot value
     *
     * @param {Array} array The target array
     * @param {int} left The index of the leftmost element
     * @param {int} right The index of the rightmost element
     */
    function partition (arr, arrI, left, right)
	{
		let i = left - 1, j = right + 1;
		while (true)
		{
			do {
				i++;
				setTimeout( function(left, i) {
					compareAnimation(arrI[left] , arrI[i]);
				}, (steps++) * speed * 1.05, left, i); // הפעלת אנימציה של השוואה			
			} while (arr[left] > arr[i]) // pivot = arr[left]
			
			do {
				j--;
				setTimeout( function(j, left) {
					compareAnimation(arrI[j] , arrI[left]);
				}, (steps++) * speed * 1.05, j, left); // הפעלת אנימציה של השוואה
			} while (arr[j] > arr[left]);
			if (i >= j) return j;
			
			
			console.log ("real: " + i + " " + j);
			setTimeout( function(i, j) {
				console.log ("swap: " + i + " " + j);
				swapAnimation(arrI[i], arrI[j]); // הפעלת אנימציה של החלפה		 			
				// צריך להכנס לתוך האנימציה inputs החלפת המערך של ה
				let tmp1 = arrI[i];
				arrI[i] = arrI[j];
				arrI[j] = tmp1;
			}, (steps++) * speed * 1.05, i, j);
			
			// החלפה בפועל
			
			let tmp2 = arr[i];
			arr[i] = arr[j];
			arr[j] = tmp2;
			
		}
	}
	

    /**
     * Sorts the (sub-)array
     *
     * @param {Array} array The target array
     * @param {int} left The index of the leftmost element, defaults 0
     * @param {int} right The index of the rightmost element, defaults array.length-1
     */
	function quickSort(arr, arrI, left, right)
	{	
		if (left < right)
		{
			let pivot = partition (arr, arrI, left, right);
			quickSort (arr, arrI, left, pivot);
			quickSort (arr, arrI, pivot + 1, right);
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
        arr[i].style.borderColor = document.getElementById("inputs_color4").value;
    }
    setTimeout(function () {
        for (let i = start; i <= end; i++) {
            arr[i].style.borderColor = "DarkGray";
        }
    }, time);
}

function copyInputs(arr, id) {
	// let color = document.getElementById("inputs_color2").value;
    // let backgroundColor = document.getElementById("inputs_color1").value;
    // for (let i = 0; i < arr.length; i++) {
    // 	let input = document.createElement("input");
    // 	input.className = "cell";
    // 	input.style.color = color;
    //     input.style.backgroundColor = backgroundColor;
    //     input.type = "number";
    // 	input.value = arr[i].value;
    // 	input.style.width = ((input.value.toString().length + 3) * 8).toString() + "px";
    // 	input.onchange = input.onkeyup = function () { this.style.width = ((this.value.length + 3) * 8) + 'px' };
    // 	document.getElementById("arr_selection").appendChild(input);
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

function compareAnimation(value1, value2){
	// אנימציה
    value1.style.borderColor = value2.style.borderColor = document.getElementById("inputs_color3").value;

    // הגדלת מונה ההשוואות
//  document.getElementById('comp').textContent = Number(document.getElementById('comp').textContent) + 1;

    // החזרת המראה הגרפי לפני האנימציה
    setTimeout(function () {
        value1.style.borderColor = value2.style.borderColor = "DarkGray";
    }, speed);
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
function swap(arr, i, j){
	let tmp = arr[i];
	arr[i] = arr[j];
	arr[j] = tmp;
	//b = [a, a = b][0];
}
	 
	 
function swapAnimation(elem1, elem2) {//value1 == inputElement
    
    //TODO: Move the actual cells without making a copy
	let old = false;
    if (old) {
		
		let copy;
        // יצירת העתק של תא שמאל
        copy = document.createElement("input");
        copy.style.cssText = elem1.style.cssText;
        copy.style.position = 'absolute';
        copy.type = elem1.type;
        copy.value = elem1.value;
        document.getElementById("arr").appendChild(copy);     
		
		// הסתרת התאים המקוריים
		elem1.style.visibility = elem2.style.visibility = "hidden";
		
		// קביעת האורכים רק לאחר החלפת הערכים, למקרה שהתאים המוחלפים באורכים שונים
		o1.style.left = elem1.getBoundingClientRect().left + "px";
		o2.style.left = elem2.getBoundingClientRect().left + "px";
    }
   

	
    // החלפת הערכים
    
 //   elem1.style.width = o2.style.width;
 //   elem2.style.width = o1.style.width;

//	o1 = elem1;
 //   o2 = elem2;
	

    // הגדלת מונה החלפת הערכים
//  document.getElementById('swap').textContent = Number(document.getElementById('swap').textContent) + 1;
let curve1;
let curve2;
    // הגדרות האנימציה של העתק התא השמאלי

//	else{
	let x1_div1 = elem1.offsetLeft; // מוצא בפיקסלים משמאל
    let y1_div1 = elem1.offsetTop; // מוצא/יעד בפיקסלים מלמעלה
    let y2_div1 = y1_div1;
    let x2_div1 = elem2.offsetLeft; // יעד בפיקסלים משמאל
    let height1 = 25; // גובה הקשת
    curve1 = new CurveAnimator([x1_div1, y1_div1], [x2_div1, y2_div1], [x1_div1 + 10, y1_div1 - height1], [x2_div1 - 10, y2_div1 - height1]);

    // הגדרות האנימציה של העתק התא הימני
    let x1_div2 = elem2.offsetLeft; // מוצא בפיקסלים משמאל
    let y1_div2 = elem2.offsetTop; // מוצא/יעד בפיקסלים מלמעלה
    let y2_div2 = y1_div2;
    let x2_div2 = elem1.offsetLeft; // יעד בפיקסלים משמאל
    const height2 = -25; // גובה הקשת
    curve2 = new CurveAnimator([x1_div2, y1_div2], [x2_div2, y2_div2], [x1_div2 - 10, y1_div2 - height2], [x2_div2 + 10, y2_div2 - height2]);
//	}
    curve1.animate(2, function (point, angle) {
	//	if(old){
     //   o1.style.left = point.x + "px";
      //  o1.style.top = point.y + "px";
	//	}else{
			elem1.style.left = point.x + "px";
        elem1.style.top = point.y + "px";
	//	}
        // o1.style.transform =
        //     o1.style.webkitTransform =
        //     o1.style.MozTransform =
        //     "rotate(" + angle + "deg)";
        // console.log("o1.style.left = " + point.x + "px");
        // console.log("o1.style.top = " + point.y + "px");
        // מחיקת ההעתקים והצגת התאים המקוריים לאחר סיום האנימציה
        if (old) {
            if (o1.getBoundingClientRect().left == x2_div1) {
                //	if (o2.getBoundingClientRect().left == x2_div2) // curve2.animate שני ההעתקים מגיעים ליעדם באותו הזמן, לכן ניתן גם לכתוב כך וכן ניתן לשים פונקציה זו ב

                // החזרת התאים המקוריים
                elem1.style.visibility =
				//elem2.style.visibility =
				"visible";

                // הסרת העתקיי התאים
                o1.parentNode.removeChild(o1);
               // o2.parentNode.removeChild(o2);
            }
        }
    });

    curve2.animate(2, function (point, angle) {
        elem2.style.left = point.x + "px";
        elem2.style.top = point.y + "px";
		if(old){
			if (elem2.getBoundingClientRect().left == x2_div2){
				
				// החזרת התאים המקוריים
                 elem2.style.visibility = "visible";

                // הסרת העתקיי התאים
                elem2.parentNode.removeChild(elem2);
			}
		}
        // console.log("o2.style.left = " + point.x + "px");
        // console.log("o2.style.top = " + point.y + "px");
        // o2.style.transform =
        //     o2.style.webkitTransform =
        //     o2.style.MozTransform =
        //     "rotate(" + angle + "deg)";
        // console.log("rotate(" + angle + "deg)");
    });
}

//////////////////////////////////////////////////////////// BEGIN CurveAnimator /////////////////////////////////////////////////////
function CurveAnimator(from, to, c1, c2) {
    this.path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
	//if (!c1) c1 = from;
	//if (!c2) c2 = to;
    this.path.setAttribute('d', 'M' + from.join(',') + 'C' + c1.join(',') + ' ' + c2.join(',') + ' ' + to.join(','));
    this.updatePath();
	//CurveAnimator.lastCreated = this;
}

CurveAnimator.prototype.animate = function (duration, callback, delay) {
    let curveAnim = this;
	// TODO: Use requestAnimationFrame if a delay isn't passed
	//if (!delay) delay = 1/40;
	clearInterval(curveAnim.animTimer);
    let startTime = new Date;
    //let startTime = Date.now();
    curveAnim.animTimer = setInterval(function () {
        let now = new Date;
        //let now = Date.now();
        let elapsed = (now - startTime) / (speed / 4);
//        let elapsed = (now - startTime) / 1000;
        let percent = elapsed / duration;
			if (percent>=1){
				percent = 1;
				clearInterval(curveAnim.animTimer);
			}
			//var p1 = curveAnim.pointAt(percent-0.01),
			//    p2 = curveAnim.pointAt(percent+0.01);
			let rotateDegree = 0; // Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI
        callback(curveAnim.pointAt(percent), rotateDegree);
    } );//,delay * (speed / 4)
};

CurveAnimator.prototype.stop = function(){
		clearInterval(this.animTimer);
	};

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

    // document.getElementById("btn_createArray").addEventListener("click",function (e) {
    //     debugger;
    //     arr = make_arr();
    // });
    document.getElementById("btn_createArray").onclick = function (e) {
        arr = make_arr();
    };


    // document.getElementById("btn_sort").addEventListener("click",function (e) {
    // sort(arr);
    // });

    document.getElementById("btn_sort").onclick = function (e) {
        sort(arr);
    };
});