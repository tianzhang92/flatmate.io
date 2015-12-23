var request = require('request');

var getPersonality = function(text, callback){
  text = text.replace(/,/g,"%2c").replace(/'/g,"%27").replace(/ /g,"+");
  //console.log(text);
  var readkey = "M8ETRKsy1Ero";
  var typeEI = "myers-briggs-attitude"; //extraversion vs. introversion
  var typeTF = "myers-briggs-judging-function"; // thinking vs. feeling
  var typeSN = "myers-briggs-perceiving-function"; //sensing vs. intuition
  var typeJP = "myers-briggs-lifestyle" //judging vs. perceiving

  var EI,TF,SN,JP;
  var personality = {};

  var urlEI = "https://uclassify.com/browse/prfekt/" + typeEI
          + "/ClassifyText?readkey=" + readkey
          + "&output=json&version=1.01&"
          + "text=" + text;
  var urlTF = "https://uclassify.com/browse/prfekt/" + typeTF
          + "/ClassifyText?readkey=" + readkey
          + "&output=json&version=1.01&"
          + "text=" + text;
  var urlSN = "https://uclassify.com/browse/prfekt/" + typeSN
          + "/ClassifyText?readkey=" + readkey
          + "&output=json&version=1.01&"
          + "text=" + text;
  var urlJP = "https://uclassify.com/browse/prfekt/" + typeJP
          + "/ClassifyText?readkey=" + readkey
          + "&output=json&version=1.01&"
          + "text=" + text;

  request(urlEI, function(err1,response1,body1){
    if (!err1){
      EI = JSON.parse(body1).cls1.Extraversion;
      request(urlTF, function(err2,response2,body2){
        if (!err2){
          TF = JSON.parse(body2).cls1.Thinking;
          request(urlSN, function(err3,response3,body3){
            if (!err3){
              SN = JSON.parse(body3).cls1.Sensing
              request(urlJP, function(err4,response4,body4){
                if (!err4){
                  JP = JSON.parse(body4).cls1.Judging;
                  personality = {
                    'Extraversion':EI,
                    'Thinking':TF,
                    'Sensing':SN,
                    'Judging':JP
                  };
                  callback(null,personality);
                }
                else { callback(err4);}
              });
            }
            else { callback(err3);}
          });
        }
        else { callback(err2);}
      });
    }
    else { callback(err1);}
  });
}

var compare = function(text1, text2, callback){
  getPersonality(text1, function(err1,data1){
    if (!err1){
      getPersonality(text2, function(err2,data2){
        if (!err2){
          var distance = 0;
          var E = Math.pow(data1.Extraversion-data2.Extraversion,2);
          var T = Math.pow(data1.Thinking-data2.Thinking,2);
          var S = Math.pow(data1.Sensing-data2.Sensing,2);
          var J = Math.pow(data1.Judging-data2.Judging,2);
          distance = E+T+S+J;
          distance = Math.sqrt(distance/4);
          var score = Math.round(20*(1-distance));
          // console.log('==========compare============');
          // console.log("text1: " + text1);
          // console.log("text2: " + text2);
          // console.log(E+" "+T+" "+S+" "+J);
          // console.log(distance);
          // console.log(score);
          // console.log('----------compare------------');

          // var data = {
          //   'personality1':data1,
          //   'personality2':data2,
          //   'score':score;
          // }
          callback(null, score);
        }
        else {
          callback(err2);
        }
      });
    }
    else {
      callback(err1);
    }
  });
}


var repeater = function(res,result,myData,i){
  if (i < result.length){
    var herData = result[i];
    //var herData = result[i].toJSON();
    var herAbout = herData.about;
    //var myAbout = myData.about;
    var myAbout = myData.toJSON().about;
    if (herAbout != null && myAbout != null){
      compare(herAbout,myAbout,function(err, addscore){
        if (!err){
          var oldscore = herData.score;
          console.log("PERSONALITY TESTING");
          console.log(addscore);
          var newscore = oldscore + addscore;
          result[i].score = newscore;
        }
        repeater(res,result,myData,i+1);
      })
    }
    else {
      repeater(res,result,myData,i+1);
    }

  }
  if (i == result.length){
    console.log("final result: ");
    console.log(result);
    res.json(result);
  }
}

// var result = [{'about':'go away!!','score':10},
//               {'about':'nice to meet you!','score':20}];
// var myData = {'about': 'bye bye'};
// repeater(null,result,myData,0);

// getPersonality("hi", function(err, data){
//   if (!err){
//     console.log(data);
//   }
// });

 compare("hi","hello", function(err, data){
   if (!err){
     console.log(data);
   }
 });

module.exports = repeater;
