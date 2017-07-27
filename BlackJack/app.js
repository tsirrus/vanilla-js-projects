(function () {
  // app state
  // ===================
  // These variables represent the state of our application, they tell us at
  // any given moment the state of our blackjack game. You might find it useful
  // to use these to debug issues by console logging them in the functions below.
  var deckID = "";
  var dealerCards = [];
  var playerCards = [];
  var playerScore = 0;
  var dealerScore = 0;
  var roundLost = false;
  var roundWon = false;
  var roundTied = false;

  // Deck of Cards API calls:
  // ===================
  function shuffleNewDeck () {
    return fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6')
    .then(response => response.json())
    .then(data => {
      //console.log(data); //Test
      return data.deck_id;
    })
    .catch(error => {
      throw new Error(error);
    });
  }

  function drawCardsFromDeck(amountOfCards) {
    //console.log("deckId=",deckID); //Test
    return fetch(`https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=${amountOfCards}`)
    .then(response => response.json())
    .then(data => {
      //console.log(data); //Test
      if(data.success) {
        return data.cards;
      }
    })
    .catch(error => {
      throw new Error(error);
    });
  }

  function emptyChildren(element) {
    while (element.lastChild) {
      element.removeChild(element.lastChild);
    }
  }

  function displayCard(element, card, hideFirstCard=false) {
    var image = document.createElement('img');
    image.setAttribute('src', card.image);
    image.setAttribute('alt', card.code);

    if (hideFirstCard) {
      //console.log("Hiding first card!"); //Test
      image.setAttribute('src', "./card.png");
      image.setAttribute('id', "hiddenDealerCard");
    }

    element.appendChild(image);
  }

  function showDealerCard(){
    var hiddenCard = document.querySelector('#hiddenDealerCard');
    hiddenCard.setAttribute('src', dealerCards[0].image);
  }

  // game play nodes:
  // ===================
  // These nodes will be used often to update the UI of the game.

  // assign this variable to the DOM node which has id="dealer-number"
  var dealerScoreNode = document.querySelector('#dealer-number');

  // select the DOM node which has id="player-number"
  var playerScoreNode = document.querySelector('#player-number');

  // select the DOM node which has id="dealer-cards"
  var dealerCardsNode = document.querySelector('#dealer-cards');

  // select the DOM node which has id="player-cards"
  var playerCardsNode = document.querySelector('#player-cards');

  // selec the DOM node which has id="announcement"
  var announcementNode = document.querySelector('#announcement');

  // selec the DOM node which has id=new-game"
  var newDeckNode = document.querySelector('#new-game');

  // selec the DOM node which has id="next-hand"
  var nextHandNode = document.querySelector('#next-hand');

  // selec the DOM node which has id=""hit-me""
  var hitMeNode = document.querySelector('#hit-me');

  // selec the DOM node which has id="stay"
  var stayNode = document.querySelector('#stay');


  // On click events
  // ==================
  // These events define the actions to occur when a button is clicked.
  // These are provided for you and serve as examples for creating further
  // possible actions of your own choosing.
  newDeckNode.onclick = getNewDeck;
  nextHandNode.onclick = newHand;
  hitMeNode.onclick = () => hitMe('player');
  stayNode.onclick = () => setTimeout(() => dealerPlays(), 600);
  // ==================


  // Game mechanics functions
  // ========================
  function checkRound() {
    if (roundWon || dealerScore > 21 || playerCards.length === 5) {
      nextHandNode.style.display = 'block';
      hitMeNode.style.display = 'none';
      stayNode.style.display = 'none';
      if (playerCards.length === 2 && playerScore === 21) {
        announcementNode.innerText = "BlackJack!!! You win!";
      }
      else {
        announcementNode.innerText = "You win!";
      }
      return true;
    }
    else if (roundTied) {
      nextHandNode.style.display = 'block';
      hitMeNode.style.display = 'none';
      stayNode.style.display = 'none';
      announcementNode.innerText = "Tied game :|";
      return true;
    }
    else if (roundLost || playerScore > 21 || dealerCards.length === 5) {
      nextHandNode.style.display = 'block';
      hitMeNode.style.display = 'none';
      stayNode.style.display = 'none';
      if (dealerCards.length === 2 && dealerScore === 21) {
        announcementNode.innerText = "BlackJack!!! You lose!";
      }
      else {
        announcementNode.innerText = "You lose...";
      }
      return true;
    }
    else {
      announcementNode.innerText = "";
      return false;
    }
  }

  function getNewDeck() {
    /* This function needs to:
    1) Call the resetPlayingArea function
    2) Make a call to deckofcardsapi in order to retrieve a new deck_id
    3) Set the value of our state variable deckID to the retrieved deck_id
    4) Change the display property of style on the nextHandNode element in order
    to provide the player with the Next Hand button.
    5) Hide the hit-me and stay buttons by changing their style.display to "none"
    6) Catch any errors that may occur on the fetch and log them */
    resetPlayingArea(); //1
    shuffleNewDeck() //2, 3
    .then(result => {
      //console.log("Result=",result);
      deckID = result;
      //console.log("deckID=",deckID);
      nextHandNode.style.display = 'block';
      hitMeNode.style.display = 'none';
      stayNode.style.display = 'none';
    });
  }

  function computeScore(cards) {
    // This function receives an array of cards and returns the total score.
    // ...
    var score = 0;
    console.log("Cards=",cards);
    //var arrayAces = []; //Not needed
    for (var i in cards) {
      console.log("Card Value=",cards[i].value);
      switch(cards[i].value) {
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
        case '10':
          score += +cards[i].value;
          break;
        case 'JACK':
        case 'QUEEN':
        case 'KING':
          score += 10;
          break;
        case 'ACE':
          score += 100;
          break;
      }
    }
    //Handle ACE logic (1 or 11)
    while (score >= 100) {
      if (score - 89 <= 21) {
        score -= 89;
      }
      else {
        score -= 99;
      }
    }
    return score;
  }


  function newHand() {
    /* This function needs to:
    1) Call the resetPlayingArea function
    2) Make a call to deckofcardsapi using the deckID state variale in order
    to retrieve draw 4 cards from the deck.
    3) Once 4 cards have been drawn, push 2 of them to our dealerCards state
    array and 2 to our playerCards state array.
    4) Set our dealerScore state variable to "?" and then set the textContent
    value of the dealerScoreNode to dealerScore;
    5) ForEach card in playerCards and dealerCards, create an <img> element
    and assign the src of these to their respective card images. Don't forget to
    append these newly created <img> elements to the respective #dealer-cards and
    #player-cards DOM elements in order to have them show up in the html.
    6) Finally, compute the player's score by calling computeScore() and update
    the playerScoreNode to reflect this.
    7) If player score is 21, announce immediate victory by setting:
    roundWon = true;
    announcementNode.textContent = "BlackJack! You Win!";
    8) catch and log possible error from the fetch.
    */
    resetPlayingArea(); //1
    drawCardsFromDeck(4) //2
    .then(cardsDrawn => {
      //console.log(cardsDrawn);
      playerCards = cardsDrawn.slice(0,2);
      //console.log("PlayerCards=",playerCards);
      displayCard(playerCardsNode, playerCards[0]);
      displayCard(playerCardsNode, playerCards[1]);
      playerScore = computeScore(playerCards);
      console.log(playerScore);
      playerScoreNode.innerText = playerScore;

      dealerCards = cardsDrawn.slice(2);
      dealerScore = computeScore(dealerCards.slice(1));
      console.log(dealerScore);
      dealerScoreNode.innerText = dealerScore;
      //console.log("DealerCards=",dealerCards);
      displayCard(dealerCardsNode, dealerCards[0], true);
      displayCard(dealerCardsNode, dealerCards[1]);

      if (playerScore === 21) {
        roundWon = true;
      }
      checkRound();

      nextHandNode.style.display = 'none';
      hitMeNode.style.display = 'block';
      stayNode.style.display = 'block';
    })
  }


  function resetPlayingArea() {
    /* This function needs to:
    1) Reset all state variables to their defaults
    2) Reset the gameplay UI by updating textContent of all Nodes which may
    be displaying data from a previous round in the game. (ex: dealerScoreNode)
    3) Remove all <img> elements inside dealerCardsNode and playerCardsNode.
    */
    //Reset variables
    //deckID = "";
    dealerCards = [];
    playerCards = [];
    playerScore = 0;
    dealerScore = 0;
    roundLost = false;
    roundWon = false;
    roundTied = false;
    playerScoreNode.innerText = playerScore;
    dealerScoreNode.innerText = dealerScore;
    checkRound();
    emptyChildren(playerCardsNode);
    emptyChildren(dealerCardsNode);
  }


  function hitMe(target) {
    /* This function needs to:
    1) If any of roundLost or roundWon or roundTied is true, return immediately.
    2) Using the same deckID, fetch to draw 1 card
    3) Depending on wether target is 'player' or 'dealer', push the card to the
    appropriate state array (playerCards or dealerCards).
    4) Create an <img> and set it's src to the card image and append it to the
    appropriate DOM element for it to appear on the game play UI.
    5) If target === 'player', compute score and immediately announce loss if
    score > 21 by setting:
    roundLost = true;
    and updating announcementNode to display a message delivering the bad news.
    6) If target === 'dealer', just call the dealerPlays() function immediately
    after having appended the <img> to the game play UI.
    7) Catch error and log....
    */
    if (checkRound()) {
      return;
    }
    else {
      drawCardsFromDeck(1)
      .then(cardArray => {
        if (target === 'player') {
          playerCards.push(cardArray[0]);
          displayCard(playerCardsNode, cardArray[0]);
          playerScore = computeScore(playerCards);
          playerScoreNode.innerText = playerScore;

          if (playerScore > 21) {
            roundLost = true;
            dealerPlays();
          }
          else {
            checkRound();
          }
        }
        else {
          dealerCards.push(cardArray[0]);
          displayCard(dealerCardsNode, cardArray[0]);

          dealerPlays();
        }
      })
    }
  }

  function dealerPlays() {
    /* This function needs to:
    1) If any of roundLost or roundWon or roundTied is true, return immediately.
    2) Compute the dealer's score by calling the computeScore() function and
    update the UI to reflect this.
    */

    nextHandNode.style.display = 'block';
    hitMeNode.style.display = 'none';
    stayNode.style.display = 'none';

    showDealerCard();
    dealerScore = computeScore(dealerCards);
    dealerScoreNode.innerText = dealerScore;

    if (dealerCards.length === 2 && dealerScore === 21) {
      roundLost = true;
    }

    if (checkRound()) {
      return;
    }

    if (dealerScore < 17) {
      // a delay here makes for nicer game play because of suspence.
      setTimeout(()=>hitMe('dealer'), 900)
    }
    else if (dealerScore > 21) {
      roundWon = true;
      checkRound();
    }
    else if (dealerScore > playerScore) {
      roundLost = true;
      checkRound();
    }
    else if (dealerScore === playerScore) {
      roundTied = true;
      checkRound();
    }
    else {
      roundWon = true;
      checkRound();
    }

  }

})();
