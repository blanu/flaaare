function gotFriends(data)
{
  console.log('gotFriends');
  console.log(data);

  var friends=data.data;
  for(x in friends)
  {
    console.log(friends[x].name);
  }

  $('.friends').empty();

  s='<table>';
  for(var x=0; x<friends.length; x++)
  {
    s=s+'<tr><td>';
    if(typeof(friends[x].image)!==undefined && friends[x].image!=null && friends[x].image!='null')
    {
      s=s+'<td><img src="'+friends[x].image+'"/></td>';
    }
    else
    {
      s=s+'<td><img class="unknownIcon" src="https://wave.google.com/wave/static/images/unknown.jpg"/></td>';
    }
    s=s+'<td>'+friends[x].name+'</td>';
    s=s+'</tr>';
  }
  s=s+'</table>'
  $('.friends').append(s);
}

function loggedIn(response)
{
  if (!response.session)
  {
    $('#user-info').hide('fast');
    $('#logoutDiv').hide('fast');
    $('#loginDiv').show('fast');
    return;
  }
  else
  {
    $('#user-info').show('fast');
    $('#logoutDiv').show('fast');
    $('#loginDiv').hide('fast');
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
  $('#user-info').hide('fast');
  $('#logoutDiv').hide('fast');
  $('#loginDiv').hide('fast');

  FB.init({ apiKey: '248930761793687', status: true, cookie: true, xfbml: true });
  FB.getLoginStatus(loggedIn);

  $('#login').bind('click', function() {
    FB.login(loggedIn);
  });

  $('#logout').bind('click', function() {
    FB.logout(loggedIn);
  });
}

$(document).ready(login);
