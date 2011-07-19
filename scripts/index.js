function encode(input)
{
    _keyStr="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var output = "";
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    var i = 0;

    while (i < input.length) {

        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);

        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;

        if (isNaN(chr2)) {
            enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
            enc4 = 64;
        }

        output = output +
        _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
        _keyStr.charAt(enc3) + _keyStr.charAt(enc4);

    }

    return output;
}

function login()
{
  log('get loggedin');
  var url='/loggedin';
  $.getJSON(url, gotLogin);
}

function gotLogin(result)
{
  log('~ got loggedin ~');
  log(result);

  loggedin=result[0];
  log(loggedin);
  log(loggedin==true);

  if(loggedin)
  {
    getContacts();
  }
  else
  {
    log('logging in');
    sessionid=result[1];
    callback='http://www.flaaare.com/';
    url='http://freefallsocial.appspot.com/login/'+sessionid+'/'+encode(callback);
    $('#googleLogin').attr('href', url);
    $('#login').show();
  }
}

function getContacts()
{
  log('get contacts');
  var url='/contacts';
  $.getJSON(url, gotContacts);
}

function gotContacts(contacts)
{
  log('~ got contacts ~');
  log(contacts)
  log('.');
  authed=contacts[0];
  contacts=contacts[1];

  if(!authed)
  {
    $('#importContacts a').attr('href', contacts);
    $('#importContacts').show();
    return;
  }
  else
  {
    $('#importContacts').hide();
  }

  $('.contacts').empty();

  s='<table>';
  for(var x=0; x<contacts.length; x++)
  {
    s=s+'<tr><td>';
    if(typeof(contacts[x].image)!==undefined && contacts[x].image!=null && contacts[x].image!='null')
    {
      s=s+'<td><img src="'+contacts[x].image+'"/></td>';
    }
    else
    {
      s=s+'<td><img src="https://wave.google.com/wave/static/images/unknown.jpg"/></td>';
    }
    s=s+'<td><a class="addParticipantButton" href="#" addr="'+contacts[x].email+'">';
    if(typeof(contacts[x].title)!==undefined && contacts[x].title!=null && contacts[x].title!='null')
    {
      s=s+contacts[x].title;
    }
    else
    {
      s=s+contacts[x].email;
    }
    s=s+'</a></td></tr>';
  }
  s=s+'</table>'
  $('.contacts').append(s);
}

function initIndex()
{
  $("#tabs").tabs({'cache': true});
  $("#tabs").show();
  $("#people").show();

  login();
}

$(document).ready(initIndex);