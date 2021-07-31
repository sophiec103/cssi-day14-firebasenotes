let googleUser;

window.onload = (event) => {
  // Use this to retain user state between html pages.
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log('Logged in as: ' + user.displayName);
      googleUser = user;
      document.querySelector(".is-1").innerHTML = "What's on your mind, " + user.displayName.split(" ")[0] + "?";
    } else {
      window.location = 'index.html'; // If not logged in, navigate back to login page.
    }
  });
};


const handleNoteSubmit = () => {
  // 1. Capture the form data
    const noteTitle = document.querySelector('#noteTitle');
    const noteText = document.querySelector('#noteText');

    if (noteTitle.value != "") {
        const d = new Date();
        const year = d.getFullYear();	//Get the year as a four digit number (yyyy)
        const month = d.getMonth() + 1;	//Get the month as a number (0-11)
        const day = d.getDate();	//Get the day as a number (1-31)
        const hour = d.getHours();	//Get the hour (0-23)
        const mins = d.getMinutes(); //Get the minute (0-59)
        const time = d.getTime();
        let created = "";
        if (mins>=10) created = day + "/" + month + "/" + year + " at " + hour + ":" + mins;
        else created = day + "/" + month + "/" + year + " at " + hour + ":0" + mins;

        // 2. Format the data and write it to our database
        firebase.database().ref(`users/${googleUser.uid}`).push({
            title: noteTitle.value,
            text: noteText.value,
            labels: arr,
            created: created,
            time: time
        })
            // 3. Clear the form so that we can write a new note
            .then(() => {
                noteTitle.value = "";
                noteText.value = "";
                arr = [];
                document.querySelector("#tags").innerHTML = " ";
            });
    }
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
  var space = document.createTextNode(" ");
  var delButton = document.createElement("button");
  delButton.classList.add("delete", "is-small");
  newTag.appendChild(textNode);
  newTag.appendChild(delButton);
  var tagHolder = document.querySelector("#tags");
  tagHolder.appendChild(newTag);
  tagHolder.appendChild(space);
  delButton.addEventListener("click", event => {
      tagHolder.removeChild(newTag);
      arr.splice(arr.indexOf(tag), 2); 
  });
};

let arr = [];
const inputField = document.querySelector("#noteLabel");
inputField.addEventListener("change", event => {
    let text = inputField.value.trim();
    if (arr.indexOf(text)==-1){
        createTag(text);
        arr.push(text);
    }
    inputField.value = "";
});