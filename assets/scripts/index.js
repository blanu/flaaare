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

function initIndex()
{
  $("#tabs").tabs({'cache': true});
  $("#people").show();

  $('#updateButton').click(update);
  $('#extinguishButton').click(extinguish);
}

$(document).ready(initIndex);