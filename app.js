// BUDGET CONTROLLER
var budgetController = (function(){

    var Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    }
    Expense.prototype.calcPercentage = function(totalIncome){
        if(totalIncome>0){
            this.percentage = Math.round((this.value / totalIncome) * 100);
        }else{
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function(){
        return this.percentage;
    };

    var Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    }

    var calculateTotal = function(type){
        var sum = 0;
        data.allItems[type].forEach(function(e){
            sum += e.value;
        });
        data.totals[type] = sum;
    }

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    }


    return{
        addItem: function(type, des, val){
            var newItem, ID;
            //create new id
            if(data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            }else{
                ID = 0;
            }
            //create new item
            if(type === 'exp'){
                newItem = new Expense(ID, des, val);
            }else if(type === 'inc'){
                newItem = new Income(ID, des, val);
            }
            //pushing item to data structure
            data.allItems[type].push(newItem); 

            return newItem;
        },
        deleteItem: function(type, id){
            var ids, index;

            ids = data.allItems[type].map(function(current){
                return current.id;
            });

            index = ids.indexOf(id);
            
            if(index !== -1){
                data.allItems[type].splice(index,1);
            }

        }
        ,
        calculateBudget: function(){
            //calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');

            //calculate budget 

            data.budget = data.totals.inc - data.totals.exp;

            //percentatge
            if(data.totals.inc>0){
                data.percentage = Math.round((data.totals.exp/data.totals.inc) * 100);
            }else{
                data.percentage = -1;
            }
            
        },
        calculatePercentages: function(){
            data.allItems.exp.forEach(function(cur){
                cur.calcPercentage(data.totals.inc);
            });
        },
        getPercentage: function(){
            var allPerc = data.allItems.exp.map(function(cur){
                return cur.getPercentage();
            })
            return allPerc;
        },
        getBudget: function(){
            return{
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        }
        ,
        
        //temp
        // addTotal: function(type,val){
        //     if(type === 'exp'){
        //         data.totals[type] += Number(val);
        //     }else if(type === 'inc'){
        //         data.totals[type] += Number(val);
        //     }
        // },//temp
        // data: function(){
        //     // var t = data.allItems.exp[3];
        //     return data;
        // }
    }
   
})();


// UI CONTROLLER
var UIcontroller = (function(){


    var DOMstrings = {
        inputType: '.options',
        inputDescription: '.input__text--receiver',
        inputValue: '.input__value--receiver',
        inputBtn : '.input__button',
        incomeContainer: '.income__lists',
        expensesContainer: '.expenses__lists',
        budgetLabel: '.total',
        incomeLabel: '.main__income--total',
        expenseSLabel: '.main__expense--total',
        percentageLable: '.percentage',
        container: '.inner__bottom',
        expsensesPercentageLabel: '.expenses__percentage',
        dateLabel: '.current__month'
    }

    
    var formatNumber =  function(num, type){
        var numSplit, int, dec, sign;

        num = Math.abs(num);
        num = num.toFixed(2); 

        numSplit = num.split('.');
        int = numSplit[0];

        if(int.length > 3){
            int = int.substr(0, int.length-3 +"," + int.substr(int.length - 3, 3));
        }

        dec = numSplit[1];

        

        return (type === 'exp' ? '-' : '+') + ' ' + int +'.'+ dec;
    };
    return{
        getInput: function(){
            return{
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        },
        addListItem: function(obj, type){
            var html, newHtml, element;
            if(type === 'inc'){
                element = DOMstrings.incomeContainer;
                html = '<li class="income__list" id="inc-%id%"><span class="income__list--title">%description%</span><span class="income__list--value">%value%</span><span class="income__delete"><i class="far fa-times-circle"></i></span></li>'
            }else if(type === 'exp'){
                element = DOMstrings.expensesContainer;
                html = '<li class="expenses__list" id="exp-%id%"><span class="expenses__list--title">%description%</span><span class="expenses__list--value">%value%</span><span class="expenses__percentage">0</span><span class="expenses__delete"><i class="far fa-times-circle"></i></span></li>'
            }

            newHtml = html.replace('%id%',obj.id);
            newHtml = newHtml.replace('%description%',obj.description);
            newHtml = newHtml.replace('%value%',obj.value, type);
            // if(type === 'exp'){//temp
            //     newHtml = newHtml.replace('%percent%',obj.value);
            // }

            document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
        },
        deleteListItem: function(selectorID){
            var el = document.querySelector('#'+selectorID);
            el.parentNode.removeChild(el);
        },
        displayMonth: function(){
            var now,date , year, month, months;

            now = new Date();
            months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
            date= now.getDate();
            year = now.getFullYear();
            month = now.getMonth();
            
            document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' '+ year;
        },
        changeType: function(){
            
        }
        ,
        clearFields: function(){
            var fields, fieldsArr;

            fields = document.querySelectorAll(DOMstrings.inputDescription + "," + DOMstrings.inputValue);
            fieldsArr = Array.prototype.slice.call(fields);
            fieldsArr.forEach(function(current,index,arrary){
                current.value = "";
            });
            fieldsArr[0].focus();
            
            return fieldsArr;
        },
        displayBudget: function(obj){
            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMstrings.expenseSLabel).textContent = obj.totalExp;
            

            if(obj.percentage > 0){
                document.querySelector(DOMstrings.percentageLable).textContent = obj.percentage + '%';
            }else{
                document.querySelector(DOMstrings.percentageLable).textContent = '---';
            }
        },
        displayPercentages: function(percentages){
            var fields =  document.querySelectorAll(DOMstrings.expsensesPercentageLabel);

            var nodeListForEach = function(list, callback){
                for(var i = 0; i<list.length; i++){
                    callback(list[i], i);
                };
            }

            nodeListForEach(fields,function(current, index){
                if(percentages[index] > 0){
                    current.textContent = percentages[index] + '%';
                }else{
                    current.textContent = '---';
                }
                
            });
            return fields;
        }
        ,
        getDOMstrings: function(){
            return DOMstrings;
        }
    }

})();



//GLOBAL CONTROLLER 
var controller = (function(budgetCtrl, UICtrl){

    var setupEventListeners = function(){
        var DOM = UICtrl.getDOMstrings()

        


        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress',function(e){
       
            if(e.keyCode === 13 || e.which === 13){
                ctrlAddItem();
                // if(document.querySelector('.input__text--receiver').value != '' && document.querySelector('.input__value--receiver').value != ''){
                    
                // }
            }
           
    
        });

        document.querySelector(DOM.inputType).addEventListener('change',UICtrl.changeType);

        document.querySelector(DOM.container).addEventListener('click',ctrlDeleteItem);
    };

    var budgetUpdate = function(){
        //1. calculate the budget
        budgetCtrl.calculateBudget();
        //2. return the budget
        var budget = budgetCtrl.getBudget();

        //3. display the budget
        UICtrl.displayBudget(budget);
        // console.log(budget);
    }

    var updateParcentage = function(){
        //calc per
        budgetCtrl.calculatePercentages();

        //read 
        var percentages = budgetCtrl.getPercentage();

        //update ui
        // console.log(percentages);
        UICtrl.displayPercentages(percentages);


    }
    

    var ctrlAddItem = function(){
        // 1. get the field input data
            
        var input, newItem;
        input = UICtrl.getInput();
        // console.log(input);

        // 2. add the item to the budget controller
        if(input.description != "" && !isNaN(input.value && input.value > 0)){
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            //temp
            // budgetCtrl.addTotal(input.type, input.value);
            // 3. add the item to the UI

            UICtrl.addListItem(newItem, input.type);
            // document.querySelector('.input__text--receiver').value = '';
            // document.querySelector('.input__value--receiver').value = '';
            UICtrl.clearFields();
        
            //4. calculate and update the budget
            budgetUpdate();

            // 5. cal and update percentage
            updateParcentage();
        }
        
    }

    var ctrlDeleteItem = function(event){
        var itemID, splitID, type, ID;
        itemID = event.target.parentNode.parentNode.id;
        if(itemID){
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            // delete item from data structer
            budgetCtrl.deleteItem(type, ID);

            //delete from UI
            UICtrl.deleteListItem(itemID);

            //update budget

            budgetUpdate();

            //cal and update percentage
            updateParcentage();
        }
    }
    
    
    return {
        init: function(){
            // console.log('started');
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: '---'
            });
            UICtrl.displayMonth();
            setupEventListeners();
        }
    };
    

})(budgetController, UIcontroller);


controller.init();