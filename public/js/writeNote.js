let googleUser;

window.onload = (event) => {
  // Use this to retain user state between html pages.
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log('Logged in as: ' + user.displayName);
      googleUser = user;
    } else {
      window.location = 'index.html'; // If not logged in, navigate back to login page.
    }
  });
};


const handleNoteSubmit = () => {
  // 1. Capture the form data
  const noteTitle = document.querySelector('#noteTitle');
  const noteText = document.querySelector('#noteText');
  // 2. Format the data and write it to our database
  firebase.database().ref(`users/${googleUser.uid}`).push({
    title: noteTitle.value,
    text: noteText.value
  })
  // 3. Clear the form so that we can write a new note
  .then(() => {
    noteTitle.value = "";
    noteText.value = "";
  });
}

const createTag = (tag) => {
//   var newTag = document.createElement("div");
//   newTag.classList.add("tags", "has-addons");
//   var newTagText = document.createElement("p");
//   newTagText.classList.add("tag");
//   var textNode = document.createTextNode(tag);
//   newTagText.appendChild(textNode);
//   var newTagDel = document.createElement("a");
//   newTagDel.classList.add("tag", "is-delete");
//   newTag.appendChild(newTagText);
//   newTag.appendChild(newTagDel);
//   var tagHolder = document.querySelector("#tags");
//   tagHolder.appendChild(newTag);
  var newTag = document.createElement("span");
  newTag.classList.add("tag");
  var textNode = document.createTextNode(tag);
  var delButton = document.createElement("button");
  delButton.classList.add("delete", "is-small");
  newTag.appendChild(textNode);
  newTag.appendChild(delButton);
  var tagHolder = document.querySelector("#tags");
  tagHolder.appendChild(newTag);
  delButton.addEventListener("click", event => {
      tagHolder.removeChild(newTag);
  });
};

const inputField = document.querySelector("#noteLabel");
inputField.addEventListener("change", event => {
    let text = inputField.value;
    createTag(text);
    inputField.value = "";
});