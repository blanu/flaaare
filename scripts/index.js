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
    $('#flareTime').text(result.time);
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
