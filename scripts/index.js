function formatTime(time)
{
  if(time<60)
  {
    return time.toString()+' minutes';
  }
  else
  {
    time=time/60;
    if(time==1.5)
    {
      return '1 and a half hours';
    }
    else
    {
      return time.toString()+' hours';
    }
  }
}

function getState()
{
  log('getState');
  $.getJSON('/getState', gotState);
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
  var time=$('#updateTime').val();
  log('status: '+status);
  log('time: '+time);

  var state={'status': status, 'where': where, 'time': time};
  $.post('/setState', JSON.stringify(state));

  gotState(state);

  return false;
}

function extinguish()
{
  $.post('/setState', JSON.stringify(null));

  gotState(null);

  return false;
}

function initIndex()
{
  $("#tabs").tabs({'cache': true});
  $("#tabs").show();
  $("#people").show();

  $('#updateButton').click(update);
  $('#extinguishButton').click(extinguish);
}

$(document).ready(initIndex);
