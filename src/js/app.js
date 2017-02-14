var forEach = function(arr, func){
   for(var i = 0 ; i < arr.length; i++){
       func(arr[i], i, arr)
   }
}
import {githubApiKey} from '../../secrets.js'
import $ from 'jquery';

if(window.location.hash === ''){
  window.location.hash = 'vicellini'
}

function controllerRouter(){
	var currentRoute = window.location.hash.slice(1);
  var userFetch = $.getJSON(`http://api.github.com/users/${currentRoute}?access_token=${githubApiKey}`)
  var repoFetch = $.getJSON(`http://api.github.com/users/${currentRoute}/repos?access_token=${githubApiKey}`)

  $.when(userFetch, repoFetch).then(function(userData, repoData){
    // console.log(userData, repoData)
    console.log(repoData)
    userInfoEl.innerHTML = `
                              <img class="profile-picture" src="${userData[0].avatar_url}">
                              <h3 class= "user-info__name">${userData[0].name}</h3>
                              <h4 class= "user-info__username">${userData[0].login}</h4>
                              <p class ="bio">${userData[0].bio}</p>
                              <button>Follow</button>
                            </br>
                              <a class="user-block" href="#">Block or report user</a>
                            <hr class="user-break">
                            <ul class="user-info__contact">
                              <li>${userData[0].company}</li>
                              <li>${userData[0].location}</li>
                              <li>${userData[0].email}</li>
                              <li>${userData[0].blog}</li>
                            </ul>`

    var bigHTML = ''
    forEach(repoData[0], function(eachRepo, i){
        var repoHTML= `
                    <div class="repo-list__repo-information">
                      <h4 class="repo-name"><a href="${eachRepo.html_url}" target="_blank">${eachRepo.name}</a></h4>
                      <p class="repo-description">${eachRepo.description}</p>
                      <p class="repo-minor-data">${eachRepo.language} | ${eachRepo.forks} | ${eachRepo.updated_at}</p>
                    </div>`
      bigHTML +=repoHTML
    })
    repoListEl.innerHTML = bigHTML
  })
}

var userInfoEl = document.querySelector('.user-info__personal');
var repoListEl = document.querySelector('.repo-list');
var searchBarEl = document.querySelector('.navbar-left')
var repoSearchBar = document.querySelector('.repo-searchbar__button')
var repoListEl = document.querySelector('.repo-list');


searchBarEl.addEventListener('keypress', function(evt){
  var userSearch = ''
  if(evt.keyCode == 13) {
    userSearch = document.getElementById("searchTxt").value;
    window.location.hash = userSearch;
    controllerRouter();
    document.getElementById("searchTxt").value = '';
    }
})

//I want this to work, but i just can't figure it out....
//
// repoSearchBar.addEventListener('click', function(evt){
//     let userSearch = document.getElementById("repository-search").value;
//     console.log(userSearch)
// })

window.addEventListener('hashchange', controllerRouter())
