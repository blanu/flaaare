function clearDisplay()
{
  $('#user-info').hide('fast');
}

function gotFriends(data)
{
  console.log('gotFriends');
  console.log(data);

  var friends=data.data;
  for(x in friends)
  {
    console.log(friends[x].name);
  }
}

function loggedIn(response)
{
  if (!response.session)
  {
    clearDisplay();
    return;
  }

  FB.api(
    {
      method: 'fql.query',
      query: 'SELECT name, pic FROM profile WHERE id=' + FB.getSession().uid
    },
    function(response) {
      var user = response[0];
     $('#user-info').html('<img src="' + user.pic + '">' + user.name).show('fast');
    }
  );

  $.getJSON('http://www.flaaare.com/facebook/friends', gotFriends);
}

function login()
{
  FB.init({ apiKey: '248930761793687', status: true, cookie: true, xfbml: true });
  FB.getLoginStatus(loggedIn);

  $('#login').bind('click', function() {
    FB.login(handleSessionResponse);
  });

  $('#logout').bind('click', function() {
    FB.logout(handleSessionResponse);
  });

  $('#disconnect').bind('click', function() {
    FB.api({ method: 'Auth.revokeAuthorization' }, function(response) {
      clearDisplay();
    });
  });
}

$(document).ready(login);
