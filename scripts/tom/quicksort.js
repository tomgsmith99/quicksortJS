
function quickSort(A, left, right) {

    qsCount = qsCount + 1;
    
    if (qsCount > 100) { throw new Error("too many qs loops"); }
    console.log("----------Quicksort Begin----------");
    console.log("Starting the quicksort function.");
    console.log("The array currently looks like this: " + A);
    console.log("Instance number: " + qsCount);
    console.log("The left index is: " + left);
    console.log("The right index is: " + right);
    console.log("Checking to see if left index < right index...");

    if (left < right) {
        console.log("left < right.");
        console.log("starting the partition function.");
        var pivot = partition(A, left, right);
        console.log("partition function complete.");
        console.log("pivot index is: " + pivot);
        console.log("the array currently looks like this: " + A);
        
        quickSort (A, left, (pivot-1));
        quickSort (A, (pivot+1), right);
    }
    else if (left === right) { // Note: this clause is not needed for qs!
        console.log("Nope. This partition is a singleton: " + A[left]);
    }
    else {  // also unnecessary
        console.log("right > left, so we are done with this instance of the qs function.");
    }
}

function partition(A, left, right){
    var pivotVal = A[left];
    var pivptr = left;

    console.log("--------Partition Begin------------");
    console.log("This is the partition we are going to work on:");

    printSubArray(A, left, right);

    for (var j = (left + 1); j <= right; j++){
        console.log("state of partition at top of loop iteration:");
        printSubArray(A, left, right);

        console.log("The index of j is: " + j);
        console.log("The index of the pivot pointer is: " + pivptr);
        console.log("Comparing A[" + j + "] (" + A[j] + ") to the pivot value: " + pivotVal);

        if (A[j] <= pivotVal) {
            pivptr = pivptr + 1;

            console.log("A[j] is less than or equal to the pivot, so we are going to swap A[j] " + A[j] + " with A[pivptr]: " + A[pivptr]);

            var temp = A[j];
            A[j] = A[pivptr];
            A[pivptr] = temp;

            console.log("state of partition at the bottom of the loop iteration:");
            printSubArray(A, left, right);
        }
        else { 
            console.log("A[j] is greater than the pivot value, so no values were swapped.");
            console.log("A[j] is: " + A[j] + " and the pivot is: " + pivotVal);
        }

        console.log("pivptr is now: " + pivptr);
        console.log("-----------------");
    }

    console.log("For loop complete. Swapping the A[pivptr] value " + A[pivptr] + " with the pivot " + A[left]);

    temp = A[pivptr];
    A[pivptr] = A[left];
    A[left] = temp;

    console.log("This partition is now:");

    printSubArray(A, left, right);

    return pivptr;
}

function printSubArray(A, l, r) { console.log(A.slice(l, r+1)); }