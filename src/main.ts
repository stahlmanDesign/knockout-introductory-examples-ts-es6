//import * as ko from "knockout";


// NOTE: if having two view models in one view, they need to be
// bound to different elements
// http://stackoverflow.com/questions/9293761/knockoutjs-multiple-viewmodels-in-a-single-view

// NOTE: from Knockout docs:
// http://knockoutjs.com/documentation/observables.html
// Optionally, you can pass a second parameter to define which 
// part of the document you want to search for data-bind attributes.
// For example, ko.applyBindings(myViewModel, document.getElementById('someElementId')). 
// This restricts the activation to the element with ID someElementId 
// and its descendants, which is useful if you want to have 
// multiple view models and associate each with a different 
// region of the page.

class ViewModel1 {
    language = ko.observable(''); // language: KnockoutObservable<string> // alternative syntax 
    framework = ko.observable(''); // framework: KnockoutObservable<string> // alternative syntax 

    constructor(language: string, framework: string) {
        this.language = ko.observable(language);
        this.framework = ko.observable(framework);
    }
}
const vm1 = new ViewModel1("TypeScript", "Knockout");
ko.applyBindings(vm1, document.getElementById('vm1'));


// --------


// Here's my data model
class ViewModel2 {
    public firstName: KnockoutObservable<string>;
    public lastName: KnockoutObservable<string>;
    public fullName: KnockoutComputed<string>;

    constructor(firstName: string, lastName: string) {
        this.firstName = ko.observable('Justin');
        this.lastName = ko.observable('Stahlman');
        this.fullName = ko.computed({
            owner: this,
            read: () => {
                return this.firstName() + " " + this.lastName();
            }
        });
    }
}

const vm2 = new ViewModel2("Planet", "Earth");
ko.applyBindings(vm2, document.getElementById('vm2')); // This makes Knockout get to work


class SimpleListModel {
    items: KnockoutObservableArray<any>;
    chosenItems: KnockoutObservableArray<any>;
    itemToAdd: KnockoutObservable<string>;
    addItem: any;
    removeItem: any;
    sortItems: any;
    sortAZ: boolean;

    constructor(items: any) {
        this.items = ko.observableArray(items);
        this.itemToAdd = ko.observable('');
        this.addItem = () => {
            if (this.itemToAdd() != '') {
                this.items.push(this.itemToAdd()); // Adds the item. Writing to the "items" observableArray causes any associated UI to update.
                this.itemToAdd(''); // Clears the text box, because it's bound to the "itemToAdd" observable
            }
        } // ES6 fat arrow function => Ensures that "this" is always this view model, no need to .bind(this)
        this.chosenItems = ko.observableArray([]); // initially select something: (['c'])
        // http://knockoutjs.com/documentation/selectedOptions-binding.html
        this.removeItem = () => {
            this.items.removeAll(this.chosenItems()) // remove selected items from list of items
            this.chosenItems.removeAll(); // now remove those from chosenItems, because no longer selected
            // alternative method to clear selection: this.chosenItems([]);  
        }
        this.sortAZ = true;

        this.sortItems = () => {

            if (this.sortAZ) {
                this.items.sort();  // sort array as strings
                this.items.sort((a, b) => this._compareFunction(a, b)) // now handle numbers
            } else {
                this.items.sort((a, b) => this._compareFunction(b, a)) //reverse all
            }
            this.sortAZ = !this.sortAZ;
            return;
        }
    }
    _compareFunction(left: string, right: string) {
        if (left < right) return -1;
        else if (left > right) return 1;
        else return 0;
    }
}

let vm3 = new SimpleListModel(["b", "a", "c", 10, 4]);
vm3.chosenItems.push('a'); // dynamically multi-select something in the list
// For single-select drop-down lists, use the value binding instead.

ko.applyBindings(vm3, document.getElementById('vm3'));


class ControlTypesViewModel {

    // There’s nothing interesting about the view model here - 
    // this is just to make clear how bindings work
    // with select elements, radio buttons, etc.

    stringValue: KnockoutObservable<string>;
    passwordValue: KnockoutObservable<string>;
    booleanValue: KnockoutObservable<boolean>;
    optionValues: any;
    selectedOptionValue: KnockoutObservable<string>;
    multipleSelectedOptionValues: KnockoutObservableArray<any>;
    radioSelectedOptionValue: KnockoutObservable<string>;

    constructor() {
        this.stringValue = ko.observable("Hello");
        this.passwordValue = ko.observable("mypass");
        this.booleanValue = ko.observable(true);
        this.optionValues = ["Alpha", "Beta", "Gamma"];
        this.selectedOptionValue = ko.observable("Gamma");
        this.multipleSelectedOptionValues = ko.observableArray(["Alpha"]);
        this.radioSelectedOptionValue = ko.observable("Beta");
    }
}
let vm5 = new ControlTypesViewModel();
ko.applyBindings(vm5, document.getElementById('vm5'));


class Person {
    // Define a "Person" class that tracks its own name and children, and has a method to add a new child
    name: string;
    children: KnockoutObservableArray<any>
    addChild: any;

    constructor(name: string, children: any) {
        this.name = name;
        this.children = ko.observableArray(children);

        this.addChild = () => {
            this.children.push("New child");
        }// .bind(this); not needed with => arrow function in ES6
    }
}

class PersonViewModel {
    // The view model is an abstract description of the state of the UI, but without any knowledge of the UI technology (HTML)

    people: any;
    showRenderTimes: KnockoutObservable<boolean>
    getTime: any;

    constructor() {
        this.people = [
            new Person("Annabelle", ["Arnie", "Anders", "Apple"]),
            new Person("Bertie", ["Boutros-Boutros", "Brianna", "Barbie", "Bee-bop"]),
            new Person("Charles", ["Cayenne", "Cleopatra"])
        ];
        this.showRenderTimes = ko.observable(false);
        this.getTime = () => new Date().getSeconds(); // can be here in class as a function, or in directly in html data-bind
    };
}
var vm6 = new PersonViewModel();
ko.applyBindings(vm6, document.getElementById('vm6'));




const initialData = [
    { name: "Well-Travelled Kitten", sales: 352, price: 75.95 },
    { name: "Speedy Coyote", sales: 89, price: 190.00 },
    { name: "Furious Lizard", sales: 152, price: 25.00 },
    { name: "Indifferent Monkey", sales: 1, price: 99.95 },
    { name: "Brooding Dragon", sales: 0, price: 6350 },
    { name: "Ingenious Tadpole", sales: 39450, price: 0.35 },
    { name: "Optimistic Snail", sales: 420, price: 1.50 }
];

class PagedGridModel {

    items = ko.observableArray([]);
    addItem: () => void;
    sortByName: () => void;
    jumpToFirstPage: () => void;
    gridViewModel: any
    simpleGrid: () => void;

    constructor(items: any) {
        this.items = ko.observableArray(items);

        this.addItem = function () {
            this.items.push({ name: "New item", sales: 0, price: 100 });
        };

        this.sortByName = function () {
            this.items.sort(function (a: any, b: any) {
                return a.name < b.name ? -1 : 1;
            });
        };

        this.jumpToFirstPage = function () {
            this.gridViewModel.currentPageIndex(0);
        };

        this.gridViewModel = new ko.simpleGrid.viewModel({
            data: this.items,
            columns: [
                { headerText: "Item Name", rowText: "name" },
                { headerText: "Sales Count", rowText: "sales" },
                { headerText: "Price", rowText: function (item: any) { return "$" + item.price.toFixed(2) } }
            ],
            pageSize: 4
        });
    };
}
let vm7 = new PagedGridModel(initialData);

ko.applyBindings(vm7, document.getElementById('vm7'));

class PlanetsModel {

    planets = ko.observableArray([]);
    typeToShow = ko.observable('');
    displayAdvancedOptions = ko.observable();
    addPlanet: any;
    planetsToShow: () => {};
    showPlanetElement: any;
    hidePlanetElement: any;

    constructor() {
        this.planets = ko.observableArray([
            { name: "Mercury", type: "rock" },
            { name: "Venus", type: "rock" },
            { name: "Earth", type: "rock" },
            { name: "Mars", type: "rock" },
            { name: "Jupiter", type: "gasgiant" },
            { name: "Saturn", type: "gasgiant" },
            { name: "Uranus", type: "gasgiant" },
            { name: "Neptune", type: "gasgiant" },
            { name: "Pluto", type: "rock" }
        ]);

        this.typeToShow = ko.observable("all");
        this.displayAdvancedOptions = ko.observable(false);

        this.addPlanet = (type:any) => {
            this.planets.push({
                name: "New planet",
                type: type
            });
        };

        this.planetsToShow = ko.computed( () => {
            // Represents a filtered list of planets
            // i.e., only those matching the "typeToShow" condition
            var desiredType = this.typeToShow();
            if (desiredType == "all") return this.planets();
            return ko.utils.arrayFilter(this.planets(), (planet) => (planet.type == desiredType) );
        });

        // Animation callbacks for the planets list
        this.showPlanetElement = (elem:any) => { if (elem.nodeType === 1) $(elem).hide().slideDown() }
        this.hidePlanetElement = (elem:any) => { if (elem.nodeType === 1) $(elem).slideUp( () => { $(elem).remove(); }) }
    };
}
// Here's a custom Knockout binding that makes elements shown/hidden via jQuery's fadeIn()/fadeOut() methods
// Could be stored in a separate utility library

ko.bindingHandlers.fadeVisible = {
    init: function (element:any, valueAccessor:any) {
        // Initially set the element to be instantly visible/hidden depending on the value
        var value = valueAccessor();
        $(element).toggle(ko.utils.unwrapObservable(value)); // Use "unwrapObservable" so we can handle values that may or may not be observable
    },
    update: function (element:any, valueAccessor:any) {
        // Whenever the value subsequently changes, slowly fade the element in or out
        var value = valueAccessor();
        ko.utils.unwrapObservable(value) ? $(element).fadeIn() : $(element).fadeOut();
    }
};
const vm8 = new PlanetsModel();
ko.applyBindings(vm8, document.getElementById('vm8'));
