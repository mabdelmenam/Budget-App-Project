//Immediately invoked function
var budgetController = (function(){
    var Expense = function(id, description,value){
        this.id = id;
        this.description = description;
        this.value = value;
    };
    var Income = function(id, description,value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    Expense.prototype.calcPrecentage = function(totalIncome){
        if(totalIncome > 0){
            this.percentage = Math.round((this.value / totalIncome) * 100);
        }else{
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function(){
        return this.percentage;
    };

    var calculateTotal = function(type){
        var sum = 0; 
        var theData = data.allItems[type];
        //Adding the items in the array of[type] as they go in one by one
        for(var i = 0; i < theData.length; i++){
            sum = sum + theData[i].value;
        }
        //data.allItems[type].forEach(function(cur){
          //  sum = sum + cur.value;
       //});
        data.totals[type] = sum;

    };
    var data = {
            allItems:{
                expense: [],
                income: []
            },
            totals:{
                expense:0,
                income:0
            },
            budget: 0,
            percentage: -1
    };

    return{
        addItem: function(type,des,val){
            var newItem,ID;
            //Create new ID
            if(data.allItems[type].length > 0){
                var minusOne = data.allItems[type].length - 1;
                ID = data.allItems[type][minusOne].id + 1;
            }
            else{ID = 0;}
            //Create new item based on type
            if(type === 'expense'){
                newItem = new Expense(ID, des, val);
            }else if(type === 'income'){
                newItem = new Income(ID, des, val);
            }
            //object.allItems[inc or exp].add it to it(object)
            //Add it to data structure
            data.allItems[type].push(newItem);
            return newItem;
        },
        deleteItem: function(type,id){
            var ids = data.allItems[type].map(function(current){
                return current.id;
            });

            var index = ids.indexOf(id);

            if(index !== -1){
                //splice ............splice(starting index, how many elements to delete)
                data.allItems[type].splice(index,1);
            }
        },

        calculateBudget: function(){
            //calculate total income and expenses
            calculateTotal('income');
            calculateTotal('expense');
            //Calculate budget: income - expenses')
            data.budget = data.totals.income - data.totals.expense;
            //calculate the percentage of income that we spent
            if(data.totals.income > 0){
                data.percentage = Math.round(data.totals.expense / data.totals.income * 100);
            }
            //Expense = 100 and income 300, spent 33.333% = 100/300 = 0.3333 * 100

        },
        calculatePercentages: function(){
            data.allItems.expense.forEach(function(cur){
                cur.calcPrecentage(data.totals.income);
            });
        },
        
        getPercentages: function(){
            var allPercentages = data.allItems.expense.map(function(cur){
                return cur.getPercentage();
            });
            return allPercentages;
        },

        getBudget: function(){
            return{
                budget: data.budget,
                totalIncome: data.totals.income,
                totalExpenses: data.totals.expense,
                percentage: data.percentage
            }
        },
        testing:function(){
            console.log(data);
        }
    };
})();

var UIController = (function(){

    var DOMs = {
        inputType: '.add__type',
        desc: '.add__description',
        value: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetValue: '.budget__value',
        budgetIncome: '.budget__income--value',
        budgetExpense: '.budget__expenses--value',
        budgetPercentage: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dataLabel: '.budget__title--month'
    };
    //arguments nodelist,callback function
    var nodeListfE = function(list,callback){
        //for loop that every iteration calls our callback function
        for(var i = 0; i < list.length; i++){
            callback(list[i], i);
        }
    };
    return {
        getinput: function(){
            return{
                type: document.querySelector(DOMs.inputType).value,
                description: document.querySelector(DOMs.desc).value,
                value: parseFloat(document.querySelector(DOMs.value).value)
                }
        },

        addListItem: function(obj,type){
            //Create HTML string with placeholder text
            var html, element;
            if(type === "income"){
                element = DOMs.incomeContainer;
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
            else if(type === "expense"){
                element = DOMs.expensesContainer;
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
            //Replace the placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', this.formatNumber(obj.value,type));

            //Insert the data
            document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
        },
        deleteListItem: function(selectedId){
            var element = document.getElementById(selectedId);
            element.parentNode.removeChild(element);
        },
        //Removing items
        clearFields: function(){
            var fields, fieldsArr;
            fields = document.querySelectorAll(DOMs.desc + ', ' + DOMs.value);

            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function(current, index, array){
                current.value = "";
            });

            fieldsArr[0].focus();
        },
        displayBudget: function(obj){
            var type;
            if(obj.budget > 0){
                type === 'income';
            }else{
                type === 'expense';
            }
            document.querySelector(DOMs.budgetValue).textContent = this.formatNumber(obj.budget,type);
            document.querySelector(DOMs.budgetIncome).textContent = this.formatNumber(obj.totalIncome,'income');
            document.querySelector(DOMs.budgetExpense).textContent = this.formatNumber(obj.totalExpenses,'expense');
            
            if(obj.percentage > 0){
                document.querySelector(DOMs.budgetPercentage).textContent = obj.percentage;
            }
            else{
                document.querySelector(DOMs.budgetPercentage).textContent = "----";

            }
        },
        displayPercentages: function(percentages){
            var fields = document.querySelectorAll(DOMs.expensesPercLabel);

            /*for(var i = 0;i < fields.length; i++){
                if(percentages[i] > 0){
                    fields[i].textContent = percentages[i] + '%';
                }else{
                    fields[i].textContent = '---';
                }
            }*/
            //When calling the below function, we pass our callback function into itSS
            nodeListfE(fields,function(current,index){
                if(percentages[index] > 0){
                    current.textContent = percentages[index] + '%';
                }else{
                    current.textContent = '---';
                }
            });
        },
        displayMonth: function(){
            var currdate, year, month, monthsArray;
            //gives current date
            monthsArray = ['January', 'February', 'March', 'April', 'May','June','July','August','September','October','November','December'];
            currdate = new Date();
            year = currdate.getFullYear();
            month = currdate.getMonth();

            document.querySelector(DOMs.dataLabel).textContent = monthsArray[month] + ' ' + year;
        },
        changedType: function(){
            var fields = document.querySelectorAll(
                DOMs.inputType + ',' +
                DOMs.inputDescription + ',' +
                DOMs.inputValue);

            nodeListfE(fields,function(cur){
                cur.classList.toggle('red-focus');
            });

            document.querySelector(DOMs.inputBtn).classList.toggle('red');
        },
        formatNumber: function(num,type){
            var num, numSplit, int, dec;
            num = Math.abs(num);
            // 2 decimal points
            num = num.toFixed(2);

            //splitting number into decimal and integer part
            numSplit = num.split('.');
            //integer part and decimal part
            int = numSplit[0];

            if(int.length > 3){
                int = int.substr(0,int.length-3) + ',' + int.substr(int.length-3,3);//input 2310, output 2,310
            }
            dec = numSplit[1];

            return (type === 'expense' ? '-' : '+') + ' ' + int + '.' + dec;

        },
        //making the DOMs object available to other controllers, aka public
        getDOMstrings: function(){
            return DOMs;
        }
    };
})();

var controller = (function(_budgetCtrl,_UICtrl){
    //Controller connects the other two Controllers together

    var eventListeners = function(){
        var DOM = _UICtrl.getDOMstrings();
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
        
        document.addEventListener('keypress', function(event){
        //if Enter key is pressed call the ctrlAddItem function
        //The QuerySelector makes it possible for both click and Enter to work
            if(event.keyCode == 13){
            ctrlAddItem();
            }

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

        document.querySelector(DOM.inputType).addEventListener('change', _UICtrl.changedType);
        });
    };
    var updateBudget = function(){
        //1.Calculate budget
        _budgetCtrl.calculateBudget();
        //2. return the budget
        var budget = _budgetCtrl.getBudget();
        //console.log(budget);
        //3. Display Budget on 
        _UICtrl.displayBudget(budget);
    };
    var updatePercentages = function(){
        //1.Calculate Percentage
        _budgetCtrl.calculatePercentages();
        //2. Read percentages from budget controller
        var percentages = _budgetCtrl.getPercentages();
        //3. Update UI with new percentages
        _UICtrl.displayPercentages(percentages);
        //console.log(percentages);
    };
    var ctrlAddItem = function(){
        //Check Button
        //1. Get field input data
        var input = _UICtrl.getinput();
        if(input.description !== "" && !isNaN(input.value) && input.value > 0){ //NaN is Not a Number 
        //2.Add item to budget controller
        var newItem = _budgetCtrl.addItem(input.type,input.description,input.value);

        //3.Add the item to UI
        _UICtrl.addListItem(newItem,input.type);

        //4. Clear the fields
        _UICtrl.clearFields();

        //5. Calculate and update budget
        updateBudget();
        //6.Calculate and update percentages
        updatePercentages();
        }
    }

    var ctrlDeleteItem = function(event){
        var splitId,type,ID;
        var itemId = event.target.parentNode.parentNode.parentNode.id;

        if(itemId)
        {
            splitId = itemId.split('-');
            type = splitId[0];
            ID = parseInt(splitId[1]);
            console.log(ID);

            //1. Delete item from Data Structure
            _budgetCtrl.deleteItem(type,ID);

            //2.Delete item from UI
            _UICtrl.deleteListItem(itemId);
            //3.Update and show
            updateBudget();
            //4.Update Percentages
            updatePercentages();
        }
    };

    //Initialization Function
    return{
        init: function(){
            _UICtrl.displayMonth();
            _UICtrl.displayBudget({budget: 0,
                totalIncome: 0,
                totalExpenses: 0,
                percentage: -1});
            eventListeners(); 
        }
    }


})(budgetController, UIController);

//Event Listeners will only be called when init function is called

controller.init();
