var length=0;
var display = [];
var result = [];
var myString='';
var resultImage = document.getElementsByClassName('content')[0];
(function dom() {
    var searchForm = document.getElementById('main');
    var body = document.getElementsByTagName('body')[0];
    var mainContent = document.getElementsByClassName('container2')[0];
    var pages = document.getElementsByClassName('pagination')[0];
    if (searchForm) {
    searchForm.addEventListener('submit', function(event){
      event.preventDefault();
      var searchValue = event.target.firstElementChild.value.toLowerCase();
      setTimeout(function(){
          getResult(searchValue, function(search) {
            if (search.status == 1) {
              length= (search.images.length)/10;
              var text="";
              for (i = 1; i <= length; i++) {
                if (i===1) {
                  text += `<a class="pageNo active" href="#" onclick="changePage(${i})" >${i}</a>`;

                } if (i>1) {
                  text += `<a class="pageNo" href="#" onclick="changePage(${i})" >${i}</a>`;

                }
              }
              pages.innerHTML=text;

              display = search.images;
              result= display.slice(1, 10);
              myString = result.reduce(function (acc, cur) {
                return acc+=`<img onclick="overlay('${cur.image}')" class="resultImg" src="${cur.image}" alt="${cur.title}">`;
              }, '');
              resultImage.innerHTML=myString;
            }else {
              mainContent.innerHTML = '<p id="searchNotFount">'+ searchValue +' Not Found ! , Are you sure you using the right spilling </p>'+
                                      '<br/><p></p>';
            }

          });
      }, 0);
    });
  }
})();

function getResult(searchValue , fn) {
  var xhr = new XMLHttpRequest();
  var out = {};
  var url = "https://api.flickr.com/services/rest/?method=flickr.photos.search&tags=" + searchValue + "&per_page=100&api_key=c48c0eee6d23486475bd28a5cf3d1e43&format=json&nojsoncallback=%3F";
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
      var result = JSON.parse(xhr.responseText);
      var images = [];
      if (result.photos.photo.length>0){
        out.status=1;
        result.photos.photo.map(function(myData) {
          images.push({image :"https://c1.staticflickr.com/" + myData.farm + "/" + myData.server+ "/" + myData.id + "_" +myData.secret + ".jpg", title: myData.title});
        })
        out.images=images;
      }
      else {
        out.status=0;
      }
      console.log(fn);
    fn(out);
    }
  };
  xhr.open("GET", url, true);
  xhr.send();
  return out;
}

function changePage(i) {
    result=display.slice((i-1)*10, i*10);
    myString = result.reduce(function (acc, cur) {
      return acc+=`<img class="resultImg" src="${cur.image}" alt="${cur.title}">`;
    }, '');
    for (i = 1; i <= length; i++) {
      var pageNumber = document.getElementsByClassName('pageNo')[i-1];
      pageNumber.classList.remove('active');
      console.log('hahana',pageNumber);
    }
    event.target.classList.add('active');
    return resultImage.innerHTML=myString;
}
function overlay(src) {
    document.getElementById("overlay").style.display = "flex";
    document.getElementById("overlay").innerHTML = `<img class="overlayImg" src="${src}" alt="overlay">`;
}
function off() {
    document.getElementById("overlay").style.display = "none";
}
