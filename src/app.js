// connect to firebase server
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const firebaseDatabaseURL = {
  databaseURL:
    "https://addtocart-26741-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

const app = initializeApp(firebaseDatabaseURL);
// console.log(app);
const database = getDatabase(app);
// console.log(database);
const shoppingListInDB = ref(database, "ShoppingList");
// console.log(shoppingListInDB);

const inputField = document.getElementById("input-field");
const addButton = document.getElementById("add-button");
const shoppingList = document.getElementById("shopping-list");

// Event listener for the 'add-button' that listens for a 'click' event.
addButton.addEventListener("click", () => {
  // When the button is clicked, it retrieves the value of the input field,
  let inputValue = inputField.value.trim();

  // adds it to the Firebase database, updates the shopping list HTML element,
  // The 'push' function is a method from the Firebase library that appends the input value to the 'ShoppingList' reference in the database.
  push(shoppingListInDB, inputValue);

  // and clears the input field.
  clearInputField();
  // Adds the input item to the shopping list HTML element.
  // addItemsShoppingList(inputValue);
});

onValue(shoppingListInDB, function (snapshot) {
  if (snapshot.exists()) {
    let showAllItems = Object.entries(snapshot.val());
    // console.log(snapshot.val());
    clearShowItems();
    for (let i = 0; i < showAllItems.length; i++) {
      let currentItem = showAllItems[i];
      let currentItemId = currentItem[0];
      let currentItemValues = currentItem[1];

      addItemsShoppingList(currentItem);
      // console.log(showAllItems[i]);
    }
  } else {
    shoppingList.innerHTML = "No items available, Try To Add";
  }
});

//Clears the content of the shopping list HTML element.
function clearShowItems() {
  shoppingList.innerHTML = "";
}

// Clears the value of the input field.
function clearInputField() {
  inputField.value = "";
}

// Adds an item to the shopping list, The item to add to the shopping list.
function addItemsShoppingList(item) {
  // Extracts the value of the item from the input array.
  let itemID = item[0];
  let itemValue = item[1];

  // Creates a new list item element.
  let newEl = document.createElement("li");

  // Sets the text content of the new list item to the value of the item.
  newEl.textContent = itemValue;

  // Adds an event listener to the new list item that listens for a double-click event.
  newEl.addEventListener("dblclick", function () {
    // console.log(itemID);

    // Retrieves the reference to the specific item in the Firebase database.
    let exactLocationOfItemInDB = ref(database, `ShoppingList/${itemID}`);

    // Removes the specific item from the Firebase database.
    remove(exactLocationOfItemInDB);
  });

  // Appends the new list item to the shopping list HTML element.
  shoppingList.appendChild(newEl);
}
