var QSDemo = function() {
    this.trees = [];
    this.canvasDivID;
    this.canvasX;
    this.canvasY;
    this.formDivID;
    this.cellWidth = null; // determined at runtime
};

QSDemo.prototype.render = function (btree) {
    /* global jsPlumb */
    jsPlumb.empty(this.canvasDivID);
    $(this.canvasDivIDjq).empty();
    btree.render(this.canvasDivID, this.canvasDivIDjq);
};

QSDemo.prototype.renderForm = function (n) {
    var thisform = "";
    
    thisform += "<p class ='form'>";
    thisform += "<button type = 'button' id = 'runButton' onclick='run()'>run</button>";
    thisform += "</p>";
    thisform += "<p class ='form'>";
    thisform += "<button type = 'button' id = 'randButton' onclick='randomize()'>randomize</button>";
    thisform += "</p>";
    thisform += "<p class ='form'>";
    thisform += "n: <input type = 'text' size = '2' id = 'numFields'>";
    thisform += "</p>";
    thisform += "<p class ='form'>";
    thisform += "<button type = 'button' id = 'numButton' onclick='updateFields()'>update</button>";
    thisform += "</p>";

    thisform += "<form id='qsArray'></form>";

    $(this.formDivIDjq).append(thisform);
    updateFields(this.trees[0].inputArray);
};

QSDemo.prototype.run = function (dataSet) {
    updateFields(dataSet);
    var binaryTree = new BinaryTree(dataSet);
    binaryTree.runQuickSort();
    binaryTree.build();

    this.trees.push(binaryTree);
    this.render(binaryTree);
};

QSDemo.prototype.setCanvasID = function (divID) {
    this.canvasDivID = divID;
    this.canvasDivIDjq = "#" + this.canvasDivID;
};

QSDemo.prototype.setFormID = function (divID) {
    this.formDivID = divID;
    this.formDivIDjq = "#" + divID;
};

function randomize () {
    var i;
    var id;

    var inputArray = $(".inputVals").toArray();
    var length = inputArray.length;

    for (i=0; i<=(length-1); i++){
        id = "value" + i;
        document.getElementById(id).value = Math.floor(Math.random() * 100);
    }
};

function run () {
    /* global qsDemo */
    var dataSet = [];
    var inputArray = $(".inputVals").toArray();

    // error-checking user input
    inputArray.forEach(function (item) {
        if (item.value !== "") {
            var finalVal = parseInt(item.value);
            console.log("item value is " + item.value + " and finalVal is: "+ finalVal);
            if (isNaN(finalVal)) {}
            else {
                if (finalVal > qsDemo.maxVal) {
                    console.log("maxVal for input exceeded, changing " + finalVal + " to " + qsDemo.maxVal);
                    finalVal = qsDemo.maxVal;
                }
                else if (finalVal < qsDemo.minVal) {
                    console.log("minVal for input exceeded, changing" + finalVal + " to " + qsDemo.minVal);
                    finalVal = qsDemo.minVal;
                }
                dataSet.push(finalVal);
            }
        }
    });

    console.log("the data set is: " + dataSet);
    qsDemo.run(dataSet);
};

function updateFields(dataSet) {
    var numFields;
    var i;
    var fields = "";
    var id;

    if (dataSet !== undefined) {
        for (i = 0; i <= (dataSet.length - 1); i++) {
            id = "value" + i;
            fields += "<input class='inputVals' type='text' size='2' ";
            fields += "id='" + id + "' value=" + dataSet[i] + ">";
        }
    }
    else {
        var userInput;
        if (document.getElementById("numFields").value !== "") {
            userInput = parseInt(document.getElementById("numFields").value);
            if (isNaN(userInput)) { console.log("sorry, not a number."); }
            else {
                if (userInput < 1) {
                    console.log("Number of fields needs to be at least 1.");
                    numFields = 1;
                }
                else if (userInput > qsDemo.maxFields) {
                    console.log("I have throttled the max number of fields to " + qsDemo.maxFields);
                    console.log("so that newbies don't crash their browsers");
                    console.log("feel free to overwrite.");
                    numFields = qsDemo.maxFields;
                }
                else { numFields = userInput; }
            }
        }
        else { numFields = qsDemo.numFields; }

        for (i = 0; i <= (numFields - 1); i++) {
            id = "value" + i;
            fields += "<input class='inputVals' type='text' size='2' ";
            fields += "id='" + id + "'>";
        }
    }
    $("#qsArray").html(fields);
    $("#numFields").val(numFields);
}