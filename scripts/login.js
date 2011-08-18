function gotFriends(data)
{
  console.log('gotFriends');
  var now=new Date().getTime()/(60*1000);

  var friends=data.data;
  $('.friends').empty();

  var found=false;

  s='<table>';

  for(var x=0; x<friends.length; x++)
  {
    if(friends[x].data!=null)
    {
      found=true;

      s=s+'<tr><td>';
      if(typeof(friends[x].image)!==undefined && friends[x].image!=null && friends[x].image!='null')
      {
        s=s+'<td><img class="icon" src="'+friends[x].image+'"/></td>';
      }
      else
      {
        s=s+'<td><img class="icon" src="https://wave.google.com/wave/static/images/unknown.jpg"/></td>';
      }

      s=s+'<td>'+friends[x].name+'</td>';

      var utime=Math.round(friends[x].time-now);
      if(utime>0)
      {
        s=s+'<td> is '+friends[x].data.status+' at '+friends[x].data.where+' for '+formatTime(friends[x].data.time)+'</td>';
      }
      else
      {
        s=s+'<td> was '+friends[x].data.status+' at '+friends[x].data.where+formatTime(friends[x].data.time)+' ago</td>';
      }

      s=s+'</tr>';
    }
  }

  s=s+'</table>'

  if(!found)
  {
    s="Nothin' doin'.";
  }

  $('.friends').append(s);
}

function getFriends()
{
  $.getJSON('http://www.flaaare.com/facebook/friends', gotFriends);
}

function refresh()
{
  getState();
  getFriends();
}

function loggedIn(response)
{
  if (!response.session)
  {
    $('#user-info').hide('slow');
    $('#logoutDiv').hide('slow');
    $('#loginDiv').show('slow');
    $('#update').hide('slow');
    $('#flares').hide('slow');
    return;
  }
  else
  {
    $('#user-info').show('slow');
    $('#logoutDiv').show('slow');
    $('#loginDiv').hide('slow');
  }

  FB.api(
    {
      method: 'fql.query',
      query: 'SELECT name, pic FROM profile WHERE id=' + FB.getSession().uid
    },
    function(response) {
      var user = response[0];
     $('#user-info').html('<img class="icon" src="' + user.pic + '">' + user.name).show('slow');
    }
  );

  refresh();
  window.setInterval(refresh, 60*1000);
}

function login()
{
  $('#user-info').hide('slow');
  $('#logoutDiv').hide('slow');
  $('#loginDiv').hide('slow');

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
