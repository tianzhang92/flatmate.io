
var getScore = function(data, myData){

  //=================Begin of self-defined matching algorithm==================
  // matching score
  var score = 0;
  // matching info
  var match = {
    username: data.toJSON().username,
    userid: data.toJSON().userid,
    location: data.toJSON().location,
    score: 0,
    criteria: [],
    about: data.toJSON().about
  }

  // 1. price: if two people have overlap in price range
  if(myData[0].toJSON().priceLow != null
    && myData[0].toJSON().priceHigh != null
    && data.toJSON().priceLow != null
    && data.toJSON().priceHigh != null)
  {
    if(myData[0].toJSON().priceLow < data.toJSON().priceHigh &&
       myData[0].toJSON().priceHigh > data.toJSON().priceLow)
    {
      match.score += 10;
      match.criteria.push('Agree on price range');
    }
  }

  // 2. currentCity
  if(myData[0].toJSON().currentCity != null
    && myData[0].toJSON().currentCity.name != null
    && data.toJSON().currentCity != null
    && data.toJSON().currentCity.name != null)
  {
    var myWords = [];
    myWords = myData[0].toJSON().currentCity.name
              .toLowerCase()
              .split(",");
    var friendWords = [];
    friendWords = data.toJSON().currentCity.name
              .toLowerCase()
              .split(",");
    // if they live in the same current city
    if (myWords[0] == friendWords[0]) {
      match.score += 10;
      match.criteria.push('Live in the same current city');
    }
  }

  // 3. hometown
  if(myData[0].toJSON().hometown != null
    && myData[0].toJSON().hometown.name != null
    && data.toJSON().hometown != null
    && data.toJSON().hometown.name != null)
  {
    myWords = [];
    myWords = myData[0].toJSON().hometown.name
              .toLowerCase()
              .split(",");
    friendWords = [];
    friendWords = data.toJSON().hometown.name
              .toLowerCase()
              .split(",");
    // if they have the same hometown
    if (myWords[0] == friendWords[0]) {
      match.score += 10;
      match.criteria.push('Have the same hometown');
    }
  }

  // 4. location
  if(myData[0].toJSON().location != null
    && data.toJSON().location != null)
  {
    myWords = [];
    myWords = myData[0].toJSON().location
              .toLowerCase()
              .split(",");
    friendWords = [];
    friendWords = data.toJSON().location
              .toLowerCase()
              .split(",");
    // if they write the same location in profile
    if (myWords[0] == friendWords[0]) {
      match.score += 10;
      match.criteria.push('Live in the same city');
    }
    if (myWords[1] == friendWords[1]) {
      match.score += 5;
      match.criteria.push('Live in the same state');
    }
  }

  // 5. age
  if(myData[0].toJSON().birthday != null
    && data.toJSON().birthday != null)
  {
    var myBirthDate = [];
    myBirthDate = myData[0].toJSON().birthday
              .toLowerCase()
              .split("/");
    var birthDate = [];
    birthDate = data.toJSON().birthday
              .toLowerCase()
              .split("/");
    // if their  age difference is less than 3 years old
    if (Math.abs(myBirthDate[2] - birthDate[2]) <= 3) {
      match.score += 10;
      match.criteria.push('Close to same age');
    }
  }

  // 6. education
    if(myData[0].toJSON().education != null
      && data.toJSON().education != null)
    {
      var found = false;
      // if they are ever in the same school
      for (i = 0; i < myData[0].toJSON().education.length; i++) {
        for (j = 0; j < data.toJSON().education.length; j++) {
          if (myData[0].toJSON().education[i].school.id == data.toJSON().education[j].school.id) {
            match.score += 10;
            found = true;
          }
        }
      }
      if(found) match.criteria.push('Went to the same school');
    }

  // 7. work
  if(myData[0].toJSON().work != null
    && data.toJSON().work != null)
  {
    var found = false;
    // if they are ever in the same company
    for (i = 0; i < myData[0].toJSON().work.length; i++) {
      for (j = 0; j < data.toJSON().work.length; j++) {
        if (myData[0].toJSON().work[i].employer.id == data.toJSON().work[j].employer.id) {
          match.score += 10;
          found = true;
        }
      }
    }
    if(found) match.criteria.push('Worked for the same company');
  }

  // 8. likes
  if(myData[0].toJSON().likes != null
    && data.toJSON().likes != null)
  {
    var found = false;
    // if they have the same like
    for (i = 0; i < myData[0].toJSON().likes.data.length; i++) {
      for (j = 0; j < data.toJSON().likes.data.length; j++) {
        if (myData[0].toJSON().likes.data[i].id == data.toJSON().likes.data[j].id) {
          match.score += 1;
          found = true;
        }
      }
    }
    if(found) match.criteria.push('Like the same things on Facebook');
  }

  // 9. friends
  if(myData[0].toJSON().friends != null
    && data.toJSON().friends != null)
  {
    // if they are friends
    for (i = 0; i < myData[0].toJSON().friends.data.length; i++) {
      if (myData[0].toJSON().friends.data[i].id == data.toJSON().userid) {
        match.score += 10;
        match.criteria.push('Facebook friends');
      }
    }
  }

// end of Facebook API
// start of Linkedin API

  // 10. industry
  if(myData[0].toJSON().linkedin != null
    && data.toJSON().linkedin != null)
  {
    // if they are in the same industry
    if (myData[0].toJSON().linkedin._json.industry != null &&
        data.toJSON().linkedin._json.industry != null) {
      if (myData[0].toJSON().linkedin._json.industry == data.toJSON().linkedin._json.industry) {
        match.score += 10;
        match.criteria.push('Work in the same industry');
      }
    }
  }

  // 12. positions
  if(myData[0].toJSON().linkedin != null
    && data.toJSON().linkedin != null)
  {
    // if they have worked in the same company or as same profession
    if (myData[0].toJSON().linkedin._json.location &&
        data.toJSON().linkedin._json.location &&
        myData[0].toJSON().linkedin._json.location.name &&
        data.toJSON().linkedin._json.location.name) {
          if(myData[0].toJSON().linkedin._json.location.name === data.toJSON().linkedin._json.location.name){
            match.score += 10;
            match.criteria.push('Work in the same location');
          }
    }

  }

  return match;
  // =================End of self-defined matching algorithm==================


}

module.exports = getScore;
