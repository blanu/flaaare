var timer=null;

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
      var utime=Math.round(friends[x].data.time-now);
      if(utime<-1440)
      {
        continue;
      }

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

      if(utime>0)
      {
        s=s+'<td> is '+friends[x].data.status+' at '+friends[x].data.where+' for '+formatTime(friends[x].data.time)+'</td>';
      }
      else
      {
        s=s+'<td> was '+friends[x].data.status+' at '+friends[x].data.where+' '+formatTime(friends[x].data.time)+' ago</td>';
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

function get_cookies_array()
{
  var cookies = { };
  if (document.cookie && document.cookie != '')
  {
    var split = document.cookie.split(';');
    for (var i = 0; i < split.length; i++)
    {
      var name_value = split[i].split("=");
      name_value[0] = name_value[0].replace(/^ /, '');
      cookies[decodeURIComponent(name_value[0])] = decodeURIComponent(name_value[1]);
    }
  }

  return cookies;
}

function initLogin()
{
  log('initLogin');
  if(timer!=null)
  {
    window.clearInterval(timer);
  }

  $('#user-info').show('slow');
  $('#loginDiv').hide('slow');
  $('#tabs').show('slow');
  $('#people').show('slow');
  $('#bookmark').show('slow');
  $('#like').show('slow');
  $('#invite').show('slow');

  // Don't show logout button when browsing from inside of Facebook
  if(!checkEmbed())
  {
    $('#logoutDiv').show('slow');
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

function initLogout()
{
  log('initLogout');
  if(timer!=null)
  {
    window.clearInterval(timer);
  }

  $('#user-info').hide('slow');
  $('#logoutDiv').hide('slow');
  $('#loginDiv').show('slow');
  $('#update').hide('slow');
  $('#flares').hide('slow');
  $('#tabs').hide('slow');
  $('#people').hide('slow');
  $('#bookmark').hide('slow');
  $('#like').hide('slow');
  $('#invite').hide('slow');

  timer=window.setInterval(checkLoggedIn, 1000);

  login();
}

function checkLoggedIn()
{
  log('checking logged in...');
  var cookies = get_cookies_array();
  for(var name in cookies)
  {
    if(name.indexOf('fbs_')==0)
    {
      if(timer!=null)
      {
        log('logged in!');
        window.clearInterval(timer);
        initLogin();
      }
      break;
    }
  }
}

function loggedIn(response)
{
  if (!response.session)
  {
    initLogout();
  }
  else
  {
    initLogin();
  }
}

function login()
{
  log('login');
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
