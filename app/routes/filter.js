// gender filter
var genderFilter = function(data, myData) {
  var gender1 = genderMatch(myData[0].toJSON(), data.toJSON());
  var gender2 = genderMatch(data.toJSON(), myData[0].toJSON());
  return gender1 && gender2;
}

// check if data2's gender fits data1's lookingForList
var genderMatch = function(data1, data2) {
  if (data2.gender == null || data1.lookingForList == null) return 1;

  var male = 0;
  var female = 0;

  for (i=0; i<data1.lookingForList.length; i++) {
    if (data1.lookingForList[i] == "Males") male = 1;
    if (data1.lookingForList[i] == "Females") female = 1;
  }

  if ((male && female) || (!male && !female)) return 1;
  if ((male && data2.gender == "male") ||
      (female && data2.gender == "female")) {
        return 1;
      }

  return 0;
}

// profession filter
var professionFilter = function(data, myData) {
  var profession1 = professionMatch(myData[0].toJSON(), data.toJSON());
  var profession2 = professionMatch(data.toJSON(), myData[0].toJSON());
  return profession1 && profession2;
}

// check if data2's profession fits data1's lookingForList
var professionMatch = function(data1, data2) {
  if (data2.linkedin == null || data2.linkedin._json.headline == null || data1.lookingForList == null) return 1;

  var student = 0;
  var professional = 0;

  for (i=0; i<data1.lookingForList.length; i++) {
    if (data1.lookingForList[i] == "Students") student = 1;
    if (data1.lookingForList[i] == "Professionals") professional = 1;
  }

  if ((student && professional) || (!student && !professional)) return 1;

  var profession = [];
  profession = data2.linkedin._json.headline;
  profession = profession.toLowerCase().split(" ");

  var isStudent = 0;
  var isProfessional = 0;

  for (word = 0; word < profession.length; word++) {
    if (profession[word] == "student") {
      isStudent = 1;
    }
  }
  isProfessional = (isStudent) ? 0 : 1;

  if ((student && isStudent) ||
      (professional && isProfessional)) {
        return 1;
      }

  return 0;

}

// location filter
var locationFilter = function(data, myData) {
  var location1 = locationMatch(myData[0].toJSON(), data.toJSON());
  var location2 = locationMatch(data.toJSON(), myData[0].toJSON());
  return location1 && location2;
}

// check if data2's location fits data1's lookingForList
var locationMatch = function(data1, data2) {
  if (data1.location == null || data2.location == null) return 1;

  var city1 = data1.location.toLowerCase().split(",")[0];
  var city2 = data2.location.toLowerCase().split(",")[0];

  if (city1 == city2) {
    return 1;
  }

  return 0;
}

module.exports.genderFilter = genderFilter;
module.exports.professionFilter = professionFilter;
module.exports.locationFilter = locationFilter;
