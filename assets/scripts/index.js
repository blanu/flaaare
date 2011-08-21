function formatTime(time)
{
  var now=new Date().getTime()/(60*1000);
  var utime=Math.round(time-now);
  log('Print Time: '+now+' '+time+' '+utime);

  if(utime<0)
  {
    utime=Math.abs(utime);
  }

  if(utime<60)
  {
    return utime.toString()+' minutes';
  }
  else
  {
    hours=Math.floor(utime/60);
    minutes=Math.round(utime%60);
    if(hours==1.0 && minutes==0.0)
    {
      return '1 hour';
    }
    else if(hours==1.0)
    {
      return hours.toString()+' hour and '+minutes.toString()+' minutes';
    }
    else
    {
      return hours.toString()+' hours and '+minutes.toString()+' minutes';
    }
  }
}

function getState()
{
  log('getState');
  $.getJSON('http://www.flaaare.com/getState', gotState);
}

function gotState(result)
{
  log('gotState');
  log(result);

  if(result==null)
  {
    $('#flares').hide('slow');
    $('#update').show('slow');
  }
  else
  {
    var now=new Date().getTime()/(60*1000);
    var utime=Math.round(result.time-now);
    if(utime>0)
    {
      $('#flareIsWas').text('is');
      $('#flareFor').text('for');
      $('#flareAgo').text('');
    }
    else
    {
      $('#flareIsWas').text('was');
      $('#flareFor').text('');
      $('#flareAgo').text('ago');
    }

    $('#flareStatus').text(result.status);
    $('#flareWhere').text(result.where);
    $('#flareTime').text(formatTime(result.time));
    $('#flares').show('slow');
    $('#update').hide('slow');
  }
}

function update()
{
  var status=$('#updateField').val();
  var where=$('#updateWhere').val();
  var time=parseFloat($('#updateTime').val());
  log('status: '+status);
  log('time: '+time);

  var now=Math.round(new Date().getTime()/(60*1000));
  log('Send Time: '+now+' '+time+' '+(now+time));

  var state={'status': status, 'where': where, 'time': now+time};
  $.post('http://www.flaaare.com/setState', JSON.stringify(state));

  gotState(state);

  return false;
}

function extinguish()
{
  $.post('http://www.flaaare.com/setState', JSON.stringify(null));

  gotState(null);

  return false;
}

function checkPhoneGap()
{
  if(window.location.href.indexOf['file://']==0)
  {
    window.location='http://www.flaaare.com/';
  }
}

function checkMobile()
{
  if(screen.width < 500 ||
   navigator.userAgent.match(/Android/i) ||
   navigator.userAgent.match(/webOS/i) ||
   navigator.userAgent.match(/iPhone/i) ||
   navigator.userAgent.match(/iPod/i))
  {
    return true;
  }
  else
  {
    return false;
  }
}

function initIndex()
{
  checkPhoneGap();
  log('mobile: '+checkMobile());

  $("#tabs").tabs({'cache': true});
  $("#people").show();

  $('#updateButton').click(update);
  $('#extinguishButton').click(extinguish);
}

$(document).ready(initIndex);
