let googleUserId;
let name;

window.onload = (event) => {
  // Use this to retain user state between html pages.
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log('Logged in as: ' + user.displayName);
      name = user.displayName;
      googleUserId = user.uid;
      getNotes(googleUserId);
    } else {
      // If not logged in, navigate back to login page.
      window.location = 'index.html'; 
    };
  });
};

const getNotes = (userId) => {
  const notesRef = firebase.database().ref(`users/${userId}`).orderByChild('title');
  notesRef.on('value', (snapshot) => {
    const data = snapshot.val();
    renderDataAsHtml(data);
  });
};

  let cardTitles = [];
  let fullCards = [];
  let cardTimes = [];
  let sortedCards = [];
const renderDataAsHtml = (data) => {
  let cards = ``;
  cardTitles = [];
  fullCards = [];
  cardTimes = [];
  for(const noteId in data) {
    const note = data[noteId];
    note.noteId = noteId;
    fullCards.push(note);
    cardTitles.push(note.title);
  };

  sortedCards = sortCards(cardTitles, fullCards, cardTitles.length);

  for (const noteKey in sortedCards) {
      const note = sortedCards[noteKey];

      if (note.title) { //avoid making undefined card for archive
        cards += createCard(note, note.noteId);
        setRandomColor();
        cardTimes.push(note.time); 
    }    
  }

  // Inject our string of HTML into our viewNotes.html page
  document.querySelector('#app').innerHTML = cards;
};

let counter = 0;
const createCard = (note, noteId) => {
   counter++;
   return `
     <div class="column is-one-quarter">
       <div class="card" id="id${counter}">
         <header class="card-header">
           <p class="card-header-title">${note.title}</p>
         </header>
         <div class="card-content">
           <div class="content">${note.text}</div>
           <div class="content"><i>Created by ${name} <br> on ${note.created}</i></div>
         </div>
         <footer class = "card-footer">
            <a 
                href = "#" 
                class = "card-footer-item" 
                onclick = "editNote('${noteId}')">
                Edit
           </a>
           <a 
                href = "#" 
                class = "card-footer-item" 
                onclick = "archiveNote('${noteId}')">
                Archive
           </a>
           <a  
                href = "#" 
                class = "card-footer-item" 
                onclick = "deleteNote('${noteId}')">
                Delete
           </a>
         </footer>
       </div>
     </div>
   `;
};

function deleteNote(noteId){
    if (confirm("Are you sure you want to delete this note?")){
      firebase.database().ref(`users/${googleUserId}/${noteId}`).remove();
    }
}

const editNote = (noteId) => {
  const editNoteModal = document.querySelector('#editNoteModal');
  const notesRef = firebase.database().ref(`users/${googleUserId}/${noteId}`);
  notesRef.on('value', (snapshot) => {
    // const data = snapshot.val();
    // const noteDetails = data[noteId];
    // document.querySelector('#editTitleInput').value = noteDetails.title;
    // document.querySelector('#editTextInput').value = noteDetails.text;
    const note = snapshot.val();
    document.querySelector('#editTitleInput').value = note.title;
    document.querySelector('#editTextInput').value = note.text;
    document.querySelector('#noteId').value = noteId;
  });
  editNoteModal.classList.toggle('is-active');
};

function saveEditedNote(){
    const title = document.querySelector('#editTitleInput').value;
    const text = document.querySelector('#editTextInput').value;
    const noteId = document.querySelector('#noteId').value;
    // const editedNote = {
    //     title: title,
    //     text: text
    // }
    const editedNote = {title, text}; //shorted way for above when the var names are repeated
    firebase.database().ref(`users/${googleUserId}/${noteId}`).update(editedNote);
    closeEditModal();
}

function closeEditModal(){
  const editNoteModal = document.querySelector('#editNoteModal');
  editNoteModal.classList.toggle('is-active');
}

function archiveNote(noteId){
  const notesRef = firebase.database().ref(`users/${googleUserId}/${noteId}`);
  notesRef.on('value', (snapshot) => {
    const note = snapshot.val();
    firebase.database().ref(`users/${googleUserId}/archive`).push({
      title: note.title,
      text: note.text 
    }) 
  }); 
  firebase.database().ref(`users/${googleUserId}/${noteId}`).remove();
}

function getRandomColor() {
  return "hsl(" + Math.random() * 361 + ", 100%, 90%)"
}

function setRandomColor() {
  var style = document.createElement('style');
  style.innerHTML = `
  #id${counter} {
    background: ${getRandomColor()}
  }
  `;
  document.head.appendChild(style);
}

function sortCards(arr, cards, n) {
    var i, j, min_idx;
 
    // One by one move boundary of unsorted subarray
    for (i = 0; i < n-1; i++)
    {
        // Find the minimum element in unsorted array
        min_idx = i;
        for (j = i + 1; j < n; j++)
        if (arr[j] < arr[min_idx])
            min_idx = j;
 
        // Swap the found minimum element with the first element
        var temp = arr[min_idx];
        arr[min_idx] = arr[i];
        arr[i] = temp;

        temp = cards[min_idx];
        cards[min_idx] = cards[i];
        cards[i] = temp;
    }
    return cards;
}

function sortCardsByTitle(){
    let cards = ``;
    cardTimes = [];
    cardTitles = [];
    sortedCards = sortCards(cardTitles, sortedCards, cardTitles.length);
    for (const noteKey in sortedCards) {
      const note = sortedCards[noteKey];
      if (note.title) { //avoid making undefined card for archive
        cards += createCard(note, note.noteId);
        setRandomColor();
        cardTimes.push(note.time); 
        cardTitles.push(note.title); 
      }
    }
    // Inject our string of HTML into our viewNotes.html page
    document.querySelector('#app').innerHTML = cards;  
}

function sortCardsByTime(){
    let cards = ``;
    cardTimes = [];
    cardTitles = [];
    sortedCards = sortCards(cardTimes, sortedCards, cardTimes.length);
    for (const noteKey in sortedCards) {
      const note = sortedCards[noteKey];
      if (note.title) { //avoid making undefined card for archive
        cards += createCard(note, note.noteId);
        setRandomColor();
        cardTimes.push(note.time); 
        cardTitles.push(note.title); 
      }
    }    
  // Inject our string of HTML into our viewNotes.html page
  document.querySelector('#app').innerHTML = cards;
}