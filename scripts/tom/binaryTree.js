var BinaryTree = function(inputArray) {
    this.inputArray = inputArray;
    this.sortedInts = Object.create(inputArray); // array of ints, the result of the quicksort
    this.qsCount = 0; // a counter to stop runaway while looops
    this.leaves = []; // array of leaves, in the order in which they were created
    this.html = "";
};

BinaryTree.prototype.addLeaf = function(leaf) {
    this.total = this.leaves.push(leaf); // probably don't need .total anymore
    leaf.setIndex(this.total - 1); // need index to determine root
};

BinaryTree.prototype.associate = function(parent, child) {
    child.setParent(parent);
    parent.setChild(child);

    console.log(child.preArray.data + " is a member of " + parent.preArray.data);
    console.log("---------------");
};

BinaryTree.prototype.build = function() {
    this.connectLeaves(); // associates parents with children
    this.calculateLeafDepths();
    this.flatten(); // calculates horizontal positions of leaves
    this.showProperties(); // displays all btree/leaf properties in the console
};

BinaryTree.prototype.calculateLeafDepths = function() {
    this.depth = 0; // Total depth of tree
    console.log("------STARTING THE calculateLeafDepths() function ------");

    this.leaves.forEach(function(leaf) {
        console.log("my index is: " + leaf.index);
        console.log("my binPos is: " + leaf.binPos);
        
        if (leaf.index === 0) { leaf.depth = 0; }
        else {
            leaf.depth = leaf.parent.depth + 1;
            if (leaf.depth > this.depth) {
                this.depth = leaf.depth;
            }
        }
        
        console.log("Leaf is: " + leaf.preArray.data + " Depth is: " + leaf.depth);
        console.log("------------");
    }, this);
    
    // this.leaves.forEach(function(leaf) { leaf.setAncestors(); });
};


BinaryTree.prototype.connectLeaves = function() {
/* this might be better achieved by tracking parent/child relationhsips in 
 * the partition and quicksort functions.
 */
    var i, j, z;
    var leaf, pleaf;
    
    // find each leaf's parent and children
    console.log("-----STARTING THE buildTree() function------");

    // I'm going backward through the list; otherwise I would use forEach
    for (i = this.leaves.length - 1; i > 0; i--) {

        j = i - 1;

        leaf = this.leaves[i];

        console.log("the child value is: " + leaf.preArray.data);

        while (leaf.hasParent() === false) {
            // if (z++ > 10000) { throw new Error("too many loops in connectLeaves"); }
            var child = leaf.postArray.data;
            pleaf = this.leaves[j];
            var potParent = pleaf.postArray.data;

            if (Array.isArray(potParent)) {
                console.log("looking for " + child + " in " + potParent);
                var item;
                if (child.every(item => potParent.indexOf(item) !== -1)) {
                    this.associate(pleaf, leaf);
                    break;
                }
                else { j = j - 1; }
            }
            else { j = j - 1; }
        }
    }
};

BinaryTree.prototype.drawLines = function(divID) {
    /* global jsPlumb */
    var i = 0;
    var leaves = this.leaves; // not 100% sure why I have to do this.
                              // but foreach loop won't work otherwise.

    jsPlumb.ready(function() {

        jsPlumb.setContainer(divID);

        jsPlumb.importDefaults({
            Anchors: ["Bottom", "Top"],
            Connector : "Straight",
            PaintStyle:{ strokeStyle:"black", lineWidth:1 },
            EndpointStyle:{ radius: 1 },
            Overlays:[ 
                ["Arrow", { location: 1, width: 5, length: 5 }]
            ]
        });

        leaves.forEach(function(leaf) {
            var target = "cell_final_" + i;
            i++;

            jsPlumb.connect({
                source:leaf.getPivotDivID(),
                target:target
            });
        });
    });
};

BinaryTree.prototype.flatten = function() {
    // There may be a better way to do this. But, the logic gets hairy
    // when there are equal values in the initial array.
    console.log("--------------STARTING THE flatten() function-------------");
    var i, j;
    var flatArray = this.leaves;
    var temp;

    // First, sort the leaves by pivot value
    for (i = 1; i < flatArray.length; i++ ) {
        j = i;
        while (j > 0 && (flatArray[j-1].pivotValue > flatArray[j].pivotValue)) {
            temp = flatArray[j];
            flatArray[j] = flatArray[j-1];
            flatArray[j-1] = temp;
            j = j - 1;
        }
    }

    console.log("After the first pass, the flat array is: ");

    flatArray.forEach(function(leaf){
        console.log("pivot value: " + leaf.pivotValue + " data: " + leaf.preArray.data);
    });

    // Second, make sure that for leaves whose pivots are equal, the
    // smaller leaf appears first
    for (i=0; i< flatArray.length; i++) {
        for (j = i; j<flatArray.length; j++) {
            if (flatArray[i].pivotValue === flatArray[j].pivotValue) {
                if (flatArray[i].length > flatArray[j].length) {
                    temp = flatArray[i];
                    flatArray[i] = flatArray[j];
                    flatArray[j] = temp;
                }
            }
            else { break; }
        }
    }

    console.log("After the second pass, the flat array is: ");

    flatArray.forEach(function(leaf){
        console.log("pivot value: " + leaf.pivotValue + " data: " + leaf.preArray.data);
    });
};

BinaryTree.prototype.partition = function (A, left, right){
    var pivot = A[left];
    var i = left;
    var j;
    var temp;

    // Store the subarray in the binary tree
    // this procedure is not necessary for quicksort
    var leaf = new Leaf();
    this.addLeaf(leaf);
    leaf.setArray("pre", A.slice(left, (right + 1)), left);
    console.log("SETTING UP A PRE-ARRAY WITH A LEFT VALUE OF: " + left);
    console.log("--------PBEGIN------------");
    console.log("This is the partition we are going to work on:");

    printSubArray(A, left, right);

    for (j = left; j <= right; j++){
        console.log("beginning state, at top of loop: ");
        printSubArray(A, left, right);

        console.log("The index of j is: " + j);
        console.log("The index of i is: " + i);
        console.log("Comparing A[" + j + "] (" + A[j] + ") to the pivot value: " + pivot);

        if (A[j] <= pivot) {
            console.log("A[j] is less than or equal to the pivot, so we are going to swap A[j] " + A[j] + " with A[i]: " + A[i]);

            temp = A[j];
            A[j] = A[i];
            A[i] = temp;

            console.log("end state, at bottom of loop:");
            printSubArray(A, left, right);

            i = i + 1;
        }
        else { 
            console.log("A[j] is greater than the pivot value, so no values were swapped.");
            console.log("A[j] is: " + A[j] + " and the pivot is: " + pivot);
            console.log("The type of A[j] is: " + typeof(A[j]) + " and the type of pivot is: " + typeof(pivot));
        }

        console.log("i is now: " + i);
        console.log("-----------------");
    }

    console.log("For loop complete. Swapping the A[i-1] value " + A[i-1] + " with the pivot " + A[left]);

    temp = A[i -1];
    A[i - 1] = A[left];
    A[left] = temp;

    console.log("This partition is now:");

    printSubArray(A, left, right);

    // Store the subarray in the binary tree
    // this procedure is not necessary for quicksort
    leaf.setArray("post", A.slice(left, (right + 1)));

    return i - 1;
};

BinaryTree.prototype.quickSort = function (A, left, right) {
    var pivot;

    // if (this.qsCount++ > 100) { throw new Error("too many qs loops"); }
    console.log("----------QSBEGIN----------");
    console.log("Starting a qs function.");
    console.log("Iteration number: " + this.qsCount);
    console.log("The left index is: " + left);
    console.log("The right index is: " + right);

    if (left < right) {
        console.log("left is < right.");
        console.log("starting the partition function.");
        pivot = this.partition(A, left, right);
        console.log("partition function complete.");
        console.log("result of partition function - pivot index is: " + pivot);
        this.quickSort (A, left, (pivot-1));
        this.quickSort (A, (pivot+1), right);
    }
    else if (left === right) {  // Not needed for the quicksort itself, but
                                // needed for the UI
        console.log("Nope. This partition is a singleton: " + A[left]);
        var leaf = new Leaf();
        leaf.setArray("pre", A.slice(left, left+1), left);
        leaf.setArray("post", A.slice(left, left+1));
        this.addLeaf(leaf);
    }
    else { console.log("right > left, so we are done!"); }
};

BinaryTree.prototype.render = function(divID, divIDjq) {
    console.log("-----------------------------------------------------");
    console.log("-----------STARTING THE RENDER FUNCTION--------------");

    var i = 0;

    this.leaves.forEach(function (leaf) {
        $(divIDjq).append(leaf.getHTML());
        if (qsDemo.cellWidth === null) {
            // establish the standard cell width for layout
            qsDemo.cellWidth = leaf.getPivotWidth();
        }
    });

    var leaf = new Leaf();
    leaf.setArray("pre", this.sortedInts, 0);
    leaf.depth = this.depth + 1;
    leaf.isFinal = true;
    leaf.preArray.cells.forEach(function(cell) {
        cell.divID = "cell_final_" + i;
        i++;
    });
    $(divIDjq).append(leaf.getHTML());
    this.drawLines(divID);
};

BinaryTree.prototype.runQuickSort = function() {
    this.quickSort(this.sortedInts, 0, (this.sortedInts.length - 1));
};

BinaryTree.prototype.showProperties = function() {
    console.log("-------------- STARTING THE show() function ---------------");
    this.leaves.forEach(function(leaf) { leaf.show(); });
};

BinaryTree.prototype.showValues = function() {
    console.log("The list of values is: ");
    this.leaves.forEach(function(leaf) { console.log(leaf.preArray.data); });
};

/*----------------------------------*/
/*--------- Leaf -------------------*/
/*----------------------------------*/

var Leaf = function () {
    this.isFinal = false;
    this.parent = null; // leaf object
    this.leftChild = null; // leaf object
    this.rightChild = null; // leaf object
    this.depth = null; // number >= 0
    this.binPos = null; // binary position relative to parent (left || right)
    this.index = null; // number = index in binaryTree.leaves[]
    this.hIndex = null; // horizontal position in the binary tree
    this.ancestors = []; // array of leaves; parents of parents
    this.length = null; // the number of integers in the data for this leaf
    this.preArray = null; // the subarray when it arrives at
                        // the partition function; pre "sort"
    this.postArray = null; // the subarray after it is partitioned around the
                         // pivot value
    this.xpos = 0; // for layout
    this.ypos = 0; // for layout
    this.divID = "";
};

Leaf.prototype.getAncestors = function() {
    var output = "";
    this.ancestors.forEach(function(leaf) {
        output += leaf.preArray.data.toString() + " | ";
    });
    return output;
};

Leaf.prototype.getLastCell = function() {
    return this.postArray.cells[this.length-1];
};

Leaf.prototype.getPivotDivID = function() {
    if (this.isSingleton()) { return this.preArray.getPivotDivID(); }
    else { return this.postArray.getPivotDivID(); }
};

Leaf.prototype.getPivotDivIDjq = function() {
    return ("#" + this.getPivotDivID());
};

Leaf.prototype.getPivotWidth = function() {
    var divIDjq = this.getPivotDivIDjq();
    var width = $(divIDjq).outerWidth();
    return Math.floor(width);
};

Leaf.prototype.getPivotXpos = function() {
    var divIDjq = this.getPivotDivIDjq();
    var coords = $(divIDjq).offset();
    return Math.floor(coords.left);
};

Leaf.prototype.getXpos = function() {
    /* global qsDemo */
    // return (qsDemo.canvasX + (qsDemo.cellWidth * this.origLeft));
    
    return (qsDemo.cellWidth * this.origLeft);

};

Leaf.prototype.setDivIDs = function() {
    this.preArray.divID = this.divID + "_pre";
    this.preArray.setDivIDs();
    if (this.postArray) {
        this.postArray.divID = this.divID + "_post";
        this.postArray.setDivIDs();
    }

};

Leaf.prototype.hasChildren = function() {
    return (this.hasLeftChild() || this.hasRightChild());
};

Leaf.prototype.hasLeftChild = function() {
    return (this.leftChild !== null);
};
Leaf.prototype.hasRightChild = function() {
    return (this.rightChild !== null);
};

Leaf.prototype.hasParent = function() { return (this.parent !== null); };

Leaf.prototype.isSingleton = function() { return (this.length === 1); };

Leaf.prototype.isLeftChild = function() { return (this.binPos === "left"); };

Leaf.prototype.isRightChild = function() { return (this.binPos === "right"); };

Leaf.prototype.isRoot = function() { return (this.index === 0); };

Leaf.prototype.setAncestors = function() {
    var i;
    if (this.parent) {
        var thisLeaf = this;
        for (i = this.depth; i > 0; i--) {
            thisLeaf = thisLeaf.parent;
            this.ancestors.push(thisLeaf);
        }
    }
};

Leaf.prototype.setArray = function(type, array, left) {
    if (type === "pre") {
        this.preArray = new Subarray("pre", array);
        this.preArray.setPivotPos();
        this.pivotValue = this.preArray.pivotValue;
        this.origLeft = left;
    }
    else {
        this.postArray = new Subarray("post", array);
        this.postArray.setPivotPos(this.pivotValue);
    }
    this.length = array.length;
};

Leaf.prototype.setChild = function (child) {
    if (child.pivotValue > this.pivotValue) {
        this.rightChild = child;
        child.binPos = "right";
    }
    else if (child.pivotValue < this.pivotValue) {
        this.leftChild = child;
        child.binPos = "left";
    }
    else if (child.pivotValue === this.pivotValue) {
        if (this.hasLeftChild()) {
            this.rightChild = child;
            child.binPos = "right";
        }
        else {
            this.leftChild = child;
            child.binPos = "left";
        }
    }
};

Leaf.prototype.getHTML = function() {
    var divClass;
    var html = "";
    console.log("my divID is: " + this.divID);

    if (this.isFinal === false) { // a bit of a hack
        this.setDivIDs(); // sets div IDs for all child elements
    }

    if (this.isFinal) { divClass = "leaf_final"; }
    else { divClass = "leaf"; }
    
    html =  "<div class='" + divClass + "'";
    html += " id = '" + this.divID + "'";

    html += " style = '" + this.getStyle() + "'";
    html += ">";

    html += this.preArray.getHTML();

    if (this.isSingleton() === false && this.isFinal === false) {
        html += this.postArray.getHTML();
    }

    html += "</div>";
    
    console.log("my HTML is: " + html);
    return html;
};

Leaf.prototype.getStyle = function() {
    var style;
    var marginTop;

    // Set top value
//    if (this.depth === 0) { top = qsDemo.canvasY; }
//    else { top = qsDemo.canvasY + (this.depth * qsDemo.rowSpace); }
//    style = "top:" + top + "px;";
    
//    if (this.depth === 0) { marginTop = qsDemo.canvasY; }
//    else { marginTop = qsDemo.canvasY + (this.depth * qsDemo.rowSpace); }
//    style = "margin-top:" + marginTop + "px;";

    if (this.depth === 0) { marginTop = 0; }
    else { marginTop = (this.depth * 80); }
    style = "margin-top:" + marginTop + "px;";


    // Set left value
    style += "margin-left:" + this.getXpos() + "px;";
    return style;
};

Leaf.prototype.setIndex = function(index) {
    this.index = index;
    this.divID = "leaf_" + this.index;
};

Leaf.prototype.setParent = function(parent) { this.parent = parent; };

Leaf.prototype.show = function() {
    console.log("my index is: " + this.index);
    console.log("my preArray is: " + this.preArray.data);
    console.log("my postArray is: " + this.postArray.data);
    console.log("my length is: " + this.length);
    console.log("my pivot value is: " + this.pivotValue);
    console.log("my original left value is: " + this.origLeft);


    if (this.parent !== null) {
        console.log("my parent's preArray is: " + this.parent.preArray.data);
        console.log("my parent's postArray is: " + this.parent.postArray.data);

        console.log("my parent index is: " + this.parent.index);
        console.log("my position relative to my parent is: " + this.binPos);
        console.log("my depth is: " + this.depth);
        console.log("my horizontal position is: " + this.hIndex);
        console.log("my ancestors are: " + this.getAncestors());
    }
    if (this.hasChildren()) {
        if (this.hasLeftChild()) {
            console.log("my left child is: " + this.leftChild.preArray.data);
        }
        if (this.hasRightChild()) {
            console.log("my right child is: " + this.rightChild.preArray.data);
        }
    }
    else { console.log("I have no children."); }
    console.log("-----------------------");
};

/*----------------------------------*/
/*------ Cell ----------------------*/
/*----------------------------------*/

var Cell = function (value) {
    this.divID = "";
    this.value = value;
    this.isPivot = false;
};

Cell.prototype.getHTML = function(isSingleton, partitionType) {
    var cssClass = "cell";
    var html = "";

    if (isSingleton) { cssClass = "singleton"; }
    else if (this.isPivot) {
        if (partitionType === "pre") { cssClass = "pivotPre"; }
        else { cssClass = "pivotPost"; }
    }
    html = "<div class='" + cssClass + "' id='" + this.divID + "'>";
    html += this.value + "</div>";
    
    return html;
};

/*----------------------------------*/
/*-----------Subarray --------------*/
/*----------------------------------*/

var Subarray = function(arrayType, data) {
    this.type = arrayType; // "pre" || "post"
    this.data = data;
    this.cells = [];
    this.divID = "";
    
    this.data.forEach(function (value) {
        this.cells.push(new Cell(value));
    }, this);
};

Subarray.prototype.isSingleton = function() {return (this.data.length === 1);};

Subarray.prototype.setDivIDs = function() {
    var i = 0;
    this.cells.forEach(function(cell) {
        cell.divID = this.divID + "_" + i;
        i++;
    }, this);
};

Subarray.prototype.setPivotPos = function(pivotVal) {
    if (this.type === "pre") {
        this.pivotIndex = 0;
        this.pivotValue = this.data[0];
        this.cells[0].isPivot = true;
    }
    else if (this.type === "post") {
        this.pivotValue = pivotVal;
        this.pivotIndex = this.data.lastIndexOf(pivotVal);
        this.cells[this.pivotIndex].isPivot = true;
    }
};

Subarray.prototype.getHTML = function() {
    var html = "";

    html = "<div class = 'array' id = '" + this.divID + "'>";

    this.cells.forEach(function(cell) {
        html += cell.getHTML(this.isSingleton(), this.type);
    }, this);

    return (html += "</div>");
};

Subarray.prototype.getPivotCell = function() {
    return this.cells[this.pivotIndex];
};

Subarray.prototype.getPivotDivID = function() {
    return this.getPivotCell().divID;
};

function printSubArray(A, l, r) { console.log(A.slice(l, r+1)); }